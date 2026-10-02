/* Tokens de diseño — heredados del lenguaje validado de asistente-aid (navy SEEN, hairline
   única, acentos por sistema) y ampliados con los tonos de los tramos de la Figura 3. */

// Color de marca SEEN (azul institucional) y su variante oscura.
export const BRAND = "#1F4E79";
export const BRAND_DARK = "#15324f";

// Gris «hairline» único para bordes de tarjeta en reposo.
export const HAIRLINE = "#e5ebf1";

// Hero de portada: navy en degradado + auroras (receta 1 del lenguaje de diseño).
export const HERO_GRADIENT = "linear-gradient(130deg, #0b2036, #15324f 48%, #1f4e79)";

// Acento por sistema (mismo emparejamiento que asistente-aid): índice = columna de las
// tablas por sistema (MiniMed 780G · Tandem Control-IQ · myLoop CamAPS · Omnipod 5).
export const SISTEMA_HEX: { soft: string; strong: string; ink: string }[] = [
  { soft: "#eef4f9", strong: "#004B87", ink: "#003a6b" },
  { soft: "#f2eef8", strong: "#522D80", ink: "#3f2363" },
  { soft: "#e8f7f3", strong: "#0E8C77", ink: "#046b5b" },
  { soft: "#fcefe7", strong: "#E05300", ink: "#a83f00" },
];

// Acento por defecto (sin sistema): navy de marca.
export const BRAND_ACCENT = { soft: "#eef3f8", strong: BRAND, ink: BRAND_DARK };

// Tramos de cetonemia de la Figura 3: el color ES señalización clínica (verde = sin cetosis
// significativa, amarillo = leve, naranja = significativa, rojo = posible cetoacidosis).
export const TRAMO_HEX = {
  verde: { soft: "#ecfdf5", border: "#a7f3d0", strong: "#15803d", ink: "#065f46" },
  amarillo: { soft: "#fffbeb", border: "#fde68a", strong: "#ca8a04", ink: "#854d0e" },
  naranja: { soft: "#fff7ed", border: "#fed7aa", strong: "#ea580c", ink: "#9a3412" },
  rojo: { soft: "#fef2f2", border: "#fecaca", strong: "#dc2626", ink: "#991b1b" },
} as const;

// Categorías de la navegación (color por FUNCIÓN, como en el hub de asistente-aid).
export const CATEGORIA_HEX: Record<
  string,
  { soft: string; strong: string; strong2: string; ink: string }
> = {
  leer: { soft: "#eef3f8", strong: "#1f4e79", strong2: "#15324f", ink: "#15324f" },
  consultar: { soft: "#eff0f7", strong: "#514dbf", strong2: "#4340a6", ink: "#343093" },
  confiar: { soft: "#eef5f1", strong: "#0f7a58", strong2: "#0c6448", ink: "#0b5540" },
  aprender: { soft: "#edf5fa", strong: "#2f93c4", strong2: "#1f6a8f", ink: "#1f6a8f" },
};
