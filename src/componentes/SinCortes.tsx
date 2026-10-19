/* Que una cifra no se separe de su unidad ni de su signo al partir la línea (0.77.1, auditoría
   visual: «> 120 ⏎ mg/dl», «10– ⏎ 100 UI/día», «(EE. ⏎ UU.)»): espacio duro entre número y
   unidad, tras < > ≤ ≥ y en algunas expresiones fijas; los intervalos con raya, sin partir. */
import { Fragment } from "react";

const NBSP = "\u00a0";
const UNIDADES = "mg\\/dl|mg\\/dL|min|h|UI\\/día|UI\\/h|UI|años|año|kg|%|semanas|días";

function sinCortes(texto: string): string {
  return texto
    .replace(new RegExp(`(\\d) (${UNIDADES})(?![\\p{L}])`, "gu"), `$1${NBSP}$2`)
    .replace(/([<>≤≥]) (\d)/g, `$1${NBSP}$2`)
    .replace(/EE\. UU\./g, `EE.${NBSP}UU.`)
    .replace(/tipo (\d)/g, `tipo${NBSP}$1`)
    .replace(/ratios? I\/HC/g, (m) => m.replace(" ", NBSP))
    .replace(/(\d) (a|o) (\d)/g, `$1${NBSP}$2${NBSP}$3`);
}

/* El texto con sus intervalos («112,5–160», «2,5–4») en una pieza que no se parte. */
export function SinCortes({ texto }: { texto: string }) {
  const partes = sinCortes(texto).split(/(\d+(?:,\d+)?–\d+(?:,\d+)?)/);
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
