/* El mapa de consulta: cuatro bloques, cada uno con la pregunta que responde y sus entradas en
   filas (solo el nombre: la fuente se ve al entrar), y «Leer el capítulo» abajo, a todo lo
   ancho. Es la portada misma: no hay otra pantalla «Consultar». */
import { ArrowRight } from "lucide-react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { CATEGORIA_HEX } from "../tokens";

export function MapaConsulta() {
  const hex = CATEGORIA_HEX.consultar;
  return (
    <section aria-labelledby="mapa-consulta" className="space-y-3">
      {/* Cada bloque dice ya qué ofrece: el título del mapa, solo para lectores de pantalla. */}
      <h2 id="mapa-consulta" className="sr-only">
        Consultar
      </h2>
      <div className="grid gap-2 md:grid-cols-2">
        {MAPA_CONSULTA.map((b) => (
          <section
            key={b.id}
            aria-labelledby={`mapa-${b.id}`}
            className={`rounded-md border bg-white ${b.ancho ? "md:col-span-2" : ""}`}
            style={{ borderColor: "#e6e6e6" }}
          >
            <h3
              id={`mapa-${b.id}`}
              className="px-3 pb-0.5 pt-2 text-xs font-bold uppercase tracking-wide"
              style={{ color: hex.ink }}
            >
              {b.titulo}
            </h3>
            <ul
              className={
                b.ancho ? "divide-y sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0" : "divide-y"
              }
              style={{ borderColor: "#e6e6e6" }}
            >
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
