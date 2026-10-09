// Guardia: si hay borradores (src/casos-borrador/) y no es una copia de revisión (REVISION=1),
// la construcción de producción se niega, para que nunca lleguen a la web pública.
// La ejecuta `npm run build` antes de compilar; `npm run build:revision` no pasa por aquí.
import { existsSync } from "node:fs";

const borradores = ["src/casos-borrador", "src/hojas-borrador"].filter((d) => existsSync(d));
if (borradores.length && !process.env.REVISION) {
  console.error(
    `\nHay borradores en ${borradores.join(" y ")}: la construcción de producción se niega.\n` +
      "Copia de revisión: npm run build:revision. Producción: quita o mueve esa carpeta.\n",
  );
  process.exit(1);
}
