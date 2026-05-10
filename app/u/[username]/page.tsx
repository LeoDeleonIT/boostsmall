import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username}` };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [profile, session] = await Promise.all([
    db.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
        image: true,
        _count: {
          select: { reviews: { where: { status: "PUBLISHED" } }, ownedBusinesses: true },
        },
      },
    }),
    auth(),
  ]);

  if (!profile || !profile.username) notFound();

  const isOwn = session?.user?.id === profile.id;
  const initial = (profile.name?.[0] ?? profile.username[0] ?? "?").toUpperCase();
  const joined = profile.createdAt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-[1200px] px-6 py-12 w-full">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-sage/15 text-sage-deep text-3xl font-bold shrink-0">
            {initial}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-4xl text-ink leading-tight">
                {profile.name ?? `@${profile.username}`}
              </h1>
              {profile.role === "ADMIN" && <Badge variant="warm">Admin</Badge>}
              {profile.role === "MODERATOR" && <Badge variant="sage">Moderator</Badge>}
              {profile.role === "OWNER" && <Badge variant="sage">Business owner</Badge>}
            </div>

            <p className="text-ink-soft mt-1">@{profile.username} · joined {joined}</p>

            {profile.bio && (
              <p className="mt-4 max-w-[60ch] text-ink leading-relaxed">{profile.bio}</p>
            )}

            <div className="mt-6 flex items-center gap-6 text-sm">
              <span className="text-ink">
                <span className="font-bold tnum">
                  {profile._count.reviews.toLocaleString()}
                </span>{" "}
                <span className="text-ink-soft">
                  review{profile._count.reviews === 1 ? "" : "s"}
                </span>
              </span>
              <span className="text-ink">
                <span className="font-bold tnum">
                  {profile._count.ownedBusinesses.toLocaleString()}
                </span>{" "}
                <span className="text-ink-soft">
                  owned business{profile._count.ownedBusinesses === 1 ? "" : "es"}
                </span>
              </span>
            </div>

            {isOwn && (
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/u/edit">Edit profile</Link>
                </Button>
                {profile._count.ownedBusinesses > 0 && (
                  <Button variant="sage" size="sm" asChild>
                    <Link href="/owner/dashboard">Owner dashboard</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_320px] gap-10">
          <div>
            <h2 className="font-display text-2xl text-ink mb-6">Reviews</h2>
            {profile._count.reviews === 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-10 text-center">
                <p className="text-ink-soft">
                  {isOwn
                    ? "You haven't written any reviews yet. Find a business and be the first."
                    : `${profile.name ?? `@${profile.username}`} hasn't written any reviews yet.`}
                </p>
                {isOwn && (
                  <Button variant="warm" className="mt-4" asChild>
                    <Link href="/search">Find a business</Link>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-ink-soft text-sm">
                Review listing renders once Phase 2 is built.
              </p>
            )}
          </div>

          <aside>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
                About boostsmall
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                A discovery and review platform for independent, family-owned
                small businesses in the Houston metro and East Texas.
              </p>
              <Button variant="ghost" size="sm" asChild className="mt-3 px-0 hover:bg-transparent text-terracotta-deep">
                <Link href="/about">How boostsmall works →</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
