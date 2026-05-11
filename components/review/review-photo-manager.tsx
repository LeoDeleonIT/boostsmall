"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useTransition } from "react";
import { UploadButton } from "@/components/uploadthing";

interface PhotoData {
  id: string;
  url: string;
  width: number;
  height: number;
}

export function ReviewPhotoManager({
  reviewId,
  photos,
  onDeletePhoto,
}: {
  reviewId: string;
  photos: PhotoData[];
  onDeletePhoto: (photoId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (photoId: string) => {
    if (!confirm("Remove this photo?")) return;
    startDelete(async () => {
      try {
        await onDeletePhoto(photoId);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Delete failed");
      }
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta-deep">
          {error}
        </div>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-ink/5"
            >
              <Image
                src={p.url}
                alt=""
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                disabled={isDeleting}
                className="absolute top-2 right-2 rounded-full bg-ink/70 text-white text-xs font-bold px-2.5 py-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40 hover:bg-ink"
                aria-label="Remove photo"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-5 rounded-xl border border-dashed border-border-strong bg-background-soft p-5 text-center text-sm text-ink-soft">
          Add photos from your visit (food, room, sign — whatever helps).
        </div>
      )}

      {photos.length < 4 && (
        <UploadButton
          endpoint="reviewPhoto"
          input={{ reviewId }}
          appearance={{
            button:
              "ut-ready:bg-sage ut-ready:hover:bg-sage-deep ut-uploading:bg-sage-deep h-10 px-5 rounded-full text-sm font-semibold text-white transition-colors after:bg-sage-deep",
            allowedContent: "text-xs text-ink-soft mt-2",
          }}
          content={{
            button({ ready, isUploading, uploadProgress }) {
              if (isUploading) return `Uploading… ${uploadProgress ?? 0}%`;
              if (ready) return photos.length > 0 ? "Add more" : "Add photos";
              return "Loading…";
            },
            allowedContent({ ready, isUploading }) {
              if (!ready || isUploading) return "";
              return `Up to ${4 - photos.length} more · JPG/PNG, 8 MB each`;
            },
          }}
          onClientUploadComplete={() => {
            setError(null);
            router.refresh();
          }}
          onUploadError={(e) => {
            setError(e.message);
          }}
        />
      )}
    </div>
  );
}
