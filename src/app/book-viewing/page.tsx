import type { Metadata } from "next";
import { BookingForm } from "./BookingForm";

// Private, per-lead link sent by an agent over Messenger - never linked
// from anywhere on the site itself, and explicitly noindexed as a second
// layer of defense against it ever surfacing in search regardless.
export const metadata: Metadata = {
  title: "Book a Viewing",
  robots: { index: false, follow: false },
};

export default function BookViewingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
      <h1 className="font-display text-[32px] font-medium text-ink lg:text-[40px]">
        Book a viewing
      </h1>
      <p className="mt-3 text-base text-slate">
        Pick a time that works for you - your broker will confirm it shortly.
      </p>

      <div className="mt-10">
        <BookingForm />
      </div>
    </div>
  );
}
