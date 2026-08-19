import type { Metadata } from "next";
import { PropertiesResults } from "./PropertiesResults";
import { getAllPropertyGridItems } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Properties for Sale and Lease",
  description:
    "Browse EstateHub.ph property listings for sale and lease across the Philippines, backed by a licensed broker on every transaction.",
};

export default async function PropertiesPage() {
  const items = await getAllPropertyGridItems();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <h1 className="font-display text-[32px] font-medium text-ink lg:text-[40px]">
        Properties
      </h1>
      <p className="mt-3 max-w-2xl text-base text-slate">
        Every listing here is handled by a licensed EstateHub broker, from
        first inquiry to closing or move-in.
      </p>

      <div className="mt-8">
        <PropertiesResults items={items} />
      </div>
    </div>
  );
}
