import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photography host; add real photo hosts here when the
    // Picsum placeholders are replaced (see analysis/security-spec.md).
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
