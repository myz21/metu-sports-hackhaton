/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0d1b3f",
        ice: {
          50: "#f8fcff",
          100: "#eef8ff",
          200: "#d8f0ff",
          300: "#b9e3fb",
          400: "#90caeb",
          500: "#68add7",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      boxShadow: {
        frost: "0 26px 80px rgba(13, 27, 63, 0.12)",
      },
    },
  },
  plugins: [],
};
