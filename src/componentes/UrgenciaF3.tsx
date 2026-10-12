/* Lo que la Figura 3 dice de la urgencia y los signos de gravedad, citado tal cual de la rama
   roja (contenido/figura3.ts): va antes del selector de ramas, junto a cada rama no roja, en las
   tarjetas de la búsqueda y cuando la búsqueda lleva una cifra de β-OHB. No es una regla nueva:
   es el texto de la figura, por referencia, para que no quede plegado ni detrás de otra rama. */
import { ArrowRight, Siren } from "lucide-react";
import { FIGURA3 } from "../contenido";
import { href } from "../rutas";
import { Texto } from "../texto";

const ROJO = FIGURA3.tramos.find((t) => t.clave === "rojo")!;
const URGENCIA = ROJO.pasos.find((p) => p.icono === "ambulancia")!;
const SIGNOS = ROJO.pasos.find((p) => p.icono === "urgente")!;

export function UrgenciaF3({
  enlace = false,
  className = "",
  donde = "",
}: {
  enlace?: boolean;
  className?: string;
  /* Dónde va (junto a qué rama o tarjeta): el nombre de la región es único en la página. */
  donde?: string;
}) {
  return (
    <section
      aria-label={`Urgencia y signos de gravedad (Figura 3)${donde ? `, ${donde}` : ""}`}
      className={`rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900 ${className}`}
    >
      <p className="flex items-start gap-2 font-bold">
        <Siren size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          {ROJO.rango}: {ROJO.titulo}.
        </span>
      </p>
      <p className="mt-1">
        <Texto>{URGENCIA.texto}</Texto>
      </p>
      <p className="mt-1">
        <Texto>{SIGNOS.texto}</Texto>
      </p>
      <ul className="mt-0.5 list-disc pl-5">
        {(SIGNOS.detalle ?? []).map((d) => (
          <li key={d}>
            <Texto>{d}</Texto>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span>Texto literal de la Figura 3, p. {FIGURA3.pagina}.</span>
        {enlace && (
          <a
            href={href("consultar", "figura-3")}
            className="inline-flex min-h-11 items-center gap-1 font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 sm:min-h-6"
          >
            Hiperglucemia y cetonemia: la figura completa
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        )}
      </p>
    </section>
  );
}
