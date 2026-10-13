/* El mapa de consulta: cuatro bloques, cada uno con la pregunta que responde y sus entradas en
   filas (solo el nombre: la fuente se ve al entrar). La lectura va aparte, antes, en su propia
   región de la portada y con este mismo formato (V54-07). Es la portada misma: no hay otra pantalla «Consultar». */
import { ArrowRight } from "lucide-react";
import { DESTINOS, MAPA_CONSULTA } from "../nav";
import { CATEGORIA_HEX } from "../tokens";

export function MapaConsulta() {
  const hex = CATEGORIA_HEX.consultar;
  return (
    <section aria-labelledby="mapa-consulta">
      {/* Cada bloque dice ya qué ofrece: el título del mapa, solo para lectores de pantalla. */}
      <h2 id="mapa-consulta" tabIndex={-1} className="sr-only scroll-mt-24">
        Consultar
      </h2>
      {/* Con la barra lateral (desde 768 px), una columna hasta que hay ancho para dos (V54-08). */}
      <div className="grid gap-2 lg:grid-cols-2">
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
                b.ancho
                  ? `divide-y sm:grid sm:divide-x sm:divide-y-0 ${b.ids.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`
                  : "divide-y"
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
                      className="flex min-h-11 items-center gap-3 px-3 py-1.5 text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
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
