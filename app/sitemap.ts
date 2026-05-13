import type { MetadataRoute } from "next";
import { SAMPLE_BUSINESSES } from "@/lib/sample-businesses";

// Generates /sitemap.xml from the sample-businesses source so every
// biz page is crawlable. Referenced from public/robots.txt; without
// this, Google can find the home page but not the 147 detail pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://boostsmall.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/search`,            lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/submit`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/owner`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about/trust`,       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/recommendations`,   lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/discover`,          lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
  ];

  const bizPages: MetadataRoute.Sitemap = SAMPLE_BUSINESSES.map((b) => ({
    url: `${base}/b/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...bizPages];
}
