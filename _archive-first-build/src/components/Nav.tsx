"use client";

import { useState } from "react";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";

const LINKS = [
  { label: "Lease", href: "#lease" },
  { label: "Property Management", href: "#property-management" },
  { label: "Sales", href: "#sales" },
  { label: "Business Solutions", href: "#business-solutions" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/brand/mark-emerald.svg"
            alt=""
            width={26}
            height={26}
            className="shrink-0"
          />
          <span className="font-display text-sm tracking-[0.2em] text-porcelain">
            <span className="font-light">ESTATE</span>
            <span className="font-bold">HUB</span>
            <span className="font-semibold text-emerald">.PH</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-porcelain/75 transition-colors hover:text-porcelain"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contact"
            className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-mint"
          >
            Contact us
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-porcelain lg:hidden"
        >
          {open ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line/60 bg-ink px-6 py-4 lg:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm text-porcelain/85"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-emerald px-5 py-2.5 text-center text-sm font-semibold text-ink"
          >
            Contact us
          </a>
        </nav>
      )}
    </header>
  );
}
