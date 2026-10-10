/* Tokens de diseño — identidad del Manual de Endocrinología y Nutrición de la SEEN (0.5.0):
   azul «MANUAL», burdeos y mostaza del rótulo, el malva del área Diabetes y los tonos de las
   fichas de área de su portada, sobre papel #FAFAFA y texto gris #4E4E4E. Se conservan los
   acentos por sistema y los tonos clínicos de la Figura 3. */

// Paleta del Manual SEEN (muestreada de manual.seen.es). Las variantes «osc» son las que
// cumplen contraste AA para texto pequeño sobre el papel; las claras son decorativas.
export const SEEN = {
  azul: "#739DCB",
  azulOsc: "#3F6E9F",
  burdeos: "#8E254E",
  mostaza: "#E0A83E",
  mostazaOsc: "#8A5E10",
  diabetes: "#B5668C",
  diabetesOsc: "#94496E",
  papel: "#FAFAFA",
  texto: "#4E4E4E",
  tinta: "#1A1A1A",
  linea: "#E6E6E6",
} as const;

// Colores de las fichas de área de la portada del Manual (para las fichas de esta app).
export const FICHA_AREA = {
  endocrino: "#A3CCE3",
  diabetes: "#B5668C",
  nutricion: "#C9CC86",
  lipidos: "#E3B55E",
  obesidad: "#DD897A",
  mineral: "#8FCBCB",
  lavanda: "#9C9BC6",
  azul: "#7CABE9",
  perla: "#CFC6B8",
  pizarra: "#5B7B95",
  rosa: "#E3AFC4",
} as const;

// Color de cada apartado 1-12 (mosaico de la portada y cabecera del apartado), en el orden
// de las áreas de manual.seen.es; el 13 (infografía) va en burdeos. Son fondos con icono
// blanco decorativo: nunca color de texto.
export const COLOR_APARTADO = [
  FICHA_AREA.endocrino,
  FICHA_AREA.diabetes,
  FICHA_AREA.nutricion,
  FICHA_AREA.lipidos,
  FICHA_AREA.obesidad,
  FICHA_AREA.mineral,
  FICHA_AREA.lavanda,
  FICHA_AREA.azul,
  FICHA_AREA.perla,
  FICHA_AREA.pizarra,
  FICHA_AREA.rosa,
  FICHA_AREA.diabetes,
  SEEN.burdeos,
] as const;
export const colorApartado = (n: number) => COLOR_APARTADO[(n - 1) % COLOR_APARTADO.length];

// Color de marca (texto e interacción) y su variante oscura.
export const BRAND = SEEN.azulOsc;
export const BRAND_DARK = "#2F5680";

// Gris «hairline» único para bordes de tarjeta en reposo.
export const HAIRLINE = SEEN.linea;

// Acento por sistema (mismo emparejamiento que asistente-aid): índice = columna de las
// tablas por sistema (MiniMed 780G · Tandem Control-IQ · myLoop CamAPS · Omnipod 5).
export const SISTEMA_HEX: { soft: string; strong: string; ink: string }[] = [
  { soft: "#eef4f9", strong: "#004B87", ink: "#003a6b" },
  { soft: "#f2eef8", strong: "#522D80", ink: "#3f2363" },
  { soft: "#e8f7f3", strong: "#0E8C77", ink: "#046b5b" },
  { soft: "#fcefe7", strong: "#E05300", ink: "#a83f00" },
];

// Acento por defecto (sin sistema): azul del Manual.
export const BRAND_ACCENT = { soft: "#eef3f9", strong: BRAND, ink: BRAND_DARK };

// Tramos de cetonemia de la Figura 3: el color ES señalización clínica (verde = sin cetosis
// significativa, amarillo = leve, naranja = significativa, rojo = posible cetoacidosis).
export const TRAMO_HEX = {
  verde: { soft: "#ecfdf5", border: "#a7f3d0", strong: "#15803d", ink: "#065f46" },
  amarillo: { soft: "#fffbeb", border: "#fde68a", strong: "#ca8a04", ink: "#854d0e" },
  naranja: { soft: "#fff7ed", border: "#fed7aa", strong: "#ea580c", ink: "#9a3412" },
  rojo: { soft: "#fef2f2", border: "#fecaca", strong: "#dc2626", ink: "#991b1b" },
} as const;

// Categorías de la navegación (color por FUNCIÓN, con los tonos de área del Manual SEEN):
// leer = azul del Manual; consultar = burdeos del rótulo (también el único acento de
// interacción: botones, pestañas y selección activas); confiar = pizarra; aprender = mostaza;
// pacientes = salmón. Los colores de categoría son acentos pequeños (icono, filete), no fondos.
export const CATEGORIA_HEX: Record<
  string,
  { soft: string; strong: string; strong2: string; ink: string }
> = {
  leer: { soft: "#eef3f9", strong: "#3f6e9f", strong2: "#2f5680", ink: "#2f5680" },
  consultar: { soft: "#f7eff3", strong: "#8E254E", strong2: "#731d3f", ink: "#6b1c3b" },
  confiar: { soft: "#eff3f6", strong: "#5b7b95", strong2: "#4a657b", ink: "#3e566a" },
  aprender: { soft: "#fbf4e6", strong: "#8a5e10", strong2: "#73500e", ink: "#6b4a0d" },
  pacientes: { soft: "#fbeeeb", strong: "#a8473a", strong2: "#8e3b30", ink: "#7f3128" },
};
