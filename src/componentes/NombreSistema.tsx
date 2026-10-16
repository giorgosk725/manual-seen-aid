/* El nombre de un sistema sin partir «Control-IQ+» por el guion: cada parte entre barras va en
   un tramo que no se parte; la línea solo puede cambiar en la barra. El texto no cambia (el
   nombre accesible y la búsqueda siguen viendo la misma cadena). */
import { Fragment } from "react";

export function NombreSistema({ n, porPalabra = false }: { n: string; porPalabra?: boolean }) {
  // Por palabra (cabeceras de tabla estrechas): la línea puede cambiar en cualquier espacio,
  // pero nunca dentro de «Control-IQ».
  const partes = porPalabra ? n.split(" ") : n.split(" / ");
  const sep = porPalabra ? " " : " / ";
  return (
    <span className="min-w-0">
      {partes.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && sep}
          <span className="whitespace-nowrap">{p}</span>
        </Fragment>
      ))}
    </span>
  );
}
