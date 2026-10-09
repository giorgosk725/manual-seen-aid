/* Tarjetas de repaso (#/repaso, #/repaso/cifras, #/repaso/siglas, #/repaso/<apartado>): las
   cifras y las siglas del capítulo, tal cual, con su página, en rondas de repaso espaciado.
   La lógica está en repaso.ts; el progreso, solo en este dispositivo (prefs.ts). */
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { APARTADOS, FIGURA3, apartadoPorSlug } from "../contenido";
import { CIFRAS } from "../contenido/cifras";
import { href } from "../rutas";
import { guardarRepaso, leerRepaso, useRepaso } from "../prefs";
import {
  TARJETAS,
  calificar,
  fechaLocal,
  mazo,
  nombreDelMazo,
  resumen,
  ronda,
  type Tarjeta,
} from "../repaso";
import { CATEGORIA_HEX, colorApartado } from "../tokens";
import { CabeceraEditorial } from "../ui";

const HEX = CATEGORIA_HEX.aprender;

function Dato({ etiqueta, valor }: { etiqueta: string; valor: number | string }) {
  return (
    <div className="rounded-xl px-3 py-2" style={{ background: HEX.soft }}>
      <div className="text-xl font-extrabold tabular-nums" style={{ color: HEX.ink }}>
        {valor}
      </div>
      <div className="text-xs text-slate-700">{etiqueta}</div>
    </div>
  );
}

/* Elegir el mazo: son rutas, así que cada mazo tiene su enlace y Atrás funciona. */
function Mazos({ filtro }: { filtro?: string }) {
  const n = (f?: string) => mazo(f).length;
  const opciones: [string | undefined, string][] = [
    [undefined, `Todas (${n()})`],
    ["cifras", `Cifras (${n("cifras")})`],
    ["siglas", `Siglas (${n("siglas")})`],
  ];
  const conCifras = APARTADOS.filter((a) => (CIFRAS[a.slug]?.length ?? 0) > 0);
  const deApartado = filtro && apartadoPorSlug(filtro) ? filtro : "";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <nav aria-label="Mazos de tarjetas" className="flex flex-wrap gap-1.5">
        {opciones.map(([f, texto]) => {
          const on = (filtro || undefined) === f && !deApartado;
          return (
            <a
              key={texto}
              href={href("repaso", f)}
              aria-current={on ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
              style={
                on
                  ? { background: HEX.strong, borderColor: HEX.strong }
                  : { borderColor: "#d4d4d4" }
              }
            >
              {texto}
            </a>
          );
        })}
      </nav>
      <label className="flex min-h-11 items-center gap-2 text-sm text-slate-700">
        <span className="font-semibold">Por apartado</span>
        <select
          value={deApartado}
          onChange={(e) => {
            window.location.hash = href("repaso", e.target.value || undefined);
          }}
          className="min-h-11 rounded-lg border bg-white px-2 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          style={{ borderColor: "#d4d4d4" }}
        >
          <option value="">Todos</option>
          {conCifras.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.n}. {a.corto} ({mazo(a.slug).length})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/* Una tarjeta: la pregunta, «Mostrar la respuesta» y, después, la respuesta con su página y
   los dos botones. */
function TarjetaVista({
  t,
  visible,
  onMostrar,
  onCalificar,
  posicion,
  autoFoco,
}: {
  t: Tarjeta;
  visible: boolean;
  onMostrar: () => void;
  onCalificar: (seAcordaba: boolean) => void;
  posicion: string;
  autoFoco: boolean;
}) {
  const tarjeta = useRef<HTMLElement>(null);
  const pregunta = useRef<HTMLParagraphElement>(null);
  const respuesta = useRef<HTMLDivElement>(null);
  const botones = useRef<HTMLDivElement>(null);
  const montada = useRef(false);
  // Al pasar de tarjeta, el foco va a la pregunta (el lector de pantalla la lee) y la tarjeta
  // a la vista; al mostrar la respuesta, el foco a la respuesta y los botones a la vista (en el
  // móvil quedaban bajo la barra inferior). Al entrar en la pantalla, el foco no se mueve.
  useEffect(() => {
    if (!montada.current) {
      montada.current = true;
      if (!autoFoco) return;
    }
    (visible ? respuesta : pregunta).current?.focus({ preventScroll: true });
    (visible ? botones : tarjeta).current?.scrollIntoView?.({ block: "nearest" });
  }, [t.id, visible, autoFoco]);
  const ap = t.apartado ? apartadoPorSlug(t.apartado) : undefined;
  return (
    <article
      ref={tarjeta}
      className="scroll-mt-20 overflow-hidden rounded-2xl border bg-white shadow-soft"
      style={{ borderColor: "#e6e6e6" }}
      aria-label={`Tarjeta ${posicion}`}
    >
      <div className="h-1.5" style={{ background: HEX.strong }} aria-hidden="true" />
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="font-bold tabular-nums">{posicion}</span>
          <span aria-hidden="true">·</span>
          {ap ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: colorApartado(Number(ap.n)) }}
                aria-hidden="true"
              />
              Apartado {ap.n}. {ap.corto}
            </span>
          ) : (
            <span>Sigla del capítulo</span>
          )}
        </div>
        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          {t.mazo === "cifras" ? "¿Qué cifra da el capítulo?" : "¿Qué significa?"}
        </p>
        <p
          ref={pregunta}
          tabIndex={-1}
          className={`mt-1 text-slate-900 focus:outline-none ${t.mazo === "siglas" ? "font-display text-3xl font-medium" : "text-lg font-semibold leading-snug"}`}
        >
          {t.pregunta}
        </p>

        {!visible ? (
          <button
            type="button"
            onClick={onMostrar}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 sm:w-auto"
            style={{ background: HEX.strong }}
          >
            Mostrar la respuesta
          </button>
        ) : (
          <div className="animate-in mt-4">
            <div
              ref={respuesta}
              tabIndex={-1}
              className="rounded-xl p-4 focus:outline-none"
              style={{ background: HEX.soft }}
            >
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: HEX.ink }}>
                Lo que dice el capítulo
              </p>
              <p
                className={`mt-1 font-extrabold leading-tight tabular-nums ${t.mazo === "cifras" ? "text-2xl" : "text-lg"}`}
                style={{ color: HEX.ink }}
              >
                {t.respuesta}
              </p>
              {t.asterisco && (
                <p className="mt-2 text-xs text-slate-700">
                  {FIGURA3.notaAsterisco} <span className="pagina-badge">Figura 3, p. 8</span>
                </p>
              )}
              <a
                href={t.ruta}
                className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline"
              >
                {t.mazo === "cifras" ? "Leerlo en el apartado" : "Leerla en el apartado"} (p.{" "}
                {t.pagina}) <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-800">¿Recordabas la respuesta?</p>
            <div ref={botones} className="mt-2 grid scroll-mb-24 grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => onCalificar(false)}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
              >
                <X size={16} aria-hidden="true" /> No
                <span className="sr-only">, volverá en esta ronda</span>
              </button>
              <button
                type="button"
                onClick={() => onCalificar(true)}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-bold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
                style={{ background: "#2f6b45" }}
              >
                <Check size={16} aria-hidden="true" /> Sí
                <span className="sr-only">, volverá más adelante</span>
              </button>
            </div>
          </div>
        )}
        <p className="mt-4 hidden text-xs text-slate-500 md:block">
          Teclado: espacio para ver la respuesta; 1 si no te acordabas, 2 si sí.
        </p>
      </div>
    </article>
  );
}

/* Una ronda: la cola se fija al empezar (no cambia mientras se responde). Lo que no se
   recuerda vuelve una vez al final de la misma ronda. */
function Ronda({
  lista,
  onOtra,
  autoFoco,
}: {
  lista: Tarjeta[];
  onOtra: () => void;
  autoFoco: boolean;
}) {
  const [cola, setCola] = useState(() => ronda(lista, leerRepaso(), fechaLocal()));
  const [pos, setPos] = useState(0);
  const [visible, setVisible] = useState(false);
  const [aLaPrimera, setALaPrimera] = useState(0);
  const [repetidas] = useState(() => new Set<string>());
  const actual = cola[pos];

  const calificarActual = useCallback(
    (seAcordaba: boolean) => {
      if (!actual) return;
      guardarRepaso(
        calificar(leerRepaso(), actual.id, seAcordaba, fechaLocal(), {
          repetida: repetidas.has(actual.id),
        }),
      );
      if (seAcordaba && !repetidas.has(actual.id)) setALaPrimera((n) => n + 1);
      if (!seAcordaba && !repetidas.has(actual.id)) {
        repetidas.add(actual.id);
        setCola((c) => [...c, actual]);
      }
      setVisible(false);
      setPos((p) => p + 1);
    },
    [actual, repetidas],
  );

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, select, textarea, [contenteditable=true]")) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!visible && e.key === " " && !el?.closest("button, a")) {
        e.preventDefault();
        setVisible(true);
      } else if (visible && (e.key === "1" || e.key === "2")) {
        e.preventDefault();
        calificarActual(e.key === "2");
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [visible, calificarActual]);

  if (!cola.length)
    return (
      <div
        className="rounded-2xl border bg-white p-5 text-sm text-slate-800 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
      >
        <p className="font-bold text-slate-900">Nada que repasar hoy en este mazo.</p>
        <p className="mt-1">Las tarjetas que ya has visto volverán en su día; prueba otro mazo.</p>
      </div>
    );

  if (!actual) {
    const vistas = cola.length - repetidas.size;
    return (
      <div
        className="animate-in rounded-2xl border bg-white p-5 shadow-soft"
        style={{ borderColor: "#e6e6e6" }}
        role="status"
      >
        <p className="font-display text-xl font-medium uppercase" style={{ color: HEX.ink }}>
          Ronda terminada
        </p>
        <p className="mt-1 text-sm text-slate-800">
          {aLaPrimera} de {vistas} a la primera
          {repetidas.size === 1 && "; 1 repetida hasta acertarla"}
          {repetidas.size > 1 && `; ${repetidas.size} repetidas hasta acertarlas`}.
        </p>
        <button
          type="button"
          onClick={onOtra}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
          style={{ background: HEX.strong }}
        >
          <RotateCcw size={16} aria-hidden="true" /> Otra ronda
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-label="Avance de la ronda"
        aria-valuemin={0}
        aria-valuemax={cola.length}
        aria-valuenow={pos}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(pos / cola.length) * 100}%`, background: HEX.strong }}
        />
      </div>
      <TarjetaVista
        t={actual}
        visible={visible}
        onMostrar={() => setVisible(true)}
        onCalificar={calificarActual}
        posicion={`${pos + 1} de ${cola.length}`}
        autoFoco={autoFoco || pos > 0}
      />
    </div>
  );
}

function Borrar() {
  const [seguro, setSeguro] = useState(false);
  if (!seguro)
    return (
      <button
        type="button"
        onClick={() => setSeguro(true)}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-600 underline-offset-2 hover:underline"
      >
        Empezar de cero
      </button>
    );
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm text-slate-800" role="group">
      ¿Borrar el progreso de todas las tarjetas?
      <button
        type="button"
        onClick={() => {
          guardarRepaso({});
          setSeguro(false);
        }}
        className="inline-flex min-h-11 items-center rounded-lg border border-red-300 bg-white px-3 font-semibold text-red-800 hover:border-red-400"
      >
        Sí, borrar
      </button>
      <button
        type="button"
        onClick={() => setSeguro(false)}
        className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700"
      >
        No
      </button>
    </span>
  );
}

export function Repaso({ filtro }: { filtro?: string }) {
  const progreso = useRepaso();
  const lista = mazo(filtro);
  const r = resumen(lista, progreso, fechaLocal());
  // Cada ronda (y cada mazo) es un componente nuevo: su cola se calcula al empezar.
  const [n, setN] = useState(0);
  return (
    <div>
      <CabeceraEditorial titulo="Tarjetas de repaso" hex={HEX} level={1}>
        <p className="text-sm text-slate-600">
          Las cifras y las siglas del capítulo, tal como las da, con su página. Lo que recuerdas
          vuelve más adelante; lo que no, en la misma ronda. Tu avance se guarda solo en este
          dispositivo.
        </p>
      </CabeceraEditorial>
      <Mazos filtro={filtro} />
      <h2 className="sr-only">{nombreDelMazo(filtro)}</h2>
      <div className="my-4 grid grid-cols-3 gap-2" aria-label="Tu avance en este mazo">
        <Dato valor={ronda(lista, progreso, fechaLocal()).length} etiqueta="para repasar hoy" />
        <Dato valor={r.sinVer} etiqueta="sin repasar" />
        <Dato valor={`${r.aprendidas}/${r.total}`} etiqueta="con repaso espaciado" />
      </div>
      <Ronda
        key={`${filtro ?? ""}-${n}`}
        lista={lista}
        onOtra={() => setN((x) => x + 1)}
        autoFoco={n > 0}
      />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          {TARJETAS.length} tarjetas. «Con repaso espaciado»: la que no vuelve hasta dentro de una
          semana o más.
        </span>
        <Borrar />
      </div>
    </div>
  );
}
