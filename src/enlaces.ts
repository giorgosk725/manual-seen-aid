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

/* Situación de la app → caso práctico en la edición educativa. */
export const CASO_EDUCATIVO: Record<string, CasoEducativo> = {
  "hiperglucemia-persistente": CETOSIS,
  "ejercicio-aerobico": CASOS,
  "ejercicio-anaerobico": CASOS,
  "necesidad-transitoria": CASOS,
  "comida-grasa": CASOS,
  "cirugia-corta": CASOS,
  "cirugia-larga": CASOS,
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
