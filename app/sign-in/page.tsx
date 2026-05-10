import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/wordmark";
import { signIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
};

async function emailSignIn(formData: FormData) {
  "use server";
  const emailRaw = formData.get("email");
  const email = typeof emailRaw === "string" ? emailRaw.trim() : "";
  if (!email) {
    redirect("/sign-in?error=missing-email");
  }
  // signIn redirects on success (to verifyRequest page).
  // Errors are propagated as redirect search params.
  await signIn("resend", {
    email,
    redirectTo: "/",
  });
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Wordmark useImage size="xl" asLink={false} />
            <h1 className="font-display text-3xl mt-6 text-ink">Welcome back</h1>
            <p className="text-ink-soft mt-2">
              Sign in to write a review or claim your business.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-7 space-y-5">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center"
              type="button"
              disabled
              title="Configure GOOGLE_CLIENT_* in .env.local to enable"
            >
              <GoogleMark />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-3 text-ink-soft tracking-widest">
                  or by email
                </span>
              </div>
            </div>

            <form action={emailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@neighborhood.com"
                  required
                  autoComplete="email"
                />
              </div>

              {error && (
                <p className="text-sm text-terracotta-deep bg-terracotta/10 rounded-lg px-3 py-2">
                  {errorMessage(error)}
                </p>
              )}

              <Button type="submit" variant="warm" size="lg" className="w-full">
                Email me a sign-in link
              </Button>
              <p className="text-xs text-ink-soft text-center">
                We&apos;ll send a one-time link from{" "}
                <span className="text-ink">noreply@boostsmall.com</span>. No
                password to remember.
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-ink-soft">
            By continuing you agree to be a good neighbor.{" "}
            <Link href="/about" className="underline hover:text-ink">
              How boostsmall works
            </Link>
            .
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function errorMessage(code: string) {
  switch (code) {
    case "missing-email":
      return "Please enter your email.";
    case "EmailSignin":
      return "We couldn't send the email. Try again in a minute.";
    case "Verification":
      return "That sign-in link expired or was already used. Request a fresh one.";
    default:
      return "Something went wrong. Try again.";
  }
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.6z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.93v2.32A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.97H.93A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.93 4.03l3.04-2.32z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.62 8.62 0 0 0 9 0 9 9 0 0 0 .93 4.97L3.97 7.3C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
