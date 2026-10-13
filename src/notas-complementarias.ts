/* Notas complementarias junto a pasajes del capítulo (V54-11): decisiones registradas de este
   complemento que ayudan a leer dos frases del capítulo que dicen cosas distintas. NO son texto
   del capítulo ni lo cambian: van rotuladas como complementarias, con su fecha y su fuente. */
export const NOTA_EDAD_LIBERTY =
  "Nota complementaria (no es texto del capítulo), decisión registrada el 13-10-2026: para la edad de CamAPS Liberty, este complemento sigue la Tabla 1 («Liberty: > 13 años»). El apartado 3 dice «no se recomienda en menores de 13 años». Las dos frases son del capítulo.";

/* Pasajes donde se enseña: la fila de indicación de la Tabla 1 y la frase del apartado 3. */
export const NOTAS_POR_PASAJE: Record<string, string> = {
  "T1/7": NOTA_EDAD_LIBERTY,
  "t/03-algoritmos/b3/2": NOTA_EDAD_LIBERTY,
};

/* En la lectura, junto al párrafo del apartado 3 que dice «menores de 13 años». */
export const NOTAS_POR_BLOQUE: Record<string, string> = {
  "03-algoritmos/b3": NOTA_EDAD_LIBERTY,
};
