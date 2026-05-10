// Single source of truth for the canonical app URL.
// Drives auth callback URLs, OG image URLs, email links, etc.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
