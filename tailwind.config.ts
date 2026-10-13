import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        krishi: {
          // Blueprint Brand Palette
          deepGreen: "#185C37",
          warmIvory: "#F7F5EE",
          leafGreen: "#A9C98C",
          earthBrown: "#B97846",

          // Tonal shades for UI hierarchy
          primary: {
            50: "#EAF4EE",
            100: "#D5EADA",
            200: "#ABD5B5",
            300: "#81C090",
            400: "#49965E",
            500: "#185C37", // Main Brand Primary
            600: "#144D2E",
            700: "#0F3D24",
            800: "#0B2C1A",
            900: "#071C11",
          },
          accent: {
            50: "#FBF3ED",
            100: "#F7E6DA",
            200: "#EECDB5",
            300: "#E5B390",
            400: "#D38C5B",
            500: "#B97846", // Main Brand Accent (Earth brown)
            600: "#9E6438",
            700: "#7F4E2B",
            800: "#5F3A20",
          },
          leaf: {
            50: "#F4F8F0",
            100: "#E8F2E2",
            200: "#D1E5C4",
            300: "#A9C98C", // Main Brand Highlight (Leaf green)
            400: "#8BB56B",
            500: "#719B51",
          },
          ivory: {
            50: "#FCFBF8",
            100: "#F7F5EE", // Main Brand Background (Warm ivory)
            200: "#EEE9DC",
            300: "#E1D9C5",
            400: "#CFC3A7",
          },
          surface: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E5DFC9",
          textMain: "#182A1E",
          textMuted: "#526858",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(24, 92, 55, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px rgba(24, 92, 55, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        floating: "0 10px 25px -5px rgba(24, 92, 55, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
