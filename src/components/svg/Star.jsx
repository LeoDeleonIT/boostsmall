// Custom 5-point star with slightly irregular edges — hand-drawn feel.
// Used in the business card rating row and testimonial cards.

export default function Star({ size = 14, filled = true, className = "" }) {
  const fill = filled ? "#D9A85F" : "none";
  const stroke = "#D9A85F";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.6"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Slightly irregular point coordinates: hand-drawn wobble */}
      <path d="M12 2.3 L14.7 8.8 L21.6 9.6 L16.4 14.3 L17.9 21.1 L12 17.7 L6.2 21.2 L7.5 14.4 L2.3 9.5 L9.3 8.7 Z" />
    </svg>
  );
}
