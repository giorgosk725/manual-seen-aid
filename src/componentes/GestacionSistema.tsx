/* Gestación, sistema a sistema (0.73.0, a petición del responsable: «con CamAPS cómo se maneja,
   no texto general»). Al elegir un sistema, todo lo que el capítulo dice de ese sistema en la
   gestación, en orden práctico: autorización y evidencia, objetivo del algoritmo, ajustes y
   modos. Frases literales del apartado 10 (pp. 17-18) y la casilla de la Tabla 1; lo común a
   los cuatro sigue debajo, en los párrafos de la situación. Sin texto propio salvo los rótulos. */
import { useState } from "react";
import { PiezaVista } from "./Piezas";
import { FuentePie } from "./FuentePie";
import { siglasPorPiezas } from "../inicio";
import { GESTACION_POR_SISTEMA } from "../gestacion";
import { fuentesDePiezas } from "../fuentesPiezas";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { SISTEMA_HEX } from "../tokens";

export function GestacionSistema({ inicial }: { inicial?: number }) {
  const [c, setC] = useState(inicial !== undefined && inicial >= 0 ? inicial : 0);
  const h = SISTEMA_HEX[c];
  const bloques = GESTACION_POR_SISTEMA[c];
  const todas = bloques.flatMap((b) => b.piezas);
  const sg = siglasPorPiezas(todas, c);
  // Índice de la primera pieza de cada bloque en `todas` (las siglas van por pieza).
  const desde = bloques.map((_, i) => bloques.slice(0, i).reduce((n, x) => n + x.piezas.length, 0));
  return (
    <div>
      <div role="group" aria-label="Sistema" className="grid grid-cols-4 gap-1.5">
        {ORDEN_SISTEMAS.map((id, i) => {
          const on = i === c;
          const hi = SISTEMA_HEX[i];
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => setC(i)}
              className="flex min-h-11 flex-col items-center gap-1 rounded-lg border-2 bg-white p-1.5 text-center text-[11px] font-extrabold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:flex-row sm:gap-2 sm:text-left sm:text-sm"
              style={{
                borderColor: on ? hi.strong : "#e6e6e6",
                background: on ? hi.soft : "#fff",
                color: hi.ink,
              }}
            >
              <img
                src={FOTO_SISTEMA[id]}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-md bg-white object-cover"
              />
              {CORTO_SISTEMA[i]}
            </button>
          );
        })}
      </div>
      <dl className="mt-3 grid gap-2 lg:grid-cols-2" aria-live="polite">
        {bloques.map((b, i) => (
          <div
            key={b.rotulo}
            className="min-w-0 rounded-xl p-3"
            style={{ background: h.soft, boxShadow: `inset 3px 0 0 0 ${h.strong}` }}
          >
            <dt className="text-[11px] font-bold uppercase tracking-wide" style={{ color: h.ink }}>
              {b.rotulo}
            </dt>
            <dd className="mt-1 space-y-1.5 text-[15px] leading-snug text-slate-900">
              {b.piezas.map((p, j) => (
                <PiezaVista key={j} pieza={p} sis={c} compacta siglas={sg[desde[i] + j]} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <FuentePie className="mt-3" fuentes={fuentesDePiezas(todas)} />
    </div>
  );
}
