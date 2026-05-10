// Mock review content shown on /b/[slug] until real reviews exist.

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

export const SAMPLE_REVIEWS: SampleReview[] = [
  {
    id: "rev-1",
    businessSlug: "bangkok-social-houston",
    authorName: "Maya R.",
    authorUsername: "maya-r",
    rating: 5,
    body:
      "Best Thai in Houston, full stop. The pad see ew is the version every other version is trying to be. Cocktails actually have bitters and don't taste like sugar water. Owner came over to check on us — bonus.",
    createdAt: "2026-04-22T19:42:00Z",
    helpfulCount: 14,
  },
  {
    id: "rev-2",
    businessSlug: "bangkok-social-houston",
    authorName: "Devin O.",
    authorUsername: "devin-o",
    rating: 4,
    body:
      "Patio is the move when the weather cooperates. Service was a touch slow on a Saturday but the food more than made up for it. The crispy rice salad I'll be thinking about all week.",
    createdAt: "2026-03-17T20:11:00Z",
    helpfulCount: 6,
  },
  {
    id: "rev-3",
    businessSlug: "bangkok-social-houston",
    authorName: "Carla S.",
    authorUsername: "carla-s",
    rating: 5,
    body:
      "We've been four times in the last two months. That should tell you everything. Genuine, not phoning it in, family vibe — exactly what boostsmall is supposed to be highlighting.",
    createdAt: "2026-02-04T18:30:00Z",
    helpfulCount: 22,
    ownerResponse: {
      body:
        "Thank you Carla — see you soon. Try the laab gai next time, it's new on the menu.",
      at: "2026-02-05T10:14:00Z",
    },
  },
  {
    id: "rev-4",
    businessSlug: "trinity-dental-houston",
    authorName: "Karen B.",
    authorUsername: "karen-b",
    rating: 5,
    body:
      "I have white-coat anxiety and they were so patient with me. Walked through every step before doing anything. Front desk knew my name on the second visit.",
    createdAt: "2026-04-08T15:22:00Z",
    helpfulCount: 9,
  },
  {
    id: "rev-5",
    businessSlug: "trinity-dental-houston",
    authorName: "Jason T.",
    authorUsername: "jason-t",
    rating: 5,
    body:
      "Took my whole family — kids included. Zero pressure on cosmetic upsells, which I appreciated after the chain we used to go to. Will be back.",
    createdAt: "2026-03-30T11:05:00Z",
    helpfulCount: 11,
  },
  {
    id: "rev-6",
    businessSlug: "pearl-dentistry-katy",
    authorName: "Priya N.",
    authorUsername: "priya-n",
    rating: 5,
    body:
      "Saturday hours are a lifesaver when you work full-time. Cleanings are thorough without being a sales pitch.",
    createdAt: "2026-04-19T10:00:00Z",
    helpfulCount: 7,
  },
  {
    id: "rev-7",
    businessSlug: "common-bond-houston",
    authorName: "Mark L.",
    authorUsername: "mark-l",
    rating: 5,
    body:
      "The kouign-amann is criminal. I genuinely look forward to Saturday mornings here.",
    createdAt: "2026-04-12T08:55:00Z",
    helpfulCount: 18,
  },
  {
    id: "rev-8",
    businessSlug: "brazos-bookstore",
    authorName: "Helena W.",
    authorUsername: "helena-w",
    rating: 5,
    body:
      "Staff recommendations are unmatched. I asked for something \"like Annie Ernaux but warmer\" and got handed exactly the right book.",
    createdAt: "2026-03-05T14:33:00Z",
    helpfulCount: 27,
  },
];

export function reviewsForBusiness(slug: string): SampleReview[] {
  return SAMPLE_REVIEWS.filter((r) => r.businessSlug === slug).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}
