import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PropertyCard } from "@/components/PropertyCard";
import { LISTINGS } from "@/data/listings";

export function FeaturedProperties() {
  const featured = LISTINGS.slice(0, 4);

  return (
    <section className="overflow-x-hidden border-y border-hairline bg-white/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
              Featured properties
            </h2>
            <Link
              href="/properties"
              className="text-sm font-medium text-emerald-deep underline underline-offset-4 hover:text-ink"
            >
              View all properties
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08} className="mt-8">
        <ul className="hide-scrollbar mx-auto flex max-w-7xl snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2">
          {featured.map((listing) => (
            <li
              key={listing.slug}
              className="w-[280px] shrink-0 snap-start sm:w-[320px]"
            >
              <PropertyCard listing={listing} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
