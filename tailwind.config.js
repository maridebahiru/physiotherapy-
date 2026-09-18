/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#f2f8f6',
          100: '#e1efeb',
          200: '#c5e0d7',
          300: '#9cc9bb',
          400: '#6ea99a',
          500: '#468b7c',
          600: '#2f6f62',
          700: '#25594e',
          800: '#1c443b',
          900: '#132e27',
          950: '#091a16',
        },
        ochre: {
          50: '#fdf9f0',
          100: '#f8efd8',
          200: '#f2dcae',
          300: '#e8c27a',
          400: '#db9e4b',
          500: '#c88a35',
          600: '#b2762a',
          700: '#8e5624',
          800: '#734423',
          900: '#603921',
          950: '#371c0f',
        },
        parchment: {
          50: '#faf8f5',
          100: '#f4efe6',
          200: '#e7dfd1',
          300: '#d5c6b1',
          400: '#beaa8e',
          500: '#aa9275',
          600: '#92795f',
          700: '#76604c',
          800: '#625042',
          900: '#524339',
          950: '#2b221d',
        },
        darkpine: {
          800: '#152420',
          900: '#0e1a17',
          950: '#08110f',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(19, 46, 39, 0.08)',
        'glow-ochre': '0 0 25px -5px rgba(200, 138, 53, 0.35)',
        'glow-pine': '0 0 25px -5px rgba(47, 111, 98, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
