# boostsmall

A directory for the independent shops that make your neighborhood feel like home.

## Local development

```
npm install
npm run dev
```

Dev server runs at http://localhost:5173

## Production build

```
npm run build
npm run preview
```

The built site is emitted to `dist/`.

## Deploy

The project is configured for **Vercel** and **Netlify** — both will auto-detect Vite and Just Work.

### Vercel (one-click)
1. Push this repo to GitHub
2. Go to https://vercel.com/new and import the repo
3. Click Deploy (no config needed — `vercel.json` handles it)

### Netlify
1. Push this repo to GitHub
2. Go to https://app.netlify.com/start and connect the repo
3. Build settings are picked up from `netlify.toml`

### Manual (any static host)
```
npm run build
```
Upload the contents of `dist/` to any static host (Cloudflare Pages, S3, GitHub Pages, etc).

## Images

Hero photos and the owner polaroid use [picsum.photos](https://picsum.photos) with deterministic seeds so you get consistent placeholder photos without hosting any yourself.

Business cards are designed — each shop has a category color palette and an icon rendered as the card header. Dropping real photos into `public/images/businesses/business-<slug>.jpg` will overlay the designed header automatically; a broken/missing file falls back to the design.

To swap in real photos later, see the filenames referenced in [`src/data/businesses.js`](src/data/businesses.js).

## Stack

- Vite + React 18
- Tailwind CSS 3.4
- framer-motion 11 (scroll reveal animations, respects `prefers-reduced-motion`)
- lucide-react (icons)
- Google Fonts: Fraunces (serif, `SOFT` axis at 100 for warmth), Inter (body), Caveat (handwritten)
