import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

/** A resolved, ready-to-use image - consuming components never touch Sanity's raw asset shape. */
export interface ResolvedImage {
  url: string;
  alt: string;
}

interface SanityImageWithAlt {
  asset?: SanityImageSource;
  alt?: string;
}

export function resolveImage(
  image: SanityImageWithAlt | null | undefined,
  width: number,
): ResolvedImage | null {
  if (!image?.asset) return null;
  return {
    url: builder.image(image as SanityImageSource).width(width).fit("max").auto("format").url(),
    alt: image.alt ?? "",
  };
}

export function resolveImages(
  images: SanityImageWithAlt[] | null | undefined,
  width: number,
): ResolvedImage[] {
  if (!images) return [];
  return images
    .map((img) => resolveImage(img, width))
    .filter((img): img is ResolvedImage => img !== null);
}
