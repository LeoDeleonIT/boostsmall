import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Stock placeholder photos.
      { protocol: "https", hostname: "images.unsplash.com" },
      // UploadThing — user-submitted photos in production.
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
      // Real business OG images hot-linked from their own websites.
      // Owners get full control once they claim + upload via UploadThing.
      { protocol: "https", hostname: "www.trinitydentalcenters.com" },
      { protocol: "https", hostname: "pearlmoderndentistry.com" },
      { protocol: "https", hostname: "riveroaks-dentistry.com" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "www.bissonnetdentalhouston.com" },
      { protocol: "https", hostname: "img1.wsimg.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "buchanansplants.com" },
      { protocol: "https", hostname: "truthbbq.com" },
      { protocol: "https", hostname: "www.pinkertonsbarbecue.com" },
    ],
  },
};

export default nextConfig;
