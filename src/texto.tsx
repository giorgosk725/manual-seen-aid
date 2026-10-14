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

/* Cifras con unidad destacadas (0.72.0): en las pantallas de consulta, «1-2 h», «≥ 70 %»,
   «0,1 UI/kg» o «112,5–160 mg/dl» se ven de un golpe. Solo cambia el formato: el texto es el mismo.
   Se marcan todas o ninguna (no hay una cifra «más importante» que otra). */
const CifrasCtx = React.createContext(false);
export function ConCifras({ children }: { children: React.ReactNode }) {
  return <CifrasCtx.Provider value={true}>{children}</CifrasCtx.Provider>;
}
const RE_CIFRA =
  /(?:[≥≤<>]\s?)?\d+(?:[.,]\d+)?(?:\s?[-–]\s?\d+(?:[.,]\d+)?)?\s?(?:mmol\/l|mg\/dl|UI\/kg\/día|UI\/kg\/h|UI\/kg|UI\/día|UI\/h|UI|%|horas?|h|minutos|min|g|días?|semanas|años|kg)(?![\p{L}\d])/gu;
// Sin «i»: «780G» no es una cifra en gramos (0.72.0). El capítulo escribe las unidades en
// minúscula («mmol/l», «mg/dl»).
function partirCifras(t: string): { t: string; cifra: boolean }[] {
  const out: { t: string; cifra: boolean }[] = [];
  let i = 0;
  for (const m of t.matchAll(RE_CIFRA)) {
    if (m.index! > i) out.push({ t: t.slice(i, m.index), cifra: false });
    out.push({ t: m[0], cifra: true });
    i = m.index! + m[0].length;
  }
  if (i < t.length) out.push({ t: t.slice(i), cifra: false });
  return out;
}
function ConCifrasTexto({ t }: { t: string }) {
  return (
    <>
      {partirCifras(t).map((x, i) =>
        x.cifra ? (
          <b key={i} className="cifra">
            {x.t}
          </b>
        ) : (
          <React.Fragment key={i}>{x.t}</React.Fragment>
        ),
      )}
    </>
  );
}

export function Texto({ children, siglas }: { children: string; siglas?: Set<string> }) {
  return <Trozos trozos={trozosDe(children, siglas)} />;
}

/* Trozos ya partidos (Remisiones.tsx): los que llevan `sigla` se pintan como sigla pulsable,
   dentro de su negrita o cursiva si la tenían. */
export function Trozos({ trozos }: { trozos: TrozoSigla[] }) {
  const cifras = React.useContext(CifrasCtx);
  return (
    <>
      {trozos.map((tr, i) => {
        const nodo = tr.sigla ? (
          <SiglaPulsable sigla={tr.sigla} />
        ) : cifras && !tr.b ? (
          <ConCifrasTexto t={tr.t} />
        ) : (
          tr.t
        );
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
