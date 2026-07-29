import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { SERVICES } from "@/data/services";

const service = SERVICES["business-solutions"];

export const metadata: Metadata = {
  title: service.label,
  description: service.metaDescription,
};

export default function BusinessSolutionsPage() {
  return <ServiceTemplate service={service} />;
}
