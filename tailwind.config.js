/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'neutral-850': '#1e1e23',
        'neutral-750': '#2c2c32',
      }
    },
  },
  plugins: [],
}
