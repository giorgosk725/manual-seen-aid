/* Notas complementarias junto a pasajes del capítulo (V54-11): decisiones registradas de este
   complemento que ayudan a leer dos frases del capítulo que dicen cosas distintas. NO son texto
   del capítulo ni lo cambian: van rotuladas como complementarias, con su fecha y su fuente. */
export const NOTA_EDAD_LIBERTY =
  "Nota complementaria (no es texto del capítulo): para la edad de CamAPS Liberty, este complemento sigue la Tabla 1 («Liberty: > 13 años»). El apartado 3 dice «no se recomienda en menores de 13 años». Las dos frases son del capítulo.";

/* Omnipod 5 (corrección del autor, 14-10-2026): la casilla de la Tabla 1 lleva «Adapta la basal
   por pod»; la nota dice qué pone el capítulo publicado (docs/CORRECCIONES.md). */
export const NOTA_ADAPTA_OMNIPOD =
  "Corrección posterior a la publicación (14-10-2026): el capítulo publicado dice «Posee autoaprendizaje por pod». Lo que hace SmartAdjust es adaptar la basal con cada cambio de pod a partir de la insulina total administrada (Brown SA et al. Diabetes Care 2021;44(7):1630-40): una adaptación de ese parámetro, no un aprendizaje en sentido estricto.";

/* Pasajes donde se enseña: la fila de indicación de la Tabla 1 (Liberty) y la fila «Lógica del
   algoritmo y aprendizaje» (Omnipod 5). 0.72.2 (revisión editorial): la de Liberty, solo junto a
   la casilla de la Tabla 1; ni en la frase del apartado 3 ni en la lectura, que enseña solo el
   capítulo publicado. */
export const NOTAS_POR_PASAJE: Record<string, string> = {
  "T1/7": NOTA_EDAD_LIBERTY,
  "T1/3": NOTA_ADAPTA_OMNIPOD,
};

/* La columna (sistema) a la que se refiere la nota de una fila de tabla: solo va con esa casilla
   o con las cuatro. */
export const COLUMNA_DE_NOTA: Record<string, number> = { "T1/7": 2, "T1/3": 3 };

/* Debajo de la tabla entera (Tablas y lectura del capítulo). */
export const NOTAS_POR_TABLA: Record<string, string[]> = {
  T1: [NOTA_EDAD_LIBERTY, NOTA_ADAPTA_OMNIPOD],
};

/* En la lectura, junto a un párrafo (ninguna desde 0.72.2). */
export const NOTAS_POR_BLOQUE: Record<string, string> = {};

/* Control-IQ en la gestación (0.76.3, a petición del responsable, 16-10-2026): las
   recomendaciones de Tandem a las que remite el apartado 10 («está recogida en las
   recomendaciones específicas de Tandem para la gestación»), tal como las da el folleto para
   profesionales del distribuidor en España. Texto del folleto, literal (la tabla, por etapas);
   no es texto del capítulo ni lo cambia. Van debajo de lo que dice el capítulo de Control-IQ. */
export interface Complemento {
  titulo: string;
  aviso: string;
  /* `dentro`: el grupo va bajo el anterior (las etapas de la tabla del paso 2). */
  grupos: { rotulo: string; dentro?: boolean; filas: { etiqueta?: string; texto: string }[] }[];
  fuente: string;
}
export const TANDEM_GESTACION: Complemento = {
  titulo: "Recomendaciones de Tandem para la gestación",
  aviso:
    "Complementario: no es texto del capítulo. Texto literal del folleto de Tandem para profesionales al que remite el apartado 10, basado en el ensayo CIRCUIT y en el consenso internacional de 2026 (ref. 3 del capítulo).",
  grupos: [
    {
      rotulo: "Paso 1 · Actividad Sueño las 24 horas del día",
      filas: [
        {
          texto:
            "La administración de insulina aumenta cuando se prevé que la glucosa esté por encima de 120 mg/dL.",
        },
        { texto: "Uso opcional del modo normal o modo Ejercicio únicamente para hacer ejercicio." },
      ],
    },
    {
      rotulo: "Paso 2 · Ajustes de configuración basados en la glucemia",
      filas: [
        {
          texto:
            "Evaluar la configuración cada 2 semanas, o antes si se produce hiperglucemia o hipoglucemia. Utilizar los datos de administración de insulina de las últimas 1-2 semanas para calcular la configuración (p. ej., Dosis Diaria Total [TDI] = 30u, Basal = 14u).",
        },
      ],
    },
    {
      rotulo: "Principio del embarazo",
      dentro: true,
      filas: [
        { etiqueta: "Tasa basal", texto: "Basal promedio de las 1-2 semanas previas." },
        { etiqueta: "Factor de corrección", texto: "Al menos: ≤1620/TDI." },
        { etiqueta: "Ratio de carbohidrato", texto: "Regla 400/DTI." },
      ],
    },
    {
      rotulo: "Después de 20 semanas",
      dentro: true,
      filas: [
        {
          etiqueta: "Tasa basal",
          texto:
            "Aproximadamente un 20% más alta que la basal promedio administrada en las 1-2 semanas anteriores.",
        },
        { etiqueta: "Factor de corrección", texto: "Al menos: ≤1620/TDI." },
        {
          etiqueta: "Ratio de carbohidrato",
          texto: "Regla 400/DTI. Regla 250/TDI si es necesario. Ej: Desayuno.",
        },
      ],
    },
    {
      rotulo: "Posparto",
      dentro: true,
      filas: [
        { texto: "Menos requerimiento de insulina." },
        {
          texto:
            "Considerar una reducción ≥ 50% en la dosis de insulina respecto a los valores de finales del tercer trimestre.",
        },
        {
          texto:
            "Considerar una reducción del 33% para la tasa basal y del 20% para la RCH y FSI respecto a los valores previos al embarazo.",
        },
        { texto: "Es posible que se necesiten más reducciones durante la lactancia." },
      ],
    },
    {
      rotulo: "Paso 3 · Consideraciones para el bolo",
      filas: [
        { texto: "10-15 mins antes de la comida en el 1º trimestre." },
        { texto: "20-30 mins antes de la comida en el 2º trimestre." },
        { texto: "30-45 mins antes de la comida en el 3º trimestre." },
        {
          texto:
            "Configurar el Bolo Máximo hasta 25 unidades, o al menos un 25% más alto que la dosis más grande necesaria.",
        },
        {
          texto:
            "Rechazar la indicación de reducción del bolo cuando la glucosa sea inferior a 110 mg/dL.",
        },
      ],
    },
  ],
  fuente:
    "Novalab (distribuidor de Tandem) · «Recomendaciones en el manejo de Control-IQ durante el embarazo», folleto MAT-2075_1, V4",
};
