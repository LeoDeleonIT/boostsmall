import type { DefaultSession } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // Nullable in the brief window between user creation and the
      // events.createUser callback in lib/auth.ts filling it in.
      username: string | null;
      role: UserRole;
    } & DefaultSession["user"];
  }
}
