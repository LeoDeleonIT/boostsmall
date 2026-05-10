"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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

  await db.business.update({
    where: { id: businessId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      approvedById: session.user.id,
      rejectionReason: null,
    },
  });

  revalidatePath("/moderate");
  revalidatePath("/admin");
  redirect("/moderate?ok=approved");
}

export async function rejectBusinessAction(formData: FormData) {
  await requireModerator();
  const businessId = formData.get("businessId");
  const reason = formData.get("reason");
  if (typeof businessId !== "string") redirect("/moderate?error=invalid");

  await db.business.update({
    where: { id: businessId },
    data: {
      status: "REJECTED",
      rejectionReason:
        typeof reason === "string" && reason.trim()
          ? reason.trim()
          : "Did not meet boostsmall's family-owned rules.",
    },
  });

  revalidatePath("/moderate");
  revalidatePath("/admin");
  redirect("/moderate?ok=rejected");
}
