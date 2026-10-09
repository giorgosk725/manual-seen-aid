// Guardia: si hay borradores (src/casos-borrador/) y no es una copia de revisión (REVISION=1),
// la construcción de producción se niega, para que nunca lleguen a la web pública.
// La ejecuta `npm run build` antes de compilar; `npm run build:revision` no pasa por aquí.
import { existsSync } from "node:fs";

if (existsSync("src/casos-borrador") && !process.env.REVISION) {
  console.error(
    "\nHay borradores en src/casos-borrador/: la construcción de producción se niega.\n" +
      "Copia de revisión: npm run build:revision. Producción: quita o mueve esa carpeta.\n",
  );
  process.exit(1);
}
