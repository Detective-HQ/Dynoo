import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: "#045357",
        stone: "#EDECEA",
        mint: "#D6EFEB",
        ink: "#202C2C",
        line: "#D8DAD5",
        paper: "#F8F8F5",
      },
      fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] },
      letterSpacing: { editorial: "-0.075em" },
    },
  },
  plugins: [],
} satisfies Config;
