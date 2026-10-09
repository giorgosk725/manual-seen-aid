/* Recorridos de consulta construidos solo con el texto del capítulo:
   - Situación y sistema: eliges una situación (filas de las Tablas 4 y 6) y, si procede, un
     sistema, y ves la celda exacta más los párrafos del capítulo que la desarrollan.
   - Revisar la descarga: la Tabla 5 paso a paso (8 pasos), con el patrón relacionado.
   - Interrupción del sistema: el subapartado «Interrupción del sistema y pauta alternativa»
     como línea de tiempo (muy breve · hasta 2-3 h · prolongada), con los párrafos literales. */
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { APARTADOS, TABLAS, idDeBloque, type Bloque } from "../contenido";
import { SIS_IDS, SITUACIONES, type Situacion } from "../situaciones";
import { FOTO_SISTEMA, ORDEN_SISTEMAS, SISTEMAS_AMPLIACION } from "../ampliacion";
import { elegirRuta, href } from "../rutas";
import { casoPorId } from "../casos";
import { CabeceraEditorial, PaginaBadge, Segmented } from "../ui";
import { useIrAlCambiar } from "../irAlCambiar";
import { Lineas, Texto } from "../texto";
import { EnlaceEducativa } from "../componentes/Lectura";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";

const hex = CATEGORIA_HEX.consultar;

/* ---------- Situación y sistema ---------- */

/* Las situaciones, por tema (no por la tabla de la que salen): las filas de las Tablas 4 y 6 y
   los subapartados del apartado 10 que no tienen tabla, juntos. Los nombres de los temas son de
   la app; cada entrada conserva su rótulo del capítulo y su página o tabla. */
const TEMAS_SITUACION: { t: string; ids: string[]; subs: RegExp }[] = [
  {
    t: "Ejercicio y comidas",
    ids: ["ejercicio-aerobico", "ejercicio-anaerobico", "comida-grasa"],
    subs: /^$/,
  },
  {
    t: "Noche, enfermedad e hiperglucemia",
    ids: ["sueno", "necesidad-transitoria", "hiperglucemia-puntual", "hiperglucemia-persistente"],
    subs: /enfermedad|glucocorticoide/i,
  },
  {
    t: "Exploraciones, cirugía e ingreso",
    ids: ["rm", "tc", "rx", "pet", "diatermia", "eco", "cirugia-corta", "cirugia-larga"],
    subs: /ingreso|hospital/i,
  },
  { t: "Poblaciones y situaciones especiales", ids: [], subs: /./ },
];

function ListaSituaciones({ sit, sistema }: { sit: Situacion | null; sistema?: string }) {
  const a = APARTADOS.find((x) => x.slug === "10-situaciones")!;
  let subs = a.bloques.filter(
    (b): b is Extract<Bloque, { t: "h3" }> =>
      b.t === "h3" && b.id !== "ejercicio" && b.id !== "exploraciones",
  );
  const enlace =
    "flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500";
  return (
    <div id="lista-situaciones" className="scroll-mt-20 space-y-4">
      {TEMAS_SITUACION.map((tema) => {
        const mios = subs.filter((b) => tema.subs.test(b.texto));
        subs = subs.filter((b) => !mios.includes(b));
        const sits = tema.ids
          .map((id) => SITUACIONES.find((x) => x.id === id))
          .filter((x): x is Situacion => !!x);
        if (!sits.length && !mios.length) return null;
        return (
          <section key={tema.t} aria-label={tema.t}>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              {tema.t}
            </h2>
            <ul className="space-y-1" role="list">
              {sits.map((s) => {
                const on = sit?.id === s.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        elegirRuta(
                          "consultar",
                          "situacion",
                          on ? undefined : s.id + (sistema ? ":" + sistema : ""),
                        )
                      }
                      className={`${enlace} ${on ? "text-white" : "bg-white text-slate-800 hover:border-slate-400"}`}
                      style={
                        on
                          ? { background: hex.strong, borderColor: hex.strong }
                          : { borderColor: "#e6e6e6" }
                      }
                    >
                      {on && <Check size={14} aria-hidden="true" />}
                      <span className="flex-1">{s.etiqueta}</span>
                      <span
                        className={`shrink-0 text-[11px] ${on ? "text-white/80" : "text-slate-500"}`}
                      >
                        Tabla {s.tabla.slice(1)}
                      </span>
                    </button>
                  </li>
                );
              })}
              {mios.map((b) => (
                <li key={b.id}>
                  <a
                    href={href("capitulo", a.slug, b.id)}
                    className={`${enlace} bg-white text-slate-800 hover:border-slate-400`}
                    style={{ borderColor: "#e6e6e6" }}
                  >
                    <span className="flex-1">{b.texto}</span>
                    <span className="pagina-badge shrink-0">p. {b.p}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function SituacionSistema({ situacion, sistema }: { situacion?: string; sistema?: string }) {
  const sit = SITUACIONES.find((s) => s.id === situacion) || null;
  const sisIdx = sistema ? SIS_IDS.indexOf(sistema) : -1;
  const tabla = sit ? TABLAS[sit.tabla] : null;
  const fila = sit && tabla ? tabla.filas[sit.fila] : null;
  const porSistema = !!tabla?.porSistema && !fila?.unida;
  // Al elegir el sistema, su casilla a la vista (en el móvil quedaba bajo la barra inferior).
  const aLaCasilla = useIrAlCambiar(`${situacion}:${sistema}`, "conducta-situacion", {
    bloque: "nearest",
    enfocar: false,
  });
  return (
    <div>
      <CabeceraEditorial titulo="Situación y sistema" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          Elige la situación y, si la conducta depende del sistema, el sistema. La respuesta es la
          celda literal de las Tablas 4 o 6 del capítulo, con los párrafos que la explican.
        </p>
      </CabeceraEditorial>
      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            1 · Situación
          </div>
          <ListaSituaciones sit={sit} sistema={sistema} />
        </div>
        <div aria-live="polite" className={sit ? "order-first lg:order-none" : undefined}>
          {!sit && (
            <div
              className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-slate-600"
              style={{ borderColor: "#d4d4d4", background: "#f8fafc" }}
            >
              Elige una situación de la lista.
            </div>
          )}
          {sit && tabla && fila && (
            <div key={sit.id} className="pantalla-in space-y-4">
              {/* En el móvil, la situación elegida a la vista y cómo cambiarla sin bajar. */}
              <div
                className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 lg:hidden"
                style={{ borderColor: "#e6e6e6" }}
              >
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Situación
                  </span>
                  <span className="block font-semibold text-slate-900">{sit.etiqueta}</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("lista-situaciones")?.scrollIntoView({ block: "start" })
                  }
                  className="min-h-11 shrink-0 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-slate-500"
                >
                  Cambiar
                </button>
              </div>
              {!porSistema && (
                <p className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700">
                  En la Tabla {tabla.numero}, esta situación tiene una conducta común a los cuatro
                  sistemas (no distingue sistema). Lo propio de cada uno está en su ficha de{" "}
                  <a href={href("sistemas")} className="font-semibold underline">
                    Sistemas
                  </a>
                  .
                </p>
              )}
              {porSistema && (
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    2 · Sistema
                  </div>
                  <div
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                    role="group"
                    aria-label="Sistema"
                  >
                    {ORDEN_SISTEMAS.map((id, c) => {
                      const on = sisIdx === c;
                      const h = SISTEMA_HEX[c];
                      const s = SISTEMAS_AMPLIACION[c];
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            aLaCasilla();
                            elegirRuta(
                              "consultar",
                              "situacion",
                              sit.id + (on ? "" : ":" + SIS_IDS[c]),
                            );
                          }}
                          className="hover-lift ease-brand flex items-center gap-2 rounded-xl border p-2 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                          style={
                            on
                              ? { background: h.ink, borderColor: h.ink, color: "#fff" }
                              : { background: h.soft, borderColor: `${h.strong}40`, color: h.ink }
                          }
                        >
                          <img
                            src={FOTO_SISTEMA[id]}
                            alt=""
                            className="h-8 w-8 rounded-md bg-white object-cover"
                          />
                          <span className="min-w-0 truncate">{s.short}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <section
                id="conducta-situacion"
                className="scroll-mb-28 scroll-mt-24 rounded-2xl border bg-white p-4 shadow-soft"
                style={{ borderColor: "#e6e6e6" }}
                aria-label="Conducta recomendada"
              >
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: hex.ink }}
                    >
                      Tabla {tabla.numero} · {tabla.cabeceraEtiqueta}
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      <Lineas>{fila.etiqueta}</Lineas>
                    </h2>
                  </div>
                  <PaginaBadge p={tabla.paginas[0]} p2={tabla.paginas[1]} />
                </div>
                {fila.unida ? (
                  <p
                    className="rounded-xl p-3 text-base text-slate-800"
                    style={{ background: "#f1f5f9" }}
                  >
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Todos los sistemas
                    </span>
                    <Lineas>{fila.celdas[0]}</Lineas>
                  </p>
                ) : porSistema ? (
                  sisIdx >= 0 ? (
                    <div
                      className="rounded-xl p-3 text-base text-slate-800"
                      style={{ background: SISTEMA_HEX[sisIdx].soft }}
                    >
                      <span
                        className="mb-1 block text-xs font-bold uppercase tracking-wide"
                        style={{ color: SISTEMA_HEX[sisIdx].ink }}
                      >
                        {tabla.columnas[sisIdx]}
                      </span>
                      <Lineas>{fila.celdas[sisIdx]}</Lineas>
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {tabla.columnas.map((nombre, c) => (
                        <div
                          key={c}
                          className="rounded-xl p-3 text-sm text-slate-800"
                          style={{ background: SISTEMA_HEX[c].soft }}
                        >
                          <span
                            className="mb-1 block text-xs font-bold uppercase tracking-wide"
                            style={{ color: SISTEMA_HEX[c].ink }}
                          >
                            {nombre}
                          </span>
                          <Lineas>{fila.celdas[c]}</Lineas>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <dl className="grid gap-2 sm:grid-cols-2">
                    {tabla.columnas.map((nombre, c) => (
                      <div key={c} className="rounded-xl p-3" style={{ background: "#f1f5f9" }}>
                        <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                          {nombre}
                        </dt>
                        <dd className="text-base text-slate-800">
                          <Lineas>{fila.celdas[c]}</Lineas>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Leer en el capítulo
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {sit.leer.map((l) => (
                    <li key={l.slug + l.ancla}>
                      <a
                        href={href("capitulo", l.slug, l.ancla)}
                        className="inline-flex min-h-11 items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400 sm:min-h-8"
                        style={{ borderColor: "#d4d4d4" }}
                      >
                        {l.titulo} <ArrowRight size={12} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={href("consultar", "tablas", sit.tabla)}
                      className="inline-flex min-h-11 items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400 sm:min-h-8"
                      style={{ borderColor: "#d4d4d4" }}
                    >
                      Tabla {tabla.numero} completa <ArrowRight size={12} aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
              <EnlaceEducativa clave={sit.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Revisar la descarga (Tabla 5 paso a paso) ---------- */
const PATRON_DEL_PASO: Record<number, string[]> = {
  1: ["Salidas repetidas del modo automático.", "Pérdidas de señal y salidas del modo automático."],
  2: ["Tiempo por debajo del rango elevado.", "Hipoglucemia nocturna."],
  3: ["Variabilidad elevada con TIR aceptable."],
  4: [
    "Bolos omitidos o retrasados.",
    "Hidratos de carbono fantasma (ghost carbs).",
    "Exceso de autocorrecciones.",
  ],
  5: ["Hipoglucemia nocturna.", "Hiperglucemia matutina."],
  6: ["Hiperglucemia posprandial precoz.", "Hiperglucemia tardía tras comidas grasas o proteicas."],
  7: ["Exceso de autocorrecciones."],
  8: ["Hiperglucemia persistente y sospecha de fallo de infusión."],
};

function parrafosConLead(leads: string[]) {
  const a = APARTADOS.find((x) => x.slug === "09-descarga")!;
  const out: { ancla: string; b: Extract<Bloque, { t: "p" }> }[] = [];
  a.bloques.forEach((b, i) => {
    if (b.t === "p" && b.lead && leads.includes(b.lead)) out.push({ ancla: idDeBloque(b, i), b });
  });
  return out;
}

export function RevisarDescarga({ paso }: { paso?: string }) {
  const t = TABLAS.T5;
  const n = Math.min(8, Math.max(1, Number(paso) || 1));
  const fila = t.filas[n - 1];
  const patrones = parrafosConLead(PATRON_DEL_PASO[n] || []);
  const ir = (k: number) => elegirRuta("consultar", "descarga", String(k));
  const alPaso = useIrAlCambiar(String(n), "paso-descarga");
  return (
    <div>
      <CabeceraEditorial titulo="Revisar la descarga" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          La Tabla 5 del capítulo (pp. 13–14) paso a paso: ocho pasos, de la visión global a la
          causa y al plan de cambios.
        </p>
      </CabeceraEditorial>
      <ol className="mb-4 flex flex-wrap gap-1.5" aria-label="Pasos">
        {t.filas.map((f, i) => {
          const on = i + 1 === n;
          return (
            <li key={i}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => ir(i + 1)}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-white" : "border border-slate-300 bg-white text-slate-600 hover:border-slate-500"}`}
                style={
                  on
                    ? { background: `linear-gradient(135deg, ${hex.strong}, ${hex.strong2})` }
                    : undefined
                }
                title={f.celdas[0]}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>
      <label className="no-imprimir mb-4 block max-w-md text-sm">
        <span className="mb-1 block text-xs font-semibold text-slate-500">Ir a un paso</span>
        <select
          value={n}
          onChange={(e) => ir(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          {t.filas.map((f, i) => (
            <option key={i} value={i + 1}>
              {i + 1}. {f.celdas[0]}
            </option>
          ))}
        </select>
      </label>
      <section
        key={n}
        id="paso-descarga"
        tabIndex={-1}
        className="pantalla-in scroll-mt-24 rounded-2xl border bg-white p-4 shadow-soft focus:outline-none"
        style={{ borderColor: "#e6e6e6" }}
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-extrabold text-slate-900">
            <span className="mr-2 tabular-nums" style={{ color: hex.strong }}>
              {n}.
            </span>
            {fila.celdas[0]}
          </h2>
          <PaginaBadge p={t.paginas[0]} p2={t.paginas[1]} />
        </div>
        <dl className="mt-3 grid gap-3 md:grid-cols-3">
          {t.columnas.slice(1).map((col, j) => (
            <div
              key={col}
              className="rounded-xl p-3"
              style={{ background: j === 2 ? hex.soft : "#f8fafc" }}
            >
              <dt
                className="mb-1 text-xs font-bold uppercase tracking-wide"
                style={{ color: j === 2 ? hex.ink : "#475569" }}
              >
                {col}
              </dt>
              <dd className="text-sm text-slate-800">
                <Lineas>{fila.celdas[j + 1]}</Lineas>
              </dd>
            </div>
          ))}
        </dl>
        {casoPorId("ejemplo-descarga") && (
          <a
            href={href("casos", "ejemplo-descarga", String(n))}
            className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-white"
            style={{ background: CATEGORIA_HEX.aprender.strong }}
          >
            Ver este paso en el ejemplo comentado <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
        {patrones.length > 0 && (
          <div className="mt-4">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Patrón relacionado (del capítulo)
            </div>
            <ul className="space-y-2">
              {patrones.map((p) => (
                <li
                  key={p.ancla}
                  className="rounded-xl border p-3 text-sm text-slate-800"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  <strong>{p.b.lead} </strong>
                  <Texto>{p.b.texto}</Texto>
                  <a
                    href={href("capitulo", "09-descarga", p.ancla)}
                    className="ml-1 inline-flex items-center gap-0.5 text-xs font-semibold text-slate-600 hover:underline"
                  >
                    p. {p.b.p} <ArrowRight size={11} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {n === 8 && (
          <a
            href={href("consultar", "figura-3")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${hex.strong}, ${hex.strong2})` }}
          >
            Aplicar la Figura 3 paso a paso <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
        <div
          className="mt-4 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "#e6e6e6" }}
        >
          <button
            type="button"
            disabled={n === 1}
            onClick={() => {
              alPaso();
              ir(n - 1);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Paso {n - 1 || 1}
          </button>
          <button
            type="button"
            disabled={n === 8}
            onClick={() => {
              alPaso();
              ir(n + 1);
            }}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: hex.strong }}
          >
            Paso {Math.min(8, n + 1)} <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">
        <Texto>{t.notas[1]}</Texto>
      </p>
      <div className="mt-3">
        <EnlaceEducativa clave="descarga" />
      </div>
    </div>
  );
}

/* ---------- Interrupción del sistema (línea de tiempo) ---------- */
const TRAMOS_INTERRUPCION = [
  { id: "breve", titulo: "Muy breve", sub: "reanudación o sustitución inmediata", parrafo: 0 },
  { id: "una-hora", titulo: "≈ 1 h sin insulina", sub: "umbral operativo: actuar", parrafo: 0 },
  {
    id: "pocas-horas",
    titulo: "Hasta 2-3 h, programada",
    sub: "deporte, baño, exploraciones",
    parrafo: 1,
  },
  {
    id: "prolongada",
    titulo: "Prolongada o fallo definitivo",
    sub: "múltiples dosis con pluma",
    parrafo: 2,
  },
  {
    id: "programada",
    titulo: "Cirugía, ingreso, exploración larga",
    sub: "glargina programada y reinicio",
    parrafo: 3,
  },
];

export function Interrupcion({ tramo }: { tramo?: string }) {
  const a = APARTADOS.find((x) => x.slug === "07-educacion")!;
  const inicio = a.bloques.findIndex((b) => b.t === "h3" && b.id === "interrupcion");
  const fin = a.bloques.findIndex((b, i) => i > inicio && b.t === "h3");
  const parrafos = a.bloques
    .slice(inicio + 1, fin)
    .map((b, k) => ({ b, ancla: idDeBloque(b, inicio + 1 + k) }))
    .filter((x) => x.b.t === "p") as { b: Extract<Bloque, { t: "p" }>; ancla: string }[];
  // El tramo vive en la URL (Atrás/Adelante y enlaces lo respetan).
  const sel = tramo && TRAMOS_INTERRUPCION.some((t) => t.id === tramo) ? tramo : "breve";
  const actual = TRAMOS_INTERRUPCION.find((t) => t.id === sel)!;
  const p = parrafos[actual.parrafo];
  return (
    <div>
      <CabeceraEditorial titulo="Interrupción del sistema" hex={hex} level={1}>
        <p className="text-sm text-slate-600">
          El subapartado «Interrupción del sistema y pauta alternativa» (p. 9) como línea de tiempo:
          elige cuánto va a durar la interrupción y lee el párrafo que corresponde.
        </p>
      </CabeceraEditorial>
      <div className="no-imprimir mb-4">
        <Segmented
          label="Duración de la interrupción"
          wrap
          value={sel}
          onChange={(v) => {
            elegirRuta("consultar", "interrupcion", v);
          }}
          options={TRAMOS_INTERRUPCION.map((t) => ({ id: t.id, label: t.titulo }))}
        />
      </div>
      <ol className="relative mb-4 grid grid-cols-5 gap-1" aria-hidden="true">
        {TRAMOS_INTERRUPCION.map((t, i) => (
          <li key={t.id} className="text-center">
            <div
              className="mx-auto h-2 rounded-full"
              style={{
                background:
                  i <= TRAMOS_INTERRUPCION.findIndex((x) => x.id === sel) ? hex.strong : "#e6e6e6",
              }}
            />
            <div className="mt-1 hidden text-[11px] text-slate-500 sm:block">{t.sub}</div>
          </li>
        ))}
      </ol>
      <section
        key={sel}
        className="pantalla-in rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        aria-live="polite"
      >
        <h2 className="text-lg font-extrabold text-slate-900">{actual.titulo}</h2>
        <p className="text-sm text-slate-500">{actual.sub}</p>
        {p && (
          <p className="prosa mt-3">
            <Texto>{p.b.texto}</Texto>
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {p && <PaginaBadge p={p.b.p} />}
          <a
            href={href("capitulo", "07-educacion", "interrupcion")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline"
          >
            Leer el subapartado completo <ArrowRight size={11} aria-hidden="true" />
          </a>
          {sel === "prolongada" || sel === "programada" ? (
            <a
              href={href("consultar", "figura-3")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline"
            >
              Si hay cetonemia: Figura 3 <ArrowRight size={11} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </section>
      <p className="mt-3 text-xs text-slate-500">
        <Texto>{parrafos[4]?.b.texto ?? ""}</Texto>
      </p>
      <div className="mt-3">
        <EnlaceEducativa clave="interrupcion" />
      </div>
    </div>
  );
}
