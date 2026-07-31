"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mobile-only: the header drops "Contact us" below md to make room for the
// company wordmark (see Header.tsx's Wordmark), so this keeps it reachable
// without scrolling back up. Bottom-left, mirroring MessengerWidget's
// bottom-right placement so the two can never collide. Suppressed on
// property detail pages, which already have their own more specific
// StickyInquireBar (Inquire + Messenger, scoped to that one listing).
export function FloatingContactButton() {
  const pathname = usePathname();
  const isPropertyDetail = /^\/properties\/[^/]+/.test(pathname);
  if (isPropertyDetail) return null;

  return (
    <Link
      href="/contact"
      className="fixed bottom-5 left-5 z-40 flex min-h-11 items-center justify-center rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-ink shadow-lg transition-colors hover:bg-mint md:hidden"
    >
      Contact us
    </Link>
  );
}
