/* El mapa de consulta: cuatro bloques, cada uno con la pregunta que responde y sus entradas en
   filas (nombre y de dónde sale). Es la portada misma: no hay otra pantalla «Consultar». */
import { ArrowRight } from "lucide-react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { CATEGORIA_HEX } from "../tokens";

export function MapaConsulta() {
  const hex = CATEGORIA_HEX.consultar;
  return (
    <section aria-labelledby="mapa-consulta" className="space-y-3">
      <h2
        id="mapa-consulta"
        className="font-display text-lg font-medium uppercase tracking-[0.04em] sm:text-xl"
        style={{ color: hex.ink }}
      >
        Consultar
      </h2>
      <div className="grid gap-2 md:grid-cols-2">
        {MAPA_CONSULTA.map((b) => (
          <section
            key={b.id}
            aria-labelledby={`mapa-${b.id}`}
            className="rounded-md border bg-white"
            style={{ borderColor: "#e6e6e6" }}
          >
            <h3
              id={`mapa-${b.id}`}
              className="px-3 pb-0.5 pt-2 text-xs font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              {b.titulo}
            </h3>
            <ul className="divide-y" style={{ borderColor: "#e6e6e6" }}>
              {b.ids.map((id) => {
                const d = DESTINOS.find((x) => x.id === id)!;
                const I = d.icono;
                return (
                  <li key={id}>
                    <a
                      href={d.href}
                      className="flex min-h-10 items-center gap-3 px-3 py-1.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                    >
                      <I
                        size={16}
                        className="shrink-0"
                        style={{ color: CATEGORIA_HEX[d.cat].strong }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 font-semibold text-slate-900">
                        {d.etiqueta}
                      </span>
                      {d.fuente && (
                        <span className="shrink-0 text-right text-xs text-slate-500">
                          {d.fuente}
                        </span>
                      )}
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
