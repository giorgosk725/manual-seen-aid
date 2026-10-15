/* Calculadora de parámetros iniciales (#/consultar/inicio/calculadora): aplica las reglas de la
   Tabla 2 y del apartado 8 a las dosis que se escriben, sin nada más. Cada regla y cada texto que
   se enseña es un fragmento literal del capítulo (calculadora.test.ts lo comprueba contra
   TABLAS y el apartado 8). Nada se guarda ni se envía: vive en memoria mientras la app está
   abierta. Orden de los sistemas: columnas de la Tabla 1. */
import { TABLAS } from "./contenido";

export type Origen = "mdi" | "isci" | "aid";
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

/* ---------- El cálculo (0.63.0: contrato de la auditoría de la 0.61, I61-01/02/03/09) ----------
   - Cada campo se lee una sola vez: vacío, válido o inválido (leerCifra). Un vacío o un error no
     son nunca un cero; el campo, el cálculo y los avisos usan la misma lectura.
   - Sin todos los datos necesarios, o con uno inválido, no hay cifras ni propuesta.
   - Los valores se guardan sin redondear; solo se redondean al enseñarlos (y la tasa horaria va
     como aproximación, «≈»). La DTD que admite la ayuda va de 1 a 400 UI/día (límite de software,
     no clínico).
   - La comparación con la Tabla 1 (DTD y peso, nada más) gobierna la propuesta: fuera de la
     indicación de todas las variantes, no hay propuesta; dentro de una sola variante, queda
     pendiente confirmarla. */
export type Lectura =
  { estado: "vacio" } | { estado: "valido"; v: number } | { estado: "invalido"; motivo: string };
export const LIMITES = { dosis: 400, peso: 250, dtdMin: 1, dtdMax: 400 };
export function leerCifra(s: string, max: number): Lectura {
  const t = s.trim();
  if (!t) return { estado: "vacio" };
  if (!/^\d+([.,]\d+)?$/.test(t))
    return { estado: "invalido", motivo: "Solo cifras, con coma o punto decimal." };
  const v = Number(t.replace(",", "."));
  if (!Number.isFinite(v)) return { estado: "invalido", motivo: "Cifra no válida." };
  if (v > max) return { estado: "invalido", motivo: `Revisa la cifra (máximo ${max}).` };
  return { estado: "valido", v };
}

/* Origen: plumas, bomba sin automatización u otro sistema de asa cerrada (apartado 8 y paso 1
   de la fase Inicio). «referencia»: en MDI, una ratio y un factor propios que funcionan; en
   bomba u otro AID, una programación que funcionaba. */
export type Caso = {
  origen: Origen;
  referencia: boolean;
  basal: string;
  rapida: string;
  dtd: string;
  peso: string;
  reduccion: number;
  basalPct: number;
  regla: 1700 | 1800;
};
export type Evaluacion = {
  faltan: string[];
  errores: string[];
  dtdPrevia: number | null;
  dtdInicio: number | null;
  /* Qué se calcula en este caso (lo demás se traslada de la pauta o programación previa). */
  calcula: { basal: boolean; ratioFactor: boolean };
  basalDia: number | null;
  basalHora: number | null;
  ratio: number | null;
  factor: number | null;
  indicacion: { fuera: string[]; variante: string | null };
  /* Todo lo necesario, sin errores ni datos fuera de la indicación comprobada. */
  lista: boolean;
};
/* Control-IQ y CamAPS FX arrancan «tras introducir peso y DTD» (Tabla 2). */
export const pidePesoYDtd = (c?: number) => c === 1 || c === 2;

export function evaluar(c: number | undefined, k: Caso): Evaluacion {
  const faltan: string[] = [];
  const errores: string[] = [];
  const lee = (s: string, max: number, nombre: string, necesario: boolean) => {
    const l = leerCifra(s, max);
    if (l.estado === "vacio" && necesario) faltan.push(nombre);
    if (l.estado === "invalido") errores.push(`${nombre}: ${l.motivo}`);
    return l.estado === "valido" ? l.v : null;
  };
  const mdi = k.origen === "mdi";
  const basal = mdi ? lee(k.basal, LIMITES.dosis, "Insulina basal", true) : null;
  const rapida = mdi ? lee(k.rapida, LIMITES.dosis, "Insulina rápida", true) : null;
  const dtdEscrita = mdi
    ? null
    : lee(k.dtd, LIMITES.dosis, "DTD actual", !k.referencia || pidePesoYDtd(c));
  const peso = lee(k.peso, LIMITES.peso, "Peso", pidePesoYDtd(c));
  let dtdPrevia = mdi ? (basal !== null && rapida !== null ? basal + rapida : null) : dtdEscrita;
  if (dtdPrevia !== null && (dtdPrevia < LIMITES.dtdMin || dtdPrevia > LIMITES.dtdMax)) {
    errores.push(
      `La DTD (${coma(redondea(dtdPrevia, 1))} UI/día) queda fuera de lo que admite esta ayuda (${LIMITES.dtdMin}–${LIMITES.dtdMax} UI/día).`,
    );
    dtdPrevia = null;
  }
  const dtdInicio =
    dtdPrevia === null ? null : mdi ? dtdPrevia * (1 - k.reduccion / 100) : dtdPrevia;
  const calcula = { basal: mdi || !k.referencia, ratioFactor: !k.referencia };
  // Al trasladar una programación, la DTD solo hace falta si el sistema la pide para arrancar.
  const necesitaDtd = mdi || !k.referencia || pidePesoYDtd(c);
  const completo = !faltan.length && !errores.length && (dtdInicio !== null || !necesitaDtd);
  const basalDia =
    completo && calcula.basal && dtdInicio !== null ? (dtdInicio * k.basalPct) / 100 : null;
  const indicacion = { fuera: [] as string[], variante: null as string | null };
  if (c !== undefined) {
    const vs = INDICACION[c];
    const ok = vs.filter(
      (v) =>
        (dtdInicio === null || dentro(dtdInicio, v.dtd)) && (peso === null || dentro(peso, v.peso)),
    );
    if (!ok.length) {
      if (dtdInicio !== null && vs.every((v) => !dentro(dtdInicio, v.dtd)))
        indicacion.fuera.push(
          `La DTD de inicio (${coma(redondea(dtdInicio, 1))} UI/día) queda fuera de la indicación de ${vs.map((v) => v.nombre).join(" y ")}.`,
        );
      if (peso !== null && vs.every((v) => !dentro(peso, v.peso)))
        indicacion.fuera.push(
          `El peso (${coma(peso)} kg) queda fuera de la indicación de ${vs.map((v) => v.nombre).join(" y ")}.`,
        );
      if (!indicacion.fuera.length)
        indicacion.fuera.push(
          `Con esta DTD y este peso no entra en la indicación de ninguna variante (${vs.map((v) => v.nombre).join(", ")}).`,
        );
    } else if (ok.length < vs.length)
      indicacion.variante = `Con estas cifras entra en la indicación de ${ok.map((v) => v.nombre).join(" y ")}, no en la de ${vs
        .filter((v) => !ok.includes(v))
        .map((v) => v.nombre)
        .join(" y ")}: confirma la variante.`;
  }
  return {
    faltan,
    errores,
    dtdPrevia,
    dtdInicio,
    calcula,
    basalDia,
    basalHora: basalDia === null ? null : basalDia / 24,
    ratio: completo && calcula.ratioFactor && dtdInicio !== null ? 450 / dtdInicio : null,
    factor: completo && calcula.ratioFactor && dtdInicio !== null ? k.regla / dtdInicio : null,
    indicacion,
    lista: completo && !indicacion.fuera.length,
  };
}

/* Redondeo solo para enseñar. */
export const redondea = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;
export const coma = (x: number) => String(x).replace(".", ",");
