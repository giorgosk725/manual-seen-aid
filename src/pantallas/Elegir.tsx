/* Explorar criterios de elección (#/sistemas/elegir): una consulta descriptiva, no un evaluador
   (edición editorial, A02). Enseña los factores de la elección del apartado 6 y la Figura 2 y,
   para cada sistema en el orden fijo de la Tabla 1, sus celdas literales de indicación,
   gestación, formato, sensores y localización del algoritmo. No hay datos de la persona (edad,
   peso, dosis), ni recuento, ni orden por compatibilidad, ni etiquetas de aptitud: las
   condiciones por variante y ámbito (CE, FDA, Europa, EE. UU.) quedan en sus celdas, tal cual.
   El explorador anterior por criterios (eleccion.ts) se conserva fuera de esta edición; una
   dirección antigua con criterios abre esta consulta y no reutiliza ni guarda sus valores. */
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { APARTADOS, F2, TABLAS, rutaDeTabla } from "../contenido";
import { elegirRuta, href } from "../rutas";
import { CabeceraEditorial } from "../ui";
import { Texto } from "../texto";
import { CATEGORIA_HEX } from "../tokens";
import { FuentePie } from "../componentes/FuentePie";
import { paginasDe } from "../paginas";

const hex = CATEGORIA_HEX.consultar;

const enlace =
  "inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline sm:min-h-8";

export function Elegir({ antigua = false }: { antigua?: boolean }) {
  // Dirección antigua con criterios (#/sistemas/elegir/edad=…): se sustituye por la de la
  // consulta, sin los valores, y no se guardan.
  useEffect(() => {
    if (antigua) elegirRuta("sistemas", "elegir");
  }, [antigua]);
  const a6 = APARTADOS.find((a) => a.slug === "06-indicaciones")!;
  const b5 = a6.bloques[4];
  const T1 = TABLAS.T1;
  const pT1 = paginasDe(T1.paginas[0], T1.paginas[1]);
  const perfil = F2.cajas[0];
  const sistema = F2.cajas[2];
  return (
    <div>
      <div className="no-imprimir mb-2 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={href("sistemas")}
          className="inline-flex min-h-11 items-center font-semibold hover:underline"
        >
          Sistemas AID
        </a>
        <span aria-hidden="true">›</span>
        <span>Cómo elegir un sistema</span>
      </div>
      <CabeceraEditorial titulo="Cómo elegir un sistema" hex={hex} level={1} />

      <section
        aria-label="Lo que dice el capítulo sobre la elección"
        className="prosa rounded-2xl border bg-white p-4"
        style={{ borderColor: "#e6e6e6" }}
      >
        <p className="text-sm">{b5.t === "p" && <Texto>{b5.texto}</Texto>}</p>
        <a href={href("capitulo", a6.slug, "b5")} className={enlace}>
          Apartado 6, p. 6 · Leer en el capítulo <ArrowRight size={13} aria-hidden="true" />
        </a>
      </section>

      <section aria-labelledby="factores-f2" className="mt-4">
        <h2 id="factores-f2" className="font-display text-lg font-semibold text-slate-900">
          Factores de la Figura 2
        </h2>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {[perfil, sistema].map((caja) => (
            <div
              key={caja.titulo}
              className="rounded-xl border bg-white p-3"
              style={{ borderColor: "#e6e6e6" }}
            >
              <h3 className="text-sm font-bold text-slate-900">{caja.titulo}</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                {caja.items.map((it) => (
                  <li key={it}>
                    <Texto>{it}</Texto>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 0.70.0: sin la repetición de las celdas de la Tabla 1; se comparan en Sistemas. */}
      <a href={href("sistemas", "todos", "esencial")} className={`mt-4 ${enlace}`}>
        Comparar los cuatro en la Tabla 1 <ArrowRight size={13} aria-hidden="true" />
      </a>
      <section className="mt-2">
        <FuentePie
          fuentes={[
            { texto: `Tabla 1, ${pT1}`, ruta: rutaDeTabla("T1") ?? href("tablas", "T1") },
            { texto: "Apartado 6, p. 6", ruta: href("capitulo", "06-indicaciones") },
            { texto: `Figura 2, p. ${F2.pagina}`, ruta: href("visual", "figuras") },
          ]}
        />
      </section>
    </div>
  );
}
