import { describe, expect, it } from "vitest";
import { cardImageUrl, FEATURED_COUNT, toFeaturedItems } from "./featured";
import { development, listing } from "./featured.fixtures";

describe("toFeaturedItems", () => {
  it("maps a For Sale listing to a card", () => {
    const [card] = toFeaturedItems([listing()]);
    expect(card).toEqual({
      kind: "listing",
      slug: "cypress-house",
      href: "/properties/cypress-house",
      title: "Cypress House",
      location: "Lipa, Batangas",
      tag: "For Sale",
      priceText: "₱12,500,000",
      imageUrl:
        "https://cdn.sanity.io/images/0wtk03lk/production/abc-1600x1200.jpg?w=800&fit=max&auto=format",
      imageAlt: "Front of the house",
    });
  });

  it("marks a lease with the monthly price", () => {
    const [card] = toFeaturedItems([listing({ status: "For Lease", price: 45000 })]);
    expect(card.tag).toBe("For Lease");
    expect(card.priceText).toBe("₱45,000 / mo");
  });

  it("maps a development to a Pre-selling card with a From price", () => {
    const [card] = toFeaturedItems([development()]);
    expect(card.kind).toBe("development");
    expect(card.href).toBe("/developments/terreno-south");
    expect(card.tag).toBe("Pre-selling");
    expect(card.priceText).toBe("From ₱8,900,000");
  });

  it("shows a price range when priceTo differs", () => {
    const [card] = toFeaturedItems([development({ priceTo: 14200000 })]);
    expect(card.priceText).toBe("₱8,900,000 – ₱14,200,000");
  });

  it("returns null image fields when there is no photo", () => {
    const [card] = toFeaturedItems([listing({ photos: [] })]);
    expect(card.imageUrl).toBeNull();
    expect(card.imageAlt).toBe("");
  });

  it("shows a From price when priceTo equals priceFrom", () => {
    const [card] = toFeaturedItems([development({ priceTo: 8900000 })]);
    expect(card.priceText).toBe("From ₱8,900,000");
  });

  it("keeps the input order and takes only the first four", () => {
    // The input is deliberately not sorted by slug, title or createdAt in either direction,
    // so a re-sort inside toFeaturedItems (the query layer owns ordering) would change the result.
    const input = [
      { slug: "m-first", title: "M", createdAt: "2026-02-01T00:00:00Z" },
      { slug: "z-second", title: "Z", createdAt: "2026-01-01T00:00:00Z" },
      { slug: "b-third", title: "B", createdAt: "2026-04-01T00:00:00Z" },
      { slug: "q-fourth", title: "Q", createdAt: "2026-03-01T00:00:00Z" },
      { slug: "a-fifth", title: "A", createdAt: "2026-05-01T00:00:00Z" },
      { slug: "c-sixth", title: "C", createdAt: "2026-06-01T00:00:00Z" },
    ].map((overrides) => listing(overrides));
    const cards = toFeaturedItems(input);
    expect(cards).toHaveLength(FEATURED_COUNT);
    expect(cards.map((c) => c.slug)).toEqual(["m-first", "z-second", "b-third", "q-fourth"]);
  });

  it("leaves the price empty when the CMS only holds a placeholder amount", () => {
    // Sanity requires a positive price, so unpriced entries carry a placeholder such as 1.
    const [sale] = toFeaturedItems([listing({ price: 1 })]);
    expect(sale.priceText).toBe("");
    const [pre] = toFeaturedItems([development({ priceFrom: 1 })]);
    expect(pre.priceText).toBe("");
  });

  it("treats 999 as a placeholder and 1,000 as a real price", () => {
    const [placeholder] = toFeaturedItems([listing({ status: "For Lease", price: 999 })]);
    expect(placeholder.priceText).toBe("");
    const [real] = toFeaturedItems([listing({ status: "For Lease", price: 1000 })]);
    expect(real.priceText).toBe("\u20B11,000 / mo");
  });

  it("encodes the slug in the href", () => {
    const [card] = toFeaturedItems([listing({ slug: "unit 7b" })]);
    expect(card.href).toBe("/properties/unit%207b");
  });
});

describe("cardImageUrl", () => {
  it("replaces the width parameter", () => {
    expect(cardImageUrl("https://cdn.sanity.io/x.jpg?w=1600&fit=max")).toBe(
      "https://cdn.sanity.io/x.jpg?w=800&fit=max",
    );
  });

  it("adds the width parameter when missing", () => {
    expect(cardImageUrl("https://cdn.sanity.io/x.jpg")).toBe("https://cdn.sanity.io/x.jpg?w=800");
  });

  it("returns the input unchanged when it is not a URL", () => {
    expect(cardImageUrl("not a url")).toBe("not a url");
  });
});
