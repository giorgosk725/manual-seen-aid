/* Sexta vuelta del sistema visual: las tarjetas de los bloques de un sistema (porSistema.ts)
   como elementos de DosColumnas, para repartirlas en la misma rejilla que las filas de la tabla. */
import type { ReactNode } from "react";
import { PiezaVista } from "./Piezas";
import { PiezasSinTitulos } from "./piezasContexto";
import { siglasPorPiezas, textosDePieza } from "../inicio";
import type { BloqueSistema } from "../porSistema";
import { SISTEMA_HEX } from "../tokens";
import { lineasDe } from "../disposicion";

/* Las tarjetas de los bloques de un sistema, con su altura estimada: ColumnaTabla las reparte
   en las mismas dos columnas que las filas de la tabla (una sola rejilla por sección). */
export function tarjetasDeBloques(
  c: number,
  bloques: BloqueSistema[],
): { clave: string; peso: number; nodo: ReactNode }[] {
  const h = SISTEMA_HEX[c];
  const todas = bloques.flatMap((b) => b.piezas);
  const sg = siglasPorPiezas(todas, c);
  // Índice de la primera pieza de cada bloque en `todas` (las siglas van por pieza).
  const desde = bloques.map((_, i) => bloques.slice(0, i).reduce((n, x) => n + x.piezas.length, 0));
  return bloques.map((b, i) => ({
    clave: `bloque-${b.rotulo}`,
    peso: 1.5 + b.piezas.reduce((n, p) => n + lineasDe(textosDePieza(p, c).join(" "), 62), 0),
    nodo: (
      <div
        key={`bloque-${b.rotulo}`}
        className="tarjeta tarjeta-sistema min-w-0 p-3"
        style={{ ["--sis" as string]: h.strong }}
      >
        <PiezasSinTitulos.Provider value={true}>
          <dt className="rotulo" style={{ color: h.ink }}>
            {b.rotulo}
          </dt>
          <dd className="mt-1 space-y-1.5 text-[15px] leading-snug text-slate-900">
            {b.piezas.map((p, j) => (
              <PiezaVista key={j} pieza={p} sis={c} compacta siglas={sg[desde[i] + j]} />
            ))}
          </dd>
        </PiezasSinTitulos.Provider>
      </div>
    ),
  }));
}
