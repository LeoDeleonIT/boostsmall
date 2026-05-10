"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ProfileEditSchema } from "@/lib/validators/user";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/u/edit");

  const parsed = ProfileEditSchema.safeParse({
    name: (formData.get("name") as string)?.trim() || undefined,
    username: (formData.get("username") as string)?.trim().toLowerCase(),
    bio: (formData.get("bio") as string)?.trim() || undefined,
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    redirect(
      `/u/edit?error=invalid&field=${issue.path.join(".")}&msg=${encodeURIComponent(issue.message)}`
    );
  }

  const { name, username, bio } = parsed.data;

  // Check username uniqueness (only if it changed)
  const current = await db.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  });

  if (current?.username !== username) {
    const taken = await db.user.findFirst({
      where: { username, NOT: { id: session.user.id } },
      select: { id: true },
    });
    if (taken) {
      redirect(
        `/u/edit?error=invalid&field=username&msg=${encodeURIComponent("That username is already taken")}`
      );
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: name ?? null,
      username,
      bio: bio ?? null,
    },
  });

  revalidatePath(`/u/${username}`);
  if (current?.username && current.username !== username) {
    revalidatePath(`/u/${current.username}`);
  }
  redirect(`/u/${username}?ok=updated`);
}
