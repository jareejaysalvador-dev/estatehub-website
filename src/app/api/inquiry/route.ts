import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/supabase/client";

// Security-spec-compliant inquiry handler:
// - allowlisted enums, length caps, header-injection stripping
// - honeypot + minimum-time-to-submit spam checks (both fail silently as
//   if successful, so bots don't learn to adapt)
// - in-memory rate limit: fine for a single dev/local instance; a real
//   multi-instance deployment needs a shared store (e.g. Upstash, Vercel
//   KV), not this Map. Flagged, not solved, per the security spec's
//   "architecture-pending" list.
// - inserts directly into Supabase (the `leads` table) using the
//   publishable key server-side; a public insert-only RLS policy on that
//   table is what actually gates this, not key secrecy. Supersedes the
//   earlier INQUIRY_WEBHOOK_URL/GHL forwarding design - Supabase is now
//   the permanent lead destination, not GHL.

const INTENTS = ["buy", "rent", "sell", "manage", "business", "overseas"] as const;
const MIN_SUBMIT_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const rateLimitStore = new Map<string, number[]>();

function stripHeaderInjection(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitStore.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  hits.push(now);
  rateLimitStore.set(ip, hits);
  return hits.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot + timing: real users never fill "company" or submit instantly.
  // Respond as if successful so bots gain no signal.
  const honeypot = typeof body.company === "string" ? body.company : "";
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  const elapsed = Date.now() - startedAt;
  if (honeypot.length > 0 || elapsed < MIN_SUBMIT_MS) {
    return NextResponse.json({ delivered: false, spamSuppressed: true });
  }

  const intent = String(body.intent ?? "");
  const firstName = stripHeaderInjection(String(body.firstName ?? "")).slice(0, 80);
  const lastName = stripHeaderInjection(String(body.lastName ?? "")).slice(0, 80);
  const email = stripHeaderInjection(String(body.email ?? "")).slice(0, 200);
  const phone = stripHeaderInjection(String(body.phone ?? "")).slice(0, 40);
  const message = String(body.message ?? "").slice(0, 2000);
  const listingTitle = stripHeaderInjection(String(body.listingTitle ?? "")).slice(0, 200);

  const errors: Record<string, string> = {};
  if (!INTENTS.includes(intent as (typeof INTENTS)[number])) {
    errors.intent = "Choose what you'd like help with.";
  }
  if (!firstName) {
    errors.firstName = "Enter your first name.";
  }
  if (!lastName) {
    errors.lastName = "Enter your last name.";
  }
  if (!phone) {
    errors.phone = "Enter your phone number.";
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error("[inquiry] SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not configured.");
    return NextResponse.json({ delivered: false }, { status: 500 });
  }

  // Zero real listings exist yet, so this is a no-op today - kept so the
  // context isn't silently dropped once real inventory lands, without
  // needing a dedicated column for it.
  const notes = listingTitle ? `Regarding: ${listingTitle}\n\n${message}` : message;

  const { error } = await supabase.from("leads").insert({
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    source: "Website Contact Form",
    property_interest: intent,
    notes: notes || null,
  });

  if (error) {
    console.error("[inquiry] Supabase insert failed:", error.message);
    return NextResponse.json({ delivered: false }, { status: 502 });
  }

  return NextResponse.json({ delivered: true });
}
