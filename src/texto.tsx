/* Marcado en línea mínimo del contenido: *cursiva*, **negrita** y «\*» para un asterisco
   literal (las dosis con asterisco de la Figura 3). Sin HTML, sin dependencias. */
import { RE_PIEZA, sinCortes } from "./sinCortes";
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
  /(?:[≥≤<>]\s?)?(?:\d+(?:[.,]\d+)?(?:,\s|\so\s|\sy\s|\/)(?=\d))*\d+(?:[.,]\d+)?(?:\s?[-–]\s?\d+(?:[.,]\d+)?)?\s?(?:mmol\/l|mg\/dl|UI\/kg\/día|UI\/kg\/h|UI\/kg|UI\/día|UI\/h|UI|%|horas?|h|minutos|min|g|días?|semanas|años|kg)(?![\p{L}\d])/gu;
// Sin «i»: «780G» no es una cifra en gramos (0.72.0). 0.92.3 (15.ª ronda, adjunto): con la lista
// delante («100, 110 o 120 mg/dl»), toda en negrita (antes, solo la última cifra). El capítulo escribe las unidades en
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
/* 0.89.1 (13.ª ronda, visual): «β-OHB» en una pieza que no se parte por el guion en todo el
   texto (antes, solo en la Figura 3 y en <SinCortes>). 0.96.0 (16.ª ronda, visual): también los
   intervalos («DTD 10–100 UI/día», «12–24 h») y «U-100»: las mismas piezas que <SinCortes>, en
   todo el texto de la app (pregunta frecuente, Los cuatro · Modos, Interrupción). */
export function SinPartir({ t }: { t: string }) {
  if (!RE_PIEZA.test(t)) return <>{t}</>;
  return (
    <>
      {t.split(RE_PIEZA).map((x, i) =>
        i % 2 ? (
          <span key={i} className="whitespace-nowrap">
            {x}
          </span>
        ) : (
          <React.Fragment key={i}>{x}</React.Fragment>
        ),
      )}
    </>
  );
}
/* 0.97.1 (17.ª ronda, adjunto, R3 y visual): una serie de cifras («110, 120, 130, 140 o 150 mg/dl»)
   se puede partir entre cifras; solo la última, con su unidad, va unida. Entera sin partir se
   salía de la celda de Omnipod 5 en las Tablas 1 y 3 y la tabla la recortaba («150 mg/»). */
function Cifra({ t }: { t: string }) {
  const m = /^(.*(?:,\s|\so\s|\sy\s))(\S+\s?\S*)$/s.exec(t);
  if (!m) return <b className="cifra">{t}</b>;
  return (
    <b className="cifra cifra-serie">
      {m[1]}
      <span className="whitespace-nowrap">{m[2]}</span>
    </b>
  );
}
function ConCifrasTexto({ t }: { t: string }) {
  return (
    <>
      {partirCifras(t).map((x, i) =>
        x.cifra ? <Cifra key={i} t={x.t} /> : <SinPartir key={i} t={x.t} />,
      )}
    </>
  );
}

/* 0.81.1 (quinta ronda, visual): cifra y unidad sin partir en todo el texto de la app (antes,
   solo donde se llamaba a sinCortes). */
export function Texto({ children, siglas }: { children: string; siglas?: Set<string> }) {
  return <Trozos trozos={trozosDe(sinCortes(children), siglas)} />;
}

/* Trozos ya partidos (Remisiones.tsx): los que llevan `sigla` se pintan como sigla pulsable,
   dentro de su negrita o cursiva si la tenían. */
export function Trozos({ trozos: originales }: { trozos: TrozoSigla[] }) {
  const cifras = React.useContext(CifrasCtx);
  // 0.97.1 (17.ª ronda, R1): el signo que sigue a una sigla pulsable va con ella («PET,»): la
  // sigla es un botón y la coma podía empezar la línea siguiente.
  const trozos = originales.map((x) => ({ ...x }));
  const pegado: (string | undefined)[] = [];
  trozos.forEach((tr, i) => {
    const sig = trozos[i + 1];
    if (tr.sigla && sig && !sig.sigla && /^[,.;:)»]/.test(sig.t)) {
      pegado[i] = sig.t[0];
      sig.t = sig.t.slice(1);
    }
  });
  return (
    <>
      {trozos.map((tr, i) => {
        const nodo = tr.sigla ? (
          pegado[i] ? (
            <span className="whitespace-nowrap">
              <SiglaPulsable sigla={tr.sigla} />
              {pegado[i]}
            </span>
          ) : (
            <SiglaPulsable sigla={tr.sigla} />
          )
        ) : cifras && !tr.b ? (
          <ConCifrasTexto t={tr.t} />
        ) : (
          <SinPartir t={tr.t} />
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
