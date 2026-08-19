import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowsOutSimple,
  Bathtub,
  Bed,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { Gallery } from "@/components/property/Gallery";
import { AgentBlock } from "@/components/property/AgentBlock";
import { StickyInquireBar } from "@/components/property/StickyInquireBar";
import { getListing, getAllListingSlugs } from "@/sanity/queries";
import { formatPrice } from "@/sanity/types";
import { pageMetadata, ogImageFromPhoto } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getAllListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return {};
  return pageMetadata(
    listing.title,
    listing.blurb ?? `${listing.title} — ${listing.status} in ${listing.location}.`,
    ogImageFromPhoto(listing.photos[0], listing.title),
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) notFound();

  const hasBeds = listing.beds !== null || listing.baths !== null;
  const area = listing.floorAreaSqm ?? listing.lotAreaSqm;
  const areaLabel = listing.floorAreaSqm !== null ? "floor area" : "lot area";

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 pb-28 lg:pb-16">
      <nav aria-label="Breadcrumb" className="hidden text-sm text-slate lg:block">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <CaretRight size={12} weight="bold" aria-hidden="true" />
          <li>
            <Link href="/properties" className="hover:text-ink">
              Properties
            </Link>
          </li>
          <CaretRight size={12} weight="bold" aria-hidden="true" />
          <li aria-current="page" className="text-ink">
            {listing.title}
          </li>
        </ol>
      </nav>
      <Link
        href="/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink lg:hidden"
      >
        <ArrowLeft size={14} weight="bold" aria-hidden="true" />
        Properties
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:mt-2 lg:grid-cols-[1fr_360px]">
        <div>
          <Gallery photos={listing.photos} title={listing.title} />

          <div className="mt-6">
            <span className="inline-block rounded-full bg-emerald/12 px-3 py-1 text-xs font-medium text-emerald-deep">
              {listing.status}
            </span>
            <p className="tnum mt-3 text-3xl font-bold text-ink">
              {formatPrice(listing)}
            </p>
            <h1 className="mt-1 text-xl text-ink/90">{listing.title}</h1>
            <p className="mt-1 text-base text-slate">{listing.location}</p>

            {hasBeds && (
              <div className="mt-5 flex flex-wrap items-center gap-6 border-y border-hairline py-4 text-sm text-ink/85">
                {listing.beds !== null && (
                  <span className="tnum flex items-center gap-2">
                    <Bed size={18} weight="light" aria-hidden="true" />
                    {listing.beds} bedrooms
                  </span>
                )}
                {listing.baths !== null && (
                  <span className="tnum flex items-center gap-2">
                    <Bathtub size={18} weight="light" aria-hidden="true" />
                    {listing.baths} bathrooms
                  </span>
                )}
                {area !== null && (
                  <span className="tnum flex items-center gap-2">
                    <ArrowsOutSimple size={18} weight="light" aria-hidden="true" />
                    {area} sqm {areaLabel}
                  </span>
                )}
              </div>
            )}

            {listing.blurb && (
              <>
                <h2 className="mt-8 text-lg font-semibold text-ink">
                  About this property
                </h2>
                <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-ink/85">
                  {listing.blurb}
                </p>
              </>
            )}

            {listing.neighborhood && (
              <>
                <h2 className="mt-8 text-lg font-semibold text-ink">
                  About the neighborhood
                </h2>
                <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-ink/85">
                  {listing.neighborhood}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <AgentBlock
            broker={listing.broker}
            listingSlug={listing.slug}
            listingTitle={listing.title}
          />
        </div>
      </div>

      <StickyInquireBar listingSlug={listing.slug} />
    </div>
  );
}
