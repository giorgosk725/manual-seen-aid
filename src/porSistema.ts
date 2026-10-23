/* Lo que el capítulo dice de cada sistema en una situación, en orden práctico (0.73.0, auditoría
   de contenido): frases literales —recortadas con `trozo` a la parte del sistema cuando el
   párrafo nombra a los cuatro— y casillas de las tablas. Solo referencias: el texto sale del
   capítulo (inicio.ts). Los rótulos son de la app. Orden de los sistemas: el de la Tabla 1
   (MiniMed 780G, Control-IQ, CamAPS FX, Omnipod 5). */
import type { Pieza } from "./inicio";
import { TANDEM_GESTACION, type Complemento } from "./notas-complementarias";

export interface BloqueSistema {
  rotulo: string;
  piezas: Pieza[];
}

const fr = (
  apartado: string,
  bloque: string,
  k: number[],
  trozo?: RegExp,
  quitar?: RegExp,
): Pieza => ({
  t: "frase",
  apartado,
  bloque,
  k,
  trozo,
  ...(quitar ? { quitar } : {}),
});
const s10 = (bloque: string, k: number[], trozo?: RegExp) => fr("10-situaciones", bloque, k, trozo);
const s9 = (bloque: string, k: number[], trozo?: RegExp) => fr("09-descarga", bloque, k, trozo);
const casilla = (tabla: "T1" | "T3" | "T4", fila: number): Pieza => ({ t: "casilla", tabla, fila });

/* Las bombas con catéter y el pod (apartado 7, interrupciones breves). */
const POD_NO_SE_DESCONECTA = fr("07-educacion", "b11", [1], /el pod no se desconecta —[^—]*—/);
const CATETER_PAUSAR = fr("07-educacion", "b11", [2]);
/* Boost y Ease-off de CamAPS FX (apartado 10, en la gestación, dicho en general). */
const BOOST = s10(
  "b7",
  [1],
  /Boost puede utilizarse transitoriamente cuando aumentan las necesidades de insulina —[^—]*—/,
);

/* ---------- Gestación (apartado 10, pp. 17-18) ---------- */
const GESTACION: BloqueSistema[][] = [
  [
    {
      rotulo: "Autorización y evidencia",
      // 1.0.12 (24.ª ronda, senior; decisión del autor del 23-10-2026): sin «asimismo», que fuera
      // de su párrafo (tras CamAPS FX) se quedaba sin referente.
      piezas: [
        fr("10-situaciones", "b3", [3], /MiniMed 780G dispone asimismo[^;]*/, / asimismo(?= de)/),
        s10("b5", [1]),
      ],
    },
    { rotulo: "Objetivo del algoritmo", piezas: [s10("b8", [0]), casilla("T1", 6)] },
    { rotulo: "Estrategia de ajuste", piezas: [s10("b8", [1])] },
  ],
  [
    // 0.86.1 (décima ronda, R5): con la casilla de la Tabla 1 (Control-IQ sin autorización;
    // Control-IQ+, sí): es la distinción que más importa a una gestante con Control-IQ.
    {
      rotulo: "Autorización y evidencia",
      // 0.90.1 (decisión del responsable, 21-10-2026): una fila con Control-IQ / Control-IQ+,
      // sin la frase del apartado 10 que repetía la autorización de Control-IQ+.
      piezas: [casilla("T1", 8), s10("b5", [2])],
    },
    // 0.92.3 (15.ª ronda, senior): con la variante en el rótulo (sin la frase que nombra
    // Control-IQ+, «No incorpora…» se leía como de Control-IQ).
    { rotulo: "Estrategia de intensificación (Control-IQ+)", piezas: [s10("b9", [1])] },
    // 1.0.12 (24.ª ronda, adjunto): sin la casilla del objetivo de la Tabla 1, que repetía justo
    // debajo el rango de 112,5–120 mg/dl que da la frase.
    {
      rotulo: "Modo sueño continuado (Control-IQ+)",
      piezas: [s10("b9", [2, 3, 4])],
    },
  ],
  [
    {
      rotulo: "Autorización y evidencia",
      // 0.77.1 (auditoría R5): sin la frase final de Liberty del apartado 3 («Por el momento no
      // se recomienda… ni en gestación»): leída sola parecía decirlo de CamAPS FX; la primera
      // frase ya dice que Liberty no está autorizada en la gestación.
      piezas: [s10("b3", [2]), s10("b5", [0])],
    },
    { rotulo: "Objetivo del algoritmo", piezas: [s10("b6", [2, 3, 4]), casilla("T1", 6)] },
    { rotulo: "Parámetros en modo automático", piezas: [s10("b7", [0])] },
    { rotulo: "Boost y Ease-off", piezas: [s10("b7", [1])] },
  ],
  [
    {
      rotulo: "Autorización",
      piezas: [s10("b3", [3], /Omnipod 5 no dispone actualmente[^.]*\./)],
    },
  ],
];
/* Lo común a los cuatro que va junto a lo del sistema: los objetivos de inicio (Tabla 2). */
const GESTACION_COMUN: BloqueSistema[] = [
  {
    rotulo: "Objetivos de inicio",
    piezas: [
      { t: "fila", tabla: "T2", fila: 6 },
      { t: "fila", tabla: "T2", fila: 7 },
    ],
  },
];

/* 1.0.12 (24.ª ronda, adjunto): con Control-IQ, sin la fila del objetivo del algoritmo automático
   (Tabla 2): su objetivo no se configura y ya lo dice la frase de la estrategia de intensificación
   (salía tres veces, con dos notas «No confundir…» que se remitían la una a la otra). */
function gestacionComun(c: number): BloqueSistema[] {
  if (c !== 1) return GESTACION_COMUN;
  return GESTACION_COMUN.map((b) => ({
    ...b,
    piezas: b.piezas.filter((p) => !(p.t === "fila" && p.tabla === "T2" && p.fila === 7)),
  }));
}

/* ---------- Enfermedad intercurrente y glucocorticoides ---------- */
const NECESIDAD: BloqueSistema[][] = [
  [{ rotulo: "Herramienta del sistema", piezas: [casilla("T4", 3)] }],
  [{ rotulo: "Herramienta del sistema", piezas: [casilla("T4", 3), casilla("T3", 1)] }],
  [{ rotulo: "Herramienta del sistema", piezas: [casilla("T4", 3), BOOST] }],
  [{ rotulo: "Herramienta del sistema", piezas: [casilla("T4", 3), casilla("T1", 5)] }],
];

/* ---------- Ingreso hospitalario ---------- */
const MODO_MENOS_INTENSIVO: BloqueSistema = {
  rotulo: "Objetivo y modos temporales",
  piezas: [casilla("T3", 0)],
};
const INGRESO: BloqueSistema[][] = [
  [MODO_MENOS_INTENSIVO, { rotulo: "Desconexión", piezas: [CATETER_PAUSAR] }],
  [MODO_MENOS_INTENSIVO, { rotulo: "Desconexión", piezas: [CATETER_PAUSAR] }],
  [MODO_MENOS_INTENSIVO, { rotulo: "Desconexión", piezas: [CATETER_PAUSAR] }],
  [
    MODO_MENOS_INTENSIVO,
    { rotulo: "Pod", piezas: [POD_NO_SE_DESCONECTA] },
    { rotulo: "Pauta de respaldo", piezas: [s10("b36", [3])] },
  ],
];

/* Situaciones-guía con selector de sistema (arriba de sus párrafos). */
export const GUIA_POR_SISTEMA: Record<
  string,
  {
    bloques: BloqueSistema[][];
    comun?: BloqueSistema[];
    /* Lo común según el sistema, si cambia (1.0.12). */
    comunDe?: (c: number) => BloqueSistema[];
    /* Lo complementario de un sistema (no es del capítulo), tras lo suyo: índice → texto. */
    complementos?: Record<number, Complemento>;
  }
> = {
  gestacion: {
    bloques: GESTACION,
    comun: GESTACION_COMUN,
    comunDe: gestacionComun,
    complementos: { 1: TANDEM_GESTACION },
  },
  "enfermedad-intercurrente": { bloques: NECESIDAD },
  glucocorticoides: { bloques: NECESIDAD },
  "ingreso-hospitalario": { bloques: INGRESO },
};

/* Situaciones de la Tabla 4 con un sistema elegido: lo que los apartados 9 y 10 añaden a la
   casilla para ese sistema (vacío: la casilla basta). */
export const TABLA4_POR_SISTEMA: Record<string, BloqueSistema[][]> = {
  sueno: [
    [
      {
        rotulo: "Hipoglucemia nocturna",
        piezas: [
          s9("b7", [0]),
          s9("b7", [1], /en MiniMed, un objetivo más alto o temporal puede ayudar/),
        ],
      },
    ],
    [
      {
        rotulo: "Hipoglucemia nocturna",
        // 0.92.3 (15.ª ronda, R3): sin «En Tandem, el modo sueño no autocorrige, pero ajusta
        // basal», que repetía la celda de la Tabla 4 justo encima.
        piezas: [s9("b7", [0])],
      },
    ],
    [
      {
        rotulo: "Hipoglucemia nocturna",
        piezas: [s9("b7", [0]), s9("b7", [1], /en CamAPS FX, Ease-off o un objetivo más alto/)],
      },
    ],
    [
      {
        rotulo: "Hipoglucemia nocturna",
        piezas: [
          s9("b7", [0]),
          s9(
            "b7",
            [1],
            /en Omnipod 5, la Función Actividad \(objetivo 150 mg\/dl\) o un objetivo configurado más alto/,
          ),
        ],
      },
    ],
  ],
  "comida-grasa": [
    [
      {
        rotulo: "Hiperglucemia tardía",
        piezas: [s9("b6", [0]), s9("b6", [2], /la estrategia debe individualizarse[^.]*/)],
      },
    ],
    [
      {
        rotulo: "Hiperglucemia tardía",
        // 0.96.0 (16.ª ronda, R3): sin «En Control-IQ el bolo extendido es limitado…», que repetía
        // la casilla de la Tabla 4 justo encima («bolo extendido (hasta 2 h; Control-IQ+: de 15 min
        // a 8 h)»), como se hizo con CamAPS FX.
        piezas: [s9("b6", [0])],
      },
    ],
    [
      {
        rotulo: "Hiperglucemia tardía",
        // 0.91.3 (14.ª ronda, R3): sin «en CamAPS FX puede utilizarse la función de absorción
        // lenta», que repetía la herramienta de la Tabla 4 justo encima.
        piezas: [s9("b6", [0])],
      },
    ],
    [
      {
        rotulo: "Hiperglucemia tardía",
        piezas: [s9("b6", [0]), s9("b6", [2], /la estrategia debe individualizarse[^.]*/)],
      },
    ],
  ],
  // 0.74.2 (auditoría): sin la desconexión (va en el guion, con el apartado 7) ni el Ease-off
  // del párrafo de la gestación; en Control-IQ, sus rangos (modo ejercicio 140–160).
  "ejercicio-aerobico": [
    [],
    // 0.81.1 (quinta ronda, senior): sin los rangos de la Tabla 1, que repetían el 140–160 de la
    // casilla de la Tabla 4.
    [],
    [],
    [
      {
        rotulo: "Actividad acuática",
        piezas: [
          s10("b24", [1], /Omnipod 5, por su formato parche sin tubo[^.]*/),
          s10("b24", [2]),
        ],
      },
    ],
  ],
  "necesidad-transitoria": [
    [],
    // 0.80.1 (cuarta ronda, senior): sin la basal temporal de Control-IQ+ (Tabla 3): la Tabla 4
    // no la indica en esta situación.
    [],
    [{ rotulo: "Boost", piezas: [BOOST] }],
    [{ rotulo: "Sin bolos automáticos: basal adaptativa", piezas: [casilla("T1", 5)] }],
  ],
};

/* ---------- Ficha de cada sistema: lo que el texto añade a las Tablas 1, 3 y 4 ---------- */
const NOCHE = TABLA4_POR_SISTEMA.sueno;
const GRASA = TABLA4_POR_SISTEMA["comida-grasa"];
const basal = (trozo: RegExp): BloqueSistema => ({
  rotulo: "Peso de la basal programada",
  piezas: [fr("08-iniciacion", "b8", [2], trozo)],
});
export const FICHA_PARAMETROS: BloqueSistema[][] = [
  [basal(/en MiniMed 780G y CamAPS FX actúa sobre todo en modo manual/)],
  [basal(/en Control-IQ interviene directamente en el modo automático/)],
  [
    basal(/en MiniMed 780G y CamAPS FX actúa sobre todo en modo manual/),
    { rotulo: "Factor de sensibilidad y duración de la insulina activa", piezas: [s10("b7", [0])] },
  ],
  [basal(/en Omnipod 5 contribuye al inicio y luego cede ante la basal adaptativa/)],
];
const DESCONEXION: BloqueSistema = { rotulo: "Desconexión", piezas: [CATETER_PAUSAR] };
export const FICHA_MODOS: BloqueSistema[][] = [
  [...NOCHE[0], ...GRASA[0], DESCONEXION],
  [...NOCHE[1], ...GRASA[1], DESCONEXION],
  [
    { rotulo: "Boost y Ease-off", piezas: [s10("b7", [1])] },
    ...NOCHE[2],
    ...GRASA[2],
    { rotulo: "Alcohol", piezas: [s10("b14", [2])] },
    DESCONEXION,
  ],
  [
    ...NOCHE[3],
    ...GRASA[3],
    ...TABLA4_POR_SISTEMA["ejercicio-aerobico"][3],
    { rotulo: "Pod", piezas: [POD_NO_SE_DESCONECTA] },
  ],
];
