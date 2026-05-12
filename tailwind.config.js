/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Frank Ruhl Libre"', 'Georgia', 'serif'],
        display: ['"Frank Ruhl Libre"', 'Georgia', 'serif'],
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#FFFFFF',
          light: '#FBFAF7',
          dark: '#F2F0EA',
        },
        ink: {
          DEFAULT: '#1B1714',
          soft: '#3A332C',
          mute: '#7B7264',
          line: '#E0DCD3',
        },
        petrol: {
          DEFAULT: '#1A5868',
          soft: '#2C7689',
          deep: '#0F3D49',
          ghost: '#DDE9ED',
          tint: '#EEF5F7',
        },
        brick: {
          DEFAULT: '#B85C38',
          soft: '#D17B58',
          deep: '#923F1F',
          ghost: '#F4E3D9',
          tint: '#F9EFE7',
        },
        forest: {
          DEFAULT: '#2F5D3F',
          soft: '#4A7A5A',
          ghost: '#DCE7DF',
          tint: '#EBF2EC',
        },
        ochre: {
          DEFAULT: '#A8761E',
          soft: '#C99244',
          ghost: '#F2E5C9',
          tint: '#F8EFD8',
        },
        oxblood: {
          DEFAULT: '#7A2929',
          soft: '#9C3838',
          ghost: '#F1E0E0',
          tint: '#F8ECEC',
        },
      },
      letterSpacing: {
        widish: '0.08em',
        wider2: '0.16em',
        wider3: '0.22em',
      },
      borderRadius: {
        none: '0',
        DEFAULT: '2px',
        sm: '1px',
        md: '4px',
        lg: '6px',
      },
      boxShadow: {
        ink: '4px 4px 0 0 #1B1714',
        'ink-sm': '2px 2px 0 0 #1B1714',
        'ink-xs': '1px 1px 0 0 #1B1714',
        petrol: '4px 4px 0 0 #1A5868',
        'petrol-sm': '2px 2px 0 0 #1A5868',
        soft: '0 1px 0 0 #E0DCD3',
        card: '0 1px 2px 0 rgba(27,23,20,0.04), 0 4px 14px -6px rgba(27,23,20,0.07)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'rule-in': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.2,0.7,0.2,1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'rule-in': 'rule-in 0.6s cubic-bezier(0.4,0,0.2,1) both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.2,0.7,0.2,1) both',
      },
    },
  },
  plugins: [],
};
