/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lilac / Lavender & Royal Violet Theme Palette (from Pinterest reference)
        lavender: {
          50: '#FAF7FD',
          100: '#F3EBFA',
          200: '#E6D5F7',
          300: '#D4BAF2',
          400: '#BA92EB',
          500: '#9F6CE2',
          600: '#8347D4',
          700: '#6B28C2',
          800: '#571EA8',
          900: '#451887',
          950: '#2A0B59',
        },
        violet: {
          DEFAULT: '#5B21B6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        fashion: {
          primary: '#5B21B6',
          primaryHover: '#4C1D95',
          lavender: '#D8B4F8',
          lavenderLight: '#F3E8FF',
          lavenderBg: '#F9F5FF',
          surface: '#FFFFFF',
          dark: '#1E1B2E',
          muted: '#6B7280',
          badge: '#4C1D95',
          star: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        lavender: '0 4px 25px -4px rgba(107, 33, 168, 0.08)',
        'lavender-lg': '0 12px 35px -6px rgba(107, 33, 168, 0.16)',
        purple: '0 8px 30px -4px rgba(91, 33, 182, 0.25)',
        card: '0 4px 20px -2px rgba(107, 33, 168, 0.05)',
        'card-hover': '0 12px 35px -4px rgba(107, 33, 168, 0.12)',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
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
