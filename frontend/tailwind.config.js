/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
        swingTop: {
          '0%': { transform: 'rotate(0deg)', transformOrigin: 'top center' },
          '20%': { transform: 'rotate(-10deg)', transformOrigin: 'top center' },
          '40%': { transform: 'rotate(10deg)', transformOrigin: 'top center' },
          '60%': { transform: 'rotate(-10deg)', transformOrigin: 'top center' },
          '80%': { transform: 'rotate(10deg)', transformOrigin: 'top center' },
          '100%': { transform: 'rotate(0deg)', transformOrigin: 'top center' },
        },
        rotate180: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        pulseOnce: {
          '0%': {
            opacity: '1',
            backgroundColor: '#f3f4f6',
          },
          '20%': {
            opacity: '0.9',
            backgroundColor: '#e1e6eb',
          },
          '40%': {
            opacity: '0.8',
            backgroundColor: '#d0d6db',
          },
          '60%': {
            opacity: '0.7',
            backgroundColor: '#b9c3cc',
          },
          '80%': {
            opacity: '0.6',
            backgroundColor: '#a0b0bb',
          },
          '100%': {
            opacity: '1',
            backgroundColor: '#ffffff',
          },
        },


      },
      animation: {
        blink: 'blink 1s infinite alternate',
        swingTop: 'swingTop 1s ease-in-out infinite',
        rotate180: 'rotate180 0.5s ease-in-out',
        pulseOnce: 'pulseOnce 2.5s ease-in-out 1',
      },
      colors: {
        'gray-light': 'rgb(239,239,239)',
      },
    },
  },
  plugins: [],
}
