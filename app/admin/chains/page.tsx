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
import { addChainAction, removeChainAction } from "@/server/actions/chains";

export const metadata: Metadata = {
  title: "Chain blocklist",
  robots: { index: false, follow: false },
};

export default async function ChainsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/sign-in?callbackUrl=/admin/chains");
  }

  const chains = await db.chainBlocklist.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-[1200px] px-6 py-12 w-full">
        <Link
          href="/admin"
          className="text-sm text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          ← back to admin
        </Link>

        <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mt-4 mb-2">
          Admin · Chain blocklist
        </p>
        <h1 className="font-display text-4xl text-ink leading-tight">
          {chains.length} chain{chains.length === 1 ? "" : "s"} blocked
        </h1>
        <p className="mt-2 text-ink-soft max-w-prose">
          When someone tries to submit a business whose normalized name matches
          one of these, the submission is auto-rejected. Fuzzy matches go to
          moderation rather than being rejected outright.
        </p>

        {(ok || error) && (
          <div
            className={
              ok
                ? "mt-6 inline-block rounded-full bg-sage/10 px-4 py-2 text-sm font-semibold text-sage-deep"
                : "mt-6 inline-block rounded-full bg-terracotta/10 px-4 py-2 text-sm font-semibold text-terracotta-deep"
            }
          >
            {ok === "added" && "✓ Added."}
            {ok === "removed" && "✓ Removed."}
            {error === "exists" && "That chain is already in the blocklist."}
            {error === "invalid" && "Invalid request."}
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 max-w-xl">
          <h2 className="font-display text-2xl text-ink mb-4">Add a chain</h2>
          <form action={addChainAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required maxLength={120} placeholder="Sweetfin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentCompany">Parent company</Label>
              <Input id="parentCompany" name="parentCompany" maxLength={120} placeholder="Sweetfin Holdings" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" name="reason" maxLength={500} placeholder="Multi-state chain — VC backed" />
            </div>
            <Button type="submit" variant="sage" size="sm">
              Add to blocklist
            </Button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-ink mb-4">All blocked chains</h2>
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background-soft border-b border-border text-left text-xs uppercase tracking-widest text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Normalized</th>
                  <th className="px-4 py-3 font-bold">Parent</th>
                  <th className="px-4 py-3 font-bold">Added</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {chains.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background-soft/50">
                    <td className="px-4 py-3 font-semibold text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-ink-soft tnum">{c.normalizedName}</td>
                    <td className="px-4 py-3 text-ink-soft">{c.parentCompany ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-soft text-xs tnum">
                      {c.addedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={removeChainAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <Button type="submit" variant="ghost" size="sm" className="text-terracotta-deep hover:bg-terracotta/10">
                          Remove
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
