/* El selector de sistema de toda la app (Sistemas AID, Situaciones, Iniciación del sistema): una
   casilla por sistema (cuadro con marca y punto de su color). Uno o varios según quien lo use;
   el nombre corto en el móvil y el completo en pantallas grandes, salvo que se den nombres.
   En el móvil, las cuatro en una fila (marca y punto arriba, nombre debajo) y lo demás («Los
   cuatro», la pista) en la fila siguiente; desde sm, todo seguido como antes (sm:contents). */
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { TABLAS } from "../contenido";
import { SEEN, SISTEMA_HEX } from "../tokens";
import { CATALOGO_SISTEMAS, CORTO_CASILLA as CORTO_SISTEMA } from "../ampliacion/ids";
import { NombreSistema } from "./NombreSistema";

/* En la casilla estrecha del móvil, el nombre puede ir en dos líneas, pero un final corto
   («Omnipod 5», «CamAPS FX») no se queda solo: espacio duro antes de él. */
const pegarFinal = (t: string) => t.replace(/ (\S{1,2})$/, "\u00a0$1");

export function CasillasSistema({
  seleccion,
  onToggle,
  etiqueta = "Sistema",
  nombres,
  pista,
  extra,
  unico = false,
}: {
  /* Elección única (Situaciones, gestación): botones de opción, no casillas (0.77.1, auditoría
     visual: el dibujo de casilla prometía elegir varios). */
  unico?: boolean;
  /* Columnas (0-3, orden de la Tabla 1) marcadas. */
  seleccion: number[];
  onToggle: (c: number) => void;
  etiqueta?: string;
  /* Nombres fijos (en vez de corto en el móvil y completo en escritorio). */
  nombres?: string[];
  /* Texto breve al lado («Marca otro para compararlos»). */
  pista?: string;
  /* Un control más dentro del grupo (p. ej. «Los cuatro»). */
  extra?: ReactNode;
}) {
  return (
    <div
      role={unico ? "radiogroup" : "group"}
      aria-label={etiqueta}
      className="sm:flex sm:flex-wrap sm:items-center sm:gap-1.5"
    >
      <div className="grid grid-cols-2 gap-1.5 sm:contents">
        {TABLAS.T1.columnas.map((nombre, c) => {
          const on = seleccion.includes(c);
          const h = SISTEMA_HEX[c];
          return (
            <button
              key={nombre}
              type="button"
              {...(unico ? { role: "radio", "aria-checked": on } : { "aria-pressed": on })}
              onClick={() => onToggle(c)}
              className="tap-44 flex min-h-11 items-center gap-1.5 rounded-md border px-2 py-1 text-left text-[13px] font-semibold leading-tight text-slate-800 transition ease-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:inline-flex sm:min-h-0 sm:px-2.5 sm:text-sm sm:leading-normal"
              style={
                on
                  ? { borderColor: SEEN.burdeos, background: "#f7eff3" }
                  : { borderColor: "#d4d4d4", background: "#fff" }
              }
            >
              <span className="flex shrink-0 items-center gap-1 sm:contents">
                {unico ? (
                  <span
                    aria-hidden="true"
                    className={`casilla-opcion grid h-4 w-4 shrink-0 place-items-center rounded-full border ${on ? "marca-on" : ""}`}
                    style={{ borderColor: on ? SEEN.burdeos : "#9ca3af" }}
                  >
                    {on && (
                      <span
                        className="marca-punto h-2 w-2 rounded-full"
                        style={{ background: SEEN.burdeos }}
                      />
                    )}
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm border ${on ? "marca-caja" : ""}`}
                    style={
                      on
                        ? { background: SEEN.burdeos, borderColor: SEEN.burdeos }
                        : { background: "#fff", borderColor: "#9ca3af" }
                    }
                  >
                    {on && <Check size={12} color="#fff" />}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="punto-sistema h-2 w-2 shrink-0 rounded-full"
                  // 0.78.1: lee `--sis`; en nocturno, la tinta clara del sistema (≥ 3:1).
                  style={{ ["--sis" as string]: h.strong, background: "var(--sis)" }}
                />
              </span>
              {nombres ? (
                <span>
                  <NombreSistema n={pegarFinal(nombres[c])} />
                </span>
              ) : unico ? (
                // 0.81.1 (quinta ronda, adjunto): en la elección única (paneles estrechos de
                // Situaciones y la calculadora), el nombre corto también en el ordenador: las
                // cuatro en una línea.
                <span>{pegarFinal(CORTO_SISTEMA[c])}</span>
              ) : (
                <>
                  <span className="sm:hidden">{pegarFinal(CORTO_SISTEMA[c])}</span>
                  <span className="hidden sm:inline">
                    <NombreSistema n={CATALOGO_SISTEMAS[c].name} />
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
      {(extra || pista) && (
        <div className="mt-1.5 flex items-center gap-2 empty:hidden sm:contents">
          {extra}
          {pista && <span className="text-xs text-slate-500">{pista}</span>}
        </div>
      )}
    </div>
  );
}
