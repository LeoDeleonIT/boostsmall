import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import "./globals.css";

// Body + display font — rounded humanist sans, "homey" but readable at all sizes.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

// Wordmark only — Quicksand matches the geometric round shapes in the logo.
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "boostsmall — discover and review the family-owned places near you",
    template: "%s · boostsmall",
  },
  description:
    "Support local favorites. boostsmall is a discovery and review platform for independent, family-owned small businesses — restaurants, dentists, bookstores, plumbers, salons, and more. No chains, no franchises.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${quicksand.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {/* Pre-fetches the UploadThing router config so the upload widgets
            render immediately on first paint instead of waiting for a roundtrip. */}
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </body>
    </html>
  );
}
