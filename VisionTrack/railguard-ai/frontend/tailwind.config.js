/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rail: {
          dark: "#0b1220",
          panel: "#121a2b",
          accent: "#22d3ee",
          danger: "#f43f5e",
          warning: "#f59e0b",
          safe: "#22c55e",
        },
      },
    },
  },
  plugins: [],
}
