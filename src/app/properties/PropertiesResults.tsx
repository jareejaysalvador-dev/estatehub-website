"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { PropertyCard } from "@/components/PropertyCard";
import type { Listing, ListingStatus, PropertyType } from "@/sanity/types";

const TYPES: PropertyType[] = ["House", "Condo", "Townhouse", "Lot", "Commercial"];
const STATUSES: ListingStatus[] = ["For Sale", "For Lease"];

const SELECT_CLASSES =
  "w-full rounded-lg border border-slate/50 bg-white px-3 py-2.5 text-base text-ink focus:outline-none";

export function PropertiesResults({ listings }: { listings: Listing[] }) {
  const params = useSearchParams();

  // Allowlist validation: anything unrecognized is treated as unset.
  const query = (params.get("query") ?? "").slice(0, 80).trim();
  const rawType = params.get("type");
  const type = TYPES.includes(rawType as PropertyType) ? (rawType as PropertyType) : "";
  const rawStatus = params.get("status");
  const status = STATUSES.includes(rawStatus as ListingStatus)
    ? (rawStatus as ListingStatus)
    : "";

  const results = listings.filter((listing) => {
    if (type && listing.type !== type) return false;
    if (status && listing.status !== status) return false;
    if (query) {
      const haystack =
        `${listing.title} ${listing.location} ${listing.type}`.toLowerCase();
      if (!haystack.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const hasFilters = Boolean(query || type || status);

  return (
    <>
      <form
        action="/properties"
        method="GET"
        className="grid grid-cols-1 gap-3 rounded-2xl border border-hairline bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
      >
        <div>
          <label htmlFor="filter-query" className="mb-1 block text-xs font-medium text-slate">
            Location or keyword
          </label>
          <input
            id="filter-query"
            name="query"
            type="text"
            defaultValue={query}
            placeholder="City, neighborhood, keyword"
            className="w-full rounded-lg border border-slate/50 bg-white px-3 py-2.5 text-base text-ink placeholder:text-slate focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="filter-type" className="mb-1 block text-xs font-medium text-slate">
            Property type
          </label>
          <select id="filter-type" name="type" defaultValue={type} className={SELECT_CLASSES}>
            <option value="">Any type</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-status" className="mb-1 block text-xs font-medium text-slate">
            Buy or lease
          </label>
          <select id="filter-status" name="status" defaultValue={status} className={SELECT_CLASSES}>
            <option value="">Either</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald px-6 py-2.5 text-base font-semibold text-ink transition-colors hover:bg-mint lg:w-auto"
          >
            <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
            Search
          </button>
        </div>
      </form>

      <p className="tnum mt-6 text-sm text-slate" aria-live="polite">
        {results.length} {results.length === 1 ? "property" : "properties"}
        {hasFilters ? " matching your filters" : ""}
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((listing) => (
            <li key={listing.slug}>
              <PropertyCard listing={listing} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-hairline bg-white px-8 py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">
            No properties match these filters
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base text-slate">
            Our brokers often know of properties before they reach the site.
            Tell us what you are looking for and we will search for you.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-emerald px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-mint"
            >
              Contact us
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-emerald-deep underline underline-offset-4 hover:text-ink"
            >
              Clear filters
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
