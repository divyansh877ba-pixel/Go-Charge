/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F1E8',
        dark: {
          bg: '#081917',
          surface: '#0D2422',
          card: '#112D2B',
          cardElevated: '#163836',
          border: '#1E4844',
          borderSubtle: '#183A37',
          text: '#E4EFEA',
          muted: '#81A39E',
        },
        sand: {
          light: '#FAF8F3',
          DEFAULT: '#F4F1E8',
          dark: '#EAE5D7',
        },
        teal: {
          deep: '#123C3A',
          vibrant: '#19C7B1',
          aqua: '#2DBDB5',
          darkHover: '#0E2E2C',
          light: '#E2F7F4',
        },
        surface: {
          DEFAULT: '#E9EFE7',
          card: '#E9EFE7',
          elevated: '#FFFFFF',
          glass: 'rgba(233, 239, 231, 0.82)',
          glassHover: 'rgba(255, 255, 255, 0.92)',
          sandGlass: 'rgba(244, 241, 232, 0.88)',
          light: '#FFFFFF',
        },
        border: {
          DEFAULT: '#D9DED5',
          muted: '#E5EAE1',
          dark: '#B8C2B3',
        },
        primary: {
          DEFAULT: '#19C7B1',
          dim: '#15A896',
          dark: '#123C3A',
          glow: 'rgba(25, 199, 177, 0.35)',
          glowStrong: 'rgba(25, 199, 177, 0.55)',
        },
        status: {
          available: '#22C55E',
          active: '#19C7B1',
          busy: '#EF4444',
          busyMuted: '#9CA3AF',
          warning: '#F59E0B',
          neutral: '#D9DED5',
        },
        text: {
          primary: '#14201F',
          deep: '#123C3A',
          muted: '#5E716E',
          subtle: '#7A8C89',
          light: '#FFFFFF',
        },
        accent: {
          blue: '#2DBDB5',
          aqua: '#2DBDB5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'pill': '20px',
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(25, 199, 177, 0.35)',
        'glow-teal-sm': '0 0 10px rgba(25, 199, 177, 0.25)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.35)',
        'glow-green-sm': '0 0 10px rgba(34, 197, 94, 0.25)',
        'card-subtle': '0 4px 20px rgba(18, 60, 58, 0.06)',
        'card-hover': '0 8px 30px rgba(18, 60, 58, 0.12)',
        'glass': '0 8px 32px 0 rgba(18, 60, 58, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.04)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
