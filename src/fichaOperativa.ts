/* Fichas operativas de cada sistema (0.77.0, a petición del responsable, 19-10-2026: «no pongas en
   las tarjetas texto literal del capítulo, para eso está el capítulo; que sean lo más operativas y
   lo más fácil de llegar a la información»). Datos cortos, las mismas filas y en el mismo orden en
   los cuatro sistemas para compararlos de un vistazo. Todo sale de las Tablas 1–4 y de los
   apartados del capítulo, sin cifras ni indicaciones nuevas: cada dato lleva las piezas de las que
   sale (`f`), que dan la línea de fuente al pie y llevan al texto literal. Orden de los sistemas:
   el de la Tabla 1 (MiniMed 780G, Control-IQ, CamAPS FX, Omnipod 5). */
import type { Pieza } from "./inicio";
import { fuentesDePiezas } from "./fuentesPiezas";

/* Si un parámetro actúa en el modo automático (Tabla 1, fila de parámetros, y Tabla 3). */
export type EnAutomatico = "si" | "no" | "inicio" | "fijo";

export interface Dato {
  r: string;
  v: string;
  /* El detalle, en una segunda línea más discreta. */
  n?: string;
  /* La condición de la fila (Tabla 4), bajo el rótulo. */
  cond?: string;
  /* Lo que cambia con la variante del sistema (Control-IQ+, Liberty). */
  variante?: { nombre: string; v: string };
  auto?: EnAutomatico;
  f: Pieza[];
}
export interface GrupoFicha {
  titulo: string;
  datos: Dato[];
}

const t1 = (fila: number): Pieza => ({ t: "casilla", tabla: "T1", fila });
const t3 = (fila: number): Pieza => ({ t: "casilla", tabla: "T3", fila });
const t4 = (fila: number): Pieza => ({ t: "casilla", tabla: "T4", fila });
const INICIALIZACION: Pieza = { t: "inicializacion" };
const fr = (apartado: string, bloque: string, k: number[]): Pieza => ({
  t: "frase",
  apartado,
  bloque,
  k,
});
const NOCHE = fr("09-descarga", "b7", [1]);
const TARDIA = fr("09-descarga", "b6", [1]);
/* El ascenso tardío tras comidas grasas o proteicas (apartado 9) y, en los sistemas sin función
   específica, la individualización. */
const TARDIA_INICIO = fr("09-descarga", "b6", [0]);
const TARDIA_RESTO = fr("09-descarga", "b6", [2]);
const C_GRASA =
  "Si el ascenso aparece 3–5 h después: valorar grasa y proteínas, bolo insuficiente o estrategia prandial";
const N_INDIVIDUALIZAR =
  "Individualizar la estrategia según las herramientas disponibles, la respuesta previa y el riesgo de hipoglucemia";
const BASAL_PESO = fr("08-iniciacion", "b8", [2]);
const DESCONEXION = fr("07-educacion", "b11", [1, 2]);

/* ---------- Cómo funciona: el algoritmo ---------- */
export const ALGORITMO: Dato[][] = [
  [
    { r: "Tipo", v: "SmartGuard · PID + lógica difusa", f: [t1(3)] },
    { r: "Funciona en", v: "La bomba", f: [t1(2)] },
    { r: "Administra", v: "Microbolos cada 5 min", f: [t1(4)] },
    { r: "Objetivo", v: "100, 110 o 120 mg/dl", f: [t1(6)] },
    {
      r: "Corrección automática",
      v: "Sí, cada 5 min si predice > 120 mg/dl",
      n: "Safe Bolus la reduce si predice hipoglucemia",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje",
      v: "Basal automática cada medianoche",
      n: "Con la DTD de los últimos 2–6 días",
      f: [t1(3)],
    },
  ],
  [
    { r: "Tipo", v: "Control-IQ · MPC, predicción a 30 min", f: [t1(3)] },
    { r: "Funciona en", v: "La bomba", f: [t1(2)] },
    {
      r: "Administra",
      v: "Modula la basal programada cada 5 min",
      n: "La aumenta, la reduce o la suspende",
      f: [t1(4)],
    },
    {
      r: "Objetivo",
      v: "112,5–160 mg/dl, fijo",
      n: "Modo sueño 112,5–120 · modo ejercicio 140–160",
      f: [t1(6)],
    },
    {
      r: "Corrección automática",
      v: "Sí, máx. una por hora si predice > 180 mg/dl a 30 min",
      n: "60 % de la dosis, hacia 110 mg/dl; no en modo sueño",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje",
      v: "No aprende",
      n: "Su rendimiento depende de mantener optimizados la basal y el factor de sensibilidad",
      f: [t1(3)],
    },
  ],
  [
    { r: "Tipo", v: "CamAPS FX · MPC adaptativo, predicción a 2,5–4 h", f: [t1(3), t1(4)] },
    { r: "Funciona en", v: "La app del smartphone", f: [t1(2)] },
    { r: "Administra", v: "Bolos extendidos cada 8–12 min", f: [t1(4)] },
    {
      r: "Objetivo",
      v: "80–198 mg/dl, por tramos",
      n: "Tramos de hasta 30 min · de fábrica, 104 mg/dl",
      f: [t1(6)],
    },
    {
      r: "Corrección automática",
      v: "No, sin bolos diferenciados",
      n: "Modula la administración continua",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje",
      v: "Multinivel, cada 24 h",
      n: "DTD, variaciones diurnas y patrones posprandiales",
      f: [t1(3)],
    },
  ],
  [
    { r: "Tipo", v: "SmartAdjust · MPC, predicción a 60 min", f: [t1(3), t1(4)] },
    {
      r: "Funciona en",
      v: "El pod",
      n: "Controlador (Europa) o app del smartphone (EE. UU.)",
      f: [t1(2)],
    },
    {
      r: "Administra",
      v: "Microbolos cada 5 min",
      n: "Con su basal adaptativa, que sustituye al perfil basal",
      f: [t1(4)],
    },
    {
      r: "Objetivo",
      v: "110–150 mg/dl, hasta 8 tramos",
      n: "110, 120, 130, 140 o 150 mg/dl",
      f: [t1(6)],
    },
    {
      r: "Corrección automática",
      v: "No, sin bolos automáticos",
      n: "Incrementa la basal adaptativa hasta un 400 %",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje",
      v: "Basal adaptativa con cada pod",
      n: "Pondera los pods más recientes",
      f: [t1(3)],
    },
  ],
];

/* La variante del sistema y lo que cambia (Control-IQ+; CamAPS Liberty). */
export const VARIANTE_OPERATIVA: (GrupoFicha | null)[] = [
  null,
  {
    titulo: "Control-IQ+",
    datos: [
      {
        r: "Cuál lleva",
        v: "Control-IQ o Control-IQ+, según el dispositivo (t:slim X2 o Mobi) y la versión de software",
        f: [fr("04-sistemas", "b4", [1])],
      },
      {
        r: "Basal temporal",
        v: "0–250 % durante 15 min–72 h, sin perder las correcciones automáticas",
        f: [t3(1)],
      },
      { r: "Bolo extendido", v: "De 15 min a 8 h (Control-IQ: hasta 2 h)", f: [t4(5)] },
      {
        r: "Indicación",
        v: "≥ 2 años; diabetes tipo 2 y gestación autorizadas (FDA y marcado CE)",
        f: [t1(7), t1(8)],
      },
    ],
  },
  {
    titulo: "CamAPS Liberty",
    datos: [
      {
        r: "Qué es",
        v: "Asa cerrada completa: el sistema gestiona toda la insulina y el bolo de comida queda como opción",
        f: [fr("03-algoritmos", "b3", [1])],
      },
      { r: "Mantiene", v: "Boost y Ease-off", f: [fr("03-algoritmos", "b3", [1])] },
    ],
  },
  null,
];

/* ---------- Indicación y material ---------- */
export const INDICACION: GrupoFicha[][] = [
  [
    {
      titulo: "Indicación",
      datos: [
        { r: "Edad y dosis", v: "≥ 2 años; DTD ≥ 6 UI/día", f: [t1(7)] },
        { r: "Diabetes tipo 2", v: "Autorizado (marcado CE)", f: [t1(7)] },
        { r: "Gestación", v: "Autorizado (CE); ensayo CRISTAL", f: [t1(8)] },
      ],
    },
    {
      titulo: "Material",
      datos: [
        {
          r: "Formato",
          v: "Bomba con catéter; reservorio 180/300 UI; set hasta 7 días",
          f: [t1(0)],
        },
        { r: "Sensores", v: "Guardian 4 · Simplera Sync · Instinct", f: [t1(1)] },
        { r: "Descarga", v: "CareLink", f: [t1(9)] },
      ],
    },
    {
      titulo: "Paso a modo automático",
      datos: [
        { r: "Cuándo", v: "Tras 48 h de insulina en modo manual", f: [INICIALIZACION] },
        {
          r: "Programar",
          v: "Objetivo · duración de la insulina activa · ratio I/HC",
          f: [INICIALIZACION],
        },
      ],
    },
  ],
  [
    {
      titulo: "Indicación",
      datos: [
        {
          r: "Edad y dosis",
          v: "Control-IQ: ≥ 6 años; 25–140 kg; DTD 10–100 UI/día",
          variante: { nombre: "Control-IQ+", v: "≥ 2 años; 9–200 kg; DTD 5–200 UI/día" },
          f: [t1(7)],
        },
        {
          r: "Diabetes tipo 2",
          v: "Control-IQ: no consta en el capítulo",
          variante: { nombre: "Control-IQ+", v: "Autorizado (FDA y marcado CE)" },
          f: [t1(7)],
        },
        {
          r: "Gestación",
          v: "Control-IQ: sin autorización",
          variante: { nombre: "Control-IQ+", v: "Autorizado (FDA y CE); ensayo CIRCUIT" },
          f: [t1(8)],
        },
      ],
    },
    {
      titulo: "Material",
      datos: [
        {
          r: "Formato",
          v: "Bomba con catéter: t:slim X2 (300 UI) o Mobi, más compacta (200 UI)",
          f: [t1(0)],
        },
        { r: "Sensores", v: "Dexcom G6 · G7", f: [t1(1)] },
        { r: "Descarga", v: "Tandem Source", f: [t1(9)] },
      ],
    },
    {
      titulo: "Paso a modo automático",
      datos: [
        { r: "Cuándo", v: "Al introducir peso y DTD", f: [INICIALIZACION] },
        {
          r: "Programar",
          v: "Tasa basal · factor de sensibilidad · ratio I/HC",
          f: [INICIALIZACION],
        },
      ],
    },
  ],
  [
    {
      titulo: "Indicación",
      datos: [
        {
          r: "Edad y dosis",
          v: "≥ 1 año; ≥ 10 kg; DTD 5–350 UI/día",
          variante: { nombre: "Liberty", v: "> 13 años" },
          f: [t1(7)],
        },
        { r: "Diabetes tipo 2", v: "No consta en el capítulo", f: [t1(7)] },
        {
          r: "Gestación",
          v: "Autorizado (CE); ensayo AiDAPT",
          variante: { nombre: "Liberty", v: "No autorizado" },
          f: [t1(8)],
        },
      ],
    },
    {
      titulo: "Material",
      datos: [
        { r: "Formato", v: "Bomba con catéter (YpsoPump, 160 UI)", f: [t1(0)] },
        { r: "Sensores", v: "Dexcom G7 · FreeStyle Libre 3 Plus", f: [t1(1)] },
        { r: "Descarga", v: "Glooko", f: [t1(9)] },
      ],
    },
    {
      titulo: "Paso a modo automático",
      datos: [
        { r: "Cuándo", v: "Al introducir peso y DTD", f: [INICIALIZACION] },
        { r: "Programar", v: "Objetivo personal · ratios I/HC", f: [INICIALIZACION] },
      ],
    },
  ],
  [
    {
      titulo: "Indicación",
      datos: [
        { r: "Edad y dosis", v: "≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día", f: [t1(7)] },
        { r: "Diabetes tipo 2", v: "Autorizado por la FDA (≥ 18 años)", f: [t1(7)] },
        { r: "Gestación", v: "Sin autorización", f: [t1(8)] },
      ],
    },
    {
      titulo: "Material",
      datos: [
        { r: "Formato", v: "Pod desechable sin tubo; ≤ 200 UI; 72 h", f: [t1(0)] },
        { r: "Sensores", v: "Dexcom G7 · FreeStyle Libre 2 Plus", f: [t1(1)] },
        { r: "Descarga", v: "Omnipod Discover", f: [t1(9)] },
      ],
    },
    {
      titulo: "Paso a modo automático",
      datos: [
        { r: "Cuándo", v: "Desde el primer pod", f: [INICIALIZACION] },
        {
          r: "Programar",
          v: "Tasa basal inicial (estima la DTD) · objetivo · ratio I/HC · factor de sensibilidad · duración de la insulina activa",
          f: [INICIALIZACION],
        },
      ],
    },
  ],
];

/* ---------- Parámetros (Tabla 3, con lo que cuenta en automático según la Tabla 1) ---------- */
const P_OBJ = "Objetivo glucémico";
const P_BASAL = "Tasa basal programada";
const P_RATIO = "Ratio I/HC";
const P_FS = "Factor de sensibilidad";
const P_DIA = "Duración de la insulina activa";
const RATIO_COMUN = "Clave del bolo prandial: ajustar si el patrón posprandial no es adecuado";
export const PARAMETROS: Dato[][] = [
  [
    {
      r: P_OBJ,
      auto: "si",
      v: "100, 110 o 120 mg/dl. Objetivo temporal de 150 mg/dl: suspende las autocorrecciones mientras está activo",
      f: [t3(0), t1(10)],
    },
    {
      r: P_DIA,
      auto: "si",
      v: "2–8 h. Más corta, intensifica sobre todo las autocorrecciones",
      f: [t3(4), t1(10)],
    },
    { r: P_RATIO, auto: "no", v: RATIO_COMUN, f: [t3(2), t1(10)] },
    {
      r: P_FS,
      auto: "no",
      v: "Solo en el calculador de bolos fuera del automático; no cambia las autocorrecciones",
      f: [t3(3)],
    },
    {
      r: P_BASAL,
      auto: "no",
      v: "Solo en modo manual o de respaldo",
      f: [t3(1), BASAL_PESO],
    },
  ],
  [
    {
      r: P_BASAL,
      auto: "si",
      v: "Control-IQ la modula de forma continua: conviene ajustarla bien",
      variante: { nombre: "Control-IQ+", v: "Basal temporal 0–250 %, 15 min–72 h" },
      f: [t3(1), t1(10), BASAL_PESO],
    },
    {
      r: P_FS,
      auto: "si",
      v: "Condiciona las correcciones manuales, las automáticas y la intensidad de la modulación basal",
      f: [t3(3), t1(10)],
    },
    { r: P_RATIO, auto: "no", v: RATIO_COMUN, f: [t3(2), t1(10)] },
    {
      r: P_OBJ,
      auto: "fijo",
      v: "Fijo, no configurable: se actúa con la basal, el factor de sensibilidad y los modos sueño (112,5–120 mg/dl) y ejercicio (140–160 mg/dl)",
      f: [t3(0)],
    },
    {
      r: P_DIA,
      auto: "no",
      v: "No modificable en automático; solo se usa fuera de él",
      f: [t3(4)],
    },
  ],
  [
    {
      r: P_OBJ,
      auto: "si",
      v: "Por tramos de hasta 30 min (80–198 mg/dl). Boost intensifica la administración; Ease-off eleva el objetivo",
      f: [t3(0), t1(10)],
    },
    {
      r: P_RATIO,
      auto: "no",
      v: "Clave del bolo prandial; la respuesta posprandial alimenta el aprendizaje del algoritmo",
      f: [t3(2), t1(10)],
    },
    {
      r: P_FS,
      auto: "no",
      v: "El algoritmo adapta su propia sensibilidad; el factor configurado se usa solo en el calculador",
      f: [t3(3), fr("10-situaciones", "b7", [0])],
    },
    {
      r: P_DIA,
      auto: "no",
      v: "2–8 h, solo en el calculador; el algoritmo estima la insulina activa por su cuenta",
      f: [t3(4)],
    },
    {
      r: P_BASAL,
      auto: "no",
      v: "Solo en modo manual o de respaldo",
      f: [t3(1), BASAL_PESO],
    },
  ],
  [
    {
      r: P_OBJ,
      auto: "si",
      v: "Hasta 8 tramos (110–150 mg/dl). La Función Actividad lo fija en 150 mg/dl",
      f: [t3(0), t1(10)],
    },
    {
      r: P_BASAL,
      auto: "inicio",
      v: "Estima la DTD con la que arranca el primer pod y sirve en manual; después no influye",
      f: [t3(1), BASAL_PESO],
    },
    {
      r: P_RATIO,
      auto: "no",
      v: "Clave del bolo prandial; los bolos suman a la DTD que actualiza la basal adaptativa",
      f: [t3(2), t1(10)],
    },
    {
      r: P_FS,
      auto: "no",
      v: "Solo en SmartBolus, para correcciones; no cambia SmartAdjust",
      f: [t3(3), t1(10)],
    },
    {
      r: P_DIA,
      auto: "no",
      v: "2–6 h, en el calculador; influye de forma indirecta si cambia la DTD de forma sostenida",
      f: [t3(4), t1(10)],
    },
  ],
];

/* ---------- Modos y funciones (Tabla 4 y apartados 7, 9 y 10) ----------
   0.77.1 (auditoría del perfil senior): cada fila con la condición de la Tabla 4 bajo el rótulo
   («sin sospecha de fallo de infusión»…); la hipoglucemia nocturna aparte, con lo que el
   apartado 9 manda revisar antes; alcohol y agua en los cuatro sistemas. */
const ANAEROBICO_COMUN = "Sin modo temporal: mantener el objetivo estándar";
const PUNTUAL = "Mantener el automático y bolo corrector según el calculador";
const NECESIDAD = "Más monitorización, vigilar cetonemia y mantener el automático";
const FALLO = "Cetonemia, corrección con pluma y cambio de set según el plan de seguridad";
const PAUSAR = "Suspender o pausar la administración al desconectar la bomba";
const R_AEROBICO = "Ejercicio aeróbico o riesgo previsible de hipoglucemia";
const C_AEROBICO = "Activar 1–2 h antes; duración según la respuesta previa";
const R_NECESIDAD = "Más necesidad transitoria leve";
const C_NECESIDAD = "Enfermedad leve, menstruación o estrés, sin sospecha de fallo de infusión";
const C_SIN_FALLO = "Sin sospecha de fallo de infusión";
const C_NOCTURNA =
  "Antes, revisar ejercicio vespertino, alcohol, bolo tardío de cena, correcciones, objetivo y ratios, y si el patrón se concentra en una franja";
const ALCOHOL = fr("10-situaciones", "b14", [2]);
const N_ALCOHOL = "Prudencia con los bolos de las comidas con alcohol";
const AGUA_CATETER: Dato = {
  r: "Agua y deportes de contacto",
  v: "Puede ser necesario retirar la bomba, según el dispositivo y el fabricante",
  n: "Evitar desconexiones de más de 1 h: riesgo de hiperglucemia y cetosis",
  f: [fr("10-situaciones", "b24", [0, 3])],
};
const ANAEROBICO: Dato = {
  r: "Ejercicio anaeróbico o de alta intensidad",
  v: ANAEROBICO_COMUN,
  f: [t4(1)],
};
export const MODOS: Dato[][] = [
  [
    {
      r: R_AEROBICO,
      cond: C_AEROBICO,
      v: "Objetivo temporal 150 mg/dl",
      n: "Suspende las autocorrecciones mientras está activo",
      f: [t4(0)],
    },
    ANAEROBICO,
    { r: "Noche", v: "Sin modo nocturno específico", f: [t4(2)] },
    {
      r: "Hipoglucemia nocturna",
      cond: C_NOCTURNA,
      v: "Un objetivo más alto o temporal puede ayudar",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      cond: C_NECESIDAD,
      v: `${NECESIDAD}; ajustar objetivo o duración de la insulina activa`,
      f: [t4(3)],
    },
    {
      r: "Hiperglucemia puntual",
      cond: C_SIN_FALLO,
      v: "Mantener SmartGuard; si se mantiene, confirmar con glucemia capilar y bolo corrector del sistema",
      f: [t4(4)],
    },
    {
      r: "Comida grasa o proteica",
      cond: C_GRASA,
      v: "Sin función específica",
      n: N_INDIVIDUALIZAR,
      f: [t4(5), TARDIA_INICIO, TARDIA_RESTO],
    },
    {
      r: "Alcohol",
      v: "Hipoglucemia diferida hasta 12–24 h: objetivo más conservador esa noche y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    AGUA_CATETER,
    { r: "Sospecha de fallo de infusión", v: FALLO, f: [t4(6)] },
    { r: "Desconexión", v: PAUSAR, f: [DESCONEXION] },
  ],
  [
    {
      r: R_AEROBICO,
      cond: C_AEROBICO,
      v: "Modo ejercicio (140–160 mg/dl)",
      n: "Reduce o suspende la insulina si predice descenso; mantiene las autocorrecciones si se superan los umbrales",
      f: [t4(0)],
    },
    ANAEROBICO,
    {
      r: "Noche",
      v: "Modo sueño (112,5–120 mg/dl) en una franja configurable",
      n: "Modula la basal, sin bolos de autocorrección",
      f: [t4(2)],
    },
    {
      r: "Hipoglucemia nocturna",
      cond: C_NOCTURNA,
      v: "El modo sueño no autocorrige, pero ajusta la basal",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      cond: C_NECESIDAD,
      v: `${NECESIDAD}; ajustar tasa basal y factor de sensibilidad`,
      variante: { nombre: "Control-IQ+", v: "Dispone además de basal temporal del 0 al 250 %" },
      f: [t4(3), t3(1)],
    },
    { r: "Hiperglucemia puntual", cond: C_SIN_FALLO, v: PUNTUAL, f: [t4(4)] },
    {
      r: "Comida grasa o proteica",
      cond: C_GRASA,
      v: "Bolo extendido hasta 2 h",
      variante: { nombre: "Control-IQ+", v: "De 15 min a 8 h" },
      f: [t4(5), TARDIA_INICIO, TARDIA],
    },
    {
      r: "Alcohol",
      v: "Hipoglucemia diferida hasta 12–24 h: objetivo más conservador esa noche y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    AGUA_CATETER,
    { r: "Sospecha de fallo de infusión", v: FALLO, f: [t4(6)] },
    { r: "Desconexión", v: PAUSAR, f: [DESCONEXION] },
  ],
  [
    {
      r: R_AEROBICO,
      cond: C_AEROBICO,
      v: "Ease-off: eleva el objetivo y reduce la insulina",
      n: "Inicio inmediato o diferido y duración configurable; si la hipoglucemia se repite en un tramo horario, valorar un objetivo más alto en ese periodo",
      f: [t4(0)],
    },
    {
      ...ANAEROBICO,
      v: `${ANAEROBICO_COMUN}; no usar Boost de rutina (hipoglucemia diferida)`,
    },
    { r: "Noche", v: "Sin modo nocturno específico: objetivo por tramos", f: [t4(2)] },
    {
      r: "Hipoglucemia nocturna",
      cond: C_NOCTURNA,
      v: "Ease-off o un objetivo más alto",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      cond: C_NECESIDAD,
      v: `${NECESIDAD}; valorar Boost y, si se mantiene, ajustar el objetivo`,
      f: [t4(3)],
    },
    {
      r: "Hiperglucemia puntual",
      cond: C_SIN_FALLO,
      v: "Mantener el automático; Boost o bolo corrector según el calculador",
      f: [t4(4)],
    },
    {
      r: "Comida grasa o proteica",
      cond: C_GRASA,
      v: "Función de comida de absorción lenta",
      f: [t4(5), TARDIA_INICIO, TARDIA],
    },
    {
      r: "Alcohol",
      v: "Hipoglucemia diferida hasta 12–24 h: Ease-off u objetivo más conservador esa noche y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    AGUA_CATETER,
    { r: "Sospecha de fallo de infusión", v: FALLO, f: [t4(6)] },
    { r: "Desconexión", v: PAUSAR, f: [DESCONEXION] },
  ],
  [
    {
      r: R_AEROBICO,
      cond: C_AEROBICO,
      v: "Función Actividad (150 mg/dl)",
      n: "Reduce la insulina automática; duración programable de 1 a 24 h",
      f: [t4(0)],
    },
    ANAEROBICO,
    { r: "Noche", v: "Sin modo nocturno específico: objetivo por tramos", f: [t4(2)] },
    {
      r: "Hipoglucemia nocturna",
      cond: C_NOCTURNA,
      v: "Función Actividad (objetivo 150 mg/dl) o un objetivo configurado más alto",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      cond: C_NECESIDAD,
      v: `${NECESIDAD}; ajustar el objetivo`,
      f: [t4(3)],
    },
    { r: "Hiperglucemia puntual", cond: C_SIN_FALLO, v: PUNTUAL, f: [t4(4)] },
    {
      r: "Comida grasa o proteica",
      cond: C_GRASA,
      v: "Bolo extendido solo en modo manual",
      n: N_INDIVIDUALIZAR,
      f: [t4(5), TARDIA_INICIO, TARDIA_RESTO],
    },
    {
      r: "Alcohol",
      v: "Hipoglucemia diferida hasta 12–24 h: objetivo más conservador esa noche y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    {
      r: "Agua",
      v: "Puede mantenerse en actividades acuáticas, dentro de los límites de inmersión del fabricante",
      n: "La inmersión puede limitar la comunicación entre el sensor y el sistema",
      f: [fr("10-situaciones", "b24", [1, 2])],
    },
    {
      r: "Sospecha de fallo de infusión",
      v: "Cetonemia, corrección con pluma y cambio de pod según el plan de seguridad",
      f: [t4(6)],
    },
    {
      r: "Desconexión",
      v: "El pod no se desconecta: si falla o se despega, se sustituye",
      f: [DESCONEXION],
    },
  ],
];

/* La tarjeta de cada sistema en la entrada de Sistemas AID: tres datos del algoritmo y, en una
   línea, lo que añade su variante. */
export const RESUMEN = ["Funciona en", "Objetivo", "Corrección automática"] as const;
export const VARIANTE_RESUMEN: (Dato | null)[] = [
  null,
  {
    r: "Control-IQ+",
    v: "≥ 2 años · diabetes tipo 2 y gestación autorizadas (FDA y CE) · basal temporal 0–250 %",
    f: [t1(7), t1(8), t3(1)],
  },
  {
    r: "Liberty",
    v: "Asa cerrada completa · > 13 años · no autorizado en gestación",
    f: [fr("03-algoritmos", "b3", [1]), t1(7), t1(8)],
  },
  null,
];

/* La línea de fuente de unos datos: las piezas del capítulo de las que salen, sin repetir. */
export const fuentesDeDatos = (datos: Dato[]) => fuentesDePiezas(datos.flatMap((d) => d.f));
