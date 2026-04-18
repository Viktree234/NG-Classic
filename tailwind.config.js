/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50:  '#fff1f5',
          100: '#ffe4ec',
          200: '#fecdd9',
          300: '#fda4ba',
          400: '#fb7097',
          500: '#f43f72',
          600: '#e11d55',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        'surface-strong': 'var(--surface-soft-strong)',
        'page-bg': 'var(--page-bg)',
        'page-bg-secondary': 'var(--page-bg-secondary)',
        'text-heading': 'var(--text-heading)',
        'text-heading-strong': 'var(--text-heading-strong)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-default': 'var(--border-default)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};