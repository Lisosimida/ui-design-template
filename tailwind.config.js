/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        display: ['var(--font-display)', 'monospace'],
        heading: ['var(--font-heading)', 'sans-serif'],
        hand: ['var(--font-hand)', 'cursive'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          cream: '#F5F1E8',
          desk: '#E7E4DC',
          ink: '#141414',
        },
        accent: {
          yellow: '#FFC63D',
          pink: '#FF7AA8',
          mint: '#3DDC97',
          blue: '#5B8DEF',
          orange: '#FB7A3C',
        },
      },
    },
  },
  plugins: [],
}
