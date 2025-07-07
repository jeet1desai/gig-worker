module.exports = {
  content: ['./app/**/*.{ts,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['var(--font-outfit)'],
        sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui'],
        heading: ['"Inter"', 'sans-serif'],
      },

      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-fast': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
