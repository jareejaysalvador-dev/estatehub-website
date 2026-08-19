import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import { resolveImage, resolveImages } from "./image";
import { resolveFile } from "./file";
import type {
  Broker,
  Development,
  InquiryReference,
  Listing,
  PropertyGridItem,
  SiteSettings,
  UnitType,
} from "./types";

interface RawImage {
  asset?: SanityImageSource;
  alt?: string;
}

interface RawFile {
  url?: string | null;
  filename?: string | null;
}

// One master resolution per image; next/image generates the actual
// responsive variants downstream from this, same as it already does for
// any source image.
const LISTING_PHOTO_WIDTH = 1600;
const BROKER_PHOTO_WIDTH = 800;

const BROKER_PROJECTION = `{
  "id": _id,
  name,
  prcLicense,
  phone,
  email,
  areas,
  languages,
  bio,
  isSample,
  photo{ asset, alt }
}`;

const LISTING_PROJECTION = `{
  "slug": slug.current,
  title,
  status,
  type,
  location,
  price,
  beds,
  baths,
  floorAreaSqm,
  lotAreaSqm,
  blurb,
  neighborhood,
  "createdAt": _createdAt,
  photos[]{ asset, alt },
  "broker": broker->${BROKER_PROJECTION}
}`;

const DEVELOPMENT_PROJECTION = `{
  "slug": slug.current,
  title,
  location,
  developer,
  priceFrom,
  priceTo,
  turnoverDate,
  blurb,
  neighborhood,
  "createdAt": _createdAt,
  photos[]{ asset, alt },
  brochure{ "url": asset->url, "filename": asset->originalFilename },
  unitTypes[]{
    "key": _key,
    name,
    category,
    price,
    beds,
    baths,
    floorAreaSqm,
    floorPlan{ "url": asset->url, "filename": asset->originalFilename }
  },
  "broker": broker->${BROKER_PROJECTION}
}`;

interface RawListing extends Omit<Listing, "photos" | "broker"> {
  photos: RawImage[] | null;
  broker: Omit<Broker, "photo"> & { photo: RawImage | null };
}

interface RawUnitType extends Omit<UnitType, "floorPlan"> {
  floorPlan: RawFile | null;
}

interface RawDevelopment extends Omit<Development, "photos" | "broker" | "brochure" | "unitTypes"> {
  photos: RawImage[] | null;
  broker: Omit<Broker, "photo"> & { photo: RawImage | null };
  brochure: RawFile | null;
  unitTypes: RawUnitType[] | null;
}

function hydrateListing(raw: RawListing): Listing {
  return {
    ...raw,
    photos: resolveImages(raw.photos, LISTING_PHOTO_WIDTH),
    broker: {
      ...raw.broker,
      photo: resolveImage(raw.broker.photo, BROKER_PHOTO_WIDTH),
    },
  };
}

function hydrateDevelopment(raw: RawDevelopment): Development {
  return {
    ...raw,
    photos: resolveImages(raw.photos, LISTING_PHOTO_WIDTH),
    brochure: resolveFile(raw.brochure),
    unitTypes: (raw.unitTypes ?? []).map((unit) => ({
      ...unit,
      floorPlan: resolveFile(unit.floorPlan),
    })),
    broker: {
      ...raw.broker,
      photo: resolveImage(raw.broker.photo, BROKER_PHOTO_WIDTH),
    },
  };
}

export async function getAllListings(): Promise<Listing[]> {
  const raw = await sanityClient.fetch<RawListing[]>(
    `*[_type == "listing"] | order(_createdAt desc) ${LISTING_PROJECTION}`,
  );
  return raw.map(hydrateListing);
}

export async function getAllListingSlugs(): Promise<string[]> {
  const rows = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "listing"]{ "slug": slug.current }`,
  );
  return rows.map((r) => r.slug);
}

export async function getListing(slug: string): Promise<Listing | null> {
  const raw = await sanityClient.fetch<RawListing | null>(
    `*[_type == "listing" && slug.current == $slug][0] ${LISTING_PROJECTION}`,
    { slug },
  );
  return raw ? hydrateListing(raw) : null;
}

export async function getAllDevelopments(): Promise<Development[]> {
  const raw = await sanityClient.fetch<RawDevelopment[]>(
    `*[_type == "development"] | order(_createdAt desc) ${DEVELOPMENT_PROJECTION}`,
  );
  return raw.map(hydrateDevelopment);
}

export async function getAllDevelopmentSlugs(): Promise<string[]> {
  const rows = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "development"]{ "slug": slug.current }`,
  );
  return rows.map((r) => r.slug);
}

export async function getDevelopment(slug: string): Promise<Development | null> {
  const raw = await sanityClient.fetch<RawDevelopment | null>(
    `*[_type == "development" && slug.current == $slug][0] ${DEVELOPMENT_PROJECTION}`,
    { slug },
  );
  return raw ? hydrateDevelopment(raw) : null;
}

export async function getInquiryReference(slug: string): Promise<InquiryReference | null> {
  return sanityClient.fetch<InquiryReference | null>(
    `*[_type in ["listing", "development"] && slug.current == $slug][0]{ title }`,
    { slug },
  );
}

// Both /properties and the homepage carousel show listings and developments
// merged into one feed, newest first - kept in one place so the merge/sort
// rule can't drift between the two consumers.
export async function getAllPropertyGridItems(): Promise<PropertyGridItem[]> {
  const [listings, developments] = await Promise.all([getAllListings(), getAllDevelopments()]);
  return [
    ...listings.map((listing) => ({ kind: "listing" as const, ...listing })),
    ...developments.map((development) => ({ kind: "development" as const, ...development })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAllBrokers(): Promise<Broker[]> {
  const raw = await sanityClient.fetch<
    (Omit<Broker, "photo"> & { photo: RawImage | null })[]
  >(
    `*[_type == "broker"] | order(_createdAt asc) ${BROKER_PROJECTION}`,
  );
  return raw.map((b) => ({ ...b, photo: resolveImage(b.photo, BROKER_PHOTO_WIDTH) }));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch<SiteSettings | null>(
    `*[_id == "siteSettings"][0]{ contactEmail, contactPhone, facebookPageId }`,
  );
}
