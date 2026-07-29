import Link from "next/link";
import { CaretDown, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import type { ServiceContent } from "@/data/services";

export function ServiceTemplate({ service }: { service: ServiceContent }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 hidden text-sm text-slate lg:block">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <CaretRight size={12} weight="bold" aria-hidden="true" />
          <li>Services</li>
          <CaretRight size={12} weight="bold" aria-hidden="true" />
          <li aria-current="page" className="text-ink">
            {service.label}
          </li>
        </ol>
      </nav>

      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-emerald-deep">
            {service.label}
          </p>
          <h1 className="mt-2 font-display text-[32px] font-medium leading-[1.15] text-ink lg:text-[44px]">
            {service.heroLine}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/85">
            {service.intro}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-emerald px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-mint"
          >
            Contact us
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mt-14 lg:mt-20">
        <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
          How it works
        </h2>
        <ol className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {service.steps.map((step, i) => (
            <li key={step} className="rounded-2xl border border-hairline bg-white p-5">
              <span
                aria-hidden="true"
                className="tnum flex h-9 w-9 items-center justify-center rounded-full bg-emerald/12 text-sm font-semibold text-emerald-deep"
              >
                {i + 1}
              </span>
              <p className="mt-3 text-sm text-ink/85">{step}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 lg:mt-20">
        <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
          Who this is for
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {service.whoFor.map((item) => (
            <div key={item.title} className="rounded-2xl border border-hairline bg-white p-6">
              <h3 className="text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-slate">{item.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {service.showOverseasLink && (
        <Reveal delay={0.14} className="surface-dark mt-14 rounded-2xl px-8 py-10 lg:mt-20 lg:px-12">
          <h2 className="text-lg font-semibold text-porcelain">
            Based outside the Philippines?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-on-dark">
            This works the same way for overseas Filipinos and other
            overseas buyers or owners, with remote-friendly contact and
            document handling.
          </p>
          <Link
            href="/overseas"
            className="mt-4 inline-block text-sm font-medium text-mint underline underline-offset-4 hover:text-porcelain"
          >
            See how overseas buying and ownership works
          </Link>
        </Reveal>
      )}

      <Reveal delay={service.showOverseasLink ? 0.18 : 0.14} className="mt-14 max-w-3xl lg:mt-20">
        <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
          Frequently asked questions
        </h2>
        <div className="mt-6 flex flex-col">
          {service.faq.map((item, i) => (
            <details
              key={item.question}
              className={`group py-4 ${i === 0 ? "" : "border-t border-hairline"}`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink marker:content-none">
                {item.question}
                <CaretDown
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 text-slate transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-slate">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
