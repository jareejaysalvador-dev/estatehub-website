"use client";

import { useSyncExternalStore } from "react";
import { getListing } from "@/data/listings";
import { ContactFormFields } from "./ContactFormFields";

// Reads query params via window.location instead of next/navigation's
// useSearchParams(): this avoids a Suspense boundary entirely. (A Suspense
// + useSearchParams + multi-field-form combination reproduced a permanent
// stuck-fallback hang in this Next.js 16 / Turbopack dev environment -
// isolated down to a minimal two-field reproduction, survived a full cache
// + dev server restart, and wasn't fixed by force-dynamic or restructuring
// the suspended component's size. This sidesteps it rather than depending
// on a root cause in a framework newer than this assistant's training
// data. Revisit if upgrading Next/React resolves the underlying issue.)
//
// useSyncExternalStore (not useEffect+useState) reads window.location:
// same hydration-safe / lint-clean pattern as Reveal.tsx's reduced-motion
// subscription - reading an external, non-React source must not call
// setState synchronously inside an effect (react-hooks/set-state-in-effect).
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getSnapshot() {
  return window.location.search;
}

function getServerSnapshot() {
  return "";
}

export function ContactForm() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const params = new URLSearchParams(search);
  const propertySlug = params.get("property") ?? "";
  const initialIntent = params.get("intent") ?? "";
  const listing = propertySlug ? getListing(propertySlug) : undefined;

  // Force a fresh mount once the real client-side location is read (server
  // snapshot is always ""), so the intent radio group's `defaultChecked`
  // (an uncontrolled-input default that only applies at mount) reflects
  // the real value instead of the empty server-rendered first pass. Keying
  // on `search` directly is sufficient: it only actually changes (and only
  // needs to) when there's a real, non-empty query string to apply.
  return (
    <ContactFormFields
      key={search}
      initialIntent={initialIntent}
      propertySlug={propertySlug}
      listing={listing}
    />
  );
}
