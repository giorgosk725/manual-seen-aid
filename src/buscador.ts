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
import { CATALOGO_SISTEMAS } from "./ampliacion/ids";
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
import { ALIAS as ALIAS_SITUACION, SIS_IDS, SITUACIONES, SITUACIONES_GUIA } from "./situaciones";
import { tituloDeTarea } from "./inicio";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";
import { OBJETIVOS_MCG } from "./contenido/diagramas";
import { CASOS_INDICE } from "./casos-indice";

/* Lo ligero sigue disponible desde aquí para quien ya carga el índice. */
export * from "./busqueda";
/* «Preguntas al capítulo»: la respuesta literal (va en el mismo trozo que el índice). */
export {
  coberturaDe,
  conContexto,
  contextoDe,
  datoCorto,
  esSeguimiento,
  faqsCercanas,
  frecuentesRelacionadas,
  fusionar,
  numeroDePaso,
  partesDe,
  preguntaFrecuente,
  responder,
  respuestaDeFrecuente,
  respuestaPorId,
  sistemaNoCubierto,
  type RespuestaFrecuente,
} from "./respuestas";
import {
  conContexto as conContextoDe,
  esSeguimiento as seguimiento,
  numeroDePaso as pasoPedido,
} from "./respuestas";
import { FRECUENTES, type Frecuente } from "./frecuentes";
import { HOJAS_EXTRA } from "./hojas";
import { CON_AMPLIACION, CON_CASOS, retirado } from "./edicion";
import { diagramaEnEdicion, rutaDeDiagrama } from "./diagramasRetirados";

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
  // Solo los de esta edición (0.72.2: los retirados se indexaban y llevaban a la galería).
  for (const d of DIAGRAMAS.filter((x) => diagramaEnEdicion(x.id))) {
    out.push({
      id: `diagrama/${d.id}`,
      tipo: "diagrama",
      titulo: `Diagrama: ${d.titulo}`,
      texto: `${d.titulo}. ${d.resumen}`,
      pagina: d.paginas[0],
      ruta: rutaDeDiagrama(d.id),
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
  // Fuera del capítulo (grupo aparte, rotulado). No en la edición editorial (A06).
  for (const s of CON_AMPLIACION ? SISTEMAS_AMPLIACION : []) {
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
  // Los ocho pasos de «Interpretación de la descarga» (Tabla 5): «paso 7», «respuesta automática DTD»…
  TABLAS.T5.filas.forEach((f, i) => {
    out.push({
      id: `atajo/descarga/${i + 1}`,
      tipo: "atajo",
      titulo: `Interpretación de la descarga · paso ${i + 1}: ${f.celdas[0]}`,
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
  for (const st of SITUACIONES_GUIA)
    out.push({
      id: `atajo/sit/${st.id}`,
      tipo: "atajo",
      titulo: `Situaciones · ${st.etiqueta}`,
      texto: `${st.etiqueta}. ${st.intro} ${st.guion.map((m) => m.rotulo).join(". ")}. ${NOMBRES}`,
      pagina: st.pagina,
      ruta: href("consultar", "situacion", st.id),
    });
  for (const s of CATALOGO_SISTEMAS)
    out.push({
      id: `atajo/sis/${s.id}`,
      tipo: "atajo",
      titulo: `Ficha del sistema · ${s.name}`,
      texto: `${s.name} ${s.short}: lo que dice el capítulo (Tablas 1, 3 y 4), parámetros configurables en modo automático, algoritmo y sensores.`,
      pagina: TABLAS.T1.paginas[0],
      pagina2: TABLAS.T1.paginas[1],
      ruta: href("sistemas", s.id),
    });
  for (const pob of OBJETIVOS_MCG)
    out.push({
      id: `atajo/mcg/${pob.id}`,
      tipo: "atajo",
      titulo: `Objetivos de MCG · ${pob.nombre}`,
      // Sin «no gestantes» en el texto que se busca: «gestante» tiene que llevar a la gestación
      // (0.72.0, auditoría de guardia).
      texto: `Objetivos de MCG (TIR, TBR, TAR) · ${pob.nombre.replace(/\s*no gestantes?/i, "")}`,
      pagina: pob.pagina,
      ruta: href("visual", "objetivos-mcg", pob.id),
    });
  for (const [titulo, texto, pagina, ruta] of [
    [
      "Hiperglucemia y cetonemia",
      "Cetonemia, cetonas, β-OHB, cetosis, fallo de infusión, hiperglucemia persistente: qué hacer según el tramo",
      8,
      href("consultar", "figura-3"),
    ],
    [
      "Ejercicio aeróbico planificado (Tabla 4)",
      "Ejercicio, deporte, modo actividad, función actividad, modo ejercicio, objetivo temporal, objetivo de ejercicio, modos temporales: qué función usar en cada sistema",
      11,
      href("consultar", "situacion", "ejercicio-aerobico"),
    ],
    [
      "Interpretación de la descarga (Tabla 5)",
      "Interpretación de la descarga en consulta: los ocho pasos de la Tabla 5 y sus patrones",
      13,
      href("consultar", "descarga", "1"),
    ],
    [
      "Interrupción del sistema",
      "Interrupción o desconexión del sistema: cuánto dura y qué hacer, pauta alternativa; el pod o la bomba fallan, sin repuesto ni material, volver a plumas",
      9,
      href("consultar", "interrupcion"),
    ],
    [
      "Iniciación del sistema (apartado 8, Tabla 2)",
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
      "Explorar criterios de elección",
      "Elegir, elección, criterios, indicación, edad, peso, dosis total diaria, gestación, diabetes tipo 2, pod o bomba con catéter, sensor compatible, dónde está el algoritmo: los factores del apartado 6 y la Figura 2 y las celdas de la Tabla 1",
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
    if (!(ruta === href("repaso") && retirado("repaso")))
      out.push({ id: `atajo/${ruta}`, tipo: "atajo", titulo, texto, pagina, ruta });
  // Casos guiados y ejemplos comentados de la app: para que «ejemplo de descarga» o «practicar
  // con un caso» lleven al caso, no a un pasaje que contiene «por ejemplo».
  for (const c of CON_CASOS ? CASOS_INDICE : [])
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
      titulo: `Información para pacientes (PDF) · ${s.pregunta}`,
      texto: s.parrafos.join(" "),
      pagina: 0,
      // 0.70.0: el texto está en el PDF publicado (sin la versión en pantalla).
      ruta: "pdf/manual-seen-aid-pacientes.pdf",
    });
  RESUMEN_CAPITULO.parrafos.forEach((t, i) =>
    out.push({
      id: `resumen/${i}`,
      tipo: "resumen",
      titulo: "Resumen del capítulo",
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
  // «tabla 4 omnipod»: la Tabla 4 de ese sistema (0.72.0).
  [/tabla 4|\bt4\b/, "tabla4", "Tabla 4"],
  [/par[aá]metro|configur|ajust|cambiar|tocar|modific/, "parametros", "Parámetros"],
  [/c[oó]mo funciona|algoritmo/, "funciona", "Cómo funciona"],
  [/situaci/, "situaciones", "Situaciones"],
  [/ficha t[eé]cnica|ampliaci/, "ampliacion", "Ampliación técnica"],
].filter(([, id]) => !retirado(id as string)) as [RegExp, string, string][];
export function recursosPedidos(consulta: string, res: Resultado[]): Resultado[] {
  // El sistema nombrado no es una palabra del recurso: va en la ruta («…:minimed-780g»).
  const terminos = terminosDe(consulta)
    .map((v) => v[0])
    .filter((w) => !ALIAS_SISTEMA.some((re) => re.test(w)) && w !== "5");
  const sis = sistemaDeConsulta(consulta);
  // Solo el nombre de un sistema o de su fabricante («medtronic», «omnipod»): su ficha (0.72.0).
  if (!terminos.length) {
    const s = sis >= 0 && sistemasDeConsulta(consulta).length === 1 ? CATALOGO_SISTEMAS[sis] : null;
    return s
      ? [
          {
            entrada: {
              id: `recurso/ficha/${s.id}`,
              tipo: "atajo",
              titulo: `Ficha del sistema · ${s.name}`,
              texto: "",
              pagina: TABLAS.T1.paginas[0],
              ruta: href("sistemas", s.id),
            },
            fragmento: "",
            puntos: 0,
          },
        ]
      : [];
  }
  const out: Resultado[] = [];
  const n = normalizar(consulta);
  const atajo = (id: string, titulo: string, ruta: string, pagina: number): Resultado => ({
    entrada: { id, tipo: "atajo", titulo, texto: "", pagina, ruta },
    fragmento: "",
    puntos: 0,
  });
  // 0.77.1 (auditoría de guardia): hiperglucemia con el set, el catéter o el pod en duda es la
  // sospecha de fallo de infusión (Tabla 4 y Figura 3), no la hiperglucemia puntual.
  if (
    /hiperglu|glucosa alta|glucemia alta|cetona|cetonemia/.test(n) &&
    /\b(set|cateter|canula|pod|reservorio|fallo|falla|no funciona|obstru|infusion)\b/.test(n)
  )
    out.push(
      atajo(
        "recurso/sospecha-fallo",
        "Hiperglucemia persistente o inexplicada (sospecha de fallo)",
        href(
          "consultar",
          "situacion",
          sis >= 0 ? `hiperglucemia-persistente:${SIS_IDS[sis]}` : "hiperglucemia-persistente",
        ),
        TABLAS.T4.paginas[0],
      ),
      atajo(
        "recurso/figura-3",
        "Hiperglucemia y cetonemia (Figura 3)",
        href("consultar", "figura-3"),
        9,
      ),
    );
  // 0.77.1 (auditoría R5): «pasar de 780G a Control-IQ»: los parámetros de los dos, comparados.
  {
    const dos = sistemasDeConsulta(consulta);
    if (dos.length >= 2 && /\b(cambi|pasar|paso de|pase de|migr|sustitu|de .+ a )/.test(n))
      out.push(
        atajo(
          `recurso/cambio/${dos.join("+")}`,
          `Parámetros de ${dos.map((i) => TABLAS.T1.columnas[i]).join(" y ")}`,
          href("sistemas", dos.map((i) => ORDEN_SISTEMAS[i]).join("+"), "parametros"),
          TABLAS.T3.paginas[0],
        ),
      );
  }
  // 0.77.1 (auditoría R3): «descarga CamAPS» abre el análisis desde el primer paso.
  if (/\bdescarga|\bdescargar|analisis de la descarga/.test(n) && !pasoPedido(consulta))
    out.push(
      atajo(
        "recurso/descarga",
        "Interpretación de la descarga",
        href("consultar", "descarga"),
        TABLAS.T5.paginas[0],
      ),
    );
  // «Iniciar Omnipod 5 desde MDI»: el recorrido de inicio para ese sistema, el primero.
  // «Diferencia entre 780G y Omnipod 5»: la comparación de los dos (Tabla 1), la primera.
  const varios = sistemasDeConsulta(consulta);
  if (
    varios.length >= 2 &&
    /diferenci|compar|frente a|versus|\bvs\b|distin|entre/.test(normalizar(consulta))
  ) {
    const nombres = varios.map((i) => TABLAS.T1.columnas[i]);
    out.push({
      entrada: {
        id: `recurso/comparar/${varios.join("+")}`,
        tipo: "atajo",
        titulo: `Comparar ${nombres.join(" y ")} (Tabla 1)`,
        texto: "",
        pagina: TABLAS.T1.paginas[0],
        pagina2: TABLAS.T1.paginas[1],
        ruta: href("sistemas", varios.map((i) => ORDEN_SISTEMAS[i]).join("+"), "esencial"),
      },
      fragmento: "",
      puntos: 0,
    });
  }
  if (
    sis >= 0 &&
    /\b(inici|empez|comenz|arranc|poner en marcha|pasar a (la |una )?bomba|desde mdi|multiples dosis|desde (las )?plumas|pasar de (las )?(plumas|bolis)|dejar (las |los )?(plumas|bolis)|cambiar de (las |los )?(mdi|plumas|bolis)|de (las |los )?(plumas|bolis) a|pasar de mdi|empezar (con )?(una |la )?bomba|viniendo de|transici|pauta bolo|bolo-basal)/.test(
      normalizar(consulta),
    )
  ) {
    const nombre = TABLAS.T1.columnas[sis];
    out.push({
      entrada: {
        id: `recurso/inicio/${SIS_IDS[sis]}`,
        tipo: "atajo",
        titulo: `Iniciación del sistema · ${nombre}`,
        texto: "",
        pagina: TABLAS.T2.paginas[0],
        ruta: href("consultar", "inicio", `preparacion:${SIS_IDS[sis]}`),
      },
      fragmento: "",
      puntos: 0,
    });
  }
  if (sis >= 0) {
    const sec = SECCION_PEDIDA.find(([re]) => re.test(normalizar(consulta)));
    if (sec) {
      const s = CATALOGO_SISTEMAS[sis];
      out.push({
        entrada: {
          id: `recurso/${s.id}/${sec[1]}`,
          tipo: "atajo",
          titulo: `${sec[2]} · ${s.name}`,
          texto: "",
          pagina: TABLAS.T1.paginas[0],
          ruta:
            sec[1] === "situaciones"
              ? href("consultar", "situacion", `:${SIS_IDS[sis]}`)
              : sec[1] === "tabla4"
                ? href("consultar", "tablas", `T4:${SIS_IDS[sis]}`)
                : href("sistemas", s.id, sec[1]),
        },
        fragmento: "",
        puntos: 0,
      });
    }
  }
  // «paso 7» pide ese paso, no los ocho.
  const paso = pasoPedido(consulta)?.toString();
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
          titulo: `Interpretación de la descarga · paso ${paso}: ${f.celdas[0]}`,
          texto: "",
          pagina: TABLAS.T5.paginas[0],
          pagina2: TABLAS.T5.paginas[1],
          ruta: href("consultar", "descarga", paso),
        },
        fragmento: "",
        puntos: 0,
      });
  }
  // «Hoja para el paciente antes de una resonancia»: la hoja pedida, la primera.
  if (/\b(hoja|paciente|entregar)/.test(normalizar(consulta))) {
    const HOJA_PEDIDA: [RegExp, string][] = [
      [/reson|\btc\b|\btac\b|cirug|quirof|prueba|explorac|radiolog|endoscop/, "pruebas-cirugia"],
      [/ceton|bohb|β-ohb/, "cetonas"],
    ];
    const id = HOJA_PEDIDA.find(([re]) => re.test(normalizar(consulta)))?.[1];
    const h = id ? HOJAS_EXTRA.find((x) => x.id === id) : undefined;
    if (h)
      out.unshift({
        entrada: {
          id: `recurso/hoja/${h.id}`,
          tipo: "atajo",
          titulo: `${h.rotulo} · ${h.titulo}`,
          texto: "",
          pagina: 0,
          ruta: href("pacientes", "hoja", h.id),
        },
        fragmento: "",
        puntos: 0,
      });
  }
  // 0.72.0: la consulta que nombra una urgencia abre su herramienta (sin elegir rama: A01).
  // «cetonas» no casaba con «cetonemia» por la raíz de seis letras.
  if (!/\b(hoja|paciente|entregar)/.test(normalizar(consulta))) {
    const HERRAMIENTA: [RegExp, string, string][] = [
      [
        /ceton|\bbohb\b|β-ohb|cetosis|cetoacid/,
        "Hiperglucemia y cetonemia (Figura 3)",
        href("consultar", "figura-3"),
      ],
      [/hipogluc|\bhipos?\b/, "Hipoglucemia en asa cerrada", href("visual", "hipoglucemia")],
      [
        /interrup|desconect|repuesto|se ha roto|averi|falla (el |la )?(pod|bomba)|(pod|bomba) (que )?falla|(quit|retir)(ar|o|amos)? (la |el )?(bomba|pod)/,
        "Interrupción del sistema",
        href("consultar", "interrupcion"),
      ],
      [
        /modo actividad|funcion actividad|objetivo temporal|modo ejercicio|objetivo de ejercicio|ease-?off/,
        "Ejercicio aeróbico planificado (Tabla 4)",
        // Con el sistema nombrado, su conducta («objetivo temporal 780G»).
        href("consultar", "situacion", `ejercicio-aerobico${sis >= 0 ? `:${SIS_IDS[sis]}` : ""}`),
      ],
      [
        /cateter|canula|set de infusion/,
        "Tipos de catéter y cánula (apartado 9)",
        href("capitulo", "09-descarga", "b25"),
      ],
      [
        /(?<!no )gestan|embaraz|gestacion|\bparto\b|posparto/,
        "Situaciones · Gestación, parto y posparto",
        href("consultar", "situacion", "gestacion"),
      ],
    ];
    const n = normalizar(consulta);
    // Con una cifra de cetonas, el aviso de la Figura 3 completa ya va el primero (A01).
    for (const [re, titulo, ruta] of HERRAMIENTA)
      if (re.test(n) && !(ruta === href("consultar", "figura-3") && /\d/.test(n)))
        out.push({
          entrada: {
            id: `recurso/herramienta/${ruta}`,
            tipo: "atajo",
            titulo,
            texto: "",
            pagina: 0,
            ruta,
          },
          fragmento: "",
          puntos: 0,
        });
  }
  // 0.72.0: una exploración nombrada por su sigla o su nombre corriente («camaps tc»): su
  // situación, con el sistema si lo hay.
  {
    const palabras = normalizar(consulta).split(/[^a-z0-9ñ]+/);
    const exp = ["rm", "tc", "rx", "pet", "diatermia", "eco"].find((id) =>
      (ALIAS_SITUACION[id] ?? []).some((a) =>
        a.includes(" ") ? normalizar(consulta).includes(a) : palabras.includes(a),
      ),
    );
    const sit = exp ? SITUACIONES.find((x) => x.id === exp) : undefined;
    if (sit)
      out.push({
        entrada: {
          id: `recurso/situacion/${sit.id}`,
          tipo: "atajo",
          titulo: `Situaciones · ${sit.etiqueta}`,
          texto: "",
          pagina: 0,
          ruta: href("consultar", "situacion", `${sit.id}${sis >= 0 ? `:${SIS_IDS[sis]}` : ""}`),
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
      // Sin lo negado del título: «gestante» no abre «Adultos no gestantes» (0.72.0).
      const t = normalizar(
        r.entrada.tipo === "caso" ? `${r.entrada.titulo} ${r.entrada.texto}` : r.entrada.titulo,
      )
        .replace(/\bno [a-zñ]+/g, " ")
        .split(/[^a-z0-9ñ]+/)
        .map(raiz);
      return { r, f: terminos.filter((x) => t.includes(raiz(x))).length / terminos.length };
    })
    .filter((x) => x.f >= 0.6)
    .sort((a, b) => b.f - a.f || b.r.puntos - a.r.puntos)
    .map((x) => x.r);
  // Un solo «Abrir» por destino y por título (0.77.1, auditoría R5: «Resonancia magnética»
  // salía dos veces, con y sin el sistema en la ruta).
  const vistos = new Set<string>();
  const nuevo = (k: string) => !vistos.has(k) && !!vistos.add(k);
  return [...out, ...nombrados]
    .filter((r) => {
      const a = nuevo(r.entrada.ruta);
      const b = nuevo(`t:${normalizar(r.entrada.titulo)}`);
      return a && b;
    })
    .slice(0, 2);
}

const palabrasDeSistema = (consulta: string) =>
  // «control iq» en dos palabras cuenta como una.
  normalizar(consulta)
    .replace(/control[\s-]*iq\+?/g, "control-iq")
    .split(/\s+/);
function sistemaDeConsulta(consulta: string): number {
  const palabras = palabrasDeSistema(consulta);
  return ALIAS_SISTEMA.findIndex((re) => palabras.some((w) => re.test(w)));
}
/* Todos los sistemas que nombra la consulta (índices de columna, en el orden de la Tabla 1). */
function sistemasDeConsulta(consulta: string): number[] {
  const palabras = palabrasDeSistema(consulta);
  return ALIAS_SISTEMA.map((re, i) => (palabras.some((w) => re.test(w)) ? i : -1)).filter(
    (i) => i >= 0,
  );
}
/* El sistema que nombra la consulta (índice de columna) o -1: la tarjeta lo pone primero. */
export const sistemaNombrado = sistemaDeConsulta;

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
  ["Interpretación de la descarga (Tabla 5, ocho pasos)", href("consultar", "descarga", "1")],
  ["Iniciación del sistema (apartado 8)", href("consultar", "inicio")],
  ["Explorar criterios de elección (apartado 6 y Tabla 1)", href("sistemas", "elegir")],
  ["Comparar sistemas (Tabla 1)", href("sistemas", "todos", "esencial")],
  ["Parámetros por sistema (Tabla 3)", href("sistemas", "todos", "parametros")],
  ["Hiperglucemia y cetonemia", href("consultar", "figura-3")],
  ["Interrupción del sistema", href("consultar", "interrupcion")],
  ["Hojas para el paciente", href("pacientes")],
  ...(retirado("casos")
    ? []
    : [
        ["Ejemplo comentado de una descarga", href("casos", "ejemplo-descarga")] as [
          string,
          string,
        ],
      ]),
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
  for (const st of [...SITUACIONES, ...SITUACIONES_GUIA])
    if (empiezaPor(st.etiqueta, terminos))
      add({ texto: st.etiqueta, tipo: "situacion", ruta: href("consultar", "situacion", st.id) });
  for (const s of CATALOGO_SISTEMAS)
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
/* Una búsqueda propia sin respuesta, o «Buscar solo …»: la siguiente no hereda un tema de dos
   búsquedas atrás (0.72.2: «ejercicio control-iq», «precio del omnipod», «780G» daba
   «ejercicio 780g»). */
export function olvidarTema() {
  temaAnterior = null;
}
/* «y en Omnipod 5» → la búsqueda anterior con ese sistema; null si no es un seguimiento. */
export function consultaEfectiva(q: string): string | null {
  // Escribir letra a letra no es un seguimiento: si una consulta empieza por la otra, es la
  // misma que se está escribiendo o borrando («cam», «camaps», «camaps tc») (0.72.0).
  if (temaAnterior) {
    const a = normalizar(q.trim());
    const b = normalizar(temaAnterior.trim());
    if (a.startsWith(b) || b.startsWith(a)) return null;
  }
  return conContextoDe(q, temaAnterior);
}

/* La continuación operativa de una respuesta que es una fila de la Tabla 2 o la Tabla 3: la
   tarea de «Iniciación del sistema» que la trabaja, con el sistema nombrado si lo hay. */
const TAREA_DE_T2: Record<number, string> = {
  0: "respaldo",
  1: "arranque",
  2: "transicion",
  3: "parametros",
  4: "parametros",
  5: "parametros",
  6: "objetivos",
  7: "objetivos",
  8: "transicion",
};
export function continuacionDe(
  id: string,
  sistema: number,
): { texto: string; ruta: string } | null {
  const m = /^T([23])\/(\d+)$/.exec(id);
  if (!m) return null;
  const tarea = m[1] === "2" ? TAREA_DE_T2[Number(m[2])] : "parametros";
  if (!tarea) return null;
  const titulo = tituloDeTarea("inicio", tarea);
  if (!titulo) return null;
  const sis = sistema >= 0 ? SIS_IDS[sistema] : "";
  const nombre = sistema >= 0 ? ` (${TABLAS.T1.columnas[sistema]})` : "";
  return {
    texto: `Iniciación del sistema · ${titulo}${nombre}`,
    ruta: href("consultar", "inicio", `inicio:${sis}:${tarea}`),
  };
}
