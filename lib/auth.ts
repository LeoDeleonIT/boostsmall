import "server-only";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

// TODO: Apple provider when developer account is available

const isPreview = process.env.VERCEL_ENV === "preview";

function slugifyName(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
  return `${base || "user"}-${nanoid(6).toLowerCase()}`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/sign-in/check-email",
  },
  providers: [
    // Google sign-in is disabled on Vercel preview deploys (Google does not
    // accept wildcard *.vercel.app redirect URIs). Magic link still works.
    ...(isPreview
      ? []
      : [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Verified Google emails only — never link unverified providers.
            allowDangerousEmailAccountLinking: true,
          }),
        ]),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_AUTH ?? "noreply@boostsmall.com",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // surface fields onto the session
        const u = await db.user.findUnique({
          where: { id: user.id },
          select: { username: true, role: true, avatarUrl: true },
        });
        if (u) {
          session.user.username = u.username;
          session.user.role = u.role;
          if (u.avatarUrl) session.user.image = u.avatarUrl;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // First-time setup: assign a username, mirror image → avatarUrl,
      // promote ADMIN_EMAIL to ADMIN.
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
      const isAdmin = !!adminEmail && user.email?.toLowerCase() === adminEmail;
      const username = slugifyName(user.name ?? user.email?.split("@")[0] ?? "user");

      await db.user.update({
        where: { id: user.id },
        data: {
          username,
          avatarUrl: user.image ?? undefined,
          role: isAdmin ? "ADMIN" : "USER",
        },
      });
    },
    async signIn({ user }) {
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { lastSeenAt: new Date() },
        }).catch(() => {});
      }
    },
  },
});
