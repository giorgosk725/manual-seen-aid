/* Avisos comunes de los buscadores (paleta y pantalla Buscar). Si la búsqueda lleva una cifra
   de β-OHB, no se elige ninguna rama de la Figura 3 por la cifra (edición editorial, A01): va
   delante el texto de la figura sobre urgencia y signos de gravedad y el enlace a la figura
   completa, donde la rama se elige a mano. Después, la respuesta del capítulo (`children`) y,
   encima de la lista, el aviso de que se busca con alguna de las palabras (solo si no hay ya una
   respuesta del capítulo: entonces el aviso distrae). */
import type { ReactNode } from "react";
import { FIGURA3 } from "../contenido";
import { href } from "../rutas";
import { TRAMO_HEX } from "../tokens";
import { tramoDeConsulta, type Respuesta } from "../busqueda";
import { ArrowRight } from "lucide-react";

/* 0.72.0: los cuatro tramos de la figura, iguales y sin ninguno marcado: la rama la elige quien
   consulta (A01), a un toque. */
function TramosF3() {
  return (
    <ul aria-label="Tramos de la Figura 3" className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {FIGURA3.tramos.map((t) => {
        const h = TRAMO_HEX[t.clave];
        return (
          <li key={t.clave}>
            <a
              href={href("consultar", "figura-3", t.clave)}
              className="flex h-full min-h-11 flex-col justify-center rounded-lg border px-2.5 py-1.5 text-xs leading-tight transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              style={{ borderColor: h.border, background: h.soft, color: h.ink }}
            >
              <span className="font-extrabold">{t.rango}</span>
              <span className="mt-0.5 font-semibold">{t.titulo}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function AvisosBusqueda({
  q,
  parcial,
  primera,
  children,
}: {
  q: string;
  parcial?: boolean;
  primera?: Respuesta;
  children?: ReactNode;
}) {
  const conCifra = !!tramoDeConsulta(q);
  return (
    <>
      {/* 0.72.1 (decisión del responsable): sin el recuadro de urgencia; los cuatro tramos (con
          el de ≥3,0 o signos de gravedad) y la figura completa, sin elegir ninguno (A01). */}
      {conCifra && (
        <p className="mt-2 text-sm">
          <a
            href={href("consultar", "figura-3")}
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-slate-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-6"
          >
            Hiperglucemia y cetonemia: la figura completa
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        </p>
      )}
      {conCifra && <TramosF3 />}
      {children}
      {parcial && !primera && (
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Ningún resultado tiene todas esas palabras: se muestran los que tienen alguna.
        </p>
      )}
    </>
  );
}
