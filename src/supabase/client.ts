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
