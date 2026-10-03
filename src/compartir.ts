/* Direcciones para compartir (QR, enlaces) y cita de un apartado. Sin React. */
import { CAPITULO, type Apartado } from "./contenido";
import { VERSION_APP } from "./contenido/cambios";
import { href } from "./rutas";

/* Dirección pública de la app (mientras se aloje en Cloudflare Pages). */
export const DIRECCION_PUBLICA = "https://manual-seen-aid.pages.dev/";

/* ¿Es una copia de trabajo (localhost, 127.0.0.1 o una vista previa «xxxx.manual-seen-aid.pages.dev»)? */
export const esCopiaDeTrabajo = (host: string) =>
  host === "localhost" ||
  host === "127.0.0.1" ||
  host === "[::1]" ||
  /^[0-9a-f]{8}\.manual-seen-aid\.pages\.dev$/.test(host);

/* Dirección completa de una pantalla de la app (para el QR y para compartir). Desde una copia
   de trabajo se usa la pública: una hoja impresa en pruebas no debe llevar a localhost. */
export const direccion = (hash: string) => {
  if (typeof window === "undefined") return hash;
  if (esCopiaDeTrabajo(window.location.hostname)) return `${DIRECCION_PUBLICA}${hash}`;
  return `${window.location.origin}${window.location.pathname}${hash}`;
};

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
