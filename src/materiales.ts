/* Registro de los materiales de la edición (A04, A12): qué es cada uno (publicado por el Manual
   SEEN, adaptado por este complemento o explicación complementaria), cuándo se revisó, en qué
   versión y con qué evidencia. Lo enseña «Sobre este complemento» y lo usan los pies de las hojas.
   Un material sin aprobación registrada dice «pendiente»; nada se da por aprobado sin registro. */
export type TipoMaterial =
  "publicado" | "transcripcion" | "adaptado" | "plantilla" | "explicacion" | "preguntas";

export interface Material {
  id: string;
  /* Gobierna la edición: solo un material «aprobado» se ofrece para entregar e imprimir. */
  estado: "aprobado" | "pendiente";
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
    estado: "aprobado",
    nombre: "Capítulo 89 (PDF)",
    tipo: "publicado",
    fecha: "2026-10-08",
    version: "—",
    evidencia:
      "manual.seen.es; SHA-256 del PDF en «Esta versión»; cotejo de fidelidad sin divergencias",
  },
  {
    id: "pdf-pacientes",
    estado: "aprobado",
    nombre: "Información para pacientes (PDF)",
    tipo: "publicado",
    fecha: "2026-10-09",
    version: "—",
    evidencia: "Fecha del pie del PDF; SHA-256 en «Esta versión»",
  },
  {
    id: "informacion",
    estado: "aprobado",
    nombre: "Información para pacientes, en pantalla",
    tipo: "transcripcion",
    fecha: "2026-10-09",
    version: "0.46.1",
    evidencia: "Texto idéntico al del PDF publicado (scripts/auditoria/fidelidad_extra.py)",
  },
  {
    id: "extractos",
    estado: "aprobado",
    nombre: "Hojas breves: extractos de la Información para pacientes",
    tipo: "transcripcion",
    fecha: "2026-10-09",
    version: "0.19.0",
    evidencia: "Mismas preguntas y respuestas, sin texto nuevo",
  },
  {
    id: "hoja-cetonas",
    estado: "aprobado",
    nombre: "Hoja «Cetonas: qué hacer según el resultado»",
    tipo: "adaptado",
    fecha: "2026-10-09",
    version: "0.20.0",
    evidencia: "Aprobación registrada (commit 24726c4)",
    pendiente:
      "Orden reorganizado el 13-10-2026 (0.55.0): el bloque de alarma va el primero, con el mismo texto; revisar el orden nuevo (borradores/hoja-cetonas-orden_2026-10-13.md)",
  },
  {
    id: "hoja-pruebas-cirugia",
    estado: "aprobado",
    nombre: "Hoja «Pruebas y cirugía»",
    tipo: "adaptado",
    fecha: "2026-10-13",
    version: "0.51.0",
    evidencia:
      "Aprobada el 9-10-2026 (commit 24726c4); sección de la insulina con el sistema quitado revisada el 13-10-2026 (delegada)",
  },
  {
    id: "planes",
    estado: "aprobado",
    nombre: "Plantillas del plan de seguridad (cuatro sistemas)",
    tipo: "plantilla",
    fecha: "2026-10-13",
    version: "0.51.0",
    evidencia:
      "Solo texto literal del capítulo (pp. 7-9, Figura 3 y Tabla 4); revisión clínica y visual del 13-10-2026 (delegada), a letra grande, tres caras",
  },
  {
    id: "como-interpretar",
    estado: "aprobado",
    nombre: "«Cómo leer esta tabla» y «Cómo interpretar este hallazgo»",
    tipo: "explicacion",
    fecha: "2026-10-11",
    version: "0.37.0",
    evidencia: "Aprobación registrada (commit 7bb0a4c)",
  },
  {
    id: "como-funciona",
    estado: "aprobado",
    nombre: "«Cómo funciona», comparado por aspectos",
    tipo: "explicacion",
    fecha: "2026-10-11",
    version: "0.37.0",
    evidencia: "Aprobación registrada (commit 7bb0a4c)",
  },
  {
    id: "frecuentes",
    estado: "aprobado",
    nombre: "Preguntas frecuentes f01–f103",
    tipo: "preguntas",
    fecha: "2026-10-13",
    version: "0.51.0",
    evidencia:
      "f01–f50 aprobadas el 8-10-2026, f51–f61 el 11-10-2026 y f62–f103 el 13-10-2026 (revisión delegada), docs/FRECUENTES.md",
  },
  {
    id: "autoevaluacion",
    estado: "aprobado",
    nombre: "Autoevaluación complementaria (10 preguntas)",
    tipo: "preguntas",
    fecha: "2026-10-13",
    version: "0.50.0",
    evidencia: "Confirmada el 9-10-2026; q02 y q03 corregidas el 13-10-2026 tras su revisión",
  },
];

export const material = (id: string) => MATERIALES.find((m) => m.id === id);
/* ¿Se puede entregar e imprimir? Un material sin registro o pendiente, no. */
export const materialListo = (id: string) => material(id)?.estado === "aprobado";

export const fechaCorta = (iso: string) =>
  iso ? iso.split("-").reverse().join("-").replace(/^0/, "").replace(/-0/, "-") : "";
