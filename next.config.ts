import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // picsum.photos: placeholder photography host, removed once the CMS
    // migration cutover deletes the last sample-data consumer of it.
    // cdn.sanity.io: real broker/listing photos, uploaded via the Studio.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
