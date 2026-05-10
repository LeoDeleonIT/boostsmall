"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useTransition } from "react";
import { UploadButton } from "@/components/uploadthing";
import { Button } from "@/components/ui/button";

interface PhotoData {
  id: string;
  url: string;
  width: number;
  height: number;
}

export function BusinessPhotoManager({
  businessId,
  photos,
  onDeletePhoto,
}: {
  businessId: string;
  photos: PhotoData[];
  onDeletePhoto: (photoId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (photoId: string) => {
    if (!confirm("Delete this photo?")) return;
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-ink/5"
            >
              <Image
                src={p.url}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                disabled={isDeleting}
                className="absolute top-2 right-2 rounded-full bg-ink/70 text-white text-xs font-bold px-3 py-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40 hover:bg-ink"
                aria-label="Delete photo"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-5 rounded-xl border border-dashed border-border-strong bg-background-soft p-6 text-center text-sm text-ink-soft">
          No photos yet. Upload up to 6 — JPG or PNG, 8 MB max each.
        </div>
      )}

      <div className="flex items-center gap-3">
        <UploadButton
          endpoint="businessPhoto"
          input={{ businessId }}
          appearance={{
            button:
              "ut-ready:bg-terracotta ut-ready:hover:bg-terracotta-deep ut-uploading:bg-terracotta-deep h-10 px-5 rounded-full text-sm font-semibold text-white transition-colors after:bg-terracotta-deep",
            allowedContent: "text-xs text-ink-soft mt-2",
          }}
          content={{
            button({ ready, isUploading, uploadProgress }) {
              if (isUploading) return `Uploading… ${uploadProgress ?? 0}%`;
              if (ready) return "Add photos";
              return "Loading…";
            },
            allowedContent({ ready, fileTypes, isUploading }) {
              if (!ready || isUploading) return "";
              return `Up to 6 ${fileTypes.join(", ").replace("image", "JPG/PNG")} files, 8 MB each`;
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
      </div>
    </div>
  );
}
