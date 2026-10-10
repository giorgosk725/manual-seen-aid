/* Búsqueda instantánea sobre el texto LITERAL del capítulo (sin IA generativa).
   Índice en memoria: un registro por párrafo, celda de tabla, caja de figura y referencia.
   Aparte, en su propio grupo y rotulada: la ampliación técnica (fichas de sistemas), las
   hojas para el paciente, los casos y el test. Nunca se mezclan con
   el capítulo: van detrás y con su rótulo.
   Comparación sin tildes ni mayúsculas; todos los términos deben aparecer. */
import {
  APARTADOS,
  DIAGRAMAS,
  apartadoDePagina,
  BIBLIOGRAFIA,
  FIGURA3,
  FIGURAS,
  GLOSARIO,
  LISTA_TABLAS,
  TABLAS,
  idDeBloque,
} from "./contenido";
import { href } from "./rutas";
import { plano } from "./marcado";
import { CRITERIOS, FICHA_FILAS, SETS_INFUSION, SISTEMAS_AMPLIACION } from "./ampliacion";
import { INFORMACION_PACIENTES, RESUMEN_CAPITULO } from "./pacientes/textos";
import { PREGUNTAS } from "./contenido/test";
import {
  fueraDelCapitulo,
  normalizar,
  posiciones,
  terminosDe,
  type Busqueda,
  type Entrada,
  type Resultado,
} from "./busqueda";
import { SIS_IDS, SITUACIONES } from "./situaciones";
import { OBJETIVOS_MCG } from "./contenido/diagramas";
import { CASOS_INDICE } from "./casos-indice";

/* Lo ligero sigue disponible desde aquí para quien ya carga el índice. */
export * from "./busqueda";
/* «Preguntas al capítulo»: la respuesta literal (va en el mismo trozo que el índice). */
export {
  conContexto,
  contextoDe,
  esSeguimiento,
  faqsCercanas,
  frecuentesRelacionadas,
  fusionar,
  preguntaFrecuente,
  responder,
  respuestaDeFrecuente,
  respuestaPorId,
  type RespuestaFrecuente,
} from "./respuestas";
import { conContexto as conContextoDe, esSeguimiento as seguimiento } from "./respuestas";
import { FRECUENTES, type Frecuente } from "./frecuentes";
import { HOJAS_EXTRA } from "./hojas";

const sinMarcado = (s: string) => plano(s);

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
        pagina2: t.paginas[1],
        ruta: (() => {
          const st = SITUACIONES.find((x) => x.tabla === t.id && x.fila === i);
          return st ? href("consultar", "situacion", st.id) : href("consultar", "tablas", t.id);
        })(),
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
      titulo: "Sigla del capítulo",
      texto: `${g.sigla}: ${g.desarrollo}`,
      pagina: g.pagina,
      ruta: href("capitulo", apartadoDePagina(g.pagina)?.slug ?? APARTADOS[0].slug),
    });
  }
  // Fuera del capítulo (grupo aparte, rotulado).
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
            titulo: `Ampliación técnica · ${s.name} · ${r.k}`,
            texto,
            pagina: 0,
            ruta,
          });
      }
    for (const prm of s.params)
      out.push({
        id: `amp/${s.id}/param/${prm.name}`,
        tipo: "ampliacion",
        titulo: `Ampliación técnica · ${s.name} · Parámetros`,
        texto: `${prm.name}: ${prm.note}`,
        pagina: 0,
        ruta,
      });
    for (const set of SETS_INFUSION[s.id] || [])
      out.push({
        id: `amp/${s.id}/set/${set.name}`,
        tipo: "ampliacion",
        titulo: `Ampliación técnica · ${s.name} · Sets de infusión`,
        texto: `${set.name} (${set.material}, ${set.angle})`,
        pagina: 0,
        ruta,
      });
  }
  // Atajos («Ir a»): las herramientas de consulta, para que la búsqueda lleve a la respuesta y
  // no solo a la tabla. Su texto es el rótulo de la fila de la tabla (literal) más los nombres
  // de los sistemas, para que «resonancia 780G» o «ejercicio omnipod» los encuentren.
  const NOMBRES =
    "MiniMed 780G Medtronic Tandem Control-IQ t:slim myLoop CamAPS FX mylife YpsoPump Omnipod 5 Insulet";
  // Los ocho pasos de «Revisar la descarga» (Tabla 5): «paso 7», «respuesta automática DTD»…
  TABLAS.T5.filas.forEach((f, i) => {
    out.push({
      id: `atajo/descarga/${i + 1}`,
      tipo: "atajo",
      titulo: `Revisar la descarga · paso ${i + 1}: ${f.celdas[0]}`,
      texto: `Paso ${i + 1} de la descarga. ${f.celdas.join(" ")}`,
      pagina: TABLAS.T5.paginas[0],
      pagina2: TABLAS.T5.paginas[1],
      ruta: href("consultar", "descarga", String(i + 1)),
    });
  });
  for (const st of SITUACIONES) {
    const t = TABLAS[st.tabla];
    const fila = t.filas[st.fila];
    out.push({
      id: `atajo/sit/${st.id}`,
      tipo: "atajo",
      titulo: `Situaciones · ${st.etiqueta}`,
      texto: `${st.etiqueta}. ${fila.etiqueta.replace(/\n/g, " ")} (Tabla ${t.numero}). ${NOMBRES}`,
      pagina: t.paginas[0],
      pagina2: t.paginas[1],
      ruta: href("consultar", "situacion", st.id),
    });
  }
  for (const s of SISTEMAS_AMPLIACION)
    out.push({
      id: `atajo/sis/${s.id}`,
      tipo: "atajo",
      titulo: `Ficha del sistema · ${s.name}`,
      texto: `${s.name} ${s.short}: lo que dice el capítulo (Tablas 1, 3 y 4), parámetros configurables en modo automático, algoritmo, sensores y ficha ampliada.`,
      pagina: TABLAS.T1.paginas[0],
      pagina2: TABLAS.T1.paginas[1],
      ruta: href("sistemas", s.id),
    });
  for (const pob of OBJETIVOS_MCG)
    out.push({
      id: `atajo/mcg/${pob.id}`,
      tipo: "atajo",
      titulo: `Objetivos de MCG · ${pob.nombre}`,
      texto: `Objetivos de MCG (TIR, TBR, TAR) · ${pob.nombre}`,
      pagina: pob.pagina,
      ruta: href("visual", "objetivos-mcg", pob.id),
    });
  for (const [titulo, texto, pagina, ruta] of [
    [
      "Cetonemia paso a paso (Figura 3)",
      "Cetonemia, cetonas, β-OHB, cetosis, fallo de infusión, hiperglucemia persistente: qué hacer según el tramo",
      8,
      href("consultar", "figura-3"),
    ],
    [
      "Revisar la descarga (Tabla 5)",
      "Revisar la descarga en consulta: los ocho pasos de la Tabla 5 y sus patrones",
      13,
      href("consultar", "descarga", "1"),
    ],
    [
      "Interrupción del sistema",
      "Interrupción o desconexión del sistema: cuánto dura y qué hacer, pauta alternativa",
      9,
      href("consultar", "interrupcion"),
    ],
    [
      "Iniciar un sistema (apartado 8, Tabla 2)",
      "Iniciar, empezar, arrancar, inicio del sistema, transición desde MDI, parámetros iniciales, reducción de la DTD, ratio y factor de sensibilidad, plan de respaldo, primeros 3 meses, seguimiento, hoja de comprobación",
      10,
      href("consultar", "inicio"),
    ],
    [
      "Sistemas de código abierto (DIY, apartado 11)",
      "DIY, sistemas de desarrollo propio, hechos en casa, caseros, de código abierto: el capítulo los trata en el apartado 11",
      22,
      href("capitulo", "11-diy"),
    ],
    [
      "Elegir un sistema (criterios de elección)",
      "Elegir, elección, qué sistema le pongo, cuál conviene, indicación por edad, peso, dosis total diaria, gestación, diabetes tipo 2, pod o bomba con catéter, sensor compatible: los criterios del apartado 6 contrastados con la Tabla 1",
      6,
      href("sistemas", "elegir"),
    ],
    [
      "Tarjetas de repaso",
      "Tarjetas, repasar, estudiar, memorizar, aprender las cifras y las siglas del capítulo, con su página",
      0,
      href("repaso"),
    ],
  ] as const)
    out.push({ id: `atajo/${ruta}`, tipo: "atajo", titulo, texto, pagina, ruta });
  // Casos guiados y ejemplos comentados de la app: para que «ejemplo de descarga» o «practicar
  // con un caso» lleven al caso, no a un pasaje que contiene «por ejemplo».
  for (const c of CASOS_INDICE)
    out.push({
      id: `caso/${c.id}`,
      tipo: "caso",
      titulo: c.titulo,
      texto: c.texto,
      pagina: c.pagina,
      ruta: href("casos", c.id),
    });
  // Hojas para el paciente (V5 del autor y resumen de la editorial) y preguntas del test:
  // también fuera del capítulo, en su grupo.
  for (const s of INFORMACION_PACIENTES.secciones)
    out.push({
      id: `pac/info/${s.pregunta}`,
      tipo: "pacientes",
      titulo: `Información para pacientes · ${s.pregunta}`,
      texto: s.parrafos.join(" "),
      pagina: 0,
      ruta: href("pacientes", "informacion"),
    });
  RESUMEN_CAPITULO.parrafos.forEach((t, i) =>
    out.push({
      id: `resumen/${i}`,
      tipo: "resumen",
      titulo: "Resumen del capítulo (una página)",
      texto: t,
      pagina: 0,
      ruta: href("capitulo", "resumen"),
    }),
  );
  PREGUNTAS.forEach((q, i) =>
    out.push({
      id: `test/${q.id}`,
      tipo: "test",
      titulo: `Autoevaluación · pregunta ${i + 1}`,
      texto: [q.enunciado, ...q.opciones, q.explicacion].join(" "),
      pagina: 0,
      ruta: href("test"),
    }),
  );
  cache = out;
  return out;
}

export function buscar(consulta: string, limite = 40, limiteFuera?: number): Resultado[] {
  return buscarConTotales(consulta, limite, limiteFuera).resultados;
}

export function buscarConTotales(
  consulta: string,
  limite = 40,
  limiteFuera = Math.max(3, Math.ceil(limite / 3)),
): Busqueda {
  const terminos = terminosDe(consulta);
  if (!terminos.length) return { resultados: [], totalCapitulo: 0, totalFuera: 0 };
  // Primero con TODAS las palabras; si no hay nada y son varias, con ALGUNA (y se avisa).
  let res = puntuar(terminos, true);
  let parcial = false;
  if (!res.length && terminos.length > 1) {
    res = puntuar(terminos, false);
    parcial = res.length > 0;
  }
  // Más palabras coincidentes primero (cuenta con «alguna»); después, la puntuación.
  res.sort((a, b) => (b.aciertos ?? 0) - (a.aciertos ?? 0) || b.puntos - a.puntos);
  // Si la consulta nombra un sistema, los atajos de situación lo llevan ya elegido.
  const sis = sistemaDeConsulta(consulta);
  if (sis >= 0)
    res = res.map((r) => {
      const st = r.entrada.id.startsWith("atajo/sit/")
        ? SITUACIONES.find((x) => `atajo/sit/${x.id}` === r.entrada.id)
        : undefined;
      if (!st || st.tabla !== "T4" || TABLAS.T4.filas[st.fila].unida) return r;
      return { ...r, entrada: { ...r.entrada, ruta: `${r.entrada.ruta}:${SIS_IDS[sis]}` } };
    });
  // Primero el capítulo; lo de fuera, detrás (y en su grupo en la pantalla de búsqueda).
  const dentro = res.filter((r) => !fueraDelCapitulo(r.entrada));
  const fuera = res.filter((r) => fueraDelCapitulo(r.entrada));
  return {
    resultados: [...dentro.slice(0, limite), ...fuera.slice(0, limiteFuera)],
    totalCapitulo: dentro.length,
    totalFuera: fuera.length,
    parcial,
  };
}

/* Sistema que nombra la consulta (índice de columna), o -1. */
const ALIAS_SISTEMA: RegExp[] = [
  /^(780g|minimed|medtronic|smartguard)$/,
  /^(control-?iq|tandem|t:?slim|mobi|ciq)$/,
  /^(camaps|ypsopump|mylife|myloop)$/,
  /^(omnipod|op5|insulet|smartadjust)$/,
];
/* Si la consulta nombra un recurso de la app (un caso, una herramienta, la sección de la ficha
   de un sistema), ese recurso va el primero («Abrir …»), encima de los pasajes. */
const SECCION_PEDIDA: [RegExp, string, string][] = [
  [/par[aá]metro|configur|ajust|cambiar/, "parametros", "Parámetros"],
  [/c[oó]mo funciona|algoritmo/, "funciona", "Cómo funciona"],
  [/situaci/, "situaciones", "Situaciones"],
  [/ficha t[eé]cnica|ampliaci/, "ampliacion", "Ampliación técnica"],
];
export function recursosPedidos(consulta: string, res: Resultado[]): Resultado[] {
  const terminos = terminosDe(consulta).map((v) => v[0]);
  if (!terminos.length) return [];
  const out: Resultado[] = [];
  const sis = sistemaDeConsulta(consulta);
  if (sis >= 0) {
    const sec = SECCION_PEDIDA.find(([re]) => re.test(normalizar(consulta)));
    if (sec) {
      const s = SISTEMAS_AMPLIACION[sis];
      out.push({
        entrada: {
          id: `recurso/${s.id}/${sec[1]}`,
          tipo: "atajo",
          titulo: `${sec[2]} · ${s.name}`,
          texto: "",
          pagina: TABLAS.T1.paginas[0],
          ruta: href("sistemas", s.id, sec[1]),
        },
        fragmento: "",
        puntos: 0,
      });
    }
  }
  // «paso 7» pide ese paso, no los ocho.
  const paso = consulta.toLowerCase().match(/paso\s*(\d)/)?.[1];
  // Las palabras casan por su raíz (seis letras): «comentada» encuentra «comentado»; en los casos
  // cuenta también su descripción («practicar», «caso»).
  const raiz = (w: string) => w.slice(0, 6);
  // «paso 7 de la descarga»: ese paso de la Tabla 5, aunque no esté entre los resultados.
  if (paso && /descarga/.test(normalizar(consulta))) {
    const f = TABLAS.T5.filas[Number(paso) - 1];
    if (f)
      out.push({
        entrada: {
          id: `recurso/descarga/${paso}`,
          tipo: "atajo",
          titulo: `Revisar la descarga · paso ${paso}: ${f.celdas[0]}`,
          texto: "",
          pagina: TABLAS.T5.paginas[0],
          pagina2: TABLAS.T5.paginas[1],
          ruta: href("consultar", "descarga", paso),
        },
        fragmento: "",
        puntos: 0,
      });
  }
  const nombrados = res
    .filter((r) => r.entrada.tipo === "atajo" || r.entrada.tipo === "caso")
    .filter(
      (r) =>
        !paso || !/paso \d/.test(r.entrada.titulo) || r.entrada.titulo.includes(`paso ${paso}`),
    )
    .map((r) => {
      const t = normalizar(
        r.entrada.tipo === "caso" ? `${r.entrada.titulo} ${r.entrada.texto}` : r.entrada.titulo,
      )
        .split(/[^a-z0-9ñ]+/)
        .map(raiz);
      return { r, f: terminos.filter((x) => t.includes(raiz(x))).length / terminos.length };
    })
    .filter((x) => x.f >= 0.6)
    .sort((a, b) => b.f - a.f || b.r.puntos - a.r.puntos)
    .map((x) => x.r);
  return [...out, ...nombrados].slice(0, 2);
}

function sistemaDeConsulta(consulta: string): number {
  const palabras = normalizar(consulta).split(/\s+/);
  return ALIAS_SISTEMA.findIndex((re) => palabras.some((w) => re.test(w)));
}

function puntuar(terminos: string[][], todas: boolean): Resultado[] {
  const res: Resultado[] = [];
  for (const e of indice()) {
    const n = normalizar(e.texto);
    const nt = normalizar(e.titulo);
    let puntos = 0;
    let primera = -1;
    let aciertos = 0;
    for (const variantes of terminos) {
      let mejor = -1;
      let veces = 0;
      let enTitulo = false;
      let exacta = false; // la palabra tal cual (no un sinónimo)
      let inicio = false; // al principio de una palabra (cirugía, no electrocirugía)
      let kMin = variantes.length; // la primera variante que aparece (las primeras, mejores)
      for (const [k, v] of variantes.entries()) {
        const pos = posiciones(n, v);
        if (pos.length && (mejor < 0 || pos[0] < mejor)) mejor = pos[0];
        veces += pos.length;
        if (k === 0 && pos.length) exacta = true;
        if (pos.length && k < kMin) kMin = k;
        if (pos.some((x) => x === 0 || !/[a-zñ]/.test(n[x - 1]))) inicio = true;
        const posT = posiciones(nt, v);
        if (posT.length) {
          enTitulo = true;
          if (k === 0) exacta = true;
          if (posT.some((x) => x === 0 || !/[a-zñ]/.test(nt[x - 1]))) inicio = true;
        }
      }
      if (mejor < 0 && !enTitulo) {
        if (todas) break;
        continue;
      }
      aciertos++;
      if (mejor >= 0) {
        puntos += 2;
        if (primera < 0 || mejor < primera) primera = mejor;
        // Varias apariciones puntúan un poco más.
        puntos += Math.min(3, veces - 1) * 0.5;
      }
      if (enTitulo) puntos += 1;
      if (exacta) puntos += 0.5;
      if (inicio) puntos += 0.5;
      puntos -= Math.min(kMin, 3) * 0.1;
    }
    if (todas ? aciertos < terminos.length : aciertos === 0) continue;
    if (e.tipo === "sigla") puntos += 1;
    // Las herramientas llevan directamente a la respuesta: van delante.
    if (e.tipo === "atajo" || e.tipo === "caso") puntos += 4;
    res.push({ entrada: e, fragmento: fragmento(e.texto, primera), puntos, aciertos });
  }
  return res;
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

/* ------------------------------------------------------ sugerencias mientras se escribe */
export interface Sugerencia {
  texto: string;
  tipo: "pregunta" | "situacion" | "sistema" | "herramienta" | "hoja" | "sigla";
  /* Sin ruta, la sugerencia rellena la caja (pregunta frecuente); con ruta, abre su pantalla. */
  ruta?: string;
  /* La pregunta frecuente, para enseñar sus pasajes. */
  frecuente?: Frecuente;
}

const HERRAMIENTAS: [string, string][] = [
  ["Revisar la descarga (Tabla 5, ocho pasos)", href("consultar", "descarga", "1")],
  ["Iniciar un sistema (apartado 8)", href("consultar", "inicio")],
  ["Criterios de elección (apartado 6 y Tabla 1)", href("sistemas", "elegir")],
  ["Comparar sistemas (Tabla 1)", href("sistemas", "todos", "esencial")],
  ["Parámetros por sistema (Tabla 3)", href("sistemas", "todos", "parametros")],
  ["Cetonemia paso a paso (Figura 3)", href("consultar", "figura-3")],
  ["Interrupción del sistema", href("consultar", "interrupcion")],
  ["Hojas para el paciente", href("pacientes")],
  ["Ejemplo comentado de una descarga", href("casos", "ejemplo-descarga")],
];
const PRIORIDAD: Record<Sugerencia["tipo"], number> = {
  herramienta: 0,
  situacion: 1,
  sistema: 2,
  hoja: 3,
  pregunta: 4,
  sigla: 5,
};

/* Cada término escrito es prefijo de alguna palabra del texto candidato. */
function empiezaPor(texto: string, terminos: string[]) {
  const ws = normalizar(texto)
    .split(/[^a-z0-9ñ]+/)
    .filter(Boolean);
  return terminos.every((t) => ws.some((w) => w.startsWith(t)));
}

export function sugerir(consulta: string, max = 5): Sugerencia[] {
  const terminos = terminosDe(consulta).map((v) => v[0]);
  if (!terminos.length || normalizar(consulta).trim().length < 3) return [];
  const out: Sugerencia[] = [];
  const vistos = new Set<string>();
  const add = (s: Sugerencia) => {
    if (vistos.has(s.texto)) return;
    vistos.add(s.texto);
    out.push(s);
  };
  for (const [texto, ruta] of HERRAMIENTAS)
    if (empiezaPor(texto, terminos)) add({ texto, tipo: "herramienta", ruta });
  for (const st of SITUACIONES)
    if (empiezaPor(st.etiqueta, terminos))
      add({ texto: st.etiqueta, tipo: "situacion", ruta: href("consultar", "situacion", st.id) });
  for (const s of SISTEMAS_AMPLIACION)
    if (empiezaPor(`${s.name} ${s.short}`, terminos))
      add({ texto: s.name, tipo: "sistema", ruta: href("sistemas", s.id) });
  for (const h of HOJAS_EXTRA)
    if (empiezaPor(h.titulo, terminos))
      add({ texto: h.titulo, tipo: "hoja", ruta: href("pacientes", "hoja", h.id) });
  for (const f of FRECUENTES)
    if ([f.pregunta, ...f.variantes].some((t) => empiezaPor(t, terminos)))
      add({ texto: f.pregunta, tipo: "pregunta", frecuente: f });
  for (const g of GLOSARIO)
    if (empiezaPor(`${g.sigla} ${g.desarrollo}`, terminos))
      add({
        texto: `${g.sigla}: ${g.desarrollo}`,
        tipo: "sigla",
        ruta: href("capitulo", apartadoDePagina(g.pagina)?.slug ?? APARTADOS[0].slug),
      });
  return out.sort((a, b) => PRIORIDAD[a.tipo] - PRIORIDAD[b.tipo]).slice(0, max);
}

/* ------------------------------------------------------ seguimiento con el tema anterior */
let temaAnterior: string | null = null;
/* Se llama con cada búsqueda que responde algo y tiene tema propio. */
export function recordarTema(q: string) {
  if (q.trim().length >= 3 && !seguimiento(q)) temaAnterior = q;
}
/* «y en Omnipod 5» → la búsqueda anterior con ese sistema; null si no es un seguimiento. */
export function consultaEfectiva(q: string): string | null {
  return conContextoDe(q, temaAnterior);
}
