import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:pb-24">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-hairline bg-white px-8 py-12 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
              Ready to make your next move?
            </h2>
            <p className="mt-3 max-w-md text-base text-slate">
              Talk to a licensed broker about buying, selling, leasing, or
              property management.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-emerald px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-mint"
          >
            Contact us
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
