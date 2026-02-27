/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "rgba(255, 255, 255, 0.95)",
        surface: {
          primary: "rgba(255, 255, 255, 0.03)",
          hover: "rgba(255, 255, 255, 0.06)",
          active: "rgba(255, 255, 255, 0.08)"
        },
        primary: {
          DEFAULT: "hsl(153, 100%, 58%)",
          muted: "hsla(153, 100%, 58%, 0.1)"
        },
        accent: {
          DEFAULT: "hsl(153, 100%, 58%)",
          muted: "hsla(153, 100%, 58%, 0.1)"
        },
        text: {
          primary: "rgba(255, 255, 255, 0.95)",
          secondary: "rgba(255, 255, 255, 0.55)",
          tertiary: "rgba(255, 255, 255, 0.40)",
          meta: "rgba(255, 255, 255, 0.40)"
        },
        borderSubtle: "rgba(255, 255, 255, 0.06)"
      },
      boxShadow: {
        oryk: "0 20px 50px rgba(0, 0, 0, 0.8)",
        glow: "0 0 20px hsla(153, 100%, 58%, 0.15)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"]
      },
      letterSpacing: {
        oryk: "0.15em",
        "oryk-wide": "0.4em",
        tight: "-0.02em"
      },
      transitionDuration: {
        DEFAULT: "250ms"
      }
    }
  },
  plugins: []
};

export default config;

