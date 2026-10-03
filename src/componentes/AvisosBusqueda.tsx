/* Avisos comunes de los tres buscadores (portada, paleta y pantalla Buscar): el atajo por
   cifra de β-OHB y el aviso de que se busca con alguna de las palabras. */
import { tramoDeConsulta } from "../busqueda";
import { AtajoTramo } from "./AtajoTramo";

export function AvisosBusqueda({ q, parcial }: { q: string; parcial?: boolean }) {
  return (
    <>
      {tramoDeConsulta(q) && <AtajoTramo consulta={q} />}
      {parcial && (
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Ningún texto tiene todas esas palabras: se muestran los que tienen alguna.
        </p>
      )}
    </>
  );
}
