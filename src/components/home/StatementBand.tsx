import { IdentificationBadge, UserFocus, Handshake } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";

const PROOFS = [
  { icon: IdentificationBadge, label: "PRC-licensed brokers" },
  { icon: UserFocus, label: "One point of contact" },
  { icon: Handshake, label: "Buyer and seller representation" },
];

export function StatementBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
      <Reveal>
        <p className="max-w-3xl text-2xl leading-snug text-ink lg:text-[28px]">
          EstateHub is a full-service brokerage. A licensed broker handles
          your whole transaction, from first conversation to closing, so you
          never chase listings or paperwork alone.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {PROOFS.map((proof) => (
            <li
              key={proof.label}
              className="flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-ink/85"
            >
              <proof.icon
                size={18}
                weight="light"
                className="text-emerald-deep"
                aria-hidden="true"
              />
              {proof.label}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
