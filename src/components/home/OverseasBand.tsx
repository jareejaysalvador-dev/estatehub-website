import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  "Consult with your broker online, on your schedule and timezone",
  "We prepare documents and walk you through the Power of Attorney",
  "Close remotely while your broker represents you on the ground",
];

export function OverseasBand() {
  return (
    <section className="surface-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <Reveal>
          <h2 className="text-[22px] font-bold tracking-tight text-porcelain lg:text-[28px]">
            Buying from abroad, handled.
          </h2>
          <p className="mt-4 max-w-md text-base text-slate-on-dark">
            For OFWs and overseas Filipinos: one licensed broker manages the
            whole purchase while you stay where you are.
          </p>
          <Link
            href="/overseas"
            className="mt-6 inline-block text-sm font-medium text-mint underline underline-offset-4 hover:text-porcelain"
          >
            How overseas buying works
          </Link>
        </Reveal>

        <ol className="flex flex-col">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className={i === 0 ? "" : "border-t border-hairline-dark"}
            >
              <Reveal delay={0.08 + i * 0.1} className="flex gap-4 py-4">
                <span
                  aria-hidden="true"
                  className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-sm font-semibold text-mint"
                >
                  {i + 1}
                </span>
                <p className="text-base text-porcelain/90">{step}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
