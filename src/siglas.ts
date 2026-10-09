/* Siglas pulsables en la lectura (entrega 3, docs/PLAN_2026-10-09.md): la PRIMERA aparición
   de cada sigla del glosario en cada apartado (párrafos y listas) se vuelve un botón que
   enseña su desarrollo, literal, con la página en la que el capítulo lo da. El texto no
   cambia. Aquí, la lógica pura: qué siglas marcar en cada trozo de texto del apartado y cómo
   partir un texto por ellas. */
import { GLOSARIO, type Apartado, type Bloque } from "./contenido";
import { plano, type Trozo } from "./marcado";

export type TrozoSigla = Trozo & { sigla?: string };

/* Con la bandera «u» solo se escapan los metacaracteres: «-» y «/» van tal cual. */
const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Más largas primero: «TIRp» antes que «TIR», «I/HC» antes que «HC». Sin lookbehind (no lo
   tienen los Safari antiguos): el carácter anterior va en el grupo 1 y la sigla en el 2. */
const ALTERNATIVAS = [...GLOSARIO]
  .map((g) => g.sigla)
  .sort((a, b) => b.length - a.length)
  .map(escapar)
  .join("|");
const PATRON = new RegExp(`(^|[^\\p{L}\\p{N}])(${ALTERNATIVAS})(?![\\p{L}\\p{N}])`, "gu");

const siglasEn = (texto: string) => [...texto.matchAll(PATRON)].map((m) => m[2]);

/* Cada texto que se pinta por separado es una «unidad»: el párrafo, la introducción de una
   lista o cada uno de sus puntos. */
export const claveSigla = (bloque: number, parte: "p" | "intro" | number) => `${bloque}:${parte}`;

function unidades(b: Bloque, i: number): { clave: string; texto: string }[] {
  if (b.t === "p") return [{ clave: claveSigla(i, "p"), texto: plano(b.texto) }];
  if (b.t === "lista")
    return [
      ...(b.intro ? [{ clave: claveSigla(i, "intro"), texto: plano(b.intro) }] : []),
      ...b.items.map((it, j) => ({ clave: claveSigla(i, j), texto: plano(it) })),
    ];
  return [];
}

/* Para cada unidad del apartado, las siglas cuya primera aparición en el apartado está en
   ella (en orden de lectura). Puro: la misma entrada da siempre lo mismo. */
export function primerasSiglas(apartado: Apartado): Map<string, string[]> {
  const vistas = new Set<string>();
  const out = new Map<string, string[]>();
  apartado.bloques.forEach((b, i) => {
    for (const u of unidades(b, i))
      for (const s of siglasEn(u.texto)) {
        if (vistas.has(s)) continue;
        vistas.add(s);
        out.set(u.clave, [...(out.get(u.clave) ?? []), s]);
      }
  });
  return out;
}

/* Parte un texto llano en trozos; el trozo que es una sigla de `pendientes` lleva `sigla` y
   se quita del conjunto (así solo se marca su primera aparición). */
export function partirSiglas(texto: string, pendientes: Set<string>): TrozoSigla[] {
  if (!pendientes.size) return [{ t: texto }];
  const out: TrozoSigla[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(PATRON)) {
    const sigla = m[2];
    if (!pendientes.has(sigla)) continue;
    const ini = (m.index ?? 0) + m[1].length;
    if (ini > ultimo) out.push({ t: texto.slice(ultimo, ini) });
    out.push({ t: sigla, sigla });
    pendientes.delete(sigla);
    ultimo = ini + sigla.length;
  }
  if (ultimo < texto.length) out.push({ t: texto.slice(ultimo) });
  return out;
}

export const desarrolloDe = (sigla: string) => GLOSARIO.find((g) => g.sigla === sigla);
