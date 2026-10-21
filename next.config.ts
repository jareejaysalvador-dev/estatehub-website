import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The homepage is the HERRA-built static page in public/home.html (assets in
  // public/assets). The rewrite keeps the URL at "/" and runs before the app
  // router, so src/app/page.tsx is bypassed; delete this block to restore the
  // previous React homepage. Every other route is untouched.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/home.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
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
