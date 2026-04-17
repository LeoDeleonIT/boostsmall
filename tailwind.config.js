/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F2EA",
          dark: "#EFE8DB",
        },
        terracotta: {
          DEFAULT: "#C4622D",
          dark: "#A14F20",
        },
        brick: "#8B3A1F",
        sage: {
          DEFAULT: "#7A8B69",
          dark: "#5F6F51",
        },
        ochre: "#D9A85F",
        ink: {
          DEFAULT: "#2A2520",
          soft: "#5C544B",
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      boxShadow: {
        "warm-sm": "0 2px 8px rgba(42, 37, 32, 0.06)",
        "warm-md": "0 6px 20px rgba(42, 37, 32, 0.08)",
        "warm-lg": "0 12px 32px rgba(139, 58, 31, 0.10)",
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        meta: "0.05em",
      },
    },
  },
  plugins: [],
};
