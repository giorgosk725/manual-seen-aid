/* Dirección pública de la app y cita de un apartado. Sin React. */
import { CAPITULO, type Apartado } from "./contenido";

/* Dirección pública de la app (mientras se aloje en Cloudflare Pages). */
export const DIRECCION_PUBLICA = "https://manual-seen-aid.pages.dev/";

/* ¿Es una copia de trabajo (localhost, 127.0.0.1 o una vista previa «xxxx.manual-seen-aid.pages.dev»)? */
export const esCopiaDeTrabajo = (host: string) =>
  host === "localhost" ||
  host === "127.0.0.1" ||
  host === "[::1]" ||
  /^[0-9a-f]{8}\.manual-seen-aid\.pages\.dev$/.test(host);

/* Dirección completa de una pantalla de la app. Desde una copia de trabajo se usa la pública. */
export const direccion = (hash: string) => {
  if (typeof window === "undefined") return hash;
  if (esCopiaDeTrabajo(window.location.hostname)) return `${DIRECCION_PUBLICA}${hash}`;
  // Raíz de la app a partir de este módulo (vive en assets/ o en src/): no depende de la
  // dirección por la que se haya entrado (p. ej. /noexiste servido por el service worker).
  return `${new URL(/* @vite-ignore */ "../", import.meta.url).href}${hash}`;
};

const hoy = () =>
  new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

/* Cita del capítulo publicado en el Manual (8-10-2026), con el apartado y sus páginas del PDF. */
export const citaDeApartado = (a: Apartado) => {
  const pags =
    a.paginas[0] === a.paginas[1] ? `p. ${a.paginas[0]}` : `pp. ${a.paginas[0]}–${a.paginas[1]}`;
  return (
    `${CAPITULO.autor
      .split(" ")
      .reverse()
      .join(" ")
      .replace(/^(\S+) (\S)\S*$/, "$1 $2")}. ` +
    `${CAPITULO.titulo}. Apartado ${a.n}: ${a.titulo}, ${pags}. ` +
    `En: ${CAPITULO.obra}. ${CAPITULO.sociedad}; 2026 ` +
    `[actualizado el ${CAPITULO.fechaFuente}; consultado el ${hoy()}]. ISBN ${CAPITULO.isbn}. ` +
    `Disponible en: ${CAPITULO.url}`
  );
};
