/* «Cómo funciona» de un sistema (0.77.0): el algoritmo en datos cortos y, si la tiene, su
   variante (Control-IQ+, CamAPS Liberty) con lo que cambia. Una sola línea de fuente, que lleva
   al texto literal de la Tabla 1 y de los apartados. */
import { ALGORITMO, VARIANTE_OPERATIVA, fuentesDeDatos, tipoBajoNombre } from "../fichaOperativa";
import { CORTO_SISTEMA } from "../ampliacion/ids";
import { CasillasDatos, TarjetaDatos } from "./FichaOperativa";
import { FuentePie } from "./FuentePie";
import { NotaCorreccion } from "./NotaCorreccion";
import { NOTA_ADAPTA_OMNIPOD } from "../notas-complementarias";

/* 1.0.11 (23.ª ronda, adjunto): en la ficha entera y en papel, «Qué cambia» de Control-IQ+ remite a
   las secciones que ya dan sus cifras (Indicación, Parámetros, Modos), sin repetirlas; en la
   pestaña «Cómo funciona» sola, con las cifras. */
const QUE_CAMBIA_REMITE =
  "Indicación: edad, peso y DTD; diabetes tipo 2 y gestación (Indicación y material) · basal temporal (Parámetros) · bolo extendido (Modos y funciones)";

export function ComoFuncionaOperativo({ c, completa = false }: { c: number; completa?: boolean }) {
  const variante = VARIANTE_OPERATIVA[c];
  const remite = variante && {
    ...variante,
    datos: variante.datos.map((d) => (d.r === "Qué cambia" ? { ...d, v: QUE_CAMBIA_REMITE } : d)),
  };
  const cambia = variante?.datos.some((d) => d.r === "Qué cambia");
  const fuente = (
    <FuentePie fuentes={fuentesDeDatos([...ALGORITMO[c], ...(variante?.datos ?? [])])} />
  );
  return (
    <div className="space-y-3">
      {/* 0.87.1 (undécima ronda, visual): en papel, la fuente dentro de la última tarjeta, como en
          las demás secciones. */}
      <TarjetaDatos c={c} titulo="Algoritmo" pie={!variante && fuente}>
        {/* 0.99.1 (petición del responsable): «Tipo» sin repetir el nombre del sistema
            («Control-IQ · MPC…» en la ficha de Control-IQ), como en la portada; el nombre propio
            del algoritmo (SmartGuard, SmartAdjust) se queda. */}
        <CasillasDatos
          c={c}
          datos={ALGORITMO[c].map((d, i) =>
            i === 0 ? { ...d, v: tipoBajoNombre(c, CORTO_SISTEMA[c]) } : d,
          )}
        />
      </TarjetaDatos>
      {variante && (!completa || !cambia) && (
        <div className={cambia ? "print:hidden" : undefined}>
          <TarjetaDatos c={c} titulo={variante.titulo} pie={fuente}>
            <CasillasDatos c={c} datos={variante.datos} />
          </TarjetaDatos>
        </div>
      )}
      {remite && cambia && (
        <div className={completa ? undefined : "hidden print:block"}>
          <TarjetaDatos c={c} titulo={remite.titulo} pie={fuente}>
            <CasillasDatos c={c} datos={remite.datos} />
          </TarjetaDatos>
        </div>
      )}
      <div className="print:hidden">{fuente}</div>
      {/* Omnipod 5: el aprendizaje sigue la corrección posterior a la publicación (Tabla 1). */}
      {c === 3 && <NotaCorreccion nota={NOTA_ADAPTA_OMNIPOD} />}
    </div>
  );
}
