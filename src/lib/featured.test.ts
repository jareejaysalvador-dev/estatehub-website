import { describe, expect, it } from "vitest";
import type { Broker, Development, Listing, PropertyGridItem } from "@/sanity/types";
import { cardImageUrl, FEATURED_COUNT, toFeaturedItems } from "./featured";

const broker: Broker = {
  id: "b1",
  name: "Rosemarie A. Ramos",
  prcLicense: "0034576",
  phone: null,
  email: "estatehub.ph@gmail.com",
  areas: "South Luzon",
  languages: "English, Filipino",
  bio: "",
  isSample: false,
  photo: null,
};

const PHOTO = {
  url: "https://cdn.sanity.io/images/0wtk03lk/production/abc-1600x1200.jpg?w=1600&fit=max&auto=format",
  alt: "Front of the house",
};

function listing(overrides: Partial<Listing> = {}): PropertyGridItem {
  return {
    kind: "listing",
    slug: "cypress-house",
    title: "Cypress House",
    status: "For Sale",
    type: "House",
    location: "Lipa, Batangas",
    price: 12500000,
    beds: 3,
    baths: 2,
    floorAreaSqm: 120,
    lotAreaSqm: 200,
    photos: [PHOTO],
    blurb: null,
    neighborhood: null,
    broker,
    createdAt: "2026-10-01T00:00:00Z",
    ...overrides,
  };
}

function development(overrides: Partial<Development> = {}): PropertyGridItem {
  return {
    kind: "development",
    slug: "terreno-south",
    title: "Terreno South by Rockwell",
    location: "Lipa, Batangas",
    developer: "Rockwell Land",
    priceFrom: 8900000,
    priceTo: null,
    turnoverDate: null,
    blurb: null,
    neighborhood: null,
    photos: [PHOTO],
    brochure: null,
    unitTypes: [],
    broker,
    createdAt: "2026-09-01T00:00:00Z",
    ...overrides,
  };
}

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

  it("keeps the input order and takes only the first four", () => {
    const items = [1, 2, 3, 4, 5, 6].map((n) => listing({ slug: `l${n}`, title: `L${n}` }));
    const cards = toFeaturedItems(items);
    expect(cards).toHaveLength(FEATURED_COUNT);
    expect(cards.map((c) => c.slug)).toEqual(["l1", "l2", "l3", "l4"]);
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
