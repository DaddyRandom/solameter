/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solameter-red': '#FF0000',
        'solameter-dark': '#0A0A0A',
        'simpsons-yellow': '#FFD90F',
        'simpsons-blue': '#87CEEB',
      },
      fontFamily: {
        'racing': ['"Racing Sans One"', 'cursive'],
        'mono': ['"Roboto Mono"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gauge-sweep': 'gauge-sweep 2s ease-out',
      },
      keyframes: {
        'gauge-sweep': {
          '0%': { transform: 'rotate(-90deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
