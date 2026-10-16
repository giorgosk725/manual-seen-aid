/* Dos <dl> equilibrados por altura REAL (sistema visual, quinta vuelta): un primer reparto por
   estimación (`peso`) y, una vez montadas, se miden las tarjetas y se recoloca el corte si otro
   deja las dos columnas más igualadas. Los tramos son contiguos: el orden de lectura no cambia,
   y en el móvil (una columna) va un tramo tras otro. Quien lo usa pone la rejilla alrededor. */
import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { repartoEquilibrado } from "../disposicion";

export function DosColumnas<T>({
  items,
  peso,
  render,
}: {
  items: T[];
  /* Altura estimada de cada elemento (en líneas), para el primer reparto. */
  peso: (x: T) => number;
  render: (x: T) => ReactNode;
}) {
  const [reparto, setReparto] = useState(() => repartoEquilibrado(items.map(peso)));
  const ref = useRef<HTMLDivElement>(null);
  // Tras cada pintado: con las alturas reales, el corte que más iguala las dos columnas (solo
  // cambia el estado si es otro, así converge en un segundo pintado).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Las tarjetas, en el orden original, por su posición (data-i) en las dos columnas.
    const alturas: number[] = [];
    el.querySelectorAll<HTMLElement>(":scope > dl > [data-i]").forEach((x) => {
      alturas[Number(x.dataset.i)] = x.offsetHeight + 12;
    });
    if (alturas.length !== items.length || alturas.some((h) => !(h > 12))) return;
    const nuevo = repartoEquilibrado(alturas);
    if (nuevo.some((v, i) => v !== reparto[i])) setReparto(nuevo);
    // Se mide tras cada cambio de elementos o de reparto; converge en un segundo pintado
    // (solo cambia el estado si el reparto es otro).
  }, [items, reparto]);
  const con = items.map((x, i) => ({ x, i }));
  const columnas =
    items.length < 2
      ? [con]
      : [con.filter(({ i }) => !reparto[i]), con.filter(({ i }) => reparto[i])];
  return (
    <>
      {/* Desde sm, en pantalla: las dos columnas equilibradas. */}
      <div ref={ref} className="contents max-sm:hidden print:hidden">
        {columnas.map((columna, k) => (
          <dl key={k} className="space-y-3">
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
          </dl>
        ))}
      </div>
      {/* En una columna (móvil y papel): la lista en su orden. */}
      <dl className="space-y-3 sm:hidden print:!block">{items.map(render)}</dl>
    </>
  );
}
