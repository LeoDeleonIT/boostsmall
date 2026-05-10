import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProfileAction } from "@/server/actions/user";

export const metadata: Metadata = {
  title: "Edit profile",
  robots: { index: false, follow: false },
};

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; field?: string; msg?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/u/edit");

  const profile = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true, bio: true, email: true },
  });
  if (!profile) redirect("/sign-in");

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-xl px-6 py-12 w-full">
        <Link
          href={profile.username ? `/u/${profile.username}` : "/"}
          className="text-sm text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          ← back to profile
        </Link>

        <h1 className="font-display text-4xl text-ink mt-4 leading-tight">
          Edit your profile
        </h1>
        <p className="mt-2 text-ink-soft">
          Signed in as <span className="text-ink">{profile.email}</span>
        </p>

        {params.error && (
          <div className="mt-6 rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 text-sm">
            <p className="text-terracotta-deep font-semibold">
              {params.field ? `${params.field}: ` : ""}
              {params.msg ?? "Something was wrong with the form."}
            </p>
          </div>
        )}

        <form action={updateProfileAction} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={profile.name ?? ""}
              maxLength={80}
              placeholder="Your name (optional)"
            />
            <p className="text-xs text-ink-soft">
              How your name appears next to your reviews.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-1">
              <span className="text-ink-soft text-sm">@</span>
              <Input
                id="username"
                name="username"
                required
                defaultValue={profile.username ?? ""}
                pattern="[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])?"
                minLength={3}
                maxLength={24}
                placeholder="your-handle"
                className="lowercase"
              />
            </div>
            <p className="text-xs text-ink-soft">
              Lowercase letters, numbers, and hyphens. 3-24 characters. This
              shows in your profile URL.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio ?? ""}
              rows={4}
              maxLength={500}
              placeholder="A line or two about you (optional)"
              className="flex w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm placeholder:text-ink-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <p className="text-xs text-ink-soft">Up to 500 characters.</p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="submit" variant="warm" size="lg">
              Save changes
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href={profile.username ? `/u/${profile.username}` : "/"}
              >
                Cancel
              </Link>
            </Button>
          </div>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
