/* Notas complementarias junto a pasajes del capítulo (V54-11): decisiones registradas de este
   complemento que ayudan a leer dos frases del capítulo que dicen cosas distintas. NO son texto
   del capítulo ni lo cambian: van rotuladas como complementarias, con su fecha y su fuente. */
export const NOTA_EDAD_LIBERTY =
  "Nota complementaria (no es texto del capítulo): para la edad de CamAPS Liberty, este complemento sigue la Tabla 1 («Liberty: > 13 años»). El apartado 3 dice «no se recomienda en menores de 13 años». Las dos frases son del capítulo.";

/* Omnipod 5 (corrección del autor, 14-10-2026): la casilla de la Tabla 1 lleva «Adapta la basal
   por pod»; la nota dice qué pone el capítulo publicado (docs/CORRECCIONES.md). */
export const NOTA_ADAPTA_OMNIPOD =
  "Corrección posterior a la publicación (14-10-2026): el capítulo publicado dice «Posee autoaprendizaje por pod». Lo que hace SmartAdjust es adaptar la basal con cada cambio de pod a partir de la insulina total administrada (Brown SA et al. Diabetes Care 2021;44(7):1630-40): una adaptación de ese parámetro, no un aprendizaje en sentido estricto.";

/* Pasajes donde se enseña: la fila de indicación de la Tabla 1 y la frase del apartado 3
   (Liberty); la fila «Lógica del algoritmo y aprendizaje» (Omnipod 5). */
export const NOTAS_POR_PASAJE: Record<string, string> = {
  "T1/7": NOTA_EDAD_LIBERTY,
  "t/03-algoritmos/b3/2": NOTA_EDAD_LIBERTY,
  "T1/3": NOTA_ADAPTA_OMNIPOD,
};

/* La columna (sistema) a la que se refiere la nota de una fila de tabla: solo va con esa casilla
   o con las cuatro. */
export const COLUMNA_DE_NOTA: Record<string, number> = { "T1/7": 2, "T1/3": 3 };

/* Debajo de la tabla entera (Tablas y lectura del capítulo). */
export const NOTAS_POR_TABLA: Record<string, string[]> = {
  T1: [NOTA_EDAD_LIBERTY, NOTA_ADAPTA_OMNIPOD],
};

/* En la lectura, junto al párrafo del apartado 3 que dice «menores de 13 años». */
export const NOTAS_POR_BLOQUE: Record<string, string> = {
  "03-algoritmos/b3": NOTA_EDAD_LIBERTY,
};
