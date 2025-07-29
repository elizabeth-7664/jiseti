/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Jiseti blue
        danger: "#DC2626",  // For red-flags
        success: "#16A34A", // For resolved
        warning: "#F59E0B", // For 'under investigation'
      },
    },
  },
  plugins: [],
}
