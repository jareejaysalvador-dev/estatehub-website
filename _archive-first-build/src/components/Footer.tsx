import Image from "next/image";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

const SERVICE_LINKS = [
  { label: "Lease", href: "#lease" },
  { label: "Property Management", href: "#property-management" },
  { label: "Sales", href: "#sales" },
  { label: "Business Solutions", href: "#business-solutions" },
];

export function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/mark-emerald.svg"
                alt=""
                width={24}
                height={24}
              />
              <span className="font-display text-sm tracking-[0.2em] text-porcelain">
                <span className="font-light">ESTATE</span>
                <span className="font-bold">HUB</span>
                <span className="font-semibold text-emerald">.PH</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-slate">
              Building generational wealth, one move at a time.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-porcelain/80 transition-colors hover:text-porcelain"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
              Get in touch
            </h3>
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

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-line/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate">
            © 2026 EstateHub.ph. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate">
            <ShieldCheck size={16} weight="light" className="text-emerald" />
            Trusted. Secure. Committed.
          </div>
        </div>
      </div>
    </footer>
  );
}
