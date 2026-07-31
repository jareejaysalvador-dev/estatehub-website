// ============================================================
// SAMPLE DATA - replace with real inventory before launch.
// Source of truth for real listings: the intake workbook at
// estatehub_handoff/intake/launch-content-intake.xlsx (Listings tab).
// Photo IDs are hand-verified picsum.photos placeholders (checked in a
// browser; picsum "seed" URLs are NOT content-matched, never use them).
// Real property photography replaces these at launch.
// ============================================================

export type ListingStatus = "For Sale" | "For Lease";

export type PropertyType =
  | "House"
  | "Condo"
  | "Townhouse"
  | "Lot"
  | "Commercial";

export interface Listing {
  slug: string;
  title: string;
  status: ListingStatus;
  type: PropertyType;
  location: string;
  /** PHP; monthly for leases */
  price: number;
  beds: number | null;
  baths: number | null;
  floorAreaSqm: number | null;
  lotAreaSqm: number | null;
  /** Hand-verified picsum photo IDs; first is the cover */
  photoIds: string[];
  blurb: string;
  neighborhood: string;
  brokerId: string;
}

export function formatPrice(listing: Listing): string {
  const amount = `₱${listing.price.toLocaleString("en-PH")}`;
  return listing.status === "For Lease" ? `${amount} / mo` : amount;
}

export const LISTINGS: Listing[] = [
  {
    slug: "3br-villa-tagaytay-ridge",
    title: "3BR Villa, Tagaytay Ridge",
    status: "For Sale",
    type: "House",
    location: "Tagaytay, Cavite",
    price: 24_800_000,
    beds: 3,
    baths: 3,
    floorAreaSqm: 210,
    lotAreaSqm: 320,
    photoIds: ["28", "1029", "164"],
    blurb:
      "Ridge-side villa with cool-climate gardens and a wide deck facing the treeline. Quiet street, ten minutes from the Tagaytay rotunda.",
    neighborhood:
      "Tagaytay Ridge sits above the Taal caldera with year-round cool air, weekend markets, and an easy drive to Metro Manila via CALAX.",
    brokerId: "rosemarie-ramos",
  },
  {
    slug: "studio-condo-bgc",
    title: "Studio Condo, BGC",
    status: "For Sale",
    type: "Condo",
    location: "Taguig, Metro Manila",
    price: 6_950_000,
    beds: 1,
    baths: 1,
    floorAreaSqm: 28,
    lotAreaSqm: null,
    photoIds: ["164", "1031", "1048"],
    blurb:
      "Efficient studio on a high floor, steps from High Street retail and the BGC bus loop. Strong rental history in the building.",
    neighborhood:
      "Bonifacio Global City is Metro Manila's walkable business district: offices, international schools, hospitals, and nightlife in one grid.",
    brokerId: "rosemarie-ramos",
  },
  {
    slug: "4br-house-alabang",
    title: "4BR House, Alabang",
    status: "For Sale",
    type: "House",
    location: "Muntinlupa, Metro Manila",
    price: 32_500_000,
    beds: 4,
    baths: 4,
    floorAreaSqm: 340,
    lotAreaSqm: 400,
    photoIds: ["1029", "1076", "28"],
    blurb:
      "Two-storey family home in a gated village with mature trees, a covered lanai, and a study that works as a fifth bedroom.",
    neighborhood:
      "Alabang pairs village quiet with town-center convenience: Festival Mall, Molito, top schools, and quick Skyway access north.",
    brokerId: "rosemarie-ramos",
  },
  {
    slug: "2br-rental-cebu-it-park",
    title: "2BR Rental, Cebu IT Park",
    status: "For Lease",
    type: "Condo",
    location: "Cebu City, Cebu",
    price: 45_000,
    beds: 2,
    baths: 2,
    floorAreaSqm: 76,
    lotAreaSqm: null,
    photoIds: ["1076", "1048", "1031"],
    blurb:
      "Corner two-bedroom with a workspace nook, walking distance to IT Park offices and the Ayala Central Bloc.",
    neighborhood:
      "Cebu IT Park runs around the clock: BPO towers, cafes, and co-working spaces, with the airport twenty minutes away.",
    brokerId: "rosemarie-ramos",
  },
  {
    slug: "commercial-lot-batangas",
    title: "Commercial Lot, Batangas City",
    status: "For Sale",
    type: "Lot",
    location: "Batangas City, Batangas",
    price: 18_200_000,
    beds: null,
    baths: null,
    floorAreaSqm: null,
    lotAreaSqm: 1_000,
    photoIds: ["1031", "1029", "1067"],
    blurb:
      "Corner commercial lot on the diversion road with frontage on two sides, near the port access route.",
    neighborhood:
      "Batangas City anchors the province's port economy; the diversion road corridor is its fastest-growing commercial strip.",
    brokerId: "rosemarie-ramos",
  },
  {
    slug: "office-floor-makati",
    title: "Whole Office Floor, Makati",
    status: "For Lease",
    type: "Commercial",
    location: "Makati, Metro Manila",
    price: 480_000,
    beds: null,
    baths: null,
    floorAreaSqm: 620,
    lotAreaSqm: null,
    photoIds: ["1048", "1076", "164"],
    blurb:
      "Fitted whole floor in a Grade B tower off Ayala Avenue: reception, two boardrooms, and server room in place.",
    neighborhood:
      "Makati remains the country's financial core, with the deepest pool of corporate tenants and after-hours dining on every block.",
    brokerId: "rosemarie-ramos",
  },
];

export function getListing(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}
