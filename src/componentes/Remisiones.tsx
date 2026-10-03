/* Remisiones internas del capítulo como enlaces: «v. Tabla 5», «(Figura 2)», «la figura 3»,
   «v. «Interrupción del sistema y pauta alternativa»». El texto no cambia (es el literal del
   capítulo); solo se vuelve pulsable y lleva al sitio exacto del capítulo donde está la tabla,
   la figura o el subapartado. Solo en los párrafos y listas del capítulo (nunca dentro de
   otro enlace). */
import { Fragment } from "react";
import { PATRON_REMISION, destinoDeRemision } from "../remisiones";
import { Texto } from "../texto";

export function TextoConRemisiones({ children }: { children: string }) {
  const partes = children.split(PATRON_REMISION);
  if (partes.length === 1) return <Texto>{children}</Texto>;
  return (
    <>
      {partes.map((p, i) => {
        if (i % 2 === 0) return p ? <Texto key={i}>{p}</Texto> : null;
        const destino = destinoDeRemision(p);
        if (!destino) return <Fragment key={i}>{p}</Fragment>;
        return (
          <a key={i} href={destino} className="remision">
            {p}
          </a>
        );
      })}
    </>
  );
}
