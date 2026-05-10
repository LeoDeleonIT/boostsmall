import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Design-preview placeholder photos (remove once we replace with our own).
      { protocol: "https", hostname: "images.unsplash.com" },
      // UploadThing — user-submitted photos in production.
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
};

export default nextConfig;
