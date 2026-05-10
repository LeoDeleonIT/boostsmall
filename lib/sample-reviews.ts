// Mock review content shown on /b/[slug] until real reviews exist.
//
// Voice modeled on actual Google reviews — short, casual, lots of "!",
// occasional caps, run-on sentences, real-feeling specifics. Not polished
// blog prose. All entries are seed placeholders. Wipe before launch via:
//   SAMPLE_REVIEWS.filter(r => !r.id.startsWith("seed-"))

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
  { name: "Brandi M.",  username: "brandi-m" },
  { name: "Carlos D.",  username: "carlos-d" },
  { name: "Tasha P.",   username: "tasha-p" },
  { name: "Reggie B.",  username: "reggie-b" },
];

// ─── Templates per category ─────────────────────────────────────────────────

type Template = (b: SampleBusiness) => { body: string; rating: 1 | 2 | 3 | 4 | 5 };

const FOOD_DRINK_TEMPLATES: Template[] = [
  () => ({ rating: 5, body: `Love this place! Been coming for years.` }),
  () => ({ rating: 5, body: `Great food, great service, great vibes. 10/10` }),
  () => ({ rating: 5, body: `My new favorite spot in the area. Will be back next week probably lol` }),
  (b) => ({ rating: 5, body: `Came here for my birthday and the staff made it so special. Best ${b.subcategory.toLowerCase().split(" · ")[0]} I've had in a long time.` }),
  () => ({ rating: 5, body: `Family owned and you can tell. The owner came over to our table to say hi. Don't see that anymore.` }),
  () => ({ rating: 5, body: `Service was quick even on a Saturday night. Drinks were strong. Will absolutely be back!!` }),
  () => ({ rating: 4, body: `Good food, friendly staff. Patio gets a little loud when it fills up but the food makes up for it.` }),
  () => ({ rating: 4, body: `Solid spot. Nothing crazy but consistent every time we come.` }),
  () => ({ rating: 4, body: `Tried this place after seeing it pop up on my feed. Glad I did. Will come back.` }),
  () => ({ rating: 5, body: `If you haven't been here yet what are you doing. Seriously go.` }),
  () => ({ rating: 3, body: `Food was fine. Service was a little slow but they were busy. Probably try again on a quieter day.` }),
  (b) => ({ rating: 5, body: `Took the in-laws here and they were impressed. Says a lot. ${b.city} needs more spots like this.` }),
];

const DENTAL_TEMPLATES: Template[] = [
  () => ({ rating: 5, body: `Best dentist I've been to! Staff is so nice and welcoming.` }),
  () => ({ rating: 5, body: `Took my kids here, they actually liked it. Front desk lady is the sweetest.` }),
  () => ({ rating: 5, body: `Saturday hours saved me. Got in fast, no pressure to upsell anything I didn't need. Highly recommend!!` }),
  () => ({ rating: 5, body: `I have a lot of anxiety about the dentist and the team made me feel comfortable the whole time.` }),
  () => ({ rating: 4, body: `Wait was a little long but once I was in the chair things moved quick. Cleaning was thorough.` }),
  () => ({ rating: 5, body: `Switched from a corporate office and the difference is huge. They actually remember you.` }),
  () => ({ rating: 5, body: `Came in same day for a broken tooth. Fixed it on the spot. Lifesaver.` }),
  () => ({ rating: 5, body: `Honest pricing, no surprise charges. They take my insurance which is huge.` }),
  () => ({ rating: 5, body: `My whole family comes here. Even my picky toddler sits still for the cleaning. That's a miracle lol` }),
  () => ({ rating: 4, body: `Good office. Front desk is super helpful with insurance stuff. Wish parking was easier but otherwise no complaints.` }),
  () => ({ rating: 5, body: `Dr was great. Explained everything in regular english not dental jargon. Appreciate that.` }),
  () => ({ rating: 3, body: `Service was good but I waited 40 mins past my appointment time. Cleaning itself was fine.` }),
  () => ({ rating: 5, body: `5 stars no notes. Best dental experience I've ever had.` }),
];

const RETAIL_TEMPLATES: Template[] = [
  () => ({ rating: 5, body: `Cute shop! Found a few things I had to have. Will be back for holiday shopping.` }),
  () => ({ rating: 5, body: `Owner is the nicest person. Helped me find exactly what I was looking for.` }),
  () => ({ rating: 5, body: `My favorite spot in the neighborhood. Could spend hours just browsing.` }),
  () => ({ rating: 5, body: `Bought way more than I planned to lol. So many good finds.` }),
  () => ({ rating: 4, body: `Great selection. A bit on the pricey side but you're paying for quality + supporting local.` }),
  (b) => ({ rating: 5, body: `${b.name} is a treasure. Hope they stay open forever.` }),
  () => ({ rating: 5, body: `Bring all my out of town friends here when they visit. Always a hit.` }),
  () => ({ rating: 4, body: `Solid local shop. Staff knows their stuff and isn't pushy.` }),
  () => ({ rating: 5, body: `Got the best gift here for my mom's birthday. She loved it. They even wrapped it.` }),
  () => ({ rating: 3, body: `Cute store but selection is small. Worth a quick browse if you're in the area.` }),
];

const SERVICES_TEMPLATES: Template[] = [
  () => ({ rating: 5, body: `Called in the morning, they came out by 1pm same day. Fixed it right the first time.` }),
  () => ({ rating: 5, body: `Honest pricing. Didn't try to upsell me on stuff I didn't need. Will use again.` }),
  () => ({ rating: 5, body: `Best in the area hands down. Quick, clean, fair. Saving the number for next time.` }),
  () => ({ rating: 5, body: `Family run business and it shows. They actually care about their work.` }),
  () => ({ rating: 4, body: `Good work, fair price. Took a day longer than quoted but the result was solid.` }),
  () => ({ rating: 5, body: `Saved me hundreds compared to the chain shop. Wish I had found them sooner.` }),
  () => ({ rating: 5, body: `Showed up on time, did exactly what they said, sent the invoice the same day. That's all I need.` }),
  () => ({ rating: 3, body: `Service was good once they got here but scheduling was a mess. Got pushed back twice.` }),
  () => ({ rating: 5, body: `Will never use anyone else for this kind of work. Already recommended to my neighbors.` }),
  () => ({ rating: 4, body: `Reliable. They show up when they say they will, which is rare these days.` }),
];

const HEALTH_BEAUTY_TEMPLATES: Template[] = [
  () => ({ rating: 5, body: `Best haircut I've had in years!! She actually listened to what I wanted.` }),
  () => ({ rating: 5, body: `Color came out perfect. Already booked my next appointment.` }),
  () => ({ rating: 4, body: `Friendly stylists, clean salon. Wish they had more weekend availability but otherwise great.` }),
  () => ({ rating: 5, body: `My new go-to. No upsell pressure, just good work.` }),
  () => ({ rating: 5, body: `Walked out feeling like a new person. Worth every dollar.` }),
];

const ARTS_TEMPLATES: Template[] = [
  () => ({ rating: 5, body: `Hidden gem. The current show is incredible — go see it.` }),
  () => ({ rating: 5, body: `Took a class on a whim and ended up signing up for the whole series. So welcoming.` }),
  () => ({ rating: 4, body: `Lovely small space. Worth supporting local artists. Hours are limited so check before you go.` }),
  () => ({ rating: 5, body: `Such a warm community here. Everyone is super encouraging no matter your skill level.` }),
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

// ─── Owner-response phrasing ───────────────────────────────────────────────
// Real owner responses are usually short, sometimes awkward, often start
// with the reviewer's first name. Vary so they don't all read the same.

const OWNER_RESPONSES: Array<(firstName: string) => string> = [
  (n) => `Thanks ${n}! See you next time.`,
  (n) => `Hi ${n}, so glad you had a good experience. We appreciate the kind words!`,
  (n) => `Thank you for the review ${n}. Means a lot to a small business like ours.`,
  () => `Thank you so much for taking the time to review us!`,
  (n) => `${n} - thank you! Tell your friends 🙂`,
];

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
  // Most reviews get 0-5 helpful votes; a few 5-star reviews break out.
  const base = seed % 7;
  const bonus = rating === 5 && (seed % 5) === 0 ? (seed % 12) + 4 : 0;
  return base + bonus;
}

function pickDate(seed: number, offset: number): string {
  // Spread reviews across the last ~150 days.
  const daysAgo = ((seed + offset * 31) % 140) + 5;
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
  const usedTemplateIdx = new Set<number>();

  for (let i = 0; i < count; i++) {
    // Step through the templates without repeating until we exhaust.
    let idx = (seed + i * 5) % tpls.length;
    let attempts = 0;
    while (usedTemplateIdx.has(idx) && attempts < tpls.length) {
      idx = (idx + 1) % tpls.length;
      attempts++;
    }
    usedTemplateIdx.add(idx);

    const tpl = tpls[idx];
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

  // Add an owner response on roughly 1 in 4 owner-verified businesses.
  if ((seed % 4) === 0 && b.ownerVerified) {
    const top = out.find((r) => r.rating === 5) ?? out[0];
    if (top) {
      const respondedDays = ((seed % 6) + 1);
      const at = new Date(top.createdAt);
      at.setDate(at.getDate() + respondedDays);
      const firstName = top.authorName.split(" ")[0];
      const responseTpl = OWNER_RESPONSES[seed % OWNER_RESPONSES.length];
      top.ownerResponse = {
        body: responseTpl(firstName),
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
