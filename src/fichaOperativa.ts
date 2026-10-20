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
export type EnAutomatico = "si" | "no" | "inicio" | "fijo" | "manual";

export interface Dato {
  r: string;
  v: string;
  /* El detalle, en una segunda línea más discreta. */
  n?: string;
  /* La condición de la fila (Tabla 4), bajo el rótulo. */
  cond?: string;
  /* Lo que el capítulo manda hacer antes (activar 1–2 h antes, revisar…), con el mismo peso que
     la respuesta, antes de ella. */
  antes?: string;
  /* Lo que cambia con la variante del sistema (Control-IQ+, Liberty). */
  variante?: { nombre: string; v: string };
  auto?: EnAutomatico;
  /* Adónde seguir en la app (otra herramienta), sin texto nuevo. */
  enlace?: { texto: string; ruta: string };
  f: Pieza[];
}
export interface GrupoFicha {
  titulo: string;
  datos: Dato[];
}

/* El rótulo de una fila, como clave de dirección («Agua y deportes de contacto» → «agua-y-…»). */
export const slugDato = (r: string) =>
  r
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
const NOCHE = fr("09-descarga", "b7", [0, 1]);
const TARDIA = fr("09-descarga", "b6", [1]);
/* El ascenso tardío tras comidas grasas o proteicas (apartado 9) y, en los sistemas sin función
   específica, la individualización. */
const TARDIA_INICIO = fr("09-descarga", "b6", [0]);
const TARDIA_RESTO = fr("09-descarga", "b6", [2]);
const C_GRASA =
  "Si el ascenso aparece 3–5 h después de la ingesta: valorar el efecto de la grasa y las proteínas, un bolo insuficiente o una estrategia prandial inadecuada";
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
      r: "Bolos automáticos de corrección",
      v: "Sí, hasta uno cada 5 min si predice > 120 mg/dl",
      n: "Safe Bolus reduce la dosis si se predice hipoglucemia",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
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
      f: [t1(6), t3(0)],
    },
    {
      r: "Bolos automáticos de corrección",
      v: "Sí, máx. uno por hora si predice > 180 mg/dl a 30 min",
      n: "Administra el 60 % de la dosis para un objetivo de 110 mg/dl; no actúa en modo sueño",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
      v: "No incorpora autoaprendizaje",
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
      n: "Bloques de hasta cada 30 min · de fábrica, 104 mg/dl",
      f: [t1(6)],
    },
    {
      r: "Bolos automáticos de corrección",
      v: "No, sin bolos diferenciados",
      n: "Modula la administración continua",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
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
      n: "Control mediante el controlador (Europa) o la app del smartphone (EE. UU.)",
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
      v: "110, 120, 130, 140 o 150 mg/dl",
      n: "Hasta 8 tramos/día",
      f: [t1(6)],
    },
    {
      r: "Bolos automáticos de corrección",
      v: "No, sin bolos automáticos",
      n: "Incrementa la basal adaptativa hasta un 400 %",
      f: [t1(5)],
    },
    {
      r: "Aprendizaje y adaptación",
      v: "Adapta la basal por pod",
      n: "La recalcula con cada cambio de pod a partir del historial de administración, ponderando los pods más recientes",
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
        r: "Versión del algoritmo",
        v: "Control-IQ o Control-IQ+, según el dispositivo y la versión de software",
        f: [fr("04-sistemas", "b4", [1])],
      },
    ],
  },
  {
    titulo: "CamAPS Liberty",
    datos: [
      {
        r: "Qué es",
        v: "Asa cerrada completa: el sistema gestiona toda la administración de insulina; el bolo manual queda como opción discrecional",
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
        { r: "Gestación", v: "Autorizado (CE); evidencia: CRISTAL", f: [t1(8)] },
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
          variante: { nombre: "Control-IQ+", v: "Autorizado (FDA y CE); evidencia: CIRCUIT" },
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
          v: "Autorizado (CE); evidencia: AiDAPT",
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
      v: "No interviene en SmartGuard: se usa en el calculador de bolos fuera del automático; no modifica las autocorrecciones",
      f: [t3(3)],
    },
    {
      r: P_BASAL,
      auto: "manual",
      v: "Se utiliza en modo manual o de respaldo; no influye en el modo automático",
      f: [t3(1), BASAL_PESO],
    },
  ],
  [
    {
      r: P_BASAL,
      auto: "si",
      v: "Control-IQ la modula de forma continua: conviene ajustarla bien",
      variante: {
        nombre: "Control-IQ+",
        v: "Añade además basal temporal del 0 al 250 % durante 15 min–72 h, manteniendo las correcciones automáticas",
      },
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
      v: "Fijo: se interviene con la tasa basal, el factor de sensibilidad y los modos sueño (112,5–120 mg/dl) y ejercicio (140–160 mg/dl)",
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
      v: "Por tramos, en bloques de hasta cada 30 min (80–198 mg/dl). Boost intensifica la administración; Ease-off eleva el objetivo",
      f: [t3(0), t1(10)],
    },
    {
      r: P_RATIO,
      auto: "no",
      v: "Clave del bolo prandial; la respuesta posprandial contribuye a la adaptación del algoritmo",
      f: [t3(2), t1(10)],
    },
    {
      r: P_FS,
      auto: "no",
      v: "El algoritmo adapta internamente su sensibilidad; el factor configurado se usa en el calculador para correcciones indicadas por la persona y no ajusta directamente la modulación automática",
      f: [t3(3), fr("10-situaciones", "b7", [0])],
    },
    {
      r: P_DIA,
      auto: "no",
      v: "2–8 h; se usa en el calculador de bolos; el algoritmo estima la insulina activa de forma automática",
      f: [t3(4)],
    },
    {
      r: P_BASAL,
      auto: "manual",
      v: "Se utiliza en modo manual o de respaldo; no influye en el modo automático",
      f: [t3(1), BASAL_PESO],
    },
  ],
  [
    {
      r: P_OBJ,
      auto: "si",
      v: "110, 120, 130, 140 o 150 mg/dl, hasta 8 tramos/día. La Función Actividad lo fija en 150 mg/dl",
      f: [t3(0), t1(10)],
    },
    {
      r: P_BASAL,
      auto: "inicio",
      v: "Se usa en modo manual o de respaldo y para estimar la DTD inicial del primer pod; después no influye en el automático",
      f: [t3(1), BASAL_PESO],
    },
    {
      r: P_RATIO,
      auto: "no",
      v: "Clave del bolo prandial; los bolos administrados contribuyen a la DTD que actualiza la basal adaptativa en pods sucesivos",
      f: [t3(2), t1(10)],
    },
    {
      r: P_FS,
      auto: "no",
      v: "Se usa en SmartBolus para correcciones indicadas por la persona; no modifica directamente SmartAdjust",
      f: [t3(3), t1(10)],
    },
    {
      r: P_DIA,
      auto: "no",
      v: "2–6 h; se usa en el calculador; puede influir de forma indirecta a través de cambios sostenidos en la DTD",
      f: [t3(4), t1(10)],
    },
  ],
];

/* ---------- Modos y funciones (Tabla 4 y apartados 7, 9 y 10) ----------
   0.77.1 (auditoría del perfil senior): cada fila con la condición de la Tabla 4 en la columna del
   dato; la hipoglucemia nocturna aparte, con lo que el apartado 9 manda revisar antes; alcohol y
   agua en los cuatro sistemas. 0.78.1 (segunda ronda): las palabras que dan el matiz de la tabla
   («habitualmente», «valorar», «posibles», «si es posible», «temporalmente»). */
const ANAEROBICO_V = "Habitualmente sin modo temporal específico: mantener el objetivo estándar";
const ANAEROBICO_N = "Para no favorecer la hiperglucemia reactiva";
const PUNTUAL = "Mantener el automático y administrar bolo corrector según el calculador";
const NECESIDAD = "Intensificar la monitorización, vigilar cetonemia y mantener el automático";
const FALLO = "Medir cetonemia, corregir con pluma y recambiar el set según el plan de seguridad";
/* 0.79.1 (tercera ronda, guardia): la Figura 3, a un toque desde la fila. */
const FIGURA_3 = { texto: "Hiperglucemia y cetonemia (Figura 3)", ruta: "#/consultar/figura-3" };
const PAUSAR =
  "Suspender o pausar la administración al desconectar la bomba, según las instrucciones del fabricante";
/* El umbral operativo de la interrupción (apartado 7) y su herramienta. */
const UMBRAL_1H =
  "A partir de aproximadamente 1 h sin insulina, actuar: glucemia capilar, cetonemia según el contexto y reposición de la insulina no administrada";
const INTERRUPCION = { texto: "Interrupción del sistema", ruta: "#/consultar/interrupcion" };
/* 0.81.1 (quinta ronda, adjunto): de la enfermedad leve a su guía (hidratación, cetosis con
   glucosa normal, cuándo pasar a la Figura 3). */
const ENFERMEDAD = {
  texto: "Enfermedad intercurrente y riesgo de cetosis",
  ruta: "#/consultar/situacion/enfermedad-intercurrente",
};
const R_AEROBICO =
  "Ejercicio aeróbico planificado o situación previsible de mayor riesgo de hipoglucemia";
const C_AEROBICO =
  "Activar la función temporal 1–2 h antes e individualizar la duración según la respuesta previa";
const R_NECESIDAD =
  "Mayor necesidad transitoria leve sin sospecha de fallo de infusión (enfermedad leve, menstruación o estrés)";
const R_PUNTUAL = "Hiperglucemia puntual sin sospecha de fallo de infusión";
const R_FALLO = "Hiperglucemia persistente o inexplicada (sospecha de fallo de infusión)";
const C_NOCTURNA =
  "Antes de subir objetivos globalmente, revisar ejercicio vespertino, alcohol, bolo tardío de cena, corrección manual, objetivo demasiado bajo o ratios agresivas, y si el patrón se concentra en una franja";
const ALCOHOL = fr("10-situaciones", "b14", [2]);
const N_ALCOHOL =
  "Educar sobre la prudencia con los bolos prandiales en comidas asociadas a alcohol";
const AGUA_CATETER: Dato = {
  r: "Agua y deportes de contacto",
  v: "Puede ser necesario retirar temporalmente la bomba, según el dispositivo, las recomendaciones del fabricante y el tipo y duración de la actividad",
  n: "La resistencia al agua no implica necesariamente que se recomiende nadar con la bomba; las desconexiones de más de 1 h pueden aumentar el riesgo de hiperglucemia y cetosis",
  f: [fr("10-situaciones", "b24", [0, 1, 3])],
};
const ANAEROBICO: Dato = {
  r: "Ejercicio anaeróbico o de alta intensidad",
  v: ANAEROBICO_V,
  n: ANAEROBICO_N,
  f: [t4(1)],
};
const GRASA = (v: string, extra: Partial<Dato>, f: Pieza[]): Dato => ({
  r: "Comida rica en grasa o proteína",
  antes: C_GRASA,
  v,
  // 0.78.1 (segunda ronda, R3): la actuación ante el patrón posprandial está en la Tabla 5.
  enlace: { texto: "Patrón posprandial: descarga, paso 6", ruta: "#/consultar/descarga/6" },
  ...extra,
  f: [t4(5), TARDIA_INICIO, ...f],
});
export const MODOS: Dato[][] = [
  [
    {
      r: R_AEROBICO,
      antes: C_AEROBICO,
      v: "Objetivo temporal 150 mg/dl",
      n: "Suspende las autocorrecciones mientras está activo",
      f: [t4(0)],
    },
    ANAEROBICO,
    { r: "Sueño/período nocturno", v: "Sin modo nocturno específico", f: [t4(2)] },
    {
      r: "Hipoglucemia nocturna",
      antes: C_NOCTURNA,
      v: "Un objetivo más alto o temporal puede ayudar",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      enlace: ENFERMEDAD,
      v: `${NECESIDAD}; ajustar la configuración (objetivo, duración de la insulina activa) si es posible`,
      f: [t4(3)],
    },
    {
      r: R_PUNTUAL,
      v: "Mantener SmartGuard; ante hiperglucemia mantenida, confirmar la glucemia capilar y administrar el bolo corrector recomendado por el sistema",
      f: [t4(4)],
    },
    GRASA("Sin función específica", { n: N_INDIVIDUALIZAR }, [TARDIA_RESTO]),
    {
      r: "Alcohol",
      v: "Anticipar hipoglucemia diferida hasta 12–24 h tras la ingesta; valorar un objetivo glucémico más conservador la noche del consumo y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    AGUA_CATETER,
    { r: R_FALLO, v: FALLO, enlace: FIGURA_3, f: [t4(6)] },
    {
      r: "Desconexión",
      v: PAUSAR,
      n: UMBRAL_1H,
      enlace: INTERRUPCION,
      f: [DESCONEXION, fr("07-educacion", "b11", [4])],
    },
  ],
  [
    {
      r: R_AEROBICO,
      antes: C_AEROBICO,
      v: "Modo ejercicio (140–160 mg/dl)",
      n: "Reduce o suspende la administración si predice descenso; mantiene posibles autocorrecciones si se superan los umbrales del algoritmo",
      f: [t4(0)],
    },
    ANAEROBICO,
    {
      r: "Sueño/período nocturno",
      v: "Modo sueño (112,5–120 mg/dl) en una franja horaria configurable",
      n: "Mantiene la modulación basal, sin bolos de autocorrección",
      f: [t4(2)],
    },
    {
      r: "Hipoglucemia nocturna",
      antes: C_NOCTURNA,
      v: "El modo sueño no autocorrige, pero ajusta la basal",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      enlace: ENFERMEDAD,
      v: `${NECESIDAD}; ajustar la configuración (tasa basal, factor de sensibilidad)`,
      f: [t4(3)],
    },
    { r: R_PUNTUAL, v: PUNTUAL, f: [t4(4)] },
    GRASA(
      "Bolo extendido hasta 2 h",
      { variante: { nombre: "Control-IQ+", v: "De 15 min a 8 h" } },
      [TARDIA],
    ),
    {
      // Con objetivo fijo, sin «objetivo más conservador» (pregunta al autor, 20-10-2026).
      r: "Alcohol",
      v: "Anticipar hipoglucemia diferida hasta 12–24 h tras la ingesta",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    AGUA_CATETER,
    { r: R_FALLO, v: FALLO, enlace: FIGURA_3, f: [t4(6)] },
    {
      r: "Desconexión",
      v: PAUSAR,
      n: UMBRAL_1H,
      enlace: INTERRUPCION,
      f: [DESCONEXION, fr("07-educacion", "b11", [4])],
    },
  ],
  [
    {
      r: R_AEROBICO,
      antes: C_AEROBICO,
      v: "Ease-off: eleva temporalmente el objetivo y reduce la administración automática",
      n: "Inicio inmediato o diferido y duración configurable. En hipoglucemia recurrente por tramo horario, valorar un objetivo más alto en ese periodo",
      f: [t4(0)],
    },
    {
      ...ANAEROBICO,
      n: `${ANAEROBICO_N}. No usar Boost de rutina (riesgo de hipoglucemia diferida)`,
    },
    {
      r: "Sueño/período nocturno",
      v: "Sin modo nocturno específico",
      n: "Objetivo configurable por tramos",
      f: [t4(2)],
    },
    {
      r: "Hipoglucemia nocturna",
      antes: C_NOCTURNA,
      v: "Ease-off o un objetivo más alto",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      enlace: ENFERMEDAD,
      v: `${NECESIDAD}; valorar Boost y, si se mantiene, ajustar el objetivo`,
      f: [t4(3)],
    },
    {
      r: R_PUNTUAL,
      v: "Mantener el automático y valorar Boost o bolo corrector según el calculador",
      f: [t4(4)],
    },
    GRASA("Función de comida de absorción lenta", {}, [TARDIA]),
    {
      r: "Alcohol",
      v: "Anticipar hipoglucemia diferida hasta 12–24 h tras la ingesta; valorar Ease-off o un objetivo glucémico más conservador la noche del consumo y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    AGUA_CATETER,
    { r: R_FALLO, v: FALLO, enlace: FIGURA_3, f: [t4(6)] },
    {
      r: "Desconexión",
      v: PAUSAR,
      n: UMBRAL_1H,
      enlace: INTERRUPCION,
      f: [DESCONEXION, fr("07-educacion", "b11", [4])],
    },
  ],
  [
    {
      r: R_AEROBICO,
      antes: C_AEROBICO,
      v: "Función Actividad (objetivo 150 mg/dl)",
      n: "Reduce la administración automática; duración programable de 1–24 h",
      f: [t4(0)],
    },
    ANAEROBICO,
    {
      r: "Sueño/período nocturno",
      v: "Sin modo nocturno específico",
      n: "Objetivo configurable por tramos",
      f: [t4(2)],
    },
    {
      r: "Hipoglucemia nocturna",
      antes: C_NOCTURNA,
      v: "Función Actividad (objetivo 150 mg/dl) o un objetivo configurado más alto",
      f: [NOCHE],
    },
    {
      r: R_NECESIDAD,
      enlace: ENFERMEDAD,
      v: `${NECESIDAD}; ajustar el objetivo`,
      f: [t4(3)],
    },
    { r: R_PUNTUAL, v: PUNTUAL, f: [t4(4)] },
    GRASA("Bolo extendido disponible solo en modo manual", { n: N_INDIVIDUALIZAR }, [TARDIA_RESTO]),
    {
      r: "Alcohol",
      v: "Anticipar hipoglucemia diferida hasta 12–24 h tras la ingesta; valorar un objetivo glucémico más conservador la noche del consumo y la mañana siguiente",
      n: N_ALCOHOL,
      f: [ALCOHOL],
    },
    {
      r: "Agua",
      v: "Por su formato parche sin tubo, puede mantenerse en actividades acuáticas dentro de los límites de inmersión del fabricante",
      n: "La inmersión puede además limitar la comunicación entre el sensor y el sistema AID",
      f: [fr("10-situaciones", "b24", [1, 2])],
    },
    {
      r: R_FALLO,
      v: "Medir cetonemia, corregir con pluma y recambiar el pod según el plan de seguridad",
      enlace: FIGURA_3,
      f: [t4(6)],
    },
    {
      r: "Desconexión",
      v: "El pod no se desconecta: si falla, se despega o debe retirarse, se sustituye por uno nuevo",
      n: UMBRAL_1H,
      enlace: INTERRUPCION,
      f: [DESCONEXION, fr("07-educacion", "b11", [4])],
    },
  ],
];

/* La tarjeta de cada sistema en la entrada de Sistemas AID: tres datos del algoritmo y, en una
   línea, lo que añade su variante. */
export const RESUMEN = ["Funciona en", "Objetivo", "Bolos automáticos de corrección"] as const;
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
