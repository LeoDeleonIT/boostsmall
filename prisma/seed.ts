// Seed sample businesses across the Houston metro.
// Run with: pnpm db:seed
//
// Source of truth is lib/sample-businesses.ts (used by both this seed AND
// the UI mock data path). Canonical slugs there match the URLs the UI links
// to, so swapping pages from `findBusinessBySlug()` to a Prisma `findUnique`
// keeps every link working.
//
// Idempotent: upserts by `slug`. Re-running won't create duplicates.

import { PrismaClient, BusinessStatus } from "@prisma/client";
import { SAMPLE_BUSINESSES } from "../lib/sample-businesses";

const db = new PrismaClient();

async function main() {
  console.log(`Seeding ${SAMPLE_BUSINESSES.length} businesses…`);
  let created = 0;
  let updated = 0;

  for (const b of SAMPLE_BUSINESSES) {
    const result = await db.business.upsert({
      where: { slug: b.slug },
      create: {
        slug: b.slug,
        name: b.name,
        description: b.description,
        category: b.category,
        subcategory: b.subcategory,
        addressLine1: b.addressLine1,
        city: b.city,
        state: b.state,
        postalCode: b.postalCode,
        country: "US",
        lat: b.lat,
        lng: b.lng,
        phone: b.phone,
        websiteUrl: b.websiteUrl,
        instagramHandle: b.instagramHandle,
        hours: b.hours ?? undefined,
        priceTier: b.priceTier,
        locationCount: b.locationCount,
        status: BusinessStatus.APPROVED,
        approvedAt: new Date(),
      },
      update: {
        name: b.name,
        description: b.description,
        category: b.category,
        subcategory: b.subcategory,
        addressLine1: b.addressLine1,
        city: b.city,
        state: b.state,
        postalCode: b.postalCode,
        lat: b.lat,
        lng: b.lng,
        phone: b.phone,
        websiteUrl: b.websiteUrl,
        instagramHandle: b.instagramHandle,
        hours: b.hours ?? undefined,
        priceTier: b.priceTier,
        locationCount: b.locationCount,
      },
    });
    // upsert doesn't tell us which path it took; check createdAt vs updatedAt
    if (+result.createdAt === +result.updatedAt) {
      created++;
    } else {
      updated++;
    }
  }

  console.log(`Done. Created: ${created}. Updated: ${updated}.`);

  const needsReview = SAMPLE_BUSINESSES.filter((b) => b.needsReview).length;
  if (needsReview) {
    console.log(
      `\n⚠ ${needsReview} entries marked needsReview — see TODO comments in lib/sample-businesses.ts (Trinity Dental, Pearl Dentistry addresses).`
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
