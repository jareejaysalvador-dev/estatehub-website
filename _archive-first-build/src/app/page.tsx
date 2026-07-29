import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ServicesBento } from "@/components/ServicesBento";
import { TrustSection } from "@/components/TrustSection";
import { FeaturedListings } from "@/components/FeaturedListings";
import { ClosingCta } from "@/components/ClosingCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <ServicesBento />
        <TrustSection />
        <FeaturedListings />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
