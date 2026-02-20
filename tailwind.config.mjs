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
        background: "#050509",
        foreground: "#f5f5f5",
        accent: "#7b5cff",
        accentMuted: "#2c2344",
        borderSubtle: "#262637"
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"],
        display: ["system-ui", "ui-sans-serif", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

