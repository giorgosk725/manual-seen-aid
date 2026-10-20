/* «Cómo funciona» de un sistema (0.77.0): el algoritmo en datos cortos y, si la tiene, su
   variante (Control-IQ+, CamAPS Liberty) con lo que cambia. Una sola línea de fuente, que lleva
   al texto literal de la Tabla 1 y de los apartados. */
import { ALGORITMO, VARIANTE_OPERATIVA, fuentesDeDatos } from "../fichaOperativa";
import { CasillasDatos, TarjetaDatos } from "./FichaOperativa";
import { FuentePie } from "./FuentePie";
import { NotaCorreccion } from "./NotaCorreccion";
import { NOTA_ADAPTA_OMNIPOD } from "../notas-complementarias";

export function ComoFuncionaOperativo({ c }: { c: number }) {
  const variante = VARIANTE_OPERATIVA[c];
  const fuente = (
    <FuentePie fuentes={fuentesDeDatos([...ALGORITMO[c], ...(variante?.datos ?? [])])} />
  );
  return (
    <div className="space-y-3">
      {/* 0.87.1 (undécima ronda, visual): en papel, la fuente dentro de la última tarjeta, como en
          las demás secciones. */}
      <TarjetaDatos c={c} titulo="Algoritmo" pie={!variante && fuente}>
        <CasillasDatos c={c} datos={ALGORITMO[c]} />
      </TarjetaDatos>
      {variante && (
        <TarjetaDatos c={c} titulo={variante.titulo} pie={fuente}>
          <CasillasDatos c={c} datos={variante.datos} />
        </TarjetaDatos>
      )}
      <div className="print:hidden">{fuente}</div>
      {/* Omnipod 5: el aprendizaje sigue la corrección posterior a la publicación (Tabla 1). */}
      {c === 3 && <NotaCorreccion nota={NOTA_ADAPTA_OMNIPOD} />}
    </div>
  );
}
