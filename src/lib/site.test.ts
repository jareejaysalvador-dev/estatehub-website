import { afterEach, describe, expect, it, vi } from "vitest";

// SITE_URL is read from the environment once, when the module is first evaluated,
// so the case clears the module cache and imports it fresh with the variable unset.
describe("SITE_URL", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
    vi.resetModules();
  });

  it("defaults to the www host, because the bare domain redirects there", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();

    const { SITE_URL } = await import("./site");

    expect(SITE_URL).toBe("https://www.estatehub.ph");
  });
});
