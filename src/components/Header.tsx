"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretDown, List, MagnifyingGlass, X } from "@phosphor-icons/react";

const SERVICES = [
  { label: "Sales", href: "/services/sales" },
  { label: "Lease", href: "/services/lease" },
  { label: "Property Management", href: "/services/property-management" },
  { label: "Business Solutions", href: "/services/business-solutions" },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/brand/icon-primary.svg"
        alt=""
        width={compact ? 30 : 32}
        height={compact ? 30 : 32}
        priority
      />
      {!compact && (
        <span className="font-wordmark text-sm tracking-[0.18em] text-ink">
          <span className="font-light">ESTATE</span>
          <span className="font-bold">HUB</span>
          <span className="font-semibold text-emerald-deep">.PH</span>
        </span>
      )}
    </span>
  );
}

function SearchForm({
  id,
  autoFocus = false,
  className = "",
}: {
  id: string;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <form action="/properties" method="GET" role="search" className={className}>
      <label htmlFor={id} className="sr-only">
        Search properties
      </label>
      <div className="flex items-center gap-2 rounded-full border border-slate/50 bg-white/60 px-4 py-2 focus-within:border-emerald-deep">
        <MagnifyingGlass size={16} weight="light" className="shrink-0 text-slate" aria-hidden="true" />
        <input
          id={id}
          name="query"
          type="search"
          autoFocus={autoFocus}
          placeholder="Makati, condo, lot..."
          className="w-full bg-transparent text-base text-ink placeholder:text-slate focus:outline-none"
        />
      </div>
    </form>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close everything on navigation
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Services dropdown: outside click + Esc + arrow keys
  useEffect(() => {
    if (!servicesOpen) return;

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        !servicesMenuRef.current?.contains(target) &&
        !servicesButtonRef.current?.contains(target)
      ) {
        setServicesOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const items = servicesMenuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
      if (!items || items.length === 0) return;
      e.preventDefault();
      const active = document.activeElement;
      const index = Array.from(items).indexOf(active as HTMLAnchorElement);
      const next =
        e.key === "ArrowDown"
          ? items[(index + 1) % items.length]
          : items[(index - 1 + items.length) % items.length];
      next.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  // Mobile panel: focus trap + Esc, restore focus to the burger
  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-porcelain/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-6 lg:gap-6">
        <Link href="/" aria-label="EstateHub.ph home" className="shrink-0">
          <span className="hidden md:block">
            <Wordmark />
          </span>
          <span className="md:hidden">
            <Wordmark compact />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden flex-1 items-center gap-6 lg:flex">
          <Link
            href="/properties"
            className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
          >
            Properties
          </Link>

          <div className="relative">
            <button
              ref={servicesButtonRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className="flex min-h-11 items-center gap-1 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
            >
              Services
              <CaretDown
                size={14}
                weight="light"
                aria-hidden="true"
                className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {servicesOpen && (
              <div
                ref={servicesMenuRef}
                className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-hairline bg-white p-2 shadow-lg"
              >
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block rounded-lg px-4 py-2.5 text-sm text-ink/85 hover:bg-porcelain"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/overseas"
            className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
          >
            Overseas Buyers
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
          >
            About
          </Link>
        </nav>

        {/* Tablet + desktop inline search */}
        <SearchForm id="header-search" className="hidden w-52 md:block lg:w-56" />

        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <Link
            href="/contact"
            className="rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-mint md:px-5 md:py-2.5"
          >
            Contact us
          </Link>

          {/* Phone: expanding search */}
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search properties"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-ink md:hidden"
          >
            {searchOpen ? (
              <X size={20} weight="light" aria-hidden="true" />
            ) : (
              <MagnifyingGlass size={20} weight="light" aria-hidden="true" />
            )}
          </button>

          {/* Hamburger (phone + tablet) */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          >
            {menuOpen ? (
              <X size={22} weight="light" aria-hidden="true" />
            ) : (
              <List size={22} weight="light" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Phone expanded search row */}
      {searchOpen && (
        <div className="border-t border-hairline px-6 py-3 md:hidden">
          <SearchForm id="header-search-mobile" autoFocus />
        </div>
      )}

      {/* Mobile / tablet menu panel */}
      {menuOpen && (
        <div
          ref={panelRef}
          className="border-t border-hairline bg-porcelain px-6 py-4 lg:hidden"
        >
          <nav aria-label="Primary mobile" className="flex flex-col">
            <Link href="/properties" className="flex min-h-12 items-center text-base text-ink/90">
              Properties
            </Link>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate">
              Services
            </p>
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex min-h-12 items-center pl-4 text-base text-ink/90"
              >
                {s.label}
              </Link>
            ))}
            <Link href="/overseas" className="flex min-h-12 items-center text-base text-ink/90">
              Overseas Buyers
            </Link>
            <Link href="/about" className="flex min-h-12 items-center text-base text-ink/90">
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
