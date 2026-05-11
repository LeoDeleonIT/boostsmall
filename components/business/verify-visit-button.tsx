"use client";

import { useState, useTransition } from "react";
import { verifyVisitAction } from "@/server/actions/verify-visit";

// "I'm here" check-in button. Reads navigator.geolocation, then calls
// verifyVisitAction which re-checks distance server-side. The action
// redirects back to the page on success so a refresh-style page reload
// reflects the new state.
export function VerifyVisitButton({
  businessSlug,
  alreadyVerified,
}: {
  businessSlug: string;
  alreadyVerified: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (alreadyVerified) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-sage/10 text-sage-deep border border-sage/40 px-3 h-9 text-sm font-bold"
        title="You've verified a visit to this business"
      >
        <span aria-hidden>✓</span>
        Visit verified
      </span>
    );
  }

  const onClick = () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Your browser doesn't support location sharing.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const fd = new FormData();
        fd.set("businessSlug", businessSlug);
        fd.set("lat", String(pos.coords.latitude));
        fd.set("lng", String(pos.coords.longitude));
        if (pos.coords.accuracy) {
          fd.set("accuracy", String(pos.coords.accuracy));
        }
        startTransition(() => {
          verifyVisitAction(fd);
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied. We can't verify without it.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Couldn't get a location fix. Try again outside.");
        } else {
          setError("Location timed out. Try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface text-ink-soft hover:text-ink hover:border-sage px-3 h-9 text-sm font-bold transition-colors disabled:opacity-50"
        title="Verify you're here by sharing your location"
      >
        <span aria-hidden>📍</span>
        {pending ? "Checking…" : "I'm here"}
      </button>
      {error && (
        <span className="text-xs text-terracotta-deep">{error}</span>
      )}
    </div>
  );
}
