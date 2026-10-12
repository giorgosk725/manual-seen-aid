/* Módulos que no van en esta edición (decisión del autor, 12-10-2026): los casos guiados y las
   tarjetas de repaso. Su código y sus datos se conservan (src/casos, src/pantallas/Casos.tsx,
   src/repaso.ts, src/pantallas/Repaso.tsx) para una edición siguiente: basta con quitarlos de
   aquí. Mientras estén retirados no salen en el menú, el buscador ni los enlaces, y sus
   direcciones antiguas enseñan un aviso. */
export const RETIRADOS = new Set<string>(["casos", "repaso"]);
export const retirado = (id: string) => RETIRADOS.has(id);

/* Edición editorial (A03): lo que esta edición transmite y guarda. Sin búsqueda por el sentido
   remota (/api/pasajes), sin registro de consultas sin respuesta (/api/sin-respuesta), sin
   búsquedas recientes ni visitas guardadas, y la búsqueda en curso solo en memoria (no en la
   URL). Las Functions del mismo build rechazan esos envíos (functions/api/_edicion.ts). Se
   conservan el modo nocturno, el tamaño de letra, el formato de hoja y la posición de lectura
   del capítulo (rutas canónicas, sin valores clínicos). */
export const EDICION = {
  busquedaRemota: false,
  registroConsultas: false,
  recientes: false,
} as const;

/* Claves locales de la app que contenían búsquedas o criterios (versiones ≤ 0.48): se borran una
   vez al arrancar. Solo claves «mseen:» de esta app; las demás preferencias no se tocan. */
const CON_CONSULTAS = ["mseen:recientes", "mseen:visitas"];
const RUTA_CON_VALORES = /^#\/(buscar|sistemas\/elegir)\/./;

export function migrarPrivacidad(almacen: Storage | undefined = globalThis.localStorage) {
  if (!almacen) return;
  try {
    for (const k of CON_CONSULTAS) almacen.removeItem(k);
    const fav = almacen.getItem("mseen:favoritos");
    if (fav) {
      const lista = JSON.parse(fav) as { ruta?: string }[];
      if (Array.isArray(lista)) {
        const limpia = lista.filter((m) => !RUTA_CON_VALORES.test(m?.ruta ?? ""));
        if (limpia.length !== lista.length)
          almacen.setItem("mseen:favoritos", JSON.stringify(limpia));
      }
    }
    sessionStorage.removeItem("mseen:sin-respuesta");
  } catch {
    /* sin almacenamiento: nada que borrar */
  }
}
