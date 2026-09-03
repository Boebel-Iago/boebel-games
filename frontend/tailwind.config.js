/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          600: '#16a34a',
          800: '#166534',
          900: '#0f2e21', // Verde escuro principal para botões e elementos de destaque
          950: '#081c15', // Tom ainda mais profundo para fundos escuros
        }
      }
    },
  },
  plugins: [],
}