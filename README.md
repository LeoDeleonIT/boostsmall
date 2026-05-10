# boostsmall

Discovery and reviews for independent, locally-owned small businesses. No chains, no franchises, no publicly-traded restaurant groups.

## Stack

- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4
- PostgreSQL (Neon) + Prisma 7
- Auth.js v5 (Google + Resend magic-link)
- Mapbox GL JS for maps and geocoding
- UploadThing for photo uploads
- Resend for transactional email
- Deployed on Vercel · DNS on Cloudflare

## Local development

```bash
pnpm install
cp .env.example .env.local   # then fill in keys
pnpm db:push                 # push schema to your Neon database
pnpm db:seed-chains          # seed the chain blocklist
pnpm db:seed                 # seed sample businesses (Houston metro)
pnpm dev                     # http://localhost:3000
```

The design preview is at `/design` (App Router doesn't allow `_`-prefixed route folders, so it lives at `/design`). It is `noindex` and is the source of truth for design tokens.

## Project structure

```
app/
  (marketing)/        public landing, about, how-it-works
  (app)/              public app pages — /b/[slug], /search, /submit, /u/[username]
  (owner)/            /owner/* — claim flow, dashboard
  (moderate)/         /moderate/* — moderation queue
  (admin)/            /admin/* — chain blocklist, etc.
  design/             design system preview (noindex)
  api/                route handlers
components/
  ui/                 primitives (Button, Card, Input, ...)
  business/           BusinessCard, BusinessHeader
  review/             RatingStars, ReviewCard, ReviewForm
  map/                MapboxMap, MapPin
lib/
  auth.ts             Auth.js v5 config
  db.ts               Prisma client singleton
  geocode.ts          Mapbox geocoding wrapper
  chain-check.ts      blocklist + heuristics
  utils.ts            cn() helper
  validators/         shared Zod schemas
server/
  actions/            Server Actions, one file per domain
prisma/
  schema.prisma
  seed.ts             sample businesses
  seed-chains.ts      chain blocklist
```

Server-only modules import `'server-only'`. All DB queries are server-side. No client-side database access.

## Domain & DNS (Cloudflare → Vercel → Resend)

`boostsmall.com` is registered with Cloudflare. Records to add:

### Vercel (web)
After importing the repo into Vercel and adding `boostsmall.com` as a custom domain, Vercel will give you the exact records to add in Cloudflare:

- `A` for the apex pointing at Vercel's IP, or `ALIAS`/`CNAME` flattening if Cloudflare offers it
- `CNAME` for `www` pointing at `cname.vercel-dns.com`

Set Cloudflare proxy to **DNS-only (grey cloud)** for these — Vercel handles its own TLS.

### Resend (email)
After adding `boostsmall.com` in the Resend dashboard, add the records they list. Typically:

- `TXT` for SPF: `v=spf1 include:_spf.resend.com ~all`
- `TXT` for DKIM: a Resend-provided long string at `resend._domainkey`
- `TXT` for DMARC at `_dmarc`: `v=DMARC1; p=none; rua=mailto:dmarc@boostsmall.com`
- (Optional) `MX` if you want a return-path subdomain

Verify in the Resend dashboard before testing magic-link sign-in. Magic-link sends will silently fail until DNS propagates and Resend marks the domain verified.

### Email senders
- `noreply@boostsmall.com` — magic-link sign-in
- `notifications@boostsmall.com` — review notifications, owner alerts
- `Reply-To: hello@boostsmall.com` — placeholder; no inbox required for sends

No actual mailbox needs to exist for sending. If you set one up later, no code change required.

## Environment variables

See `.env.example`. Everything goes in `.env.local` for development; mirror to Vercel's project env for production.

## Auth notes

- Google OAuth redirect URIs to register at `console.cloud.google.com`:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://boostsmall.com/api/auth/callback/google`
- Vercel preview deploys (`*.vercel.app`) **don't work** with Google sign-in (Google rejects wildcard redirects). Magic-link still works on previews.
- First sign-in with `ADMIN_EMAIL` is auto-promoted to `ADMIN`.

## Why no chains?

A business is allowed if it's independently owned, operating in 5 or fewer physical locations, not publicly traded or majority-owned by a publicly-traded parent, and not on the chain blocklist (`prisma/seed-chains.ts`). Submissions are checked at three layers: blocklist match, location-count threshold, and human moderation.
