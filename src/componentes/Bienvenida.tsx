/* «Guía rápida»: tarjeta de primera visita en la portada (se cierra y no vuelve) y la
   misma guía en «Sobre esta versión». Texto de la app, no del capítulo. */
import { BookOpen, HeartHandshake, Route, Search, X } from "lucide-react";
import { href } from "../rutas";
import { cerrarBienvenida, useBienvenidaVista } from "../prefs";

const PASOS = [
  {
    icono: Search,
    titulo: "Busca con tus palabras",
    texto:
      "En la caja de «¿Qué necesitas?» o con la lupa (Ctrl K): «cetonas 1,2», «resonancia con 780G», «cuánto tiempo puedo estar desconectado». Arriba, el pasaje del capítulo que mejor encaja, literal y con su página.",
    ruta: href("buscar"),
    enlace: "Buscar",
  },
  {
    icono: Route,
    titulo: "Recorridos paso a paso",
    texto:
      "Iniciar un sistema, cetonemia (Figura 3), situación y sistema, revisar la descarga e interrupción del sistema: cada uno con el sistema que elijas.",
    ruta: href("consultar"),
    enlace: "Consultar",
  },
  {
    icono: HeartHandshake,
    titulo: "Para el paciente",
    texto: "Hojas para imprimir o enseñar con un QR, y el plan de seguridad de cada sistema.",
    ruta: href("pacientes"),
    enlace: "Para el paciente",
  },
  {
    icono: BookOpen,
    titulo: "El capítulo entero",
    texto:
      "Los 13 apartados con sus tablas y figuras; la app recuerda dónde lo dejaste. Funciona sin conexión y se puede instalar.",
    ruta: href("capitulo"),
    enlace: "Índice",
  },
];

export function GuiaDeUso({ nivel = 3 }: { nivel?: 2 | 3 }) {
  const H = `h${nivel}` as "h2" | "h3";
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {PASOS.map((p) => {
        const I = p.icono;
        return (
          <li key={p.titulo} className="flex gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700"
              aria-hidden="true"
            >
              <I size={18} />
            </span>
            <div className="min-w-0">
              <H className="text-sm font-bold text-slate-900">{p.titulo}</H>
              <p className="text-sm text-slate-700">{p.texto}</p>
              <a
                href={p.ruta}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-800 underline-offset-2 hover:underline"
              >
                {p.enlace} →
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Bienvenida() {
  const vista = useBienvenidaVista();
  if (vista) return null;
  return (
    <section
      aria-labelledby="bienvenida"
      className="rounded-xl border-2 bg-white p-4 sm:p-5"
      style={{ borderColor: "#3f6e9f" }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 id="bienvenida" className="text-base font-extrabold text-slate-900">
          Guía rápida
        </h2>
        <button
          type="button"
          onClick={cerrarBienvenida}
          aria-label="Cerrar la guía de bienvenida"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <GuiaDeUso />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={cerrarBienvenida}
          className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-bold text-white"
          style={{ background: "#3f6e9f" }}
        >
          Entendido
        </button>
        <span className="text-xs text-slate-500">
          Puedes volver a verla en «Sobre esta versión».
        </span>
      </div>
    </section>
  );
}
