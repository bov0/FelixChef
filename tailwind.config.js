/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
        warm: '0 18px 50px rgba(84, 46, 24, 0.12)'
      },
      colors: {
        spice: {
          50: '#fff6ef',
          100: '#ffe8d6',
          300: '#f0b58a',
          500: '#bf5a2b',
          700: '#8b3d1b',
          900: '#52220f'
        }
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', '"Segoe UI"', 'sans-serif']
      }
    }
  },
  plugins: []
};
