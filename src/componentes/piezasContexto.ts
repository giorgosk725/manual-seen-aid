/* Dentro de un bloque con rótulo propio (BloquesPorSistema), la fila de tabla de una pieza no
   abre un encabezado: rompería el orden de los títulos (0.73.0). */
import { createContext } from "react";

export const PiezasSinTitulos = createContext(false);
