import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-0": "var(--color-surface-0)",
        "surface-1": "var(--color-surface-1)",
        "surface-light": "var(--color-surface-light)",
        "text-primary-dark": "var(--color-text-primary-dark)",
        "text-primary-light": "var(--color-text-primary-light)",
        "text-muted": "var(--color-text-muted)",
        "line-subtle": "var(--color-line-subtle)",
        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem,10vw,8rem)", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem,7vw,5.5rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem,5vw,3.5rem)", { lineHeight: "1", letterSpacing: "-0.01em" }],
        "editorial-lg": ["clamp(1.25rem,3vw,2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "editorial-base": ["clamp(1rem,2vw,1.25rem)", { lineHeight: "1.5" }],
      },
      spacing: {
        "section-sm": "clamp(3rem,8vw,6rem)",
        "section-md": "clamp(5rem,12vw,10rem)",
        "section-lg": "clamp(8rem,18vw,16rem)",
      },
      screens: {
        "360": "360px",
        "430": "430px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      transitionTimingFunction: {
        "ease-reveal": "cubic-bezier(0.22, 1, 0.36, 1)",
        "ease-in-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 1.2s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
