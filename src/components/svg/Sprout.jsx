// Small abstract sprout growing from the "o" in "boost" in the wordmark.
// Two leaves and a stem — the only decorative SVG in the nav.

export default function Sprout({ size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 13 V6"
        stroke="#7A8B69"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M7 7 C5 6, 3.5 4, 3.5 2.5 C5 2.5, 6.5 4, 7 6"
        fill="#7A8B69"
        opacity="0.9"
      />
      <path
        d="M7 5 C8.5 4.5, 10 3, 10 2 C9 1.8, 7.8 3, 7 4.8"
        fill="#7A8B69"
        opacity="0.75"
      />
    </svg>
  );
}
