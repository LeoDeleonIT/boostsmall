import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/review/rating-stars";
import { cn } from "@/lib/utils";

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
}: {
  business: BusinessCardData;
  className?: string;
}) {
  return (
    <Link
      href={`/b/${business.slug}`}
      data-business-slug={business.slug}
      className={cn(
        "group block rounded-lg border border-border bg-surface overflow-hidden transition-all hover:border-border-strong",
        // `data-[map-active]` is toggled by SearchInteractions when a map pin
        // is clicked — keep it in sync if you change the highlight style.
        "data-[map-active=true]:ring-2 data-[map-active=true]:ring-terracotta data-[map-active=true]:border-terracotta",
        className
      )}
    >
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
  );
}
