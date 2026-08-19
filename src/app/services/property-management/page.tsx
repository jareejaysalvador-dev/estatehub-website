import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { SERVICES } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

const service = SERVICES["property-management"];

export const metadata: Metadata = pageMetadata(service.label, service.metaDescription);

export default function PropertyManagementPage() {
  return <ServiceTemplate service={service} />;
}
