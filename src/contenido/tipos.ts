/* Tipos del contenido del capítulo.

   REGLA ÚNICA: todo el texto es LITERAL del capítulo (PDF maquetado del 30-9-2026) con las
   11 correcciones editoriales anotadas aplicadas, y cada bloque lleva su página de origen.
   Nada de contenido inventado ni traído de otras fuentes. */

import type { DiagramaId } from "./diagramas";

export type TablaId = "T1" | "T2" | "T3" | "T4" | "T5" | "T6";
export type FiguraId = "F1" | "F2" | "F3" | "INFO";

/* Marcado en línea mínimo dentro de `texto`/`items`: *cursiva* y **negrita**. */
export type Bloque =
  /* Párrafo. `lead` = entradilla en negrita con la que empieza el párrafo en el capítulo
     («Configuración inicial (v. Tabla 2).», «Hiperglucemia posprandial precoz.»…).
     `p2` = página en la que termina cuando el párrafo salta de página. */
  | { t: "p"; p: number; p2?: number; texto: string; lead?: string }
  /* Subapartado (título de segundo nivel del capítulo). `id` = ancla de la ruta. */
  | { t: "h3"; p: number; texto: string; id: string }
  /* Lista con viñetas (p. ej. los contenidos mínimos del PEET). */
  /* `p2` = página en la que termina cuando la lista salta de página. */
  | { t: "lista"; p: number; p2?: number; items: string[]; intro?: string }
  | { t: "tabla"; p: number; id: TablaId }
  | { t: "figura"; p: number; id: FiguraId }
  /* Diagrama a partir del texto del capítulo (src/contenido/diagramas.ts). */
  | { t: "diagrama"; p: number; id: DiagramaId };

export interface Apartado {
  n: number;
  slug: string;
  /* Título tal como aparece en el capítulo. */
  titulo: string;
  /* Etiqueta corta para la navegación (es interfaz, no texto del capítulo). */
  corto: string;
  paginas: [number, number];
  bloques: Bloque[];
}

/* ---------- Tablas ---------- */
export interface FilaTabla {
  /* Primera columna (característica, aspecto, situación, paso…). */
  etiqueta: string;
  /* Una celda por columna de datos. Las líneas se separan con "\n". */
  celdas: string[];
  /* true = una sola celda que ocupa todas las columnas de datos (Tabla 4, última fila). */
  unida?: boolean;
}

export interface Tabla {
  id: TablaId;
  numero: number;
  titulo: string;
  paginas: [number, number];
  /* Cabecera de la primera columna. */
  cabeceraEtiqueta: string;
  /* Cabeceras de las columnas de datos. En las tablas por sistema son los 4 sistemas. */
  columnas: string[];
  filas: FilaTabla[];
  /* Pie: abreviaturas y notas, literales. */
  notas: string[];
  /* true = las columnas son los cuatro sistemas (se puede filtrar por sistema). */
  porSistema: boolean;
}

/* ---------- Figuras (imagen en el PDF → transcritas caja a caja) ---------- */
export interface CajaFigura {
  titulo?: string;
  items: string[];
  /* Tono de la caja en la figura original (solo señalización; sin tono = neutro). */
  tono?: "azul" | "verde" | "amarillo" | "naranja" | "rojo";
}

export interface Figura {
  id: FiguraId;
  numero?: number;
  /* Pie de figura literal («Figura 1. Arquitectura clínica…»). */
  titulo: string;
  pagina: number;
  /* Rótulo de cabecera dentro de la imagen, si lo hay. */
  cabecera?: string;
  cajas: CajaFigura[];
  /* Imagen de la maquetación (provisional, a falta del archivo fuente). */
  imagen?: { src: string; alt: string; nota: string };
}

/* ---------- Figura 3 como recorrido ---------- */
export type Tramo = "verde" | "amarillo" | "naranja" | "rojo";

export interface PasoTramo {
  /* Icono de la figura original (nombre del concepto, no del archivo). */
  icono: "pluma" | "ojo" | "agua" | "reloj" | "aviso" | "recambio" | "ambulancia" | "urgente";
  texto: string;
  /* Líneas de detalle (sub-viñetas de la figura). */
  detalle?: string[];
}

export interface TramoFigura3 {
  clave: Tramo;
  rango: string;
  titulo: string;
  pasos: PasoTramo[];
}

export interface Figura3 {
  titulo: string;
  pagina: number;
  cabecera: string;
  sospechar: { titulo: string; items: string[] };
  comprobar: { titulo: string; items: string[] };
  confirmar: string;
  tramos: TramoFigura3[];
  pie: { titulo: string; texto: string }[];
  abreviaturas: string;
  reglaDeOro: string;
  notaAsterisco: string;
}

/* ---------- Bibliografía ---------- */
export interface Referencia {
  n: number;
  /* Cita literal del capítulo (con la corrección editorial 10/11 aplicada en la 6). */
  cita: string;
  doi?: string;
  /* Enlace directo cuando la referencia no tiene DOI (p. ej. el PDF de la guía SED). */
  url?: string;
}

/* ---------- Glosario de siglas ---------- */
export interface Sigla {
  sigla: string;
  /* Desarrollo tal como lo da el capítulo (pie de tabla o primera mención). */
  desarrollo: string;
  /* Página en la que el capítulo la desarrolla. */
  pagina: number;
}
