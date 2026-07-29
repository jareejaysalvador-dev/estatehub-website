import Image from "next/image";
import Link from "next/link";
import { ArrowsOutSimple, Bathtub, Bed } from "@phosphor-icons/react/dist/ssr";
import { formatPrice, type Listing } from "@/data/listings";

export function PropertyCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/properties/${listing.slug}`}
      className="group block overflow-hidden rounded-2xl border border-hairline bg-white transition-all hover:-translate-y-0.5 hover:border-emerald hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={`https://picsum.photos/id/${listing.photoIds[0]}/700/525`}
          alt={`${listing.title} exterior view`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-porcelain">
          {listing.status}
        </span>
      </div>

      <div className="p-6">
        <p className="tnum text-xl font-bold text-ink">{formatPrice(listing)}</p>
        <h3 className="mt-1 text-base text-ink/85">{listing.title}</h3>
        <p className="mt-0.5 text-sm text-slate">{listing.location}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-hairline pt-4 text-sm text-slate">
          {listing.beds !== null && (
            <span className="tnum flex items-center gap-1.5">
              <Bed size={16} weight="light" aria-hidden="true" />
              {listing.beds}
              <span className="sr-only">bedrooms</span>
            </span>
          )}
          {listing.baths !== null && (
            <span className="tnum flex items-center gap-1.5">
              <Bathtub size={16} weight="light" aria-hidden="true" />
              {listing.baths}
              <span className="sr-only">bathrooms</span>
            </span>
          )}
          {(listing.floorAreaSqm ?? listing.lotAreaSqm) !== null && (
            <span className="tnum flex items-center gap-1.5">
              <ArrowsOutSimple size={16} weight="light" aria-hidden="true" />
              {listing.floorAreaSqm ?? listing.lotAreaSqm} sqm
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
