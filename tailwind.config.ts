import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        primary: "#0d1117",
        secondary: "#161b22",
        tertiary: "#010409",
        highlight: "#30363d",
      },
    },
  },
  plugins: [],
} satisfies Config;
