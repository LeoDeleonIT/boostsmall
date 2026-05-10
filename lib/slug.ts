import { nanoid } from "nanoid";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// Deterministic-enough slug for a business: name + city + 4-char suffix.
// Suffix avoids collisions for shops with the same name in the same city.
export function businessSlug(name: string, city: string): string {
  const base = `${slugify(name)}-${slugify(city)}`.replace(/-+/g, "-");
  return `${base}-${nanoid(4).toLowerCase()}`;
}
