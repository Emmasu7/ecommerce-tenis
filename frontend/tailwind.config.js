/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#ffe8d6",
          100: "#ffd6b3",
          200: "#ffb380",
          300: "#ff9157",
          400: "#ff7c3a",
          500: "#F97316",
          600: "#dc5c0a",
          700: "#b84708",
          800: "#8e3706",
          900: "#6b2904",
        },
      },
    },
  },
};
