/* Direcciones para compartir (QR, enlaces) y cita de un apartado. Sin React. */
import { CAPITULO, type Apartado } from "./contenido";
import { VERSION_APP } from "./contenido/cambios";
import { href } from "./rutas";

/* Dirección completa de una pantalla de la app (para el QR y para compartir). */
export const direccion = (hash: string) =>
  typeof window === "undefined"
    ? hash
    : `${window.location.origin}${window.location.pathname}${hash}`;

const hoy = () =>
  new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

export const citaDeApartado = (a: Apartado) => {
  const pags =
    a.paginas[0] === a.paginas[1] ? `p. ${a.paginas[0]}` : `pp. ${a.paginas[0]}-${a.paginas[1]}`;
  return (
    `${CAPITULO.autor
      .split(" ")
      .reverse()
      .join(" ")
      .replace(/^(\S+) (\S)\S*$/, "$1 $2")}. ` +
    `${CAPITULO.titulo}. Apartado ${a.n}: ${a.titulo}, ${pags}. ` +
    `En: Manual SEEN. ${CAPITULO.sociedad}; 2026. ` +
    `Versión web Manual SEEN · AID ${VERSION_APP} [consultado el ${hoy()}]. ` +
    `Disponible en: ${direccion(href("capitulo", a.slug))}`
  );
};
