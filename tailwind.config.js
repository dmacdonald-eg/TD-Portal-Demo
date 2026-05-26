/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        severity: {
          high: '#ef4444',
          medium: '#f97316',
          low: '#eab308',
          info: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
