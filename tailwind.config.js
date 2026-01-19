/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D50032',
        secondary: '#79001C',
        charcoal: '#111111',
        softBlack: '#1A1A1A',
        ivory: '#FAF9F6',
        lightGray: '#E5E5E5',
        mutedGray: '#7A7A7A',
        errorRed: '#E63946',
        successGreen: '#2A9D8F',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
