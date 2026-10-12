/* Registro de los materiales de la edición (A04, A12): qué es cada uno (publicado por el Manual
   SEEN, adaptado por este complemento o explicación complementaria), cuándo se revisó, en qué
   versión y con qué evidencia. Lo enseña «Sobre este complemento» y lo usan los pies de las hojas.
   Un material sin aprobación registrada dice «pendiente»; nada se da por aprobado sin registro. */
export type TipoMaterial =
  "publicado" | "transcripcion" | "adaptado" | "plantilla" | "explicacion" | "preguntas";

export interface Material {
  id: string;
  nombre: string;
  tipo: TipoMaterial;
  /* Fecha de publicación o de la última aprobación; vacía si está pendiente. */
  fecha: string;
  version: string;
  evidencia: string;
  pendiente?: string;
}

export const ROTULO_TIPO: Record<TipoMaterial, string> = {
  publicado: "Publicado por el Manual SEEN",
  transcripcion: "Transcripción literal de lo publicado",
  adaptado: "Hoja adaptada por este complemento",
  plantilla: "Plantilla con texto literal del capítulo",
  explicacion: "Explicación complementaria",
  preguntas: "Capa docente",
};

export const MATERIALES: Material[] = [
  {
    id: "capitulo",
    nombre: "Capítulo 89 (PDF)",
    tipo: "publicado",
    fecha: "2026-10-08",
    version: "—",
    evidencia:
      "manual.seen.es; SHA-256 del PDF en «Esta versión»; cotejo de fidelidad sin divergencias",
  },
  {
    id: "pdf-pacientes",
    nombre: "Información para pacientes (PDF)",
    tipo: "publicado",
    fecha: "2026-10-09",
    version: "—",
    evidencia: "Fecha del pie del PDF; SHA-256 en «Esta versión»",
  },
  {
    id: "informacion",
    nombre: "Información para pacientes, en pantalla",
    tipo: "transcripcion",
    fecha: "2026-10-09",
    version: "0.46.1",
    evidencia: "Texto idéntico al del PDF publicado (scripts/auditoria/fidelidad_extra.py)",
  },
  {
    id: "extractos",
    nombre: "Hojas breves: extractos de la Información para pacientes",
    tipo: "transcripcion",
    fecha: "2026-10-09",
    version: "0.19.0",
    evidencia: "Mismas preguntas y respuestas, sin texto nuevo",
  },
  {
    id: "hoja-cetonas",
    nombre: "Hoja «Cetonas: qué hacer según el resultado»",
    tipo: "adaptado",
    fecha: "2026-10-09",
    version: "0.20.0",
    evidencia: "Aprobación registrada (commit 24726c4)",
  },
  {
    id: "hoja-pruebas-cirugia",
    nombre: "Hoja «Pruebas y cirugía»",
    tipo: "adaptado",
    fecha: "2026-10-09",
    version: "0.20.0",
    evidencia: "Aprobación registrada (commit 24726c4)",
    pendiente: "Propuesta de cambio de la sección «más de 1 hora», en revisión desde el 13-10-2026",
  },
  {
    id: "planes",
    nombre: "Plantillas del plan de seguridad (cuatro sistemas)",
    tipo: "plantilla",
    fecha: "",
    version: "—",
    evidencia: "Solo texto literal del capítulo (pp. 7-9, Figura 3 y Tabla 4)",
    pendiente: "Revisión clínica y visual antes del piloto",
  },
  {
    id: "como-interpretar",
    nombre: "«Cómo leer esta tabla» y «Cómo interpretar este hallazgo»",
    tipo: "explicacion",
    fecha: "2026-10-11",
    version: "0.37.0",
    evidencia: "Aprobación registrada (commit 7bb0a4c)",
  },
  {
    id: "como-funciona",
    nombre: "«Cómo funciona», comparado por aspectos",
    tipo: "explicacion",
    fecha: "2026-10-11",
    version: "0.37.0",
    evidencia: "Aprobación registrada (commit 7bb0a4c)",
  },
  {
    id: "frecuentes",
    nombre: "Preguntas frecuentes f01–f61",
    tipo: "preguntas",
    fecha: "2026-10-11",
    version: "0.38.0",
    evidencia: "f01–f50 aprobadas el 8-10-2026 y f51–f61 el 11-10-2026 (docs/FRECUENTES.md)",
    pendiente: "f62–f103, en revisión; no salen en la edición",
  },
  {
    id: "autoevaluacion",
    nombre: "Autoevaluación complementaria (10 preguntas)",
    tipo: "preguntas",
    fecha: "2026-10-13",
    version: "0.50.0",
    evidencia: "Confirmada el 9-10-2026; q02 y q03 corregidas el 13-10-2026 tras su revisión",
  },
];

export const material = (id: string) => MATERIALES.find((m) => m.id === id);

export const fechaCorta = (iso: string) =>
  iso ? iso.split("-").reverse().join("-").replace(/^0/, "").replace(/-0/, "-") : "";
