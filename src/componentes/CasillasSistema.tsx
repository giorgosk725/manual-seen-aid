/* El selector de sistema de toda la app (Sistemas AID, Situaciones, Iniciación del sistema): una
   casilla por sistema (cuadro con marca y punto de su color). Uno o varios según quien lo use;
   el nombre corto en el móvil y el completo en pantallas grandes, salvo que se den nombres.
   En el móvil, las cuatro en una fila (marca y punto arriba, nombre debajo) y lo demás («Los
   cuatro», la pista) en la fila siguiente; desde sm, todo seguido como antes (sm:contents). */
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { TABLAS } from "../contenido";
import { SEEN, SISTEMA_HEX } from "../tokens";
import { CATALOGO_SISTEMAS, CORTO_CASILLA as CORTO_SISTEMA } from "../ampliacion/ids";
import { NombreSistema } from "./NombreSistema";

/* En la casilla estrecha del móvil, el nombre puede ir en dos líneas, pero un final corto
   («Omnipod 5», «CamAPS FX») no se queda solo: espacio duro antes de él. */
const pegarFinal = (t: string) => t.replace(/ (\S{1,2})$/, "\u00a0$1");

/* 1.0.10 (23.ª ronda, R3): la opción elegida con una flecha, para devolverle el foco cuando el
   cambio de ruta vuelve a pintar el selector (antes, el foco acababa en el título de la pantalla
   y las flechas siguientes ya no hacían nada). */
let focoPendiente: { etiqueta: string; c: number } | null = null;

export function CasillasSistema({
  seleccion,
  onToggle,
  etiqueta = "Sistema",
  nombres,
  pista,
  extra,
  unico = false,
  desactivado,
  enFila = false,
  cortoEnMovil = false,
}: {
  /* 0.96.0 (16.ª ronda, visual): con `enFila`, en el móvil el nombre breve de la casilla
     («Control-IQ»); desde sm, `nombres` (Iniciación: el texto del paso empieza antes). */
  cortoEnMovil?: boolean;
  /* 0.92.0 (revisión de tarjetas, ★12): en el móvil, las cuatro en una fila (marca y punto arriba,
     nombre debajo) en vez de 2 × 2: el plan del paciente las quiere a la vista sin ocupar dos
     filas (decisión previa, prueba de 360 px). */
  enFila?: boolean;
  /* 0.89.1 (13.ª ronda, R5): una columna que no se puede elegir (en la calculadora, el sistema
     actual no puede ser el de destino). */
  desactivado?: number;
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
  // 1.0.9 (revisión externa D108-01): en la elección única, el patrón de grupo de opciones: Tab
  // entra y sale del grupo (solo la elegida, o la primera disponible, está en el orden de Tab) y
  // las flechas cambian la elección y el foco, saltando la desactivada.
  const grupo = useRef<HTMLDivElement>(null);
  const columnas = TABLAS.T1.columnas.map((_, c) => c).filter((c) => c !== desactivado);
  const conFoco = seleccion.find((c) => columnas.includes(c)) ?? columnas[0];
  const alPulsar = (e: KeyboardEvent<HTMLButtonElement>, c: number) => {
    const paso =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    const i = columnas.indexOf(c);
    const destino =
      e.key === "Home"
        ? columnas[0]
        : e.key === "End"
          ? columnas[columnas.length - 1]
          : paso
            ? columnas[(i + paso + columnas.length) % columnas.length]
            : undefined;
    if (destino === undefined) return;
    e.preventDefault();
    focoPendiente = { etiqueta, c: destino };
    if (!seleccion.includes(destino)) onToggle(destino);
    const enfocar = () =>
      grupo.current?.querySelector<HTMLButtonElement>(`[data-columna="${destino}"]`)?.focus();
    enfocar();
    // Si elegir cambia de pantalla, el foco vuelve a la opción cuando se pinta de nuevo.
    window.setTimeout(enfocar, 0);
  };
  // Antes que la pantalla (los efectos del hijo van primero), el foco a la opción pendiente: así
  // la Shell ve el foco dentro del contenido y no lo lleva al título.
  useEffect(() => {
    if (!focoPendiente || focoPendiente.etiqueta !== etiqueta) return;
    const b = grupo.current?.querySelector<HTMLButtonElement>(
      `[data-columna="${focoPendiente.c}"]`,
    );
    if (b) {
      b.focus({ preventScroll: true });
      focoPendiente = null;
    }
  });
  return (
    // 1.0.13 (25.ª ronda, senior): el selector mide su propio ancho (container query, index.css):
    // en una columna estrecha (Situaciones a 1024–1180 px, o con zoom), 2 × 2 en vez de cuartos
    // que recortaban «MiniMed 780G» y «Control-IQ / Control-IQ+».
    <div className={unico ? "casillas-medida" : undefined}>
      <div
        ref={grupo}
        role={unico ? "radiogroup" : "group"}
        aria-label={etiqueta}
        // 0.82.1 (sexta ronda, adjunto y visual): en la elección única, cuatro columnas iguales desde
        // sm (antes, Omnipod 5 bajaba solo a otra fila a 1366 y 1440); un nombre largo va en dos
        // líneas dentro de su casilla.
        className={
          unico
            ? // 1.0.1 (19.ª ronda, visual y adjunto): con algo al lado («Comparar» en la ficha), en la
              // misma fila (antes bajaba solo a otra de 48 px).
              // 1.0.13 (25.ª ronda, visual): desde xl, cada casilla a la medida de su nombre
              // («Control-IQ / Control-IQ+» iba en dos líneas a 1366 y 1440).
              extra
              ? "casillas-unico sm:grid sm:grid-cols-[repeat(4,minmax(0,1fr))_auto] sm:items-stretch sm:gap-1.5 xl:grid-cols-[repeat(4,max-content)_auto] xl:[&_button]:whitespace-nowrap"
              : "casillas-unico sm:grid sm:grid-cols-4 sm:gap-1.5"
            : "sm:flex sm:flex-wrap sm:items-center sm:gap-1.5"
        }
      >
        <div className={`grid sm:contents ${enFila ? "grid-cols-4 gap-1" : "grid-cols-2 gap-1.5"}`}>
          {TABLAS.T1.columnas.map((nombre, c) => {
            const on = seleccion.includes(c);
            const h = SISTEMA_HEX[c];
            const fuera = desactivado === c;
            return (
              <button
                key={nombre}
                type="button"
                {...(unico
                  ? {
                      role: "radio",
                      "aria-checked": on,
                      tabIndex: c === conFoco ? 0 : -1,
                      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => alPulsar(e, c),
                    }
                  : { "aria-pressed": on })}
                data-columna={c}
                onClick={() => onToggle(c)}
                disabled={fuera}
                title={fuera ? "Es el sistema de destino" : undefined}
                // Con el nombre breve en el móvil, el nombre accesible es el de siempre (sin el guion
                // duro de la presentación).
                aria-label={cortoEnMovil && enFila && nombres ? nombres[c] : undefined}
                className={`${enFila ? "max-sm:flex-col max-sm:items-start" : ""} tap-44 flex disabled:cursor-not-allowed disabled:opacity-50 min-h-11 items-center gap-1.5 rounded-md border px-2 py-1 text-left text-[13px] font-semibold leading-tight text-slate-800 transition ease-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:inline-flex sm:min-h-9 sm:px-2.5 sm:text-sm sm:leading-normal`}
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
                {nombres && enFila && cortoEnMovil ? (
                  <>
                    <span className="text-xs sm:hidden">
                      {CORTO_SISTEMA[c]
                        .replace(/-/g, "\u2011")
                        .replace(/(Omnipod|CamAPS) /, "$1\u00a0")}
                    </span>
                    <span className="hidden sm:inline">
                      <NombreSistema n={pegarFinal(nombres[c])} />
                    </span>
                  </>
                ) : nombres && enFila ? (
                  // En la fila de cuatro del móvil, el nombre puede partirse («MiniMed ⏎ 780G»), pero
                  // no por el guion («Control-⏎IQ»): guion duro.
                  <span className="max-sm:text-xs">
                    {nombres[c].replace(/-/g, "\u2011").replace(/(Omnipod|CamAPS) /, "$1\u00a0")}
                  </span>
                ) : nombres ? (
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
          <div
            className={`mt-1.5 flex items-center gap-2 empty:hidden ${unico ? (extra ? "sm:mt-0" : "sm:col-span-4") : "sm:contents"}`}
          >
            {extra}
            {pista && <span className="text-xs text-slate-500">{pista}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
