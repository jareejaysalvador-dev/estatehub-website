import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Terms of Use",
  "Terms governing use of the EstateHub.ph website.",
);

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
      <h1 className="font-display text-[32px] font-medium text-ink lg:text-[40px]">
        Terms of Use
      </h1>

      <p className="mt-4 rounded-xl bg-emerald/10 px-4 py-3 text-sm text-ink">
        Draft pending legal review. This page has not been reviewed by
        counsel and should not be treated as final before launch.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-ink/85">
        <section>
          <h2 className="text-lg font-semibold text-ink">Using this site</h2>
          <p className="mt-2">
            This website provides information about EstateHub&apos;s
            brokerage services and property listings. Browsing listings or
            submitting an inquiry does not create a client relationship;
            that begins when you and a licensed broker agree to work
            together.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Property information</h2>
          <p className="mt-2">
            We aim to keep listing details accurate, but prices,
            availability, and specifications can change. Confirm current
            details with your broker before making a decision.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">No professional advice</h2>
          <p className="mt-2">
            General information on this site, including content about
            overseas transactions and Powers of Attorney, is orientation
            only and not legal or financial advice. Consult a qualified
            professional for advice specific to your situation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Contact us</h2>
          <p className="mt-2">
            Questions about these terms can be sent to{" "}
            <a href="mailto:hello@estatehub.ph" className="text-emerald-deep underline underline-offset-4">
              hello@estatehub.ph
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
