import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/review/rating-stars";
import { cn } from "@/lib/utils";
import { toggleBookmarkAction } from "@/server/actions/bookmark";

export interface BusinessCardData {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  priceTier: 1 | 2 | 3 | 4;
  /** Pass either a single URL or an array — first is used for the cover. */
  photoUrl?: string;
  photoUrls?: string[];
  ownerVerified?: boolean;
}

const priceLabel = (tier: 1 | 2 | 3 | 4) => "$".repeat(tier);

export function BusinessCard({
  business,
  className,
  bookmarked = false,
  showBookmark = true,
  bookmarkRedirectTo,
}: {
  business: BusinessCardData;
  className?: string;
  /** Whether the signed-in user has bookmarked this business. */
  bookmarked?: boolean;
  /** Hide the heart entirely (e.g. on the owner dashboard). */
  showBookmark?: boolean;
  /** Where to send the user after toggling the bookmark. Defaults to
   * the business detail page, but list pages want to stay put. */
  bookmarkRedirectTo?: string;
}) {
  return (
    <div
      data-business-slug={business.slug}
      className={cn(
        "group relative block rounded-lg border border-border bg-surface overflow-hidden transition-all hover:border-border-strong",
        // `data-[map-active]` is toggled by SearchInteractions when a map pin
        // is clicked — keep it in sync if you change the highlight style.
        "data-[map-active=true]:ring-2 data-[map-active=true]:ring-terracotta data-[map-active=true]:border-terracotta",
        className
      )}
    >
      {showBookmark && (
        <form
          action={toggleBookmarkAction}
          className="absolute top-3 right-3 z-10"
        >
          <input type="hidden" name="businessSlug" value={business.slug} />
          {bookmarkRedirectTo && (
            <input type="hidden" name="redirectTo" value={bookmarkRedirectTo} />
          )}
          <button
            type="submit"
            aria-pressed={bookmarked}
            aria-label={bookmarked ? "Remove from saved" : "Save for later"}
            title={bookmarked ? "Remove from saved" : "Save for later"}
            className={cn(
              "inline-flex items-center justify-center h-9 w-9 rounded-full backdrop-blur-sm transition-colors",
              bookmarked
                ? "bg-terracotta text-white hover:bg-terracotta-deep"
                : "bg-white/85 text-ink-soft hover:bg-white hover:text-terracotta-deep"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </form>
      )}

      <Link href={`/b/${business.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/5">
          {(() => {
            const cover = business.photoUrl ?? business.photoUrls?.[0];
            return cover ? (
              <Image
                src={cover}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink-soft text-xs">
                No photo yet
              </div>
            );
          })()}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl leading-none text-ink">
              {business.name}
            </h3>
            {business.ownerVerified && (
              <Badge variant="sage" className="shrink-0 mt-1">
                Owner verified
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-ink-soft">
            {business.subcategory ?? business.category} · {business.city},{" "}
            {business.state}
          </p>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <RatingStars rating={business.rating} size="sm" />
            <span className="tnum text-ink-soft">
              {business.rating.toFixed(1)}{" "}
              <span className="text-ink-soft/70">
                ({business.reviewCount.toLocaleString()})
              </span>
            </span>
            <span className="text-ink-soft/50">·</span>
            <span className="tnum text-ink-soft">
              {priceLabel(business.priceTier)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
