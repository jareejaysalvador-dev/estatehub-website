import { SealCheck, UserFocus, FileText } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";

const POINTS = [
  {
    icon: SealCheck,
    title: "Licensed on every transaction",
    detail:
      "A PRC-licensed real estate broker reviews and signs off on every deal before it closes.",
  },
  {
    icon: UserFocus,
    title: "One broker, start to finish",
    detail:
      "The same person from your first inquiry through closing or turnover. No handoffs, no call center.",
  },
  {
    icon: FileText,
    title: "Clear terms before you commit",
    detail:
      "Fees, timelines, and obligations in writing up front, so nothing surprises you at signing.",
  },
];

export function WhyEstateHub() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
            Why people trust EstateHub
          </h2>
        </Reveal>

        <div className="flex flex-col lg:col-span-7">
          {POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 0.06}>
              <div
                className={`flex gap-4 py-6 ${i === 0 ? "pt-0" : "border-t border-hairline"}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald/12 text-emerald-deep">
                  <point.icon size={20} weight="light" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate">{point.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
