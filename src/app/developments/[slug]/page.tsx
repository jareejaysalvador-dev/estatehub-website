import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CaretRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { Gallery } from "@/components/property/Gallery";
import { AgentBlock } from "@/components/property/AgentBlock";
import { StickyInquireBar } from "@/components/property/StickyInquireBar";
import { UnitTypes } from "@/components/development/UnitTypes";
import { getDevelopment, getAllDevelopmentSlugs } from "@/sanity/queries";
import { formatPriceRange } from "@/sanity/types";
import { withDownloadFilename } from "@/sanity/file";

export async function generateStaticParams() {
  const slugs = await getAllDevelopmentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const development = await getDevelopment(slug);
  if (!development) return {};
  return {
    title: development.title,
    description:
      development.blurb ??
      `${development.title} — Pre-selling development by ${development.developer} in ${development.location}.`,
  };
}

export default async function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const development = await getDevelopment(slug);
  if (!development) notFound();

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
            {development.title}
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
          <Gallery photos={development.photos} title={development.title} />

          <div className="mt-6">
            <span className="inline-block rounded-full bg-emerald/12 px-3 py-1 text-xs font-medium text-emerald-deep">
              Pre-selling
            </span>
            <p className="tnum mt-3 text-3xl font-bold text-ink">
              {formatPriceRange(development.priceFrom, development.priceTo)}
            </p>
            <h1 className="mt-1 text-xl text-ink/90">{development.title}</h1>
            <p className="mt-1 text-base text-slate">{development.location}</p>

            <div className="mt-5 flex flex-wrap items-center gap-6 border-y border-hairline py-4 text-sm text-ink/85">
              <span>By {development.developer}</span>
              {development.turnoverDate && <span>{development.turnoverDate}</span>}
              {development.unitTypes.length > 0 && (
                <span className="tnum">
                  {development.unitTypes.length}{" "}
                  {development.unitTypes.length === 1 ? "unit type" : "unit types"}
                </span>
              )}
            </div>

            {development.brochure && (
              <a
                href={withDownloadFilename(development.brochure)}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate/50 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-emerald-deep"
              >
                <DownloadSimple size={18} weight="light" aria-hidden="true" />
                Download brochure (PDF)
              </a>
            )}

            <UnitTypes unitTypes={development.unitTypes} />

            {development.blurb && (
              <>
                <h2 className="mt-8 text-lg font-semibold text-ink">About this development</h2>
                <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-ink/85">
                  {development.blurb}
                </p>
              </>
            )}

            {development.neighborhood && (
              <>
                <h2 className="mt-8 text-lg font-semibold text-ink">About the neighborhood</h2>
                <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-ink/85">
                  {development.neighborhood}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <AgentBlock
            broker={development.broker}
            listingSlug={development.slug}
            listingTitle={development.title}
          />
        </div>
      </div>

      <StickyInquireBar listingSlug={development.slug} />
    </div>
  );
}
