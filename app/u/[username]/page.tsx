import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { RatingStars } from "@/components/review/rating-stars";
import { relativeTime } from "@/lib/format";
import { publicTrustSnapshot } from "@/lib/reviewer-trust";
import { ReviewerBadge } from "@/components/review/reviewer-badge";

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

  // Trust snapshot — tier + the signals that earned it.
  const trust = await publicTrustSnapshot(profile.id);

  // Fetch the user's published reviews with the business they're on.
  const reviews = await db.review.findMany({
    where: { userId: profile.id, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      rating: true,
      body: true,
      createdAt: true,
      helpfulCount: true,
      ownerResponse: true,
      ownerResponseAt: true,
      business: {
        select: {
          slug: true,
          name: true,
          city: true,
          state: true,
          subcategory: true,
          category: true,
          photos: {
            where: { reviewId: null },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });

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
              {trust && <ReviewerBadge tier={trust.tier} size="md" />}
              {profile.role === "ADMIN" && <Badge variant="warm">Admin</Badge>}
              {profile.role === "MODERATOR" && <Badge variant="sage">Moderator</Badge>}
              {profile.role === "OWNER" && <Badge variant="sage">Business owner</Badge>}
            </div>

            <p className="text-ink-soft mt-1">@{profile.username} · joined {joined}</p>

            {trust && trust.reviewCount > 0 && (
              <p className="mt-3 text-sm text-ink-soft max-w-[60ch]">
                <span className="font-semibold text-ink">{trust.tier.label}</span>{" "}
                — {trust.tier.blurb}{" "}
                <Link
                  href="/about/trust"
                  className="text-terracotta-deep hover:underline underline-offset-4"
                >
                  How tiers work →
                </Link>
              </p>
            )}

            {profile.bio && (
              <p className="mt-4 max-w-[60ch] text-ink leading-relaxed">{profile.bio}</p>
            )}

            <div className="mt-6 flex items-center gap-x-6 gap-y-2 text-sm flex-wrap">
              <Stat n={profile._count.reviews} label={profile._count.reviews === 1 ? "review" : "reviews"} />
              {trust && trust.helpfulReceived > 0 && (
                <Stat n={trust.helpfulReceived} label="found helpful" />
              )}
              {trust && trust.reviewsWithPhotos > 0 && (
                <Stat n={trust.reviewsWithPhotos} label={`review${trust.reviewsWithPhotos === 1 ? "" : "s"} with photos`} />
              )}
              {trust && trust.responsesEarned > 0 && (
                <Stat n={trust.responsesEarned} label="owner replies" />
              )}
              {profile._count.ownedBusinesses > 0 && (
                <Stat n={profile._count.ownedBusinesses} label={`owned business${profile._count.ownedBusinesses === 1 ? "" : "es"}`} />
              )}
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
            {reviews.length === 0 ? (
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
              <ul className="space-y-5">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-border bg-surface overflow-hidden"
                  >
                    <Link
                      href={`/b/${r.business.slug}#review-${r.id}`}
                      className="block hover:bg-background-soft transition-colors"
                    >
                      <div className="flex gap-4 p-5">
                        {r.business.photos[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.business.photos[0].url}
                            alt=""
                            className="h-20 w-20 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-ink leading-tight">
                                {r.business.name}
                              </p>
                              <p className="text-xs text-ink-soft mt-0.5">
                                {r.business.subcategory ?? r.business.category} ·{" "}
                                {r.business.city}, {r.business.state}
                              </p>
                            </div>
                            <RatingStars rating={r.rating} size="sm" />
                          </div>
                          <p className="mt-3 text-sm text-ink leading-relaxed line-clamp-3">
                            {r.body}
                          </p>
                          <p className="mt-2 text-xs text-ink-soft">
                            {relativeTime(r.createdAt.toISOString())}
                            {r.helpfulCount > 0 && (
                              <> · {r.helpfulCount} found this helpful</>
                            )}
                            {r.ownerResponse && (
                              <> · <span className="text-sage-deep font-semibold">owner replied</span></>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
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

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <span className="text-ink">
      <span className="font-bold tnum">{n.toLocaleString()}</span>{" "}
      <span className="text-ink-soft">{label}</span>
    </span>
  );
}
