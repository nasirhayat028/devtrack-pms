/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0D10',
          soft: '#14171C',
          card: '#171A1F',
          border: '#262B33',
        },
        parchment: {
          DEFAULT: '#EDEAE3',
          dim: '#9AA0A6',
        },
        gilt: {
          DEFAULT: '#C9A227',
          bright: '#E4C158',
          dim: '#8A711D',
        },
        emerald: {
          DEFAULT: '#1F7A5C',
          bright: '#2FA57D',
        },
        rust: {
          DEFAULT: '#B3543A',
          bright: '#D06E4F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(201,162,39,0.08), 0 20px 40px -20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
