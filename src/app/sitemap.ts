import type { MetadataRoute } from "next";
import { getAllListingSlugs, getAllDevelopmentSlugs } from "@/sanity/queries";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/properties",
  "/services/sales",
  "/services/lease",
  "/services/property-management",
  "/services/business-solutions",
  "/overseas",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listingSlugs, developmentSlugs] = await Promise.all([
    getAllListingSlugs(),
    getAllDevelopmentSlugs(),
  ]);

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...listingSlugs.map((slug) => ({ url: `${SITE_URL}/properties/${slug}` })),
    ...developmentSlugs.map((slug) => ({ url: `${SITE_URL}/developments/${slug}` })),
  ];
}
