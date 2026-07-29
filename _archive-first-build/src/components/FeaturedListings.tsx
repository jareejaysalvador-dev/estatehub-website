import Image from "next/image";
import { Bed, Bathtub, ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

// Sample listings for layout purposes only - replace with real inventory
// from a listings data source before launch.
const LISTINGS = [
  {
    title: "3BR Villa, Tagaytay Ridge",
    price: "₱24,800,000",
    meta: "For sale",
    beds: 3,
    baths: 3,
    sqm: 210,
    photoId: "28",
  },
  {
    title: "Studio Condo, BGC",
    price: "₱6,950,000",
    meta: "For sale",
    beds: 1,
    baths: 1,
    sqm: 28,
    photoId: "164",
  },
  {
    title: "4BR House, Alabang",
    price: "₱32,500,000",
    meta: "For sale",
    beds: 4,
    baths: 4,
    sqm: 340,
    photoId: "1029",
  },
  {
    title: "2BR Rental, Cebu IT Park",
    price: "₱45,000 / mo",
    meta: "For lease",
    beds: 2,
    baths: 2,
    sqm: 76,
    photoId: "1076",
  },
];

export function FeaturedListings() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-porcelain sm:text-3xl">
            Featured properties
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate sm:text-base">
            A sample of the kind of listings you&apos;ll find across our
            network.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-10">
        <div className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:mx-auto md:max-w-7xl">
          {LISTINGS.map((listing) => (
            <article
              key={listing.title}
              className="w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line/70 bg-card sm:w-[320px]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={`https://picsum.photos/id/${listing.photoId}/700/525`}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-porcelain backdrop-blur-sm">
                  {listing.meta}
                </span>
              </div>

              <div className="p-5">
                <p className="font-display text-lg font-bold text-porcelain">
                  {listing.price}
                </p>
                <h3 className="mt-1 text-sm text-porcelain/85">
                  {listing.title}
                </h3>

                <div className="mt-4 flex items-center gap-4 border-t border-line/60 pt-4 text-xs text-slate">
                  <span className="flex items-center gap-1.5">
                    <Bed size={16} weight="light" />
                    {listing.beds}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bathtub size={16} weight="light" />
                    {listing.baths}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ArrowsOutSimple size={16} weight="light" />
                    {listing.sqm} sqm
                  </span>
                </div>

                <a
                  href="#contact"
                  className="mt-4 block rounded-full border border-line/70 py-2.5 text-center text-sm font-medium text-porcelain transition-colors hover:border-emerald/60 hover:text-emerald"
                >
                  View details
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
