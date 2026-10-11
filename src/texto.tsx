/* Marcado en línea mínimo del contenido: *cursiva*, **negrita** y «\*» para un asterisco
   literal (las dosis con asterisco de la Figura 3). Sin HTML, sin dependencias. */
import React from "react";
import { trocear } from "./marcado";
import { SiglaPulsable } from "./componentes/Sigla";
import { partirSiglas, siglasPorTexto, type TrozoSigla } from "./siglas";

/* Los trozos de un texto con marcado y, si se pide, con sus siglas pendientes marcadas. */
const trozosDe = (texto: string, siglas?: Set<string>): TrozoSigla[] => {
  if (!siglas?.size) return trocear(texto);
  const pend = new Set(siglas); // copia: la de fuera no cambia al pintar
  return trocear(texto).flatMap((tr) => partirSiglas(tr.t, pend).map((x) => ({ ...tr, ...x })));
};

export function Texto({ children, siglas }: { children: string; siglas?: Set<string> }) {
  return <Trozos trozos={trozosDe(children, siglas)} />;
}

/* Trozos ya partidos (Remisiones.tsx): los que llevan `sigla` se pintan como sigla pulsable,
   dentro de su negrita o cursiva si la tenían. */
export function Trozos({ trozos }: { trozos: TrozoSigla[] }) {
  return (
    <>
      {trozos.map((tr, i) => {
        const nodo = tr.sigla ? <SiglaPulsable sigla={tr.sigla} /> : tr.t;
        return tr.b ? (
          <strong key={i}>{nodo}</strong>
        ) : tr.i ? (
          <em key={i}>{nodo}</em>
        ) : (
          <React.Fragment key={i}>{nodo}</React.Fragment>
        );
      })}
    </>
  );
}

/* Celdas de tabla: cada "\n" es una línea propia. */
export function Lineas({ children, siglas }: { children: string; siglas?: Set<string> }) {
  const lineas = children.split("\n");
  const porLinea = siglas ? siglasPorTexto(lineas, siglas) : [];
  return (
    <>
      {lineas.map((l, i) => (
        <span key={i} className={i > 0 ? "mt-1 block" : "block"}>
          <Texto siglas={porLinea[i]}>{l}</Texto>
        </span>
      ))}
    </>
  );
}
