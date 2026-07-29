import { ShieldCheck, MapPinLine, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const POINTS = [
  {
    icon: ShieldCheck,
    label: "Licensed brokers",
    detail: "Every transaction is reviewed by a PRC-licensed broker before it closes.",
  },
  {
    icon: MapPinLine,
    label: "Local, not remote",
    detail: "Agents who work the neighborhoods they sell, not a call center script.",
  },
  {
    icon: UsersThree,
    label: "One point of contact",
    detail: "The same person from your first inquiry through move-in or turnover.",
  },
];

export function TrustSection() {
  return (
    <section className="border-y border-line/60 bg-navy/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 md:py-24 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-2xl font-bold tracking-tight text-porcelain sm:text-3xl">
            Why people trust EstateHub
          </h2>
          <p className="mt-4 max-w-md text-sm text-slate sm:text-base">
            Transparent terms, licensed people on every deal, and one point of
            contact from your first call to the signed contract.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-7">
          {POINTS.map((point, i) => (
            <Reveal key={point.label} delay={i * 0.08}>
              <div
                className={`flex gap-4 ${i === 0 ? "" : "border-t border-line/60 pt-6"}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald/12 text-emerald">
                  <point.icon size={20} weight="light" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-porcelain">
                    {point.label}
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
