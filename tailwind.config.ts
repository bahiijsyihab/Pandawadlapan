import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#160A2C",
        abyss: "#2E1065",
        alabaster: "#F8F7F4",
        royal: "#5B21B6",
        orchid: "#C58BF2",
        periwinkle: "#7B92F8",
        gold: { DEFAULT: "#F7D046", soft: "#FBE38A", deep: "#C99A1A" },
        aqua: "#5CE1E6",
        ink: "#1E293B",
        muted: "#64748B",
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "modal-in": {
          from: { opacity: "0", transform: "translateY(18px) scale(.98)" },
          to: { opacity: "1", transform: "none" },
        },
        "panel-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        "orbit-tilt": {
          from: { transform: "rotateX(var(--tilt, 72deg)) rotateZ(0deg)" },
          to: { transform: "rotateX(var(--tilt, 72deg)) rotateZ(360deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        eq: {
          "0%,100%": { transform: "scaleY(.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in .3s ease-out both",
        "modal-in": "modal-in .45s cubic-bezier(.2,.8,.2,1) both",
        "panel-in": "panel-in .5s cubic-bezier(.2,.8,.2,1) both",
        "orbit-slow": "orbit-tilt 18s linear infinite",
        "orbit-fast": "orbit-tilt 11s linear infinite reverse",
        float: "float 6s ease-in-out infinite",
        eq: "eq 1s ease-in-out infinite",
        "scroll-dot": "scroll-dot 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
