// Seed the ChainBlocklist table.
// Run with: pnpm db:seed-chains
//
// Chains are normalized via lib/normalize.normalizeName() so that "McDonald's",
// "Mcdonalds", and "MC DONALD'S" collapse to a single entry. Adding more later
// either via this file or the /admin/chains UI is fine — the unique index on
// `normalizedName` prevents duplicates.

import { PrismaClient } from "@prisma/client";
import { normalizeName } from "../lib/normalize";

const db = new PrismaClient();

interface ChainEntry {
  name: string;
  parentCompany?: string;
  reason?: string;
}

const CHAINS: ChainEntry[] = [
  // Quick service / fast food
  { name: "McDonald's", parentCompany: "McDonald's Corporation" },
  { name: "Burger King", parentCompany: "Restaurant Brands International" },
  { name: "Wendy's", parentCompany: "The Wendy's Company" },
  { name: "Chipotle", parentCompany: "Chipotle Mexican Grill" },
  { name: "Subway", parentCompany: "Subway IP LLC" },
  { name: "Jimmy John's", parentCompany: "Inspire Brands" },
  { name: "Jersey Mike's", parentCompany: "Jersey Mike's Subs" },
  { name: "Firehouse Subs", parentCompany: "Restaurant Brands International" },
  { name: "Five Guys", parentCompany: "Five Guys Enterprises" },
  { name: "Shake Shack", parentCompany: "Shake Shack Inc" },
  { name: "In-N-Out", parentCompany: "In-N-Out Burgers" },
  { name: "Whataburger", parentCompany: "Whataburger Restaurants LLC" },
  { name: "Sweetgreen", parentCompany: "Sweetgreen Inc" },
  { name: "Cava", parentCompany: "Cava Group" },
  { name: "Panera", parentCompany: "Panera Brands" },
  { name: "Pret a Manger", parentCompany: "JAB Holding" },
  { name: "Domino's", parentCompany: "Domino's Pizza Inc" },
  { name: "Pizza Hut", parentCompany: "Yum! Brands" },
  { name: "Papa John's", parentCompany: "Papa John's International" },
  { name: "Little Caesars", parentCompany: "Ilitch Holdings" },
  { name: "KFC", parentCompany: "Yum! Brands" },
  { name: "Popeyes", parentCompany: "Restaurant Brands International" },
  { name: "Chick-fil-A", parentCompany: "Chick-fil-A Inc" },
  { name: "Raising Cane's", parentCompany: "Raising Cane's Restaurants" },
  { name: "Taco Bell", parentCompany: "Yum! Brands" },
  { name: "Del Taco", parentCompany: "Jack in the Box" },
  { name: "Panda Express", parentCompany: "Panda Restaurant Group" },

  // Casual dining (sit-down chains)
  { name: "Chili's", parentCompany: "Brinker International" },
  { name: "Applebee's", parentCompany: "Dine Brands" },
  { name: "Olive Garden", parentCompany: "Darden Restaurants" },
  { name: "Outback Steakhouse", parentCompany: "Bloomin' Brands" },
  { name: "Red Lobster", parentCompany: "Thai Union Group" },
  { name: "TGI Fridays", parentCompany: "TGI Fridays Inc" },
  { name: "Cracker Barrel", parentCompany: "Cracker Barrel Old Country Store" },
  { name: "IHOP", parentCompany: "Dine Brands" },
  { name: "Denny's", parentCompany: "Denny's Corporation" },
  { name: "Waffle House", parentCompany: "Waffle House Inc" },
  { name: "P.F. Chang's", parentCompany: "P.F. Chang's China Bistro" },
  { name: "LongHorn Steakhouse", parentCompany: "Darden Restaurants" },
  { name: "Texas Roadhouse", parentCompany: "Texas Roadhouse Inc" },
  { name: "Buffalo Wild Wings", parentCompany: "Inspire Brands" },
  { name: "Hooters", parentCompany: "Hooters of America" },

  // Coffee / tea
  { name: "Starbucks", parentCompany: "Starbucks Corporation" },
  { name: "Dunkin'", parentCompany: "Inspire Brands" },
  { name: "Tim Hortons", parentCompany: "Restaurant Brands International" },
  { name: "Peet's Coffee", parentCompany: "JDE Peet's" },

  // Treats
  { name: "Dairy Queen", parentCompany: "Berkshire Hathaway" },
  { name: "Baskin-Robbins", parentCompany: "Inspire Brands" },
  { name: "Cold Stone Creamery", parentCompany: "Kahala Brands" },
  { name: "Krispy Kreme", parentCompany: "JAB Holding" },
  { name: "Cinnabon", parentCompany: "GoTo Foods" },
  { name: "Auntie Anne's", parentCompany: "GoTo Foods" },
  { name: "Wetzel's Pretzels", parentCompany: "MTY Food Group" },

  // Grocery
  { name: "Whole Foods", parentCompany: "Amazon" },
  { name: "Trader Joe's", parentCompany: "Aldi Nord" },
  { name: "Sprouts", parentCompany: "Sprouts Farmers Market" },
  { name: "Kroger", parentCompany: "The Kroger Co" },
  { name: "Safeway", parentCompany: "Albertsons Companies" },

  // Big-box / mass retail
  { name: "Walmart", parentCompany: "Walmart Inc" },
  { name: "Target", parentCompany: "Target Corporation" },

  // Pharmacy
  { name: "CVS", parentCompany: "CVS Health" },
  { name: "Walgreens", parentCompany: "Walgreens Boots Alliance" },
  { name: "Rite Aid", parentCompany: "Rite Aid Corporation" },

  // Convenience / gas
  { name: "7-Eleven", parentCompany: "Seven & i Holdings" },
  { name: "Circle K", parentCompany: "Alimentation Couche-Tard" },
  { name: "Wawa", parentCompany: "Wawa Inc" },
  { name: "Sheetz", parentCompany: "Sheetz Inc" },

  // Auto
  { name: "AutoZone", parentCompany: "AutoZone Inc" },
  { name: "O'Reilly Auto Parts", parentCompany: "O'Reilly Automotive" },
  { name: "Jiffy Lube", parentCompany: "Shell" },
  { name: "Valvoline", parentCompany: "Valvoline Inc" },

  // Hair / personal care
  { name: "Supercuts", parentCompany: "Regis Corporation" },
  { name: "Great Clips", parentCompany: "Great Clips Inc" },
  { name: "Sport Clips", parentCompany: "Sport Clips Inc" },
  { name: "Massage Envy", parentCompany: "Roark Capital Group" },

  // Fitness
  { name: "Anytime Fitness", parentCompany: "Self Esteem Brands" },
  { name: "Planet Fitness", parentCompany: "Planet Fitness Inc" },
  { name: "LA Fitness", parentCompany: "Fitness International" },
  { name: "Orangetheory", parentCompany: "Roark Capital Group" },
  { name: "F45", parentCompany: "F45 Training Holdings" },
];

async function main() {
  console.log(`Seeding ${CHAINS.length} chains…`);
  let created = 0;
  let skipped = 0;

  for (const entry of CHAINS) {
    const normalized = normalizeName(entry.name);
    const existing = await db.chainBlocklist.findUnique({
      where: { normalizedName: normalized },
    });
    if (existing) {
      skipped++;
      continue;
    }
    await db.chainBlocklist.create({
      data: {
        name: entry.name,
        normalizedName: normalized,
        parentCompany: entry.parentCompany,
        reason: entry.reason ?? "Multi-location chain — does not meet ≤5 location rule",
      },
    });
    created++;
  }

  console.log(`Done. Created: ${created}. Already present: ${skipped}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
