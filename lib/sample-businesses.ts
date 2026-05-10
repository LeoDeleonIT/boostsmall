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

// ─── Dental groups (real, family-owned, Leo is the IT for these) ────────────
// Photos are stock dental-office shots; real owner-uploaded photos take over
// once the upload flow is built. Each location gets a different cover via
// rotateCover() below so adjacent listings don't look identical.

const DENTAL_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
];

// Rotate which photo is the cover so adjacent locations look distinct.
// Deterministic: same slug → same cover every render.
function rotateCover(slug: string, photos: string[]): string[] {
  if (photos.length <= 1) return photos;
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % photos.length;
  return [photos[idx], ...photos.slice(0, idx), ...photos.slice(idx + 1)];
}

interface DentalLocation {
  loc: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  phone: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  recentlyAdded?: boolean;
}

const TRINITY_DENTAL_GROUP: DentalLocation[] = [
  { loc: "Aldine",         addressLine1: "11939 Eastex Fwy",                    city: "Houston",    postalCode: "77039", phone: "+1-281-816-4825", lat: 29.89876,  lng: -95.314838, rating: 4.7, reviewCount: 142, recentlyAdded: true },
  { loc: "Channelview",    addressLine1: "5815 East Sam Houston Pkwy N",        city: "Houston",    postalCode: "77049", phone: "+1-281-303-5096", lat: 29.809783, lng: -95.164523, rating: 4.6, reviewCount: 98 },
  { loc: "Cleveland",      addressLine1: "106 Truly Plaza",                     city: "Cleveland",  postalCode: "77327", phone: "+1-281-746-6564", lat: 30.334627, lng: -95.095409, rating: 4.8, reviewCount: 67 },
  { loc: "Conroe",         addressLine1: "1304 W Davis Suite A",                city: "Conroe",     postalCode: "77304", phone: "+1-936-209-1548", lat: 30.317193, lng: -95.473321, rating: 4.7, reviewCount: 124 },
  { loc: "Crosby",         addressLine1: "14045 FM 2100 #250",                  city: "Crosby",     postalCode: "77532", phone: "+1-281-942-4167", lat: 29.892935, lng: -95.064645, rating: 4.5, reviewCount: 56 },
  { loc: "Denver Harbor",  addressLine1: "7008 Lyons Ave",                      city: "Houston",    postalCode: "77020", phone: "+1-713-766-0943", lat: 29.77635,  lng: -95.299925, rating: 4.6, reviewCount: 89 },
  { loc: "Humble",         addressLine1: "9455 North Sam Houston Pkwy E #600",  city: "Humble",     postalCode: "77396", phone: "+1-281-335-3630", lat: 29.935564, lng: -95.250205, rating: 4.8, reviewCount: 178 },
  { loc: "Katy",           addressLine1: "24020 Clay Rd Suite 106",             city: "Katy",       postalCode: "77493", phone: "+1-832-400-4129", lat: 29.832136, lng: -95.791511, rating: 4.9, reviewCount: 203, recentlyAdded: true },
  { loc: "Livingston",     addressLine1: "1601 US Highway 59 N Loop Suite 400", city: "Livingston", postalCode: "77351", phone: "+1-936-463-0405", lat: 30.728965, lng: -94.940576, rating: 4.6, reviewCount: 41 },
  { loc: "Magnolia",       addressLine1: "18640 Farm to Market Rd 1488 Ste D",  city: "Magnolia",   postalCode: "77354", phone: "+1-832-379-5488", lat: 30.212435, lng: -95.754076, rating: 4.7, reviewCount: 88 },
  { loc: "Normandy",       addressLine1: "503 Maxey Rd",                        city: "Houston",    postalCode: "77013", phone: "+1-832-358-3710", lat: 29.786032, lng: -95.218203, rating: 4.5, reviewCount: 61 },
  { loc: "Porter",         addressLine1: "23762 US-59",                         city: "Porter",     postalCode: "77365", phone: "+1-281-306-5194", lat: 30.10141,  lng: -95.238177, rating: 4.7, reviewCount: 73 },
  { loc: "Rosenberg",      addressLine1: "1636 Minonite Road Suite 500",        city: "Rosenberg",  postalCode: "77469", phone: "+1-832-847-7252", lat: 29.525632, lng: -95.752339, rating: 4.6, reviewCount: 95 },
  { loc: "Sawyer Heights", addressLine1: "1919 Taylor St #3A",                  city: "Houston",    postalCode: "77007", phone: "+1-713-766-4389", lat: 29.775543, lng: -95.383428, rating: 4.8, reviewCount: 167 },
  { loc: "Tomball",        addressLine1: "14215 Farm to Market 2920 #103",      city: "Tomball",    postalCode: "77377", phone: "+1-832-956-1308", lat: 30.088479, lng: -95.638269, rating: 4.7, reviewCount: 109 },
  { loc: "Sealy",          addressLine1: "2303 TX-36 Suite C",                  city: "Sealy",      postalCode: "77474", phone: "+1-979-315-4084", lat: 29.760807, lng: -96.150459, rating: 4.5, reviewCount: 38 },
];

const PEARL_DENTISTRY_GROUP: DentalLocation[] = [
  { loc: "Houston Heights", addressLine1: "1919 Taylor St",                  city: "Houston", postalCode: "77007", phone: "+1-713-766-4389", lat: 29.775543, lng: -95.383428, rating: 4.8, reviewCount: 134, recentlyAdded: true },
  { loc: "Humble",          addressLine1: "11501 N Sam Houston Pkwy Ste C",  city: "Humble",  postalCode: "77396", phone: "+1-346-476-0627", lat: 29.935237, lng: -95.215203, rating: 4.7, reviewCount: 87,  recentlyAdded: true },
];

function dentalSlug(brand: string, loc: string): string {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  return `${norm(brand)}-${norm(loc)}`;
}

function makeDentalEntry(
  brand: string,
  websiteUrl: string | undefined,
  locationCount: number,
  descTemplate: (loc: string) => string,
  t: DentalLocation
): SampleBusiness {
  const slug = dentalSlug(brand, t.loc);
  return {
    slug,
    name: `${brand} – ${t.loc}`,
    description: descTemplate(t.loc),
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: t.addressLine1,
    city: t.city,
    state: "TX",
    postalCode: t.postalCode,
    lat: t.lat,
    lng: t.lng,
    phone: t.phone,
    websiteUrl,
    priceTier: 3,
    locationCount,
    hours: DENTAL_HOURS,
    photoUrls: rotateCover(slug, DENTAL_PHOTO_URLS),
    rating: t.rating,
    reviewCount: t.reviewCount,
    ownerVerified: true,
    recentlyAdded: t.recentlyAdded,
  };
}

const TRINITY_DENTAL_BUSINESSES: SampleBusiness[] = TRINITY_DENTAL_GROUP.map((t) =>
  makeDentalEntry(
    "Trinity Dental",
    "https://www.trinitydentalcenters.com",
    16,
    (loc) =>
      `Family-owned dentistry. The ${loc} office is part of Trinity Dental's network of 16 locations across the Houston metro and East Texas (plus the sister Waller Dental practice).`,
    t
  )
);

const PEARL_DENTISTRY_BUSINESSES: SampleBusiness[] = PEARL_DENTISTRY_GROUP.map((t) =>
  makeDentalEntry(
    "Pearl Dentistry",
    "https://pearlmoderndentistry.com",
    2,
    (loc) =>
      `Modern family-owned dentistry. The ${loc} office is one of two Pearl Dentistry locations in the Houston metro.`,
    t
  )
);

const WALLER_DENTAL_BUSINESS: SampleBusiness = {
  slug: "waller-dental",
  name: "Waller Dental",
  description:
    "Family-owned dentistry serving Waller and surrounding communities. Sister practice to Trinity Dental.",
  category: "HEALTH_BEAUTY",
  subcategory: "Dentist",
  addressLine1: "31315 FM 2920 Rd Ste 16A",
  city: "Waller",
  state: "TX",
  postalCode: "77484",
  lat: 30.05686,
  lng: -95.91384,
  phone: "+1-936-372-2673",
  priceTier: 3,
  locationCount: 1,
  hours: DENTAL_HOURS,
  photoUrls: DENTAL_PHOTO_URLS,
  rating: 4.7,
  reviewCount: 52,
  ownerVerified: true,
};

const ALL_DENTAL_BUSINESSES: SampleBusiness[] = [
  ...TRINITY_DENTAL_BUSINESSES,
  WALLER_DENTAL_BUSINESS,
  ...PEARL_DENTISTRY_BUSINESSES,
];

// ─── Other independent dental practices (not Trinity/Pearl/Waller) ─────────
// Diversifying the dental category so it isn't just one brand.

const OTHER_DENTAL_BUSINESSES: SampleBusiness[] = [
  {
    slug: "river-oaks-family-dentistry",
    name: "River Oaks Family Dentistry",
    description:
      "Greenway Plaza family dental practice. Comprehensive care for every age, accepting new patients.",
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: "24 Greenway Plaza # 804",
    city: "Houston",
    state: "TX",
    postalCode: "77046",
    lat: 29.732573,
    lng: -95.431384,
    phone: "+1-713-626-5151",
    websiteUrl: "https://riveroaks-dentistry.com",
    priceTier: 3,
    locationCount: 1,
    hours: DENTAL_HOURS,
    photoUrls: ["https://riveroaks-dentistry.com/wp-content/uploads/toothbrushes.jpg"],
    rating: 4.8,
    reviewCount: 187,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "smile-story-dentistry-uptown",
    name: "Smile Story Dentistry",
    description:
      "General and cosmetic dentistry on Post Oak Blvd. Serves Heights, Montrose, River Oaks and surrounding neighborhoods.",
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: "1700 Post Oak Blvd Ste 1-270",
    city: "Houston",
    state: "TX",
    postalCode: "77056",
    lat: 29.749631,
    lng: -95.462195,
    phone: "+1-281-404-2049",
    websiteUrl: "https://www.smilestorydentistry.com",
    priceTier: 3,
    locationCount: 1,
    hours: DENTAL_HOURS,
    photoUrls: ["https://cdn.prod.website-files.com/665ea4632c8d7ae4bdb932e3/66a2b0c3817e6ecceb651723_AdobeStock_599126850-min.jpeg"],
    rating: 4.7,
    reviewCount: 142,
    ownerVerified: false,
  },
  {
    slug: "bissonnet-dental",
    name: "Bissonnet Dental",
    description:
      "Family dental care on Bissonnet Street. Cleanings, fillings, crowns — the everyday essentials done well.",
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: "5427 Bissonnet St Suite 300",
    city: "Houston",
    state: "TX",
    postalCode: "77081",
    lat: 29.703445,
    lng: -95.47519,
    phone: "+1-713-668-8600",
    websiteUrl: "https://www.bissonnetdentalhouston.com",
    priceTier: 2,
    locationCount: 1,
    hours: DENTAL_HOURS,
    photoUrls: ["https://www.bissonnetdentalhouston.com/wp-content/uploads/2015/09/RMPL3239.jpg"],
    rating: 4.6,
    reviewCount: 94,
    ownerVerified: false,
  },
  {
    slug: "bissonnet-family-dental",
    name: "Bissonnet Family Dental",
    description:
      "Family-owned dental practice on Bissonnet. Dr. Lakhva took ownership in 2017.",
    category: "HEALTH_BEAUTY",
    subcategory: "Dentist",
    addressLine1: "6047 Bissonnet St",
    city: "Houston",
    state: "TX",
    postalCode: "77081",
    lat: 29.696924,
    lng: -95.487743,
    websiteUrl: "https://bissonnetfamilydental.com",
    priceTier: 2,
    locationCount: 1,
    hours: DENTAL_HOURS,
    photoUrls: ["https://img1.wsimg.com/isteam/stock/8567"],
    rating: 4.7,
    reviewCount: 76,
    ownerVerified: false,
    recentlyAdded: true,
  },
];

// ─── Real Houston legacy businesses (added via web research) ────────────────
// Sources: Preservation Houston Legacy Restaurants 2026, Houstonia Magazine,
// CultureMap, Yelp listings. All confirmed family-owned / independently held.

const FLORIST_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1490718720478-364a07a997cd?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1600&q=80",
];

// Photo pools for new categories. Each is a curated list of working
// Unsplash IDs verified by HEAD request before commit.
const BBQ_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80",
];

const VIETNAMESE_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1600&q=80",
];

const MUSIC_VENUE_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1600&q=80",
];

const ADDITIONAL_REAL_BUSINESSES: SampleBusiness[] = [
  {
    slug: "molinas-cantina-bellaire",
    name: "Molina's Cantina",
    description:
      "Houston's oldest family-owned Tex-Mex, founded 1941. Now run by the third generation of the Molina family.",
    category: "FOOD_DRINK",
    subcategory: "Tex-Mex",
    addressLine1: "3801 Bellaire Blvd",
    city: "Houston",
    state: "TX",
    postalCode: "77025",
    lat: 29.705438,
    lng: -95.437684,
    websiteUrl: "https://www.molinascantina.com",
    priceTier: 2,
    locationCount: 3,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/MolinasSouthsidePlaceTX.JPG",
    ],
    rating: 4.5,
    reviewCount: 1843,
    ownerVerified: false,
  },
  {
    slug: "niko-nikos-montrose",
    name: "Niko Niko's – Montrose",
    description:
      "Greek and American café in Montrose since 1977. A Houston institution and Preservation Houston's Legacy Restaurant of the Year.",
    category: "FOOD_DRINK",
    subcategory: "Greek · Café",
    addressLine1: "2520 Montrose Blvd",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.74654,
    lng: -95.392214,
    phone: "+1-713-528-4976",
    websiteUrl: "https://nikonikos.com",
    priceTier: 2,
    locationCount: 2,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/prq3M_F8pZiphhcR4FpcpA/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/6NeXwwJoc-3olbRUZR8cgQ/258s.jpg",
    ],
    rating: 4.6,
    reviewCount: 2425,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "reynas-florist-east-end",
    name: "Reyna's Florist",
    description:
      "East End florist, family-owned since 1947 — now run by the Ybarra family grandchildren of founder Mary Reyna.",
    category: "RETAIL",
    subcategory: "Florist",
    addressLine1: "903 N 75th St",
    city: "Houston",
    state: "TX",
    postalCode: "77011",
    lat: 29.73906,
    lng: -95.289482,
    phone: "+1-713-926-0315",
    websiteUrl: "https://www.reynasflorist.com",
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: rotateCover("reynas-florist-east-end", FLORIST_PHOTO_URLS),
    rating: 4.8,
    reviewCount: 312,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "houstonian-flowery",
    name: "Houstonian Flowery",
    description:
      "West Houston florist on Sam Houston Parkway. Custom arrangements, weddings, and event florals.",
    category: "RETAIL",
    subcategory: "Florist",
    addressLine1: "702 W Sam Houston Pkwy S",
    city: "Houston",
    state: "TX",
    postalCode: "77042",
    lat: 29.754084,
    lng: -95.558833,
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: rotateCover("houstonian-flowery", FLORIST_PHOTO_URLS),
    rating: 4.7,
    reviewCount: 32,
    ownerVerified: false,
    recentlyAdded: true,
  },

  // ─── BBQ ──────────────────────────────────────────────────────────────────
  {
    slug: "killens-barbecue-pearland",
    name: "Killen's Barbecue",
    description:
      "Chef Ronnie Killen's Pearland BBQ joint, named #2 best BBQ in the nation by Food Network. Brisket, beef ribs, the works.",
    category: "FOOD_DRINK",
    subcategory: "BBQ",
    addressLine1: "3613 E Broadway St",
    city: "Pearland",
    state: "TX",
    postalCode: "77581",
    lat: 29.564083,
    lng: -95.282222,
    websiteUrl: "https://www.killensbarbecue.com",
    priceTier: 3,
    locationCount: 2,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/-Uqu2tkLvpBE2agvpNvxjQ/348s.jpg",
      "https://s.hdnux.com/photos/01/27/67/34/23033645/3/1920x0.jpg",
      "https://s.hdnux.com/photos/01/06/41/25/18486654/3/1200x0.jpg",
    ],
    rating: 4.7,
    reviewCount: 1856,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "truth-bbq-houston",
    name: "Truth BBQ",
    description:
      "Pitmaster Leonard Botello IV's BBQ joint on Heights Blvd. Texas Monthly Top 50. Worth the line.",
    category: "FOOD_DRINK",
    subcategory: "BBQ",
    addressLine1: "110 S Heights Blvd",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.769336,
    lng: -95.397289,
    websiteUrl: "https://truthbbq.com",
    priceTier: 3,
    locationCount: 2,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://truthbbq.com/cdn/shop/files/Truth-bbq-Platter-101.jpg?v=1705891803&width=1500",
      "https://truthbbq.com/cdn/shop/files/D1CB16D7-9577-41EF-89C1-1F5CC4130E52_1_105_c_1.jpg?v=1708707320&width=1500",
      "https://truthbbq.com/cdn/shop/files/truth-ribs_5c6d7811-3f49-4f10-a94a-24f4be772427.jpg?v=1705952607&width=1500",
    ],
    rating: 4.6,
    reviewCount: 1402,
    ownerVerified: false,
  },
  {
    slug: "pinkertons-barbecue-heights",
    name: "Pinkerton's Barbecue",
    description:
      "Grant Pinkerton's Heights BBQ — Hill Country style, family roots. Texas Monthly Top 50 since 2017.",
    category: "FOOD_DRINK",
    subcategory: "BBQ",
    addressLine1: "1504 Airline Dr",
    city: "Houston",
    state: "TX",
    postalCode: "77009",
    lat: 29.798659,
    lng: -95.38152,
    websiteUrl: "https://www.pinkertonsbarbecue.com",
    priceTier: 3,
    locationCount: 2,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://www.pinkertonsbarbecue.com/wp-content/uploads/2024/03/PINKERTONS_1O2O23-14-640x640.jpg",
      "https://www.pinkertonsbarbecue.com/wp-content/uploads/2024/03/PINKERTONS_1O2723-02-640x640.jpg",
      "https://www.pinkertonsbarbecue.com/wp-content/uploads/2024/04/PINKERTONS_1O2O23-01-640x640.jpg",
    ],
    rating: 4.7,
    reviewCount: 1805,
    ownerVerified: false,
  },

  // ─── Vietnamese ───────────────────────────────────────────────────────────
  {
    slug: "crawfish-and-noodles-bellaire",
    name: "Crawfish & Noodles",
    description:
      "Chef Trong Nguyen's Viet-Cajun crawfish institution on Bellaire. Family-run; Nguyen's sons now lead a second location at Houston Farmers Market.",
    category: "FOOD_DRINK",
    subcategory: "Vietnamese · Cajun",
    addressLine1: "11360 Bellaire Blvd Ste 990",
    city: "Houston",
    state: "TX",
    postalCode: "77072",
    lat: 29.704933,
    lng: -95.580762,
    phone: "+1-281-988-8098",
    websiteUrl: "https://www.crawfishandnoodles.com",
    priceTier: 2,
    locationCount: 2,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://static.wixstatic.com/media/c7de93_f663f9fc949643d3a41aad20ddd436db~mv2.jpg/v1/fill/w_1600,h_900,al_c/c7de93_f663f9fc949643d3a41aad20ddd436db~mv2.jpg",
      "https://static.wixstatic.com/media/1650c9_3b9408edafbf4327b4e08567e2399e2a~mv2.jpg",
      "https://static.wixstatic.com/media/1650c9_9a62afe515754367934632a7cbf7235d~mv2.jpg",
      "https://static.wixstatic.com/media/1650c9_cf99e83f7352447abdeeb4fa9b9bbf0d~mv2.jpg",
    ],
    rating: 4.5,
    reviewCount: 1209,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "cali-sandwich-pho-midtown",
    name: "Cali Sandwich & Pho",
    description:
      "Midtown banh mi institution. Cheap, fast, packed at lunch. Houston's collective sandwich mascot.",
    category: "FOOD_DRINK",
    subcategory: "Vietnamese · Sandwiches",
    addressLine1: "2900 Travis St",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.743818,
    lng: -95.377026,
    phone: "+1-713-520-0710",
    priceTier: 1,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/wVKIAQ20DEj_UNF2rOBm2A/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/CIbfWleQ_vi_dps3TZrKdw/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/rJl-DD-bNBqCYzRAGnl46A/348s.jpg",
    ],
    rating: 4.6,
    reviewCount: 710,
    ownerVerified: false,
  },

  // ─── Coffee ───────────────────────────────────────────────────────────────
  {
    slug: "boomtown-coffee-heights",
    name: "Boomtown Coffee",
    description:
      "Heights specialty coffee roaster on 19th Street. Small-batch beans, vintage feel, local art on the walls.",
    category: "FOOD_DRINK",
    subcategory: "Coffee · Roaster",
    addressLine1: "242 W 19th St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.802723,
    lng: -95.400843,
    websiteUrl: "https://www.boomtowncoffee.com",
    priceTier: 1,
    locationCount: 2,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/ERLPKYijTU4OP5RDrrNsLQ/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/324ZycHUGy5jm0VVS3TJCw/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/I006p3SonZoYqeYBYPlNeg/348s.jpg",
    ],
    rating: 4.7,
    reviewCount: 957,
    ownerVerified: false,
  },
  {
    slug: "blacksmith-coffee-montrose",
    name: "Blacksmith",
    description:
      "Montrose mainstay. Industrial space, Greenway Coffee beans, communal tables. Hits all weekend.",
    category: "FOOD_DRINK",
    subcategory: "Coffee · Café",
    addressLine1: "1018 Westheimer Rd",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.74483,
    lng: -95.39249,
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/tm5emafCNC_43BicKNH4qg/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/O0K5Oo7CvQNi0M-z2D9E2w/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/2oHllswus80da-gNBSpAlg/258s.jpg",
    ],
    rating: 4.5,
    reviewCount: 612,
    ownerVerified: false,
  },

  // ─── Bakery ───────────────────────────────────────────────────────────────
  {
    slug: "three-brothers-bakery-braeswood",
    name: "Three Brothers Bakery",
    description:
      "Family-owned Jewish bakery in Meyerland. Holocaust-survivor founded; 5 generations of bakers.",
    category: "FOOD_DRINK",
    subcategory: "Bakery",
    addressLine1: "4036 S Braeswood Blvd",
    city: "Houston",
    state: "TX",
    postalCode: "77025",
    lat: 29.690072,
    lng: -95.44236,
    websiteUrl: "https://3brothersbakery.com",
    priceTier: 2,
    locationCount: 4,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/aiFF1SfoDgZeKRNrjoci3A/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/a09kDjruE6Jtct22dMWJfw/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/c6Z_d2Yws5w70Gsgel3ksg/348s.jpg",
    ],
    rating: 4.6,
    reviewCount: 366,
    ownerVerified: false,
  },

  // ─── Music venues ─────────────────────────────────────────────────────────
  {
    slug: "white-oak-music-hall",
    name: "White Oak Music Hall",
    description:
      "Multi-venue live music complex two miles north of downtown. 400+ shows a year across indoor/outdoor stages plus the Raven Tower ice house.",
    category: "ARTS",
    subcategory: "Music venue",
    addressLine1: "2915 N Main St",
    city: "Houston",
    state: "TX",
    postalCode: "77009",
    lat: 29.785873,
    lng: -95.36691,
    websiteUrl: "https://whiteoakmusichall.com",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/0wwu0BQ-2TwmgmTBNzpsTQ/o.jpg",
      "https://s.hdnux.com/photos/36/32/75/7974754/6/1200x0.jpg",
      "https://s.hdnux.com/photos/36/32/75/7974758/5/1200x0.jpg",
    ],
    rating: 4.6,
    reviewCount: 824,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "continental-club-houston",
    name: "The Continental Club",
    description:
      "Historic dive on Main Street in Midtown. Live bands, classic atmosphere, Thursday-Saturday only.",
    category: "ARTS",
    subcategory: "Music venue · Bar",
    addressLine1: "3700 Main St",
    city: "Houston",
    state: "TX",
    postalCode: "77002",
    lat: 29.738457,
    lng: -95.379872,
    phone: "+1-713-529-9899",
    websiteUrl: "https://continentalclub.com/houston",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/GSH-sf28dM8YtuBfXJPnVQ/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/izYVkGPrR5XcIz3fTAmFQg/l.jpg",
      "https://s.hdnux.com/photos/01/52/63/62/27999375/3/rawImage.jpg",
    ],
    rating: 4.5,
    reviewCount: 412,
    ownerVerified: false,
  },

  // ─── More Tex-Mex / fine dining ───────────────────────────────────────────
  {
    slug: "hugos-montrose",
    name: "Hugo's",
    description:
      "Chef Hugo Ortega's regional Mexican restaurant on Westheimer in Montrose since 2002. Made from scratch in Mexican tradition.",
    category: "FOOD_DRINK",
    subcategory: "Mexican",
    addressLine1: "1600 Westheimer Rd",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.742985,
    lng: -95.399694,
    websiteUrl: "https://www.hugosrestaurant.net",
    priceTier: 3,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/1x5HA0ePJSSCD_kE40nbmw/o.jpg",
      "https://s.hdnux.com/photos/01/26/62/55/22752117/4/1200x0.jpg",
    ],
    rating: 4.6,
    reviewCount: 1244,
    ownerVerified: false,
    recentlyAdded: true,
  },

  // ─── Seafood ──────────────────────────────────────────────────────────────
  {
    slug: "goode-co-seafood-westpark",
    name: "Goode Company Seafood",
    description:
      "Goode family's Gulf Coast seafood spot since 1986. Fresh from the Texas coast, prepared simple and well.",
    category: "FOOD_DRINK",
    subcategory: "Seafood · Cajun",
    addressLine1: "2621 Westpark Dr",
    city: "Houston",
    state: "TX",
    postalCode: "77098",
    lat: 29.728264,
    lng: -95.420238,
    websiteUrl: "https://goodecompanyseafood.com",
    priceTier: 3,
    locationCount: 2,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/2clnyvpkBkdT_tswex3Lcw/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/lCstGtjvjmMFdvhhDHRy6g/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/ZnXrm0QkV0gcukQROq2JZw/258s.jpg",
    ],
    rating: 4.5,
    reviewCount: 923,
    ownerVerified: false,
  },

  // ─── Services ─────────────────────────────────────────────────────────────
  {
    slug: "mcgrath-pest-control",
    name: "McGrath Pest Control",
    description:
      "Family-run pest control serving the greater Houston area for two generations since 1974.",
    category: "SERVICES",
    subcategory: "Pest control",
    addressLine1: "19424 Park Row Suite 100",
    city: "Houston",
    state: "TX",
    postalCode: "77084",
    lat: 29.792424,
    lng: -95.711276,
    phone: "+1-281-469-8240",
    websiteUrl: "https://mcgrathpestcontrol.com",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1584695930355-f3dd455d6332?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1736564176042-b3d49989b230?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 184,
    ownerVerified: false,
  },

  // ─── Retail ───────────────────────────────────────────────────────────────
  {
    slug: "bedrock-city-comics-washington",
    name: "Bedrock City Comics",
    description:
      "Houston's #1 comic shop ten years running per Houston Press. Owner Richard Evans has run it since 1990.",
    category: "RETAIL",
    subcategory: "Comics · Books",
    addressLine1: "4602 Washington Ave Ste A",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.770755,
    lng: -95.407573,
    phone: "+1-713-862-0100",
    websiteUrl: "https://www.bedrockcity.com",
    priceTier: 2,
    locationCount: 4,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/-p_7A1O650cBGQjOtdrkTQ/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/76ahJvxGBbaJvdWqRWEBCg/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/9_pSkD04H0e24b_gG94aZw/348s.jpg",
    ],
    rating: 4.7,
    reviewCount: 88,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "buchanans-native-plants-heights",
    name: "Buchanan's Native Plants",
    description:
      "Heights nursery since 1986. Native Texas plants, organic supplies, expert staff who actually know the local soil.",
    category: "RETAIL",
    subcategory: "Plants · Garden center",
    addressLine1: "611 E 11th St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.79099,
    lng: -95.3914,
    websiteUrl: "https://buchanansplants.com",
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media4.fl.yelpcdn.com/bphoto/YfZxjrxz65NxJ3Q4TM91Mg/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/ncjudg_q6-sg9kHHKsO-Cw/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/oZNWiBYeiQb1qpQlBJIYiQ/348s.jpg",
      "https://buchanansplants.com/wp-content/uploads/2026/05/gift-guide-banner-2.jpg",
    ],
    rating: 4.8,
    reviewCount: 259,
    ownerVerified: false,
  },

  // ─── Wellness ─────────────────────────────────────────────────────────────
  {
    slug: "black-swan-yoga-heights",
    name: "Black Swan Yoga – Heights",
    description:
      "Donation-based heated yoga studio brought to Houston in 2015 by siblings Roland and Olivia Keller. Approachable, community-driven.",
    category: "HEALTH_BEAUTY",
    subcategory: "Yoga studio",
    addressLine1: "3210 White Oak Dr",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.781731,
    lng: -95.392348,
    websiteUrl: "https://www.blackswanyoga.com",
    priceTier: 1,
    locationCount: 3,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/g2TqtUpjBBTKiL6iGm4aSQ/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/j3VDot-7vs4efOtmwnicag/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/4FEi9UtSUGc6eCMPBrEQWA/l.jpg",
    ],
    rating: 4.7,
    reviewCount: 109,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "memorial-heights-reflexology",
    name: "Memorial Heights Reflexology",
    description:
      "Reflexology and massage in the Heights. Family-run, regulars love the deep-tissue and foot work.",
    category: "HEALTH_BEAUTY",
    subcategory: "Massage · Reflexology",
    addressLine1: "920 Studemont St Ste 400",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.76742,
    lng: -95.391692,
    phone: "+1-281-948-4895",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.6,
    reviewCount: 73,
    ownerVerified: false,
  },
  {
    slug: "blossom-massage-rice-military",
    name: "Blossom Massage Urban Spa",
    description:
      "Urban spa near Memorial Park in Rice Military. Therapeutic and relaxation massage in a small, calming space.",
    category: "HEALTH_BEAUTY",
    subcategory: "Massage · Spa",
    addressLine1: "1416 Durham Dr",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.773535,
    lng: -95.41032,
    websiteUrl: "https://www.blossommassage.com",
    priceTier: 3,
    locationCount: 1,
    photoUrls: [
      "https://static.wixstatic.com/media/236524_87b3480d34ba4049a91085a01a3e7423%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/236524_87b3480d34ba4049a91085a01a3e7423%7Emv2.jpg",
    ],
    rating: 4.8,
    reviewCount: 47,
    ownerVerified: false,
    recentlyAdded: true,
  },

  // ─── More bakery / French ─────────────────────────────────────────────────
  {
    slug: "french-gourmet-bakery-river-oaks",
    name: "French Gourmet Bakery",
    description:
      "Houston bakery on Westheimer doing French and American style desserts since 1973. Wedding cakes, croissants, the works.",
    category: "FOOD_DRINK",
    subcategory: "Bakery · French",
    addressLine1: "2250 Westheimer Rd",
    city: "Houston",
    state: "TX",
    postalCode: "77098",
    lat: 29.74281,
    lng: -95.414962,
    phone: "+1-713-524-3744",
    websiteUrl: "https://www.fgbakery.com",
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/A_bpIWPPu1aSCG2o53iBKQ/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/9dSGl58xI7GGk74iyYIWcQ/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/6wpQrQSCBFbJ-XK6Tg80ug/348s.jpg",
    ],
    rating: 4.5,
    reviewCount: 152,
    ownerVerified: false,
  },

  // ─── Auto / mechanic ──────────────────────────────────────────────────────
  {
    slug: "family-auto-center-normandy",
    name: "Family Auto Center",
    description:
      "Family-owned independent auto repair on Normandy — a NAPA AutoCare network member, ASE-certified, serving the East side of Houston for 30+ years. Honest mechanics, no upsell.",
    category: "SERVICES",
    subcategory: "Auto repair · Mechanic",
    addressLine1: "780 Normandy St",
    city: "Houston",
    state: "TX",
    postalCode: "77015",
    lat: 29.782733,
    lng: -95.205313,
    phone: "+1-713-450-2759",
    websiteUrl: "https://www.familyautocenterhouston.com",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 73,
    ownerVerified: false,
  },

  // ─── Yoga ─────────────────────────────────────────────────────────────────
  {
    slug: "joy-yoga-center-heights",
    name: "Joy Yoga Center",
    description:
      "Heights yoga studio on Washington Ave. Voted Best Yoga Studio in Houston multiple years. Welcoming for all levels.",
    category: "HEALTH_BEAUTY",
    subcategory: "Yoga studio",
    addressLine1: "4500 Washington Ave",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.770779,
    lng: -95.406603,
    phone: "+1-713-886-9642",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.8,
    reviewCount: 98,
    ownerVerified: false,
  },

  // ─── Italian ──────────────────────────────────────────────────────────────
  {
    slug: "da-marco-montrose",
    name: "Da Marco",
    description:
      "Chef-owner Marco Wiles' Italian restaurant in a restored 1950's Montrose bungalow. Houstonians' favorite \"big night out\" Italian.",
    category: "FOOD_DRINK",
    subcategory: "Italian",
    addressLine1: "1520 Westheimer Rd",
    city: "Houston",
    state: "TX",
    postalCode: "77006",
    lat: 29.74311,
    lng: -95.3979,
    phone: "+1-713-807-8857",
    websiteUrl: "https://www.damarcohouston.com",
    priceTier: 4,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/WNwXiqnufc8Mgm34DqnaLg/l.jpg",
      "https://s3-media3.fl.yelpcdn.com/bphoto/1j2L44tO1f57jV4Raw-KOw/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/nWhwCACe9CqTINhh-yO2Cw/348s.jpg",
    ],
    rating: 4.7,
    reviewCount: 382,
    ownerVerified: false,
  },

  // ─── Breweries ────────────────────────────────────────────────────────────
  {
    slug: "saint-arnold-brewing",
    name: "Saint Arnold Brewing Company",
    description:
      "Texas's oldest craft brewery, brewing in Houston since 1994. Free brewery tours, beer garden, restaurant.",
    category: "FOOD_DRINK",
    subcategory: "Brewery · Beer Garden",
    addressLine1: "2000 Lyons Ave",
    city: "Houston",
    state: "TX",
    postalCode: "77020",
    lat: 29.771106,
    lng: -95.348417,
    websiteUrl: "https://www.saintarnold.com",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/StArnoldBreweryHoustonTX.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/St._arnolds_rear.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/36/2522_Fairway_Park.jpg",
    ],
    rating: 4.7,
    reviewCount: 1310,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "8th-wonder-brewery",
    name: "8th Wonder Brewery",
    description:
      "EaDo brewery + distillery + cannabis since 2013. Big outdoor space, full bar, the city's most Houston brewery.",
    category: "FOOD_DRINK",
    subcategory: "Brewery · Taproom",
    addressLine1: "2202 Dallas St",
    city: "Houston",
    state: "TX",
    postalCode: "77003",
    lat: 29.748888,
    lng: -95.355856,
    phone: "+1-713-581-2337",
    websiteUrl: "https://8thwonder.com",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/j0PL9Xr7KH1mt5G1uUjU4w/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/epVY1blHUOH-Fe3dLsLrWQ/l.jpg",
      "https://s.hdnux.com/photos/01/11/07/24/19166507/4/rawImage.jpg",
    ],
    rating: 4.6,
    reviewCount: 496,
    ownerVerified: false,
  },

  // ─── Korean BBQ ───────────────────────────────────────────────────────────
  {
    slug: "hongdae-33-korean-bbq",
    name: "Hongdae 33 Korean BBQ",
    description:
      "All-you-can-eat Korean BBQ in Asiatown's Dun Huang Plaza. Tabletop grills, banchan, soju.",
    category: "FOOD_DRINK",
    subcategory: "Korean BBQ",
    addressLine1: "9889 Bellaire Blvd Ste D-229",
    city: "Houston",
    state: "TX",
    postalCode: "77036",
    lat: 29.703436,
    lng: -95.553574,
    websiteUrl: "https://hongdae33kbbq.com",
    priceTier: 3,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/P3MKZDcXS5FOG9Hqmv212w/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/3SlGyMDrKMn6mcZTPgSFiA/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/FbBGQuaDi0U_-8TLIW4TDQ/348s.jpg",
    ],
    rating: 4.5,
    reviewCount: 333,
    ownerVerified: false,
  },

  // ─── Ice cream / dessert ──────────────────────────────────────────────────
  {
    slug: "sweet-bribery-heights",
    name: "Sweet Bribery",
    description:
      "Locally-owned dessert shop on 19th Street in the Heights. Cookies, ice cream, the works.",
    category: "FOOD_DRINK",
    subcategory: "Desserts · Ice cream",
    addressLine1: "250 W 19th St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.802683,
    lng: -95.40115,
    websiteUrl: "https://www.sweetbriberyhtx.com",
    priceTier: 1,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 89,
    ownerVerified: false,
  },
  {
    slug: "fat-cat-creamery-heights",
    name: "Fat Cat Creamery",
    description:
      "Heights gem doing scratch-made small-batch ice cream with Southern soul.",
    category: "FOOD_DRINK",
    subcategory: "Ice cream",
    addressLine1: "1225 W 34th St Suite C-300",
    city: "Houston",
    state: "TX",
    postalCode: "77018",
    lat: 29.816952,
    lng: -95.421888,
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/G6-tjLYClyU-vBLCk69fCg/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/KjgL0w5SkGvHnNCWBPRyWQ/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/mKhVhrGKlVmvRcRDjq735Q/o.jpg",
    ],
    rating: 4.6,
    reviewCount: 247,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "cloud-10-creamery-heights",
    name: "Cloud 10 Creamery",
    description:
      "Pastry chef-founded ice cream treating flavor like haute cuisine. Vietnamese iced coffee, toasted rice — that kind of place.",
    category: "FOOD_DRINK",
    subcategory: "Ice cream",
    addressLine1: "711 Heights Blvd",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.783767,
    lng: -95.398017,
    priceTier: 2,
    locationCount: 2,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/WE4Ic4607x-btWkDAhN1tA/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/gRWc0f1Uz9JqcyBVYBKLnw/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/wwoYhS2PWNgDFmcmZslrPw/o.jpg",
    ],
    rating: 4.7,
    reviewCount: 312,
    ownerVerified: false,
  },
  {
    slug: "red-dessert-dive-heights",
    name: "Red Dessert Dive",
    description:
      "Modern Heights storefront known for the Valrhona salted chocolate chunk cookie. Cake by the slice, too.",
    category: "FOOD_DRINK",
    subcategory: "Bakery · Desserts",
    addressLine1: "1045 Studewood St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.790299,
    lng: -95.387994,
    priceTier: 1,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 156,
    ownerVerified: false,
    recentlyAdded: true,
  },
  {
    slug: "pudgys-fine-cookies-heights",
    name: "Pudgy's Fine Cookies",
    description:
      "Cookie pop-up that found a permanent home on N. Shepherd in the Heights. Thick, chewy, worth the line.",
    category: "FOOD_DRINK",
    subcategory: "Bakery · Cookies",
    addressLine1: "1010 N Shepherd Dr",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.78917,
    lng: -95.409548,
    priceTier: 1,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/CNf8tmBLRv-J95SEUe10bg/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/GvMZ1EGDfFgp2_HR3GUX4A/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/oOsCdQ36k169hHBegbvwOQ/348s.jpg",
    ],
    rating: 4.8,
    reviewCount: 124,
    ownerVerified: false,
    recentlyAdded: true,
  },

  // ─── Antiques ─────────────────────────────────────────────────────────────
  {
    slug: "heights-antiques-on-yale",
    name: "Heights Antiques on Yale",
    description:
      "Two-floor antique destination in the Heights. Vintage treasures, mid-century, Texana.",
    category: "RETAIL",
    subcategory: "Antiques",
    addressLine1: "2110 Yale St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.805414,
    lng: -95.399029,
    priceTier: 3,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/1PvzxPwhhl92l20SyKQIuQ/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/RWKtHeisCQu0SY4vQnkyrA/300s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/7_3nB2R-ZBqTgNhuvIYXFA/o.jpg",
    ],
    rating: 4.6,
    reviewCount: 98,
    ownerVerified: false,
  },

  // ─── Bike shops ───────────────────────────────────────────────────────────
  {
    slug: "bike-barn-westheimer",
    name: "Bike Barn",
    description:
      "Houston bike shop on Westheimer — sales, service, fittings. Friendly to commuters and weekend riders alike.",
    category: "RETAIL",
    subcategory: "Bike shop",
    addressLine1: "11105 Westheimer St",
    city: "Houston",
    state: "TX",
    postalCode: "77042",
    lat: 29.735592,
    lng: -95.572144,
    phone: "+1-281-558-2234",
    priceTier: 2,
    locationCount: 4,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.5,
    reviewCount: 67,
    ownerVerified: false,
  },
  {
    slug: "west-end-bicycles",
    name: "West End Bicycles",
    description:
      "Independent Heights-adjacent bike shop. Honest fittings, good service, no pressure to upsell.",
    category: "RETAIL",
    subcategory: "Bike shop",
    addressLine1: "5427 Blossom St",
    city: "Houston",
    state: "TX",
    postalCode: "77007",
    lat: 29.767176,
    lng: -95.417466,
    phone: "+1-713-861-2271",
    websiteUrl: "https://www.westendbikeshtx.com",
    priceTier: 2,
    locationCount: 1,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/KvzxUPIFda6E713A338cDw/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/TnUC1tGE3tS-GlfJc1hnPg/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/HNL1UcL9d3TmZWRV3RTG1A/300s.jpg",
    ],
    rating: 4.8,
    reviewCount: 144,
    ownerVerified: false,
  },

  // ─── Pet care ─────────────────────────────────────────────────────────────
  {
    slug: "paws-pet-resort-garden-oaks",
    name: "Paws Pet Resort",
    description:
      "Family-owned dog boarding, daycare, and grooming in Garden Oaks since 2013.",
    category: "SERVICES",
    subcategory: "Pet boarding · Grooming",
    addressLine1: "3415 Couch St",
    city: "Houston",
    state: "TX",
    postalCode: "77018",
    lat: 29.818109,
    lng: -95.428161,
    websiteUrl: "https://www.pawspetresort.net",
    priceTier: 2,
    locationCount: 1,
    photoUrls: [
      "https://images.unsplash.com/photo-1583511666445-775f1f2116f5?auto=format&fit=crop&w=1600&q=80",
    ],
    rating: 4.7,
    reviewCount: 132,
    ownerVerified: false,
    recentlyAdded: true,
  },

  // ─── Barber / personal care ───────────────────────────────────────────────
  {
    slug: "cutthroat-barbers-heights",
    name: "Cutthroat Barbers – Heights",
    description:
      "Locally-owned barbershop on historic 19th Street, next door to Boomtown Coffee. 13 stations, classic shotgun layout, gender-neutral pricing.",
    category: "HEALTH_BEAUTY",
    subcategory: "Barbershop",
    addressLine1: "244 W 19th St",
    city: "Houston",
    state: "TX",
    postalCode: "77008",
    lat: 29.802645,
    lng: -95.400876,
    phone: "+1-713-446-5163",
    websiteUrl: "https://www.cutthroatbarbers.com",
    priceTier: 2,
    locationCount: 3,
    hours: RETAIL_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/mN_IHUCEKB0BJAyj3ZPdBw/o.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/GTpr0_hf0iJzvze2-jRRoA/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/H_luXvzLysguGReuXgL6Hw/348s.jpg",
    ],
    rating: 4.8,
    reviewCount: 84,
    ownerVerified: false,
    recentlyAdded: true,
  },
];

export const SAMPLE_BUSINESSES: SampleBusiness[] = [
  ...ALL_DENTAL_BUSINESSES,
  ...OTHER_DENTAL_BUSINESSES,
  ...ADDITIONAL_REAL_BUSINESSES,
  {
    slug: "bangkok-social-houston",
    name: "Bangkok Social",
    description:
      "Modern Thai with serious cocktails. Family-run, single location, locally beloved.",
    category: "FOOD_DRINK",
    subcategory: "Thai · Cocktails",
    addressLine1: "14309 East Sam Houston Pkwy N #700",
    city: "Houston",
    state: "TX",
    postalCode: "77044",
    lat: 29.928316,
    lng: -95.203628,
    websiteUrl: "https://www.bangkoksocialhtx.com",
    instagramHandle: "@bangkok.social",
    priceTier: 3,
    locationCount: 1,
    hours: RESTAURANT_HOURS,
    photoUrls: [
      "https://s3-media0.fl.yelpcdn.com/bphoto/L3dvKX_yiJOpfgIjljdZpQ/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/BN5rEmK3oN_m2bGIGa_DyA/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/q9RqlrSQYPskCsmp19_bkQ/348s.jpg",
    ],
    rating: 4.6,
    reviewCount: 318,
    ownerVerified: false,
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/PMa2L0RE8OBLY5JqtSEcjw/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/B54EfEWlTXnL40yDM4pQNA/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/LXJnGFIIl7jpWE-WGmIiSw/258s.jpg",
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/D2ul8vnWxCKDvL4kvlsTMg/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/PrqEKEltJLtRhWmbIrHhog/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/7WN9s-6CGO_eo3C4VKezBA/348s.jpg",
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/HJDuvQ0mhKEdHkTvjOR6Bw/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/41yXDWWJC5Z4KQrV9GtiAg/258s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/u0e3A4HlyHqdvtJD2HSLxA/o.jpg",
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/ihtYmUwkle-Lye5uFI-M0A/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/Hk8D7YCsP-1XE50GmA-Fiw/300s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/0imyL05S2YbAU41MVuBDeQ/180s.jpg",
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/oINo-dO4mAG2ke9Bfx6I0Q/348s.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/jUxwrbQocon1cCCG-3jMiw/l.jpg",
      "https://s3-media0.fl.yelpcdn.com/bphoto/ssH_0C_kO5QlnLniJYbv6w/l.jpg",
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
      "https://images.unsplash.com/photo-1654440122140-f1fc995ddb34?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1696154994502-93dd97495a4f?auto=format&fit=crop&w=1600&q=80",
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/wg_-lmwqXctbGgDSBob5Bw/o.jpg",
      "https://fastly.4sqi.net/img/general/600x600/6922173_093BKeoMlKGSOHoe9Qt5dZO-oBibJ52Cr313eEVQsIk.jpg",
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
