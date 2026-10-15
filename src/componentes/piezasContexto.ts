/* Dentro de un bloque con rótulo propio (BloquesPorSistema), la fila de tabla de una pieza no
   abre un encabezado: rompería el orden de los títulos (0.73.0). */
import { createContext } from "react";

export const PiezasSinTitulos = createContext(false);

/* En esos bloques, el recorte de una frase va sin los puntos suspensivos de los extremos y con
   mayúscula inicial (0.74.1, a petición del responsable: «ponlos directamente»); la fuente al pie
   sigue llevando a la frase entera. */
export const sinPuntos = (t: string) => {
  const x = t.replace(/^…\s*/, "").replace(/\s*…$/, "");
  return x.charAt(0).toUpperCase() + x.slice(1);
};
