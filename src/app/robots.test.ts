import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("points crawlers at the sitemap on the www host, where the bare domain redirects", () => {
    expect(robots().sitemap).toBe("https://www.estatehub.ph/sitemap.xml");
  });
});
