import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EstateHub.ph collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
      <h1 className="font-display text-[32px] font-medium text-ink lg:text-[40px]">
        Privacy Policy
      </h1>

      <p className="mt-4 rounded-xl bg-emerald/10 px-4 py-3 text-sm text-ink">
        Draft pending legal review. This page has not been reviewed by
        counsel and should not be treated as final before launch.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-ink/85">
        <section>
          <h2 className="text-lg font-semibold text-ink">What we collect</h2>
          <p className="mt-2">
            When you use our contact form, we collect the information you
            provide: your name, email address, and, if you choose to share
            them, your phone number, preferred contact time, and message.
            If you inquire about a specific property, we record which
            property you asked about.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">How we use it</h2>
          <p className="mt-2">
            We use this information to connect you with a licensed broker
            and follow up on your inquiry. We do not sell your personal
            data. We do not use it for purposes beyond responding to your
            inquiry and providing the service you requested.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">How long we keep it</h2>
          <p className="mt-2">
            We retain inquiry information for as long as reasonably
            necessary to respond to you and maintain records of an active
            transaction, and delete or anonymize it afterward, consistent
            with the Philippine Data Privacy Act of 2012.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Your rights</h2>
          <p className="mt-2">
            Under the Data Privacy Act, you may request access to,
            correction of, or deletion of your personal data. Contact us
            using the details below to make a request.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Contact us</h2>
          <p className="mt-2">
            Questions about this policy or your data can be sent to{" "}
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
