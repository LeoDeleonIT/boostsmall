"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { rateLimit, limits } from "@/lib/rate-limit";
import { emailDomainMatchesWebsite } from "@/lib/email-domain";

// ─── Claim business ─────────────────────────────────────────────────────────

const ClaimSchema = z.object({
  businessSlug: z.string().min(1),
  method: z.enum(["EMAIL_DOMAIN", "ADMIN_OVERRIDE"]),
});

export async function claimBusinessAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const parsed = ClaimSchema.safeParse({
    businessSlug: formData.get("businessSlug"),
    method: formData.get("method"),
  });
  if (!parsed.success) {
    redirect(`/owner/claim/${formData.get("businessSlug")}?error=invalid`);
  }

  // Rate-limit claim attempts per user.
  const rl = rateLimit(`claim:${session.user.id}`, limits.submission);
  if (!rl.ok) {
    redirect(`/owner/claim/${parsed.data.businessSlug}?error=rate-limited`);
  }

  const business = await db.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true, websiteUrl: true, owners: { select: { id: true, userId: true } } },
  });
  if (!business) {
    redirect("/search?error=not-found");
  }

  // Already claimed by this user?
  if (business.owners.some((o) => o.userId === session.user.id)) {
    redirect(`/owner/dashboard?info=already-owned`);
  }

  // Verify the chosen method is actually allowed for this user/business.
  if (parsed.data.method === "EMAIL_DOMAIN") {
    if (!emailDomainMatchesWebsite(session.user.email, business.websiteUrl)) {
      redirect(`/owner/claim/${business.slug}?error=email-mismatch`);
    }
  } else if (parsed.data.method === "ADMIN_OVERRIDE") {
    if (session.user.role !== "ADMIN") {
      redirect(`/owner/claim/${business.slug}?error=forbidden`);
    }
  }

  await db.businessOwner.create({
    data: {
      userId: session.user.id,
      businessId: business.id,
      verifiedAt: new Date(),
      verificationMethod: parsed.data.method,
      isPrimary: business.owners.length === 0,
    },
  });

  // Promote user to OWNER if they were just USER.
  if (session.user.role === "USER") {
    await db.user.update({
      where: { id: session.user.id },
      data: { role: "OWNER" },
    });
  }

  revalidatePath(`/b/${business.slug}`);
  revalidatePath("/owner/dashboard");
  redirect(`/owner/dashboard?claimed=${business.slug}`);
}

// ─── Update business (owner editing their listing) ─────────────────────────

const UpdateBusinessSchema = z.object({
  businessId: z.string().cuid(),
  description: z.string().max(2000).optional(),
  phone: z.string().max(40).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  instagramHandle: z.string().max(40).optional(),
  // Note: addressLine1, city, state, lat, lng are NOT editable here —
  // changing them would re-trigger geocoding and should re-enter moderation.
});

export async function updateBusinessAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const parsed = UpdateBusinessSchema.safeParse({
    businessId: formData.get("businessId"),
    description: formData.get("description") || undefined,
    phone: formData.get("phone") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
    instagramHandle: formData.get("instagramHandle") || undefined,
  });
  if (!parsed.success) {
    redirect(`/owner/dashboard?error=invalid`);
  }

  // Authorize: must be an owner of this business OR admin.
  const ownership = await db.businessOwner.findFirst({
    where: { userId: session.user.id, businessId: parsed.data.businessId },
  });
  if (!ownership && session.user.role !== "ADMIN") {
    redirect(`/owner/dashboard?error=forbidden`);
  }

  const business = await db.business.update({
    where: { id: parsed.data.businessId },
    data: {
      description: parsed.data.description ?? null,
      phone: parsed.data.phone ?? null,
      websiteUrl: parsed.data.websiteUrl || null,
      instagramHandle: parsed.data.instagramHandle ?? null,
    },
    select: { slug: true },
  });

  revalidatePath(`/b/${business.slug}`);
  revalidatePath("/owner/dashboard");
  redirect(`/owner/dashboard?updated=${business.slug}`);
}

// ─── Delete photo (called from BusinessPhotoManager via client transition) ─

export async function deletePhotoAction(photoId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");

  const photo = await db.photo.findUnique({
    where: { id: photoId },
    select: { businessId: true, userId: true },
  });
  if (!photo) throw new Error("Photo not found");

  // Authorize: photo's uploader OR business owner OR admin
  const isUploader = photo.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  let isBusinessOwner = false;
  if (!isUploader && !isAdmin && photo.businessId) {
    const owner = await db.businessOwner.findFirst({
      where: { userId: session.user.id, businessId: photo.businessId },
      select: { id: true },
    });
    isBusinessOwner = !!owner;
  }
  if (!isUploader && !isAdmin && !isBusinessOwner) {
    throw new Error("Not allowed");
  }

  await db.photo.delete({ where: { id: photoId } });

  if (photo.businessId) {
    const slug = await db.business.findUnique({
      where: { id: photo.businessId },
      select: { slug: true },
    });
    if (slug) revalidatePath(`/b/${slug.slug}`);
  }
}
