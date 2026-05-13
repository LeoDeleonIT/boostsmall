import { SAMPLE_BUSINESSES } from "./sample-businesses";

// Slim, client-safe entry shape — just what the autocomplete needs to
// render a row and link out. Pulled from SAMPLE_BUSINESSES on the
// server and passed down once per page; keeps photoUrls, descriptions,
// hours, lat/lng out of the client bundle.
export interface SearchIndexEntry {
  slug: string;
  name: string;
  subcategory: string;
  city: string;
}

export function searchIndex(): SearchIndexEntry[] {
  return SAMPLE_BUSINESSES.map((b) => ({
    slug: b.slug,
    name: b.name,
    subcategory: b.subcategory,
    city: b.city,
  }));
}
