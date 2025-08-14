/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      height: {
        'screen-mobile': ['100vh', '100dvh'],
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      minHeight: {
        'screen-mobile': ['100vh', '100dvh'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.mobile-fullscreen': {
          '@media (max-width: 768px)': {
            height: '100vh',
            height: '100dvh',
            width: '100vw',
            position: 'fixed',
            top: '0',
            left: '0',
            'overflow-y': 'auto',
            '-webkit-overflow-scrolling': 'touch',
          }
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.prevent-zoom': {
          'touch-action': 'manipulation',
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          'user-select': 'none',
          '-webkit-tap-highlight-color': 'transparent'
        },
        '.mobile-touch-optimized': {
          '-webkit-overflow-scrolling': 'touch',
          '-webkit-user-select': 'none',
          'user-select': 'none',
          '-webkit-touch-callout': 'none',
          '-webkit-tap-highlight-color': 'transparent',
          'touch-action': 'manipulation'
        },
        '.mobile-viewport-height': {
          'height': 'var(--viewport-height) !important',
          'min-height': 'var(--viewport-height) !important'
        }
      }
      addUtilities(newUtilities)
    }
  ],
}

