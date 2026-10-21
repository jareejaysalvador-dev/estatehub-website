import { NextResponse } from "next/server";
import { getAllPropertyGridItems } from "@/sanity/queries";
import { toFeaturedItems } from "@/lib/featured";

// The homepage is a static file (public/home.html) and cannot render CMS
// content on the server, so it fetches its "Featured properties" row from
// here after load. Same query layer and same newest-first rule as
// /properties. Vercel's CDN caches the response for five minutes, so Sanity
// is not hit once per visitor.
export const dynamic = "force-dynamic";

const CACHE = "public, s-maxage=300, stale-while-revalidate=600";

export async function GET() {
  try {
    const items = await getAllPropertyGridItems();
    return NextResponse.json(toFeaturedItems(items), {
      headers: { "Cache-Control": CACHE },
    });
  } catch (error) {
    console.error("[featured] Sanity query failed.", error);
    return NextResponse.json([], {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
