import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { SERVICES } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

const service = SERVICES.sales;

export const metadata: Metadata = pageMetadata(service.label, service.metaDescription);

export default function SalesPage() {
  return <ServiceTemplate service={service} />;
}
