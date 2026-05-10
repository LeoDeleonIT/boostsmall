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
      // Wikipedia / Wikimedia Commons (free, CC-licensed business photos)
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Yelp CDN — direct photo URLs work even though Yelp HTML pages 403
      { protocol: "https", hostname: "s3-media0.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media1.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media2.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media3.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media4.fl.yelpcdn.com" },
      // Houston Chronicle / hdnux photos
      { protocol: "https", hostname: "s.hdnux.com" },
      // Foursquare CDN photos
      { protocol: "https", hostname: "fastly.4sqi.net" },
    ],
  },
};

export default nextConfig;
