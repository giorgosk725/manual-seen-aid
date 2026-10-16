/* Lo que el capítulo dice de un sistema en una situación (0.73.0, a petición del responsable:
   «con CamAPS cómo se maneja, no texto general»), en orden práctico y con frases literales
   (src/porSistema.ts). Con selector en las situaciones-guía (gestación, enfermedad, ingreso);
   sin él, debajo de la casilla de la Tabla 4 del sistema ya elegido. Sin texto propio salvo los
   rótulos; la fuente, al pie. */
import { useState } from "react";
import { FuentePie } from "./FuentePie";
import type { BloqueSistema } from "../porSistema";
import { fuentesDePiezas } from "../fuentesPiezas";
import { CORTO_SISTEMA } from "../ampliacion/ids";
import { SISTEMA_HEX } from "../tokens";
import { DosColumnas } from "./DosColumnas";
import { CasillasSistema } from "./CasillasSistema";
import { tarjetasDeBloques } from "./tarjetasDeBloques";

function Bloques({ c, bloques }: { c: number; bloques: BloqueSistema[] }) {
  const h = SISTEMA_HEX[c];
  const tarjetas = tarjetasDeBloques(c, bloques);
  return (
    <div
      className={`grid gap-3 print:grid-cols-1 ${bloques.length > 1 ? "lg:grid-cols-2 lg:items-start" : ""}`}
      aria-live="polite"
      style={{ ["--sis" as string]: h.strong }}
    >
      <DosColumnas
        key={c}
        desde="lg"
        items={tarjetas}
        peso={(t) => t.peso}
        render={(t) => t.nodo}
      />
    </div>
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
