const RESEND_API_URL = "https://api.resend.com/emails";

// Server-only: RESEND_API_KEY has no NEXT_PUBLIC_ prefix, so it never
// reaches the browser bundle. Unlike the Supabase publishable key, this
// one is a genuine secret - it can send email as estatehub.ph to anyone.
// Uses Resend's REST API directly (no SDK dependency) - request shape
// verified against the real API before this was written.
export async function sendEmail(params: {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      ...(params.replyTo ? { reply_to: params.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }

  return response.json() as Promise<{ id: string }>;
}
