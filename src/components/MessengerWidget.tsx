"use client";

import { ChatCircleDots } from "@phosphor-icons/react";

// Renders nothing until a real Facebook page ID exists (security spec: no
// fake bubble, no third-party script loaded for an unconfigured channel).
// When configured, this links out to m.me rather than embedding the FB SDK,
// keeping the page free of a render-blocking third-party script.
const PAGE_ID = process.env.NEXT_PUBLIC_FB_PAGE_ID;

export function MessengerWidget() {
  if (!PAGE_ID) return null;

  return (
    <a
      href={`https://m.me/${PAGE_ID}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Messenger"
      className="fixed bottom-5 right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-emerald text-ink shadow-lg transition-colors hover:bg-mint"
    >
      <ChatCircleDots size={26} weight="light" aria-hidden="true" />
    </a>
  );
}
