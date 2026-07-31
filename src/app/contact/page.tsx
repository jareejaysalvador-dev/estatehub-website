import type { Metadata } from "next";
import { Clock, EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "./ContactForm";
import { getSiteSettings } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to a licensed EstateHub broker about buying, selling, leasing, managing, or a business property in the Philippines.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail ?? "hello@estatehub.ph";
  const phone = settings?.contactPhone ?? null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-[32px] font-medium text-ink lg:text-[40px]">
          Contact us
        </h1>
        <p className="mt-3 text-base text-slate">
          Tell us what you need and a licensed broker will follow up, one
          person, from your first message onward.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="flex flex-col gap-4 lg:h-fit">
          <div className="rounded-2xl border border-hairline bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate">
              Other ways to reach us
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-ink/85">
              <li className="flex items-center gap-2">
                <EnvelopeSimple size={18} weight="light" className="text-emerald-deep" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-ink">
                  {email}
                </a>
              </li>
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone size={18} weight="light" className="text-emerald-deep" aria-hidden="true" />
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-ink">
                    {phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Clock size={18} weight="light" className="text-emerald-deep" aria-hidden="true" />
                <span>Manila time, but tell us yours</span>
              </li>
            </ul>
            <a
              href="#messenger"
              className="mt-4 inline-block text-sm font-medium text-emerald-deep underline underline-offset-4 hover:text-ink"
            >
              Message us on Messenger
            </a>
          </div>

          <div className="rounded-2xl border border-hairline bg-white p-6">
            <p className="text-sm leading-relaxed text-slate">
              Every inquiry is handled by a PRC-licensed broker. We will
              never ask you to send payment before a signed agreement.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
