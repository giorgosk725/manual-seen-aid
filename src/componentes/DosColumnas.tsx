/* Dos <dl> equilibrados por altura REAL (sistema visual, quinta vuelta): un primer reparto por
   estimación (`peso`) y, una vez montadas, se miden las tarjetas y se recoloca el corte si otro
   deja las dos columnas más igualadas. Los tramos son contiguos: el orden de lectura no cambia,
   y en el móvil (una columna) va un tramo tras otro. Quien lo usa pone la rejilla alrededor.
   Sexta vuelta: si aun así el pie de las columnas queda desigual, la última tarjeta puede ir a
   todo lo ancho (debajo de las dos columnas, cerrando la sección) cuando con ello las columnas
   quedan bastante más igualadas; la decisión se toma una vez, con las alturas medidas en dos
   columnas, y no se revisa (así no oscila: a todo lo ancho la tarjeta es más baja). Quien cambia
   los elementos pone una `key` nueva. */
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
     independientes sin orden de tabla que mantener (Situaciones). */
  orden?: "contiguo" | "libre";
}) {
  const [reparto, setReparto] = useState<{ segunda: boolean[]; ancha: boolean }>(() => ({
    segunda: (orden === "libre" ? repartoLibre : repartoEquilibrado)(items.map(peso)),
    ancha: false,
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
    if (alturas.length !== items.length || alturas.some((h) => !(h > 12))) return;
    // Con la última a todo lo ancho, solo se recoloca el corte de las demás (su altura, medida
    // ancha, ya no vale para compararla).
    let segunda = repartir(reparto.ancha ? alturas.slice(0, -1) : alturas);
    let ancha = reparto.ancha;
    if (!ancha && orden === "contiguo" && alturas.length >= 3) {
      const sinUltima = repartir(alturas.slice(0, -1));
      // A todo lo ancho solo si las columnas quedan claramente más igualadas (una línea).
      if (desigualdad(alturas.slice(0, -1), sinUltima) + 24 < desigualdad(alturas, segunda)) {
        ancha = true;
        segunda = sinUltima;
      }
    }
    if (ancha) segunda = [...segunda, false];
    if (ancha !== reparto.ancha || segunda.some((v, i) => v !== reparto.segunda[i]))
      setReparto({ segunda, ancha });
  }, [items, reparto, orden]);
  const con = items.map((x, i) => ({ x, i }));
  const enColumnas = reparto.ancha ? con.slice(0, -1) : con;
  const columnas =
    items.length < 2
      ? [con]
      : [
          enColumnas.filter(({ i }) => !reparto.segunda[i]),
          enColumnas.filter(({ i }) => reparto.segunda[i]),
          ...(reparto.ancha ? [con.slice(-1)] : []),
        ];
  return (
    <>
      {/* Desde sm, en pantalla: las dos columnas equilibradas y, si la hay, la última a lo ancho. */}
      <div
        ref={ref}
        className={`contents print:hidden ${desde === "lg" ? "max-lg:hidden" : "max-sm:hidden"}`}
      >
        {columnas.map((columna, k) => (
          <Col key={k} className={`space-y-3 ${k === 2 ? "col-span-full" : ""}`}>
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
