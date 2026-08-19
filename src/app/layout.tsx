import type { Metadata } from "next";
import { EB_Garamond, Inter, Montserrat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessengerWidget } from "@/components/MessengerWidget";
import { FloatingContactButton } from "@/components/FloatingContactButton";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const DEFAULT_TITLE = "EstateHub.ph | Full-Service Real Estate Brokerage in the Philippines";
const DEFAULT_DESCRIPTION =
  "Licensed brokers for buying, selling, leasing, and managing property across the Philippines. One point of contact from first call to closing.";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | EstateHub.ph",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: "EstateHub.ph",
    type: "website",
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${ebGaramond.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingContactButton />
        <MessengerWidget />
      </body>
    </html>
  );
}
