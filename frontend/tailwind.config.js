/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#334E68',
          600: '#243B53',
          700: '#1E3E62',
          800: '#102A43',
          900: '#0B192C',
          950: '#050D18'
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E8',
          200: '#F4E5C7',
          300: '#EBD19E',
          400: '#DFB86C',
          500: '#D4AF37', // Primary warm gold
          600: '#C59B27',
          700: '#A17B1B',
          800: '#7E5E16',
          900: '#5E4513'
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FCFBF9',
          200: '#FAF9F6',
          300: '#F3EFEA',
          400: '#E7E0D8'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 25, 44, 0.05)',
        'card': '0 10px 25px -5px rgba(11, 25, 44, 0.08), 0 8px 10px -6px rgba(11, 25, 44, 0.04)',
        'gold': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
