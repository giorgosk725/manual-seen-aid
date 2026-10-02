/* Shell: barra superior, barra lateral de escritorio (índice del capítulo + consultar),
   barra inferior móvil (5 destinos), paleta de búsqueda (Ctrl K) y aviso de versión nueva. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AArrowDown,
  AArrowUp,
  BookOpen,
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
import { DESTINOS } from "../nav";
import { href, useRuta, type Ruta } from "../rutas";
import { TAMANOS, useNocturno, useTamanoLetra } from "../prefs";
import { Modal } from "../ui";
import { buscar, marcar } from "../buscador";
import { CATEGORIA_HEX } from "../tokens";

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

/* ---------- Paleta de búsqueda (Ctrl K) ---------- */
function Paleta({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const res = q.trim().length >= 2 ? buscar(q, 12) : [];
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
            style={{ borderColor: "#e5ebf1" }}
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
                    <span className="pagina-badge">p. {r.entrada.pagina}</span>
                  </div>
                  <div className="mt-0.5 text-sm text-slate-800">
                    {marcar(r.fragmento, q).map((t, i) =>
                      t.hit ? (
                        <mark key={i} className="rounded bg-sky-100 px-0.5">
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
  const [update, setUpdate] = useState<null | (() => void)>(null);
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
      className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md rounded-xl border border-slate-300 bg-white p-3 shadow-xl md:bottom-4"
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

/* ---------- Barra lateral (escritorio) ---------- */
function Lateral({ ruta, onBuscar }: { ruta: Ruta; onBuscar: () => void }) {
  const enCapitulo = ruta.seccion === "capitulo";
  const grupo = (titulo: string, ids: string[]) => (
    <div className="mt-4">
      <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-white/50">
        {titulo}
      </div>
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
          return (
            <li key={id}>
              <a
                href={d.href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${on ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                <I size={16} aria-hidden="true" />
                {d.etiqueta}
              </a>
              {id === "capitulo" && enCapitulo && (
                <ol className="ml-4 mt-1 space-y-0.5 border-l border-white/15 pl-2">
                  {APARTADOS.map((a) => {
                    const onA = ruta.sub === a.slug;
                    return (
                      <li key={a.slug}>
                        <a
                          href={href("capitulo", a.slug)}
                          aria-current={onA ? "page" : undefined}
                          className={`flex gap-2 rounded-md px-2 py-1 text-[13px] leading-snug transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${onA ? "bg-white/15 font-semibold text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                        >
                          <span className="w-5 shrink-0 tabular-nums text-white/50">{a.n}</span>
                          <span>{a.corto}</span>
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
    <aside className="barra-lateral fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto px-3 py-4 text-white md:flex">
      <a
        href="#/"
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <BookOpen size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-extrabold leading-tight">Manual SEEN · AID</span>
          <span className="block truncate text-[11px] text-white/60">{CAPITULO.tituloCorto}</span>
        </span>
      </a>
      <button
        type="button"
        onClick={onBuscar}
        className="mt-3 flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <Search size={15} aria-hidden="true" />
        <span className="flex-1">Buscar en el capítulo</span>
        <kbd className="rounded border border-white/25 px-1 text-[10px] text-white/60">Ctrl K</kbd>
      </button>
      <nav aria-label="Navegación principal">
        {grupo("Leer", ["capitulo"])}
        {grupo("Consultar", [
          "sistemas",
          "situacion",
          "figura-3",
          "descarga",
          "interrupcion",
          "tablas",
          "infografia",
          "glosario",
        ])}
        {grupo("Confiar", ["bibliografia", "cambios", "sobre"])}
        {grupo("Aprender", ["test"])}
      </nav>
      <div className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-white/50">
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
      on: ["mas", "bibliografia", "cambios", "sobre", "test"].includes(ruta.seccion),
    },
  ];
  return (
    <nav
      aria-label="Barra inferior"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-white md:hidden"
      style={{ borderColor: "#e5ebf1", paddingBottom: "env(safe-area-inset-bottom)" }}
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
                style={it.on ? { color: "#1f4e79" } : undefined}
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
                <span className="w-5 shrink-0 tabular-nums text-slate-400">{a.n}</span>
                {a.titulo}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}

export function Shell({ children, titulo }: { children: ReactNode; titulo?: string }) {
  const ruta = useRuta();
  const [night, toggleNight] = useNocturno();
  const [letra, setLetra] = useTamanoLetra();
  const [paleta, setPaleta] = useState(false);
  const [cajon, setCajon] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const abrirPaleta = useCallback(() => setPaleta(true), []);
  const cerrarPaleta = useCallback(() => setPaleta(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaleta((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Al cambiar de pantalla: arriba del todo (salvo enlace profundo a un bloque) y título.
  useEffect(() => {
    if (!ruta.detalle || ruta.seccion !== "capitulo") window.scrollTo({ top: 0 });
    document.title = titulo ? `${titulo} · Manual SEEN · AID` : "Manual SEEN · AID";
  }, [ruta.seccion, ruta.sub, ruta.detalle, titulo]);

  const enLectura = ruta.seccion === "capitulo" && !!ruta.sub;
  const cat =
    ruta.seccion === "consultar"
      ? CATEGORIA_HEX.consultar
      : ["bibliografia", "cambios", "sobre"].includes(ruta.seccion)
        ? CATEGORIA_HEX.confiar
        : ruta.seccion === "test"
          ? CATEGORIA_HEX.aprender
          : CATEGORIA_HEX.leer;

  const menor = TAMANOS[Math.max(0, TAMANOS.indexOf(letra) - 1)];
  const mayor = TAMANOS[Math.min(TAMANOS.length - 1, TAMANOS.indexOf(letra) + 1)];

  return (
    <div className="lienzo min-h-screen bg-slate-50 text-slate-900">
      <Lateral ruta={ruta} onBuscar={abrirPaleta} />
      <header
        className="cabecera sticky top-0 z-20 border-b backdrop-blur md:ml-64"
        style={{ borderColor: "#e5ebf1" }}
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
            className="min-w-0 flex-1 truncate text-sm font-extrabold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 md:text-base"
          >
            <span className="md:hidden">Manual SEEN · AID</span>
            <span className="hidden text-slate-600 md:inline">{titulo || "Manual SEEN · AID"}</span>
          </a>
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
          key={`${ruta.seccion}/${ruta.sub ?? ""}`}
          className="pantalla-in mx-auto max-w-5xl px-3 pb-24 pt-4 sm:px-5 md:pb-10"
        >
          {children}
        </div>
      </main>
      <Inferior ruta={ruta} />
      <Cajon open={cajon} onClose={() => setCajon(false)} ruta={ruta} />
      <Paleta open={paleta} onClose={cerrarPaleta} />
      <AvisoVersion />
    </div>
  );
}
