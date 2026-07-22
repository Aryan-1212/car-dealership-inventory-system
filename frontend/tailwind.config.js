/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'showroom-navy': '#12203A',
        'warehouse-slate': '#1B2A47',
        'dealer-brass': '#C9A25D',
        'chalk': '#E9ECF2',
        'stock-green': '#4C9A6A',
        'sold-red': '#D64545',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
