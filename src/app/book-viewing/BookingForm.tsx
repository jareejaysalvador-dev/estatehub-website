"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WarningCircle } from "@phosphor-icons/react";

// Same window.location.search + useSyncExternalStore pattern as
// ContactForm.tsx and PropertiesResults.tsx - sidesteps the documented
// useSearchParams() + Suspense hang in this Next.js/Turbopack setup (see
// ContactForm.tsx's own comment for the full history).
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

type SubmitState = "idle" | "sending" | "success" | "error";

interface Prefill {
  firstName: string;
  lastName: string;
  phone: string;
  property: string;
}

export function BookingForm() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const token = new URLSearchParams(search).get("token") ?? "";

  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  // setState only ever happens inside the .then()/.catch() callbacks below,
  // never synchronously in the effect body - same reasoning as
  // ContactForm.tsx's getInquiryReference effect (react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!search || !token) return;
    let cancelled = false;
    fetch(`/api/viewing/${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setFetchFailed(true);
          return;
        }
        const data = await res.json();
        setPrefill({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          property: data.property ?? "",
        });
      })
      .catch(() => {
        if (!cancelled) setFetchFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [search, token]);

  // Derived, not stored: covers both "no token in the URL at all" and a
  // failed fetch, without an extra state variable to keep in sync.
  const isInvalid = (search !== "" && !token) || fetchFailed;

  if (isInvalid) {
    return (
      <div className="rounded-2xl border border-hairline bg-white p-8 text-center">
        <p className="text-base font-medium text-ink">This booking link isn&apos;t valid.</p>
        <p className="mt-2 text-sm text-slate">Ask your broker to send you a new one.</p>
      </div>
    );
  }

  if (!prefill) {
    return (
      <p className="text-base text-slate" role="status" aria-live="polite">
        Loading your booking link…
      </p>
    );
  }

  return <BookingFormFields token={token} prefill={prefill} />;
}

function BookingFormFields({ token, prefill }: { token: string; prefill: Prefill }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  const [phone, setPhone] = useState(prefill.phone);
  const [property, setProperty] = useState(prefill.property);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [errors]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const viewersRaw = data.get("viewersCount");
    const payload = {
      viewingDate: String(data.get("viewingDate") ?? ""),
      viewingTime: String(data.get("viewingTime") ?? ""),
      viewingProperty: property.trim(),
      phone: phone.trim(),
      viewersCount: viewersRaw ? Number(viewersRaw) : null,
    };

    const fieldErrors: Record<string, string> = {};
    if (!payload.viewingDate) fieldErrors.viewingDate = "Choose a date.";
    if (!payload.viewingTime) fieldErrors.viewingTime = "Choose a preferred time.";
    if (!payload.phone) fieldErrors.phone = "Enter a contact number.";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch(`/api/viewing/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) {
          setErrors(body.errors);
          setStatus("idle");
          return;
        }
        setStatus("error");
        return;
      }
      const body = await res.json();
      if (body.delivered) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-hairline bg-white p-8 text-center">
        <p className="text-base font-medium text-ink">
          Viewing request received. Your broker will confirm your appointment shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border border-error/40 bg-error/5 p-5"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-error">
            <WarningCircle size={18} weight="light" aria-hidden="true" />
            Please fix the following before sending:
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#field-${field}`} className="text-sm text-error underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-1 text-sm font-medium text-ink">Name</p>
        <p className="text-base text-ink/85">
          {prefill.firstName} {prefill.lastName}
        </p>
      </div>

      {prefill.property ? (
        // Already known from the lead's original inquiry - shown, not
        // asked. Matches the spec's own intent ("pre-filled, don't ask
        // again") and Name's treatment just above, rather than making the
        // lead confirm something the agent already told them.
        <div>
          <p className="mb-1 text-sm font-medium text-ink">Property</p>
          <p className="text-base text-ink/85">{prefill.property}</p>
          <input type="hidden" name="viewingProperty" value={property} />
        </div>
      ) : (
        // Not known upstream (a general inquiry) - optional, not required:
        // nothing here should block submission over a field the agent may
        // already know verbally and simply didn't capture earlier.
        <div>
          <label htmlFor="field-viewingProperty" className="mb-1 block text-sm font-medium text-ink">
            Property <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id="field-viewingProperty"
            name="viewingProperty"
            type="text"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="field-viewingDate" className="mb-1 block text-sm font-medium text-ink">
            Preferred date
          </label>
          <input
            id="field-viewingDate"
            name="viewingDate"
            type="date"
            min={today}
            aria-invalid={Boolean(errors.viewingDate)}
            aria-describedby={errors.viewingDate ? "field-viewingDate-error" : undefined}
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
          {errors.viewingDate && (
            <p id="field-viewingDate-error" className="mt-1 text-sm text-error">
              {errors.viewingDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-viewingTime" className="mb-1 block text-sm font-medium text-ink">
            Preferred time
          </label>
          <input
            id="field-viewingTime"
            name="viewingTime"
            type="time"
            aria-invalid={Boolean(errors.viewingTime)}
            aria-describedby={errors.viewingTime ? "field-viewingTime-error" : undefined}
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
          {errors.viewingTime && (
            <p id="field-viewingTime-error" className="mt-1 text-sm text-error">
              {errors.viewingTime}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="field-phone" className="mb-1 block text-sm font-medium text-ink">
            Contact number
          </label>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "field-phone-error" : undefined}
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
          {errors.phone && (
            <p id="field-phone-error" className="mt-1 text-sm text-error">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-viewersCount" className="mb-1 block text-sm font-medium text-ink">
            Number of viewers <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id="field-viewersCount"
            name="viewersCount"
            type="number"
            min={1}
            inputMode="numeric"
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-11 items-center justify-center rounded-full bg-emerald px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-mint disabled:opacity-40"
      >
        {status === "sending" ? "Sending…" : "Request viewing"}
      </button>
      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Sending your request" : ""}
        {status === "error" ? "Something went wrong. Please try again." : ""}
      </p>
      {status === "error" && (
        <p className="text-sm text-error">
          Something went wrong sending your request. Please try again, or message your broker on Messenger instead.
        </p>
      )}
    </form>
  );
}
