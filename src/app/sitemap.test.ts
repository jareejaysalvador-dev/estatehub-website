import { describe, expect, it, vi } from "vitest";
import { getAllDevelopmentSlugs, getAllListingSlugs } from "@/sanity/queries";
import sitemap from "./sitemap";

// Sanity is a network service, so the query layer is the one thing replaced.
vi.mock("@/sanity/queries", () => ({
  getAllListingSlugs: vi.fn(),
  getAllDevelopmentSlugs: vi.fn(),
}));

const CANONICAL_HOST = "https://www.estatehub.ph";

describe("sitemap", () => {
  it("lists every page on the www host, where the bare domain redirects", async () => {
    vi.mocked(getAllListingSlugs).mockResolvedValue(["a-listing"]);
    vi.mocked(getAllDevelopmentSlugs).mockResolvedValue(["a-development"]);

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toContain(`${CANONICAL_HOST}/properties/a-listing`);
    expect(urls).toContain(`${CANONICAL_HOST}/developments/a-development`);
    const offHost = urls.filter(
      (url) => url !== CANONICAL_HOST && !url.startsWith(`${CANONICAL_HOST}/`),
    );
    expect(offHost).toEqual([]);
  });
});
