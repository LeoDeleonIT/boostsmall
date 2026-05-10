"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { normalizeName } from "@/lib/normalize";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/sign-in?callbackUrl=/admin/chains");
  }
  return session;
}

const AddChainSchema = z.object({
  name: z.string().min(1).max(120),
  parentCompany: z.string().max(120).optional(),
  reason: z.string().max(500).optional(),
});

export async function addChainAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = AddChainSchema.safeParse({
    name: formData.get("name"),
    parentCompany: formData.get("parentCompany") || undefined,
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) redirect("/admin/chains?error=invalid");

  const normalized = normalizeName(parsed.data.name);

  const existing = await db.chainBlocklist.findUnique({
    where: { normalizedName: normalized },
  });
  if (existing) redirect("/admin/chains?error=exists");

  await db.chainBlocklist.create({
    data: {
      name: parsed.data.name,
      normalizedName: normalized,
      parentCompany: parsed.data.parentCompany ?? null,
      reason: parsed.data.reason ?? null,
      addedById: session.user.id,
    },
  });

  revalidatePath("/admin/chains");
  redirect("/admin/chains?ok=added");
}

export async function removeChainAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/admin/chains?error=invalid");

  await db.chainBlocklist.delete({ where: { id } });
  revalidatePath("/admin/chains");
  redirect("/admin/chains?ok=removed");
}
