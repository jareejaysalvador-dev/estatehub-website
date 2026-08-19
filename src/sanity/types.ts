import type { ResolvedImage } from "./image";
import type { ResolvedFile } from "./file";

export type ListingStatus = "For Sale" | "For Lease";

export type PropertyType = "House" | "Condo" | "Townhouse" | "Lot" | "Commercial";

export interface Broker {
  id: string;
  name: string;
  /** PRC real estate broker license number */
  prcLicense: string;
  phone: string | null;
  email: string;
  areas: string;
  languages: string;
  bio: string;
  isSample: boolean;
  photo: ResolvedImage | null;
}

export interface Listing {
  slug: string;
  title: string;
  status: ListingStatus;
  type: PropertyType;
  location: string;
  price: number;
  beds: number | null;
  baths: number | null;
  floorAreaSqm: number | null;
  lotAreaSqm: number | null;
  /** First photo is the cover */
  photos: ResolvedImage[];
  blurb: string | null;
  neighborhood: string | null;
  broker: Broker;
  createdAt: string;
}

/** One floor plan / unit model within a pre-selling Development. Only name is guaranteed. */
export interface UnitType {
  key: string;
  name: string;
  category: PropertyType | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  floorAreaSqm: number | null;
  floorPlan: ResolvedFile | null;
}

/** A pre-selling project with many unit types and a price range, as opposed to a single-unit Listing. */
export interface Development {
  slug: string;
  title: string;
  location: string;
  developer: string;
  priceFrom: number;
  priceTo: number | null;
  turnoverDate: string | null;
  blurb: string | null;
  neighborhood: string | null;
  /** First photo is the cover */
  photos: ResolvedImage[];
  brochure: ResolvedFile | null;
  unitTypes: UnitType[];
  broker: Broker;
  createdAt: string;
}

/** Only what the /contact page's "Regarding: ..." banner needs, across both listing and development. */
export interface InquiryReference {
  title: string;
}

export type PropertyGridItem =
  | ({ kind: "listing" } & Listing)
  | ({ kind: "development" } & Development);

export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  facebookPageId: string | null;
}

export function formatPhp(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function formatPrice(listing: Pick<Listing, "price" | "status">): string {
  const amount = formatPhp(listing.price);
  return listing.status === "For Lease" ? `${amount} / mo` : amount;
}

export function formatPriceRange(priceFrom: number, priceTo: number | null): string {
  if (priceTo === null || priceTo === priceFrom) return `From ${formatPhp(priceFrom)}`;
  return `${formatPhp(priceFrom)} – ${formatPhp(priceTo)}`;
}
