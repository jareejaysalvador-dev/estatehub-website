import Image from "next/image";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://picsum.photos/id/1067/1920/1080"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-24 md:pb-32">
        <h1 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-porcelain sm:text-5xl lg:text-6xl">
          <span className="block animate-fade-up [animation-delay:0ms]">
            Building <span className="text-emerald">generational wealth,</span>
          </span>
          <span className="block animate-fade-up [animation-delay:120ms]">
            one move at a time.
          </span>
        </h1>

        <p className="mt-5 max-w-xl animate-fade-up text-base text-slate [animation-delay:220ms] sm:text-lg">
          Lease, manage, buy, or sell property across the Philippines, backed
          by local expertise you can trust.
        </p>

        <form className="mt-9 flex max-w-3xl animate-fade-up flex-col gap-2 rounded-2xl border border-line/70 bg-card/90 p-2 [animation-delay:340ms] backdrop-blur-sm md:flex-row md:items-center md:gap-0 md:p-2">
          <label className="flex-1 px-3 py-2.5">
            <span className="block text-[11px] text-slate">Location</span>
            <input
              type="text"
              placeholder="City, neighborhood, or address"
              className="w-full bg-transparent text-sm text-porcelain placeholder:text-slate/70 focus:outline-none"
            />
          </label>

          <div className="hidden h-9 w-px bg-line md:block" aria-hidden="true" />

          <label className="flex-1 px-3 py-2.5">
            <span className="block text-[11px] text-slate">Property type</span>
            <select
              defaultValue=""
              className="w-full bg-transparent text-sm text-porcelain focus:outline-none"
            >
              <option value="" className="bg-card">
                Any type
              </option>
              <option value="house" className="bg-card">
                House
              </option>
              <option value="condo" className="bg-card">
                Condo
              </option>
              <option value="lot" className="bg-card">
                Lot
              </option>
              <option value="commercial" className="bg-card">
                Commercial
              </option>
            </select>
          </label>

          <div className="hidden h-9 w-px bg-line md:block" aria-hidden="true" />

          <label className="flex-1 px-3 py-2.5">
            <span className="block text-[11px] text-slate">Budget</span>
            <select
              defaultValue=""
              className="w-full bg-transparent text-sm text-porcelain focus:outline-none"
            >
              <option value="" className="bg-card">
                Any budget
              </option>
              <option value="5-10" className="bg-card">
                ₱5M-₱10M
              </option>
              <option value="10-20" className="bg-card">
                ₱10M-₱20M
              </option>
              <option value="20+" className="bg-card">
                ₱20M+
              </option>
            </select>
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mint md:ml-1"
          >
            <MagnifyingGlass size={18} weight="bold" />
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
