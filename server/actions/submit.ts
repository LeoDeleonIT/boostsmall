"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit, limits } from "@/lib/rate-limit";
import { checkBusinessAgainstChains } from "@/lib/chain-check";
import { geocodeAddress } from "@/lib/geocode";
import { businessSlug } from "@/lib/slug";
import { BusinessSubmissionSchema } from "@/lib/validators/business";

export async function submitBusinessAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/submit");

  // Rate-limit per user (5 submissions per hour by default).
  const rl = rateLimit(`submit:${session.user.id}`, limits.submission);
  if (!rl.ok) {
    redirect("/submit?error=rate-limited");
  }

  const parsed = BusinessSubmissionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    category: formData.get("category"),
    subcategory: formData.get("subcategory") || undefined,
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "US",
    phone: formData.get("phone") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    instagramHandle: formData.get("instagramHandle") || undefined,
    priceTier: formData.get("priceTier") || 2,
    locationCount: formData.get("locationCount") || 1,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    redirect(
      `/submit?error=invalid&field=${firstIssue.path.join(".")}&msg=${encodeURIComponent(firstIssue.message)}`
    );
  }

  const data = parsed.data;

  // Chain check (uses the new rule — multi-location goes to REVIEW, not REJECT)
  const check = await checkBusinessAgainstChains({
    name: data.name,
    websiteUrl: data.websiteUrl || null,
    locationCount: data.locationCount,
  });

  if (check.allowed === false) {
    const reason =
      check.reason === "EXACT_BLOCKLIST"
        ? `chain-blocked (${check.matched})`
        : `domain-blocked (${check.matched})`;
    redirect(`/submit?error=rejected&reason=${encodeURIComponent(reason)}`);
  }

  // Geocode the address (rooftop level when possible)
  const fullAddress = `${data.addressLine1}, ${data.city}, ${data.state} ${data.postalCode}`;
  let lat: number | null = null;
  let lng: number | null = null;
  try {
    const geo = await geocodeAddress(fullAddress);
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
    }
  } catch {
    // Mapbox failure → continue without coords; admin can geocode manually
  }

  const slug = businessSlug(data.name, data.city);

  await db.business.create({
    data: {
      slug,
      name: data.name,
      description: data.description ?? null,
      category: data.category,
      subcategory: data.subcategory ?? null,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      lat,
      lng,
      phone: data.phone ?? null,
      websiteUrl: data.websiteUrl || null,
      instagramHandle: data.instagramHandle ?? null,
      priceTier: data.priceTier,
      locationCount: data.locationCount,
      status: "PENDING",
      submittedById: session.user.id,
    },
  });

  revalidatePath("/moderate");
  const checkNote =
    check.allowed === "REVIEW"
      ? `&note=${encodeURIComponent(check.reason)}`
      : "";
  redirect(`/submit/success?slug=${slug}${checkNote}`);
}
