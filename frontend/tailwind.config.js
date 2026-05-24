/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0F172A",
        glacier: "#2FD9F4",
        aurora: "#DDB7FF",
        ink: "#E0E3E5",
        navy: "#0F172A",
        ice: {
          50: "#F4FBFF",
          100: "#DDF7FF",
          200: "#A2EEFF",
          300: "#61E4FA",
          400: "#2FD9F4",
          500: "#0AA8C2",
        },
        violet: {
          300: "#F0DBFF",
          400: "#DDB7FF",
          500: "#B970FF",
          600: "#8F35E7",
        },
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      boxShadow: {
        frost: "0 24px 80px rgba(7, 12, 30, 0.32)",
      },
    },
  },
  plugins: [],
};
