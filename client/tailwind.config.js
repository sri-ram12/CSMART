/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#DC2626',
          crimson: '#E11D48',
          redLight: '#FEE2E2',
          redDark: '#991B1B',
          redDeep: '#7F1D1D',
          white: '#FFFFFF',
          offwhite: '#F8FAFC',
          surface: '#F1F5F9',
          border: '#E2E8F0',
          dark: '#0F172A',
          charcoal: '#1E293B',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -4px rgba(220, 38, 38, 0.25)',
        'glow-lg': '0 0 50px -8px rgba(220, 38, 38, 0.35)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 12px 35px -4px rgba(220, 38, 38, 0.12)',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
