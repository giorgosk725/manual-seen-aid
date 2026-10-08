/* Enlaces a la edición educativa de asistente-aid (del mismo autor): casos prácticos con
   pacientes de ejemplo, sin datos reales. Es otra obra, fuera del capítulo: se enlaza, no se
   copia, y se rotula como tal. */
export const EDUCATIVA = "https://asistenteaid-educativa.pages.dev/";

export interface CasoEducativo {
  ruta: string;
  texto: string;
}

const CETOSIS: CasoEducativo = {
  ruta: "#/situaciones/cetosis",
  texto: "Hiperglucemia y cetosis: cuatro episodios de ejemplo",
};
const DESCONEXION: CasoEducativo = {
  ruta: "#/situaciones/desconexion",
  texto: "Desconexión: pacientes de ejemplo con su pauta",
};
const CASOS: CasoEducativo = {
  ruta: "#/biblioteca/casos",
  texto: "Casos clínicos tipo test con su razonamiento",
};

// Su apartado del tema, no el catálogo general (auditoría externa del 6-10-2026).
const EJERCICIO: CasoEducativo = {
  ruta: "#/situaciones/ejercicio",
  texto: "Ejercicio: preparación y herramienta temporal de cada sistema",
};
const COMIDAS: CasoEducativo = {
  ruta: "#/optimizar/comidas",
  texto: "Comidas y bolos: comida grasa o proteica y bolo tardío por sistema",
};
const ESPECIALES: CasoEducativo = {
  ruta: "#/situaciones/especiales",
  texto: "Situaciones especiales: perioperatorio, glucocorticoides y diálisis",
};

/* Situación de la app → caso práctico en la edición educativa. */
export const CASO_EDUCATIVO: Record<string, CasoEducativo> = {
  "hiperglucemia-persistente": CETOSIS,
  "ejercicio-aerobico": EJERCICIO,
  "ejercicio-anaerobico": EJERCICIO,
  "necesidad-transitoria": CASOS,
  "comida-grasa": COMIDAS,
  "cirugia-corta": ESPECIALES,
  "cirugia-larga": ESPECIALES,
  rm: DESCONEXION,
  tc: DESCONEXION,
  interrupcion: DESCONEXION,
  cetonemia: CETOSIS,
  descarga: { ruta: "#/optimizar/optimizar", texto: "Optimizar: tres descargas de ejemplo" },
  transicion: {
    ruta: "#/transicion/transicion",
    texto: "Programación inicial: pacientes de ejemplo",
  },
};
