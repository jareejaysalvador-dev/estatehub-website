import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { SERVICES } from "@/data/services";

const service = SERVICES.lease;

export const metadata: Metadata = {
  title: service.label,
  description: service.metaDescription,
};

export default function LeasePage() {
  return <ServiceTemplate service={service} />;
}
