/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Tipografía: Inter (autoalojada, ver src/index.css) con una pila de sistema
      // moderna como respaldo (Segoe UI Variable en Windows 11, system-ui en
      // Apple, Roboto en Android). Garantiza un render coherente y un buen aspecto
      // aunque Inter no cargue (p. ej. en el artefacto, que no incluye la fuente).
      fontFamily: {
        sans: [
          '"Inter Variable"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI Variable"',
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
      },
    },
  },
  plugins: [],
};
