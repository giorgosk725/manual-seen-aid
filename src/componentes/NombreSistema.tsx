/* El nombre de un sistema sin partir «Control-IQ+» por el guion: cada parte entre barras va en
   un tramo que no se parte; la línea solo puede cambiar en la barra. El texto no cambia (el
   nombre accesible y la búsqueda siguen viendo la misma cadena). */
import { Fragment } from "react";

export function NombreSistema({ n }: { n: string }) {
  const partes = n.split(" / ");
  return (
    <span className="min-w-0">
      {partes.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && " / "}
          <span className="whitespace-nowrap">{p}</span>
        </Fragment>
      ))}
    </span>
  );
}
