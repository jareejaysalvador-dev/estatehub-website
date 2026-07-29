import Link from "next/link";
import { ChatCircleDots } from "@phosphor-icons/react/dist/ssr";

// Phone-only sticky conversion bar (responsive-design-spec.md's one new
// pattern): the three mobile-dominant journeys land on this exact page, so
// contact stays reachable without scrolling back to the agent block.
export function StickyInquireBar({ listingSlug }: { listingSlug: string }) {
  const inquiryHref = `/contact?property=${encodeURIComponent(listingSlug)}&intent=buy`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-hairline bg-porcelain/95 p-3 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <Link
        href={inquiryHref}
        className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-emerald px-4 text-base font-semibold text-ink"
      >
        Inquire
      </Link>
      <a
        href="#messenger"
        aria-label="Message us instead"
        className="flex min-h-11 w-14 items-center justify-center rounded-full border border-slate/50 text-ink"
      >
        <ChatCircleDots size={20} weight="light" aria-hidden="true" />
      </a>
    </div>
  );
}
