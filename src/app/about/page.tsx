import Link from "next/link";
import type { Metadata } from "next";
import {
  IdentificationBadge,
  MapPinLine,
  Translate,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { BROKERS } from "@/data/brokers";

export const metadata: Metadata = {
  title: "About EstateHub",
  description:
    "EstateHub is a full-service Philippine real estate brokerage: licensed brokers, one point of contact, for buying, selling, leasing, and managing property.",
};

const PRINCIPLES = [
  {
    icon: IdentificationBadge,
    title: "Licensed, not just listed",
    detail:
      "Every transaction is reviewed by a PRC-licensed real estate broker before it closes.",
  },
  {
    icon: UsersThree,
    title: "One person, start to finish",
    detail:
      "The broker you first speak with stays with your transaction through closing or turnover.",
  },
  {
    icon: MapPinLine,
    title: "Local expertise, real property",
    detail:
      "We work the neighborhoods we list in, with authentic photography and honest specifics.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <Reveal>
        <div className="max-w-2xl">
          <h1 className="font-display text-[32px] font-medium text-ink lg:text-[40px]">
            Building generational wealth, one move at a time.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/85">
            EstateHub is a full-service Philippine real estate brokerage. We
            do not operate a self-listing marketplace: every sale, lease,
            or management engagement is handled end to end by a licensed
            broker, so you have one person to call instead of a directory
            of strangers.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 flex max-w-2xl flex-col lg:mt-20">
        {PRINCIPLES.map((principle, i) => (
          <Reveal key={principle.title} delay={i * 0.06}>
            <div
              className={`flex gap-4 py-6 ${i === 0 ? "pt-0" : "border-t border-hairline"}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald/12 text-emerald-deep">
                <principle.icon size={20} weight="light" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-ink">{principle.title}</h2>
                <p className="mt-1 text-sm text-slate">{principle.detail}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-14 lg:mt-20">
        <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
          Our brokers
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate">
          Our roster is growing. Meet the broker confirmed so far, with
          more to be added as they join the team.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BROKERS.map((broker) => (
            <div key={broker.id} className="rounded-2xl border border-hairline bg-white p-6">
              <h3 className="text-base font-semibold text-ink">{broker.name}</h3>
              <p className="mt-1 text-sm text-slate">{broker.prcLicense}</p>
              <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate">
                <span className="flex items-center gap-1.5">
                  <MapPinLine size={16} weight="light" aria-hidden="true" />
                  <span className="sr-only">Serves: </span>
                  {broker.areas}
                </span>
                <span className="flex items-center gap-1.5">
                  <Translate size={16} weight="light" aria-hidden="true" />
                  <span className="sr-only">Speaks: </span>
                  {broker.languages}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink/85">{broker.bio}</p>
              {broker.isSample && (
                <p className="mt-2 text-xs text-error">
                  Placeholder entry, pending real roster intake.
                </p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-14 lg:mt-20">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-hairline bg-white px-8 py-12 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
              Ready to make your next move?
            </h2>
            <p className="mt-3 max-w-md text-base text-slate">
              Talk to a licensed broker about buying, selling, leasing, or
              managing a property.
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
    </div>
  );
}
