// Display formatters used across pages.

export function priceLabel(tier: 1 | 2 | 3 | 4 | number): string {
  return "$".repeat(Math.max(1, Math.min(4, Math.round(tier))));
}

export function categoryLabel(cat: string): string {
  switch (cat) {
    case "FOOD_DRINK":
      return "Food & Drink";
    case "RETAIL":
      return "Retail";
    case "SERVICES":
      return "Services";
    case "HEALTH_BEAUTY":
      return "Health & Beauty";
    case "ARTS":
      return "Arts";
    default:
      return "Other";
  }
}

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABEL: Record<(typeof DAY_ORDER)[number], string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export function formatHours(
  hours: Record<string, Array<{ open: string; close: string }>> | undefined
): Array<{ day: string; label: string }> {
  if (!hours) return [];
  return DAY_ORDER.map((d) => {
    const slots = hours[d];
    if (!slots || slots.length === 0) {
      return { day: DAY_LABEL[d], label: "Closed" };
    }
    return {
      day: DAY_LABEL[d],
      label: slots.map((s) => `${s.open}–${s.close}`).join(", "),
    };
  });
}

export function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function formatPhone(p?: string): string {
  if (!p) return "";
  const d = p.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return p;
}
