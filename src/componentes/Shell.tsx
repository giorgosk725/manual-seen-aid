/* Shell: barra superior (con la búsqueda en escritorio), menú en tres grupos (barra lateral de
   escritorio y menú del móvil), barra inferior móvil (Inicio · Leer · Paciente · Buscar),
   paleta de búsqueda (Ctrl K) y aviso de versión nueva. El destino activo sale de nav.ts. */
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AArrowDown,
  AArrowUp,
  ChevronDown,
  ChevronLeft,
  Cpu,
  LifeBuoy,
  Home,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { APARTADOS, CAPITULO } from "../contenido";
import { contextoDeRuta } from "../contexto";
import { DESTINOS, MENU, areaDe, destinoActivo } from "../nav";
import {
  consumirNavegacionNueva,
  href,
  marcarNavegacionNueva,
  parseHash,
  type Ruta,
} from "../rutas";
import { TAMANOS, guardarVisita, useNocturno, useTamanoLetra } from "../prefs";
import { precargarBuscador } from "../useBuscador";
import { VolverArriba } from "./Lectura";
import { ErrorBoundary, Modal } from "../ui";
import { fueraDelCapitulo, marcar, paginaDe } from "../busqueda";
import { useBuscador } from "../useBuscador";
import { useParecidos } from "../semantica";
import { AvisosBusqueda } from "./AvisosBusqueda";
import { RespuestasCapitulo } from "./RespuestasCapitulo";
import { RecursosPedidos } from "./RecursosPedidos";
import { Autocompletar } from "./Autocompletar";
import { guardarReciente } from "../prefs";
import { SugerenciasBusqueda } from "./SugerenciasBusqueda";
import { SinResultados } from "./SinResultados";
import { CATEGORIA_HEX, SEEN } from "../tokens";
import { irABuscar, ponerConsulta } from "../consultaBuscar";
import { VERSION_APP } from "../version";

/* ---------- Espera mientras llega una pantalla perezosa ---------- */
function CargandoPantalla() {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVer(true), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div role="status" aria-live="polite" data-cargando="" className="min-h-[60vh] py-10">
      {ver && <p className="text-sm text-slate-500">Cargando…</p>}
    </div>
  );
}

/* ---------- Paleta de búsqueda (Ctrl K) ---------- */
function Paleta({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { motor, estado, reintentar } = useBuscador(open);
  const qEf = (motor && motor.consultaEfectiva(q)) || q;
  const parecidos = useParecidos(qEf, open);
  const busqueda = motor && qEf.trim().length >= 2 ? motor.buscarConTotales(qEf, 12) : null;
  const res = busqueda?.resultados ?? [];
  const respuestas = motor && qEf.trim().length >= 2 ? motor.fusionar(qEf, parecidos) : [];
  const frecuente = motor && qEf.trim().length >= 2 ? motor.preguntaFrecuente(qEf) : null;
  const sugerencias = motor && q.trim().length >= 3 && !frecuente ? motor.sugerir(q) : [];
  if (motor && (respuestas.length || frecuente)) motor.recordarTema(qEf);
  // Abrir un resultado deja la búsqueda en «recientes».
  const cerrarYGuardar = () => {
    guardarReciente(q);
    onClose();
  };
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);
  // Teclado: Intro abre Buscar con todos los resultados (nunca salta a escondidas al primer
  // pasaje, que puede ser una coincidencia parcial); ↓ y ↑ recorren los enlaces y, con uno
  // elegido, Intro lo abre; ↑ desde el primero vuelve a la caja.
  const zona = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const enlaces = () => [...(zona.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? [])];
  const alTeclear = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      enlaces()[0]?.focus();
    } else if (e.key === "Enter" && q.trim().length >= 2) {
      e.preventDefault();
      cerrarYGuardar();
      irABuscar(q);
    }
  };
  const alMoverse = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const lista = enlaces();
    const i = lista.indexOf(document.activeElement as HTMLAnchorElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === "ArrowDown") lista[Math.min(lista.length - 1, i + 1)]?.focus();
    else if (i === 0) entrada.current?.focus();
    else lista[i - 1]?.focus();
  };
  return (
    <Modal open={open} onClose={onClose} ariaLabel="Paleta de búsqueda" maxW="max-w-xl">
      <div className="p-3">
        <label className="sr-only" htmlFor="paleta-q">
          Buscar en el capítulo
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
          <Search size={16} className="text-slate-500" aria-hidden="true" />
          <input
            id="paleta-q"
            ref={entrada}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={alTeclear}
            aria-describedby="paleta-ayuda"
            aria-label="Buscar en el capítulo"
            placeholder="Términos del capítulo: cetonas, modo sueño en Control-IQ…"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
          />
          <kbd className="hidden rounded border border-slate-200 px-1.5 text-[11px] text-slate-500 sm:inline">
            Esc
          </kbd>
        </div>
        <p id="paleta-ayuda" className="mt-1 hidden text-xs text-slate-600 sm:block">
          Intro abre todos los resultados · ↓ ↑ eligen uno · Esc cierra
        </p>
        <div ref={zona} onKeyDown={alMoverse}>
          {q.trim().length < 2 && <SugerenciasBusqueda onElegir={setQ} />}
          <Autocompletar items={sugerencias} onElegir={setQ} onIr={cerrarYGuardar} />
          {qEf !== q && (
            <p className="mt-1 text-xs text-slate-600" role="status">
              Buscado junto con la consulta anterior: «{qEf}».
            </p>
          )}
          {motor && qEf.trim().length >= 2 && (
            <RecursosPedidos items={motor.recursosPedidos(qEf, res)} onIr={cerrarYGuardar} />
          )}
          {q.trim().length >= 2 && (
            <AvisosBusqueda q={qEf} parcial={busqueda?.parcial} primera={respuestas[0]}>
              <RespuestasCapitulo
                respuestas={respuestas}
                q={qEf}
                compacta
                onIr={cerrarYGuardar}
                frecuente={frecuente}
                porId={motor?.respuestaPorId}
              />
            </AvisosBusqueda>
          )}
          {q.trim().length >= 2 && (
            <ul
              className="mt-2 max-h-[60vh] divide-y overflow-y-auto"
              style={{ borderColor: "#e6e6e6" }}
              aria-label="Resultados"
            >
              {estado === "cargando" && (
                <li className="px-2 py-3 text-sm text-slate-600">Cargando el índice…</li>
              )}
              {estado === "error" && (
                <li className="flex flex-wrap items-center gap-2 px-2 py-3 text-sm text-slate-700">
                  No se pudo cargar el índice de búsqueda.
                  <button
                    type="button"
                    onClick={reintentar}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold hover:border-slate-500"
                  >
                    Reintentar
                  </button>
                </li>
              )}
              {estado === "listo" && res.length === 0 && !respuestas.length && !frecuente && (
                <li className="px-2 pb-2">
                  <SinResultados onIr={onClose} q={q} cercanas={motor?.faqsCercanas(parecidos)} />
                </li>
              )}
              {res.map((r) => (
                <li key={r.entrada.id}>
                  <a
                    href={r.entrada.ruta}
                    onClick={cerrarYGuardar}
                    className="block rounded-lg px-2 py-2 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="truncate font-semibold">{r.entrada.titulo}</span>
                      {fueraDelCapitulo(r.entrada) ? (
                        <span className="shrink-0 rounded-full bg-amber-100 px-1.5 text-[11px] font-semibold text-amber-900">
                          Fuera del capítulo
                        </span>
                      ) : (
                        <span className="pagina-badge">{paginaDe(r.entrada)}</span>
                      )}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-800">
                      {marcar(r.fragmento, q).map((t, i) =>
                        t.hit ? (
                          <mark key={i} className="resaltado">
                            {t.t}
                          </mark>
                        ) : (
                          <span key={i}>{t.t}</span>
                        ),
                      )}
                    </div>
                  </a>
                </li>
              ))}
              {res.length > 0 && (
                <li>
                  <a
                    href={href("buscar")}
                    onClick={() => {
                      ponerConsulta(q.trim());
                      cerrarYGuardar();
                    }}
                    className="block px-2 py-2 text-sm font-semibold text-slate-700 hover:underline"
                  >
                    Ver todos los resultados de «{q}»
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Aviso de versión nueva (service worker) ---------- */
function AvisoVersion() {
  const [update, setUpdate] = useState<null | (() => void)>(
    () => (window as unknown as { __mseenActualizar?: () => void }).__mseenActualizar ?? null,
  );
  // Tras actualizar: qué versión ha quedado (V54-13).
  const [desde, setDesde] = useState<string | null>(
    () => (window as unknown as { __mseenActualizado?: string }).__mseenActualizado ?? null,
  );
  useEffect(() => {
    const on = (e: Event) =>
      setUpdate(() => (e as CustomEvent<{ update: () => void }>).detail.update);
    const hecho = (e: Event) => setDesde((e as CustomEvent<{ desde: string }>).detail.desde);
    window.addEventListener("mseen:sw-need-refresh", on);
    window.addEventListener("mseen:sw-actualizado", hecho);
    return () => {
      window.removeEventListener("mseen:sw-need-refresh", on);
      window.removeEventListener("mseen:sw-actualizado", hecho);
    };
  }, []);
  // 14-10-2026: el aviso de «Actualizado» se va solo a los 8 s (tapaba el contenido).
  useEffect(() => {
    if (update || !desde || desde === VERSION_APP) return;
    const t = window.setTimeout(() => {
      setDesde(null);
      delete (window as unknown as { __mseenActualizado?: string }).__mseenActualizado;
    }, 8000);
    return () => window.clearTimeout(t);
  }, [update, desde]);
  if (!update && desde)
    return (
      <div
        role="status"
        className="aviso-version fixed inset-x-3 bottom-32 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-slate-300 bg-white p-3 shadow-xl md:bottom-4"
      >
        <p className="flex-1 text-sm text-slate-800">
          {desde === VERSION_APP
            ? `Versión ${VERSION_APP}. Comprobando si hay una más reciente…`
            : `Actualizado: ahora usas la versión ${VERSION_APP} (antes, la ${desde}).`}
        </p>
        <button
          type="button"
          onClick={() => {
            setDesde(null);
            delete (window as unknown as { __mseenActualizado?: string }).__mseenActualizado;
          }}
          className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700"
        >
          Cerrar
        </button>
      </div>
    );
  if (!update) return null;
  return (
    <div
      role="status"
      className="aviso-version fixed inset-x-3 bottom-32 z-40 mx-auto max-w-md rounded-xl border border-slate-300 bg-white p-3 shadow-xl md:bottom-4"
    >
      <p className="text-sm text-slate-800">
        Hay una versión nueva del complemento (ahora usas la {VERSION_APP}). Se carga al pulsar
        «Actualizar»; con «Más tarde» sigues con esta.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={update}
          className="min-h-11 rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Actualizar
        </button>
        <button
          type="button"
          onClick={() => setUpdate(null)}
          className="min-h-11 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

/* ---------- Rótulo: «Manual de Endocrinología y Nutrición» y, al lado, «Complemento
   interactivo» (decisión del autor, 13-10-2026). */
export function Rotulo({
  compacto = false,
  breve = false,
}: {
  compacto?: boolean;
  /* Sin «Complemento interactivo» (la cabecera de la lectura lleva el tamaño de letra). */
  breve?: boolean;
}) {
  const fuera = `max-[359px]:hidden ${breve ? "hidden" : ""}`;
  // En la barra lateral (escritorio), en dos líneas y con letra legible: «Manual de
  // Endocrinología y Nutrición» y, debajo, «Complemento interactivo». Sin desbordar su ancho
  // ni esconder texto (V54-08).
  if (!compacto)
    return (
      <span className="flex flex-col gap-1 leading-none" aria-hidden="true">
        <span className="flex items-center gap-1.5">
          <span
            className="font-display text-[1.35rem] font-semibold uppercase tracking-tight"
            style={{ color: SEEN.azulOsc }}
          >
            Manual
          </span>
          <span className="flex flex-col font-display text-[0.66rem] font-medium uppercase leading-[0.95]">
            <span style={{ color: SEEN.burdeos }}>de Endocrinología</span>
            <span style={{ color: SEEN.mostazaOsc }}>y Nutrición</span>
          </span>
        </span>
        <span className="font-display text-[0.72rem] font-medium uppercase tracking-wide text-slate-600">
          Complemento interactivo
        </span>
      </span>
    );
  // En la cabecera del móvil, en una fila (el alto es de 56 px).
  const pequeno = "whitespace-nowrap text-[0.52rem] min-[400px]:text-[0.6rem]";
  return (
    <span className="flex items-center gap-1.5 leading-none" aria-hidden="true">
      <span
        className="font-display text-[1.15rem] font-semibold uppercase tracking-tight min-[400px]:text-[1.35rem]"
        style={{ color: SEEN.azulOsc }}
      >
        Manual
      </span>
      <span className="flex flex-col font-display font-medium uppercase leading-[0.95]">
        <span className={pequeno} style={{ color: SEEN.burdeos }}>
          de Endocrinología
        </span>
        <span className={pequeno} style={{ color: SEEN.mostazaOsc }}>
          y Nutrición
        </span>
      </span>
      <span
        className={`mx-0.5 self-stretch border-l ${fuera}`}
        style={{ borderColor: "#d4d4d4" }}
      />
      <span
        className={`flex flex-col font-display font-medium uppercase leading-[0.95] text-slate-600 ${fuera}`}
      >
        <span className={pequeno}>Complemento</span>
        <span className={pequeno}>interactivo</span>
      </span>
    </span>
  );
}

/* ---------- Menú: Inicio y tres grupos (barra lateral y menú del móvil) ----------
   «Más recursos» va plegado salvo cuando se está en uno de ellos; el índice de los apartados
   solo se despliega dentro de la lectura. */
function MenuNavegacion({
  ruta,
  etiqueta,
  onIr,
}: {
  ruta: Ruta;
  etiqueta: string;
  onIr?: () => void;
}) {
  // Dentro de un apartado (0.71.0): en el propio índice, la lista del lateral lo repetía.
  const enCapitulo = ruta.seccion === "capitulo" && !!ruta.sub;
  const area = areaDe(ruta.seccion);
  // El índice de los apartados se despliega dentro de la lectura; pulsar otra vez «Índice del
  // capítulo» estando ya en ella lo pliega (y vuelve a desplegarlo).
  const [indiceAbierto, setIndiceAbierto] = useState(true);
  const enlace = (
    on: boolean,
    color: string,
    contenido: ReactNode,
    destino: string,
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void,
  ) => (
    <a
      href={destino}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onIr?.();
      }}
      aria-current={on ? "page" : undefined}
      className={`relative flex min-h-11 items-center gap-2.5 rounded-md px-3 py-1.5 text-[13.5px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
    >
      {on && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-[3px] rounded-full"
          style={{ background: color }}
        />
      )}
      {contenido}
    </a>
  );
  const item = (id: string) => {
    const d = DESTINOS.find((x) => x.id === id)!;
    const I = d.icono;
    const cat = CATEGORIA_HEX[d.cat];
    return (
      <li key={id}>
        {enlace(
          destinoActivo(id, ruta),
          cat.strong,
          <>
            <I size={16} aria-hidden="true" style={{ color: cat.strong }} className="shrink-0" />
            {d.etiqueta}
            {id === "capitulo" && enCapitulo && (
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`ml-auto text-slate-500 transition ${indiceAbierto ? "rotate-180" : ""}`}
              />
            )}
          </>,
          d.href,
          id === "capitulo" && enCapitulo
            ? (e) => {
                e.preventDefault();
                setIndiceAbierto((v) => !v);
              }
            : undefined,
        )}
        {id === "capitulo" && enCapitulo && indiceAbierto && (
          <ol className="ml-4 mt-1 space-y-0.5 border-l pl-2" style={{ borderColor: "#e6e6e6" }}>
            {APARTADOS.map((a) => {
              const onA = ruta.sub === a.slug;
              return (
                <li key={a.slug}>
                  <a
                    href={href("capitulo", a.slug)}
                    onClick={onIr}
                    aria-current={onA ? "page" : undefined}
                    className={`flex gap-2 rounded-md px-2 py-1 text-[12.5px] uppercase leading-snug tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${onA ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    <span
                      className={`w-5 shrink-0 tabular-nums ${onA ? "text-slate-700" : "text-slate-500"}`}
                    >
                      {a.n}
                    </span>
                    <span className="flex-1">{a.corto}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        )}
      </li>
    );
  };
  const titulo = (t: string) => (
    <div className="etiqueta-area px-3 text-[11px] text-slate-500">{t}</div>
  );
  return (
    <nav aria-label={etiqueta}>
      <ul className="mt-3">
        <li>
          {enlace(
            ruta.seccion === "",
            SEEN.burdeos,
            <>
              <Home size={16} aria-hidden="true" className="shrink-0 text-slate-600" />
              Inicio
            </>,
            "#/",
          )}
        </li>
      </ul>
      {MENU.map((g) =>
        g.area === "mas" ? (
          <details key={g.area} className="group mt-4" open={area === "mas" || undefined}>
            <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between rounded-md pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 [&::-webkit-details-marker]:hidden">
              {titulo(g.titulo)}
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="text-slate-500 transition group-open:rotate-180"
              />
            </summary>
            <ul className="mt-1 space-y-0.5">{g.ids.map(item)}</ul>
          </details>
        ) : (
          <div key={g.area} className="mt-4">
            {titulo(g.titulo)}
            <ul className="mt-1 space-y-0.5">{g.ids.map(item)}</ul>
          </div>
        ),
      )}
    </nav>
  );
}

/* ---------- Barra lateral (escritorio) ---------- */
function Lateral({ ruta }: { ruta: Ruta }) {
  return (
    <aside
      aria-label="Menú del capítulo"
      className="barra-lateral fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto px-3 py-4 md:flex"
    >
      <a
        href="#/"
        aria-label="Manual de Endocrinología y Nutrición, complemento interactivo: inicio"
        className="rounded-md px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      >
        <Rotulo />
        {/* El rótulo ya dice «Complemento interactivo»: aquí, de qué capítulo (V54-08). */}
        <span className="mt-1.5 block text-xs font-semibold leading-snug text-slate-700">
          Capítulo {CAPITULO.numero} · {CAPITULO.tituloCorto}
        </span>
      </a>
      <BuscadorLateral />
      <MenuNavegacion ruta={ruta} etiqueta="Navegación principal" />
    </aside>
  );
}

/* La caja de búsqueda de la barra lateral: escribir y Intro abre Buscar con la consulta (el
   mismo motor que la paleta y la portada de antes). */
function BuscadorLateral() {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className="mb-3 mt-3 px-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) irABuscar(q);
      }}
    >
      <label htmlFor="lateral-q" className="sr-only">
        Buscar en el capítulo
      </label>
      <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 transition focus-within:border-slate-500">
        <Search size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
        <input
          id="lateral-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => void precargarBuscador()}
          placeholder="Buscar en el capítulo"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
        />
      </div>
    </form>
  );
}

/* ---------- Barra inferior (móvil): cinco botones (0.70.0) ----------
   Inicio · Sistemas · Situaciones · Buscar · Más («Más» abre el menú, el mismo del lateral). Sin
   hoja «Consultar» ni menú arriba: una sola forma de llegar a cada sitio. */
type Boton = "inicio" | "sistemas" | "situaciones" | "buscar" | "mas";
const BOTONES: { id: Boton; etiqueta: string; href?: string; icono: typeof Home }[] = [
  { id: "inicio", etiqueta: "Inicio", href: "#/", icono: Home },
  { id: "sistemas", etiqueta: "Sistemas", href: href("sistemas"), icono: Cpu },
  {
    id: "situaciones",
    etiqueta: "Situaciones",
    href: href("consultar", "situacion"),
    icono: LifeBuoy,
  },
  { id: "buscar", etiqueta: "Buscar", href: href("buscar"), icono: Search },
  { id: "mas", etiqueta: "Más", icono: Menu },
];
/* El botón que corresponde a la pantalla: las conductas (situaciones, cetonas, hipoglucemia,
   interrupción) van con «Situaciones»; lo que no está en la barra, con «Más». */
function botonDe(ruta: Ruta): Boton {
  if (ruta.seccion === "") return "inicio";
  if (ruta.seccion === "sistemas") return "sistemas";
  if (ruta.seccion === "buscar") return "buscar";
  if (
    (ruta.seccion === "consultar" &&
      ["situacion", "figura-3", "interrupcion"].includes(ruta.sub ?? "")) ||
    (ruta.seccion === "visual" && ruta.sub === "hipoglucemia")
  )
    return "situaciones";
  return "mas";
}

function Inferior({ ruta, onMas }: { ruta: Ruta; onMas: () => void }) {
  const actual = botonDe(ruta);
  const clase = (on: boolean) =>
    `flex min-h-14 w-full flex-col items-center justify-center gap-0.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-slate-900" : "text-slate-500"}`;
  return (
    <nav
      aria-label="Barra inferior"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-white md:hidden"
      style={{ borderColor: "#e6e6e6", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {BOTONES.map((it) => {
          const I = it.icono;
          const on = it.id === actual;
          return (
            <li key={it.id}>
              {it.href ? (
                <a
                  href={it.href}
                  aria-current={on ? "page" : undefined}
                  className={clase(on)}
                  style={on ? { color: SEEN.burdeos } : undefined}
                >
                  <I size={20} aria-hidden="true" />
                  {it.etiqueta}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onMas}
                  aria-haspopup="dialog"
                  aria-current={on ? "page" : undefined}
                  className={clase(on)}
                  style={on ? { color: SEEN.burdeos } : undefined}
                >
                  <I size={20} aria-hidden="true" />
                  {it.etiqueta}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- Menú del móvil (el mismo de la barra lateral) ---------- */
function Cajon({ open, onClose, ruta }: { open: boolean; onClose: () => void; ruta: Ruta }) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="Menú" maxW="max-w-md">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="px-3 text-sm font-bold text-slate-800">Menú</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar el menú"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <X size={18} />
          </button>
        </div>
        <MenuNavegacion ruta={ruta} etiqueta="Menú de navegación" onIr={onClose} />
      </div>
    </Modal>
  );
}

/* La ruta llega de App (una sola fuente): si la Shell tuviera su propia copia, durante un
   render la clave de la pantalla nueva iría con la pantalla vieja, que se volvía a montar y
   saltaba a su ancla (y guardaba ese punto como «seguir leyendo»). */
export function Shell({
  children,
  titulo,
  ruta,
}: {
  children: ReactNode;
  titulo?: string;
  ruta: Ruta;
}) {
  const [night, toggleNight] = useNocturno();
  const [letra, setLetra] = useTamanoLetra();
  const [paleta, setPaleta] = useState(false);
  const [cajon, setCajon] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const cerrarPaleta = useCallback(() => setPaleta(false), []);
  const cerrarCajon = useCallback(() => setCajon(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Con otro diálogo abierto (el índice) no se apila un segundo modal.
        setPaleta((p) => (!p && document.querySelector('[role="dialog"]') ? p : !p));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Un clic en un enlace interno es una navegación nueva (sube arriba); Atrás/Adelante no.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#/"]');
      if (a) marcarNavegacionNueva();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Posición de scroll por pantalla, para restaurarla al volver con Atrás. La restaura la app,
  // no el navegador: su restauración propia llega a destiempo (antes o después de pintar la
  // pantalla) y pisaba la posición guardada.
  const posiciones = useRef(new Map<string, number>());
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);
  useEffect(() => {
    let pendiente: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const r = parseHash(window.location.hash);
      const k = `${r.seccion}/${r.seccion === "buscar" ? "" : (r.sub ?? "")}`;
      const y = window.scrollY;
      clearTimeout(pendiente);
      // Se apunta un instante después: el desplazamiento que hace el navegador justo antes de
      // cambiar de hash (al pulsar un enlace o al volver atrás) no es del lector y se descarta.
      pendiente = setTimeout(() => posiciones.current.set(k, y), 80);
    };
    const onHash = () => clearTimeout(pendiente);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(pendiente);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // En Buscar, el texto escrito viaja en la URL: no es otra pantalla.
  const subPantalla = ruta.seccion === "buscar" ? "" : (ruta.sub ?? "");
  const clavePantalla = `${ruta.seccion}/${subPantalla}`;

  // Al cambiar de pantalla (no al elegir una opción dentro de ella): arriba del todo, salvo
  // enlace profundo (un bloque del capítulo, una referencia) o vuelta atrás (se restaura).
  // useLayoutEffect: corre antes que los efectos de los hijos, que hacen su propio scroll.
  // «Volver a la consulta»: al abrir el capítulo desde una herramienta (Sistemas, Situaciones,
  // Iniciar, Buscar, un caso…), un botón para volver justo donde se estaba (historial).
  const previa = useRef<{ seccion: string; titulo: string }>({ seccion: "", titulo: "" });
  const [volver, setVolver] = useState<string | null>(null);
  useLayoutEffect(() => {
    const nueva = consumirNavegacionNueva();
    const desdeHerramienta =
      nueva &&
      ruta.seccion === "capitulo" &&
      ["consultar", "sistemas", "buscar", "casos", "preguntas", "visual"].includes(
        previa.current.seccion,
      );
    setVolver(desdeHerramienta ? previa.current.titulo : null);
    previa.current = { seccion: ruta.seccion, titulo: titulo ?? "" };
    const destinoProfundo =
      (ruta.seccion === "capitulo" && !!ruta.detalle) ||
      (ruta.seccion === "sistemas" && !!ruta.detalle) ||
      (ruta.seccion === "bibliografia" && !!ruta.sub);
    const guardada = posiciones.current.get(clavePantalla);
    // Enlace profundo: la pantalla hace su propio scroll; al volver atrás, se restaura.
    if (destinoProfundo && (nueva || guardada == null)) return;
    // Al volver atrás, el navegador puede haber restaurado ya su propia posición: vale la mayor
    // de las dos (la guardada aquí o la del navegador), porque solo se pierde por recorte.
    const destino = !nueva && guardada != null ? Math.max(guardada, window.scrollY) : 0;
    window.scrollTo({ top: destino });
    // Al volver atrás, la pantalla perezosa puede no haber crecido aún: se reintenta un momento
    // después, solo si la posición no ha llegado (el lector no ha tocado nada).
    if (destino > 0) {
      const reintentar = () => {
        if (Math.abs(window.scrollY - destino) > 4) window.scrollTo({ top: destino });
      };
      const t1 = setTimeout(reintentar, 250);
      const t2 = setTimeout(reintentar, 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clavePantalla]);

  useEffect(() => {
    document.title = titulo
      ? `${titulo} · Automatización de la insulinoterapia`
      : "Automatización de la insulinoterapia · Complemento del capítulo 89";
    // «Lo último que consultaste» (portada): pantallas con título, salvo portada y búsqueda.
    if (titulo && !["", "buscar", "mas", "cambios", "sobre"].includes(ruta.seccion))
      guardarVisita({
        ruta: window.location.hash || "#/",
        titulo,
        detalle: contextoDeRuta(ruta),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titulo, ruta.seccion, ruta.sub, ruta.detalle]);

  const enLectura = ruta.seccion === "capitulo" && !!ruta.sub;
  const cat =
    ruta.seccion === "consultar"
      ? CATEGORIA_HEX.consultar
      : ["bibliografia", "cambios", "sobre"].includes(ruta.seccion)
        ? CATEGORIA_HEX.confiar
        : ruta.seccion === "test" || ruta.seccion === "repaso"
          ? CATEGORIA_HEX.aprender
          : ruta.seccion === "pacientes"
            ? CATEGORIA_HEX.pacientes
            : CATEGORIA_HEX.leer;

  const menor = TAMANOS[Math.max(0, TAMANOS.indexOf(letra) - 1)];
  const mayor = TAMANOS[Math.min(TAMANOS.length - 1, TAMANOS.indexOf(letra) + 1)];

  return (
    <div className="lienzo min-h-screen bg-slate-50 text-slate-900">
      {/* Con teclado, el primer Tab ofrece saltar la navegación (la portada pedía más de 14). */}
      <button
        type="button"
        onClick={() => mainRef.current?.focus()}
        className="sr-only z-50 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Saltar al contenido
      </button>
      <Lateral ruta={ruta} />
      <header
        className="cabecera sticky top-0 z-20 border-b backdrop-blur md:ml-64"
        style={{ borderColor: "#e6e6e6" }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3 sm:px-5">
          <a
            href="#/"
            aria-label="Manual de Endocrinología y Nutrición, complemento interactivo: inicio"
            className="inline-flex min-h-11 min-w-0 shrink-0 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 md:hidden"
          >
            <Rotulo compacto breve={enLectura} />
          </a>
          {/* Sin el título de la pantalla en la barra (repetía el H1, 0.70.0). */}
          <span className="flex-1" />
          {enLectura && (
            <div
              className="flex items-center max-[359px]:hidden"
              role="group"
              aria-label="Tamaño de letra"
            >
              <button
                type="button"
                onClick={() => setLetra(menor)}
                disabled={letra === menor}
                aria-label="Letra más pequeña"
                className="tap-44 rounded-lg p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <AArrowDown size={18} />
              </button>
              <button
                type="button"
                onClick={() => setLetra(mayor)}
                disabled={letra === mayor}
                aria-label="Letra más grande"
                className="tap-44 rounded-lg p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <AArrowUp size={18} />
              </button>
            </div>
          )}
          {/* Sin lupa en la cabecera del móvil (0.53.0): «Buscar» ya está en la barra de abajo. */}
          <button
            type="button"
            onClick={toggleNight}
            aria-pressed={night}
            aria-label={night ? "Modo diurno" : "Modo nocturno"}
            title={night ? "Modo diurno" : "Modo nocturno"}
            className="tap-44 rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            {night ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <main
        ref={mainRef}
        tabIndex={-1}
        className="focus:outline-none md:ml-64"
        style={{
          ["--cat" as string]: cat.strong,
          ["--cat-soft" as string]: cat.soft,
          ["--cat-ink" as string]: cat.ink,
        }}
      >
        <div
          key={clavePantalla}
          className="pantalla-in mx-auto max-w-5xl px-3 pb-24 pt-4 sm:px-5 md:pb-10"
        >
          {volver && ruta.seccion === "capitulo" && (
            <div className="no-imprimir mb-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border bg-white px-3 text-sm font-semibold text-slate-800 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-9"
                style={{ borderColor: "#d4d4d4" }}
              >
                <ChevronLeft size={15} aria-hidden="true" /> Volver a la consulta
                <span className="font-normal text-slate-600">· {volver}</span>
              </button>
            </div>
          )}
          {/* Un fallo en una pantalla deja en pie la barra lateral y la navegación. */}
          <ErrorBoundary>
            <Suspense fallback={<CargandoPantalla />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <Inferior ruta={ruta} onMas={() => setCajon(true)} />
      <Cajon open={cajon} onClose={cerrarCajon} ruta={ruta} />
      <Paleta open={paleta} onClose={cerrarPaleta} />
      <VolverArriba />
      <AvisoVersion />
    </div>
  );
}
