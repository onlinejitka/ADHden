import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        adhd: {
          bg: "#0F172A",
          card: "#1E293B",
          accent: "#38BDF8",
          warm: "#F59E0B",
          calm: "#10B981",
          softText: "#94A3B8"
        }
      }
    },
  },
  plugins: [],
};
export default config;
