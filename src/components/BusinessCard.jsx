// Single business card — designed header (category-colored, icon-led)
// instead of a stock photo. Real photos can be dropped into /public/images/
// and the <img> will take over automatically (the designed header becomes
// the fallback layer underneath).

import { MapPin, Heart, Bookmark, Share2 } from "lucide-react";
import Star from "./svg/Star.jsx";
import VerifiedStamp from "./svg/VerifiedStamp.jsx";

function StarRow({ rating }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={13} filled={n <= full} />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-ink">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function BusinessCard({ business }) {
  const {
    name, category, neighborhood, tagline, rating, reviews, verified,
    image, icon: Icon, palette,
  } = business;

  return (
    <article className="group bg-cream rounded-2xl overflow-hidden shadow-warm-sm hover:shadow-warm-md border border-cream-dark transition-shadow duration-300">
      {/* Designed header — category-colored, icon-led. If a real image file
          exists at `image`, it overlays the design. */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: palette.bg }}
      >
        {/* Decorative blobs to give the color-field some shape */}
        <span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: 180, height: 180, top: -50, right: -50,
            background: palette.soft, opacity: 0.7,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: 110, height: 110, bottom: -30, left: -20,
            background: palette.soft, opacity: 0.55,
          }}
        />

        {/* Category icon centerpiece */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-warm-sm group-hover:scale-[1.04] transition-transform duration-500"
            style={{ background: palette.ink }}
          >
            <Icon size={36} strokeWidth={1.5} className="text-cream" />
          </div>
        </div>

        {/* Category label bottom-left */}
        <span
          className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-meta px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.72)", color: palette.ink }}
        >
          {category}
        </span>

        {/* Real photo (if available) — overlays the design, object-cover */}
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover photo-warm group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />

        {/* Verified stamp — always above the photo */}
        {verified && (
          <div className="absolute top-3 right-3 rotate-[-8deg] drop-shadow-sm">
            <VerifiedStamp size={62} />
          </div>
        )}
      </div>

      {/* Content block */}
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-soft mb-3">
          <MapPin size={11} strokeWidth={2.2} />
          <span>{neighborhood}</span>
        </div>

        <h3 className="font-serif text-xl md:text-2xl font-medium text-ink leading-snug mb-2">
          {name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <StarRow rating={rating} />
          <span className="text-xs text-ink-soft">({reviews})</span>
        </div>

        <p className="text-sm text-ink-soft leading-relaxed mb-5 min-h-[3rem]">
          {tagline}
        </p>

        {/* Four icon actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-cream-dark">
          <IconBtn label="Directions"><MapPin size={15} strokeWidth={2} /></IconBtn>
          <IconBtn label="Save"><Bookmark size={15} strokeWidth={2} /></IconBtn>
          <IconBtn label="Like"><Heart size={15} strokeWidth={2} /></IconBtn>
          <IconBtn label="Share"><Share2 size={15} strokeWidth={2} /></IconBtn>
        </div>
      </div>
    </article>
  );
}

function IconBtn({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-terracotta hover:bg-cream-dark/70 transition-colors"
    >
      {children}
    </button>
  );
}
