import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { submitBusinessAction } from "@/server/actions/submit";

export const metadata: Metadata = {
  title: "Add a business",
};

const CATEGORIES = [
  { value: "FOOD_DRINK", label: "Food & Drink" },
  { value: "RETAIL", label: "Retail" },
  { value: "SERVICES", label: "Services" },
  { value: "HEALTH_BEAUTY", label: "Health & Beauty" },
  { value: "ARTS", label: "Arts" },
  { value: "OTHER", label: "Other" },
];

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; field?: string; msg?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/submit");

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-2xl px-6 py-12 w-full">
        <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
          Add a business
        </p>
        <h1 className="font-display text-4xl text-ink leading-tight">
          Know a family-owned spot we&apos;re missing?
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          We&apos;ll review every submission to keep chains and franchises out.
          Independently or family-owned only.{" "}
          <Link href="/about" className="text-terracotta-deep hover:underline underline-offset-4">
            How boostsmall works
          </Link>
          .
        </p>

        {params.error && (
          <div className="mt-6 rounded-2xl border border-terracotta/40 bg-terracotta/10 p-5 text-sm">
            <p className="text-terracotta-deep font-semibold">
              {errorMessage(params)}
            </p>
          </div>
        )}

        <form action={submitBusinessAction} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Business name <Required /></Label>
            <Input id="name" name="name" required maxLength={120} placeholder="Pearl Dentistry" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category <Required /></Label>
              <select
                id="category"
                name="category"
                required
                defaultValue="FOOD_DRINK"
                className="flex h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input id="subcategory" name="subcategory" placeholder="Vietnamese, Bookstore, Plumbing…" maxLength={80} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={2000}
              placeholder="What makes this place worth knowing about?"
              className="flex w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm placeholder:text-ink-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <fieldset className="space-y-4 pt-2">
            <legend className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-1">
              Address
            </legend>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Street <Required /></Label>
              <Input id="addressLine1" name="addressLine1" required maxLength={200} placeholder="3206 White Oak Drive" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Suite / unit</Label>
              <Input id="addressLine2" name="addressLine2" maxLength={200} placeholder="Suite 101" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-[1fr_80px_120px] gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City <Required /></Label>
                <Input id="city" name="city" required maxLength={80} placeholder="Houston" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State <Required /></Label>
                <Input id="state" name="state" required maxLength={2} placeholder="TX" defaultValue="TX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">ZIP <Required /></Label>
                <Input id="postalCode" name="postalCode" required pattern="\d{5}(-\d{4})?" placeholder="77007" />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 pt-2">
            <legend className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-1">
              Optional details
            </legend>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(713) 555-1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website</Label>
                <Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://example.com" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramHandle">Instagram</Label>
                <Input id="instagramHandle" name="instagramHandle" placeholder="@yourhandle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceTier">Price</Label>
                <select
                  id="priceTier"
                  name="priceTier"
                  defaultValue="2"
                  className="flex h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <option value="1">$ — Inexpensive</option>
                  <option value="2">$$ — Moderate</option>
                  <option value="3">$$$ — Pricey</option>
                  <option value="4">$$$$ — Premium</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationCount">Locations</Label>
                <Input id="locationCount" name="locationCount" type="number" min={1} defaultValue={1} />
              </div>
            </div>
          </fieldset>

          <div className="rounded-xl border border-border bg-background-soft p-4 text-xs text-ink-soft">
            <p className="font-semibold text-ink mb-1">What happens next</p>
            We&apos;ll geocode the address, run it through the chain-blocklist
            check, and route it to a human moderator. Most submissions are
            decided within a few days. We&apos;ll let you know either way.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="warm" size="lg">
              Submit for review
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}

function Required() {
  return <span className="text-terracotta-deep" aria-hidden="true">*</span>;
}

function errorMessage({
  error,
  reason,
  msg,
  field,
}: {
  error?: string;
  reason?: string;
  msg?: string;
  field?: string;
}) {
  switch (error) {
    case "rate-limited":
      return "You've submitted a lot recently. Please wait a bit and try again.";
    case "rejected":
      return `Submission rejected — ${reason ?? "matched the chain blocklist"}.`;
    case "invalid":
      return `Form error${field ? ` (${field})` : ""}: ${msg ?? "check your input"}`;
    default:
      return "Something went wrong.";
  }
}
