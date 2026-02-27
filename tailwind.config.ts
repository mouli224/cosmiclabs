import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: "#000000",
          white: "#ffffff",
          offwhite: "#f0f0f0",
          gray: "#888888",
          muted: "#333333",
          glow: "rgba(255,255,255,0.08)",
          accent: "rgba(255,255,255,0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "infinity-draw": "infinityDraw 3s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-medium": "floatMedium 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.8s ease forwards",
      },
      keyframes: {
        infinityDraw: {
          "0%": { strokeDashoffset: "1000" },
          "50%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-1000" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-15px) translateX(8px)" },
          "66%": { transform: "translateY(8px) translateX(-5px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
