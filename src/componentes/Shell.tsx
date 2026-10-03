/* Shell: barra superior, barra lateral de escritorio (índice del capítulo + consultar),
   barra inferior móvil (5 destinos), paleta de búsqueda (Ctrl K) y aviso de versión nueva. */
import {
  Fragment,
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
  BookOpen,
  CircleCheck,
  Columns3,
  Home,
  Menu,
  MoreHorizontal,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { APARTADOS, CAPITULO } from "../contenido";
import { DESTINOS, GRUPOS_CONSULTAR } from "../nav";
import { consumirNavegacionNueva, href, marcarNavegacionNueva, type Ruta } from "../rutas";
import { TAMANOS, useLeidos, useNocturno, useTamanoLetra } from "../prefs";
import { VolverArriba } from "./Lectura";
import { ErrorBoundary, Modal } from "../ui";
import { fueraDelCapitulo, marcar, paginaDe } from "../busqueda";
import { useBuscador } from "../useBuscador";
import { CATEGORIA_HEX, SEEN } from "../tokens";

/* Destinos que viven bajo #/consultar/<id>. */
const SUB_CONSULTAR = [
  "tablas",
  "figura-3",
  "infografia",
  "glosario",
  "situacion",
  "descarga",
  "interrupcion",
];

function activo(ruta: Ruta, seccion: string, sub?: string) {
  if (ruta.seccion !== seccion) return false;
  return sub ? ruta.sub === sub : true;
}

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
  const motor = useBuscador(open);
  const res = motor && q.trim().length >= 2 ? motor.buscar(q, 12) : [];
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);
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
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar en el capítulo"
            placeholder="Buscar en el texto del capítulo…"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
          />
          <kbd className="hidden rounded border border-slate-200 px-1.5 text-[11px] text-slate-500 sm:inline">
            Esc
          </kbd>
        </div>
        {q.trim().length >= 2 && (
          <ul
            className="mt-2 max-h-[60vh] divide-y overflow-y-auto"
            style={{ borderColor: "#e6e6e6" }}
            aria-label="Resultados"
          >
            {res.length === 0 && (
              <li className="px-2 py-3 text-sm text-slate-600">
                Nada en el capítulo con esas palabras.
              </li>
            )}
            {res.map((r) => (
              <li key={r.entrada.id}>
                <a
                  href={r.entrada.ruta}
                  onClick={onClose}
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
                  href={href("buscar", q)}
                  onClick={onClose}
                  className="block px-2 py-2 text-sm font-semibold text-slate-700 hover:underline"
                >
                  Ver todos los resultados de «{q}»
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </Modal>
  );
}

/* ---------- Aviso de versión nueva (service worker) ---------- */
function AvisoVersion() {
  const [update, setUpdate] = useState<null | (() => void)>(
    () => (window as unknown as { __mseenActualizar?: () => void }).__mseenActualizar ?? null,
  );
  useEffect(() => {
    const on = (e: Event) =>
      setUpdate(() => (e as CustomEvent<{ update: () => void }>).detail.update);
    window.addEventListener("mseen:sw-need-refresh", on);
    return () => window.removeEventListener("mseen:sw-need-refresh", on);
  }, []);
  if (!update) return null;
  return (
    <div
      role="status"
      className="aviso-version fixed inset-x-3 bottom-32 z-40 mx-auto max-w-md rounded-xl border border-slate-300 bg-white p-3 shadow-xl md:bottom-4"
    >
      <p className="text-sm text-slate-800">Hay una versión nueva de la app.</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={update}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Actualizar
        </button>
        <button
          type="button"
          onClick={() => setUpdate(null)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

/* ---------- Rótulo (inspirado en el del Manual SEEN, sin ser su logotipo) ----------
   «Manual» en el azul oscuro del Manual (#3F6E9F): 4,5:1 también en el tamaño compacto. */
export function Rotulo({ compacto = false }: { compacto?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 leading-none" aria-hidden="true">
      <span
        className={`font-display font-semibold uppercase tracking-tight ${compacto ? "text-[1.35rem] min-[400px]:text-[1.6rem]" : "text-[2.1rem]"}`}
        style={{ color: SEEN.azulOsc }}
      >
        Manual
      </span>
      <span className="flex flex-col font-display font-medium uppercase leading-[0.95]">
        <span
          className={compacto ? "text-[0.62rem] min-[400px]:text-[0.72rem]" : "text-[0.85rem]"}
          style={{ color: SEEN.burdeos }}
        >
          SEEN · AID
        </span>
        <span
          className={compacto ? "text-[0.62rem] min-[400px]:text-[0.72rem]" : "text-[0.85rem]"}
          style={{ color: SEEN.mostazaOsc }}
        >
          Diabetes
        </span>
      </span>
    </span>
  );
}

/* ---------- Barra lateral (escritorio) ---------- */
function Lateral({ ruta, onBuscar }: { ruta: Ruta; onBuscar: () => void }) {
  const enCapitulo = ruta.seccion === "capitulo";
  const leidos = useLeidos();
  const grupo = (titulo: string, ids: string[]) => (
    <div className="mt-4">
      <div className="etiqueta-area px-3 text-[11px] text-slate-500">{titulo}</div>
      <ul className="mt-1 space-y-0.5">
        {ids.map((id) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          const on =
            id === "capitulo"
              ? enCapitulo
              : SUB_CONSULTAR.includes(id)
                ? activo(ruta, "consultar", id)
                : activo(ruta, id);
          const I = d.icono;
          const cat = CATEGORIA_HEX[d.cat];
          return (
            <li key={id}>
              <a
                href={d.href}
                aria-current={on ? "page" : undefined}
                className={`relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13.5px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                {on && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 left-0 w-[3px] rounded-full"
                    style={{ background: cat.strong }}
                  />
                )}
                <I size={16} aria-hidden="true" style={{ color: cat.strong }} />
                {d.etiqueta}
              </a>
              {id === "capitulo" && enCapitulo && (
                <ol
                  className="ml-4 mt-1 space-y-0.5 border-l pl-2"
                  style={{ borderColor: "#e6e6e6" }}
                >
                  {APARTADOS.map((a) => {
                    const onA = ruta.sub === a.slug;
                    return (
                      <li key={a.slug}>
                        <a
                          href={href("capitulo", a.slug)}
                          aria-current={onA ? "page" : undefined}
                          className={`flex gap-2 rounded-md px-2 py-1 text-[12.5px] uppercase leading-snug tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${onA ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                          <span
                            className={`w-5 shrink-0 tabular-nums ${onA ? "text-slate-700" : "text-slate-500"}`}
                          >
                            {a.n}
                          </span>
                          <span className="flex-1">{a.corto}</span>
                          {leidos.includes(a.slug) && (
                            <span className="text-emerald-700" title="Leído">
                              <CircleCheck size={13} aria-label="Leído" />
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <aside className="barra-lateral fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto px-3 py-4 md:flex">
      <a
        href="#/"
        aria-label="Manual SEEN · AID Diabetes, inicio"
        className="rounded-md px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      >
        <Rotulo />
        <span className="mt-1.5 block truncate text-[11px] text-slate-500">
          {CAPITULO.tituloCorto}
        </span>
      </a>
      <button
        type="button"
        onClick={onBuscar}
        aria-label="Buscar en el capítulo (Ctrl K)"
        className="mt-3 flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-600 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      >
        <Search size={15} aria-hidden="true" />
        <span className="flex-1">Buscar</span>
        <kbd className="rounded border border-slate-300 px-1 text-[10px] text-slate-500">
          Ctrl K
        </kbd>
      </button>
      <nav aria-label="Navegación principal">
        {grupo("Leer", ["capitulo"])}
        {GRUPOS_CONSULTAR.map((g) => (
          <Fragment key={g.id}>{grupo(g.titulo, g.ids)}</Fragment>
        ))}
        {grupo("Para el paciente", ["pacientes"])}
        {grupo("Fuentes y versión", ["bibliografia", "cambios", "sobre"])}
        {grupo("Aprender", ["test"])}
      </nav>
      <div className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-slate-500">
        Material educativo. No es producto sanitario ni sustituye el juicio clínico.
      </div>
    </aside>
  );
}

/* ---------- Barra inferior (móvil) ---------- */
function Inferior({ ruta }: { ruta: Ruta }) {
  const items = [
    { id: "inicio", etiqueta: "Inicio", href: "#/", icono: Home, on: ruta.seccion === "" },
    {
      id: "capitulo",
      etiqueta: "Capítulo",
      href: href("capitulo"),
      icono: BookOpen,
      on: ruta.seccion === "capitulo",
    },
    {
      id: "consultar",
      etiqueta: "Consultar",
      href: href("consultar"),
      icono: Columns3,
      on: ruta.seccion === "consultar",
    },
    {
      id: "buscar",
      etiqueta: "Buscar",
      href: href("buscar"),
      icono: Search,
      on: ruta.seccion === "buscar",
    },
    {
      id: "mas",
      etiqueta: "Más",
      href: href("mas"),
      icono: MoreHorizontal,
      on: ["mas", "bibliografia", "cambios", "sobre", "test", "pacientes"].includes(ruta.seccion),
    },
  ];
  return (
    <nav
      aria-label="Barra inferior"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-white md:hidden"
      style={{ borderColor: "#e6e6e6", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const I = it.icono;
          return (
            <li key={it.id}>
              <a
                href={it.href}
                aria-current={it.on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${it.on ? "text-slate-900" : "text-slate-500"}`}
                style={it.on ? { color: SEEN.burdeos } : undefined}
              >
                <I size={20} aria-hidden="true" />
                {it.etiqueta}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- Cajón móvil con el índice ---------- */
function Cajon({ open, onClose, ruta }: { open: boolean; onClose: () => void; ruta: Ruta }) {
  const leidos = useLeidos();
  return (
    <Modal open={open} onClose={onClose} ariaLabel="Índice del capítulo" maxW="max-w-md">
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800">Índice del capítulo</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded p-1 text-slate-600 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>
        <ol className="space-y-0.5">
          {APARTADOS.map((a) => (
            <li key={a.slug}>
              <a
                href={href("capitulo", a.slug)}
                onClick={onClose}
                aria-current={ruta.sub === a.slug ? "page" : undefined}
                className={`flex gap-2 rounded-lg px-2 py-2 text-sm transition hover:bg-slate-50 ${ruta.sub === a.slug ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
              >
                <span className="w-5 shrink-0 tabular-nums text-slate-500">{a.n}</span>
                <span className="flex-1">{a.titulo}</span>
                {leidos.includes(a.slug) && (
                  <CircleCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-700"
                    aria-label="Leído"
                  />
                )}
              </a>
            </li>
          ))}
        </ol>
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
  const abrirPaleta = useCallback(() => setPaleta(true), []);
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

  // Posición de scroll por pantalla, para restaurarla al volver con Atrás.
  const posiciones = useRef(new Map<string, number>());
  const pantallaActual = useRef("");
  useEffect(() => {
    const onScroll = () => posiciones.current.set(pantallaActual.current, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En Buscar, el texto escrito viaja en la URL: no es otra pantalla.
  const subPantalla = ruta.seccion === "buscar" ? "" : (ruta.sub ?? "");
  const clavePantalla = `${ruta.seccion}/${subPantalla}`;

  // Al cambiar de pantalla (no al elegir una opción dentro de ella): arriba del todo, salvo
  // enlace profundo (un bloque del capítulo, una referencia) o vuelta atrás (se restaura).
  // useLayoutEffect: corre antes que los efectos de los hijos, que hacen su propio scroll.
  useLayoutEffect(() => {
    pantallaActual.current = clavePantalla;
    const nueva = consumirNavegacionNueva();
    const destinoProfundo =
      (ruta.seccion === "capitulo" && !!ruta.detalle) ||
      (ruta.seccion === "bibliografia" && !!ruta.sub);
    if (destinoProfundo) return;
    const guardada = posiciones.current.get(clavePantalla);
    window.scrollTo({ top: !nueva && guardada != null ? guardada : 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clavePantalla]);

  useEffect(() => {
    document.title = titulo ? `${titulo} · Manual SEEN · AID` : "Manual SEEN · AID";
  }, [titulo]);

  const enLectura = ruta.seccion === "capitulo" && !!ruta.sub;
  const cat =
    ruta.seccion === "consultar"
      ? CATEGORIA_HEX.consultar
      : ["bibliografia", "cambios", "sobre"].includes(ruta.seccion)
        ? CATEGORIA_HEX.confiar
        : ruta.seccion === "test"
          ? CATEGORIA_HEX.aprender
          : ruta.seccion === "pacientes"
            ? CATEGORIA_HEX.pacientes
            : CATEGORIA_HEX.leer;

  const menor = TAMANOS[Math.max(0, TAMANOS.indexOf(letra) - 1)];
  const mayor = TAMANOS[Math.min(TAMANOS.length - 1, TAMANOS.indexOf(letra) + 1)];

  return (
    <div className="lienzo min-h-screen bg-slate-50 text-slate-900">
      <Lateral ruta={ruta} onBuscar={abrirPaleta} />
      <header
        className="cabecera sticky top-0 z-20 border-b backdrop-blur md:ml-64"
        style={{ borderColor: "#e6e6e6" }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3 sm:px-5">
          <button
            type="button"
            onClick={() => setCajon(true)}
            aria-label="Índice del capítulo"
            className="tap-44 rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 md:hidden"
          >
            <Menu size={20} />
          </button>
          <a
            href="#/"
            aria-label="Manual SEEN · AID Diabetes, inicio"
            className="min-w-0 shrink-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 md:hidden"
          >
            <Rotulo compacto />
          </a>
          <span className="hidden min-w-0 flex-1 truncate text-sm text-slate-600 md:block">
            {titulo || CAPITULO.tituloCorto}
          </span>
          <span
            className="etiqueta-area ml-auto hidden truncate text-sm lg:block"
            style={{ color: SEEN.diabetesOsc }}
          >
            Área · Diabetes
          </span>
          <span className="flex-1 md:hidden" />
          {enLectura && (
            <div className="flex items-center" role="group" aria-label="Tamaño de letra">
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
          <button
            type="button"
            onClick={abrirPaleta}
            aria-label="Buscar"
            className="tap-44 rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={toggleNight}
            aria-pressed={night}
            aria-label={night ? "Modo día" : "Modo nocturno"}
            title={night ? "Modo día" : "Modo nocturno"}
            className="tap-44 rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            {night ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <main
        ref={mainRef}
        className="md:ml-64"
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
          {/* Un fallo en una pantalla deja en pie la barra lateral y la navegación. */}
          <ErrorBoundary>
            <Suspense fallback={<CargandoPantalla />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <Inferior ruta={ruta} />
      <Cajon open={cajon} onClose={cerrarCajon} ruta={ruta} />
      <Paleta open={paleta} onClose={cerrarPaleta} />
      <VolverArriba />
      <AvisoVersion />
    </div>
  );
}
