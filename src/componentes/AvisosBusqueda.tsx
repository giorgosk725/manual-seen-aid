/* Avisos comunes de los tres buscadores (portada, paleta y pantalla Buscar): el atajo por
   cifra de β-OHB, la respuesta del capítulo (`children`) y, encima de la lista, el aviso de que
   se busca con alguna de las palabras. El atajo sobra si la respuesta ya es ese tramo. */
import type { ReactNode } from "react";
import { tramoDeConsulta, type Respuesta } from "../busqueda";
import { AtajoTramo } from "./AtajoTramo";

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
  const tramo = tramoDeConsulta(q);
  return (
    <>
      {tramo && primera?.id !== `F3/${tramo.clave}` && <AtajoTramo consulta={q} />}
      {children}
      {parcial && (
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Ningún resultado tiene todas esas palabras: se muestran los que tienen alguna.
        </p>
      )}
    </>
  );
}
