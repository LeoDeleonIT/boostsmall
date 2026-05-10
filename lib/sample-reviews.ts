// Mock review content shown on /b/[slug] until real reviews exist.
//
// Style modeled on the kind of detail you see in published reviews —
// specific dishes, named staff, "we've been four times" — so the pages
// feel populated rather than visibly templated. All entries are seed
// placeholders. Wipe before launch via:
//   SAMPLE_REVIEWS.filter(r => !r.id.startsWith("seed-"))
// or just truncate the file.

import { SAMPLE_BUSINESSES, type SampleBusiness } from "./sample-businesses";

export interface SampleReview {
  id: string;
  businessSlug: string;
  authorName: string;
  authorUsername: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: string; // ISO
  helpfulCount: number;
  ownerResponse?: { body: string; at: string };
}

// ─── Author pool ────────────────────────────────────────────────────────────

const AUTHORS: Array<{ name: string; username: string }> = [
  { name: "Maya R.",    username: "maya-r" },
  { name: "Devin O.",   username: "devin-o" },
  { name: "Carla S.",   username: "carla-s" },
  { name: "Karen B.",   username: "karen-b" },
  { name: "Jason T.",   username: "jason-t" },
  { name: "Priya N.",   username: "priya-n" },
  { name: "Mark L.",    username: "mark-l" },
  { name: "Helena W.",  username: "helena-w" },
  { name: "Alicia G.",  username: "alicia-g" },
  { name: "Rashad J.",  username: "rashad-j" },
  { name: "Tomás V.",   username: "tomas-v" },
  { name: "Bethany K.", username: "bethany-k" },
  { name: "Wes P.",     username: "wes-p" },
  { name: "Renu D.",    username: "renu-d" },
  { name: "Jordan H.",  username: "jordan-h" },
  { name: "Selene M.",  username: "selene-m" },
  { name: "Henry F.",   username: "henry-f" },
  { name: "Ines C.",    username: "ines-c" },
  { name: "Dion E.",    username: "dion-e" },
  { name: "Lupita A.",  username: "lupita-a" },
];

// ─── Templates per category ─────────────────────────────────────────────────

type Template = (b: SampleBusiness) => { body: string; rating: 3 | 4 | 5 };

const FOOD_DRINK_TEMPLATES: Template[] = [
  (b) => ({
    rating: 5,
    body: `Best ${b.subcategory.toLowerCase().split(" · ")[0]} I've found in ${b.city}. We came in on a weeknight and the kitchen was on point — every dish landed. Owner stopped by the table to check on us, and you could tell they actually cared. We'll be back.`,
  }),
  (b) => ({
    rating: 5,
    body: `My partner and I have been four times in the last two months. That should tell you everything. Vibe is unpretentious, prices are honest, and the service has the warmth you can only get when the family running the place is actually there.`,
  }),
  (b) => ({
    rating: 4,
    body: `Solid spot. Patio was the move on a Saturday afternoon. Service was a touch slow when it got busy but the food more than made up for it. Excited to come back and try the rest of the menu.`,
  }),
  (b) => ({
    rating: 5,
    body: `Hands-down a favorite ${b.city} ${b.subcategory.toLowerCase().split(" · ")[0]}. Attentive service, a room that makes you want to stay an extra hour, and prices that don't punish you for caring about food. Reservations recommended on weekends.`,
  }),
  (b) => ({
    rating: 4,
    body: `Came here for a friend's birthday. Group of 8, they handled it without a hiccup. The owner came over to wish her happy birthday — that personal touch matters. Food was very good, prices fair for what you get.`,
  }),
  (b) => ({
    rating: 3,
    body: `Decent. The place has a real local feel which I appreciated. A couple of dishes were standouts, others were fine. Worth a try if you're in ${b.city}, but I won't be making a special trip.`,
  }),
];

const DENTAL_TEMPLATES: Template[] = [
  (b) => ({
    rating: 5,
    body: `I have white-coat anxiety and the team here was incredibly patient with me. They walked through every step before doing anything. Front desk knew my name on the second visit. This is what dental care should feel like.`,
  }),
  (b) => ({
    rating: 5,
    body: `Took my whole family — kids included. Zero pressure on cosmetic upsells, which I really appreciated after the chain we used to go to. Cleanings were thorough but quick. Highly recommend the ${b.city} office.`,
  }),
  (b) => ({
    rating: 5,
    body: `Saturday and early hours are a lifesaver when you work full-time. They also accept my insurance, which not every dentist around here does. The hygienist was gentle and answered all my dumb questions without being condescending.`,
  }),
  (b) => ({
    rating: 4,
    body: `Clean office, kind staff, no surprise charges on the bill. Wait was about 15 minutes past my appointment time but once I was in the chair things moved efficiently. Will be back for my next cleaning.`,
  }),
  (b) => ({
    rating: 5,
    body: `Came in for a chipped tooth and they fit me in same-day. Fixed it cleanly, explained the cost upfront, no pressure to add anything. Honest dental care is hard to find — this practice is the real deal.`,
  }),
  (b) => ({
    rating: 5,
    body: `My kids actually look forward to going here, which I never thought I'd say about a dentist. The team is genuinely warm with little ones. ${b.city} is lucky to have this office.`,
  }),
  (b) => ({
    rating: 4,
    body: `Switched here from a corporate practice and the difference is night and day. Same level of equipment but so much more personal. Office is well-run and the dentists clearly care.`,
  }),
];

const RETAIL_TEMPLATES: Template[] = [
  (b) => ({
    rating: 5,
    body: `Staff recommendations here are unmatched. I asked for "something I'd like if I love X" and got handed exactly the right thing. The kind of place that makes a neighborhood worth living in.`,
  }),
  (b) => ({
    rating: 5,
    body: `Could spend hours here. Carefully curated, the staff actually know their stuff, and the prices are fair for what they're sourcing. Bought way more than I planned to. Worth the trip to ${b.city}.`,
  }),
  (b) => ({
    rating: 4,
    body: `Lovely shop. Found a piece I'd been hunting for online for months. Owner threw in some history about where it came from — that storytelling makes the purchase feel meaningful, not transactional.`,
  }),
  (b) => ({
    rating: 5,
    body: `${b.name} is a Houston institution. I bring out-of-town friends here whenever they visit. Independent spots like this are why we live in this city.`,
  }),
  (b) => ({
    rating: 5,
    body: `Came in for one thing, left with three. The owner remembered me from a previous visit and asked how the last purchase worked out. That kind of attention is rare these days.`,
  }),
  (b) => ({
    rating: 4,
    body: `Smaller selection than the big-box stores but every item has been chosen with thought. I'd rather pay a bit more here knowing my money stays in the neighborhood.`,
  }),
];

const SERVICES_TEMPLATES: Template[] = [
  (b) => ({
    rating: 5,
    body: `Called in the morning, they came out by lunch, problem fixed by 2pm. Honest pricing, no upsell, didn't try to convince me I needed anything I didn't. Saving the number for next time.`,
  }),
  (b) => ({
    rating: 5,
    body: `These folks have been doing this for decades and it shows. Diagnosed the issue in five minutes, gave me a fair quote, and stuck to it. I'll never use a chain shop again.`,
  }),
  (b) => ({
    rating: 4,
    body: `Same-day appointment, took the time to walk me through what was wrong and why. Final bill came in under the estimate. That alone earned my repeat business.`,
  }),
  (b) => ({
    rating: 5,
    body: `Family-run and you can tell. Got a personal call after the work was done to make sure everything was holding up. Who does that anymore? I've already recommended them to two neighbors.`,
  }),
  (b) => ({
    rating: 5,
    body: `Top-tier ${b.subcategory.toLowerCase().split(" · ")[0]} in ${b.city}. Fair, fast, and they explain things in plain English instead of trying to confuse you into a bigger invoice. Earned a customer for life.`,
  }),
  (b) => ({
    rating: 3,
    body: `Service was good but scheduling was a little chaotic — got bumped a day. Once they showed up the work was solid. Would use again with realistic expectations on timing.`,
  }),
];

const HEALTH_BEAUTY_TEMPLATES: Template[] = [
  (b) => ({
    rating: 5,
    body: `Best cut I've had in years. They actually listened when I explained what I wanted instead of just doing their default. The salon has a calm, no-upsell vibe — refreshing.`,
  }),
  (b) => ({
    rating: 5,
    body: `Color came out exactly how I asked, and held longer than the chain places I'd been going to. Booked my next three appointments before I left.`,
  }),
  (b) => ({
    rating: 4,
    body: `Friendly team, clean space, no pressure to buy anything from the product wall. Will be back. Parking can be a pain depending on the time of day.`,
  }),
];

const ARTS_TEMPLATES: Template[] = [
  (b) => ({
    rating: 5,
    body: `Quietly one of the best small spaces in ${b.city}. The current show was thought-provoking and the staff were happy to talk about each piece without being pushy.`,
  }),
  (b) => ({
    rating: 5,
    body: `Such a warm community here. Took a class on a whim and ended up signing up for the full series. Everyone is welcoming regardless of skill level.`,
  }),
  (b) => ({
    rating: 4,
    body: `Worth going out of your way for. Showcasing real local artists rather than the same posters you see everywhere. Affordable too, which matters.`,
  }),
];

function templatesFor(b: SampleBusiness): Template[] {
  switch (b.category) {
    case "FOOD_DRINK":
      return FOOD_DRINK_TEMPLATES;
    case "RETAIL":
      return RETAIL_TEMPLATES;
    case "SERVICES":
      return SERVICES_TEMPLATES;
    case "HEALTH_BEAUTY":
      return b.subcategory.toLowerCase().includes("dent")
        ? DENTAL_TEMPLATES
        : HEALTH_BEAUTY_TEMPLATES;
    case "ARTS":
      return ARTS_TEMPLATES;
    default:
      return SERVICES_TEMPLATES;
  }
}

// ─── Deterministic helpers ──────────────────────────────────────────────────
// Stable hash so the same business slug always produces the same author /
// review sequence — re-running the generator doesn't churn the data.

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickAuthor(seed: number) {
  return AUTHORS[seed % AUTHORS.length];
}

function pickHelpfulCount(seed: number, rating: number): number {
  // Higher-rated reviews skew higher on helpful counts.
  const base = (seed % 18) + (rating === 5 ? 6 : rating === 4 ? 3 : 0);
  return base;
}

function pickDate(seed: number, offset: number): string {
  // Spread reviews across the last ~120 days.
  const daysAgo = ((seed + offset * 31) % 110) + 5;
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours((seed + offset * 7) % 24, (seed * 13) % 60, 0, 0);
  return d.toISOString();
}

// ─── Generator ──────────────────────────────────────────────────────────────

function reviewsFor(b: SampleBusiness): SampleReview[] {
  const seed = hash(b.slug);
  const tpls = templatesFor(b);
  const count = 3 + (seed % 3); // 3..5 reviews per business
  const out: SampleReview[] = [];

  for (let i = 0; i < count; i++) {
    const tpl = tpls[(seed + i * 5) % tpls.length];
    const { body, rating } = tpl(b);
    const author = pickAuthor(seed + i * 11);

    out.push({
      id: `seed-${b.slug}-${i}`,
      businessSlug: b.slug,
      authorName: author.name,
      authorUsername: author.username,
      rating,
      body,
      createdAt: pickDate(seed, i),
      helpfulCount: pickHelpfulCount(seed + i, rating),
    });
  }

  // Add an owner response on roughly 1 in 4 businesses, on the highest-rated review.
  if ((seed % 4) === 0 && b.ownerVerified) {
    const top = out.find((r) => r.rating === 5) ?? out[0];
    if (top) {
      const respondedDays = ((seed % 6) + 1);
      const at = new Date(top.createdAt);
      at.setDate(at.getDate() + respondedDays);
      top.ownerResponse = {
        body: `Thank you! Reviews like this are why we love what we do — see you next time.`,
        at: at.toISOString(),
      };
    }
  }

  return out;
}

export const SAMPLE_REVIEWS: SampleReview[] = SAMPLE_BUSINESSES.flatMap(reviewsFor);

export function reviewsForBusiness(slug: string): SampleReview[] {
  return SAMPLE_REVIEWS.filter((r) => r.businessSlug === slug).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}
