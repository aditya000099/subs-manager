/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff0000', // red
        background: '#000000', // black
        textPrimary: '#ffffff', // white
        textSecondary: '#ff0000', // red
      },
    },
  },
  plugins: [],
}

