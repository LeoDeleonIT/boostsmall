"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, limits } from "@/lib/rate-limit";
import { haversineMiles } from "@/lib/distance";

// ─── Verify a visit by geolocation ─────────────────────────────────────────
// Client component reads navigator.geolocation, POSTs the coords here.
// We re-check distance server-side against the business's lat/lng so a
// crafted POST can't fake a visit.

const MAX_DISTANCE_METERS = 200; // ~650 ft — generous for big lots & GPS drift

const VerifyVisitSchema = z.object({
  businessSlug: z.string().min(1).max(120),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  accuracy: z.coerce.number().min(0).max(10_000).optional(),
});

export async function verifyVisitAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    const slug = (formData.get("businessSlug") as string) ?? "";
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/b/${slug}`)}`);
  }

  const parsed = VerifyVisitSchema.safeParse({
    businessSlug: formData.get("businessSlug"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    accuracy: formData.get("accuracy"),
  });
  if (!parsed.success) {
    const slug = (formData.get("businessSlug") as string) ?? "";
    redirect(`/b/${slug}?visit=bad-coords`);
  }

  const rl = rateLimit(`verify-visit:${session.user.id}`, limits.review);
  if (!rl.ok) {
    redirect(`/b/${parsed.data.businessSlug}?visit=rate-limited`);
  }

  const business = await db.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true, lat: true, lng: true },
  });
  if (!business || business.lat == null || business.lng == null) {
    redirect("/search?error=not-found");
  }

  // haversineMiles → meters
  const miles = haversineMiles(
    parsed.data.lat,
    parsed.data.lng,
    business.lat,
    business.lng
  );
  const distanceMeters = miles * 1609.344;

  if (distanceMeters > MAX_DISTANCE_METERS) {
    redirect(`/b/${business.slug}?visit=too-far`);
  }

  await db.verifiedVisit.upsert({
    where: {
      userId_businessId: {
        userId: session.user.id,
        businessId: business.id,
      },
    },
    update: {
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      accuracyMeters: parsed.data.accuracy,
      distanceMeters,
    },
    create: {
      userId: session.user.id,
      businessId: business.id,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      accuracyMeters: parsed.data.accuracy,
      distanceMeters,
    },
  });

  revalidatePath(`/b/${business.slug}`);
  redirect(`/b/${business.slug}?visit=verified`);
}
