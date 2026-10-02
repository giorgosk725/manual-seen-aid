// Exporta el contenido de la app a JSON para la auditoría de fidelidad (fidelidad.py).
// Uso (desde la raíz): npx vite-node scripts/auditoria/exportar-contenido.mjs → _audit_contenido.json
import { writeFileSync } from "node:fs";
import {
  APARTADOS,
  LISTA_TABLAS,
  BIBLIOGRAFIA,
  FIGURA3,
  FIGURAS,
  GLOSARIO,
} from "../../src/contenido/index.ts";
import { CIFRAS } from "../../src/contenido/cifras.ts";
import { trocear } from "../../src/marcado.ts";

const plano = (s) =>
  trocear(s)
    .map((t) => t.t)
    .join("");
const out = {
  parrafos: [],
  tablas: [],
  refs: [],
  figura3: [],
  figuras: [],
  glosario: GLOSARIO,
  cifras: CIFRAS,
};
for (const a of APARTADOS)
  a.bloques.forEach((b, i) => {
    const id = `${a.slug}#b${i + 1}`;
    if (b.t === "p")
      out.parrafos.push({
        id,
        p: b.p,
        p2: b.p2,
        texto: plano((b.lead ? b.lead + " " : "") + b.texto),
      });
    if (b.t === "h3") out.parrafos.push({ id: `${a.slug}#${b.id}`, p: b.p, texto: b.texto });
    if (b.t === "lista") {
      if (b.intro)
        out.parrafos.push({ id: id + " intro", p: b.p, p2: b.p2, texto: plano(b.intro) });
      b.items.forEach((it, j) =>
        out.parrafos.push({ id: `${id} item${j + 1}`, p: b.p, p2: b.p2, texto: plano(it) }),
      );
    }
  });
for (const t of LISTA_TABLAS) {
  out.tablas.push({ id: `${t.id} título`, paginas: t.paginas, texto: t.titulo });
  t.filas.forEach((f, i) => {
    out.tablas.push({
      id: `${t.id} fila ${i + 1} etiqueta`,
      paginas: t.paginas,
      texto: f.etiqueta,
    });
    f.celdas.forEach((c, j) =>
      out.tablas.push({
        id: `${t.id} fila ${i + 1} col ${j + 1}`,
        paginas: t.paginas,
        texto: plano(c),
      }),
    );
  });
  t.notas.forEach((n, i) =>
    out.tablas.push({ id: `${t.id} nota ${i + 1}`, paginas: t.paginas, texto: plano(n) }),
  );
}
for (const r of BIBLIOGRAFIA) out.refs.push({ id: `ref ${r.n}`, texto: r.cita });
for (const tr of FIGURA3.tramos)
  out.figura3.push({
    id: tr.clave,
    texto: [
      tr.rango,
      tr.titulo,
      ...tr.pasos.flatMap((p) => [plano(p.texto), ...(p.detalle || []).map(plano)]),
    ].join(" "),
  });
for (const f of Object.values(FIGURAS))
  out.figuras.push({
    id: f.id,
    pagina: f.pagina,
    texto: f.cajas.flatMap((c) => [c.titulo || "", ...c.items.map(plano)]).join(" "),
  });
writeFileSync("_audit_contenido.json", JSON.stringify(out, null, 1), "utf8");
console.log("ok", out.parrafos.length, "párrafos/listas;", out.tablas.length, "celdas y notas");
