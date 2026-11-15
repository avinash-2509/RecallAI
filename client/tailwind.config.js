/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: { ink: '#18181B', muted: '#71717A', primary: '#4F46E5', teal: '#0F766E' },
      boxShadow: { soft: '0 1px 2px rgba(24, 24, 27, .04), 0 8px 30px rgba(24, 24, 27, .04)' }
    }
  },
  plugins: []
};
