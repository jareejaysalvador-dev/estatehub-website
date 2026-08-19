import Image from "next/image";
import Link from "next/link";
import { Buildings } from "@phosphor-icons/react/dist/ssr";
import { formatPriceRange, type Development } from "@/sanity/types";

export function DevelopmentCard({ development }: { development: Development }) {
  const cover = development.photos[0];

  return (
    <Link
      href={`/developments/${encodeURIComponent(development.slug)}`}
      className="group block overflow-hidden rounded-2xl border border-hairline bg-white transition-all hover:-translate-y-0.5 hover:border-emerald hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover && (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-porcelain">
          Pre-selling
        </span>
      </div>

      <div className="p-6">
        <p className="tnum text-xl font-bold text-ink">
          {formatPriceRange(development.priceFrom, development.priceTo)}
        </p>
        <h3 className="mt-1 text-base text-ink/85">{development.title}</h3>
        <p className="mt-0.5 text-sm text-slate">{development.location}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-hairline pt-4 text-sm text-slate">
          <span>{development.developer}</span>
          {development.unitTypes.length > 0 && (
            <span className="tnum flex items-center gap-1.5">
              <Buildings size={16} weight="light" aria-hidden="true" />
              {development.unitTypes.length}{" "}
              {development.unitTypes.length === 1 ? "unit type" : "unit types"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
