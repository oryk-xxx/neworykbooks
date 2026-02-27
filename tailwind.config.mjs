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
        foreground: "#FFFFFF",
        surface: {
          primary: "#050505",
          hover: "#0A0A0A",
          active: "#121212"
        },
        accent: {
          DEFAULT: "#2BFF88",
          muted: "rgba(43, 255, 136, 0.1)"
        },
        text: {
          secondary: "rgba(255, 255, 255, 0.70)",
          meta: "rgba(255, 255, 255, 0.35)"
        },
        borderSubtle: "rgba(255, 255, 255, 0.08)"
      },
      boxShadow: {
        oryk: "0 20px 50px rgba(0, 0, 0, 0.8)",
        glow: "0 0 20px rgba(43, 255, 136, 0.15)"
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        oryk: "0.15em",
        "oryk-wide": "0.25em"
      },
      transitionDuration: {
        DEFAULT: "250ms"
      }
    }
  },
  plugins: []
};

export default config;

