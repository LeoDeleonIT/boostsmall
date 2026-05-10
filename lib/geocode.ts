import "server-only";

interface GeocodeResult {
  lat: number;
  lng: number;
  formatted: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const token = process.env.MAPBOX_SECRET_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    throw new Error("Missing MAPBOX_SECRET_TOKEN (or NEXT_PUBLIC_MAPBOX_TOKEN as fallback)");
  }

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  url.searchParams.set("country", "us");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    features?: Array<{ center: [number, number]; place_name: string }>;
  };
  const f = data.features?.[0];
  if (!f) return null;

  return { lng: f.center[0], lat: f.center[1], formatted: f.place_name };
}
