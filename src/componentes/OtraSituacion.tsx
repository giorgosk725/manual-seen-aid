/* 1.0.9 (22.ª ronda, R1): «‹ Otra situación» también en las tres conductas urgentes (Figura 3,
   Hipoglucemia, Interrupción), como en cada situación. En el ordenador la lista ya está en el
   lateral.
   1.0.13 (25.ª ronda, R1 y adjunto): a la lista de los cuatro, como la barra (antes, filtrada al
   último sistema consultado, que estas pantallas no enseñan: el siguiente paciente puede llevar
   otro). */
import { href } from "../rutas";

export function OtraSituacion() {
  return (
    <a
      href={href("consultar", "situacion")}
      className="chip no-imprimir mb-3 inline-flex lg:hidden"
    >
      ‹ Otra situación
    </a>
  );
}
