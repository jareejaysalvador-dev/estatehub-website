import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // picsum.photos: placeholder photography for static marketing imagery
    // (Hero, ServicesBento) not managed by the CMS - hand-verified IDs, see
    // CLAUDE.md's swap list for real photography.
    // cdn.sanity.io: real broker/listing photos, uploaded via the Studio.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
