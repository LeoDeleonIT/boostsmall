// Subtle paper-grain overlay for the whole page.
// Mounted once in App.jsx — sits above background, below content.
// ~3% opacity feTurbulence noise, doesn't capture pointer events.

export default function PaperTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-paper"
    />
  );
}
