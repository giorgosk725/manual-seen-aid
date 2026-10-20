/* Un texto complementario (src/notas-complementarias.ts): rotulado como tal, con borde
   discontinuo como las notas, y con su propia línea de fuente (no es del capítulo). */
import type { Complemento } from "../notas-complementarias";

export function ComplementoVista({ complemento: k }: { complemento: Complemento }) {
  return (
    <section
      aria-label={k.titulo}
      className="mt-3 rounded-xl border border-dashed border-slate-300 p-3 print:break-inside-auto"
    >
      <h3 className="text-[15px] font-bold text-slate-900">{k.titulo}</h3>
      <p className="mt-0.5 text-xs text-slate-600">{k.aviso}</p>
      {/* Una columna: va en la columna de detalle de Situaciones, que es estrecha. */}
      <div className="mt-2 space-y-3">
        {k.grupos.map((g) => (
          <div
            key={g.rotulo}
            className={`min-w-0 ${g.dentro ? "ml-1 border-l-2 border-slate-200 pl-3" : ""}`}
          >
            <h4 className="rotulo">{g.rotulo}</h4>
            <ul className="mt-1 space-y-1 text-[15px] leading-snug text-slate-900">
              {g.filas.map((f) => (
                <li key={f.texto}>
                  {f.etiqueta && <span className="font-semibold">{f.etiqueta}: </span>}
                  {f.texto}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* 0.88.1 (duodécima ronda, senior): sin partir por el guion «Control-IQ» ni «MAT-2075_1». */}
      <p className="fuente-pie mt-3">
        Fuente:{" "}
        {k.fuente.split(/(\S+-\S+)/).map((x, i) =>
          i % 2 ? (
            <span key={i} className="whitespace-nowrap">
              {x}
            </span>
          ) : (
            x
          ),
        )}
      </p>
    </section>
  );
}
