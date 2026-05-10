import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserNavProps {
  /** Use "dark" when rendered over a dark photo (e.g. the homepage hero). */
  variant?: "light" | "dark";
}

export async function UserNav({ variant = "light" }: UserNavProps) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          asChild
          className={
            variant === "dark"
              ? "text-white hover:bg-white/10 font-semibold"
              : ""
          }
        >
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button variant="warm" className="hidden sm:inline-flex" asChild>
          <Link href="/sign-in">Join</Link>
        </Button>
      </div>
    );
  }

  const u = session.user;
  const initial = (
    u.name?.[0] ??
    u.username?.[0] ??
    u.email?.[0] ??
    "?"
  ).toUpperCase();
  const isAdmin = u.role === "ADMIN";
  const isMod = u.role === "MODERATOR" || isAdmin;

  const linkClass =
    variant === "dark"
      ? "text-white/95 hover:text-white text-sm font-semibold"
      : "text-ink-soft hover:text-ink text-sm font-semibold";

  return (
    <div className="flex items-center gap-4">
      {isAdmin && (
        <Link href="/admin" className={linkClass}>
          Admin
        </Link>
      )}
      {isMod && !isAdmin && (
        <Link href="/moderate" className={linkClass}>
          Moderate
        </Link>
      )}

      <Link
        href={u.username ? `/u/${u.username}` : "/"}
        className="inline-flex items-center gap-2.5 group"
      >
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm",
            variant === "dark"
              ? "bg-white/20 text-white"
              : "bg-sage/15 text-sage-deep"
          )}
        >
          {initial}
        </span>
        <span
          className={cn(
            "hidden md:inline text-sm font-semibold",
            variant === "dark"
              ? "text-white group-hover:text-white/80"
              : "text-ink group-hover:text-ink-soft"
          )}
        >
          {u.username ?? u.email}
        </span>
      </Link>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className={
            variant === "dark"
              ? "text-white/85 hover:bg-white/10"
              : "text-ink-soft hover:text-ink"
          }
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
