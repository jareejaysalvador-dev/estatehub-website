import { NextResponse } from "next/server";
import { pingDatabase } from "@/supabase/client";

// Vercel Cron (see vercel.json), once daily. Supabase's free tier pauses a
// project after 7 days with no API activity - this exists purely to keep
// pinging it, independent of whether the separate Apps Script digest
// (which also hits Supabase, but lives outside this repo on the owner's
// machine) keeps running. Vercel signs cron-triggered requests with a
// bearer token matching CRON_SECRET; reject anything else so this can't
// be triggered publicly.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await pingDatabase();
  if (!ok) {
    console.error("[keep-alive] Supabase ping failed.");
    return NextResponse.json({ error: "Ping failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
