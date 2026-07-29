import { NextResponse } from "next/server";

// Security-spec-compliant inquiry handler:
// - allowlisted enums, length caps, header-injection stripping
// - honeypot + minimum-time-to-submit spam checks (both fail silently as
//   if successful, so bots don't learn to adapt)
// - in-memory rate limit: fine for a single dev/local instance; a real
//   multi-instance deployment needs a shared store (e.g. Upstash, Vercel
//   KV), not this Map. Flagged, not solved, per the security spec's
//   "architecture-pending" list.
// - no destination is configured yet (no email/CRM credentials exist per
//   the build plan's explicit exclusions) - inquiries are logged
//   server-side and the API honestly reports delivered:false so the UI
//   can show the Messenger/email fallback rather than a fake success.

const INTENTS = ["buy", "rent", "sell", "manage", "business", "overseas"] as const;
const CHANNELS = ["email", "phone", "messenger"] as const;
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
  const preferredChannel = String(body.preferredChannel ?? "");
  const name = stripHeaderInjection(String(body.name ?? "")).slice(0, 120);
  const email = stripHeaderInjection(String(body.email ?? "")).slice(0, 200);
  const phone = stripHeaderInjection(String(body.phone ?? "")).slice(0, 40);
  const preferredTime = stripHeaderInjection(String(body.preferredTime ?? "")).slice(0, 160);
  const message = String(body.message ?? "").slice(0, 2000);
  const property = stripHeaderInjection(String(body.property ?? "")).slice(0, 120);

  const errors: Record<string, string> = {};
  if (!INTENTS.includes(intent as (typeof INTENTS)[number])) {
    errors.intent = "Choose what you'd like help with.";
  }
  if (!name) {
    errors.name = "Enter your name.";
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (preferredChannel && !CHANNELS.includes(preferredChannel as (typeof CHANNELS)[number])) {
    errors.preferredChannel = "Choose a valid contact channel.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const destination = process.env.INQUIRY_WEBHOOK_URL;

  if (!destination) {
    console.log("[inquiry] no INQUIRY_WEBHOOK_URL configured, received:", {
      intent,
      name,
      email,
      phone,
      preferredChannel,
      preferredTime,
      property,
      messageLength: message.length,
    });
    return NextResponse.json({ delivered: false });
  }

  try {
    const forwarded = await fetch(destination, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent,
        name,
        email,
        phone,
        preferredChannel,
        preferredTime,
        property,
        message,
      }),
    });
    return NextResponse.json({ delivered: forwarded.ok });
  } catch {
    return NextResponse.json({ delivered: false });
  }
}
