import { z } from "zod";

export const BusinessCategoryEnum = z.enum([
  "FOOD_DRINK",
  "RETAIL",
  "SERVICES",
  "HEALTH_BEAUTY",
  "ARTS",
  "OTHER",
]);

const hoursDay = z.array(
  z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"),
    close: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"),
  })
);

export const BusinessHoursSchema = z.object({
  mon: hoursDay.optional(),
  tue: hoursDay.optional(),
  wed: hoursDay.optional(),
  thu: hoursDay.optional(),
  fri: hoursDay.optional(),
  sat: hoursDay.optional(),
  sun: hoursDay.optional(),
});

// Public submission — used by /submit and validated server-side.
export const BusinessSubmissionSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  description: z.string().max(2000).optional(),
  category: BusinessCategoryEnum,
  subcategory: z.string().max(80).optional(),

  addressLine1: z.string().min(3).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(80),
  state: z.string().length(2, "Two-letter state code"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "ZIP or ZIP+4"),
  country: z.string().length(2).default("US"),

  phone: z
    .string()
    .regex(/^\+?[\d\s().-]{7,20}$/, "Phone number")
    .optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  instagramHandle: z
    .string()
    .regex(/^@?[A-Za-z0-9._]{1,30}$/, "Instagram handle")
    .optional(),

  hours: BusinessHoursSchema.optional(),
  priceTier: z.coerce.number().int().min(1).max(4).default(2),

  // Self-reported. Anything > 5 is rejected by the chain check.
  locationCount: z.coerce.number().int().min(1).max(50).default(1),
});

// Owner-side edit. Same shape minus identity-establishing fields that should
// not change without re-verification.
export const BusinessEditSchema = BusinessSubmissionSchema.omit({
  // owners can edit name/category but not the location count itself —
  // crossing the 5-location threshold should re-trigger moderation.
  locationCount: true,
});

export type BusinessSubmissionInput = z.infer<typeof BusinessSubmissionSchema>;
export type BusinessEditInput = z.infer<typeof BusinessEditSchema>;
