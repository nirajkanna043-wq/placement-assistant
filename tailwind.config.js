/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1F23',
        panel: '#22282E',
        parchment: '#FAF7F0',
        paper: '#F1ECDF',
        runway: '#2F6F6F',
        runwayDark: '#20504F',
        amber: '#D9A441',
        rust: '#B4532A',
        line: '#DDD5C2',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
};
