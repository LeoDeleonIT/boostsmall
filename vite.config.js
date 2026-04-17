import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base path for GitHub Pages (served from /boostsmall/ under the user domain).
// Falls back to "/" for local dev and non-Pages deploys like Vercel/Netlify.
const base = process.env.GITHUB_PAGES === "true" ? "/boostsmall/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
});
