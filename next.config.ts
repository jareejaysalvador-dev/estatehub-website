import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // picsum.photos: placeholder photography for static marketing imagery
    // (ServicesBento) not managed by the CMS - hand-verified IDs, see
    // CLAUDE.md's swap list for real photography.
    // images.unsplash.com: Hero's background - a verified real Philippine
    // location, still a placeholder pending commissioned photography.
    // cdn.sanity.io: real broker/listing photos, uploaded via the Studio.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
