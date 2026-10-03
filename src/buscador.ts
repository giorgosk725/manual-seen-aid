/* Búsqueda instantánea sobre el texto LITERAL del capítulo (sin IA generativa).
   Índice en memoria: un registro por párrafo, celda de tabla, caja de figura y referencia.
   Aparte, en su propio grupo y rotuladas (decisión del autor, 3-10-2026): la versión
   extendida del autor y la ampliación del autor (fichas de sistemas). Nunca se mezclan con
   el capítulo: van detrás y con su rótulo.
   Comparación sin tildes ni mayúsculas; todos los términos deben aparecer. */
import {
  APARTADOS,
  DIAGRAMAS,
  BIBLIOGRAFIA,
  FIGURA3,
  FIGURAS,
  GLOSARIO,
  LISTA_TABLAS,
  idDeBloque,
} from "./contenido";
import { href } from "./rutas";
import { plano } from "./marcado";
import { FRAGMENTOS_EXTENDIDOS, textoDeFragmento } from "./extendida";
import { CRITERIOS, FICHA_FILAS, SETS_INFUSION, SISTEMAS_AMPLIACION } from "./ampliacion";

export interface Entrada {
  id: string;
  tipo:
    "texto" | "tabla" | "figura" | "diagrama" | "referencia" | "sigla" | "extendida" | "ampliacion";
  titulo: string;
  texto: string;
  /* Página del capítulo (0 = fuera del capítulo). */
  pagina: number;
  ruta: string;
}

/* Lo que no es texto del capítulo se muestra en un grupo aparte y rotulado. */
export const fueraDelCapitulo = (e: Entrada) => e.tipo === "extendida" || e.tipo === "ampliacion";

const sinMarcado = (s: string) => plano(s);

export const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

let cache: Entrada[] | null = null;

export function indice(): Entrada[] {
  if (cache) return cache;
  const out: Entrada[] = [];
  for (const a of APARTADOS) {
    a.bloques.forEach((b, i) => {
      const id = idDeBloque(b, i);
      const ruta = href("capitulo", a.slug, id);
      if (b.t === "p") {
        out.push({
          id: `${a.slug}/${id}`,
          tipo: "texto",
          titulo: a.titulo,
          texto: sinMarcado((b.lead ? b.lead + " " : "") + b.texto),
          pagina: b.p,
          ruta,
        });
      } else if (b.t === "lista") {
        out.push({
          id: `${a.slug}/${id}`,
          tipo: "texto",
          titulo: a.titulo,
          texto: sinMarcado((b.intro ? b.intro + " " : "") + b.items.join(" · ")),
          pagina: b.p,
          ruta,
        });
      } else if (b.t === "h3") {
        out.push({
          id: `${a.slug}/${id}`,
          tipo: "texto",
          titulo: a.titulo,
          texto: b.texto,
          pagina: b.p,
          ruta,
        });
      }
    });
  }
  for (const t of LISTA_TABLAS) {
    t.filas.forEach((f, i) => {
      out.push({
        id: `${t.id}/${i}`,
        tipo: "tabla",
        titulo: `Tabla ${t.numero}. ${t.titulo}`,
        texto: [f.etiqueta, ...f.celdas].join(" · ").replace(/\n/g, " "),
        pagina: t.paginas[0],
        ruta: href("consultar", "tablas", t.id),
      });
    });
  }
  for (const f of Object.values(FIGURAS)) {
    f.cajas.forEach((c, i) => {
      out.push({
        id: `${f.id}/${i}`,
        tipo: "figura",
        titulo: f.titulo,
        texto: sinMarcado([c.titulo, ...c.items].filter(Boolean).join(" · ")),
        pagina: f.pagina,
        ruta:
          f.id === "INFO"
            ? href("consultar", "infografia")
            : href("capitulo", f.id === "F1" ? "02-componentes" : "06-indicaciones"),
      });
    });
  }
  FIGURA3.tramos.forEach((tr) => {
    out.push({
      id: `F3/${tr.clave}`,
      tipo: "figura",
      titulo: FIGURA3.titulo,
      texto: sinMarcado(
        [tr.rango, tr.titulo, ...tr.pasos.flatMap((p) => [p.texto, ...(p.detalle || [])])].join(
          " · ",
        ),
      ),
      pagina: FIGURA3.pagina,
      ruta: href("consultar", "figura-3", tr.clave),
    });
  });
  out.push({
    id: "F3/pie",
    tipo: "figura",
    titulo: FIGURA3.titulo,
    texto: sinMarcado(
      [
        ...FIGURA3.sospechar.items,
        ...FIGURA3.comprobar.items,
        ...FIGURA3.pie.map((p) => p.titulo + " " + p.texto),
        FIGURA3.reglaDeOro,
        FIGURA3.notaAsterisco,
      ].join(" · "),
    ),
    pagina: FIGURA3.pagina,
    ruta: href("consultar", "figura-3"),
  });
  for (const d of DIAGRAMAS) {
    out.push({
      id: `diagrama/${d.id}`,
      tipo: "diagrama",
      titulo: `Diagrama: ${d.titulo}`,
      texto: `${d.titulo}. ${d.resumen}`,
      pagina: d.paginas[0],
      ruta: href("visual", d.id),
    });
  }
  for (const r of BIBLIOGRAFIA) {
    out.push({
      id: `ref/${r.n}`,
      tipo: "referencia",
      titulo: `Bibliografía, referencia ${r.n}`,
      texto: r.cita,
      pagina: r.n <= 6 ? 24 : 25,
      ruta: href("bibliografia", `ref-${r.n}`),
    });
  }
  for (const g of GLOSARIO) {
    out.push({
      id: `sigla/${g.sigla}`,
      tipo: "sigla",
      titulo: "Glosario",
      texto: `${g.sigla}: ${g.desarrollo}`,
      pagina: g.pagina,
      ruta: href("consultar", "glosario", g.sigla),
    });
  }
  // Fuera del capítulo (grupo aparte, rotulado).
  for (const f of FRAGMENTOS_EXTENDIDOS) {
    out.push({
      id: `ext/${f.id}`,
      tipo: "extendida",
      titulo: `Versión extendida del autor · ${f.titulo}`,
      texto: textoDeFragmento(f),
      pagina: 0,
      ruta: href("capitulo", f.donde.apartado, `ext-${f.id}`),
    });
  }
  for (const s of SISTEMAS_AMPLIACION) {
    const ruta = href("sistemas", s.id);
    for (const g of FICHA_FILAS)
      for (const r of g.rows) {
        const texto = r.f
          ? s.detail[r.f]
          : r.crit
            ? CRITERIOS.find((c) => c.id === r.crit)?.s[s.id]?.t
            : undefined;
        if (texto)
          out.push({
            id: `amp/${s.id}/${r.k}`,
            tipo: "ampliacion",
            titulo: `Ampliación del autor · ${s.name} · ${r.k}`,
            texto,
            pagina: 0,
            ruta,
          });
      }
    for (const prm of s.params)
      out.push({
        id: `amp/${s.id}/param/${prm.name}`,
        tipo: "ampliacion",
        titulo: `Ampliación del autor · ${s.name} · Parámetros`,
        texto: `${prm.name}: ${prm.note}`,
        pagina: 0,
        ruta,
      });
    for (const set of SETS_INFUSION[s.id] || [])
      out.push({
        id: `amp/${s.id}/set/${set.name}`,
        tipo: "ampliacion",
        titulo: `Ampliación del autor · ${s.name} · Sets de infusión`,
        texto: `${set.name} (${set.material}, ${set.angle})`,
        pagina: 0,
        ruta,
      });
  }
  cache = out;
  return out;
}

export interface Resultado {
  entrada: Entrada;
  fragmento: string;
  puntos: number;
}

export function buscar(consulta: string, limite = 40): Resultado[] {
  const terminos = normalizar(consulta)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (!terminos.length) return [];
  const res: Resultado[] = [];
  for (const e of indice()) {
    const n = normalizar(e.texto);
    const nt = normalizar(e.titulo);
    let puntos = 0;
    let primera = -1;
    let ok = true;
    for (const t of terminos) {
      const i = n.indexOf(t);
      const enTitulo = nt.includes(t);
      if (i < 0 && !enTitulo) {
        ok = false;
        break;
      }
      if (i >= 0) {
        puntos += 2;
        if (primera < 0 || i < primera) primera = i;
        // Varias apariciones puntúan un poco más.
        puntos += Math.min(3, n.split(t).length - 2) * 0.5;
      }
      if (enTitulo) puntos += 1;
    }
    if (!ok) continue;
    if (e.tipo === "sigla") puntos += 1.5;
    res.push({ entrada: e, fragmento: fragmento(e.texto, primera), puntos });
  }
  // Primero el capítulo; lo de fuera, detrás (y en su grupo en la pantalla de búsqueda).
  res.sort(
    (a, b) =>
      Number(fueraDelCapitulo(a.entrada)) - Number(fueraDelCapitulo(b.entrada)) ||
      b.puntos - a.puntos,
  );
  return res.slice(0, limite);
}

function fragmento(texto: string, pos: number, radio = 90): string {
  if (pos < 0) return texto.length > radio * 2 ? texto.slice(0, radio * 2) + "…" : texto;
  let ini = Math.max(0, pos - radio);
  let fin = Math.min(texto.length, pos + radio);
  // Cortar en límite de palabra: un fragmento que empieza a media palabra se lee mal.
  if (ini > 0) {
    const esp = texto.indexOf(" ", ini);
    if (esp > 0 && esp < pos) ini = esp + 1;
  }
  if (fin < texto.length) {
    const esp = texto.lastIndexOf(" ", fin);
    if (esp > pos) fin = esp;
  }
  return (ini > 0 ? "…" : "") + texto.slice(ini, fin) + (fin < texto.length ? "…" : "");
}

/* Trozos del fragmento con los términos marcados (para <mark>). */
export function marcar(fragmento: string, consulta: string): { t: string; hit: boolean }[] {
  const terminos = normalizar(consulta)
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (!terminos.length) return [{ t: fragmento, hit: false }];
  const n = normalizar(fragmento);
  // normalizar no cambia la longitud (NFD + quitar diacríticos deja un char por char base)
  const marcas = new Array<boolean>(fragmento.length).fill(false);
  for (const t of terminos) {
    let i = n.indexOf(t);
    while (i >= 0) {
      for (let k = i; k < i + t.length && k < marcas.length; k++) marcas[k] = true;
      i = n.indexOf(t, i + t.length);
    }
  }
  const out: { t: string; hit: boolean }[] = [];
  let actual = "";
  let estado = marcas[0] ?? false;
  for (let k = 0; k < fragmento.length; k++) {
    if (marcas[k] !== estado) {
      out.push({ t: actual, hit: estado });
      actual = "";
      estado = marcas[k];
    }
    actual += fragmento[k];
  }
  if (actual) out.push({ t: actual, hit: estado });
  return out;
}
