/* «Guía rápida», en «Sobre esta versión» (voluntaria: la portada ya explica la app con su
   contenido, sin una bienvenida que haya que cerrar). Texto de la app, no del capítulo. */
import { BookOpen, HeartHandshake, Route, Search } from "lucide-react";
import { href } from "../rutas";

const PASOS = [
  {
    icono: Search,
    titulo: "Busca con tus palabras",
    texto:
      "En el buscador de la portada o con la lupa (Ctrl K): «cetonas 1,2», «resonancia con 780G», «cuánto tiempo puedo estar desconectado». Arriba, el pasaje del capítulo que mejor encaja, literal y con su página.",
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
    titulo: "Leer capítulo",
    texto:
      "Los 13 apartados con sus tablas y figuras; la app recuerda dónde lo dejaste. Funciona sin conexión y se puede instalar.",
    ruta: href("capitulo"),
    enlace: "Leer capítulo",
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
