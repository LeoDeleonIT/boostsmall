"use server";

import "server-only";
import { redirect } from "next/navigation";

// Maps the user's chosen "vibe" chip to a /search filter combo. Adding a new
// chip means adding both an entry here and a button on the /discover form.
const VIBE_TO_FILTERS: Record<
  string,
  { category?: string; q?: string; minRating?: string }
> = {
  "eat-drink":   { category: "FOOD_DRINK" },
  "date-night":  { category: "FOOD_DRINK", minRating: "4.5" },
  "coffee":      { q: "coffee" },
  "shop":        { category: "RETAIL" },
  "arts":        { category: "ARTS" },
  "wellness":    { category: "HEALTH_BEAUTY" },
  "services":    { category: "SERVICES" },
  "with-kids":   { q: "family" },
  "outdoors":    { q: "garden" },
};

// Map budget chips to a `price` (≤ tier).
const BUDGET_TO_PRICE: Record<string, string> = {
  cheap:  "1",
  medium: "3",
  treat:  "4",
};

export async function discoverAction(formData: FormData) {
  const vibe = (formData.get("vibe") as string)?.trim() ?? "";
  const budget = (formData.get("budget") as string)?.trim() ?? "";
  const userQ = (formData.get("q") as string)?.trim() ?? "";
  const zip = (formData.get("zip") as string)?.trim() ?? "";
  const radius = (formData.get("radius") as string)?.trim() || "10";

  const params = new URLSearchParams();

  // Apply vibe-driven defaults
  const vibeFilters = VIBE_TO_FILTERS[vibe];
  if (vibeFilters?.category) params.set("category", vibeFilters.category);
  if (vibeFilters?.minRating) params.set("minRating", vibeFilters.minRating);

  // Free-form text input wins over vibe's default q
  if (userQ) params.set("q", userQ);
  else if (vibeFilters?.q) params.set("q", vibeFilters.q);

  if (BUDGET_TO_PRICE[budget]) params.set("price", BUDGET_TO_PRICE[budget]);

  // Geocode ZIP if provided. Reuses the same Mapbox setup as /search.
  if (/^\d{5}$/.test(zip)) {
    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? process.env.MAPBOX_SECRET_TOKEN;
    if (token) {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zip)}.json`
      );
      url.searchParams.set("access_token", token);
      url.searchParams.set("limit", "1");
      url.searchParams.set("country", "us");
      url.searchParams.set("types", "postcode");
      try {
        const res = await fetch(url, { cache: "force-cache" });
        if (res.ok) {
          const data = await res.json();
          const f = data.features?.[0];
          if (f) {
            params.set("zip", zip);
            params.set("lat", String(f.center[1]));
            params.set("lng", String(f.center[0]));
            params.set("radius", radius);
          }
        }
      } catch {
        // fall through — no location filter applied
      }
    }
  }

  redirect(`/search?${params.toString()}`);
}
