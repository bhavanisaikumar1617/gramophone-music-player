/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gramophone: {
          bg: '#090B13',
          'bg-secondary': '#101522',
          card: '#151C2E',
          accent: '#A970FF',
          'accent-secondary': '#7C5CFC',
          text: '#FFFFFF',
          'text-secondary': '#AAB2C8',
          muted: '#7D8497',
          success: '#39D98A',
          border: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        display: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'sans-serif',
        ],
        sans: [
          '"SF Pro Display"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        hero: ['4rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'section-title': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      borderRadius: {
        card: '1.125rem',
        pill: '9999px',
      },
      boxShadow: {
        glow: '0 0 60px rgba(169, 112, 255, 0.25)',
        'glow-sm': '0 0 24px rgba(169, 112, 255, 0.18)',
        card: '0 8px 32px rgba(0, 0, 0, 0.35)',
        float: '0 24px 64px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        glass: '20px',
      },
      maxWidth: {
        content: '87.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
