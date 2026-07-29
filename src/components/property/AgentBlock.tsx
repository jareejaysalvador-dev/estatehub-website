import Link from "next/link";
import { ChatCircleDots, Phone } from "@phosphor-icons/react/dist/ssr";
import type { Broker } from "@/data/brokers";

export function AgentBlock({
  broker,
  listingSlug,
  listingTitle,
}: {
  broker: Broker;
  listingSlug: string;
  listingTitle: string;
}) {
  const inquiryHref = `/contact?property=${encodeURIComponent(listingSlug)}&intent=buy`;

  return (
    <div className="rounded-2xl border border-hairline bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-slate">
        Your broker for this property
      </p>
      <h2 className="mt-2 text-lg font-semibold text-ink">{broker.name}</h2>
      <p className="mt-1 text-sm text-slate">{broker.prcLicense}</p>
      {broker.isSample && (
        <p className="mt-1 text-xs text-error">
          Sample broker. Real roster pending intake, see CLAUDE.md.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href={inquiryHref}
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-emerald px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-mint"
        >
          Inquire about {listingTitle}
        </Link>
        <a
          href={`tel:${broker.phone.replace(/\s+/g, "")}`}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate/50 px-6 py-3 text-base font-medium text-ink transition-colors hover:border-emerald-deep"
        >
          <Phone size={18} weight="light" aria-hidden="true" />
          {broker.phone}
        </a>
        <a
          href="#messenger"
          className="flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium text-emerald-deep underline underline-offset-4 hover:text-ink"
        >
          <ChatCircleDots size={16} weight="light" aria-hidden="true" />
          Message us instead
        </a>
      </div>
    </div>
  );
}
