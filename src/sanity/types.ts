import type { ResolvedImage } from "./image";

export type ListingStatus = "For Sale" | "For Lease";

export type PropertyType = "House" | "Condo" | "Townhouse" | "Lot" | "Commercial";

export interface Broker {
  id: string;
  name: string;
  /** PRC real estate broker license number */
  prcLicense: string;
  phone: string;
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
}

export interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  facebookPageId: string | null;
}

export function formatPrice(listing: Pick<Listing, "price" | "status">): string {
  const amount = `₱${listing.price.toLocaleString("en-PH")}`;
  return listing.status === "For Lease" ? `${amount} / mo` : amount;
}
