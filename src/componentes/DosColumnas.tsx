/* Dos <dl> equilibrados por altura REAL (sistema visual, quinta vuelta): un primer reparto por
   estimación (`peso`) y, una vez montadas, se miden las tarjetas y se recoloca el corte si otro
   deja las dos columnas más igualadas. Los tramos son contiguos: el orden de lectura no cambia,
   y en el móvil (una columna) va un tramo tras otro. Quien lo usa pone la rejilla alrededor.
   Sexta y séptima vueltas: si aun así el pie de las columnas queda desigual, una o dos tarjetas
   pueden ir a todo lo ancho debajo de las dos columnas, cerrando la sección: la última o, si con
   ella las columnas quedan más parejas, la más alta (es la que no deja equilibrar ningún corte
   contiguo). Solo cuando cada paso iguala las columnas en más de una línea (24 px). La decisión se toma
   una vez, con las alturas medidas en dos columnas, y no se revisa (así no oscila: a todo lo
   ancho la tarjeta es más baja). Quien cambia los elementos pone una `key` nueva. */
import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { repartoEquilibrado, repartoLibre } from "../disposicion";

/* Diferencia de altura entre las dos columnas de un reparto. */
const desigualdad = (alturas: number[], segunda: boolean[]) =>
  Math.abs(alturas.reduce((d, h, i) => d + (segunda[i] ? -h : h), 0));

/* El reparto de los demás, puesto en la lista completa (las anchas, en ninguna columna). */
const conAnchas = (segunda: boolean[], anchas: number[], n: number) => {
  let k = 0;
  return Array.from({ length: n }, (_, i) => (anchas.includes(i) ? false : segunda[k++]));
};

export function DosColumnas<T>({
  items,
  peso,
  render,
  etiqueta: Col = "dl",
  desde = "sm",
  orden = "contiguo",
}: {
  items: T[];
  /* Altura estimada de cada elemento (en líneas), para el primer reparto. */
  peso: (x: T) => number;
  render: (x: T) => ReactNode;
  /* Etiqueta de cada columna (dl para pares dt/dd; div para secciones). */
  etiqueta?: "dl" | "div";
  /* Desde qué anchura hay dos columnas (por debajo, la lista en su orden). */
  desde?: "sm" | "lg";
  /* "contiguo" (por defecto): dos tramos en el orden de la lista. "libre": solo para grupos
     independientes sin orden de tabla que mantener. */
  orden?: "contiguo" | "libre";
}) {
  const [reparto, setReparto] = useState<{ segunda: boolean[]; anchas: number[] }>(() => ({
    segunda: (orden === "libre" ? repartoLibre : repartoEquilibrado)(items.map(peso)),
    anchas: [],
  }));
  const ref = useRef<HTMLDivElement>(null);
  // Tras cada pintado: con las alturas reales, el corte que más iguala las dos columnas (solo
  // cambia el estado si es otro, así converge en un segundo pintado).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const repartir = orden === "libre" ? repartoLibre : repartoEquilibrado;
    // Las tarjetas, en el orden original, por su posición (data-i) en las columnas.
    const alturas: number[] = [];
    el.querySelectorAll<HTMLElement>(":scope > * > [data-i]").forEach((x) => {
      alturas[Number(x.dataset.i)] = x.offsetHeight + 12;
    });
    const n = items.length;
    if (alturas.length !== n || alturas.some((h) => !(h > 12))) return;
    const sin = (idx: number[]) => alturas.filter((_, k) => !idx.includes(k));
    let anchas = reparto.anchas.filter((i) => i < n);
    let segunda: boolean[];
    if (anchas.length) {
      // Ya hay anchas: solo se recoloca el corte de las demás (su altura, medida ancha, ya no
      // vale para compararla).
      segunda = conAnchas(repartir(sin(anchas)), anchas, n);
    } else {
      segunda = repartir(alturas);
      let dif = desigualdad(alturas, segunda);
      // Hasta dos tarjetas a lo ancho, de una en una, mientras queden al menos dos en columnas.
      // Candidatas: la última (cierra la sección sin mover nada) y la más alta de las que quedan;
      // cada paso ha de mejorar en más de una línea a lo que haya.
      while (orden === "contiguo" && anchas.length < 2 && n - anchas.length >= 3) {
        const quedan = alturas.map((h, i) => ({ h, i })).filter(({ i }) => !anchas.includes(i));
        const ultima = quedan[quedan.length - 1].i;
        const masAlta = quedan.reduce((m, x) => (x.h > m.h ? x : m), quedan[0]).i;
        let mejor: { i: number; s: boolean[] } | null = null;
        for (const i of masAlta === ultima ? [ultima] : [ultima, masAlta]) {
          const idx = [...anchas, i];
          const resto = sin(idx);
          const s = repartir(resto);
          const d = desigualdad(resto, s);
          if (d + 24 < dif) {
            dif = d;
            mejor = { i, s };
          }
        }
        if (!mejor) break;
        anchas = [...anchas, mejor.i].sort((a, b) => a - b);
        segunda = conAnchas(mejor.s, anchas, n);
      }
    }
    if (
      anchas.length !== reparto.anchas.length ||
      anchas.some((v, i) => v !== reparto.anchas[i]) ||
      segunda.some((v, i) => v !== reparto.segunda[i])
    )
      setReparto({ segunda, anchas });
  }, [items, reparto, orden]);
  const con = items.map((x, i) => ({ x, i }));
  // 1.0.12: solo las anchas que siguen en la lista (al filtrar Situaciones quedaban menos
  // elementos que el reparto anterior y la pantalla fallaba hasta el siguiente pintado).
  const anchasVigentes = reparto.anchas.filter((i) => i < items.length);
  const enColumnas = con.filter(({ i }) => !anchasVigentes.includes(i));
  // Las anchas conservan su sitio en el orden de lectura: las que van antes que todo lo que queda
  // en columnas se ponen encima; las demás, debajo.
  const primera = enColumnas.length ? enColumnas[0].i : -1;
  const arriba = anchasVigentes.filter((i) => i < primera).map((i) => con[i]);
  const abajo = anchasVigentes.filter((i) => i > primera).map((i) => con[i]);
  const columnas: { ancha: boolean; tarjetas: typeof con }[] =
    items.length < 2
      ? [{ ancha: false, tarjetas: con }]
      : [
          ...(arriba.length ? [{ ancha: true, tarjetas: arriba }] : []),
          { ancha: false, tarjetas: enColumnas.filter(({ i }) => !reparto.segunda[i]) },
          { ancha: false, tarjetas: enColumnas.filter(({ i }) => reparto.segunda[i]) },
          ...(abajo.length ? [{ ancha: true, tarjetas: abajo }] : []),
        ];
  return (
    <>
      {/* Desde sm, en pantalla: las dos columnas equilibradas y, si las hay, las anchas encima o
          debajo según su orden. */}
      <div
        ref={ref}
        className={`contents print:hidden ${desde === "lg" ? "max-lg:hidden" : "max-sm:hidden"}`}
      >
        {columnas.map(({ ancha, tarjetas: columna }, k) => (
          <Col key={k} className={`space-y-3 ${ancha ? "col-span-full" : ""}`}>
            {columna.map(({ x, i }) => {
              // La posición va en la propia tarjeta (en un <dl> solo caben dt, dd y div sin anidar).
              const el = render(x);
              return isValidElement(el)
                ? cloneElement(el as React.ReactElement<Record<string, unknown>>, {
                    key: i,
                    "data-i": i,
                  })
                : el;
            })}
          </Col>
        ))}
      </div>
      {/* En una columna (móvil y papel): la lista en su orden. */}
      <Col className={`space-y-3 print:!block ${desde === "lg" ? "lg:hidden" : "sm:hidden"}`}>
        {items.map(render)}
      </Col>
    </>
  );
}
