/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          rich: '#0A0A0A',
          alt: '#111111',
          soft: '#0F0F0F',
        },
        whatsapp: '#25D366',
        teal: {
          DEFAULT: '#0AFFE6',
          50: '#E6FFFC',
          100: '#CCFFF9',
          200: '#99FFF3',
          300: '#66FFED',
          400: '#33FFE7',
          500: '#0AFFE6',
          600: '#00CDB7',
          700: '#009B88',
          800: '#006959',
          900: '#00372E',
        },
        navy: {
          DEFAULT: '#0A1628',
          50: '#E8EBF0',
          100: '#D1D7E1',
          200: '#A3AFC3',
          300: '#7587A5',
          400: '#475F87',
          500: '#1A3869',
          600: '#0D1D3E',
          700: '#0A1628',
          800: '#070F1B',
          900: '#03080E',
        },
        mint: '#F0FFFE',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-teal': 'pulse-teal 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-teal': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(10, 255, 230, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(10, 255, 230, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(720deg)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
