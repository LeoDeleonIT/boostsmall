import { db } from "@/lib/db";

// Server component — confirms the Neon database is reachable end-to-end.
// Renders nothing if the connection fails (so /design still loads on a
// fresh clone without DATABASE_URL).
export async function DbStatus() {
  let businesses = 0;
  let chains = 0;
  let connected = false;

  try {
    const [b, c] = await Promise.all([
      db.business.count(),
      db.chainBlocklist.count(),
    ]);
    businesses = b;
    chains = c;
    connected = true;
  } catch {
    // swallow — return disconnected state
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={
            connected
              ? "h-2.5 w-2.5 rounded-full bg-sage shadow-[0_0_0_3px] shadow-sage/20"
              : "h-2.5 w-2.5 rounded-full bg-terracotta shadow-[0_0_0_3px] shadow-terracotta/20"
          }
          aria-hidden
        />
        <p className="text-sm font-bold text-ink">
          {connected ? "Database connected" : "Database unreachable"}
        </p>
      </div>
      {connected ? (
        <ul className="text-sm text-ink-soft space-y-1 tnum">
          <li className="flex justify-between">
            <span>Businesses</span>
            <span className="font-bold text-ink">{businesses}</span>
          </li>
          <li className="flex justify-between">
            <span>Chain blocklist</span>
            <span className="font-bold text-ink">{chains}</span>
          </li>
        </ul>
      ) : (
        <p className="text-xs text-ink-soft">
          Set <code className="bg-ink/5 rounded px-1.5 py-0.5">DATABASE_URL</code>{" "}
          in <code className="bg-ink/5 rounded px-1.5 py-0.5">.env.local</code>{" "}
          and run <code className="bg-ink/5 rounded px-1.5 py-0.5">pnpm db:push</code>.
        </p>
      )}
    </div>
  );
}
