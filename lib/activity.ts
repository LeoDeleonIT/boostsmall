import "server-only";
import { db } from "@/lib/db";

export type ActivityKind =
  | "submission"
  | "approval"
  | "rejection"
  | "claim"
  | "photo";

export interface ActivityEvent {
  id: string;
  at: Date;
  kind: ActivityKind;
  actorUsername: string | null;
  actorEmail: string | null;
  businessName: string;
  businessSlug: string;
}

// Pulls recent events across submissions, approvals/rejections, owner claims,
// and photo uploads. Merges + sorts in memory — fine for an admin dashboard
// with low row counts. If volumes grow, swap to a single SQL union query.
export async function recentActivity(limit = 25): Promise<ActivityEvent[]> {
  const [submissions, decisions, claims, photos] = await Promise.all([
    db.business.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        submittedBy: { select: { username: true, email: true } },
      },
    }),
    db.business.findMany({
      where: {
        OR: [
          { status: "APPROVED", approvedAt: { not: null } },
          { status: "REJECTED" },
        ],
      },
      orderBy: { approvedAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        approvedAt: true,
        updatedAt: true,
        approvedBy: { select: { username: true, email: true } },
      },
    }),
    db.businessOwner.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        user: { select: { username: true, email: true } },
        business: { select: { name: true, slug: true } },
      },
    }),
    db.photo.findMany({
      where: { businessId: { not: null } },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        user: { select: { username: true, email: true } },
        business: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const events: ActivityEvent[] = [
    ...submissions.map((s) => ({
      id: `sub-${s.id}`,
      at: s.createdAt,
      kind: "submission" as const,
      actorUsername: s.submittedBy?.username ?? null,
      actorEmail: s.submittedBy?.email ?? null,
      businessName: s.name,
      businessSlug: s.slug,
    })),
    ...decisions.map((d) => ({
      id: `dec-${d.id}`,
      at: d.approvedAt ?? d.updatedAt,
      kind: (d.status === "APPROVED" ? "approval" : "rejection") as ActivityKind,
      actorUsername: d.approvedBy?.username ?? null,
      actorEmail: d.approvedBy?.email ?? null,
      businessName: d.name,
      businessSlug: d.slug,
    })),
    ...claims.map((c) => ({
      id: `claim-${c.id}`,
      at: c.createdAt,
      kind: "claim" as const,
      actorUsername: c.user.username,
      actorEmail: c.user.email,
      businessName: c.business.name,
      businessSlug: c.business.slug,
    })),
    ...photos
      .filter((p) => p.business)
      .map((p) => ({
        id: `photo-${p.id}`,
        at: p.createdAt,
        kind: "photo" as const,
        actorUsername: p.user.username,
        actorEmail: p.user.email,
        businessName: p.business!.name,
        businessSlug: p.business!.slug,
      })),
  ];

  return events
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, limit);
}

export function activityVerb(kind: ActivityKind): string {
  switch (kind) {
    case "submission":
      return "submitted";
    case "approval":
      return "approved";
    case "rejection":
      return "rejected";
    case "claim":
      return "claimed";
    case "photo":
      return "uploaded a photo to";
  }
}
