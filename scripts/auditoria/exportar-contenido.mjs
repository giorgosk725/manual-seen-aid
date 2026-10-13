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
import * as D from "../../src/contenido/diagramas.ts";
import { trocear } from "../../src/marcado.ts";
import { FRAGMENTOS_EXTENDIDOS } from "../../src/extendida/fragmentos.ts";
import { INFORMACION_PACIENTES, RESUMEN_CAPITULO } from "../../src/pacientes/textos.ts";
import { PREGUNTAS } from "../../src/contenido/test.ts";

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
// Leyenda de abreviaturas, regla de oro y nota del asterisco: también son texto de la figura.
out.figura3.push({
  id: "leyenda",
  texto: [FIGURA3.abreviaturas, FIGURA3.reglaDeOro, FIGURA3.notaAsterisco]
    .filter(Boolean)
    .map(plano)
    .join(" "),
});
for (const f of Object.values(FIGURAS))
  out.figuras.push({
    id: f.id,
    pagina: f.pagina,
    texto: f.cajas.flatMap((c) => [c.titulo || "", ...c.items.map(plano)]).join(" "),
  });
// Diagramas: cada cifra o frase con la página de la que sale.
out.diagramas = [];
const dg = (id, p, texto, p2) => out.diagramas.push({ id, p, texto, ...(p2 ? { p2 } : {}) });
for (const pob of D.OBJETIVOS_MCG) {
  for (const f of pob.franjas) dg(`objetivos ${pob.id}`, pob.pagina, `${f.franja} ${f.objetivo}`);
  for (const e of pob.extras) dg(`objetivos ${pob.id} extra`, e.p ?? pob.pagina, e.texto);
}
for (const t of D.ESCALA_CETONEMIA.tramos) dg(`cetonemia ${t.clave}`, t.p, t.accion);
for (const k of ["gravedad", "pediatria", "ejercicio", "apilamiento"])
  dg(`cetonemia ${k}`, D.ESCALA_CETONEMIA[k].p, D.ESCALA_CETONEMIA[k].texto);
for (const z of D.EJERCICIO.zonas)
  dg("ejercicio zona", D.EJERCICIO.pagina, `${z.etiqueta} ${z.texto}`);
dg("ejercicio marca", D.EJERCICIO.pagina, D.EJERCICIO.marca.texto);
for (const f of D.EJERCICIO.fases)
  for (const it of f.items) dg(`ejercicio ${f.titulo}`, D.EJERCICIO.pagina, it);
dg("ejercicio cetonemia", D.EJERCICIO.pagina, D.EJERCICIO.cetonemia);
for (const it of D.EJERCICIO.tipo) dg("ejercicio tipo", D.EJERCICIO.pagina, it);
dg("ejercicio herramientas", D.EJERCICIO.pagina, D.EJERCICIO.herramientas);
for (const f of D.SEGUIMIENTO.fases) {
  dg("seguimiento fase", D.SEGUIMIENTO.fasesP, f.titulo);
  for (const h of f.hitos) dg("seguimiento", D.SEGUIMIENTO.pagina, h.que);
}
for (const n of D.SEGUIMIENTO.notas) dg("seguimiento nota", n.p, n.texto);
for (const k of ["regla", "porque", "orientacion"])
  dg(`hipoglucemia ${k}`, D.HIPOGLUCEMIA.pagina, D.HIPOGLUCEMIA[k]);
for (const x of D.HIPOGLUCEMIA.despues) dg("hipoglucemia después", x.p, x.texto, x.p2);
dg("transición partida", D.TRANSICION.partidaP, D.TRANSICION.partida);
dg("algoritmos híbrido", D.RECORDATORIO_HIBRIDO.p, D.RECORDATORIO_HIBRIDO.texto);
// Diagramas de la sesión 4 (frases literales con su página).
for (let c = 0; c < D.GESTACION_SISTEMAS.length; c++)
  for (const x of D.GESTACION_SISTEMAS[c])
    if (x.texto !== "—") dg(`gestación ${c} ${x.tema}`, x.p, x.texto, x.p2);
for (const x of D.GESTACION_COMUN) dg("gestación común", x.p, x.texto);
const H = D.HOSPITAL;
dg("hospital ámbito", H.ambito.p, H.ambito.texto);
for (const x of [...H.condiciones, ...H.mcg, H.haciaIV, H.contingencia])
  dg("hospital", x.p, x.texto);
dg("gestación ensayos", D.GESTACION_ENSAYOS.p, D.GESTACION_ENSAYOS.texto);
dg("exploraciones", D.EXPLORACIONES_TEXTO.p, D.EXPLORACIONES_TEXTO.porSeparado);
for (const n of D.EXPLORACIONES_TEXTO.notas) dg("exploraciones nota", D.EXPLORACIONES_TEXTO.p, n);
dg("elección factores", D.ELECCION_TEXTO.p, D.ELECCION_TEXTO.factores);
dg("elección jerarquía", D.ELECCION_TEXTO.p, D.ELECCION_TEXTO.noJerarquia);
dg("hospital mantener", H.mantener.p, H.mantener.texto);
for (const it of H.noApropiada.items) dg("hospital no apropiada", H.noApropiada.p, it);
dg("hospital entonces", H.entonces.p, H.entonces.texto);
for (const x of H.pasos) dg(`hospital ${x.cuando}`, x.p, x.texto, x.p2);
dg("hospital mientras", H.mientras.p, H.mientras.texto);
dg("hospital desde IV", H.desdeIV.p, H.desdeIV.texto);
const L = D.INTERRUPCION_LINEA;
dg("interrupción premisa", L.pagina, L.premisa);
for (const x of L.tramos) {
  dg(`interrupción ${x.cuando}`, L.pagina, x.texto);
  if (x.condicion) dg(`interrupción ${x.cuando} condición`, L.pagina, x.condicion);
}
for (const x of L.programadas)
  for (const t of [x.texto, ...x.mas]) dg(`interrupción ${x.cuando}`, L.pagina, t);
dg("interrupción pausa", L.pagina, L.formatos.pausa);
for (const x of L.detalles) dg(`interrupción ${x.cuando}`, L.pagina, x.texto);
dg("interrupción pod", L.pagina, L.formatos.pod);
dg("interrupción bomba", L.pagina, L.formatos.bomba);
dg("interrupción nota", L.pagina, L.nota);
// Capas fuera del capítulo (las comprueba fidelidad_extra.py contra sus fuentes).
out.extendida = FRAGMENTOS_EXTENDIDOS.map((f) => ({
  id: f.id,
  partes: f.partes.filter(Boolean).map((p) => ({ borrador: p.borrador, texto: p.texto })),
}));
out.pacientes = {
  informacion: INFORMACION_PACIENTES.secciones,
  resumen: RESUMEN_CAPITULO.parrafos,
};
out.test = PREGUNTAS.map((q) => ({ id: q.id, citas: q.citas }));
writeFileSync("_audit_contenido.json", JSON.stringify(out, null, 1), "utf8");
console.log("ok", out.parrafos.length, "párrafos/listas;", out.tablas.length, "celdas y notas");
