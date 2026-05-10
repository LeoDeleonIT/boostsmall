import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/format";
import {
  approveBusinessAction,
  rejectBusinessAction,
} from "@/server/actions/moderate";

export const metadata: Metadata = {
  title: "Moderation queue",
  robots: { index: false, follow: false },
};

export default async function ModeratePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/moderate");
  if (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    redirect("/?error=forbidden");
  }

  const pending = await db.business.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      submittedBy: { select: { username: true, email: true } },
    },
  });

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-[1200px] px-6 py-12 w-full">
        <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
          Moderation
        </p>
        <h1 className="font-display text-4xl text-ink leading-tight">
          {pending.length === 0
            ? "Nothing pending right now."
            : `${pending.length} business${pending.length === 1 ? "" : "es"} waiting`}
        </h1>

        {(ok || error) && (
          <div
            className={
              ok
                ? "mt-6 inline-block rounded-full bg-sage/10 px-4 py-2 text-sm font-semibold text-sage-deep"
                : "mt-6 inline-block rounded-full bg-terracotta/10 px-4 py-2 text-sm font-semibold text-terracotta-deep"
            }
          >
            {ok === "approved" && "✓ Approved."}
            {ok === "rejected" && "✓ Rejected."}
            {error === "forbidden" && "Not allowed."}
            {error === "invalid" && "Invalid request."}
          </div>
        )}

        {pending.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-10 max-w-2xl">
            <p className="text-ink-soft">
              When users submit businesses via{" "}
              <Link href="/submit" className="text-terracotta-deep hover:underline">
                /submit
              </Link>
              , they show up here for approve/reject.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-5">
            {pending.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="muted">{categoryLabel(b.category)}</Badge>
                      {b.locationCount > 5 && (
                        <Badge variant="warm">{b.locationCount} locations</Badge>
                      )}
                      {!b.lat && (
                        <Badge variant="outline">Geocode failed</Badge>
                      )}
                    </div>
                    <h2 className="font-display text-2xl text-ink leading-tight">
                      {b.name}
                    </h2>
                    <p className="text-sm text-ink-soft mt-1">
                      {b.subcategory ?? categoryLabel(b.category)} · {b.city}, {b.state}
                    </p>
                    <p className="text-xs text-ink-soft mt-2">
                      {b.addressLine1}
                      {b.addressLine2 && `, ${b.addressLine2}`} · {b.postalCode}
                    </p>
                    {b.websiteUrl && (
                      <p className="text-xs text-ink-soft mt-1 break-all">
                        Website:{" "}
                        <a
                          href={b.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-terracotta-deep hover:underline"
                        >
                          {b.websiteUrl}
                        </a>
                      </p>
                    )}
                    {b.description && (
                      <p className="mt-3 text-sm text-ink leading-relaxed">
                        {b.description}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-ink-soft">
                      Submitted by {b.submittedBy?.username ?? b.submittedBy?.email ?? "(unknown)"}{" "}
                      on {b.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <form action={approveBusinessAction}>
                      <input type="hidden" name="businessId" value={b.id} />
                      <Button type="submit" variant="sage" size="sm">
                        Approve
                      </Button>
                    </form>
                    <details className="relative">
                      <summary className="list-none cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          Reject…
                        </Button>
                      </summary>
                      <form
                        action={rejectBusinessAction}
                        className="absolute right-0 mt-2 z-10 w-72 rounded-xl border border-border bg-surface p-3 shadow-lg"
                      >
                        <input type="hidden" name="businessId" value={b.id} />
                        <textarea
                          name="reason"
                          rows={3}
                          placeholder="Reason (optional, sent to submitter)"
                          className="w-full text-sm rounded-lg border border-border-strong bg-surface px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                        <Button type="submit" variant="warm" size="sm" className="mt-2 w-full">
                          Reject
                        </Button>
                      </form>
                    </details>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
