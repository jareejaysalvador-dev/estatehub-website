import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

const SERVICE_LINKS = [
  { label: "Sales", href: "/services/sales" },
  { label: "Lease", href: "/services/lease" },
  { label: "Property Management", href: "/services/property-management" },
  { label: "Business Solutions", href: "/services/business-solutions" },
];

const COMPANY_LINKS = [
  { label: "Properties", href: "/properties" },
  { label: "Overseas Buyers", href: "/overseas" },
  { label: "About", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="surface-dark">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/icon-primary.svg" alt="" width={28} height={28} />
              <span className="font-wordmark text-sm tracking-[0.18em] text-porcelain">
                <span className="font-light">ESTATE</span>
                <span className="font-bold">HUB</span>
                <span className="font-semibold text-emerald">.PH</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-on-dark">
              Building generational wealth, one move at a time.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-on-dark">
              Services
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-porcelain/80 transition-colors hover:text-porcelain"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-on-dark">
              Company
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-porcelain/80 transition-colors hover:text-porcelain"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-on-dark">
              Get in touch
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-porcelain/80">
              <li>
                <a
                  href="mailto:hello@estatehub.ph"
                  className="transition-colors hover:text-porcelain"
                >
                  hello@estatehub.ph
                </a>
              </li>
              <li>Metro Manila, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-hairline-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-xs text-slate-on-dark sm:flex-row sm:items-center sm:gap-4">
            <p>© 2026 EstateHub.ph. All rights reserved.</p>
            <Link href="/privacy" className="hover:text-porcelain">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-porcelain">
              Terms of use
            </Link>
          </div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-on-dark">
            <ShieldCheck size={16} weight="light" className="text-emerald" aria-hidden="true" />
            Trusted. Secure. Committed.
          </p>
        </div>
      </div>
    </footer>
  );
}
