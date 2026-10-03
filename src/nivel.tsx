/* Nivel de encabezado de los bloques visuales (tablas, figuras, diagramas) según dónde se
   pintan, para que no haya saltos (h1 → h3): en su pantalla propia van tras el h1 (nivel 2);
   en un apartado, al nivel de los subapartados o uno por debajo si ya hay un subapartado. */
import { type CSSProperties, type ReactNode } from "react";
import { useNivelTitulo } from "./nivel-contexto";

export function TituloBloque({
  children,
  className,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const H = `h${useNivelTitulo()}` as "h2" | "h3" | "h4";
  return (
    <H id={id} className={className} style={style}>
      {children}
    </H>
  );
}
