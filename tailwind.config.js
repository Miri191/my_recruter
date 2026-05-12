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
          DEFAULT: '#F2EBDB',
          light: '#F8F2E2',
          dark: '#E8DFC8',
        },
        ink: {
          DEFAULT: '#1B1714',
          soft: '#3A332C',
          mute: '#7B7264',
          line: '#C9BFA9',
        },
        oxblood: {
          DEFAULT: '#7A2929',
          soft: '#9C3838',
          ghost: '#F1E5E5',
        },
        sage: {
          DEFAULT: '#4F6B47',
          soft: '#6F8765',
          ghost: '#E4EBDF',
        },
        ochre: {
          DEFAULT: '#B07A2A',
          soft: '#C99244',
          ghost: '#F2E8D2',
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
      },
      boxShadow: {
        ink: '4px 4px 0 0 #1B1714',
        'ink-sm': '2px 2px 0 0 #1B1714',
        soft: '0 1px 0 0 #C9BFA9',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.10 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
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
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.2,0.7,0.2,1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'rule-in': 'rule-in 0.6s cubic-bezier(0.4,0,0.2,1) both',
      },
    },
  },
  plugins: [],
};
