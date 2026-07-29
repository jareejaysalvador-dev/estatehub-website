import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-6 py-24 text-left">
      <p className="text-sm font-medium text-emerald-deep">404</p>
      <h1 className="mt-2 font-display text-[32px] font-medium text-ink lg:text-[40px]">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-3 text-base text-slate">
        The page you&apos;re looking for may have moved, or the link may be
        out of date. Try searching for a property, or head back home.
      </p>

      <form action="/properties" method="GET" className="mt-8 w-full max-w-md">
        <label htmlFor="notfound-search" className="sr-only">
          Search properties
        </label>
        <div className="flex items-center gap-2 rounded-full border border-slate/50 bg-white px-4 py-2.5 focus-within:border-emerald-deep">
          <MagnifyingGlass size={18} weight="light" className="shrink-0 text-slate" aria-hidden="true" />
          <input
            id="notfound-search"
            name="query"
            type="search"
            placeholder="Search properties"
            className="w-full bg-transparent text-base text-ink placeholder:text-slate focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-mint"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/" className="text-emerald-deep underline underline-offset-4 hover:text-ink">
          Home
        </Link>
        <Link href="/properties" className="text-emerald-deep underline underline-offset-4 hover:text-ink">
          Properties
        </Link>
        <Link href="/contact" className="text-emerald-deep underline underline-offset-4 hover:text-ink">
          Contact us
        </Link>
      </div>
    </div>
  );
}
