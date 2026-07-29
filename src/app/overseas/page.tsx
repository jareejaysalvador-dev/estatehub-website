import Link from "next/link";
import type { Metadata } from "next";
import {
  Clock,
  FileText,
  SealCheck,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Buying and Owning Property from Abroad",
  description:
    "How overseas Filipinos and other overseas buyers purchase, sell, and manage property in the Philippines remotely through EstateHub, including Power of Attorney and timezone-friendly contact.",
};

const PROCESS_STEPS = [
  "Consult with your broker online, on your schedule and timezone",
  "Share your requirements and budget; your broker shortlists properties and sends photos and video",
  "Decide remotely, with your broker representing you at viewings if needed",
  "Sign a Special Power of Attorney (SPA) so your broker or a trusted representative can act on your behalf",
  "Your broker manages paperwork, payments coordination, and closing",
  "For rentals or ongoing ownership, Property Management takes over, with reporting sent to you",
];

const TRUST_POINTS = [
  {
    icon: SealCheck,
    title: "Licensed broker, one point of contact",
    detail:
      "The same PRC-licensed broker manages your transaction from first consultation to closing or turnover.",
  },
  {
    icon: ShieldCheck,
    title: "Real company, real address",
    detail:
      "EstateHub operates in the Philippines. Verify us before sending any document or payment, and never rely on requests that only arrive by chat.",
  },
  {
    icon: Clock,
    title: "Contact built around your timezone",
    detail:
      "Tell us your preferred time and timezone when you inquire. We do not assume you keep Manila office hours.",
  },
];

export default function OverseasPage() {
  return (
    <>
      <section className="surface-dark">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <h1 className="font-display text-[32px] font-medium leading-[1.15] text-porcelain lg:text-[44px]">
                Buying from abroad, handled.
              </h1>
              <p className="mt-4 text-lg text-porcelain/85">
                For OFWs and overseas Filipinos, and other overseas buyers: a
                licensed broker manages your purchase, sale, or rental from
                the Philippines, while you stay wherever you are.
              </p>
              <Link
                href="/contact?intent=overseas"
                className="mt-6 inline-block rounded-full bg-emerald px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-mint"
              >
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <Reveal>
          <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
            How a remote transaction works
          </h2>
        </Reveal>
        <Reveal delay={0.06} className="mt-8">
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-hairline bg-white p-5"
              >
                <span
                  aria-hidden="true"
                  className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald/12 text-sm font-semibold text-emerald-deep"
                >
                  {i + 1}
                </span>
                <p className="text-sm text-ink/85">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="border-y border-hairline bg-white/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-start gap-4">
              <FileText
                size={28}
                weight="light"
                className="mt-1 shrink-0 text-emerald-deep"
                aria-hidden="true"
              />
              <div className="max-w-2xl">
                <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
                  About the Special Power of Attorney (SPA)
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink/85">
                  Most overseas transactions use a Special Power of Attorney:
                  a signed, notarized document that authorizes someone in the
                  Philippines, often your broker or a person you trust, to
                  sign specific documents or complete specific steps on your
                  behalf while you remain abroad. It is limited to the powers
                  you specify, not a general authority over your affairs.
                </p>
                <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate">
                  This is general orientation, not legal advice. Requirements
                  vary by country and by transaction. Your broker will walk
                  you through the specific document and process for your
                  situation, and we recommend having it reviewed by a
                  lawyer or your embassy or consulate before signing.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <Reveal>
          <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
            Why overseas buyers work with us
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRUST_POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.06}>
              <div className="rounded-2xl border border-hairline bg-white p-6">
                <point.icon
                  size={24}
                  weight="light"
                  className="text-emerald-deep"
                  aria-hidden="true"
                />
                <h3 className="mt-3 text-base font-semibold text-ink">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-slate">{point.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:pb-24">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-hairline bg-white px-8 py-12 md:flex-row md:items-center md:justify-between lg:px-12">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
                Ready to start, from wherever you are?
              </h2>
              <p className="mt-3 max-w-md text-base text-slate">
                Browse current listings, or go straight to a broker
                conversation on your schedule.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="rounded-full border border-slate/50 px-6 py-3 text-center text-base font-medium text-ink transition-colors hover:border-emerald-deep"
              >
                Browse properties
              </Link>
              <Link
                href="/contact?intent=overseas"
                className="rounded-full bg-emerald px-7 py-3 text-center text-base font-semibold text-ink transition-colors hover:bg-mint"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
