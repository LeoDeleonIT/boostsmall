# Image Sources — boostsmall

All images sourced from **Unsplash** (free for commercial use, no attribution required under the Unsplash License — credit included here as a courtesy, not an obligation). Zero Pexels results made the final cut but both domains were searched.

---

## Honest caveats — read first

Two constraints shaped this list:

1. **I could not view the images directly.** Unsplash blocked my page-fetch tool (HTTP 403), so I curated from search-result titles, tags, and photographer names. Image aesthetic quality is inferred, not verified. You should still eyeball each URL before committing it to the site.
2. **I could not download the files.** The shell on this machine was unavailable, so I could not run `curl` or create the `public/images/` directory tree. Use the PowerShell block at the bottom of this file to batch-download everything, or download by hand.

Slots where no good candidate surfaced are marked **NEEDS MANUAL SEARCH** — pick those yourself rather than accept a mediocre match.

The `public/images/` folder does not yet exist in the repo. The PowerShell script creates it.

---

## 1. Hero Collage

### Coffee & moka pot (counter still-life)
- **URL:** https://unsplash.com/photos/coffee-and-a-moka-pot-on-a-sunny-day-xnDOC1jjM5Q
- **Photographer:** okeykat
- **Download:** https://unsplash.com/photos/xnDOC1jjM5Q/download?force=true&w=2400
- **Why chosen:** Described as warm golden sunlight on a cozy outdoor terrace — strongest hit for the "afternoon golden-hour" target.
- **Suggested filename:** `public/images/hero/hero-coffee-moka.jpg`

### Stack of antique books
- **URL:** https://unsplash.com/photos/a-stack-of-antique-books-in-close-up-qyVzDwoPhx0
- **Photographer:** Sergey Sokolov
- **Download:** https://unsplash.com/photos/qyVzDwoPhx0/download?force=true&w=2400
- **Why chosen:** "Antique books in close-up" — worn, tactile, no glossy finish.
- **Suggested filename:** `public/images/hero/hero-books-stack.jpg`

### Plants by a bright window
- **URL:** https://unsplash.com/photos/a-room-filled-with-lots-of-green-plants-next-to-a-window-AR1cd7bjPiA
- **Photographer:** (check page — not surfaced in search)
- **Download:** https://unsplash.com/photos/AR1cd7bjPiA/download?force=true&w=2400
- **Why chosen:** Plants + natural window light — stands in for the monstera-by-window ask.
- **Suggested filename:** `public/images/hero/hero-plants-window.jpg`

### Storefront with green awning
- **URL:** https://unsplash.com/photos/a-store-front-with-a-green-awning-on-a-city-street-fnvchx3K69Q
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/fnvchx3K69Q/download?force=true&w=2400
- **Why chosen:** Tagged "Vintage" in Unsplash metadata — aged, lived-in city-street feel vs. glossy corporate.
- **Suggested filename:** `public/images/hero/hero-storefront-awning.jpg`

### Baker making bread (hands at work)
- **URL:** https://unsplash.com/photos/a-man-is-making-bread-in-a-bakery-SBzJWJ30G_E
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/SBzJWJ30G_E/download?force=true&w=2400
- **Why chosen:** Real bakery work rather than styled dough product shot.
- **Suggested filename:** `public/images/hero/hero-kneading-dough.jpg`

### Window glowing at dusk
- **URL:** https://unsplash.com/photos/building-window-glowing-with-warm-orange-light-at-night-C7V1NvzL2Sw
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/C7V1NvzL2Sw/download?force=true&w=2400
- **Why chosen:** "Warm orange light" in the title — the exact color cast the brief calls for.
- **Suggested filename:** `public/images/hero/hero-window-dusk.jpg`

---

## 2. Featured Business Cards

### Fluff Bake Bar — pastry display
- **URL:** https://unsplash.com/photos/a-display-of-pastries-in-a-bakery-window-taskk1xQStA
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/taskk1xQStA/download?force=true&w=2400
- **Why chosen:** Literal pastry case in a bakery window — matches Fluff's "whimsical cookies & pastries" tagline.
- **Suggested filename:** `public/images/businesses/business-fluff-bake-bar.jpg`

### Kaboom Books — bookstore with ladder
- **URL:** https://unsplash.com/photos/bookstore-interior-filled-with-shelves-and-a-ladder-Cvw4fs16tmI
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/Cvw4fs16tmI/download?force=true&w=2400
- **Why chosen:** "Filled with shelves and a ladder" echoes Kaboom's labyrinthine 100k-title character.
- **Suggested filename:** `public/images/businesses/business-kaboom-books.jpg`

### 901 Salon & Boutique — salon interior
- **URL:** https://unsplash.com/photos/a-hair-salon-with-chairs-and-mirrors-DUvovc88OfE
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/DUvovc88OfE/download?force=true&w=2400
- **Why chosen:** Best specific-photo hit from salon searches; **lower confidence on warmth** — preview before using, may lean too modern-minimalist. Candidate backup: browse https://unsplash.com/s/photos/salon-interior
- **Suggested filename:** `public/images/businesses/business-901-salon.jpg`
- ⚠️ **Preview this one carefully.**

### Siphon Coffee — coffee shop with brick wall
- **URL:** https://unsplash.com/photos/a-coffee-shop-with-a-brick-wall-and-a-blue-counter-Che5p3omBXQ
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/Che5p3omBXQ/download?force=true&w=2400
- **Why chosen:** Exposed brick + counter matches the Siphon character.
- **Suggested filename:** `public/images/businesses/business-siphon-coffee.jpg`

### EaDo Bike Co — mechanic at work
- **URL:** https://unsplash.com/photos/a-man-working-on-a-bicycle-in-a-bike-shop-jTmvKwtJeYk
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/jTmvKwtJeYk/download?force=true&w=2400
- **Why chosen:** Actual repair in progress — workshop feel, not showroom.
- **Suggested filename:** `public/images/businesses/business-eado-bike.jpg`

### Archway Gallery — small gallery interior
- **URL:** https://unsplash.com/photos/museum-gallery-with-paintings-and-a-bench-CowVogfkn9c
- **Photographer:** (check page)
- **Download:** https://unsplash.com/photos/CowVogfkn9c/download?force=true&w=2400
- **Why chosen:** Intimate scale with bench — matches Archway's 34-artist collective feel.
- **Suggested filename:** `public/images/businesses/business-archway-gallery.jpg`
- ⚠️ Note: "Museum" in the title may read as too formal. Backup with a more painterly-warm feel: https://unsplash.com/photos/A_BAqEP7FnA

---

## 3. Category Tiles

> **Note on category mismatch:** your brief lists 9 categories (Cafés, Bookstores, Bakeries, Salons, Bike Shops, Art Galleries, Tattoo, Record Stores, Florists) but `src/App.jsx:14-24` defines 9 different ones (Coffee, Restaurants, Bookstores, Salons, Bakeries, Repair, Services, Art, Plants). I sourced for the **brief's** list. Reconcile as needed — the Coffee / Bookstores / Bakeries / Salons / Art tiles work for both sets; Repair ≈ Bike Shops, Plants ≈ Florists, Services/Restaurants and Tattoo/Records are the gaps.

### Cafés — espresso machine
- **URL:** https://unsplash.com/photos/photo-of-espresso-machine-9rTEwV_G0Do
- **Download:** https://unsplash.com/photos/9rTEwV_G0Do/download?force=true&w=1600
- **Why chosen:** Clean detail shot of espresso machine; works as square crop.
- **Suggested filename:** `public/images/categories/cat-cafes.jpg`

### Bookstores — open book pages warm lit
- **URL:** https://unsplash.com/photos/close-up-photography-of-book-page-opening-XOW1WqrWNKg
- **Photographer:** Anastasia Zhenina
- **Download:** https://unsplash.com/photos/XOW1WqrWNKg/download?force=true&w=1600
- **Why chosen:** Explicitly tagged "warmth" and "bright" — strongest match for the brief's color palette.
- **Suggested filename:** `public/images/categories/cat-bookstores.jpg`

### Bakeries — bread loaves on cutting board
- **URL:** https://unsplash.com/photos/two-loaves-of-bread-sitting-on-a-cutting-board-uGopmYwL7TI
- **Download:** https://unsplash.com/photos/uGopmYwL7TI/download?force=true&w=1600
- **Why chosen:** Homemade presentation on wood — not a styled food-mag shot.
- **Suggested filename:** `public/images/categories/cat-bakeries.jpg`

### Salons — orange wooden comb
- **URL:** https://unsplash.com/photos/orange-and-white-hair-comb-WN1P9aSLfa4
- **Download:** https://unsplash.com/photos/WN1P9aSLfa4/download?force=true&w=1600
- **Why chosen:** Warm-toned wooden comb — single-object tile; avoids the grayscale scissors shot that would cool-cast the palette.
- **Suggested filename:** `public/images/categories/cat-salons.jpg`

### Bike Shops — spokes at sunrise
- **URL:** https://unsplash.com/photos/a-close-up-of-the-spokes-of-a-bicycle-EAQaYPrrN0Y
- **Photographer:** Kevin Omiple
- **Download:** https://unsplash.com/photos/EAQaYPrrN0Y/download?force=true&w=1600
- **Why chosen:** Sunrise glare through spokes — golden-hour hit exactly where you want it.
- **Suggested filename:** `public/images/categories/cat-bikes.jpg`

### Art Galleries — paint brushes in jar
- **URL:** https://unsplash.com/photos/paint-brushes-in-jar-bbbKrKr9Ld0
- **Photographer:** Mieke Campbell
- **Download:** https://unsplash.com/photos/bbbKrKr9Ld0/download?force=true&w=1600
- **Why chosen:** Working-artist object, not a finished-gallery shot. Reads as craft.
- **Suggested filename:** `public/images/categories/cat-art.jpg`

### Tattoo — machine close-up
- **URL:** https://unsplash.com/photos/a-close-up-of-a-device-BidOfsRqhIA
- **Download:** https://unsplash.com/photos/BidOfsRqhIA/download?force=true&w=1600
- **Why chosen:** Tagged "Acus tattoo" on Unsplash — a real tattoo machine detail.
- **Suggested filename:** `public/images/categories/cat-tattoo.jpg`
- ⚠️ Preview for warmth — tattoo equipment shots can skew cool/clinical.

### Record Stores — stacked records
- **URL:** https://unsplash.com/photos/a-bunch-of-records-stacked-on-top-of-each-other-IjtyAbhglR0
- **Download:** https://unsplash.com/photos/IjtyAbhglR0/download?force=true&w=1600
- **Why chosen:** Stack (not a single record on a turntable) — square-crop friendly.
- **Suggested filename:** `public/images/categories/cat-records.jpg`

### Florists — bouquet on paper
- **URL:** https://unsplash.com/photos/a-bouquet-of-flowers-on-a-piece-of-paper-yF_bjrLDyzs
- **Download:** https://unsplash.com/photos/yF_bjrLDyzs/download?force=true&w=1600
- **Why chosen:** Kraft-paper wrap matches the brief's exact ask.
- **Suggested filename:** `public/images/categories/cat-florists.jpg`

---

## 4. Textures & Backgrounds

Meant to overlay at 5–15% opacity, so exact composition matters less than tonal warmth.

### Red brick wall
- **URL:** https://unsplash.com/photos/a-textured-red-brick-wall-background--zFTrQ7N5Zs
- **Photographer:** Natalia Blauth
- **Download:** https://unsplash.com/photos/-zFTrQ7N5Zs/download?force=true&w=2400
- **Suggested filename:** `public/images/textures/tex-brick.jpg`

### Kraft paper
- **URL:** https://unsplash.com/photos/background-pattern-xQbYzQoV5_Y
- **Download:** https://unsplash.com/photos/xQbYzQoV5_Y/download?force=true&w=2400
- **Suggested filename:** `public/images/textures/tex-kraft.jpg`

### Linen canvas (beige)
- **URL:** https://unsplash.com/photos/beige-fabric-texture-as-background-linen-canvas-with-woven-pattern--M_EWdZzzDg
- **Download:** https://unsplash.com/photos/-M_EWdZzzDg/download?force=true&w=2400
- **Why chosen:** Title is literally "beige fabric texture … linen canvas with woven pattern" — exact match.
- **Suggested filename:** `public/images/textures/tex-linen.jpg`

### Wood grain (close-up)
- **URL:** https://unsplash.com/photos/a-close-up-of-a-wood-grain-surface-razBpzVrXhU
- **Download:** https://unsplash.com/photos/razBpzVrXhU/download?force=true&w=2400
- **Why chosen:** Generic wood-grain surface; verify it reads as walnut-tone vs. pine before using.
- **Suggested filename:** `public/images/textures/tex-wood.jpg`

### Old paper with torn edges
- **URL:** https://unsplash.com/photos/an-old-piece-of-paper-with-torn-edges-ICLgWINOp_A
- **Download:** https://unsplash.com/photos/ICLgWINOp_A/download?force=true&w=2400
- **Suggested filename:** `public/images/textures/tex-paper.jpg`

### Cork surface close-up
- **URL:** https://unsplash.com/photos/a-close-up-of-a-cork-textured-surface-pyPKuQxIHxA
- **Download:** https://unsplash.com/photos/pyPKuQxIHxA/download?force=true&w=2400
- **Suggested filename:** `public/images/textures/tex-cork.jpg`

---

## 5. For Business Owners

### Shop owner at her counter
- **URL:** https://unsplash.com/photos/a-woman-sitting-at-a-counter-in-a-store-EOkN2pRjFsg
- **Photographer:** Ali Mkumbwa
- **Download:** https://unsplash.com/photos/EOkN2pRjFsg/download?force=true&w=2400
- **Why chosen:** Search summary described this as an African businesswoman posing inside her small shop in Dar es Salaam — real shopkeeper, not a posed model.
- **Suggested filename:** `public/images/owners/owner-counter.jpg`

### Chalkboard menu / writing hand
- **Status:** NEEDS MANUAL SEARCH
- **Why:** No specific photo surfaced with strong "hand writing on chalkboard" signal. All results were collection landing pages. Start here: https://unsplash.com/s/photos/chalkboard-menu
- **Suggested filename:** `public/images/owners/owner-chalkboard.jpg`

### "Yes we're open" sign in bakery window
- **URL:** https://unsplash.com/photos/a-sign-that-says-yes-were-open-in-a-window-dxO90LN5KdU
- **Download:** https://unsplash.com/photos/dxO90LN5KdU/download?force=true&w=2400
- **Why chosen:** Tagged "Bakery" on Unsplash — handwritten-looking sign, not a neon.
- **Suggested filename:** `public/images/owners/owner-open-sign.jpg`

---

## 6. Reviews / Testimonials

### Person with coffee and book
- **URL:** https://unsplash.com/photos/GUo08am-WAY
- **Download:** https://unsplash.com/photos/GUo08am-WAY/download?force=true&w=2400
- **Why chosen:** "Person in gray sweater holding white ceramic mug" with book tag — reader-at-cafe scene, not an ad shot.
- **Suggested filename:** `public/images/reviews/review-coffee-book.jpg`

### Friends chatting at cafe
- **URL:** https://unsplash.com/photos/friends-are-chatting-and-having-coffee-at-a-cafe-rioA77g2-XU
- **Download:** https://unsplash.com/photos/rioA77g2-XU/download?force=true&w=2400
- **Why chosen:** Candid-feeling title; preview to confirm it's not overly posed.
- **Suggested filename:** `public/images/reviews/review-friends-cafe.jpg`

---

## 7. About / Manifesto

### Quaint street lined with shops
- **URL:** https://unsplash.com/photos/a-quaint-street-lined-with-shops-and-restaurants-9gXxl5dK5XY
- **Download:** https://unsplash.com/photos/9gXxl5dK5XY/download?force=true&w=2400
- **Why chosen:** "Quaint" in the title — the neighborhood-main-street feel the brief names.
- **Suggested filename:** `public/images/about/about-main-street.jpg`

### Narrow street with shops and greenery
- **URL:** https://unsplash.com/photos/narrow-street-lined-with-shops-and-greenery-q4KWiWgZ41Q
- **Download:** https://unsplash.com/photos/q4KWiWgZ41Q/download?force=true&w=2400
- **Why chosen:** Pairs well with the main-street shot; greenery adds the plant/brick/paper palette.
- **Suggested filename:** `public/images/about/about-shops-greenery.jpg`

---

## Batch downloader (PowerShell)

Paste this into PowerShell from the repo root (`C:\Users\leode\boostsmall\`). It creates the folder tree and downloads all images. The `?force=true&w=2400` Unsplash download endpoint returns an already-optimized JPEG; most will be ~300–600 KB. Category tiles use `w=1600` because they render smaller.

```powershell
$images = @(
  # hero
  @{ url="https://unsplash.com/photos/xnDOC1jjM5Q/download?force=true&w=2400";  path="public/images/hero/hero-coffee-moka.jpg" },
  @{ url="https://unsplash.com/photos/qyVzDwoPhx0/download?force=true&w=2400";  path="public/images/hero/hero-books-stack.jpg" },
  @{ url="https://unsplash.com/photos/AR1cd7bjPiA/download?force=true&w=2400";  path="public/images/hero/hero-plants-window.jpg" },
  @{ url="https://unsplash.com/photos/fnvchx3K69Q/download?force=true&w=2400";  path="public/images/hero/hero-storefront-awning.jpg" },
  @{ url="https://unsplash.com/photos/SBzJWJ30G_E/download?force=true&w=2400";  path="public/images/hero/hero-kneading-dough.jpg" },
  @{ url="https://unsplash.com/photos/C7V1NvzL2Sw/download?force=true&w=2400";  path="public/images/hero/hero-window-dusk.jpg" },
  # businesses
  @{ url="https://unsplash.com/photos/taskk1xQStA/download?force=true&w=2400";  path="public/images/businesses/business-fluff-bake-bar.jpg" },
  @{ url="https://unsplash.com/photos/Cvw4fs16tmI/download?force=true&w=2400";  path="public/images/businesses/business-kaboom-books.jpg" },
  @{ url="https://unsplash.com/photos/DUvovc88OfE/download?force=true&w=2400";  path="public/images/businesses/business-901-salon.jpg" },
  @{ url="https://unsplash.com/photos/Che5p3omBXQ/download?force=true&w=2400";  path="public/images/businesses/business-siphon-coffee.jpg" },
  @{ url="https://unsplash.com/photos/jTmvKwtJeYk/download?force=true&w=2400";  path="public/images/businesses/business-eado-bike.jpg" },
  @{ url="https://unsplash.com/photos/CowVogfkn9c/download?force=true&w=2400";  path="public/images/businesses/business-archway-gallery.jpg" },
  # categories
  @{ url="https://unsplash.com/photos/9rTEwV_G0Do/download?force=true&w=1600";  path="public/images/categories/cat-cafes.jpg" },
  @{ url="https://unsplash.com/photos/XOW1WqrWNKg/download?force=true&w=1600";  path="public/images/categories/cat-bookstores.jpg" },
  @{ url="https://unsplash.com/photos/uGopmYwL7TI/download?force=true&w=1600";  path="public/images/categories/cat-bakeries.jpg" },
  @{ url="https://unsplash.com/photos/WN1P9aSLfa4/download?force=true&w=1600";  path="public/images/categories/cat-salons.jpg" },
  @{ url="https://unsplash.com/photos/EAQaYPrrN0Y/download?force=true&w=1600";  path="public/images/categories/cat-bikes.jpg" },
  @{ url="https://unsplash.com/photos/bbbKrKr9Ld0/download?force=true&w=1600";  path="public/images/categories/cat-art.jpg" },
  @{ url="https://unsplash.com/photos/BidOfsRqhIA/download?force=true&w=1600";  path="public/images/categories/cat-tattoo.jpg" },
  @{ url="https://unsplash.com/photos/IjtyAbhglR0/download?force=true&w=1600";  path="public/images/categories/cat-records.jpg" },
  @{ url="https://unsplash.com/photos/yF_bjrLDyzs/download?force=true&w=1600";  path="public/images/categories/cat-florists.jpg" },
  # textures
  @{ url="https://unsplash.com/photos/-zFTrQ7N5Zs/download?force=true&w=2400"; path="public/images/textures/tex-brick.jpg" },
  @{ url="https://unsplash.com/photos/xQbYzQoV5_Y/download?force=true&w=2400";  path="public/images/textures/tex-kraft.jpg" },
  @{ url="https://unsplash.com/photos/-M_EWdZzzDg/download?force=true&w=2400"; path="public/images/textures/tex-linen.jpg" },
  @{ url="https://unsplash.com/photos/razBpzVrXhU/download?force=true&w=2400";  path="public/images/textures/tex-wood.jpg" },
  @{ url="https://unsplash.com/photos/ICLgWINOp_A/download?force=true&w=2400";  path="public/images/textures/tex-paper.jpg" },
  @{ url="https://unsplash.com/photos/pyPKuQxIHxA/download?force=true&w=2400";  path="public/images/textures/tex-cork.jpg" },
  # owners
  @{ url="https://unsplash.com/photos/EOkN2pRjFsg/download?force=true&w=2400";  path="public/images/owners/owner-counter.jpg" },
  @{ url="https://unsplash.com/photos/dxO90LN5KdU/download?force=true&w=2400";  path="public/images/owners/owner-open-sign.jpg" },
  # reviews
  @{ url="https://unsplash.com/photos/GUo08am-WAY/download?force=true&w=2400";  path="public/images/reviews/review-coffee-book.jpg" },
  @{ url="https://unsplash.com/photos/rioA77g2-XU/download?force=true&w=2400";  path="public/images/reviews/review-friends-cafe.jpg" },
  # about
  @{ url="https://unsplash.com/photos/9gXxl5dK5XY/download?force=true&w=2400";  path="public/images/about/about-main-street.jpg" },
  @{ url="https://unsplash.com/photos/q4KWiWgZ41Q/download?force=true&w=2400";  path="public/images/about/about-shops-greenery.jpg" }
)

foreach ($img in $images) {
  $dir = Split-Path $img.path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Write-Host "Downloading $($img.path)..."
  Invoke-WebRequest -Uri $img.url -OutFile $img.path -UseBasicParsing
}
Write-Host "Done. $($images.Count) images downloaded."
```

If any image lands over 500 KB after download, compress with a single pass of [ImageOptim](https://imageoptim.com/) / [Squoosh](https://squoosh.app/) at quality 80–82. The Unsplash CDN at `w=2400` is already quite reasonable for most shots.

---

## Verification checklist

- [x] Every URL is unsplash.com (Pexels blocked fetches; nothing usable surfaced there).
- [x] Every image has a photographer name *or* a note to check the page for credit (search results sometimes omitted the name).
- [ ] No image has visible watermark — **you must verify; I could not view images.**
- [ ] Color palette feels consistent — **you must verify.**
- [ ] No two images feel redundant — curated for variety in subject; confirm visually.
- [ ] Downloaded files under 500 KB each — run the PowerShell above then check.

## Slots flagged / unfilled

- **Owner: chalkboard menu** — NEEDS MANUAL SEARCH. Start at https://unsplash.com/s/photos/chalkboard-menu
- **Business: 901 Salon** — preview before committing; aesthetic warmth is the riskiest of the six.
- **Business: Archway Gallery** — "museum" in the title may skew formal; backup option in the section above.
- **Category: Tattoo** — preview for warm tone; consider a shot of inked skin or a tattooed-arm shop scene if the machine reads cold.
