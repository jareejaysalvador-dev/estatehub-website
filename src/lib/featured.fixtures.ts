import type { Broker, Development, Listing, PropertyGridItem } from "@/sanity/types";

// Typed sample data shared by the featured-properties tests (mapping and API
// route). Not imported by any page or route.

export const broker: Broker = {
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

export const PHOTO = {
  url: "https://cdn.sanity.io/images/0wtk03lk/production/abc-1600x1200.jpg?w=1600&fit=max&auto=format",
  alt: "Front of the house",
};

export function listing(overrides: Partial<Listing> = {}): PropertyGridItem {
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

export function development(overrides: Partial<Development> = {}): PropertyGridItem {
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
