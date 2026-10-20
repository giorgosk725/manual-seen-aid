/* Lo que el capítulo dice de un sistema en una situación (0.73.0, a petición del responsable:
   «con CamAPS cómo se maneja, no texto general»), en orden práctico y con frases literales
   (src/porSistema.ts). Con selector en las situaciones-guía (gestación, enfermedad, ingreso);
   sin él, debajo de la casilla de la Tabla 4 del sistema ya elegido. Sin texto propio salvo los
   rótulos; la fuente, al pie. */
import { FuentePie } from "./FuentePie";
import type { BloqueSistema } from "../porSistema";
import { fuentesDePiezas } from "../fuentesPiezas";
import { CORTO_SISTEMA } from "../ampliacion/ids";
import { SISTEMA_HEX } from "../tokens";
import { DosColumnas } from "./DosColumnas";
import { CasillasSistema } from "./CasillasSistema";
import { tarjetasDeBloques } from "./tarjetasDeBloques";
import { ComplementoVista } from "./Complemento";
import type { Complemento } from "../notas-complementarias";

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

/* Séptima vuelta: el sistema elegido viene de la ruta (`seleccion`) y la casilla lo escribe en
   ella (`onElegir`), así Atrás/Adelante y los enlaces compartidos enseñan el sistema de la URL. */
export function BloquesPorSistema({
  bloques,
  comun = [],
  seleccion,
  onElegir,
  sinFuente = false,
  complementos = {},
}: {
  bloques: BloqueSistema[][];
  comun?: BloqueSistema[];
  complementos?: Record<number, Complemento>;
  seleccion: number;
  onElegir: (c: number) => void;
  /* Dentro de un diagrama, la fuente va en la línea del marco (una sola). */
  sinFuente?: boolean;
}) {
  // 0.81.1 (quinta ronda, R5): sin sistema elegido (−1), ninguno marcado ni preelegido.
  const c = seleccion;
  const propios = c >= 0 ? bloques[c] : [];
  const todas = [...propios, ...comun].flatMap((b) => b.piezas);
  return (
    <div>
      {/* 0.76: el mismo selector de sistema de toda la app (uno marcado). */}
      <div className="mb-3">
        <CasillasSistema
          seleccion={c >= 0 ? [c] : []}
          onToggle={onElegir}
          nombres={CORTO_SISTEMA}
          unico
          pista={c < 0 ? "Elegir el sistema" : undefined}
        />
      </div>
      {c >= 0 && <Bloques c={c} bloques={propios} />}
      {/* Lo común a los cuatro (objetivos de inicio), a todo lo ancho tras lo del sistema: es la
          tarjeta más alta y, en las columnas, dejaba un pie desigual. */}
      {comun.length > 0 && (
        <div className="mt-3">
          <Bloques c={Math.max(c, 0)} bloques={comun} />
        </div>
      )}
      {!sinFuente && <FuentePie className="mt-3" fuentes={fuentesDePiezas(todas)} />}
      {/* Lo complementario del sistema (no es del capítulo), al final y con su propia fuente. */}
      {c >= 0 && complementos[c] && <ComplementoVista complemento={complementos[c]} />}
    </div>
  );
}
