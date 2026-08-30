import { createClient } from "@supabase/supabase-js";

// Server-only: SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY have no NEXT_PUBLIC_
// prefix, so they never reach the browser bundle. The publishable key is
// safe to expose by design (Stripe-style, gated by RLS, not by secrecy),
// but this stays server-side anyway for consistency with the rest of the
// site's zero-admin-surface architecture - callers should route through
// an API route rather than importing this into a Client Component.
export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// service_role, not the publishable key - bypasses RLS entirely. Used in
// exactly one place (the /api/leads-sync route, for the Apps Script leads
// sync) since UrlFetchApp's fixed User-Agent gets flagged by Supabase's
// secret-key-in-browser guard and can't call Supabase directly. Kept as
// its own narrow function rather than a generic "admin client" export so
// this credential's one legitimate use stays easy to audit.
export async function fetchLeadsSinceId(sinceId: number) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  const columns =
    "id,created_at,first_name,last_name,phone,email,property_interest,source,notes,regarding_property,booking_token";
  const response = await fetch(
    `${url}/rest/v1/leads?id=gt.${sinceId}&order=id.asc&select=${columns}`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  return response.json();
}

// service_role again, for the same reason: this needs to definitely reach
// Supabase regardless of RLS, and the publishable key can only insert into
// leads, not read it. Used solely by /api/keep-alive (Vercel Cron) to stop
// the free-tier project from auto-pausing after 7 days with no API
// activity - the query itself is throwaway, only the request reaching
// Supabase matters.
export async function pingDatabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return false;

  const response = await fetch(`${url}/rest/v1/leads?select=id&limit=1`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  return response.ok;
}

export interface LeadPrefill {
  first_name: string;
  last_name: string;
  phone: string;
  regarding_property: string | null;
}

// service_role again: the viewing booking form needs to read a lead's
// prefill fields by its public token, and the anon/publishable key can't
// select from leads at all under the current RLS policy. Returns null when
// Supabase isn't configured (matches fetchLeadsSinceId's convention),
// undefined when the token itself doesn't match any lead - the route
// distinguishes a real 500 from a plain 404 using that difference.
export async function getLeadByToken(token: string): Promise<LeadPrefill | null | undefined> {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  const response = await fetch(
    `${url}/rest/v1/leads?booking_token=eq.${encodeURIComponent(token)}&select=first_name,last_name,phone,regarding_property`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  const rows: LeadPrefill[] = await response.json();
  return rows[0] ?? undefined;
}

export interface ViewingDetails {
  viewingDate: string;
  viewingTime: string;
  viewingProperty: string;
  viewersCount: number | null;
  phone: string;
}

export interface SavedViewingLead {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Same service_role/token pattern as getLeadByToken, for the same reason -
// the anon key can insert into leads but not update it. Uses
// Prefer: return=representation so the updated row (needed for the two
// confirmation emails) comes back in the same round trip as the write.
export async function saveViewingDetails(
  token: string,
  details: ViewingDetails,
): Promise<SavedViewingLead | null | undefined> {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  const response = await fetch(`${url}/rest/v1/leads?booking_token=eq.${encodeURIComponent(token)}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      viewing_date: details.viewingDate,
      viewing_time: details.viewingTime,
      viewing_property: details.viewingProperty,
      viewing_viewers_count: details.viewersCount,
      viewing_booked_at: new Date().toISOString(),
      phone: details.phone,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  const rows: SavedViewingLead[] = await response.json();
  return rows[0] ?? undefined;
}

export interface ViewingUpdate {
  id: number;
  viewing_date: string;
  viewing_time: string;
  viewing_booked_at: string;
}

// service_role, for the Sheet sync's second sync pass: finds leads whose
// viewing was booked after a given timestamp, so Code.gs can flip their
// existing row's Pipeline Status from "Contacted" to "Viewing" without
// re-scanning the whole table every run.
export async function fetchViewingUpdatesSince(sinceIso: string) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  const response = await fetch(
    `${url}/rest/v1/leads?viewing_booked_at=gt.${encodeURIComponent(sinceIso)}&order=viewing_booked_at.asc&select=id,viewing_date,viewing_time,viewing_booked_at`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<ViewingUpdate[]>;
}
