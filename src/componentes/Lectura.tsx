/* Utilidades de lectura: favorito, volver arriba, cómo citar y escuchar el apartado.
   Nada de esto guarda datos clínicos: la lectura guarda rutas de la app (src/prefs.ts) y
   la voz es la del propio dispositivo (Web Speech), que funciona sin conexión si hay una voz
   en español instalada. */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  Pause,
  Play,
  Quote,
  Square,
  Volume2,
} from "lucide-react";
import { CAPITULO, idDeBloque, type Apartado } from "../contenido";
import { plano } from "../marcado";
import { citaDeApartado } from "../compartir";
import { CASO_EDUCATIVO, EDUCATIVA } from "../enlaces";

const BOTON =
  "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600";

/* ---------- Volver arriba (pantallas largas) ----------
   Aparece al desplazarse hacia arriba lejos del principio y se esconde al seguir leyendo
   hacia abajo o a los 2,5 s sin desplazar, para no tapar el texto ni los controles. */
export function VolverArriba() {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    let antes = window.scrollY;
    let reposo: ReturnType<typeof setTimeout> | undefined;
    const on = () => {
      const y = window.scrollY;
      const lejos = y > window.innerHeight * 1.5;
      if (!lejos) setVer(false);
      else if (y < antes - 4) setVer(true);
      else if (y > antes + 4) setVer(false);
      antes = y;
      clearTimeout(reposo);
      reposo = setTimeout(() => setVer(false), 2500);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      clearTimeout(reposo);
      window.removeEventListener("scroll", on);
    };
  }, []);
  if (!ver) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const reducido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
      }}
      className="volver-arriba no-imprimir fixed bottom-20 right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-lg transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 md:bottom-6 md:right-6"
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}

/* ---------- Cómo citar ---------- */
export function ComoCitar({ apartado }: { apartado: Apartado }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState<"" | "ok" | "error">("");
  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(""), 2500);
    return () => clearTimeout(t);
  }, [copiado]);
  const texto = citaDeApartado(apartado);
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className={BOTON}
      >
        <Quote size={14} aria-hidden="true" /> Cómo citar
      </button>
      {abierto && (
        <div
          className="mt-2 w-full rounded-xl border bg-white p-3 text-sm"
          style={{ borderColor: "#e6e6e6" }}
        >
          <p className="select-all text-slate-800">{texto}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={BOTON}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(texto);
                  setCopiado("ok");
                } catch {
                  setCopiado("error");
                }
              }}
            >
              {copiado === "ok" ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
              {copiado === "ok" ? "Copiada" : "Copiar"}
            </button>
            <span role="status" className="text-xs text-slate-600">
              {copiado === "error" && "No se pudo copiar: selecciona el texto y cópialo a mano."}
            </span>
            <a
              href={CAPITULO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-700 hover:underline"
            >
              Ver el capítulo en el Manual SEEN <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Escuchar el apartado (voz del dispositivo) ---------- */
type EstadoVoz = "parado" | "hablando" | "pausa";

const trozos = (a: Apartado) =>
  [{ id: "", texto: `${a.n}. ${a.titulo}.` }].concat(
    a.bloques.flatMap((b, i) => {
      const id = idDeBloque(b, i);
      if (b.t === "p") return [{ id, texto: plano((b.lead ? b.lead + " " : "") + b.texto) }];
      if (b.t === "h3") return [{ id, texto: b.texto + "." }];
      if (b.t === "lista")
        return [{ id, texto: plano([b.intro, ...b.items].filter(Boolean).join(". ")) }];
      return [];
    }),
  );

export function Escuchar({ apartado }: { apartado: Apartado }) {
  const [estado, setEstado] = useState<EstadoVoz>("parado");
  const actual = useRef<string>("");
  // Trozo por el que va la lectura y «turno» que invalida los avisos de lo ya cancelado.
  const indice = useRef(0);
  const turno = useRef(0);
  const conmutador = useRef<HTMLButtonElement>(null);
  const lista = useMemo(() => trozos(apartado), [apartado]);
  const disponible = typeof window !== "undefined" && "speechSynthesis" in window;

  const marcar = (id: string) => {
    if (actual.current) document.getElementById(actual.current)?.classList.remove("leyendo");
    actual.current = id;
    if (id) document.getElementById(id)?.classList.add("leyendo");
  };
  /* Voz en español, preferentemente del propio dispositivo: las voces «en línea» envían el
     texto fuera. Se elige al decir cada trozo porque algunas listas de voces llegan tarde. */
  const voz = () => {
    const es = window.speechSynthesis
      .getVoices()
      .filter((v) => v.lang.toLowerCase().startsWith("es"));
    const locales = es.filter((v) => v.localService);
    const grupo = locales.length ? locales : es;
    return grupo.find((v) => v.lang.toLowerCase().startsWith("es-es")) ?? grupo[0];
  };
  const callar = () => {
    turno.current++;
    window.speechSynthesis.cancel();
    // Tras cancelar una pausa, algunos motores quedan «en pausa» y no vuelven a hablar.
    window.speechSynthesis.resume();
  };
  const parar = (devolverFoco = false) => {
    if (!disponible) return;
    callar();
    indice.current = 0;
    marcar("");
    setEstado("parado");
    if (devolverFoco) conmutador.current?.focus();
  };
  /* Un trozo cada vez: pausar es callar y recordar por dónde iba (pause() no es fiable en
     todos los navegadores) y seguir es volver a empezar ese trozo. */
  const decir = (k: number) => {
    if (k >= lista.length) {
      parar();
      return;
    }
    const t = lista[k];
    const mio = turno.current;
    const u = new SpeechSynthesisUtterance(t.texto);
    u.lang = "es-ES";
    const v = voz();
    if (v) u.voice = v;
    u.onstart = () => {
      if (mio === turno.current) marcar(t.id);
    };
    u.onend = () => {
      if (mio !== turno.current) return;
      indice.current = k + 1;
      decir(k + 1);
    };
    u.onerror = (e) => {
      if (mio !== turno.current || e.error === "interrupted" || e.error === "canceled") return;
      parar();
    };
    window.speechSynthesis.speak(u);
  };
  const empezar = (desde: number) => {
    callar();
    indice.current = desde;
    setEstado("hablando");
    decir(desde);
  };
  // Al salir del apartado (o cambiar de apartado) se calla.
  useEffect(() => () => parar(), [apartado.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!disponible) return null;
  return (
    <span
      className="inline-flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Escuchar el apartado"
    >
      {/* Un solo botón que cambia de función: no desaparece y el foco se queda en él. */}
      <button
        ref={conmutador}
        type="button"
        onClick={() => {
          if (estado === "parado") empezar(0);
          else if (estado === "hablando") {
            callar();
            setEstado("pausa");
          } else empezar(indice.current);
        }}
        className={BOTON}
        title="Lee el texto del apartado con la voz del dispositivo (las tablas, figuras y diagramas no se leen)"
      >
        {estado === "parado" && (
          <>
            <Volume2 size={14} aria-hidden="true" /> Escuchar
          </>
        )}
        {estado === "hablando" && (
          <>
            <Pause size={14} aria-hidden="true" /> Pausa
          </>
        )}
        {estado === "pausa" && (
          <>
            <Play size={14} aria-hidden="true" /> Seguir
          </>
        )}
      </button>
      {estado !== "parado" && (
        <button type="button" onClick={() => parar(true)} className={BOTON}>
          <Square size={14} aria-hidden="true" /> Parar
        </button>
      )}
    </span>
  );
}

/* ---------- Caso práctico en la edición educativa de asistente-aid ---------- */
export function EnlaceEducativa({ clave }: { clave: string }) {
  const c = CASO_EDUCATIVO[clave];
  if (!c) return null;
  return (
    <a
      href={EDUCATIVA + c.ruta}
      target="_blank"
      rel="noopener noreferrer"
      className="no-imprimir flex items-start gap-3 rounded-xl border bg-white p-3 text-sm transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
      style={{ borderColor: "#e6e6e6" }}
    >
      <GraduationCap size={18} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">Practicar con un caso: {c.texto}</span>
        <span className="block text-xs text-slate-600">
          Edición educativa de asistente-aid (fuera del capítulo; pacientes de ejemplo, sin datos
          reales).
        </span>
      </span>
      <ExternalLink size={14} className="mt-1 shrink-0 text-slate-500" aria-hidden="true" />
    </a>
  );
}
