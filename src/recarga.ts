/* Recuperación ante un trozo de código que no llega (pantalla perezosa, índice de búsqueda):
   pasa si la red se cortó antes de tenerlo o si una pestaña abierta durante un despliegue
   pide trozos que ya no existen. La salida es recargar UNA vez (el navegador recuerda el
   import fallido de esa dirección, así que reintentar sin recargar no sirve). La marca en
   sessionStorage evita un bucle de recargas; se borra cuando la app lleva un rato en pie. */
const MARCA = "mseen:recargada-por-trozo";

export const esFalloDeTrozo = (e: unknown) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported|Failed to fetch dynamically/i.test(
    String((e as { message?: string } | null)?.message ?? e),
  );

/* Recarga una vez; devuelve false si ya se recargó por esto en esta pestaña. */
export function recargarUnaVez(): boolean {
  try {
    if (sessionStorage.getItem(MARCA)) return false;
    sessionStorage.setItem(MARCA, String(Date.now()));
  } catch {
    /* sin almacenamiento: se recarga igual (como mucho una vez por carga de página) */
  }
  window.location.reload();
  return true;
}

/* Llamar al arrancar: si la app aguanta 10 s, la marca deja de hacer falta. */
export function limpiarMarcaDeRecarga() {
  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(MARCA);
    } catch {
      /* nada que limpiar */
    }
  }, 10_000);
}
