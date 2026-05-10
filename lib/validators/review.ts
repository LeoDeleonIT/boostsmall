import { z } from "zod";

export const ReviewSubmissionSchema = z.object({
  businessId: z.string().cuid(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(30, "Reviews must be at least 30 characters").max(5000),
  visitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  // Photos are uploaded separately via UploadThing and attached by ID.
  photoIds: z.array(z.string().cuid()).max(6).default([]),
});

export const ReviewEditSchema = ReviewSubmissionSchema.omit({
  businessId: true,
}).extend({
  reviewId: z.string().cuid(),
});

export const OwnerResponseSchema = z.object({
  reviewId: z.string().cuid(),
  body: z.string().min(20, "Response is too short").max(2000),
});

export const ReviewReportSchema = z.object({
  reviewId: z.string().cuid(),
  reason: z.enum([
    "SPAM",
    "OFFENSIVE",
    "FAKE",
    "CONFLICT_OF_INTEREST",
    "OFF_TOPIC",
    "OTHER",
  ]),
  notes: z.string().max(1000).optional(),
});

export type ReviewSubmissionInput = z.infer<typeof ReviewSubmissionSchema>;
export type ReviewEditInput = z.infer<typeof ReviewEditSchema>;
export type OwnerResponseInput = z.infer<typeof OwnerResponseSchema>;
export type ReviewReportInput = z.infer<typeof ReviewReportSchema>;
