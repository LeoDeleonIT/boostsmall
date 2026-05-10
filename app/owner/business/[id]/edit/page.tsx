import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateBusinessAction, deletePhotoAction } from "@/server/actions/owner";
import { BusinessPhotoManager } from "@/components/business/business-photo-manager";

export const metadata: Metadata = {
  title: "Edit business",
  robots: { index: false, follow: false },
};

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const business = await db.business.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      city: true,
      state: true,
      addressLine1: true,
      phone: true,
      websiteUrl: true,
      instagramHandle: true,
      owners: { select: { userId: true } },
      photos: {
        where: { reviewId: null }, // business-level photos only, not review attachments
        orderBy: { createdAt: "desc" },
        select: { id: true, url: true, width: true, height: true },
      },
    },
  });
  if (!business) notFound();

  const isOwner = business.owners.some((o) => o.userId === session.user.id);
  if (!isOwner && session.user.role !== "ADMIN") {
    redirect(`/owner/dashboard?error=forbidden`);
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-2xl px-6 py-12 w-full">
        <Link
          href="/owner/dashboard"
          className="text-sm text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          ← back to dashboard
        </Link>

        <h1 className="font-display text-4xl text-ink mt-4 leading-tight">
          Edit {business.name}
        </h1>
        <p className="mt-2 text-ink-soft">
          Updates publish immediately. Address changes require re-verification
          and aren&apos;t editable here yet — contact the moderators if you need
          to move locations.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-background-soft p-4 text-sm">
          <p className="font-semibold text-ink">Read-only</p>
          <p className="text-ink-soft mt-1">
            {business.addressLine1}, {business.city}, {business.state}
          </p>
        </div>

        <section className="mt-10">
          <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
            Photos
          </p>
          <BusinessPhotoManager
            businessId={business.id}
            photos={business.photos}
            onDeletePhoto={deletePhotoAction}
          />
        </section>

        <form action={updateBusinessAction} className="mt-10 space-y-6">
          <input type="hidden" name="businessId" value={business.id} />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={business.description ?? ""}
              rows={5}
              maxLength={2000}
              placeholder="Tell people what makes this place worth visiting."
              className="flex w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm placeholder:text-ink-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <p className="text-xs text-ink-soft">Up to 2000 characters.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={business.phone ?? ""}
                placeholder="(713) 555-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                defaultValue={business.websiteUrl ?? ""}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramHandle">Instagram</Label>
            <Input
              id="instagramHandle"
              name="instagramHandle"
              defaultValue={business.instagramHandle ?? ""}
              placeholder="@yourhandle"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="submit" variant="warm" size="lg">
              Save changes
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/owner/dashboard">Cancel</Link>
            </Button>
          </div>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
