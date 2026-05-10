"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  sendBusinessApprovedEmail,
  sendBusinessRejectedEmail,
} from "@/lib/email";

async function requireModerator() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/moderate");
  if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    redirect("/?error=forbidden");
  }
  return session;
}

export async function approveBusinessAction(formData: FormData) {
  const session = await requireModerator();
  const businessId = formData.get("businessId");
  if (typeof businessId !== "string") redirect("/moderate?error=invalid");

  const updated = await db.business.update({
    where: { id: businessId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      approvedById: session.user.id,
      rejectionReason: null,
    },
    select: {
      slug: true,
      name: true,
      submittedBy: { select: { email: true, name: true } },
    },
  });

  // Notify submitter (fire-and-forget — don't block the redirect on Resend).
  if (updated.submittedBy?.email) {
    void sendBusinessApprovedEmail({
      to: updated.submittedBy.email,
      toName: updated.submittedBy.name,
      businessName: updated.name,
      businessSlug: updated.slug,
      approvedByName: session.user.name ?? session.user.username,
    });
  }

  revalidatePath("/moderate");
  revalidatePath("/admin");
  redirect("/moderate?ok=approved");
}

export async function rejectBusinessAction(formData: FormData) {
  await requireModerator();
  const businessId = formData.get("businessId");
  const reasonInput = formData.get("reason");
  if (typeof businessId !== "string") redirect("/moderate?error=invalid");

  const reason =
    typeof reasonInput === "string" && reasonInput.trim()
      ? reasonInput.trim()
      : "Did not meet boostsmall's family-owned rules.";

  const updated = await db.business.update({
    where: { id: businessId },
    data: {
      status: "REJECTED",
      rejectionReason: reason,
    },
    select: {
      name: true,
      submittedBy: { select: { email: true, name: true } },
    },
  });

  if (updated.submittedBy?.email) {
    void sendBusinessRejectedEmail({
      to: updated.submittedBy.email,
      toName: updated.submittedBy.name,
      businessName: updated.name,
      reason,
    });
  }

  revalidatePath("/moderate");
  revalidatePath("/admin");
  redirect("/moderate?ok=rejected");
}
