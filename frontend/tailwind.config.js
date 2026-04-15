/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#1E3A5F",
        },
        gold: {
          50: "#fdf9ef",
          100: "#f9f0d9",
          200: "#f3e0b3",
          300: "#e9c97a",
          400: "#C9A962",
          500: "#b8944d",
          600: "#9a7639",
          700: "#7d5c30",
          800: "#664a2c",
          900: "#553e28",
        },
        dark: "#2D2D2D",
        light: "#F8F9FA",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
};
