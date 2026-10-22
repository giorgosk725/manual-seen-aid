/* 1.0.9 (22.ª ronda, R1): «‹ Otra situación» también en las tres conductas urgentes (Figura 3,
   Hipoglucemia, Interrupción), como en cada situación: a la lista, con el último sistema
   consultado elegido. En el ordenador la lista ya está en el lateral. */
import { href } from "../rutas";
import { sistemaReciente } from "../sistemaReciente";

const SLUG = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];

export function OtraSituacion() {
  const c = sistemaReciente();
  return (
    <a
      href={href("consultar", "situacion", c !== undefined ? `:${SLUG[c]}` : undefined)}
      className="chip no-imprimir mb-3 inline-flex lg:hidden"
    >
      ‹ Otra situación
    </a>
  );
}
