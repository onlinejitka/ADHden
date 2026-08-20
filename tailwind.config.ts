/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lexend)", "system-ui", "sans-serif"],
      },
      colors: {
        graphite: {
          base: "#121214",  // Hlavní pozadí celého webu
          card: "#18181b",  // Karta / Mobilní obal
          border: "#27272a",// Jemné ohraničení
        },
        gold: {
          DEFAULT: "#fbbf24", // Zlatavá (hlavní tlačítka, časovač, úspěchy)
        },
        petrol: {
          DEFAULT: "#2dd4bf", // Petrolejová (klidová zóna, parťák)
        },
        lavender: {
          DEFAULT: "#c084fc", // Fialová (kouskovač, kreativní prvky)
        },
      },
    },
  },
  plugins: [],
};
