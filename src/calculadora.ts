/* Calculadora de parámetros iniciales (#/consultar/inicio/calculadora): aplica las reglas de la
   Tabla 2 y del apartado 8 a las dosis que se escriben, sin nada más. Cada regla y cada texto que
   se enseña es un fragmento literal del capítulo (calculadora.test.ts lo comprueba contra
   TABLAS y el apartado 8). Nada se guarda ni se envía: vive en memoria mientras la app está
   abierta. Orden de los sistemas: columnas de la Tabla 1. */
import { TABLAS } from "./contenido";

export type Origen = "mdi" | "isci";
export type Control = "bueno" | "riesgo" | "deficiente";

/* ---------- Las reglas, como las da el capítulo ---------- */
export const REGLAS = {
  reduccion: {
    texto:
      "Valorar una reducción inicial de la DTD respecto a MDI (orientativamente del 10-20 %) en casos de buen control previo o riesgo de hipoglucemia; poco o nada si el control era deficiente (HbA1c > 8 %)",
    nota: "En asa cerrada, el algoritmo ajusta después la basal automáticamente; esta cifra es solo el punto de partida",
  },
  basal: {
    texto: "Ritmo basal inicial = ~40-50 % de la DTD reducida/24 h; o individualizar según MCG",
    nota: "Sirve sobre todo para el modo manual; en Tandem Control-IQ, el perfil basal sí interviene en automático",
  },
  ratio: {
    texto: "Regla del 450: g de HC por unidad = 450/DTD",
    nota: "Alternativa: cálculo individualizado basado en educación diabetológica previa a la instalación",
  },
  factor: {
    texto: "Regla del 1700: mg/dl por unidad = 1700/DTD",
    nota: "Puede valorarse la regla del 1800 en personas con riesgo elevado de hipoglucemia",
  },
  objetivo: {
    texto:
      "Individualizar (orientativamente 100 mg/dl general; 90 mg/dl preconcepcional/gestación; 120 mg/dl en riesgo elevado de hipoglucemia)",
    nota: "No confundir con el objetivo glucémico del algoritmo automático, que se configura por separado (v. Tabla 1)",
  },
  solapamiento: {
    texto:
      "Las basales ultralargas mantienen un efecto residual durante los primeros días; coordinar la última dosis y el inicio del sistema",
    nota: "Posible riesgo de hipoglucemia en personas con buen control previo; vigilar estrechamente, sobre todo las primeras 48 h",
  },
  respaldo: {
    texto:
      "Entregar una pauta escrita con basal y rápida en pluma, el cálculo de corrección, material para medir cetonemia y un contacto asistencial ante fallo del sistema",
    nota: "Requisito de seguridad; debe estar disponible desde el primer día y revisarse en cada cambio relevante",
  },
  partida:
    "*Nota: los parámetros iniciales son solo el valor de partida; el algoritmo de cada sistema los modula según su propia lógica, y el ajuste fino posterior se realiza a partir del análisis estructurado de la descarga.",
};

/* Desde ISCI, el apartado 8 (p. 12): se traslada lo que funcionaba; sin referencia, 450 y 1700. */
export const DESDE_ISCI = {
  trasladar: "una programación de ISCI que funcionaba puede trasladarse tal cual",
  sinReferencia:
    "cuando no se dispone de referencia, las reglas del 450 y del 1700 sobre la DTD orientan la ratio y el factor de sensibilidad iniciales",
  basalPlana:
    "Sin patrón previo, una basal plana (~ 40-50 % de la DTD reducida/24 h) es un inicio razonable",
};

/* Las opciones de cada control, con su texto del capítulo. Las cifras por defecto de la
   reducción son puntos dentro del intervalo «orientativamente del 10-20 %» («poco o nada» = 0);
   el profesional las mueve. */
export const CONTROLES: { id: Control; texto: string; reduccion: number; regla: 1700 | 1800 }[] = [
  { id: "bueno", texto: "Buen control previo", reduccion: 10, regla: 1700 },
  { id: "riesgo", texto: "Riesgo de hipoglucemia", reduccion: 20, regla: 1800 },
  { id: "deficiente", texto: "Control deficiente (HbA1c > 8 %)", reduccion: 0, regla: 1700 },
];
/* La reducción de partida (decisión del responsable, 13-10-2026): la de cada control y, con
   buen control previo y basal ultralarga (glargina U–300 o degludec), el 20 %: es el caso en
   que la Tabla 2 avisa de «posible riesgo de hipoglucemia en personas con buen control previo». */
export const reduccionDePartida = (c: Control, ultralarga: boolean) =>
  c === "bueno" && ultralarga ? 20 : CONTROLES.find((k) => k.id === c)!.reduccion;
export const OBJETIVOS_CALCULADOR: { mgdl: number; texto: string }[] = [
  { mgdl: 100, texto: "general" },
  { mgdl: 90, texto: "preconcepcional/gestación" },
  { mgdl: 120, texto: "en riesgo elevado de hipoglucemia" },
];

/* ---------- La indicación de la Tabla 1, en números, para avisar si la DTD o el peso quedan
   fuera (el texto que se enseña es la celda entera). null = el capítulo no pone límite. ---------- */
export type Rango = { min: number | null; max: number | null };
export const INDICACION: { nombre: string; dtd: Rango; peso: Rango }[][] = [
  [{ nombre: "MiniMed 780G", dtd: { min: 6, max: null }, peso: { min: null, max: null } }],
  [
    { nombre: "Control-IQ", dtd: { min: 10, max: 100 }, peso: { min: 25, max: 140 } },
    { nombre: "Control-IQ+", dtd: { min: 5, max: 200 }, peso: { min: 9, max: 200 } },
  ],
  [{ nombre: "CamAPS FX", dtd: { min: 5, max: 350 }, peso: { min: 10, max: null } }],
  [{ nombre: "Omnipod 5", dtd: { min: 5, max: null }, peso: { min: null, max: null } }],
];
const dentro = (v: number, r: Rango) =>
  (r.min === null || v >= r.min) && (r.max === null || v <= r.max);

/* ---------- Qué programar en cada sistema (Tabla 2, «Inicialización del modo automático»),
   con lo que hace cada parámetro en automático (Tabla 3). ---------- */
export type Clave =
  "peso" | "dtd" | "basal" | "factor" | "ratio" | "objetivo" | "objetivoAlg" | "ia";
/* El núcleo común (apartado 8, p. 12) y, aparte, lo que añade cada sistema según la Tabla 2. */
export const NUCLEO_COMUN = {
  texto:
    "Antes de activar el modo automático debe quedar configurado un núcleo común a todos los sistemas —tasa basal por tramos, ratio insulina/hidratos y factor de sensibilidad—",
  claves: ["basal", "ratio", "factor", "objetivo"] as Clave[],
};
export const INICIALIZACION: { previo: string; programar: Clave[] }[] = [
  {
    previo: "SmartGuard requiere 48 h previas de administración de insulina en modo manual",
    programar: ["objetivoAlg", "ia"],
  },
  { previo: "iniciar modo automático tras introducir peso y DTD", programar: ["peso", "dtd"] },
  {
    previo: "iniciar modo automático tras introducir peso y DTD",
    programar: ["peso", "dtd", "objetivoAlg"],
  },
  { previo: "iniciar modo automático desde el primer pod", programar: ["objetivoAlg", "ia"] },
];

const celda = (tabla: "T1" | "T3" | "T4", etiqueta: string, c: number) =>
  TABLAS[tabla].filas.find((f) => f.etiqueta === etiqueta)?.celdas[c] ?? "";
/* Lo que la Tabla 3 dice de cada parámetro en ese sistema: la celda entera (13-10-2026: antes
   solo la primera línea, y se perdía, p. ej., que en el 780G una insulina activa más corta
   intensifica las autocorrecciones). */
export function papelEnAutomatico(k: Clave, c: number): string | null {
  const fila: Partial<Record<Clave, string>> = {
    basal: "Tasa basal programada",
    factor: "Factor de sensibilidad",
    ratio: "Ratio insulina/hidratos de carbono",
    ia: "Duración de la insulina activa",
    objetivoAlg: "Objetivo glucémico y funciones temporales con impacto en automático",
  };
  const e = fila[k];
  return e ? celda("T3", e, c).split("\n").join(" · ") : null;
}

/* Qué programar, por importancia (13-10-2026), con la Tabla 1 y su nota: lo que cuenta en el
   modo automático (o para arrancarlo: peso y DTD en Control-IQ y CamAPS FX, la tasa basal
   inicial de Omnipod 5, Tabla 2 y Tabla 3) y lo que interviene sobre todo en los bolos, el modo
   manual y el respaldo. */
const CLAVE_DE_PARAMETRO: Record<string, Clave> = {
  "Objetivo de glucosa": "objetivoAlg",
  "Duración de la insulina activa": "ia",
  "Ratios I/HC": "ratio",
  "Factor de sensibilidad": "factor",
  "Basal programada": "basal",
};
export function gruposDeProgramar(c: number): { automatico: Clave[]; manual: Clave[] } {
  const lineas = celda("T1", "Parámetros configurables en modo automático", c)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  const clave = (x: string) => CLAVE_DE_PARAMETRO[x.replace(/\*$/, "")];
  const automatico = lineas.filter((x) => x.endsWith("*")).map(clave);
  const manual = lineas.filter((x) => !x.endsWith("*")).map(clave);
  if (c === 1 || c === 2) automatico.unshift("peso", "dtd");
  if (c === 3) automatico.push("basal");
  else if (!automatico.includes("basal") && !manual.includes("basal")) manual.unshift("basal");
  if (!automatico.includes("factor") && !manual.includes("factor")) manual.push("factor");
  manual.push("objetivo");
  return { automatico, manual };
}

/* Modos y funciones de cada sistema, celda a celda (Tabla 3, fila del objetivo; Tabla 4, filas
   de ejercicio aeróbico, sueño y comida grasa o proteica). */
export function modosDe(c: number): { situacion: string; texto: string; tabla: "T3" | "T4" }[] {
  const t4 = (i: number) => TABLAS.T4.filas[i].celdas[c];
  return [
    {
      situacion: "Objetivo y funciones temporales",
      texto: celda("T3", "Objetivo glucémico y funciones temporales con impacto en automático", c),
      tabla: "T3" as const,
    },
    { situacion: "Ejercicio aeróbico planificado", texto: t4(0), tabla: "T4" as const },
    { situacion: "Sueño / período nocturno", texto: t4(2), tabla: "T4" as const },
    { situacion: "Comida rica en grasa/proteína", texto: t4(5), tabla: "T4" as const },
  ];
}
/* Qué esperar del algoritmo (Tabla 1, «Lógica del algoritmo y aprendizaje»). */
export const aprendizajeDe = (c: number) => celda("T1", "Lógica del algoritmo y aprendizaje", c);

/* Material del sistema (Tabla 1) y los recambios que piden la educación y el plan de seguridad
   (apartado 7, pp. 7-8). */
export const materialDe = (c: number) => [
  { rotulo: "Formato", texto: celda("T1", "Formato", c) },
  { rotulo: "Sensores compatibles", texto: celda("T1", "Sensores compatibles", c) },
  { rotulo: "Plataforma de descarga", texto: celda("T1", "Plataforma de descarga", c) },
];
export const RECAMBIOS = {
  educacion: "Recambio de set, reservorio, pod y sensor.",
  plan: "Recambios de set, cánula, reservorio o pods, sensores y baterías/cargadores.",
};
export const indicacionDe = (c: number) => celda("T1", "Indicación", c);
export const objetivoAlgoritmoDe = (c: number) =>
  celda("T1", "Objetivo glucémico en modo automático", c);

/* ---------- El cálculo ---------- */
export type Entrada = {
  origen: Origen;
  basal: number; // UI/día (MDI)
  rapida: number; // UI/día (MDI)
  dtdIsci: number; // UI/día (ISCI)
  peso: number; // kg (0 = sin escribir)
  reduccion: number; // % (MDI)
  basalPct: number; // 40-50
  regla: 1700 | 1800;
  objetivo: number; // mg/dl
};
export type Resultado = {
  dtdPrevia: number;
  dtdInicial: number;
  basalDia: number;
  basalHora: number;
  ratio: number;
  factor: number;
};

const r1 = (x: number) => Math.round(x * 10) / 10;
const r2 = (x: number) => Math.round(x * 100) / 100;

export function calcular(e: Entrada): Resultado | null {
  const dtdPrevia = e.origen === "mdi" ? e.basal + e.rapida : e.dtdIsci;
  if (!(dtdPrevia > 0)) return null;
  const dtdInicial = e.origen === "mdi" ? dtdPrevia * (1 - e.reduccion / 100) : dtdPrevia;
  const basalDia = (dtdInicial * e.basalPct) / 100;
  return {
    dtdPrevia: r1(dtdPrevia),
    dtdInicial: r1(dtdInicial),
    basalDia: r1(basalDia),
    basalHora: r2(basalDia / 24),
    ratio: r1(450 / dtdInicial),
    factor: Math.round(e.regla / dtdInicial),
  };
}

/* Avisos de la Tabla 1 para el sistema elegido: qué variante deja fuera la DTD o el peso. */
export function fueraDeIndicacion(c: number, dtd: number, peso: number): string[] {
  const avisos: string[] = [];
  const vs = INDICACION[c];
  const dtdFuera = vs.filter((v) => !dentro(dtd, v.dtd));
  if (dtdFuera.length)
    avisos.push(
      `La DTD de inicio (${String(dtd).replace(".", ",")} UI/día) queda fuera de la indicación de ${dtdFuera.map((v) => v.nombre).join(" y ")}.`,
    );
  if (peso > 0) {
    const pesoFuera = vs.filter((v) => !dentro(peso, v.peso));
    if (pesoFuera.length)
      avisos.push(
        `El peso (${peso} kg) queda fuera de la indicación de ${pesoFuera.map((v) => v.nombre).join(" y ")}.`,
      );
  }
  return avisos;
}

/* Límites de lo que se acepta en los campos (para no calcular con un error de tecleo). */
export const LIMITES = { dosis: 400, peso: 250 };
export const num = (s: string) => {
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) && v >= 0 ? v : 0;
};
export const coma = (x: number) => String(x).replace(".", ",");
