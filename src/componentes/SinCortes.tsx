/* Que una cifra no se separe de su unidad ni de su signo al partir la línea (0.77.1, auditoría
   visual: «> 120 ⏎ mg/dl», «10– ⏎ 100 UI/día», «(EE. ⏎ UU.)»): espacio duro entre número y
   unidad, tras < > ≤ ≥ y en algunas expresiones fijas; los intervalos con raya o guion, sin
   partir. 0.78.1 (tanda 3): también «tramos», «horas», «mmol/l», «g», «UI/kg», las semanas y las
   fechas («13-10-2026»), y el intervalo va en una pieza con su signo y su unidad. */
import { Fragment } from "react";
import { RE_PIEZA, sinCortes } from "../sinCortes";

/* El texto con sus intervalos («112,5–160 mg/dl», «2,5–4 h») y «β-OHB» en una pieza que no se
   parte (0.79.1). */
export function SinCortes({ texto }: { texto: string }) {
  const partes = sinCortes(texto).split(RE_PIEZA);
  return (
    <>
      {partes.map((p, i) =>
        i % 2 ? (
          <span key={i} className="whitespace-nowrap">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
