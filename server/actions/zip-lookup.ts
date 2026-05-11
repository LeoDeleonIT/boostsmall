"use server";

import "server-only";
import { redirect } from "next/navigation";

// Geocode a US ZIP code via Mapbox and redirect with lat/lng + zip query
// params. The form's `redirectTo` field selects the destination path
// (defaults to /search). Used by the ZIP-radius forms on /search and
// /recommendations.
export async function lookupZipAction(formData: FormData) {
  const zip = (formData.get("zip") as string)?.trim() ?? "";
  const radius = (formData.get("radius") as string)?.trim() || "10";

  // Allow callers to redirect into a different page (e.g. /recommendations).
  // Whitelist to internal paths only so this can't be turned into an open
  // redirect via a crafted form.
  const requested = (formData.get("redirectTo") as string)?.trim() ?? "/search";
  const dest = requested.startsWith("/") && !requested.startsWith("//")
    ? requested
    : "/search";

  // Preserve the rest of the search query string when present.
  const q = (formData.get("q") as string)?.trim() ?? "";
  const category = (formData.get("category") as string)?.trim() ?? "";

  if (!/^\d{5}$/.test(zip)) {
    redirect(`${dest}?error=bad-zip${q ? `&q=${encodeURIComponent(q)}` : ""}`);
  }

  const token =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? process.env.MAPBOX_SECRET_TOKEN;
  if (!token) {
    redirect(`${dest}?error=no-mapbox-token`);
  }

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zip)}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  url.searchParams.set("country", "us");
  url.searchParams.set("types", "postcode");

  let lat: number | null = null;
  let lng: number | null = null;
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (res.ok) {
      const data = await res.json();
      const f = data.features?.[0];
      if (f) {
        lng = f.center[0];
        lat = f.center[1];
      }
    }
  } catch {
    // fall through
  }

  if (lat == null || lng == null) {
    redirect(`${dest}?error=zip-not-found&zip=${zip}`);
  }

  const params = new URLSearchParams();
  params.set("zip", zip);
  params.set("lat", String(lat));
  params.set("lng", String(lng));
  params.set("radius", radius);
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  redirect(`${dest}?${params.toString()}`);
}
