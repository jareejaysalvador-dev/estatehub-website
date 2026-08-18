import { NextResponse } from "next/server";
import { fetchLeadsSinceId } from "@/supabase/client";

// Internal-only endpoint for the Apps Script -> Google Sheet leads sync
// (see C:\Users\jaree\Documents\estatehub-leads-sheet-sync on the owner's
// machine - not part of this repo). Exists because Google Apps Script's
// UrlFetchApp can't call Supabase's REST API with the service_role key
// directly: Supabase's secret-key browser guard flags UrlFetchApp's fixed,
// non-overridable User-Agent as a browser and rejects the request.
//
// The real service_role key lives only here, server-side. Apps Script
// itself only ever holds LEADS_SYNC_SECRET - a separate, narrow token
// that authenticates to this one endpoint and nothing else - so the
// actual database credential never touches Apps Script's storage.
export async function GET(request: Request) {
  const providedSecret = request.headers.get("x-sync-secret");
  const expectedSecret = process.env.LEADS_SYNC_SECRET;

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sinceIdParam = new URL(request.url).searchParams.get("since_id") ?? "0";
  const sinceId = Number(sinceIdParam);
  if (!Number.isFinite(sinceId) || sinceId < 0) {
    return NextResponse.json({ error: "Invalid since_id." }, { status: 400 });
  }

  try {
    const leads = await fetchLeadsSinceId(sinceId);
    if (leads === null) {
      console.error("[leads-sync] Supabase service-role credentials are not configured.");
      return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
    }
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[leads-sync] Failed to fetch leads:", error);
    return NextResponse.json({ error: "Upstream request failed." }, { status: 502 });
  }
}
