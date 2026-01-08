/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- THIS MAKES IT WORK
    "./src/components/**/*.{js,ts,jsx,tsx}" // <--- ADD THIS TO BE SAFE
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}