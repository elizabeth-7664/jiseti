/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial!
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E86AB",
        accent: "#F26419",
        secondary: "#144552",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar'), // you're using `scrollbar-thin`
  ],
}
