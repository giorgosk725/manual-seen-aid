/* Dentro de un bloque con rótulo propio (BloquesPorSistema), la fila de tabla de una pieza no
   abre un encabezado: rompería el orden de los títulos (0.73.0). */
import { createContext } from "react";

export const PiezasSinTitulos = createContext(false);

/* En esos bloques, el recorte de una frase va sin los puntos suspensivos de los extremos y con
   mayúscula inicial (0.74.1, a petición del responsable: «ponlos directamente»); la fuente al pie
   sigue llevando a la frase entera. */
export const sinPuntos = (t: string) => {
  let x = t.replace(/^…\s*/, "").replace(/\s*…$/, "");
  // 0.84.1 (octava ronda, visual): un inciso entre rayas al final del recorte, entre paréntesis;
  // una raya suelta en un extremo (el recorte la dejó sin pareja), fuera. Como `fragmento()` en
  // los diagramas: las palabras son las mismas.
  x = x.replace(/\s—([^—]+)—\s*$/, " ($1)");
  if ((x.match(/—/g) ?? []).length % 2) x = x.replace(/^—\s*/, "").replace(/\s*—\s*$/, "");
  return x.charAt(0).toUpperCase() + x.slice(1);
};
