import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import { resolveImage, resolveImages } from "./image";
import type { Broker, Listing, SiteSettings } from "./types";

interface RawImage {
  asset?: SanityImageSource;
  alt?: string;
}

// One master resolution per image; next/image generates the actual
// responsive variants downstream from this, same as it already does for
// any source image.
const LISTING_PHOTO_WIDTH = 1600;
const BROKER_PHOTO_WIDTH = 800;

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
  photos[]{ asset, alt },
  "broker": broker->{
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
  }
}`;

interface RawListing extends Omit<Listing, "photos" | "broker"> {
  photos: RawImage[] | null;
  broker: Omit<Broker, "photo"> & { photo: RawImage | null };
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

export async function getAllBrokers(): Promise<Broker[]> {
  const raw = await sanityClient.fetch<
    (Omit<Broker, "photo"> & { photo: RawImage | null })[]
  >(
    `*[_type == "broker"] | order(_createdAt asc) {
      "id": _id, name, prcLicense, phone, email, areas, languages, bio, isSample,
      photo{ asset, alt }
    }`,
  );
  return raw.map((b) => ({ ...b, photo: resolveImage(b.photo, BROKER_PHOTO_WIDTH) }));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch<SiteSettings | null>(
    `*[_id == "siteSettings"][0]{ contactEmail, contactPhone, facebookPageId }`,
  );
}
