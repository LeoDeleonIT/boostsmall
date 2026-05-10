// Tiny inline SVG icon set. Stays in step with the brand stroke (rounded
// linecaps, friendly proportions) and avoids pulling in a heavier icon lib.

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function ChevronDown({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Search({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

export function MapPin({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function Utensils({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 2v7a3 3 0 0 0 6 0V2M6 9v13" />
      <path d="M14 2c0 4 1 6 4 6v14M18 2v6" />
    </svg>
  );
}

export function House({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function Car({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 13 7 7h10l2 6" />
      <rect x="3" y="13" width="18" height="6" rx="2" />
      <circle cx="7" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

export function Sparkles({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
    </svg>
  );
}

export function Palette({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 21a9 9 0 1 1 9-9 4 4 0 0 1-4 4h-2a2 2 0 0 0-2 2 3 3 0 0 1-1 3z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShoppingBag({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 7h14l-1 13H6z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function MoreHorizontal({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="6" cy="12" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
      <circle cx="18" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}
