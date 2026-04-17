// Circular "VERIFIED" stamp for business cards.
// Looks like an inked rubber stamp — slightly rotated, text around the edge.

export default function VerifiedStamp({ size = 64, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="Verified"
      role="img"
    >
      <defs>
        <path
          id="stamp-arc"
          d="M 50 50 m -34 0 a 34 34 0 1 1 68 0 a 34 34 0 1 1 -68 0"
        />
      </defs>
      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="#5F6F51"
        strokeWidth="1.6"
        opacity="0.85"
      />
      {/* Inner ring */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="#5F6F51"
        strokeWidth="0.9"
        opacity="0.6"
      />
      {/* Checkmark in center */}
      <path
        d="M 38 52 L 47 61 L 64 42"
        stroke="#5F6F51"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Text along the arc */}
      <text
        fill="#5F6F51"
        fontFamily="Inter, sans-serif"
        fontSize="8"
        fontWeight="600"
        letterSpacing="2"
      >
        <textPath href="#stamp-arc" startOffset="6%">
          · VERIFIED · OWNER · VERIFIED ·
        </textPath>
      </text>
    </svg>
  );
}
