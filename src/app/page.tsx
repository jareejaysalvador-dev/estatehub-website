import { Hero } from "@/components/home/Hero";
import { StatementBand } from "@/components/home/StatementBand";
import { ServicesBento } from "@/components/home/ServicesBento";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { OverseasBand } from "@/components/home/OverseasBand";
import { WhyEstateHub } from "@/components/home/WhyEstateHub";
import { ClosingCta } from "@/components/home/ClosingCta";

export default function Home() {
  return (
    <>
      <Hero />
      <StatementBand />
      <ServicesBento />
      <FeaturedProperties />
      <OverseasBand />
      <WhyEstateHub />
      <ClosingCta />
    </>
  );
}
