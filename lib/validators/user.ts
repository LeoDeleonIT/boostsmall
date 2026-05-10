import { z } from "zod";

// Reserved usernames that cannot be claimed by users.
const RESERVED = new Set([
  "admin", "moderate", "moderator", "owner", "api", "auth",
  "submit", "search", "design", "b", "u", "about", "help",
  "boostsmall", "support", "contact", "settings", "sign-in",
  "sign-out", "sign-up", "_design", "_next",
]);

export const UsernameSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(24, "At most 24 characters")
  .regex(/^[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])?$/, "Lowercase letters, numbers, and hyphens")
  .refine((s) => !RESERVED.has(s), "That username is reserved");

export const ProfileEditSchema = z.object({
  name: z.string().max(80).optional(),
  username: UsernameSchema,
  bio: z.string().max(500).optional(),
});

export const SignInEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ProfileEditInput = z.infer<typeof ProfileEditSchema>;
export type SignInEmailInput = z.infer<typeof SignInEmailSchema>;
