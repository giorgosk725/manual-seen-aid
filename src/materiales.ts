/* Registro de los materiales de la edición (A04, A12): qué es cada uno (publicado por el Manual
   SEEN, adaptado por este complemento o explicación complementaria), cuándo se revisó, en qué
   versión y con qué evidencia. Lo enseña «Sobre este complemento» y lo usan los pies de las hojas.
   Un material sin aprobación registrada dice «pendiente»; nada se da por aprobado sin registro. */
import { hojaExtraPorId, huellaDeHoja } from "./hojas";
export type TipoMaterial =
  "publicado" | "transcripcion" | "adaptado" | "plantilla" | "explicacion" | "preguntas" | "ayuda";

export interface Material {
  id: string;
  /* Gobierna la edición: solo un material «aprobado» se ofrece para entregar e imprimir. */
  estado: "aprobado" | "pendiente";
  nombre: string;
  tipo: TipoMaterial;
  /* Fecha de publicación (lo publicado) o de la última revisión o aprobación registrada (lo del
     complemento); vacía si está pendiente. */
  fecha: string;
  version: string;
  evidencia: string;
  pendiente?: string;
  /* 1.0.7 (revisión R105-03): un cambio posterior a esa revisión, con su versión y lo que lo
     autoriza. No la sustituye: el pie de la hoja dice las dos fechas. */
  modificado?: { fecha: string; version: string; cambio: string; evidencia: string };
  /* Huella del texto revisado (V54-05). Si el archivo publicado cambia y ya no coincide, el
     material deja de estar listo hasta una revisión nueva; hoy, las hojas adaptadas. */
  huella?: string;
}

export const ROTULO_TIPO: Record<TipoMaterial, string> = {
  publicado: "Publicado por el Manual SEEN",
  transcripcion: "Transcripción literal de lo publicado",
  adaptado: "Hoja adaptada por este complemento",
  plantilla: "Plantilla con texto literal del capítulo",
  explicacion: "Explicación complementaria",
  preguntas: "Material docente del complemento",
  ayuda: "Ayuda de cálculo del complemento",
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
  // 0.70.0: sin la información en pantalla ni los extractos (decisión del responsable del
  // 14-10-2026: en la app, solo el PDF publicado).
  {
    id: "hoja-cetonas",
    estado: "aprobado",
    nombre: "Hoja «Cetonas: qué hacer según el resultado»",
    tipo: "adaptado",
    fecha: "2026-10-13",
    version: "0.61.0",
    evidencia:
      "Aprobada el 9-10-2026 (commit 24726c4); el 13-10-2026 el responsable aprobó el orden nuevo (la alarma primero), la remisión del tramo 0,6–0,9 con los signos de alarma aparte y «hoja» en vez de «tarjeta»",
    huella: "qrxbj313on7ct",
  },
  {
    id: "hoja-pruebas-cirugia",
    estado: "aprobado",
    nombre: "Hoja «Pruebas y cirugía»",
    tipo: "adaptado",
    fecha: "2026-10-14",
    version: "0.65.3",
    evidencia:
      "Aprobada el 9-10-2026 (commit 24726c4); sección de la insulina con el sistema quitado revisada el 13-10-2026 (delegada); el 14-10-2026 el responsable aprobó «Si hay que quitarse la bomba o el pod» y «TC (tomografía computarizada, escáner)»",
    huella: "ojqcaa19yt9g0",
  },
  {
    id: "planes",
    estado: "aprobado",
    nombre: "Plantillas del plan de seguridad (cuatro sistemas)",
    tipo: "plantilla",
    fecha: "2026-10-14",
    version: "0.70.0",
    evidencia:
      "Solo texto literal del capítulo (pp. 7-9, Figura 3 y Tabla 4); revisión clínica y visual del 13-10-2026 (delegada), a letra grande; el 13-10-2026 el responsable aprobó el título operativo y el recuadro de urgencia en la primera cara; el 14-10-2026, que el registro de los hidratos en CamAPS FX vaya solo en su plan, y la simplificación (0.70.0, «sí a todo»): una cara con lo esencial y la hoja de cetonas aprobada como segunda cara",
    modificado: {
      fecha: "2026-10-22",
      version: "1.0.5",
      cambio:
        "Los recambios, solo los del formato del sistema (con Omnipod 5, pods; con bomba con catéter, set, cánula y reservorio), y en la regla de oro y la cara de cetonas, «set o pod» según el formato (1.0.9): esas líneas dejan de ser literales",
      evidencia:
        "Decisiones del responsable del 22-10-2026 («sí, solo lo que aplica al sistema»; «sí, adapta» para set/pod)",
    },
    pendiente:
      "Revisión de la redacción adaptada por formato: recambios (1.0.5), regla de oro y cara de cetonas (1.0.9)",
  },
  {
    id: "calculadora",
    estado: "aprobado",
    nombre: "Calculadora de inicio («Iniciación del sistema»)",
    tipo: "ayuda",
    fecha: "2026-10-13",
    version: "0.58.0",
    evidencia:
      "Función decidida por el responsable el 13-10-2026 (opción C del borrador de inicio); reglas literales de la Tabla 2 y del apartado 8 (calculadora.test.ts); puntos de partida 10/20/0 % y 20 % con buen control y basal ultralarga, decididos el 13-10-2026",
    pendiente:
      "Revisión clínica del contrato de la 0.63.0, sin registro hasta hoy (docs/AUDITORIA_061_RESPUESTA.md, punto 1): lectura de entradas, límites de la ayuda (1–400 UI/día), rutas de pauta previa (MDI con o sin referencia, bomba u otro AID) y reglas del 450 y del 1700 sobre la DTD de inicio. Después, sin revisión propia: la comparación de lo que actúa en automático al cambiar de sistema (0.96.0, también en el paso 1 de Fases desde la 1.0.5) y los recambios por formato del paso 4 (1.0.5)",
  },
  {
    id: "como-interpretar",
    estado: "aprobado",
    nombre:
      "«Cómo leer esta tabla» y «Cómo interpretar este hallazgo» (fuera de esta edición desde la 0.72.2)",
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
    id: "como-funciona-sistema",
    estado: "pendiente",
    nombre: "«Cómo funciona» de cada sistema, de un vistazo (14-10-2026)",
    tipo: "plantilla",
    fecha: "",
    version: "0.65.1",
    evidencia:
      "Mismas piezas literales que la guía revisada; nueva disposición, sin revisión registrada",
  },
  {
    id: "notas-complementarias",
    estado: "pendiente",
    nombre:
      "Notas complementarias (edad de CamAPS Liberty; «autoaprendizaje» de Omnipod 5; recomendaciones de Tandem para la gestación)",
    tipo: "explicacion",
    fecha: "",
    version: "0.76.3",
    evidencia:
      "Decisiones de contenido del responsable: 13-10-2026 (Liberty), 14-10-2026 (Omnipod 5; Brown SA et al. Diabetes Care 2021;44:1630-40) y 19-10-2026 (folleto de Tandem MAT-2075_1 V4, texto literal, 0.76.3); fuentes en Bibliografía, «Fuentes complementarias»",
    pendiente:
      "Aprobación registrada del texto que se enseña de cada nota (las decisiones registradas son de contenido)",
  },
  {
    id: "frecuentes",
    estado: "aprobado",
    // 1.0.7 (revisión R105-03): el número lo comprueba edicion-editorial.test.ts contra los datos.
    nombre: "Preguntas frecuentes (105)",
    tipo: "preguntas",
    fecha: "2026-10-22",
    version: "1.0.1",
    evidencia:
      "f01–f50 aprobadas el 8-10-2026, f51–f61 el 11-10-2026 y f62–f103 el 13-10-2026 (revisión delegada); títulos de f70, f77 y f90 el 14-10-2026, docs/FRECUENTES.md; f83, f103 y f104 (nueva) el 22-10-2026 en la 0.99.0, y f94 y f105 (nueva) el 22-10-2026 en la 1.0.1, por decisión del responsable, con pasajes literales ya existentes (src/frecuentes.aprobadas.json)",
  },
  {
    id: "autoevaluacion",
    estado: "aprobado",
    nombre: "Autoevaluación complementaria (10 preguntas)",
    tipo: "preguntas",
    fecha: "2026-10-14",
    version: "0.66.0",
    evidencia:
      "Confirmada el 9-10-2026; q02 y q03 corregidas el 13-10-2026 tras su revisión; q01 con opciones de longitud parecida el 14-10-2026 (decisión del responsable)",
  },
];

export const material = (id: string) => MATERIALES.find((m) => m.id === id);
/* ¿Se puede entregar e imprimir? Un material sin registro o pendiente, no. */
export const materialListo = (id: string) => {
  const m = material(id);
  if (m?.estado !== "aprobado") return false;
  // Una hoja adaptada, además, con el texto que se revisó (no otro bajo el mismo nombre).
  if (m.huella && id.startsWith("hoja-")) {
    const h = hojaExtraPorId(id.slice(5));
    return !!h && huellaDeHoja(h) === m.huella;
  }
  return true;
};

export const fechaCorta = (iso: string) =>
  iso ? iso.split("-").reverse().join("-").replace(/^0/, "").replace(/-0/, "-") : "";
