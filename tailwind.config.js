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
          dark: '#080210',
          darker: '#040108',
          card: '#10051e',
          cardLight: '#1b0a33',
          purple: '#9333ea',
          purpleAccent: '#a855f7',
          purpleGlow: '#c084fc',
          magenta: '#d946ef',
          blue: '#1d4ed8',
          blueAccent: '#3b82f6',
          cyan: '#06b6d4',
          gold: '#eab308',
          goldLight: '#fde047',
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
