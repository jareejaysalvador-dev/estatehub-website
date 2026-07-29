import { Reveal } from "./Reveal";

export function ClosingCta() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-3xl border border-line/70 bg-card px-8 py-12 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-porcelain sm:text-3xl">
              Ready to make your next move?
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate sm:text-base">
              Talk to a licensed agent about leasing, buying, selling, or
              managing a property.
            </p>
          </div>

          <a
            href="mailto:hello@estatehub.ph"
            className="shrink-0 rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-mint"
          >
            Contact us
          </a>
        </div>
      </Reveal>
    </section>
  );
}
