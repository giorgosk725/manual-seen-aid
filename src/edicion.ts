/* Módulos que no van en esta edición (decisión del autor, 12-10-2026): los casos guiados y las
   tarjetas de repaso. Su código y sus datos se conservan (src/casos, src/pantallas/Casos.tsx,
   src/repaso.ts, src/pantallas/Repaso.tsx) para una edición siguiente: basta con quitarlos de
   aquí. Mientras estén retirados no salen en el menú, el buscador ni los enlaces, y sus
   direcciones antiguas enseñan un aviso. */
export const RETIRADOS = new Set<string>(["casos", "repaso"]);
export const retirado = (id: string) => RETIRADOS.has(id);
