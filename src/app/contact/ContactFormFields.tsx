"use client";

import { useEffect, useRef, useState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import type { Listing } from "@/sanity/types";

const INTENTS = [
  { value: "buy", label: "Buying a property" },
  { value: "rent", label: "Renting a property" },
  { value: "sell", label: "Selling a property" },
  { value: "manage", label: "Property management" },
  { value: "business", label: "Business solutions" },
  { value: "overseas", label: "Buying or owning from abroad" },
] as const;

type SubmitState = "idle" | "sending" | "delivered" | "undelivered" | "error";

export function ContactFormFields({
  initialIntent,
  propertySlug,
  listing,
}: {
  initialIntent: string;
  propertySlug: string;
  listing: Listing | undefined;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  // useState's lazy-initializer form (not useRef(Date.now())) is the
  // React-sanctioned way to compute an impure value once at mount -
  // calling Date.now() directly in the render body is flagged by the
  // react-hooks/purity rule; the setter is intentionally unused.
  const [startedAt] = useState(() => Date.now());
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [errors]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      intent: String(data.get("intent") ?? ""),
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      preferredChannel: String(data.get("preferredChannel") ?? ""),
      preferredTime: String(data.get("preferredTime") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      property: propertySlug,
      company: String(data.get("company") ?? ""),
      startedAt,
    };

    const fieldErrors: Record<string, string> = {};
    if (!payload.intent) fieldErrors.intent = "Choose what you'd like help with.";
    if (!payload.name) fieldErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      fieldErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/inquiry", {
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
      setStatus(body.delivered ? "delivered" : "undelivered");
      if (body.delivered) form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "delivered" || status === "undelivered") {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-hairline bg-white p-8">
        <h2 className="text-lg font-semibold text-ink">
          {status === "delivered" ? "Message sent" : "Message received"}
        </h2>
        <p className="mt-2 max-w-prose text-base text-slate">
          {status === "delivered"
            ? "A broker will follow up using the channel you preferred."
            : "Our inbox integration isn't fully connected yet in this environment, so please also reach us directly while we finish wiring it up."}
        </p>
        <a
          href="#messenger"
          className="mt-4 inline-block text-sm font-medium text-emerald-deep underline underline-offset-4 hover:text-ink"
        >
          Message us on Messenger instead
        </a>
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

      {listing && (
        <p className="rounded-xl bg-emerald/10 px-4 py-3 text-sm text-ink">
          Regarding: <strong>{listing.title}</strong>
        </p>
      )}

      <div aria-hidden="true" className="absolute left-[-9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset id="field-intent">
        <legend className="mb-2 text-sm font-medium text-ink">
          What would you like help with?
        </legend>
        <div
          role="radiogroup"
          aria-invalid={Boolean(errors.intent)}
          aria-describedby={errors.intent ? "field-intent-error" : undefined}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {INTENTS.map((intent) => (
            <label
              key={intent.value}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-slate/40 px-3 py-2 text-sm text-ink has-[:checked]:border-emerald-deep has-[:checked]:bg-emerald/8"
            >
              <input
                type="radio"
                name="intent"
                value={intent.value}
                defaultChecked={intent.value === initialIntent}
                className="h-4 w-4 accent-emerald-deep"
              />
              {intent.label}
            </label>
          ))}
        </div>
        {errors.intent && (
          <p id="field-intent-error" className="mt-1 text-sm text-error">
            {errors.intent}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="field-name" className="mb-1 block text-sm font-medium text-ink">
          Full name
        </label>
        <input
          id="field-name"
          name="name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "field-name-error" : undefined}
          className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
        />
        {errors.name && (
          <p id="field-name-error" className="mt-1 text-sm text-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="field-email" className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="field-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "field-email-error" : undefined}
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
          {errors.email && (
            <p id="field-email-error" className="mt-1 text-sm text-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="field-phone" className="mb-1 block text-sm font-medium text-ink">
            Phone <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id="field-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">
          Preferred contact channel <span className="font-normal text-slate">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {["email", "phone", "messenger"].map((channel) => (
            <label
              key={channel}
              className="flex min-h-11 items-center gap-2 rounded-full border border-slate/40 px-4 py-2 text-sm capitalize text-ink has-[:checked]:border-emerald-deep has-[:checked]:bg-emerald/8"
            >
              <input
                type="radio"
                name="preferredChannel"
                value={channel}
                className="h-4 w-4 accent-emerald-deep"
              />
              {channel}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="field-preferred-time" className="mb-1 block text-sm font-medium text-ink">
          Preferred time to contact you{" "}
          <span className="font-normal text-slate">(optional, include your timezone)</span>
        </label>
        <input
          id="field-preferred-time"
          name="preferredTime"
          type="text"
          placeholder="e.g. weekday evenings, GMT+8"
          className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink placeholder:text-slate focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="field-message" className="mb-1 block text-sm font-medium text-ink">
          Message <span className="font-normal text-slate">(optional)</span>
        </label>
        <textarea
          id="field-message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-slate/50 px-3 py-2.5 text-base text-ink focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex min-h-11 items-center justify-center rounded-full bg-emerald px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-mint disabled:opacity-40"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Sending your message" : ""}
        {status === "error" ? "Something went wrong. Please try again or use Messenger." : ""}
      </p>
      {status === "error" && (
        <p className="text-sm text-error">
          Something went wrong sending your message. Please try again, or
          message us on Messenger instead.
        </p>
      )}
    </form>
  );
}
