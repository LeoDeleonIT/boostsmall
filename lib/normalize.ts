// Pure helpers — no DB, no `server-only`. Safe to import from
// chain-check.ts AND prisma seed scripts.

// Order matters here:
//   1. lowercase + Unicode NFKD decomposition (splits "é" into "e" + ́)
//   2. strip combining marks (the diacritic half from step 1)
//   3. strip apostrophe/quote characters ENTIRELY (so "McDonald's" → "mcdonalds",
//      not "mcdonald s") — this is the key collapse the brief requires
//   4. turn any remaining non-alphanumeric into a space
//   5. collapse whitespace
export function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")         // combining marks
    .replace(/['‘’‛`´]/g, "") // ' ‘ ’ ‛ ` ´
    .replace(/[^a-z0-9 ]+/g, " ")            // other punctuation → space
    .replace(/\s+/g, " ")
    .trim();
}

// Plain Levenshtein. Sufficient for short business names.
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}
