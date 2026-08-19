"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { PropertyCard } from "@/components/PropertyCard";
import { DevelopmentCard } from "@/components/DevelopmentCard";
import type { PropertyGridItem, PropertyType } from "@/sanity/types";

// Reads query params via window.location instead of next/navigation's
// useSearchParams(): avoids a Suspense boundary entirely. Same fix
// ContactForm.tsx already uses for the identical reason - a Suspense +
// useSearchParams combination reproduces a permanent stuck-fallback hang
// in this Next.js 16 / Turbopack dev environment (confirmed reproducible
// here too, consistently across a full dev-server restart; the production
// build itself was never affected). See ContactForm.tsx's own comment for
// the fuller history - not repeated here.
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSnapshot() {
  return window.location.search;
}

function getServerSnapshot() {
  return "";
}

const TYPES: PropertyType[] = ["House", "Condo", "Townhouse", "Lot", "Commercial"];
const STATUS_OPTIONS = ["For Sale", "For Lease", "Pre-selling"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

// A location filter with fewer than 2 options is a dead control (its states
// produce the same result set), so both the <select> and the URL param are
// gated on this - same 0/1/many discipline as the broker roster.
const MIN_LOCATIONS_FOR_FILTER = 2;

const SELECT_CLASSES =
  "w-full rounded-lg border border-slate/50 bg-white px-3 py-2.5 text-base text-ink focus:outline-none";

export function PropertiesResults({ items }: { items: PropertyGridItem[] }) {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Force a fresh mount once the real client-side location is read (server
  // snapshot is always ""), so the filters' `defaultValue`s (an
  // uncontrolled-input default that only applies at mount) reflect the real
  // URL instead of the empty server-rendered first pass - same reasoning as
  // ContactForm.tsx's identical key={search} usage.
  return <PropertiesResultsInner key={search} items={items} search={search} />;
}

function PropertiesResultsInner({
  items,
  search,
}: {
  items: PropertyGridItem[];
  search: string;
}) {
  const params = new URLSearchParams(search);

  // Distinct locations across both listings and developments, deduped
  // case/whitespace-insensitively (first-seen casing wins), alphabetical.
  const locationOptions = useMemo(() => {
    const seen = new Map<string, string>(); // lowercase key -> display label
    for (const item of items) {
      const label = (item.location ?? "").trim();
      if (!label) continue;
      const key = label.toLowerCase();
      if (!seen.has(key)) seen.set(key, label);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [items]);
  const showLocationFilter = locationOptions.length >= MIN_LOCATIONS_FOR_FILTER;

  // Allowlist validation: anything unrecognized is treated as unset.
  const query = (params.get("query") ?? "").slice(0, 80).trim();
  const rawType = params.get("type");
  const type = TYPES.includes(rawType as PropertyType) ? (rawType as PropertyType) : "";
  const rawStatus = params.get("status");
  const status = STATUS_OPTIONS.includes(rawStatus as StatusOption)
    ? (rawStatus as StatusOption)
    : "";
  const rawLocation = (params.get("location") ?? "").trim();
  const location = showLocationFilter
    ? (locationOptions.find((l) => l.toLowerCase() === rawLocation.toLowerCase()) ?? "")
    : "";

  const results = items.filter((item) => {
    if (location && (item.location ?? "").trim().toLowerCase() !== location.toLowerCase()) {
      return false;
    }

    if (item.kind === "listing") {
      if (status === "Pre-selling") return false;
      if (status && item.status !== status) return false;
      if (type && item.type !== type) return false;
      if (query) {
        const haystack = `${item.title} ${item.location} ${item.type}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    }

    // development
    if (status && status !== "Pre-selling") return false;
    if (type && !item.unitTypes.some((unit) => unit.category === type)) return false;
    if (query) {
      const categories = item.unitTypes
        .map((unit) => unit.category)
        .filter((category): category is PropertyType => category !== null)
        .join(" ");
      const haystack =
        `${item.title} ${item.location} ${item.developer} ${categories}`.toLowerCase();
      if (!haystack.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const hasFilters = Boolean(query || type || status || location);

  return (
    <>
      <form
        action="/properties"
        method="GET"
        className={`grid grid-cols-1 gap-3 rounded-2xl border border-hairline bg-white p-4 sm:grid-cols-2 ${
          showLocationFilter
            ? "lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
            : "lg:grid-cols-[1.5fr_1fr_1fr_auto]"
        }`}
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
        {showLocationFilter && (
          <div>
            <label htmlFor="filter-location" className="mb-1 block text-xs font-medium text-slate">
              Location
            </label>
            <select
              id="filter-location"
              name="location"
              defaultValue={location}
              className={SELECT_CLASSES}
            >
              <option value="">Any location</option>
              {locationOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}
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
            {STATUS_OPTIONS.map((s) => (
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
          {results.map((item) => (
            <li key={`${item.kind}-${item.slug}`}>
              {item.kind === "listing" ? (
                <PropertyCard listing={item} />
              ) : (
                <DevelopmentCard development={item} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-hairline bg-white px-8 py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">
            {hasFilters ? "No properties match these filters" : "New listings are on the way"}
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
            {hasFilters && (
              <Link
                href="/properties"
                className="text-sm font-medium text-emerald-deep underline underline-offset-4 hover:text-ink"
              >
                Clear filters
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
