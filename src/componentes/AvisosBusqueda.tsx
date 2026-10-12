/* Avisos comunes de los buscadores (paleta y pantalla Buscar). Si la búsqueda lleva una cifra
   de β-OHB, no se elige ninguna rama de la Figura 3 por la cifra (edición editorial, A01): va
   delante el texto de la figura sobre urgencia y signos de gravedad y el enlace a la figura
   completa, donde la rama se elige a mano. Después, la respuesta del capítulo (`children`) y,
   encima de la lista, el aviso de que se busca con alguna de las palabras (solo si no hay ya una
   respuesta del capítulo: entonces el aviso distrae). */
import type { ReactNode } from "react";
import { tramoDeConsulta, type Respuesta } from "../busqueda";
import { UrgenciaF3 } from "./UrgenciaF3";

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
  return (
    <>
      {tramoDeConsulta(q) && <UrgenciaF3 enlace className="mt-2" />}
      {children}
      {parcial && !primera && (
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Ningún resultado tiene todas esas palabras: se muestran los que tienen alguna.
        </p>
      )}
    </>
  );
}
