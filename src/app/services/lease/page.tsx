import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { SERVICES } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

const service = SERVICES.lease;

export const metadata: Metadata = pageMetadata(service.label, service.metaDescription);

export default function LeasePage() {
  return <ServiceTemplate service={service} />;
}
