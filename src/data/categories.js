// Category tiles for the "Browse by category" section.
// Matches the 9 categories called out in the Phase 1 brief.
// Business counts are placeholders — wire to API in a later phase.

import { Coffee, BookOpen, Cake, Scissors, Bike, Palette, Pen, Disc, Flower2 } from "lucide-react";

export const CATEGORIES = [
  { slug: "cafes",       name: "Cafés",         icon: Coffee,   count: 248 },
  { slug: "bookstores",  name: "Bookstores",    icon: BookOpen, count: 34  },
  { slug: "bakeries",    name: "Bakeries",      icon: Cake,     count: 91  },
  { slug: "salons",      name: "Salons",        icon: Scissors, count: 187 },
  { slug: "bike-shops",  name: "Bike Shops",    icon: Bike,     count: 22  },
  { slug: "galleries",   name: "Art Galleries", icon: Palette,  count: 19  },
  { slug: "tattoo",      name: "Tattoo",        icon: Pen,      count: 44  },
  { slug: "records",     name: "Record Stores", icon: Disc,     count: 12  },
  { slug: "florists",    name: "Florists",      icon: Flower2,  count: 38  },
];
