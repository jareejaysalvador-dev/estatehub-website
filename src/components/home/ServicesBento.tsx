import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  {
    href: "/services/sales",
    label: "Sales",
    line: "Buy or sell with a broker who handles everything.",
    photoId: "1029",
    className: "lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto",
  },
  {
    href: "/services/lease",
    label: "Lease",
    line: "Vetted rentals for tenants, reliable tenants for owners.",
    photoId: "1048",
    className: "lg:col-span-2 lg:row-span-1 aspect-[4/3] lg:aspect-auto",
  },
  {
    href: "/services/property-management",
    label: "Property Management",
    line: "Tenants, maintenance, and payouts, handled.",
    photoId: "1076",
    className: "lg:col-span-1 lg:row-span-1 aspect-[4/3]",
  },
  {
    href: "/services/business-solutions",
    label: "Business Solutions",
    line: "Commercial space and advisory for companies.",
    photoId: "1031",
    className: "lg:col-span-1 lg:row-span-1 aspect-[4/3]",
  },
];

export function ServicesBento() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 lg:pb-24">
      <Reveal>
        <h2 className="text-[22px] font-bold tracking-tight text-ink lg:text-[28px]">
          One partner, every kind of move.
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
        {SERVICES.map((service, i) => (
          <Reveal key={service.href} delay={i * 0.06} className={service.className}>
            <Link
              href={service.href}
              className="group relative block h-full overflow-hidden rounded-2xl border border-hairline transition-colors hover:border-emerald"
            >
              <Image
                src={`https://picsum.photos/id/${service.photoId}/900/900`}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10" />

              <div className="relative flex h-full flex-col justify-end p-5 lg:p-6">
                <h3 className="text-lg font-semibold text-porcelain">
                  {service.label}
                </h3>
                <p className="mt-1 max-w-xs text-sm text-porcelain/85">
                  {service.line}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-porcelain/15 text-porcelain transition-colors group-hover:bg-emerald group-hover:text-ink"
                >
                  <ArrowRight size={16} weight="bold" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
