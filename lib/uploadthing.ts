import "server-only";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const f = createUploadthing();

// File router definition. Each endpoint is its own typed upload bucket
// with its own auth + size + count rules.
export const ourFileRouter = {
  // Business cover/gallery photos. Owner of the business OR admin can upload.
  businessPhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 6 } })
    .input(z.object({ businessId: z.string().cuid() }))
    .middleware(async ({ input }) => {
      const session = await auth();
      if (!session?.user) throw new UploadThingError("Sign in to upload photos.");

      // Authorize: must own the business OR be admin
      if (session.user.role !== "ADMIN") {
        const owner = await db.businessOwner.findFirst({
          where: { userId: session.user.id, businessId: input.businessId },
          select: { id: true },
        });
        if (!owner) {
          throw new UploadThingError(
            "You don't own this business. Claim it first."
          );
        }
      }

      // The return value is passed to onUploadComplete as `metadata`.
      return { businessId: input.businessId, userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Probe image dimensions via sharp so we store accurate w/h.
      let width = 0;
      let height = 0;
      try {
        const res = await fetch(file.ufsUrl);
        const buf = Buffer.from(await res.arrayBuffer());
        const meta = await sharp(buf).metadata();
        width = meta.width ?? 0;
        height = meta.height ?? 0;
      } catch {
        // Probe failed — store with 0/0 dimensions; renderer falls back gracefully.
      }

      await db.photo.create({
        data: {
          url: file.ufsUrl,
          width,
          height,
          businessId: metadata.businessId,
          userId: metadata.userId,
        },
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
