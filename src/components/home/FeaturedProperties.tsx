import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PropertyCard } from "@/components/PropertyCard";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import { getAllPropertyGridItems } from "@/sanity/queries";

export async function FeaturedProperties() {
  const items = await getAllPropertyGridItems();
  const featured = items.slice(0, 4);

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
        {featured.length > 0 ? (
          <ul className="hide-scrollbar mx-auto flex max-w-7xl snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2">
            {featured.map((item) => (
              <li
                key={`${item.kind}-${item.slug}`}
                className="w-[280px] shrink-0 snap-start sm:w-[320px]"
              >
                {item.kind === "listing" ? (
                  <PropertyCard listing={item} />
                ) : (
                  <DevelopmentCard development={item} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-2xl border border-hairline bg-white px-8 py-10 text-center">
              <p className="text-base text-slate">
                New listings are on the way. Our brokers often know of
                properties before they reach the site. Tell us what you are
                looking for.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mint"
              >
                Contact us
              </Link>
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
