/* Módulos que no van en esta edición (decisión del autor, 12-10-2026): los casos guiados y las
   tarjetas de repaso; y, en la edición editorial (A06), la ampliación técnica de cada sistema
   (src/ampliacion: sus datos se conservan, pero no salen en fichas, tarjetas ni búsqueda). Su código y sus datos se conservan (src/casos, src/pantallas/Casos.tsx,
   src/repaso.ts, src/pantallas/Repaso.tsx) para una edición siguiente: basta con quitarlos de
   aquí. Mientras estén retirados no salen en el menú, el buscador ni los enlaces, y sus
   direcciones antiguas enseñan un aviso. */
/* Constantes del build (V50-11): con `false`, las pantallas y los datos de casos y repaso no
   entran en el paquete publicado (sus importaciones quedan como código muerto). */
export const CON_CASOS: boolean = false;
export const CON_REPASO: boolean = false;
/* La ampliación técnica (V54-12): sin ella, sus datos clínicos tampoco entran en el paquete. */
export const CON_AMPLIACION: boolean = false;
/* La pantalla administrativa de consultas sin respuesta (V54-12), fuera del build público. */
export const CON_CONSULTAS_ADMIN: boolean = false;
export const RETIRADOS = new Set<string>([
  ...(CON_CASOS ? [] : ["casos"]),
  ...(CON_REPASO ? [] : ["repaso"]),
  ...(CON_AMPLIACION ? [] : ["ampliacion"]),
]);
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

/* El almacenamiento del navegador, si se puede tocar: en algunos contextos el simple acceso a
   `localStorage` o `sessionStorage` lanza (SecurityError); entonces no hay nada que limpiar. */
const almacenSeguro = (cual: "localStorage" | "sessionStorage"): Storage | undefined => {
  try {
    return globalThis[cual];
  } catch {
    return undefined;
  }
};

/* Cada operación por separado: una clave ilegible o un almacenamiento bloqueado no impiden
   limpiar las demás ni, sobre todo, arrancar la app (se llama antes de montar React). */
const intentar = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* esa clave no se ha podido limpiar: se sigue con las demás */
  }
};

export function migrarPrivacidad(
  almacen: Storage | undefined = almacenSeguro("localStorage"),
  sesion: Storage | undefined = almacenSeguro("sessionStorage"),
) {
  if (almacen) {
    for (const k of CON_CONSULTAS) intentar(() => almacen.removeItem(k));
    intentar(() => {
      const fav = almacen.getItem("mseen:favoritos");
      if (!fav) return;
      let lista: unknown;
      try {
        lista = JSON.parse(fav);
      } catch {
        // Ilegible: no se sabe qué guarda, así que se quita (son atajos de la app, nada más).
        almacen.removeItem("mseen:favoritos");
        return;
      }
      if (!Array.isArray(lista)) return;
      const limpia = lista.filter(
        (m) => !RUTA_CON_VALORES.test((m as { ruta?: string } | null)?.ruta ?? ""),
      );
      if (limpia.length !== lista.length)
        almacen.setItem("mseen:favoritos", JSON.stringify(limpia));
    });
  }
  if (sesion) intentar(() => sesion.removeItem("mseen:sin-respuesta"));
}
