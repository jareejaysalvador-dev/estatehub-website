import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FeaturedItem } from "@/lib/featured";
import { development, listing } from "@/lib/featured.fixtures";
import { getAllPropertyGridItems } from "@/sanity/queries";
import { GET } from "./route";

// Sanity is a network service, so the query layer is the one thing replaced.
vi.mock("@/sanity/queries", () => ({ getAllPropertyGridItems: vi.fn() }));

const queryItems = vi.mocked(getAllPropertyGridItems);

describe("GET /api/featured", () => {
  beforeEach(() => {
    queryItems.mockReset();
  });

  it("returns the first four items as cards, with CDN cache headers", async () => {
    queryItems.mockResolvedValue([
      listing({ slug: "l1" }),
      development({ slug: "d1" }),
      listing({ slug: "l2" }),
      listing({ slug: "l3" }),
      listing({ slug: "l4" }),
    ]);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("public, s-maxage=300, stale-while-revalidate=600");
    const cards: FeaturedItem[] = await res.json();
    expect(cards.map((c) => c.href)).toEqual([
      "/properties/l1",
      "/developments/d1",
      "/properties/l2",
      "/properties/l3",
    ]);
  });

  it("answers 200 with an empty list when there is nothing to feature", async () => {
    queryItems.mockResolvedValue([]);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("answers 503 with an uncached empty list when Sanity fails", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    queryItems.mockRejectedValue(new Error("Sanity unreachable"));

    const res = await GET();

    expect(res.status).toBe(503);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual([]);
    expect(errorLog).toHaveBeenCalledOnce();
    errorLog.mockRestore();
  });
});
