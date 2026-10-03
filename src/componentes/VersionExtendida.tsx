/* Capa «Versión extendida del autor · no publicada en el Manual»: fragmentos aprobados de los
   borradores de mayo, plegados y en ámbar, siempre separados del texto literal del capítulo. */
import { FileClock } from "lucide-react";
import {
  BORRADORES,
  ROTULO_EXTENDIDA,
  type FragmentoExtendido,
  type ParteExtendida,
} from "../extendida";

function Origen({ f }: { f: FragmentoExtendido }) {
  const borradores = [
    ...new Set(f.partes.filter((p): p is ParteExtendida => !!p).map((p) => p.borrador)),
  ];
  return (
    <p className="mt-1.5 text-xs text-amber-900">
      {borradores
        .map((b) => `Borrador ${BORRADORES[b].nombre} · ${BORRADORES[b].fecha}`)
        .join(" + ")}
      {" · "}En el capítulo publicado: {f.relacion}
    </p>
  );
}

export function FragmentoVista({ f, nivel = 4 }: { f: FragmentoExtendido; nivel?: 2 | 3 | 4 }) {
  const H = `h${nivel}` as "h2" | "h3" | "h4";
  return (
    <li id={`ext-${f.id}`} className="scroll-mt-24">
      <H className="text-sm font-bold text-amber-900">{f.titulo}</H>
      <div className="mt-1 space-y-1.5">
        {f.partes.map((p, i) =>
          p ? (
            <div key={i}>
              {p.contexto && (
                <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                  {p.contexto}
                </span>
              )}
              <p className="texto-extendido text-[15px] leading-relaxed text-slate-800">
                {p.texto}
              </p>
            </div>
          ) : (
            <p
              key={i}
              className="text-sm text-amber-800"
              title="Frase del borrador omitida porque cambió en la versión publicada"
            >
              […]
            </p>
          ),
        )}
      </div>
      <Origen f={f} />
    </li>
  );
}

export function VersionExtendida({
  fragmentos,
  abierta = false,
  id,
  nivel = 4,
}: {
  fragmentos: FragmentoExtendido[];
  abierta?: boolean;
  id?: string;
  /* Nivel del título de cada fragmento según dónde va (sin saltos de encabezado). */
  nivel?: 2 | 3 | 4;
}) {
  if (!fragmentos.length) return null;
  return (
    <details
      id={id}
      open={abierta || undefined}
      className="extendida no-imprimir group scroll-mt-24 rounded-2xl border border-amber-200 bg-amber-50"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-2xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800"
        >
          <FileClock size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-amber-900">{ROTULO_EXTENDIDA}</span>
          <span className="block text-xs text-amber-900">
            {fragmentos.length === 1
              ? "1 fragmento del borrador de mayo de 2026"
              : `${fragmentos.length} fragmentos del borrador de mayo de 2026`}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-xs font-semibold text-amber-800 group-open:hidden"
        >
          Ver
        </span>
        <span
          aria-hidden="true"
          className="hidden shrink-0 text-xs font-semibold text-amber-800 group-open:inline"
        >
          Ocultar
        </span>
      </summary>
      <div className="border-t border-amber-200 px-4 pb-4 pt-3">
        <p className="text-xs leading-relaxed text-amber-900">
          Texto del autor que no entró en el capítulo por espacio. No forma parte del Manual SEEN ni
          lo sustituye: si algo no coincide, manda el texto publicado. «[…]» marca una frase de los
          borradores que cambió en la versión publicada.
        </p>
        <ul className="mt-3 space-y-4">
          {fragmentos.map((f) => (
            <FragmentoVista key={f.id} f={f} nivel={nivel} />
          ))}
        </ul>
      </div>
    </details>
  );
}
