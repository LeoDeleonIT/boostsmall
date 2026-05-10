// Houston metro — used to seed sample data and populate filter dropdowns.
// Not exhaustive; expandable as listings come in from neighboring areas.

export interface CityOption {
  city: string;
  state: string;
  zips?: string[];
}

export const HOUSTON_METRO: CityOption[] = [
  { city: "Houston", state: "TX" },
  { city: "Sugar Land", state: "TX" },
  { city: "The Woodlands", state: "TX" },
  { city: "Katy", state: "TX" },
  { city: "Pearland", state: "TX" },
  { city: "Cypress", state: "TX" },
  { city: "Spring", state: "TX" },
  { city: "Pasadena", state: "TX" },
  { city: "Friendswood", state: "TX" },
  { city: "League City", state: "TX" },
  { city: "Missouri City", state: "TX" },
  { city: "Humble", state: "TX" },
  { city: "Tomball", state: "TX" },
  { city: "Conroe", state: "TX" },
  { city: "Galveston", state: "TX" },
];

export function isHoustonMetro(city: string): boolean {
  const c = city.trim().toLowerCase();
  return HOUSTON_METRO.some((x) => x.city.toLowerCase() === c);
}
