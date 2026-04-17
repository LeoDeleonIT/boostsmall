// Hand-drawn wavy underline beneath the word "home" in the hero headline.
// Deliberately imperfect — each bump slightly different height.

export default function Squiggle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 8 C 20 2, 40 12, 60 7 S 100 2, 120 9 S 160 3, 180 8 S 210 11, 218 6"
        stroke="#C4622D"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
