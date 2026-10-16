/* Lo que el capítulo dice de un sistema en una situación (0.73.0, a petición del responsable:
   «con CamAPS cómo se maneja, no texto general»), en orden práctico y con frases literales
   (src/porSistema.ts). Con selector en las situaciones-guía (gestación, enfermedad, ingreso);
   sin él, debajo de la casilla de la Tabla 4 del sistema ya elegido. Sin texto propio salvo los
   rótulos; la fuente, al pie. */
import { useState } from "react";
import { PiezaVista } from "./Piezas";
import { PiezasSinTitulos } from "./piezasContexto";
import { FuentePie } from "./FuentePie";
import { siglasPorPiezas } from "../inicio";
import type { BloqueSistema } from "../porSistema";
import { fuentesDePiezas } from "../fuentesPiezas";
import { CORTO_SISTEMA } from "../ampliacion/ids";
import { SISTEMA_HEX } from "../tokens";
import { CasillasSistema } from "./CasillasSistema";

function Bloques({ c, bloques }: { c: number; bloques: BloqueSistema[] }) {
  const h = SISTEMA_HEX[c];
  const todas = bloques.flatMap((b) => b.piezas);
  const sg = siglasPorPiezas(todas, c);
  // Índice de la primera pieza de cada bloque en `todas` (las siglas van por pieza).
  const desde = bloques.map((_, i) => bloques.slice(0, i).reduce((n, x) => n + x.piezas.length, 0));
  return (
    <PiezasSinTitulos.Provider value={true}>
      <dl
        className={`[&>div]:mb-3 [&>div]:break-inside-avoid ${bloques.length > 1 ? "lg:columns-2 lg:gap-3" : ""}`}
        aria-live="polite"
        style={{ ["--sis" as string]: h.strong }}
      >
        {bloques.map((b, i) => (
          <div key={b.rotulo} className="tarjeta tarjeta-sistema min-w-0 p-3">
            <dt className="rotulo" style={{ color: h.ink }}>
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
    </PiezasSinTitulos.Provider>
  );
}

/* Debajo de una casilla de la Tabla 4, para el sistema ya elegido (sin selector). */
export function AnadidoDelSistema({
  c,
  bloques,
  sinFuente = false,
}: {
  c: number;
  bloques: BloqueSistema[];
  /* La fuente va en la línea de fuente del bloque que lo contiene (0.75.1). */
  sinFuente?: boolean;
}) {
  if (!bloques.length) return null;
  return (
    <div className="mt-3">
      <Bloques c={c} bloques={bloques} />
      {!sinFuente && <FuentePie fuentes={fuentesDePiezas(bloques.flatMap((b) => b.piezas))} />}
    </div>
  );
}

export function BloquesPorSistema({
  bloques,
  comun = [],
  inicial,
}: {
  bloques: BloqueSistema[][];
  comun?: BloqueSistema[];
  inicial?: number;
}) {
  const [c, setC] = useState(inicial !== undefined && inicial >= 0 ? inicial : 0);
  const todas = [...bloques[c], ...comun].flatMap((b) => b.piezas);
  return (
    <div>
      {/* 0.76: el mismo selector de sistema de toda la app (uno marcado). */}
      <div className="mb-3">
        <CasillasSistema seleccion={[c]} onToggle={(i) => setC(i)} nombres={CORTO_SISTEMA} />
      </div>
      <Bloques c={c} bloques={[...bloques[c], ...comun]} />
      <FuentePie className="mt-3" fuentes={fuentesDePiezas(todas)} />
    </div>
  );
}
