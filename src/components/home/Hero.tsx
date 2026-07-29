import Image from "next/image";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

const SELECT_CLASSES =
  "w-full rounded-lg border border-slate/50 bg-white px-3 py-2.5 text-base text-ink focus:outline-none";

export function Hero() {
  return (
    <section className="surface-dark relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/id/1067/1920/1080"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/35" />
        <div className="absolute inset-0 bg-navy/35 lg:bg-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="animate-fade-up font-display text-[32px] font-medium leading-[1.15] text-porcelain lg:text-[44px]">
            Building <span className="text-emerald">generational wealth</span>,
            one move at a time.
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up text-base text-porcelain/85 [animation-delay:120ms] lg:text-lg">
            Licensed brokers for buying, selling, leasing, and managing
            property across the Philippines.
          </p>

          <form
            action="/properties"
            method="GET"
            className="surface-light mt-8 grid max-w-xl animate-fade-up grid-cols-1 gap-3 rounded-2xl bg-porcelain p-4 [animation-delay:240ms] sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <div>
              <label
                htmlFor="hero-location"
                className="mb-1 block text-xs font-medium text-slate"
              >
                Location
              </label>
              <input
                id="hero-location"
                name="query"
                type="text"
                placeholder="City or neighborhood"
                className="w-full rounded-lg border border-slate/50 bg-white px-3 py-2.5 text-base text-ink placeholder:text-slate focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="hero-type"
                className="mb-1 block text-xs font-medium text-slate"
              >
                Property type
              </label>
              <select id="hero-type" name="type" defaultValue="" className={SELECT_CLASSES}>
                <option value="">Any type</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Lot">Lot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="hero-status"
                className="mb-1 block text-xs font-medium text-slate"
              >
                Buy or lease
              </label>
              <select id="hero-status" name="status" defaultValue="" className={SELECT_CLASSES}>
                <option value="">Either</option>
                <option value="For Sale">For Sale</option>
                <option value="For Lease">For Lease</option>
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
        </div>
      </div>
    </section>
  );
}
