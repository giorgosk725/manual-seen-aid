/* Utilidades de lectura: favorito, volver arriba, cómo citar y escuchar el apartado.
   Nada de esto guarda datos clínicos: favoritos y lectura son rutas de la app (src/prefs.ts) y
   la voz es la del propio dispositivo (Web Speech), que funciona sin conexión si hay una voz
   en español instalada. */
import { useEffect, useRef, useState } from "react";
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
  Star,
  Volume2,
} from "lucide-react";
import { idDeBloque, type Apartado } from "../contenido";
import { plano } from "../marcado";
import { alternarFavorito, useFavoritos } from "../prefs";
import { citaDeApartado } from "../compartir";
import { CASO_EDUCATIVO, EDUCATIVA } from "../enlaces";

const BOTON =
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600";

/* ---------- Favorito ---------- */
export function BotonFavorito({ ruta, titulo }: { ruta: string; titulo: string }) {
  const favoritos = useFavoritos();
  const on = favoritos.some((f) => f.ruta === ruta);
  return (
    <button
      type="button"
      onClick={() => alternarFavorito({ ruta, titulo })}
      aria-pressed={on}
      title={on ? "Quitar de favoritos" : "Guardar en favoritos (solo en este navegador)"}
      className={BOTON}
    >
      <Star
        size={14}
        aria-hidden="true"
        className={on ? "fill-amber-400 text-amber-500" : undefined}
      />
      {on ? "En favoritos" : "Favorito"}
    </button>
  );
}

/* ---------- Volver arriba (pantallas largas) ---------- */
export function VolverArriba() {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    const on = () => setVer(window.scrollY > window.innerHeight * 1.5);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
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
  const [copiado, setCopiado] = useState(false);
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
          style={{ borderColor: "#e5ebf1" }}
        >
          <p className="select-all text-slate-800">{texto}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={BOTON}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(texto);
                  setCopiado(true);
                } catch {
                  setCopiado(false);
                }
              }}
            >
              {copiado ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
              {copiado ? "Copiada" : "Copiar"}
            </button>
            <span className="text-xs text-slate-500">
              ISBN y fecha de publicación del Manual: pendientes de confirmar con la SEEN.
            </span>
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
  const disponible = typeof window !== "undefined" && "speechSynthesis" in window;

  const marcar = (id: string) => {
    if (actual.current) document.getElementById(actual.current)?.classList.remove("leyendo");
    actual.current = id;
    if (id) document.getElementById(id)?.classList.add("leyendo");
  };
  const parar = () => {
    if (!disponible) return;
    window.speechSynthesis.cancel();
    marcar("");
    setEstado("parado");
  };
  // Al salir del apartado (o cambiar de apartado) se calla.
  useEffect(() => () => parar(), [apartado.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!disponible) return null;
  const empezar = () => {
    const s = window.speechSynthesis;
    s.cancel();
    const voz =
      s.getVoices().find((v) => v.lang.toLowerCase().startsWith("es-es")) ??
      s.getVoices().find((v) => v.lang.toLowerCase().startsWith("es"));
    const lista = trozos(apartado);
    lista.forEach((t, k) => {
      const u = new SpeechSynthesisUtterance(t.texto);
      u.lang = "es-ES";
      if (voz) u.voice = voz;
      u.onstart = () => marcar(t.id);
      if (k === lista.length - 1) u.onend = () => parar();
      s.speak(u);
    });
    setEstado("hablando");
  };
  return (
    <span
      className="inline-flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Escuchar el apartado"
    >
      {estado === "parado" && (
        <button
          type="button"
          onClick={empezar}
          className={BOTON}
          title="Lee el apartado con la voz del dispositivo"
        >
          <Volume2 size={14} aria-hidden="true" /> Escuchar
        </button>
      )}
      {estado === "hablando" && (
        <button
          type="button"
          onClick={() => {
            window.speechSynthesis.pause();
            setEstado("pausa");
          }}
          className={BOTON}
        >
          <Pause size={14} aria-hidden="true" /> Pausa
        </button>
      )}
      {estado === "pausa" && (
        <button
          type="button"
          onClick={() => {
            window.speechSynthesis.resume();
            setEstado("hablando");
          }}
          className={BOTON}
        >
          <Play size={14} aria-hidden="true" /> Seguir
        </button>
      )}
      {estado !== "parado" && (
        <button type="button" onClick={parar} className={BOTON}>
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
      style={{ borderColor: "#e5ebf1" }}
    >
      <GraduationCap size={18} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-slate-900">Practicar con un caso: {c.texto}</span>
        <span className="block text-xs text-slate-600">
          Edición educativa de asistente-aid, del mismo autor (fuera del capítulo; pacientes de
          ejemplo, sin datos reales).
        </span>
      </span>
      <ExternalLink size={14} className="mt-1 shrink-0 text-slate-500" aria-hidden="true" />
    </a>
  );
}
