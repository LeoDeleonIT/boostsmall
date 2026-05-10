// Pure data — used by both prisma/seed.ts AND the UI pages while we're
// still wired to mocked content. Once a real database is connected, the
// UI pages switch to Prisma queries and this stays as the seed source.

export type Category =
  | "FOOD_DRINK"
  | "RETAIL"
  | "SERVICES"
  | "HEALTH_BEAUTY"
  | "ARTS"
  | "OTHER";

export interface SampleBusiness {
  slug: string;
  name: string;
  description: string;
  category: Category;
  subcategory: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  phone?: string;
  websiteUrl?: string;
  instagramHandle?: string;
  priceTier: 1 | 2 | 3 | 4;
  locationCount: number;
  hours?: Record<string, Array<{ open: string; close: string }>>;
  photoUrls: string[];
  // Mock stats (replaced by real Review aggregates once DB is live)
  rating: number;
  reviewCount: number;
  ownerVerified?: boolean;
  needsReview?: string;
  recentlyAdded?: boolean;
}

const RESTAURANT_HOURS = {
  tue: [{ open: "11:00", close: "22:00" }],
  wed: [{ open: "11:00", close: "22:00" }],
  thu: [{ open: "11:00", close: "22:00" }],
  fri: [{ open: "11:00", close: "23:00" }],
  sat: [{ open: "11:00", close: "23:00" }],
  sun: [{ open: "11:00", close: "21:00" }],
};

const DENTAL_HOURS = {
  mon: [{ open: "08:00", close: "17:00" }],
  tue: [{ open: "08:00", close: "17:00" }],
  wed: [{ open: "08:00", close: "17:00" }],
  thu: [{ open: "08:00", close: "17:00" }],
  fri: [{ open: "08:00", close: "13:00" }],
};

const RETAIL_HOURS = {
  mon: [{ open: "10:00", close: "19:00" }],
  tue: [{ open: "10:00", close: "19:00" }],
  wed: [{ open: "10:00", close: "19:00" }],
  thu: [{ open: "10:00", close: "19:00" }],
  fri: [{ open: "10:00", close: "20:00" }],
  sat: [{ open: "10:00", close: "20:00" }],
  sun: [{ open: "12:00", close: "17:00" }],
};

export const SAMPLE_BUSINESSES: SampleBusiness[] = [
  {
    slug: "trinity-dental-houston",
    name: "Trinity Dental",
    description: "General and family dentistry. Accepting new patients.",
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: "TODO: confirm address with Leo",
    city: "Houston",
    state: "TX",
    postalCode: "77000",
    lat: 29.7604,
    lng: -95.3698,
    phone: "+1-713-000-0000",
    websiteUrl: "https://example-trinity.com",
    priceTier: 3,
    locationCount: 1,
    hours: DENTAL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.8,
    reviewCount: 142,
    ownerVerified: true,
    needsReview: "Confirm exact branch address, phone, website with Leo",
    recentlyAdded: true,
  },
  {
    slug: "pearl-dentistry-katy",
    name: "Pearl Dentistry",
    description:
      "Family dentistry serving the Katy area. Saturday appointments available.",
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: "TODO: confirm address with Leo",
    city: "Katy",
    state: "TX",
    postalCode: "77449",
    lat: 29.7858,
    lng: -95.8245,
    phone: "+1-281-000-0000",
    websiteUrl: "https://example-pearl.com",
    priceTier: 3,
    locationCount: 1,
    hours: DENTAL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.9,
    reviewCount: 87,
    ownerVerified: true,
    needsReview: "Confirm exact branch address, phone, website with Leo",
    recentlyAdded: true,
  },
  {
    slug: "bangkok-social-houston",
    name: "Bangkok Social",
    description:
      "Modern Thai with serious cocktails on White Oak. Family-run, single location, locally beloved.",
    category: "FOOD_DRINK",
    subcategory: "Thai · Cocktails",
    addressLine1: "3206 White Oak Drive",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.7872,
    lng: -95.4017,
    phone: "+1-832-409-5535",
    websiteUrl: "https://www.bangkoksocialhtx.com",
    instagramHandle: "@bangkok.social",
    priceTier: 3,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.6,
    reviewCount: 318,
    ownerVerified: false,
    needsReview: "Public info from web; have Leo confirm before launch",
  },
  {
    slug: "common-bond-houston",
    name: "Common Bond",
    description:
      "Heights bakery and café known for laminated pastries and a serious espresso program.",
    category: "FOOD_DRINK",
    subcategory: "Bakery · Café",
    addressLine1: "1706 Westheimer Rd",
    city: "Houston",
    state: "TX",
    postalCode: "77098",
    lat: 29.7437,
    lng: -95.3989,
    priceTier: 2,
    locationCount: 4,
    photoUrls: [
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.5,
    reviewCount: 612,
  },
  {
    slug: "brennans-houston",
    name: "Brennan's of Houston",
    description: "Single-location Creole institution near Midtown.",
    category: "FOOD_DRINK",
    subcategory: "Creole · Fine dining",
    addressLine1: "3300 Smith St",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.7372,
    lng: -95.3815,
    priceTier: 4,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 1204,
    ownerVerified: true,
  },
  {
    slug: "local-foods-rice-village",
    name: "Local Foods",
    description: "Neighborhood sandwich shop — 4 locations, all in Houston.",
    category: "FOOD_DRINK",
    subcategory: "Sandwiches · Salads",
    addressLine1: "2424 Dunstan Rd",
    city: "Houston",
    state: "TX",
    postalCode: "77005",
    lat: 29.7166,
    lng: -95.4159,
    priceTier: 2,
    locationCount: 4,
    photoUrls: [
      "https://images.unsplash.com/photo-1539252554935-80c8cabbcd28?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.4,
    reviewCount: 489,
  },
  {
    slug: "brasil-cafe-montrose",
    name: "Brasil Café",
    description: "Montrose coffeehouse and bar. Patio, live music on weekends.",
    category: "FOOD_DRINK",
    subcategory: "Café · Bar",
    addressLine1: "2604 Dunlavy St",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.7444,
    lng: -95.3974,
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.3,
    reviewCount: 287,
    recentlyAdded: true,
  },
  {
    slug: "greenway-coffee",
    name: "Greenway Coffee Co.",
    description: "Independent roaster. Two cafés, same owners since 2009.",
    category: "FOOD_DRINK",
    subcategory: "Coffee · Roaster",
    addressLine1: "5 Greenway Plz",
    city: "Houston",
    state: "TX",
    postalCode: "77046",
    lat: 29.7339,
    lng: -95.4337,
    priceTier: 2,
    locationCount: 2,
    photoUrls: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.8,
    reviewCount: 156,
    ownerVerified: true,
  },
  {
    slug: "pondicheri-houston",
    name: "Pondicheri",
    description: "Indian café from chef Anita Jaisinghani. One location. Brunch a thing.",
    category: "FOOD_DRINK",
    subcategory: "Indian · Café",
    addressLine1: "2800 Kirby Dr",
    city: "Houston",
    state: "TX",
    postalCode: "77098",
    lat: 29.739,
    lng: -95.4173,
    priceTier: 3,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.6,
    reviewCount: 472,
  },
  {
    slug: "antidote-coffee-heights",
    name: "Antidote Coffee",
    description: "Heights café in a converted bungalow. Patio dogs welcome.",
    category: "FOOD_DRINK",
    subcategory: "Coffee · Café",
    addressLine1: "729 Studewood St",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.7884,
    lng: -95.4043,
    priceTier: 1,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 213,
    recentlyAdded: true,
  },
  {
    slug: "brazos-bookstore",
    name: "Brazos Bookstore",
    description:
      "Independent bookstore on Bissonnet — author events most weeks.",
    category: "RETAIL",
    subcategory: "Bookstore",
    addressLine1: "2421 Bissonnet St",
    city: "Houston",
    state: "TX",
    postalCode: "77005",
    lat: 29.7212,
    lng: -95.4189,
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.9,
    reviewCount: 198,
    ownerVerified: true,
  },
  {
    slug: "cactus-music-houston",
    name: "Cactus Music",
    description: "Indie record shop in Upper Kirby. In-store performances regularly.",
    category: "RETAIL",
    subcategory: "Records · Music",
    addressLine1: "2110 Portsmouth St",
    city: "Houston",
    state: "TX",
    postalCode: "77098",
    lat: 29.7389,
    lng: -95.4231,
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1483821474026-ad6c1a83099a?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.8,
    reviewCount: 327,
  },
  {
    slug: "kuhl-linscomb-houston",
    name: "Kuhl-Linscomb",
    description: "Family-owned home goods on a single multi-building campus.",
    category: "RETAIL",
    subcategory: "Home goods · Gifts",
    addressLine1: "2424 W Alabama St",
    city: "Houston",
    state: "TX",
    postalCode: "77098",
    lat: 29.7382,
    lng: -95.4135,
    priceTier: 3,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.5,
    reviewCount: 134,
  },
  {
    slug: "houston-bicycle-co",
    name: "Houston Bicycle Co.",
    description: "Independent bike shop — sales, repair, rentals.",
    category: "SERVICES",
    subcategory: "Bike repair · Sales",
    addressLine1: "1909 Taft St",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.7546,
    lng: -95.3915,
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 89,
  },
  {
    slug: "sugar-land-family-plumbing",
    name: "Sugar Land Family Plumbing",
    description: "Family-run plumbing — same owners 25+ years.",
    category: "SERVICES",
    subcategory: "Plumbing",
    addressLine1: "13929 Southwest Fwy",
    city: "Sugar Land",
    state: "TX",
    postalCode: "77478",
    lat: 29.6196,
    lng: -95.6349,
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.9,
    reviewCount: 67,
    ownerVerified: true,
  },
  {
    slug: "woodlands-auto-repair",
    name: "Woodlands Auto Repair",
    description: "Independent garage — domestic and import.",
    category: "SERVICES",
    subcategory: "Auto repair",
    addressLine1: "26439 I-45 N",
    city: "The Woodlands",
    state: "TX",
    postalCode: "77380",
    lat: 30.1658,
    lng: -95.4613,
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.6,
    reviewCount: 142,
  },
  {
    slug: "heights-hair-studio",
    name: "Heights Hair Studio",
    description: "Two-chair salon. Cuts, color, no upsells.",
    category: "HEALTH_BEAUTY",
    subcategory: "Salon",
    addressLine1: "350 W 19th St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.8024,
    lng: -95.4108,
    priceTier: 3,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.8,
    reviewCount: 91,
    recentlyAdded: true,
  },
  {
    slug: "inman-gallery-houston",
    name: "Inman Gallery",
    description: "Contemporary art gallery showing Texas-based artists.",
    category: "ARTS",
    subcategory: "Gallery",
    addressLine1: "3901 Main St",
    city: "Houston",
    state: "TX",
    postalCode: "77002",
    lat: 29.7332,
    lng: -95.3781,
    priceTier: 1,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.4,
    reviewCount: 38,
  },
  {
    slug: "pearland-pottery-studio",
    name: "Pearland Pottery Studio",
    description: "Open-studio ceramics, classes by appointment.",
    category: "ARTS",
    subcategory: "Pottery · Classes",
    addressLine1: "2802 Business Center Dr",
    city: "Pearland",
    state: "TX",
    postalCode: "77584",
    lat: 29.5638,
    lng: -95.2861,
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 54,
    recentlyAdded: true,
  },
];

export function findBusinessBySlug(slug: string): SampleBusiness | undefined {
  return SAMPLE_BUSINESSES.find((b) => b.slug === slug);
}

export function topRated(limit = 6): SampleBusiness[] {
  return [...SAMPLE_BUSINESSES]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function recentlyAdded(limit = 6): SampleBusiness[] {
  return SAMPLE_BUSINESSES.filter((b) => b.recentlyAdded).slice(0, limit);
}

export function byCategory(cat: Category | "ALL"): SampleBusiness[] {
  if (cat === "ALL") return SAMPLE_BUSINESSES;
  return SAMPLE_BUSINESSES.filter((b) => b.category === cat);
}
