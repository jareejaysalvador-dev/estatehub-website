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
    "id,created_at,first_name,last_name,phone,email,property_interest,source,notes";
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
