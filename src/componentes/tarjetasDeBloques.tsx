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
/* 0.92.0 (revisión de tarjetas, ★2, ★10 y ★11): la pleca del sistema, solo en lo que es del
   sistema. `forma`: «sistema» (tarjeta con la pleca y el rótulo en su color), «comun» (lo común a
   los cuatro: tarjeta sin pleca, rótulo gris) o «casilla» (dentro de la tarjeta del sistema: casilla
   gris sin pleca, que no repite la de su contenedor). */
export function tarjetasDeBloques(
  c: number,
  bloques: BloqueSistema[],
  forma: "sistema" | "comun" | "casilla" = "sistema",
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
        className={`min-w-0 p-3 ${forma === "casilla" ? "casilla" : forma === "comun" ? "tarjeta" : "tarjeta tarjeta-sistema"}`}
        style={forma === "sistema" ? { ["--sis" as string]: h.strong } : undefined}
      >
        <PiezasSinTitulos.Provider value={true}>
          {/* 0.96.0 (16.ª ronda, visual y R3): el rótulo del bloque en minúscula y negrita, como los
              de las fichas (en MAYÚSCULAS, «· MINIMED 780G Y OMNIPOD 5» perdía la grafía). */}
          <dt
            className="text-[13px] font-semibold leading-snug text-slate-600"
            style={forma === "sistema" ? { color: h.ink } : undefined}
          >
            {b.rotulo}
          </dt>
          {/* 0.96.0 (16.ª ronda, adjunto): una pieza por fila, separadas por una línea fina. */}
          <dd className="mt-1 space-y-2 text-[15px] leading-snug text-slate-900 [&>*+*]:border-t [&>*+*]:border-[var(--linea-suave)] [&>*+*]:pt-2">
            {b.piezas.map((p, j) => (
              <div key={j}>
                <PiezaVista pieza={p} sis={c} compacta siglas={sg[desde[i] + j]} />
              </div>
            ))}
          </dd>
        </PiezasSinTitulos.Provider>
      </div>
    ),
  }));
}
