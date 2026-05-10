import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const textSizes = {
  sm: "text-xl",
  default: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
} as const;

// Image renders at this height (px); width derives from the logo's 3:2 aspect.
const imageHeights = {
  sm: 40,
  default: 56,
  lg: 88,
  xl: 128,
} as const;

const LOGO_ASPECT = 1536 / 1024; // intrinsic width / height of /public/logo.png

interface WordmarkProps {
  className?: string;
  size?: keyof typeof textSizes;
  href?: string;
  asLink?: boolean;
  showTagline?: boolean;
  /** Render the actual logo PNG instead of the recreated text wordmark. */
  useImage?: boolean;
  /** Use a single ink color instead of the sage+terracotta split. (text only) */
  monochrome?: boolean;
}

export function Wordmark({
  className,
  size = "default",
  href = "/",
  asLink = true,
  showTagline = false,
  useImage = false,
  monochrome = false,
}: WordmarkProps) {
  let inner: React.ReactNode;

  if (useImage) {
    const h = imageHeights[size];
    const w = Math.round(h * LOGO_ASPECT);
    inner = (
      <Image
        src="/logo.png"
        alt="boostsmall — support local favorites"
        width={w}
        height={h}
        priority
        className={cn("h-auto w-auto", className)}
        style={{ height: h }}
      />
    );
  } else {
    inner = (
      <span className={cn("inline-flex flex-col items-start", className)}>
        <span
          className={cn(
            "font-wordmark lowercase leading-none tracking-tight",
            textSizes[size]
          )}
        >
          {monochrome ? (
            <span className="text-ink">boostsmall</span>
          ) : (
            <>
              <span className="text-sage">boost</span>
              <span className="text-terracotta">small</span>
            </>
          )}
        </span>
        {showTagline && (
          <span className="mt-1 text-xs italic tracking-wide text-sage-deep">
            — support local favorites —
          </span>
        )}
      </span>
    );
  }

  return asLink ? (
    <Link href={href} className="inline-block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
