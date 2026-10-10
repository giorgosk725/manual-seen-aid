/* Diagramas a partir del texto del capítulo (datos en src/contenido/diagramas.ts). HTML y CSS,
   no SVG: el texto es real (se lee a 360 px, se busca, se imprime y lo lee un lector de pantalla). */
import {
  createContext,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowRight, BookOpen, Images } from "lucide-react";
import {
  ALGORITMOS,
  DIAGRAMAS,
  EJERCICIO,
  ESCALA_CETONEMIA,
  HIPOGLUCEMIA,
  OBJETIVOS_MCG,
  SEGUIMIENTO,
  TRANSICION,
  GESTACION_COMUN,
  GESTACION_SISTEMAS,
  HOSPITAL,
  EXPLORACIONES_ESTADO,
  INTERRUPCION_LINEA,
  type DiagramaId,
  type EstadoExploracion,
  type TonoFranja,
} from "../contenido/diagramas";
import { F2, FIGURA3, TABLAS, algoritmoDelCapitulo, ubicacionDeDiagrama } from "../contenido";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";
import { BotonImprimir, PaginaBadge, Segmented } from "../ui";
import { SISTEMA_HEX, TRAMO_HEX } from "../tokens";
import { Lineas, Texto } from "../texto";
import { useNivelTitulo, type Nivel } from "../nivel-contexto";

/* Colores de franja (familia AGP). Texto con contraste AA sobre cada fondo. */
const TONO: Record<TonoFranja, { bg: string; fg: string }> = {
  "muy-alto": { bg: "#c2410c", fg: "#ffffff" },
  alto: { bg: "#fde68a", fg: "#713f12" },
  rango: { bg: "#15803d", fg: "#ffffff" },
  estrecho: { bg: "#bbf7d0", fg: "#14532d" },
  bajo: { bg: "#dc2626", fg: "#ffffff" },
  "muy-bajo": { bg: "#7f1d1d", fg: "#ffffff" },
};

/* Nivel del título del diagrama: 2 en su pantalla (#/visual, tras el h1) y 3 dentro de un
   apartado. Los subtítulos del diagrama van un nivel por debajo. */
const NivelDiagrama = createContext<Nivel>(3);
function Sub({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const nivel = useContext(NivelDiagrama);
  const H = nivel === 2 ? "h3" : nivel === 3 ? "h4" : "h5";
  return (
    <H className={className} style={style}>
      {children}
    </H>
  );
}

export function MarcoDiagrama({
  id,
  children,
  enApartado = false,
}: {
  id: DiagramaId;
  children: ReactNode;
  enApartado?: boolean;
}) {
  const meta = DIAGRAMAS.find((d) => d.id === id)!;
  const ref = useRef<HTMLElement>(null);
  const donde = ubicacionDeDiagrama(id);
  const nivelContexto = useNivelTitulo();
  const nivel: Nivel = enApartado ? nivelContexto : 2;
  const Titulo = `h${nivel}` as "h2" | "h3" | "h4";
  return (
    <NivelDiagrama.Provider value={nivel}>
      <section
        ref={ref}
        aria-labelledby={`diag-${id}`}
        className="bloque-papel imprimible rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "#343093" }}>
              Diagrama · a partir del texto del capítulo
            </div>
            <Titulo id={`diag-${id}`} className="text-base font-extrabold text-slate-900">
              {meta.titulo}
            </Titulo>
          </div>
          <span className="pagina-badge">
            {meta.paginas.length === 1 ? "p." : "pp."} {meta.paginas.join(", ")}
          </span>
        </div>
        {children}
        <div
          className="no-imprimir mt-4 flex flex-wrap items-center gap-2 border-t pt-3"
          style={{ borderColor: "#e6e6e6" }}
        >
          {!enApartado && donde && (
            <a
              href={href("capitulo", donde.apartado.slug, donde.ancla)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400"
            >
              <BookOpen size={12} aria-hidden="true" /> Leer en el capítulo: {donde.apartado.n}.{" "}
              {donde.apartado.corto}
            </a>
          )}
          {enApartado && (
            <a
              href={href("visual", id)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-400"
            >
              <Images size={12} aria-hidden="true" /> Abrir a pantalla completa
            </a>
          )}
          <BotonImprimir objetivo={ref} compacto>
            Imprimir
          </BotonImprimir>
        </div>
      </section>
    </NivelDiagrama.Provider>
  );
}

/* ---------- 1. Objetivos de MCG ---------- */
function Escalera({ i }: { i: number }) {
  const p = OBJETIVOS_MCG[i];
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <Sub className="text-sm font-bold text-slate-900">{p.nombre}</Sub>
        <PaginaBadge p={p.pagina} />
      </div>
      <ol className="space-y-1">
        {p.franjas.map((f, j) => {
          const t = TONO[f.tono];
          return (
            <li
              key={j}
              className="flex items-stretch overflow-hidden rounded-lg border"
              style={{ borderColor: "#e6e6e6" }}
            >
              <span
                className="flex w-28 shrink-0 items-center px-2 py-2 text-xs font-bold"
                style={{ background: t.bg, color: t.fg }}
              >
                {f.franja}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2 bg-white px-2 py-1.5">
                <span className="w-16 shrink-0 whitespace-nowrap text-base font-extrabold tabular-nums text-slate-900">
                  {f.objetivo}
                </span>
                {f.nota && <span className="text-xs leading-snug text-slate-600">{f.nota}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <ul className="mt-2 space-y-1 text-xs text-slate-700">
        {p.extras.map((e) => (
          <li key={e} className="flex gap-1.5">
            <span aria-hidden="true">·</span>
            {e}
          </li>
        ))}
        {p.aviso && <li className="font-semibold text-slate-800">{p.aviso}</li>}
      </ul>
    </div>
  );
}

function ObjetivosMCG({ opcion }: { opcion?: string }) {
  const [sel, setSel] = useState(
    OBJETIVOS_MCG.find((p) => p.id === opcion)?.id ?? OBJETIVOS_MCG[0].id,
  );
  const i = OBJETIVOS_MCG.findIndex((p) => p.id === sel);
  return (
    <div>
      <div className="no-imprimir mb-3 lg:hidden">
        <Segmented
          label="Población"
          wrap
          value={sel}
          onChange={setSel}
          options={OBJETIVOS_MCG.map((p) => ({ id: p.id, label: p.nombre }))}
        />
      </div>
      <div className="lg:hidden">
        <Escalera i={i} />
      </div>
      <div className="hidden gap-x-6 gap-y-5 lg:grid lg:grid-cols-2">
        {OBJETIVOS_MCG.map((_, k) => (
          <Escalera key={k} i={k} />
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Cada franja con el objetivo de tiempo que da el capítulo. «—»: el capítulo no fija objetivo
        para esa franja.
      </p>
    </div>
  );
}

/* ---------- 2. Escala de cetonemia ---------- */
function EscalaCetonemia() {
  const { tramos, marcas, tope } = ESCALA_CETONEMIA;
  const pct = (v: number) => `${(v / tope) * 100}%`;
  const marcasUnicas = [...new Set(marcas.map((m) => m.valor))];
  return (
    <div>
      <div className="relative pb-6 pt-7">
        {/* Marcas sobre la barra */}
        {marcasUnicas.map((v, k) => (
          <span
            key={v}
            className="absolute top-0 -translate-x-1/2 rounded-full bg-slate-800 px-1.5 text-[11px] font-bold text-white"
            style={{ left: pct(v) }}
            aria-hidden="true"
          >
            {k + 1}
          </span>
        ))}
        <div
          className="flex h-10 overflow-hidden rounded-lg"
          aria-label="Escala de β-OHB de 0 a 4 mmol/l: cada tramo abre su rama de la Figura 3"
          role="group"
        >
          {tramos.map((t) => (
            <a
              key={t.clave}
              href={href("consultar", "figura-3", t.clave)}
              className="block h-full transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ width: pct(t.hasta - t.desde), background: TRAMO_HEX[t.clave].ink }}
              aria-label={`Tramo ${t.etiqueta}: ver la rama en la Figura 3`}
            />
          ))}
        </div>
        {marcasUnicas.map((v) => (
          <span
            key={v}
            aria-hidden="true"
            className="absolute top-6 h-12 w-0.5 bg-slate-800"
            style={{ left: pct(v) }}
          />
        ))}
        {/* Ticks */}
        {[0, 0.6, 1.0, 3.0].map((v) => (
          <span
            key={v}
            className="absolute bottom-0 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-slate-600"
            style={{ left: v === 0 ? "6px" : pct(v) }}
          >
            {v === 0 ? "0" : v.toFixed(1).replace(".", ",")}
          </span>
        ))}
        <span className="absolute bottom-0 right-0 text-[11px] text-slate-500">mmol/l</span>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {tramos.map((t) => (
          <li key={t.clave}>
            <a
              href={href("consultar", "figura-3", t.clave)}
              className="block h-full rounded-xl border p-2.5 transition hover:brightness-95"
              style={{
                borderColor: TRAMO_HEX[t.clave].border,
                background: TRAMO_HEX[t.clave].soft,
              }}
            >
              <span className="block text-sm font-bold" style={{ color: TRAMO_HEX[t.clave].ink }}>
                {t.etiqueta}
              </span>
              <span className="mt-0.5 block text-xs text-slate-700">{t.accion}</span>
              <span className="pagina-badge mt-1 block">p. {t.p} · ver la rama →</span>
            </a>
          </li>
        ))}
      </ul>
      <ol className="mt-3 space-y-1 text-xs text-slate-700">
        {marcas.map((m, k) => (
          <li key={k} className="flex gap-2">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
              {marcasUnicas.indexOf(m.valor) + 1}
            </span>
            <span>
              {m.texto} <span className="pagina-badge">p. {m.p}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-slate-500">
        {FIGURA3.notaAsterisco} <span className="pagina-badge">Figura 3, p. 8</span>
      </p>
    </div>
  );
}

/* ---------- 3. Glucemia y ejercicio ---------- */
function Ejercicio() {
  const { min, max } = EJERCICIO.escala;
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div>
      <div className="relative pb-6 pt-1">
        <div
          className="relative h-10 overflow-hidden rounded-lg"
          style={{ background: "#e2e8f0" }}
          role="img"
          aria-label="Escala de glucemia de 40 a 320 mg/dl con las zonas para el ejercicio"
        >
          {EJERCICIO.zonas.map((z) => (
            <span
              key={z.etiqueta}
              className="absolute top-0 flex h-full items-center justify-center text-[11px] font-bold"
              style={{
                left: pct(z.desde),
                width: `calc(${pct(z.hasta)} - ${pct(z.desde)})`,
                background: TONO[z.tono].bg,
                color: TONO[z.tono].fg,
              }}
            >
              <span className="hidden sm:inline">{z.etiqueta}</span>
            </span>
          ))}
          <span
            aria-hidden="true"
            className="absolute top-0 h-full border-l-2 border-dashed border-slate-900"
            style={{ left: pct(EJERCICIO.marca.valor) }}
          />
        </div>
        {[90, 126, 180, 270].map((v) => (
          <span
            key={v}
            className="absolute bottom-0 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-slate-600"
            style={{ left: pct(v) }}
          >
            {v}
          </span>
        ))}
        <span className="absolute bottom-0 right-0 text-[11px] text-slate-500">mg/dl</span>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-3">
        {EJERCICIO.zonas.map((z) => (
          <li
            key={z.etiqueta}
            className="flex gap-2 rounded-xl border p-2.5 text-xs text-slate-700"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span
              aria-hidden="true"
              className="mt-0.5 h-3 w-3 shrink-0 rounded-sm"
              style={{ background: TONO[z.tono].bg }}
            />
            <span>
              <span className="block font-bold text-slate-900">{z.etiqueta}</span>
              {z.texto}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex gap-2 text-xs text-slate-700">
        <span
          aria-hidden="true"
          className="mt-1 h-3 w-0 shrink-0 border-l-2 border-dashed border-slate-900"
        />
        {EJERCICIO.marca.texto}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {EJERCICIO.fases.map((f) => (
          <div key={f.titulo} className="rounded-xl p-3" style={{ background: "#f1f5f9" }}>
            <Sub className="mb-1.5 text-sm font-extrabold text-slate-900">{f.titulo}</Sub>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {f.items.map((it) => (
                <li key={it} className="flex gap-1.5">
                  <span aria-hidden="true">·</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 4. Calendario de seguimiento ---------- */
function Seguimiento() {
  return (
    <div>
      <ol
        className="relative space-y-3 border-l-2 pl-5 lg:grid lg:grid-cols-6 lg:gap-3 lg:space-y-0 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-5"
        style={{ borderColor: "#c7d2fe" }}
      >
        {SEGUIMIENTO.hitos.map((h, i) => (
          <li key={h.cuando} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white lg:-top-[29px] lg:left-0"
              style={{ background: i < 4 ? "#4340a6" : "#0f766e" }}
            />
            <div className="text-sm font-extrabold text-slate-900">{h.cuando}</div>
            <div className="text-xs font-semibold" style={{ color: i < 4 ? "#343093" : "#0b5540" }}>
              {h.tipo}
            </div>
            <p className="mt-1 text-xs leading-snug text-slate-700">{h.que}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-600">{SEGUIMIENTO.nota}</p>
    </div>
  );
}

/* ---------- 5. Los cuatro algoritmos ---------- */
function Algoritmos() {
  const fila = (etiqueta: string, c: number) =>
    TABLAS.T1.filas.find((f) => f.etiqueta === etiqueta)?.celdas[c] ?? "";
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ORDEN_SISTEMAS.map((id, c) => {
          const h = SISTEMA_HEX[c];
          const a = ALGORITMOS[c];
          return (
            <article
              key={id}
              className="rounded-xl border p-3"
              style={{ borderColor: `${h.strong}40`, background: h.soft }}
            >
              <div className="mb-2 flex items-center gap-2">
                <img
                  src={FOTO_SISTEMA[id]}
                  alt=""
                  className="h-10 w-10 rounded-lg bg-white object-cover"
                />
                <div className="min-w-0">
                  <div className="text-sm font-extrabold" style={{ color: h.ink }}>
                    {TABLAS.T1.columnas[c]}
                  </div>
                  <div className="text-[11px] text-slate-600">{algoritmoDelCapitulo(c)}</div>
                </div>
              </div>
              <dl className="space-y-1.5 text-xs">
                <div>
                  <dt className="font-bold text-slate-600">Dónde se aloja</dt>
                  <dd className="text-slate-900">
                    <Lineas>{fila("Localización del algoritmo", c)}</Lineas>
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-600">Cada cuánto actúa</dt>
                  <dd className="text-slate-900">{a.cadencia}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-600">Autocorrecciones</dt>
                  <dd className="text-slate-900">{a.autocorreccion}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-600">Aprendizaje</dt>
                  <dd className="text-slate-900">{a.aprendizaje}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
      <div className="mt-4">
        <Sub className="mb-2 text-sm font-bold text-slate-900">Horizonte de predicción</Sub>
        <div className="space-y-2">
          {ORDEN_SISTEMAS.map((id, c) => {
            const a = ALGORITMOS[c];
            const h = SISTEMA_HEX[c];
            const pct = (v: number) => `${(v / 4) * 100}%`;
            return (
              <div key={id} className="grid grid-cols-[6.5rem_1fr] items-center gap-2 text-xs">
                <span className="font-semibold text-slate-800">
                  {TABLAS.T1.columnas[c].replace("Tandem ", "").replace("myLoop ", "")}
                </span>
                <div className="relative h-6 rounded-md" style={{ background: "#f1f5f9" }}>
                  {a.prediccionH ? (
                    <span
                      className="absolute top-0 flex h-full items-center rounded-md px-1.5 text-[11px] font-bold text-white"
                      style={{
                        left: 0,
                        width: pct(a.prediccionH[1]),
                        minWidth: "3.5rem",
                        background: h.ink,
                      }}
                    >
                      {a.prediccion
                        .replace("predicción a largo plazo de ", "")
                        .replace("predicción a ", "")}
                    </span>
                  ) : (
                    <span className="absolute inset-0 flex items-center px-2 text-[11px] italic text-slate-600">
                      {a.prediccion}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[6.5rem_1fr] text-[11px] text-slate-500">
            <span />
            <span className="flex justify-between tabular-nums">
              <span>0</span>
              <span>1 h</span>
              <span>2 h</span>
              <span>3 h</span>
              <span>4 h</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 6. Hipoglucemia en asa cerrada ---------- */
function Hipoglucemia() {
  return (
    <div>
      <p className="text-sm text-slate-700">{HIPOGLUCEMIA.porque}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {HIPOGLUCEMIA.ramas.map((r) => (
          <div
            key={r.cantidad}
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "#e6e6e6" }}
          >
            <div
              className="px-3 py-2 text-xs font-bold"
              style={{ background: TONO[r.tono].bg, color: TONO[r.tono].fg }}
            >
              {r.condicion}
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-3">
              <ArrowRight size={16} className="text-slate-500" aria-hidden="true" />
              <span className="text-2xl font-black tabular-nums text-slate-900">{r.cantidad}</span>
              <span className="text-xs text-slate-600">de hidratos</span>
            </div>
          </div>
        ))}
      </div>
      <div className="my-2 flex justify-center text-slate-400" aria-hidden="true">
        <ArrowDown size={18} />
      </div>
      <ul
        className="space-y-1.5 rounded-xl p-3 text-sm text-slate-800"
        style={{ background: "#f1f5f9" }}
      >
        {HIPOGLUCEMIA.despues.map((d) => (
          <li key={d} className="flex gap-2">
            <span aria-hidden="true">·</span>
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">{HIPOGLUCEMIA.aviso}</p>
    </div>
  );
}

/* ---------- 7. Transición desde MDI ---------- */
function Transicion() {
  return (
    <div>
      <ol className="space-y-2">
        {TRANSICION.pasos.map((p, i) => (
          <li key={p.titulo} className="flex gap-3">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "#4340a6" }}
            >
              {i + 1}
            </span>
            <div
              className="min-w-0 flex-1 rounded-xl border p-2.5"
              style={{ borderColor: "#e6e6e6" }}
            >
              <div className="text-sm font-bold text-slate-900">{p.titulo}</div>
              <p className="text-xs text-slate-700">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-600">{TRANSICION.nota}</p>
      <a
        href={href("consultar", "tablas", "T2")}
        className="no-imprimir mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-700 hover:underline sm:min-h-8"
      >
        Tabla 2 completa <ArrowRight size={12} aria-hidden="true" />
      </a>
    </div>
  );
}

/* ---------- 8. Gestación, sistema a sistema ---------- */
function TarjetaGestacion({ c }: { c: number }) {
  const h = SISTEMA_HEX[c];
  const id = ORDEN_SISTEMAS[c];
  const autorizacion = TABLAS.T1.filas.find((f) => f.etiqueta.startsWith("Gestación"));
  return (
    <article
      className="flex h-full flex-col rounded-xl border p-3"
      style={{ borderColor: `${h.strong}40`, background: h.soft }}
    >
      <div className="mb-2 flex items-center gap-2">
        <img src={FOTO_SISTEMA[id]} alt="" className="h-10 w-10 rounded-lg bg-white object-cover" />
        <div className="text-sm font-extrabold" style={{ color: h.ink }}>
          {TABLAS.T1.columnas[c]}
        </div>
      </div>
      {autorizacion && (
        <div className="mb-2 rounded-lg bg-white px-2.5 py-2 text-xs">
          <div className="font-bold text-slate-600">Tabla 1 · {autorizacion.etiqueta}</div>
          <div className="mt-0.5 font-semibold text-slate-900">
            <Lineas>{autorizacion.celdas[c]}</Lineas>
          </div>
        </div>
      )}
      <dl className="space-y-2 text-xs">
        {GESTACION_SISTEMAS[c].map((x) => (
          <div key={x.tema}>
            <dt className="flex items-center justify-between gap-2 font-bold text-slate-600">
              {x.tema}
              {x.texto !== "—" && <PaginaBadge p={x.p} />}
            </dt>
            <dd className="mt-0.5 leading-snug text-slate-900">{x.texto}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function GestacionSistemas({ opcion }: { opcion?: string }) {
  const [sel, setSel] = useState<string>(
    ORDEN_SISTEMAS.find((x) => x === opcion) ?? ORDEN_SISTEMAS[0],
  );
  const c = ORDEN_SISTEMAS.indexOf(sel as (typeof ORDEN_SISTEMAS)[number]);
  return (
    <div>
      <div className="no-imprimir mb-3 lg:hidden">
        <Segmented
          label="Sistema"
          wrap
          value={sel}
          onChange={setSel}
          options={ORDEN_SISTEMAS.map((id, k) => ({
            id,
            label: TABLAS.T1.columnas[k].replace("Tandem ", "").replace("myLoop ", ""),
          }))}
        />
      </div>
      <div className="lg:hidden">
        <TarjetaGestacion c={c} />
      </div>
      <div className="hidden gap-3 lg:grid lg:grid-cols-2">
        {ORDEN_SISTEMAS.map((id, k) => (
          <TarjetaGestacion key={id} c={k} />
        ))}
      </div>
      <Sub className="mb-1.5 mt-4 text-sm font-bold text-slate-900">En todos los sistemas</Sub>
      <ul className="space-y-1.5 text-xs text-slate-800">
        {GESTACION_COMUN.map((x) => (
          <li key={x.texto} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500"
            />
            <span className="min-w-0 flex-1">{x.texto}</span>
            <PaginaBadge p={x.p} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        «—»: el capítulo no lo da para ese sistema. Objetivos de MCG en la gestación: diagrama
        «Objetivos de MCG».
      </p>
    </div>
  );
}

/* ---------- 9. Hospital: cuándo no continuar el sistema ---------- */
function Hospital() {
  const H = HOSPITAL;
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: "#a7f3d0", background: "#ecfdf5" }}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <Sub className="text-sm font-bold" style={{ color: "#065f46" }}>
              Pueden mantenerse
            </Sub>
            <PaginaBadge p={H.mantener.p} />
          </div>
          <p className="text-sm text-slate-800">{H.mantener.texto}</p>
        </div>
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: "#fecaca", background: "#fef2f2" }}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <Sub className="text-sm font-bold" style={{ color: "#991b1b" }}>
              {H.noApropiada.intro}
            </Sub>
            <PaginaBadge p={H.noApropiada.p} />
          </div>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-slate-800">
            {H.noApropiada.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center" aria-hidden="true">
        <ArrowDown size={18} className="text-slate-400" />
      </div>
      <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white">
        {H.entonces.texto}
      </p>
      <ol className="grid gap-2 md:grid-cols-3">
        {H.pasos.map((x, k) => (
          <li
            key={x.cuando}
            className="rounded-xl border bg-white p-3"
            style={{ borderColor: "#e6e6e6" }}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px] text-white">
                  {k + 1}
                </span>
                {x.cuando}
              </span>
              <PaginaBadge p={x.p} p2={"p2" in x ? x.p2 : undefined} />
            </div>
            <p className="text-xs leading-snug text-slate-800">{x.texto}</p>
          </li>
        ))}
      </ol>
      <div className="grid gap-2 md:grid-cols-2">
        {[H.mientras, H.desdeIV].map((x) => (
          <p
            key={x.texto}
            className="rounded-xl p-3 text-xs leading-snug text-slate-800"
            style={{ background: "#f1f5f9" }}
          >
            {x.texto} <PaginaBadge p={x.p} />
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------- 10. Exploraciones: la Tabla 6 como mapa ---------- */
const ESTADO_EXPLORACION: Record<
  EstadoExploracion,
  { etiqueta: string; bg: string; borde: string; punto: string }
> = {
  retirar: { etiqueta: "Retirar o suspender", bg: "#fef2f2", borde: "#fecaca", punto: "#dc2626" },
  depende: {
    etiqueta: "Depende del dispositivo, del modelo o del contexto",
    bg: "#fffbeb",
    borde: "#fde68a",
    punto: "#ca8a04",
  },
  mantener: { etiqueta: "Mantener", bg: "#ecfdf5", borde: "#a7f3d0", punto: "#15803d" },
};

function Exploraciones() {
  const T6 = TABLAS.T6;
  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-2 text-xs" aria-label="Leyenda">
        {(Object.keys(ESTADO_EXPLORACION) as EstadoExploracion[]).map((k) => (
          <li
            key={k}
            className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2 py-0.5"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: ESTADO_EXPLORACION[k].punto }}
            />
            {ESTADO_EXPLORACION[k].etiqueta}
          </li>
        ))}
      </ul>
      <div className="hidden grid-cols-[12rem_1fr_1fr] gap-2 pb-1 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
        <span>{T6.cabeceraEtiqueta}</span>
        <span>{T6.columnas[0]}</span>
        <span>{T6.columnas[1]}</span>
      </div>
      <ol className="space-y-2">
        {T6.filas.map((f, i) => (
          <li
            key={f.etiqueta}
            className="grid gap-1.5 rounded-xl border bg-white p-2 md:grid-cols-[12rem_1fr_1fr] md:gap-2"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span className="text-sm font-bold text-slate-900">
              <Lineas>{f.etiqueta}</Lineas>
            </span>
            {f.celdas.map((celda, j) => {
              const e = ESTADO_EXPLORACION[EXPLORACIONES_ESTADO[i][j]];
              return (
                <span
                  key={j}
                  className="flex gap-2 rounded-lg border px-2 py-1.5 text-xs leading-snug text-slate-800"
                  style={{ background: e.bg, borderColor: e.borde }}
                >
                  <span className="sr-only">
                    {T6.columnas[j]}: {e.etiqueta}.{" "}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: e.punto }}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      aria-hidden="true"
                      className="block text-[11px] font-bold uppercase tracking-wide text-slate-600 md:hidden"
                    >
                      {T6.columnas[j]}
                    </span>
                    <Lineas>{celda}</Lineas>
                  </span>
                </span>
              );
            })}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-600">{T6.notas[0]}</p>
      <p className="mt-1 text-xs text-slate-500">
        El color resume cada celda; manda el texto de la Tabla 6 (apartado 10, p. 22).
      </p>
    </div>
  );
}

/* ---------- 11. Elección compartida (la Figura 2 como diagrama) ---------- */
function CajaEleccion({ i, tono = "azul" }: { i: number; tono?: "azul" | "centro" }) {
  const caja = F2.cajas[i];
  return (
    <div
      className={`h-full rounded-xl border p-3 ${tono === "centro" ? "border-indigo-200 bg-indigo-50" : "border-sky-200 bg-sky-50"}`}
    >
      <Sub
        className="mb-1.5 text-sm font-extrabold"
        style={{ color: tono === "centro" ? "#3730a3" : "#1e3a8a" }}
      >
        {caja.titulo}
      </Sub>
      <ul className="space-y-1 text-xs leading-snug text-slate-800">
        {caja.items.map((x) => (
          <li key={x}>
            <Texto>{x}</Texto>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Eleccion() {
  return (
    <div className="space-y-3">
      <div className="grid items-stretch gap-2 lg:grid-cols-[1fr_auto_0.8fr_auto_1fr]">
        <CajaEleccion i={0} />
        <div className="flex items-center justify-center" aria-hidden="true">
          <ArrowRight size={18} className="hidden text-slate-400 lg:block" />
          <ArrowDown size={18} className="text-slate-400 lg:hidden" />
        </div>
        <CajaEleccion i={1} tono="centro" />
        <div className="flex items-center justify-center" aria-hidden="true">
          <ArrowRight size={18} className="hidden rotate-180 text-slate-400 lg:block" />
          <ArrowDown size={18} className="rotate-180 text-slate-400 lg:hidden" />
        </div>
        <CajaEleccion i={2} />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <CajaEleccion i={3} />
        <CajaEleccion i={4} />
      </div>
      <div
        className="rounded-xl border p-3"
        style={{ borderColor: "#fde68a", background: "#fffbeb" }}
      >
        <p className="text-sm font-semibold text-amber-900">{F2.cajas[5].titulo}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
          {F2.cajas[5].items.map((x) => (
            <li key={x} className="rounded-full bg-white px-2 py-0.5 text-slate-800">
              {x}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-slate-500">
        Dibujo hecho con el texto de la Figura 2 (p. 6), caja a caja. La imagen original está en el
        apartado 6.
      </p>
    </div>
  );
}

/* ---------- 12. Interrupción del sistema según su duración ---------- */
const TONO_INTERRUPCION = ["#15803d", "#a16207", "#c2410c", "#b91c1c"];

function InterrupcionLinea() {
  const L = INTERRUPCION_LINEA;
  return (
    <div className="space-y-3">
      <ol className="grid gap-2 md:grid-cols-4">
        {L.tramos.map((t, k) => (
          <li
            key={t.cuando}
            className="flex flex-col overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: "#e6e6e6" }}
          >
            <span
              className="px-3 py-1.5 text-xs font-bold text-white"
              style={{ background: TONO_INTERRUPCION[k] }}
            >
              {t.cuando}
            </span>
            <span className="px-3 py-2 text-xs leading-snug text-slate-800">{t.texto}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-2 md:grid-cols-2">
        <p
          className="rounded-xl p-3 text-xs leading-snug text-slate-800"
          style={{ background: "#f1f5f9" }}
        >
          <span className="block font-bold text-slate-900">Pod</span>
          {L.formatos.pod}
        </p>
        <p
          className="rounded-xl p-3 text-xs leading-snug text-slate-800"
          style={{ background: "#f1f5f9" }}
        >
          <span className="block font-bold text-slate-900">Bomba con catéter</span>
          {L.formatos.bomba}
        </p>
      </div>
      <ul className="space-y-1 text-xs text-slate-800">
        {L.detalles.map((d) => (
          <li key={d.cuando} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500"
            />
            <span>
              <span className="font-bold text-slate-900">{d.cuando}: </span>
              {d.texto}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-600">{L.nota}</p>
    </div>
  );
}

const CUERPO: Record<DiagramaId, (props: { opcion?: string }) => JSX.Element> = {
  "objetivos-mcg": ObjetivosMCG,
  cetonemia: EscalaCetonemia,
  ejercicio: Ejercicio,
  seguimiento: Seguimiento,
  algoritmos: Algoritmos,
  hipoglucemia: Hipoglucemia,
  transicion: Transicion,
  "gestacion-sistemas": GestacionSistemas,
  hospital: Hospital,
  exploraciones: Exploraciones,
  eleccion: Eleccion,
  interrupcion: InterrupcionLinea,
};

export function DiagramaVista({
  id,
  enApartado = false,
  opcion,
}: {
  id: DiagramaId;
  enApartado?: boolean;
  /* Pestaña inicial (población, sistema) cuando el diagrama tiene varias. */
  opcion?: string;
}) {
  const Cuerpo = CUERPO[id];
  return (
    <MarcoDiagrama id={id} enApartado={enApartado}>
      <Cuerpo opcion={opcion} />
    </MarcoDiagrama>
  );
}
