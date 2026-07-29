import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const SERVICES = [
  {
    id: "sales",
    label: "Sales",
    description: "Buy or sell with a team that knows the market inside out.",
    photoId: "1029",
    span: "lg:col-span-2 lg:row-span-2",
    aspect: "aspect-[4/3] lg:aspect-auto",
  },
  {
    id: "lease",
    label: "Lease",
    description: "Find a vetted rental, fast, with no surprises at move-in.",
    photoId: "1048",
    span: "lg:col-span-2 lg:row-span-1",
    aspect: "aspect-[4/3] lg:aspect-auto",
  },
  {
    id: "property-management",
    label: "Property Management",
    description: "We handle tenants, maintenance, and payouts so you don't have to.",
    photoId: "1076",
    span: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[4/3]",
  },
  {
    id: "business-solutions",
    label: "Business Solutions",
    description: "Commercial space and investment advisory for growing companies.",
    photoId: "1031",
    span: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[4/3]",
  },
];

export function ServicesBento() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <Reveal>
        <h2 className="max-w-lg font-display text-2xl font-bold tracking-tight text-porcelain sm:text-3xl">
          One partner, every kind of move.
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
        {SERVICES.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.08} className={service.span}>
            <a
              id={service.id}
              href="#contact"
              className={`group relative block h-full overflow-hidden rounded-2xl border border-line/70 transition-colors hover:border-emerald/60 ${service.aspect}`}
            >
              <Image
                src={`https://picsum.photos/id/${service.photoId}/900/900`}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

              <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
                <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-porcelain">
                  {service.label}
                </span>
                <p className="mt-2 max-w-xs text-sm text-porcelain/80">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald/15 text-emerald transition-colors group-hover:bg-emerald group-hover:text-ink">
                  <ArrowRight size={16} weight="bold" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
