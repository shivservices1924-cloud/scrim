/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rush: {
          dark: '#0b0e14',
          darker: '#06080c',
          card: '#121620',
          cardLight: '#1a202e',
          cardHover: '#20283a',
          border: '#1f2738',
          gold: '#F5C400',
          goldLight: '#FFD000',
          goldDark: '#C68A00',
          goldGlow: 'rgba(245, 196, 0, 0.35)',
          green: '#10b981',
          red: '#ef4444',
          textMuted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Rajdhani', 'sans-serif']
      }
    },
  },
  plugins: [],
}
