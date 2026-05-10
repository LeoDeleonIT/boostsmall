import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { recentActivity, activityVerb, type ActivityKind } from "@/lib/activity";
import { relativeTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/sign-in");

  const [
    businessCount,
    pendingCount,
    chainsCount,
    usersCount,
    flagsOpen,
    activity,
  ] = await Promise.all([
    db.business.count({ where: { status: "APPROVED" } }),
    db.business.count({ where: { status: "PENDING" } }),
    db.chainBlocklist.count(),
    db.user.count(),
    db.moderationFlag.count({ where: { status: "OPEN" } }),
    recentActivity(15),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-[1200px] px-6 py-12 w-full">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
              Admin
            </p>
            <h1 className="font-display text-4xl text-ink leading-tight">
              Welcome back, {session.user.name ?? session.user.username ?? "admin"}.
            </h1>
            <p className="mt-2 text-ink-soft">
              Operating boostsmall · {session.user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <Stat label="Approved businesses" value={businessCount} href="/search" />
          <Stat label="Pending review" value={pendingCount} href="/moderate" highlight={pendingCount > 0} />
          <Stat label="Open flags" value={flagsOpen} href="/moderate" highlight={flagsOpen > 0} />
          <Stat label="Chains blocked" value={chainsCount} href="/admin/chains" />
          <Stat label="Users" value={usersCount} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-ink">Quick actions</h2>
            </div>
            <ul className="space-y-3">
              <ActionRow
                href="/moderate"
                title="Moderation queue"
                desc={pendingCount === 0 ? "Nothing waiting." : `${pendingCount} business${pendingCount === 1 ? "" : "es"} waiting.`}
              />
              <ActionRow
                href="/admin/chains"
                title="Manage chain blocklist"
                desc={`${chainsCount} entries. Add or remove without a deploy.`}
              />
              <ActionRow
                href="/submit"
                title="Add a business yourself"
                desc="Bypass the review queue when you know the business is legit."
              />
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-ink">Activity feed</h2>
              <span className="text-xs text-ink-soft">last {activity.length}</span>
            </div>
            {activity.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Nothing yet. Activity from submissions, approvals, claims,
                and photo uploads shows up here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {activity.map((e) => (
                  <li
                    key={e.id}
                    className="py-3 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <ActivityDot kind={e.kind} />
                      <p className="text-sm text-ink leading-snug min-w-0">
                        <span className="font-semibold">
                          {e.actorUsername ? `@${e.actorUsername}` : e.actorEmail ?? "someone"}
                        </span>{" "}
                        <span className="text-ink-soft">{activityVerb(e.kind)}</span>{" "}
                        <Link
                          href={`/b/${e.businessSlug}`}
                          className="font-semibold text-ink hover:text-terracotta-deep break-words"
                        >
                          {e.businessName}
                        </Link>
                      </p>
                    </div>
                    <span className="text-xs text-ink-soft whitespace-nowrap shrink-0 tnum">
                      {relativeTime(e.at.toISOString())}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Stat({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={
        highlight
          ? "rounded-2xl border border-terracotta/40 bg-terracotta/5 p-5"
          : "rounded-2xl border border-border bg-surface p-5"
      }
    >
      <p className="text-3xl font-bold tnum text-ink">{value.toLocaleString()}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft font-bold">
        {label}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function ActivityDot({ kind }: { kind: ActivityKind }) {
  const color =
    kind === "approval"
      ? "bg-sage"
      : kind === "rejection"
      ? "bg-terracotta-deep"
      : kind === "claim"
      ? "bg-sage-deep"
      : kind === "photo"
      ? "bg-terracotta"
      : "bg-ink-soft";
  return (
    <span
      className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${color}`}
      aria-hidden
    />
  );
}

function ActionRow({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-xl border border-border hover:border-sage hover:bg-sage/5 p-4 transition-colors"
      >
        <p className="font-bold text-ink">{title}</p>
        <p className="text-sm text-ink-soft mt-0.5">{desc}</p>
      </Link>
    </li>
  );
}
