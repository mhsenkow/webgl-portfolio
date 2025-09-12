import type { Config } from 'tailwindcss'
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.06)'
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.4)'
      },
      animation: {
        'cardExpand': 'cardExpand 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'cardContract': 'cardContract 0.3s ease-in forwards',
        'cardExpandFullscreen': 'cardExpandFullscreen 1s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'float': 'float 2s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite'
      },
      keyframes: {
        cardExpand: {
          '0%': {
            transform: 'scale(0.1) rotateX(15deg)',
            opacity: '0.1',
          },
          '50%': {
            transform: 'scale(1.05) rotateX(0deg)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1) rotateX(0deg)',
            opacity: '1',
          }
        },
        cardContract: {
          '0%': {
            transform: 'scale(1) rotateX(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(0.1) rotateX(-15deg)',
            opacity: '0.1',
          }
        },
        cardExpandFullscreen: {
          '0%': {
            transform: 'scale(0.1) rotateX(15deg)',
            opacity: '0.1',
            borderRadius: '8px',
            width: '160px',
            height: '100px',
          },
          '30%': {
            transform: 'scale(0.3) rotateX(5deg)',
            opacity: '0.3',
            borderRadius: '6px',
          },
          '70%': {
            transform: 'scale(1.1) rotateX(0deg)',
            opacity: '0.8',
            borderRadius: '2px',
          },
          '100%': {
            transform: 'scale(1) rotateX(0deg)',
            opacity: '1',
            borderRadius: '0px',
            width: '100vw',
            height: '100vh',
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-2px)',
          }
        }
      }
    }
  },
  plugins: []
} satisfies Config
