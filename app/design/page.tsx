import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/review/rating-stars";
import { BusinessCard } from "@/components/business/business-card";
import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Background", token: "--background", hex: "#F4ECD8", note: "warm cream" },
  { name: "Background soft", token: "--background-soft", hex: "#FAF5E8", note: "cards on photos" },
  { name: "Surface", token: "--surface", hex: "#FFFFFF", note: "elevated cards" },
  { name: "Ink", token: "--ink", hex: "#2C2A25", note: "primary text" },
  { name: "Ink soft", token: "--ink-soft", hex: "#6F6A5D", note: "secondary text" },
  { name: "Sage", token: "--sage", hex: "#7D8B5E", note: "primary brand" },
  { name: "Sage deep", token: "--sage-deep", hex: "#5F6C45", note: "hover, contrast" },
  { name: "Terracotta", token: "--terracotta", hex: "#C97B5A", note: "warm accent / CTAs" },
  { name: "Terracotta deep", token: "--terracotta-deep", hex: "#A85E3F", note: "hover, contrast" },
  { name: "Border", token: "--border", hex: "rgba(44,42,37,0.10)", note: "dividers" },
];

const sampleBusinesses = [
  {
    slug: "trinity-dental-houston",
    name: "Trinity Dental",
    category: "HEALTH_BEAUTY",
    subcategory: "General dentistry",
    city: "Houston",
    state: "TX",
    rating: 4.8,
    reviewCount: 142,
    priceTier: 3 as const,
    photoUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=70",
    ownerVerified: true,
  },
  {
    slug: "bangkok-social",
    name: "Bangkok Social",
    category: "FOOD_DRINK",
    subcategory: "Thai · Cocktails",
    city: "Houston",
    state: "TX",
    rating: 4.6,
    reviewCount: 318,
    priceTier: 3 as const,
    photoUrl:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=900&q=70",
    ownerVerified: false,
  },
  {
    slug: "pearl-dentistry-katy",
    name: "Pearl Dentistry",
    category: "HEALTH_BEAUTY",
    subcategory: "Family dentistry",
    city: "Katy",
    state: "TX",
    rating: 4.9,
    reviewCount: 87,
    priceTier: 3 as const,
    photoUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=70",
    ownerVerified: true,
  },
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-5 flex items-center justify-between">
          <Wordmark useImage size="default" />
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span className="tnum">v0.2 · sage + terracotta</span>
            <Badge variant="muted">noindex</Badge>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-6">
            Design system · v0.2
          </p>
          <h1
            className="font-display text-ink leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            A homey, neighborly review site for the{" "}
            <span className="text-terracotta-deep">small places</span> that
            anchor a community.
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-ink-soft leading-relaxed">
            Sage on cream, with terracotta accents — pulled directly from the
            logo. Nunito for everything legible, Quicksand for the wordmark.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="warm" size="pill">
              Primary action
            </Button>
            <Button variant="sage" size="pill">
              Sage action
            </Button>
            <Button variant="outline" size="pill">
              Secondary
            </Button>
          </div>
        </div>
      </section>

      <Section eyebrow="01" title="Color">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {swatches.map((s) => (
            <div key={s.token}>
              <div
                className="aspect-square rounded-2xl border border-border"
                style={{ background: s.hex }}
              />
              <div className="mt-3">
                <p className="text-sm font-bold text-ink">{s.name}</p>
                <p className="text-xs text-ink-soft tnum mt-0.5">{s.hex}</p>
                <p className="text-xs text-ink-soft/70 mt-0.5">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-soft max-w-[680px]">
          Sage is the trust color (verified badges, secondary nav, brand primary).
          Terracotta is the warm action color (CTAs, focus rings, the period
          after the wordmark). Borders and text stay warm-neutral, never pure
          black.
        </p>
      </Section>

      <Section eyebrow="02" title="Type">
        <div className="space-y-10">
          <TypeRow label="Display · Nunito 800">
            <p
              className="font-display text-ink leading-[0.98]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Find the family-owned places near you.
            </p>
          </TypeRow>

          <TypeRow label="Wordmark · Quicksand">
            <Wordmark size="xl" asLink={false} />
          </TypeRow>

          <TypeRow label="Heading · Nunito 700">
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Section heading, 30px / bold
            </h2>
            <h3 className="text-xl font-bold text-ink mt-4">
              Subhead, 20px / bold
            </h3>
          </TypeRow>

          <TypeRow label="Body · Nunito 400/600">
            <p className="text-base text-ink max-w-[680px] leading-relaxed">
              Body copy is friendly and grown-up. Nunito&apos;s round shapes
              keep things warm without crossing into cute. Long paragraphs
              cap around 680px so they&apos;re actually readable.
            </p>
            <p className="text-sm text-ink-soft max-w-[680px] mt-3">
              Secondary text uses the soft-ink color and steps down to 14px.
            </p>
          </TypeRow>

          <TypeRow label="Numerals · tabular">
            <p className="text-2xl font-bold tnum text-ink">
              4.8 · 142 reviews · $$$ · 11:30–22:00
            </p>
          </TypeRow>
        </div>
      </Section>

      <Section eyebrow="03" title="Buttons">
        <div className="space-y-8">
          <Row label="Variants">
            <Button variant="default">Ink</Button>
            <Button variant="sage">Sage</Button>
            <Button variant="warm">Terracotta</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link →</Button>
          </Row>
          <Row label="Sizes">
            <Button variant="warm" size="sm">
              Small
            </Button>
            <Button variant="warm">Default</Button>
            <Button variant="warm" size="lg">
              Large
            </Button>
            <Button variant="warm" size="pill">
              Pill (Yelp-style)
            </Button>
          </Row>
          <Row label="Disabled">
            <Button variant="warm" disabled>
              Disabled
            </Button>
            <Button variant="outline" disabled>
              Disabled outline
            </Button>
          </Row>
        </div>
      </Section>

      <Section eyebrow="04" title="Form">
        <div className="grid md:grid-cols-2 gap-8 max-w-[860px]">
          <div className="space-y-2">
            <Label htmlFor="ds-email">Email</Label>
            <Input id="ds-email" type="email" placeholder="you@neighborhood.com" />
            <p className="text-xs text-ink-soft mt-1">
              We&apos;ll send a one-time sign-in link.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ds-search">Search</Label>
            <Input id="ds-search" placeholder="Coffee, dentist, bike repair…" />
          </div>
        </div>
      </Section>

      <Section eyebrow="05" title="Badges & ratings">
        <div className="space-y-8">
          <Row label="Badges">
            <Badge variant="default">Default</Badge>
            <Badge variant="sage">Owner verified</Badge>
            <Badge variant="warm">New this week</Badge>
            <Badge variant="outline">Pending review</Badge>
            <Badge variant="muted">Independent</Badge>
          </Row>
          <Row label="Ratings">
            <RatingStars rating={4.8} size="sm" showNumber />
            <RatingStars rating={4.6} size="md" showNumber />
            <RatingStars rating={3.0} size="lg" showNumber />
          </Row>
        </div>
      </Section>

      <Section eyebrow="06" title="Cards">
        <div className="grid md:grid-cols-2 gap-6 max-w-[920px]">
          <Card>
            <CardHeader>
              <CardTitle>Generic card</CardTitle>
              <CardDescription>
                White surface, 1px border, warm rounding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink">
                Cards do quiet structural work. Soft shadow on hover keeps the
                feel friendly without getting bubbly.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="warm" size="sm">
                Confirm
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-3xl">
                Editorial variant
              </CardTitle>
              <CardDescription>
                Display Nunito title, soft body underneath.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <RatingStars rating={4.7} size="sm" />
                <span className="text-sm tnum text-ink-soft">4.7 (62)</span>
              </div>
              <p className="text-sm text-ink">
                Cards can carry more weight when the content earns it — like a
                business detail header — without becoming the focal point.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section eyebrow="07" title="Business card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBusinesses.map((b) => (
            <BusinessCard key={b.slug} business={b} />
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft max-w-[680px]">
          Photos do the heavy lifting. Names in display Nunito, secondary
          metadata in soft ink, ratings tabular and quiet, sage badge for
          owner-verified.
        </p>
      </Section>

      <Section eyebrow="08" title="Wordmark">
        <div className="space-y-10">
          <Row label="Logo image — sizes">
            <Wordmark useImage size="sm" asLink={false} />
            <Wordmark useImage size="default" asLink={false} />
            <Wordmark useImage size="lg" asLink={false} />
          </Row>
          <Row label="Logo image — large">
            <Wordmark useImage size="xl" asLink={false} />
          </Row>
          <Row label="Text fallback (color split)">
            <Wordmark size="sm" asLink={false} />
            <Wordmark size="default" asLink={false} />
            <Wordmark size="lg" asLink={false} />
          </Row>
          <Row label="Text — monochrome">
            <Wordmark size="lg" asLink={false} monochrome />
          </Row>
          <Row label="Text — with tagline">
            <Wordmark size="lg" asLink={false} showTagline />
          </Row>
          <p className="text-sm text-ink-soft max-w-[680px]">
            The image variant uses your actual logo PNG. The text fallback
            (sage &quot;boost&quot; + terracotta &quot;small&quot; in
            Quicksand) is used in places where the logo&apos;s cream background
            would conflict — like the homepage hero nav, which sits over a
            dark photo.
          </p>
        </div>
      </Section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-10 text-xs text-ink-soft">
          Design system · boostsmall · noindex · v0.2 sage + terracotta
        </div>
      </footer>
    </main>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-16">
          <div>
            <p className="text-xs tnum tracking-widest text-sage-deep font-bold">
              {eyebrow}
            </p>
            <h2 className="font-display text-3xl text-ink mt-2 leading-tight">
              {title}
            </h2>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-ink-soft font-bold mb-3">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function TypeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-ink-soft font-bold mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}
