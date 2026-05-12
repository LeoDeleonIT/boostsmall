"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// Renders a review's photos as a clickable grid. Clicking opens an in-page
// lightbox (dark backdrop, larger image, arrow + Esc to navigate) instead
// of a new browser tab — readers stay in the review thread.
export function ReviewPhotoGrid({ photoUrls }: { photoUrls: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + photoUrls.length) % photoUrls.length,
      ),
    [photoUrls.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % photoUrls.length)),
    [photoUrls.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, prev, next]);

  return (
    <>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {photoUrls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square overflow-hidden rounded-xl border border-border bg-ink/5 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-terracotta"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover hover:scale-[1.03] transition-transform"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review photo"
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-ink/60 text-white h-10 w-10 flex items-center justify-center text-xl leading-none hover:bg-ink"
          >
            ×
          </button>

          {photoUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 text-white h-10 w-10 flex items-center justify-center hover:bg-ink"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 text-white h-10 w-10 flex items-center justify-center hover:bg-ink"
              >
                ›
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw]"
          >
            <Image
              src={photoUrls[openIndex]}
              alt=""
              width={1600}
              height={1200}
              className="max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
