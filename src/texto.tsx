/* Marcado en línea mínimo del contenido: *cursiva*, **negrita** y «\*» para un asterisco
   literal (las dosis con asterisco de la Figura 3). Sin HTML, sin dependencias. */
import React from "react";
import { trocear } from "./marcado";

export function Texto({ children }: { children: string }) {
  return (
    <>
      {trocear(children).map((tr, i) =>
        tr.b ? (
          <strong key={i}>{tr.t}</strong>
        ) : tr.i ? (
          <em key={i}>{tr.t}</em>
        ) : (
          <React.Fragment key={i}>{tr.t}</React.Fragment>
        ),
      )}
    </>
  );
}

/* Celdas de tabla: cada "\n" es una línea propia. */
export function Lineas({ children }: { children: string }) {
  const lineas = children.split("\n");
  return (
    <>
      {lineas.map((l, i) => (
        <span key={i} className={i > 0 ? "mt-1 block" : "block"}>
          <Texto>{l}</Texto>
        </span>
      ))}
    </>
  );
}
