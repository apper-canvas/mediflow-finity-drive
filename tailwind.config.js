/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2B6CB0",
        secondary: "#4299E1",
        accent: "#38B2AC",
        success: "#48BB78",
        warning: "#ED8936",
        error: "#F56565",
        info: "#4299E1"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}