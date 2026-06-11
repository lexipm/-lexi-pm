/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        almond: {
          green: '#1A6B4A',
          'green-light': '#2A8A60',
          'green-dim': '#E8F4EF',
          dark: '#0D1F17',
          mid: '#1C3829',
        },
      },
    },
  },
  plugins: [],
}
