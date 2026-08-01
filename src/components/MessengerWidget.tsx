import { ChatCircleDots } from "@phosphor-icons/react/dist/ssr";
import { getSiteSettings } from "@/sanity/queries";

// Renders nothing until a real Facebook Page ID is entered in Sanity's Site
// Settings (security spec: no fake bubble, no third-party script loaded for
// an unconfigured channel). Links out to m.me rather than embedding the FB
// SDK, keeping the page free of a render-blocking third-party script.
export async function MessengerWidget() {
  const settings = await getSiteSettings();
  const pageId = settings?.facebookPageId;
  if (!pageId) return null;

  return (
    <a
      id="messenger"
      href={`https://m.me/${pageId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Messenger"
      className="fixed bottom-5 right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-emerald text-ink shadow-lg transition-colors hover:bg-mint"
    >
      <ChatCircleDots size={26} weight="light" aria-hidden="true" />
    </a>
  );
}
