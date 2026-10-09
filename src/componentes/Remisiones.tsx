/* Texto literal de un párrafo o lista del capítulo con dos cosas pulsables, sin cambiar el
   texto: las remisiones internas («v. Tabla 5», «(Figura 2)», «la figura 3», «v. «Interrupción
   del sistema y pauta alternativa»») llevan al sitio exacto del capítulo, y las siglas que se
   le pasen (su primera aparición en el apartado, siglas.ts) enseñan su desarrollo del
   glosario. Solo en los párrafos y listas del capítulo (nunca dentro de otro enlace). */
import { Fragment } from "react";
import { PATRON_REMISION, destinoDeRemision } from "../remisiones";
import { trocear } from "../marcado";
import { Trozos } from "../texto";
import { partirSiglas, type TrozoSigla } from "../siglas";

export function TextoConRemisiones({
  children,
  siglas,
}: {
  children: string;
  siglas?: readonly string[];
}) {
  const partes = children.split(PATRON_REMISION);
  // Las siglas pendientes de marcar en este texto (solo su primera aparición), consumidas en
  // una sola pasada por todos los trozos: el mismo resultado en cada render.
  const pendientes = new Set(siglas ?? []);
  const conSiglas = (texto: string): TrozoSigla[] =>
    trocear(texto).flatMap((tr) =>
      partirSiglas(tr.t, pendientes).map((x) => ({ ...tr, t: x.t, sigla: x.sigla })),
    );
  if (partes.length === 1) return <Trozos trozos={conSiglas(children)} />;
  return (
    <>
      {partes.map((p, i) => {
        if (i % 2 === 0) return p ? <Trozos key={i} trozos={conSiglas(p)} /> : null;
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
