/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Tipografía del Manual SEEN (0.5.0): Open Sans para el texto y los títulos (en ligera
      // y mayúsculas, como los capítulos del Manual) y Oswald, condensada, para el rótulo y
      // las etiquetas. Ambas autoalojadas (src/index.css), con pila de sistema de respaldo.
      fontFamily: {
        sans: [
          '"Open Sans Variable"',
          '"Open Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        display: [
          '"Oswald Variable"',
          "Oswald",
          '"Arial Narrow"',
          '"Roboto Condensed"',
          "ui-sans-serif",
          "sans-serif",
        ],
      },
      // Grises NEUTROS del Manual (#4E4E4E sobre #FAFAFA) en lugar del gris azulado: toda la
      // app usa `slate-*`, así que se remapea aquí en un solo sitio.
      colors: {
        slate: colors.neutral,
        seen: {
          azul: "#739DCB",
          "azul-osc": "#3F6E9F",
          burdeos: "#8E254E",
          mostaza: "#E0A83E",
          "mostaza-osc": "#8A5E10",
          diabetes: "#B5668C",
          "diabetes-osc": "#94496E",
          papel: "#FAFAFA",
          texto: "#4E4E4E",
        },
      },
      // Esquinas más sobrias, como las fichas del Manual.
      borderRadius: {
        xl: "0.5rem",
        "2xl": "0.75rem",
        "3xl": "1rem",
      },
    },
  },
  plugins: [],
};
