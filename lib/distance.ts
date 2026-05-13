// Haversine distance in miles between two lat/lng points.
const EARTH_RADIUS_MI = 3958.8;

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MI * Math.asin(Math.sqrt(a));
}

export function formatDistanceMiles(mi: number): string {
  if (mi < 0.1) return "< 0.1 mi";
  if (mi < 10) return `${mi.toFixed(1)} mi`;
  return `${Math.round(mi)} mi`;
}

// Short, ShowMeLocal-style: feet under ~0.6 mi, then miles. Used on the
// "More places near here" strip where the distance is meant to feel
// concrete and walkable rather than abstract.
export function formatDistanceShort(mi: number): string {
  const feet = mi * 5280;
  if (feet < 100) return "< 100 ft";
  if (feet < 3200) return `${Math.round(feet).toLocaleString()} ft`;
  if (mi < 10) return `${mi.toFixed(2)} mi`;
  return `${mi.toFixed(1)} mi`;
}
