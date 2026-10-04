/* «Preguntas al capítulo»: el buscador que responde (misma idea que «Preguntas» del asistente).
   Sin inteligencia generativa: cada respuesta es texto LITERAL del capítulo —una frase, un
   punto de una lista, una fila de tabla (la casilla del sistema si se nombra uno), un tramo
   de la Figura 3 o una sigla del glosario— con su página y el enlace a donde está. Si nada
   contesta, no se fuerza: «no consta» (lista vacía).

   Cómo lee la pregunta: quita las palabras vacías, reduce cada palabra a su raíz, añade
   equivalentes de la consulta diaria (LEXICO) y de expresiones enteras (FRASES), tolera una
   errata, pesa más las palabras raras (IDF) y exige que la respuesta cubra la pregunta.
   Si se nombra un sistema, la fila de tabla responde con su casilla. Con una cifra de
   cetonemia, el tramo de la Figura 3. Ante «qué hago…», la conducta va antes que la sigla;
   ante «qué es…», la sigla primero.

   Se carga con el índice de búsqueda (trozo perezoso). Banco de preguntas en
   respuestas.test.ts: se mide el acierto de la primera respuesta. */
import {
  APARTADOS,
  FIGURA3,
  FIGURAS,
  GLOSARIO,
  LISTA_TABLAS,
  idDeBloque,
  type Tabla,
} from "./contenido";
import { href } from "./rutas";
import { plano } from "./marcado";
import { normalizar, tramoDeConsulta, type Respuesta } from "./busqueda";
import { SIS_IDS, SITUACIONES } from "./situaciones";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";

export type { Respuesta };

/* ---------------------------------------------------------------- palabras */

const STOP = new Set(
  (
    "que cual cuales como cuando donde cuanto cuanta cuantos cuantas quien por para con sin " +
    "sobre entre de del la el los las lo un una unos unas y o u e a en es son ser esta estan " +
    "estar hay tiene tienen tener tengo puede pueden puedo se su sus mi mis al le les si no mas " +
    "menos muy ya tambien pero este esta estos estas ese esa eso hacer hago hace debo debe deben " +
    "deberia ante bajo desde hasta cada me te nos os paciente persona sistema " +
    "ir voy vas va poner pongo llevar llevo lleva usa usan da dan dar hacen siempre bien " +
    "poco poca pocos pocas mucho mucha muchos muchas demasiado demasiada demasiados " +
    "demasiadas tanto tanta algun alguna suenan suena pitan pita tomo tomar llama llaman " +
    "sistemas dispositivo usar uso algo mejor pasa ocurre favor otra otro hay vez veces modo dos " +
    "tres alta alto " +
    "significa significado definicion quiere decir"
  ).split(" "),
);

/* Raíz tosca: plural y género («objetivos» = «objetivo», «nocturnas» = «nocturno»). */
const raiz = (w: string) => {
  if (w.length <= 4) return w;
  const sinPlural = w.replace(/(es|s)$/, "");
  return sinPlural.length > 5 ? sinPlural.replace(/[ao]$/, "") : sinPlural;
};

/* Formas fijas: β-OHB en cualquiera de sus escrituras es «bohb»; Control-IQ, una palabra. */
const unificar = (s: string) =>
  normalizar(s)
    .replace(/β[- ]?ohb|β[- ]?hidroxibutirato|beta[- ]?hidroxibutirato/g, " bohb ")
    .replace(/\b(?:b|beta)[- ]?ohb\b/g, " bohb ")
    // «no gestantes» es un término: no casa con «embarazo».
    .replace(/\bno gestantes?\b/g, " nogestante ")
    .replace(/control[- ]?iq\+?/g, " controliq ")
    .replace(/t:?slim/g, " tslim ")
    .replace(/minimed\s*780\s*g?|\b780\s*g\b|\b780\b/g, " 780g ")
    .replace(/omnipod\s*5/g, " omnipod ")
    .replace(/modo (manual|automatico|sueno|ejercicio)/g, " modo$1 $1 ")
    .replace(/ease[- ]off/g, " easeoff ")
    .replace(/i[- ]?sglt-?2/g, " isglt2 ")
    .replace(/u[-– ]?(100|300)/g, " u$1 ")
    .replace(/(\d)\s?h\b/g, "$1 horas")
    .replace(/(\d)\s?min\b/g, "$1 minutos");

export function palabras(s: string): string[] {
  return unificar(s)
    .replace(/[^a-z0-9ñ%\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 || /\d/.test(w));
}

/* Distancia de edición ≤ 1: una errata. */
function casiIgual(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let dif = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++dif > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return dif + (a.length - i) + (b.length - j) <= 1;
}

/* ¿Casa la raíz de la pregunta con la del texto? Igual; o prefijo (lo tecleado a medias,
   ≥ 5 letras); o la misma palabra con otra terminación («desconectado»/«desconectar»). */
function casa(t: string, w: string, prefijo = false) {
  if (t === w) return true;
  if (prefijo && t.length >= 5 && w.length - t.length <= 4 && w.startsWith(t)) return true;
  const corta = Math.min(t.length, w.length);
  if (corta < 7) return false;
  let k = 0;
  while (k < corta && t[k] === w[k]) k++;
  return k >= corta - 2 && k >= Math.ceil(0.7 * Math.max(t.length, w.length));
}

/* Cómo se nombra cada sistema (columna de las Tablas 1, 3 y 4). */
const ALIAS_SISTEMA: Record<string, number> = {
  "780g": 0,
  minimed: 0,
  medtronic: 0,
  smartguard: 0,
  controliq: 1,
  tandem: 1,
  tslim: 1,
  mobi: 1,
  camaps: 2,
  myloop: 2,
  ypsomed: 2,
  ypsopump: 2,
  mylife: 2,
  omnipod: 3,
  pod: 3,
  smartadjust: 3,
  insulet: 3,
};

/* Equivalentes de la consulta diaria → palabras que usa el capítulo. */
const LEXICO: Record<string, string[]> = {
  cetona: ["cetonemia", "cetosis", "bohb"],
  cetonas: ["cetonemia", "cetosis", "bohb"],
  cetonemia: ["bohb", "cetosis"],
  cetosis: ["cetonemia", "bohb"],
  azucar: ["glucosa", "glucemia", "hidratos"],
  embarazo: ["gestacion", "gestante"],
  embarazada: ["gestacion", "gestante"],
  gestante: ["gestacion"],
  nadar: ["acuaticas", "inmersion"],
  natacion: ["acuaticas", "inmersion"],
  piscina: ["acuaticas", "inmersion"],
  playa: ["acuaticas", "inmersion"],
  ducha: ["bano"],
  ducharse: ["bano"],
  banarse: ["bano"],
  operacion: ["cirugia", "quirurgico", "intervencion"],
  operar: ["cirugia", "quirurgico", "intervencion"],
  quirofano: ["cirugia", "quirurgico", "intervencion"],
  intervencion: ["cirugia", "quirurgico"],
  cirugia: ["quirurgico", "intervencion", "perioperatorio"],
  ingreso: ["hospitalizacion", "hospitalario", "hospitalizada"],
  ingresado: ["ingreso", "hospitalizacion", "hospitalario"],
  hospital: ["hospitalario", "hospitalizacion", "ingreso"],
  hospitalizado: ["ingreso", "hospitalizacion", "hospitalario"],
  resonancia: ["rm"],
  rm: ["resonancia"],
  rmn: ["resonancia", "rm"],
  tac: ["tc", "tomografia"],
  tc: ["tomografia"],
  escaner: ["tc", "tomografia", "aeroportuarios"],
  scanner: ["tc", "tomografia", "aeroportuarios"],
  aeropuerto: ["aeroportuarios"],
  avion: ["aeroportuarios", "viajes"],
  viaje: ["viajes", "aeroportuarios"],
  rx: ["radiografia"],
  rayos: ["radiografia"],
  corticoides: ["glucocorticoides"],
  cortisona: ["glucocorticoides"],
  prednisona: ["glucocorticoides"],
  dexametasona: ["glucocorticoides"],
  hemodialisis: ["dialisis"],
  desconectar: ["desconexion", "desconectarse", "interrupcion"],
  desconectado: ["desconexion", "desconectarse", "interrupcion"],
  desconexion: ["desconectarse", "interrupcion"],
  quitar: ["retirar", "retirada", "desconectarse"],
  quitarme: ["retirar", "retirada", "desconectarse"],
  retirar: ["retirada", "retirarse"],
  despega: ["despegado", "adhesivo"],
  despegado: ["adhesivo"],
  nino: ["pediatria", "pediatrica"],
  ninos: ["pediatria", "pediatrica"],
  infantil: ["pediatria", "pediatrica"],
  mayores: ["mayor", "fragilidad"],
  anciano: ["mayor", "fragilidad"],
  ancianos: ["mayor", "fragilidad"],
  fragil: ["fragilidad"],
  fragiles: ["fragilidad"],
  adolescente: ["adolescencia"],
  adolescentes: ["adolescencia"],
  joven: ["adolescencia"],
  carbohidratos: ["hidratos"],
  hc: ["hidratos"],
  zumo: ["azucarados", "liquidos"],
  refresco: ["azucarados", "liquidos"],
  beber: ["liquidos", "hidratacion"],
  bebida: ["liquidos", "hidratacion"],
  agua: ["hidratacion", "liquidos"],
  boli: ["pluma"],
  inyeccion: ["pluma"],
  plumas: ["pluma", "mdi"],
  olvidado: ["omitido", "omision", "retrasado"],
  olvide: ["omitido", "omision", "retrasado"],
  olvido: ["omitido", "omision", "retrasado"],
  salta: ["omision", "omitido"],
  saltarse: ["omision", "omitido"],
  correr: ["ejercicio", "actividad"],
  deporte: ["ejercicio", "actividad"],
  gimnasio: ["ejercicio", "actividad"],
  bici: ["ejercicio", "actividad"],
  pesas: ["anaerobico", "fuerza"],
  fuerza: ["anaerobico"],
  noche: ["nocturna", "nocturno", "sueno"],
  dormir: ["nocturna", "nocturno", "sueno"],
  dormido: ["nocturna", "sueno"],
  autocorrecciones: ["autocorreccion", "correccion"],
  sensibilidad: ["fsi"],
  fsi: ["sensibilidad"],
  ratio: ["ratios", "hidratos"],
  icr: ["ratio"],
  gripe: ["enfermedad", "intercurrente"],
  fiebre: ["enfermedad", "intercurrente"],
  enfermo: ["enfermedad", "intercurrente"],
  vomitos: ["vomitos", "enfermedad"],
  edad: ["anos", "menores"],
  autorizado: ["autorizacion", "marcado", "ce"],
  autorizados: ["autorizacion", "marcado", "ce"],
  aprobado: ["autorizacion", "marcado"],
  coinciden: ["discrepancias", "discordancia"],
  coincide: ["discrepancias", "discordancia"],
  diferente: ["discrepancias", "discordancia"],
  alarma: ["alarmas", "alertas"],
  alarmas: ["alertas"],
  intravenosa: ["perfusion", "intravenosa"],
  perfusion: ["intravenosa"],
  reanudar: ["reanudarse", "reiniciar", "reanudacion"],
  reconectar: ["reconexion", "reanudarse"],
  modificar: ["modificarse", "ajustar", "cambiar"],
  cambiar: ["modificarse", "recambio"],
  revisar: ["revision", "seguimiento", "contacto"],
  revision: ["seguimiento", "contacto", "visita"],
  bolo: ["bolos"],
  parto: ["parto", "posparto"],
  respaldo: ["respaldo", "alternativa"],
  costo: ["coste"],
  pica: ["irritacion", "dermatitis", "cutaneos"],
  picor: ["irritacion", "dermatitis", "cutaneos"],
  escuece: ["irritacion", "ardor", "cutaneos"],
  rojez: ["irritacion", "dermatitis", "cutaneos"],
  piel: ["cutaneos", "irritacion", "dermatitis"],
  desayuno: ["comida", "ingesta", "prandial", "posprandial"],
  merienda: ["comida", "ingesta", "prandial"],
  cenar: ["cena", "comida", "ingesta"],
  hipo: ["hipoglucemia"],
  nocturno: ["noche", "nocturna"],
  nocturna: ["noche", "nocturno"],
  hipos: ["hipoglucemia"],
  movil: ["telefono", "aplicacion"],
  telefono: ["movil", "aplicacion"],
  app: ["aplicacion", "telefono"],
  padres: ["progenitores", "cuidadores", "familiar"],
  padre: ["progenitores", "cuidadores"],
  madre: ["progenitores", "cuidadores"],
  familia: ["familiar", "progenitores", "cuidadores"],
  siguen: ["seguimiento"],
  sigue: ["seguimiento"],
  seguir: ["seguimiento"],
  manana: ["matutina", "alba", "despertar"],
  madrugada: ["matutina", "alba", "nocturna"],
  comer: ["comida", "ingesta", "prandial", "posprandial"],
  comida: ["ingesta", "prandial"],
  cena: ["comida", "ingesta", "prandial"],
  pizza: ["grasa", "proteina", "grasas", "proteicas"],
  pierde: ["perdida", "perdidas"],
  pierdo: ["perdida", "perdidas"],
  perdida: ["perdidas"],
  falla: ["fallo"],
  fallo: ["falla"],
  fallan: ["fallo"],
  glucosa: ["glucemia"],
  glucemia: ["glucosa"],
  urgencias: ["urgente", "hospitalaria", "urgencia"],
  despues: ["tras", "posterior"],
  reducir: ["reduce", "reduccion", "reducirse"],
  empezar: ["iniciar", "inicio"],
  comenzar: ["iniciar", "inicio"],
  inicial: ["inicio", "iniciales"],
  larga: ["prolongada", "prolongadas", "compleja"],
  largo: ["prolongado", "prolongada"],
  pasar: ["volver", "transicion"],
  volver: ["reanudar", "reanudarse"],
  tir: ["tirp"],
  tbr: ["tbrp"],
  tar: ["tarp"],
};

/* Expresiones enteras → palabras del capítulo (sobre la pregunta ya normalizada). */
type Modo = "sustituye" | "suma";
const FRASES: [RegExp, string, Modo][] = [
  [
    /(glucosa|glucemia|azucar)\s+(alta|elevada|subida|disparada|por encima)|me sube (la )?(glucosa|azucar)/,
    "hiperglucemia persistente",
    "sustituye",
  ],
  [
    /(glucosa|glucemia|azucar)\s+(baja|bajando)|bajon|bajada de (azucar|glucosa)/,
    "hipoglucemia",
    "sustituye",
  ],
  [/no (me )?baja|no desciende|no responde|no bajan/, "desciende correccion", "sustituye"],
  [
    /cuanto (tiempo )?(puedo|se puede|podemos)? ?(estar )?(desconectad[oa]|desconectar(me|se)?|sin (la )?bomba|sin insulina|sin el sistema)/,
    "interrupcion administracion insulina",
    "sustituye",
  ],
  [/a partir de (que|cuantos) (edad|anos)|edad minima|que edad/, "anos menores", "sustituye"],
  [/(cuando|a que hora).*(reanud|volver|reconect|poner otra vez)/, "reanudarse", "suma"],
  [
    /no coinciden?|no cuadra|discrepa\w*|distint[oa]s? (de|a) la capilar/,
    "discrepancias",
    "sustituye",
  ],
  [/cuant[oa]s? (hidratos|gramos|carbohidratos)/, "hidratos cantidades g", "sustituye"],
  [/(se )?salta(rse)? (los )?bolos|no se pone (los )?bolos/, "omision bolos", "sustituye"],
  [/pasar de mdi|de plumas a (la )?bomba|desde mdi/, "mdi transicion", "sustituye"],
  [
    /(cuando|cada cuanto) (revisar|ver|citar)|primeras visitas|seguimiento inicial/,
    "seguimiento contacto revision",
    "sustituye",
  ],
  [/cuanto (modificar|cambiar|subir|bajar)/, "modificarse", "sustituye"],
  [
    /(cuantos|demasiad[oa]s|much[oa]s) (bolos automaticos|autocorrecciones)/,
    "exceso autocorrecciones",
    "sustituye",
  ],
  [/plan de seguridad/, "incluir", "suma"],
  [/(personas|pacientes) mayores|edad avanzada/, "mayor", "sustituye"],
  [/la cuenta|cuenta como activa|contabiliza/, "contabiliza activa", "suma"],
  [/(si )?no (hay|existe|tengo|tiene) (un )?plan|sin plan/, "existe plan especifico", "sustituye"],
  [
    /subida de (la )?(glucosa|glucemia|azucar)|(se )?(me )?sube (la )?(glucosa|azucar)/,
    "hiperglucemia",
    "sustituye",
  ],
  [
    /(despues de|tras) (el |la |las |los )?(comer|comidas?|cenar|cenas?|desayunar|desayunos?|merendar|meriendas?)/,
    "posprandial",
    "sustituye",
  ],
  [/cuerpos cetonicos/, "cetonemia cetoacidosis cetosis", "sustituye"],
  [/dosis total( diaria)?/, "dtd", "sustituye"],
  [/cuanto (bajo|reduzco|quito)|bajar la dosis|reducir la dosis/, "reduccion", "sustituye"],
  [
    /mal uso|uso (incorrecto|inadecuado|insuficiente)|no lo usa|abandon\w*/,
    "insuficiente seguro reconsideracion",
    "sustituye",
  ],
  [
    /no (se )?(puede|debe) (mantener|seguir|continuar)|no es apropiad\w*/,
    "apropiada continuacion",
    "sustituye",
  ],
  [
    /(pasar|volver|cambiar) de (la )?(perfusion|insulina intravenosa|intravenosa|iv)\b/,
    "volver desde insulina intravenosa paralelo",
    "sustituye",
  ],
];

/* Señales: conducta («qué hago», una cifra con unidad) frente a definición («qué es»). */
const RE_CONDUCTA =
  /\b(que (hago|hacer|hacemos|debo)|como (actuo|actuar|tratar|manejar)|actuacion|pauta|tratamiento|cuando|cuanto|cuantos|cuantas)\b|\d+[,.]\d+|\d+\s*(mg|mmol|g\b|h\b|horas|ui)/;
const RE_DEFINICION = /\b(que es|que son|que significa|significado|definicion|que quiere decir)\b/;

/* Umbrales de glucosa del texto: «<90 mg/dl», «≥ 250 mg/dl», «126–180 mg/dl». */
function cumpleUmbral(texto: string, v: number): number {
  let mejor = 0;
  for (const m of texto.matchAll(/(<|>|≤|≥)\s?(\d+(?:,\d+)?)(?=[^\d]{0,12}mg\/dl)/g)) {
    const u = Number(m[2].replace(",", "."));
    const ok = m[1] === "<" ? v < u : m[1] === ">" ? v > u : m[1] === "≤" ? v <= u : v >= u;
    if (ok) mejor = Math.max(mejor, 1.5);
  }
  for (const m of texto.matchAll(/(\d+(?:,\d+)?)\s?[–-]\s?(\d+(?:,\d+)?)\s?mg\/dl/g)) {
    const [a, b] = [Number(m[1].replace(",", ".")), Number(m[2].replace(",", "."))];
    if (v >= a && v <= b) mejor = Math.max(mejor, 0.7);
  }
  return mejor;
}

/* ---------------------------------------------------------------- el índice */

interface Atomo {
  r: Omit<Respuesta, "score">;
  /* Raíces por zona: título (3), claves (2), cuerpo (1), resto del párrafo (0,4). */
  titulo: string[];
  claves: string[];
  cuerpo: string[];
  parrafo: string[];
  /* Filas por sistema: raíces de cada casilla. */
  porSis?: string[][];
  tramo?: string;
  sigla?: boolean;
  /* Sistemas que nombra el texto (índices de columna). */
  nombra: number[];
  /* Sistemas que nombra el párrafo entero (la frase puede decir «su objetivo»). */
  nombraParrafo: number[];
  /* Raíces del cuerpo en orden (y de cada casilla), para premiar palabras seguidas. */
  seq: string[];
  seqTitulo: string[];
  seqSis?: string[][];
  /* Todo el texto visible de la respuesta, para saber si da una cifra. */
  todo: string;
}

const raices = (s: string) => [
  ...new Set(
    palabras(s)
      .filter((w) => !STOP.has(w))
      .map(raiz),
  ),
];
const secuencia = (s: string) =>
  palabras(s)
    .filter((w) => !STOP.has(w))
    .map(raiz);
const nombrados = (s: string) => [
  ...new Set(
    palabras(s)
      .map((w) => ALIAS_SISTEMA[w])
      .filter((x) => x !== undefined),
  ),
];

/* Frases de un párrafo, sin cortar en «p. ej.», «v. Tabla», «aprox.» ni en decimales. */
export function frases(t: string): string[] {
  const out: string[] = [];
  let ini = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c !== "." && c !== "?" && c !== "!") continue;
    if (!/^\s+[A-ZÁÉÍÓÚÑ¿«“(]/.test(t.slice(i + 1, i + 4))) continue;
    const previa = (t.slice(ini, i).split(/\s+/).pop() ?? "").replace(/^[(«“]/, "");
    if (/^(v|p|pp|ej|aprox|fig|etc|n\.º|n)$/i.test(previa)) continue;
    out.push(t.slice(ini, i + 1).trim());
    ini = i + 1;
  }
  const resto = t.slice(ini).trim();
  if (resto) out.push(resto);
  return out;
}

/* Una frase que empieza por un conector necesita la anterior para entenderse. */
const RE_CONECTOR =
  /^(Por ello|Por eso|Por tanto|Esta|Este|Estas|Estos|Esto|Ello|En esa|En ese|En estos|En estas|Además|Sin embargo|Así|Hasta entonces|También|En cambio|Durante este|Su |Sus )/;

const NOMBRE_SIS = (i: number) => LISTA_TABLAS[0].columnas[i];

let ATOMOS: Atomo[] | null = null;
let PESO: Map<string, number> | null = null;

function rutaTabla(t: Tabla, fila: number, col?: number) {
  const st = SITUACIONES.find((x) => x.tabla === t.id && x.fila === fila);
  if (st)
    return href("consultar", "situacion", col === undefined ? st.id : `${st.id}:${SIS_IDS[col]}`);
  if (col !== undefined && (t.id === "T1" || t.id === "T3"))
    return href("sistemas", ORDEN_SISTEMAS[col]);
  return href("consultar", "tablas", t.id);
}

export function atomos(): Atomo[] {
  if (ATOMOS) return ATOMOS;
  const out: Atomo[] = [];
  const add = (
    r: Omit<Respuesta, "score">,
    zonas: { titulo?: string; claves?: string; cuerpo: string; parrafo?: string },
    extra: Partial<Atomo> = {},
  ) =>
    out.push({
      r,
      titulo: raices(zonas.titulo ?? ""),
      claves: raices(zonas.claves ?? ""),
      cuerpo: raices(zonas.cuerpo),
      parrafo: raices(zonas.parrafo ?? ""),
      nombra: nombrados(zonas.cuerpo),
      nombraParrafo: nombrados(zonas.parrafo || zonas.cuerpo),
      seq: secuencia(zonas.cuerpo),
      seqTitulo: secuencia(zonas.titulo ?? ""),
      todo: [
        r.texto,
        ...(r.items ?? []),
        ...(r.partes ?? []).map((p) => p.texto),
        ...(r.porSistema ?? []).map((p) => p.texto),
      ].join(" "),
      ...extra,
    });

  // Texto del capítulo: cada frase de cada párrafo y cada punto de cada lista.
  for (const a of APARTADOS) {
    let sub = "";
    a.bloques.forEach((b, i) => {
      const id = idDeBloque(b, i);
      const ruta = href("capitulo", a.slug, id);
      const fuente = `Apartado ${a.n}${sub ? ` · ${sub}` : ""}`;
      if (b.t === "h3") sub = b.texto;
      else if (b.t === "p") {
        const lead = b.lead ? plano(b.lead).replace(/[.:]\s*$/, "") : "";
        const todo = plano(b.texto);
        const fs = frases(todo);
        fs.forEach((f, k) =>
          add(
            {
              id: `t/${a.slug}/${id}/${k}`,
              tipo: "texto",
              fuente: lead ? `${fuente} · ${lead}` : fuente,
              titulo: lead || sub || a.titulo,
              texto: f,
              contexto: k > 0 && RE_CONECTOR.test(f) ? fs[k - 1] : undefined,
              pagina: b.p,
              pagina2: b.p2,
              ruta,
            },
            { titulo: lead || sub, claves: a.titulo, cuerpo: f, parrafo: todo },
          ),
        );
      } else if (b.t === "lista") {
        const intro = b.intro ? plano(b.intro) : "";
        const items = b.items.map(plano);
        add(
          {
            id: `l/${a.slug}/${id}`,
            tipo: "texto",
            fuente,
            titulo: intro.replace(/[.:]\s*$/, "") || sub || a.titulo,
            texto: intro,
            items,
            pagina: b.p,
            pagina2: b.p2,
            ruta,
          },
          { titulo: intro, claves: `${sub} ${a.titulo}`, cuerpo: items.join(" "), parrafo: "" },
        );
        items.forEach((it, k) =>
          add(
            {
              id: `l/${a.slug}/${id}/${k}`,
              tipo: "texto",
              fuente,
              titulo: intro.replace(/[.:]\s*$/, "") || sub || a.titulo,
              texto: it,
              contexto: intro || undefined,
              pagina: b.p,
              pagina2: b.p2,
              ruta,
            },
            { titulo: sub, claves: `${intro} ${a.titulo}`, cuerpo: it, parrafo: items.join(" ") },
          ),
        );
      }
    });
  }

  // Tablas: una fila por respuesta; en las tablas por sistema, con su casilla de cada uno.
  for (const t of LISTA_TABLAS) {
    const nombreTabla = `Tabla ${t.numero}`;
    t.filas.forEach((f, i) => {
      const etiqueta = plano(f.etiqueta).split("\n")[0];
      const resto = plano(f.etiqueta).split("\n").slice(1).join(" ");
      const base = {
        tipo: "tabla" as const,
        fuente: `${nombreTabla}. ${t.titulo}`,
        pagina: t.paginas[0],
        pagina2: t.paginas[1] !== t.paginas[0] ? t.paginas[1] : undefined,
      };
      if (t.porSistema && !f.unida) {
        const celdas = f.celdas.map(plano);
        add(
          {
            ...base,
            id: `${t.id}/${i}`,
            titulo: etiqueta,
            texto: resto,
            porSistema: celdas.map((c, k) => ({
              nombre: NOMBRE_SIS(k),
              texto: c,
              ruta: rutaTabla(t, i, k),
            })),
            ruta: rutaTabla(t, i),
          },
          {
            titulo: etiqueta,
            claves: `${nombreTabla} ${t.titulo} ${resto}`,
            cuerpo: celdas.join(" "),
          },
          { porSis: celdas.map(raices), seqSis: celdas.map(secuencia) },
        );
      } else if (t.porSistema) {
        const celda = plano(f.celdas[0]);
        add(
          { ...base, id: `${t.id}/${i}`, titulo: etiqueta, texto: celda, ruta: rutaTabla(t, i) },
          { titulo: etiqueta, claves: `${nombreTabla} ${t.titulo} ${resto}`, cuerpo: celda },
        );
      } else {
        // Tablas 2, 5 y 6: cada columna con su cabecera.
        const partes = f.celdas.map((c, k) => ({ etiqueta: t.columnas[k], texto: plano(c) }));
        const titulo = t.id === "T5" ? `Paso ${etiqueta} · ${partes[0].texto}` : etiqueta;
        const cuerpo = (t.id === "T5" ? partes.slice(1) : partes).map((p) => p.texto).join(" ");
        add(
          {
            ...base,
            id: `${t.id}/${i}`,
            titulo,
            texto: "",
            partes: t.id === "T5" ? partes.slice(1) : partes,
            ruta: rutaTabla(t, i),
          },
          { titulo, claves: `${nombreTabla} ${t.titulo} ${t.columnas.join(" ")}`, cuerpo },
        );
      }
    });
    t.notas.forEach((n, k) =>
      frases(plano(n)).forEach((f, j) =>
        add(
          {
            ...base0(t),
            id: `${t.id}/nota/${k}/${j}`,
            titulo: `Nota de la ${nombreTabla}`,
            texto: f,
            ruta: href("consultar", "tablas", t.id),
          },
          { titulo: "", claves: `${nombreTabla} ${t.titulo}`, cuerpo: f },
        ),
      ),
    );
  }

  // Figura 3: la entrada (sospechar, comprobar, confirmar), cada tramo, el pie y la regla.
  const F3 = { tipo: "figura" as const, fuente: "Figura 3", pagina: FIGURA3.pagina };
  add(
    {
      ...F3,
      id: "F3/inicio",
      titulo: plano(FIGURA3.sospechar.titulo).replace(/:\s*$/, ""),
      texto: "",
      items: [
        ...FIGURA3.sospechar.items.map(plano),
        `${plano(FIGURA3.comprobar.titulo)} ${FIGURA3.comprobar.items.map(plano).join(" ")}`,
        plano(FIGURA3.confirmar),
      ],
      ruta: href("consultar", "figura-3"),
    },
    {
      titulo: `${FIGURA3.sospechar.titulo} hiperglucemia persistente`,
      claves: FIGURA3.cabecera,
      cuerpo: [...FIGURA3.sospechar.items, ...FIGURA3.comprobar.items, FIGURA3.confirmar].join(" "),
    },
  );
  for (const tr of FIGURA3.tramos)
    add(
      {
        ...F3,
        id: `F3/${tr.clave}`,
        titulo: `${tr.rango} · ${tr.titulo}`,
        texto: "",
        items: tr.pasos.map((p) =>
          [plano(p.texto), ...(p.detalle ?? []).map((d) => `— ${plano(d)}`)].join(" "),
        ),
        ruta: href("consultar", "figura-3", tr.clave),
      },
      {
        titulo: `${tr.rango} ${tr.titulo}`,
        claves: `${FIGURA3.cabecera} cetonemia`,
        cuerpo: tr.pasos.flatMap((p) => [p.texto, ...(p.detalle ?? [])]).join(" "),
      },
      { tramo: tr.clave },
    );
  FIGURA3.pie.forEach((p, k) =>
    add(
      {
        ...F3,
        id: `F3/pie/${k}`,
        titulo: plano(p.titulo).replace(/:\s*$/, ""),
        texto: plano(p.texto),
        ruta: href("consultar", "figura-3"),
      },
      { titulo: p.titulo, claves: FIGURA3.cabecera, cuerpo: p.texto },
    ),
  );
  add(
    {
      ...F3,
      id: "F3/regla",
      titulo: "Regla de oro",
      texto: plano(FIGURA3.reglaDeOro),
      ruta: href("consultar", "figura-3"),
    },
    { titulo: "regla de oro", claves: FIGURA3.cabecera, cuerpo: FIGURA3.reglaDeOro },
  );

  // Figuras 1, 2 e infografía: cada caja.
  for (const f of Object.values(FIGURAS))
    f.cajas.forEach((c, k) =>
      add(
        {
          id: `${f.id}/${k}`,
          tipo: "figura",
          fuente: plano(f.titulo).split(".").slice(0, 1).join(""),
          titulo: c.titulo ? plano(c.titulo) : plano(f.titulo),
          texto: "",
          items: c.items.map(plano),
          pagina: f.pagina,
          ruta:
            f.id === "INFO"
              ? href("consultar", "infografia")
              : href("capitulo", f.id === "F1" ? "02-componentes" : "06-indicaciones"),
        },
        { titulo: c.titulo ?? "", claves: f.titulo, cuerpo: c.items.join(" ") },
      ),
    );

  // Glosario: la sigla y su desarrollo tal como lo da el capítulo.
  for (const g of GLOSARIO)
    add(
      {
        id: `sigla/${g.sigla}`,
        tipo: "sigla",
        fuente: "Glosario de siglas",
        titulo: g.sigla,
        texto: `${g.sigla}: ${g.desarrollo}`,
        pagina: g.pagina,
        ruta: href("consultar", "glosario", g.sigla),
      },
      { titulo: g.sigla, claves: "", cuerpo: g.desarrollo },
      { sigla: true },
    );

  // Peso por rareza de cada raíz (0,5–2): «hipoglucemia» discrimina menos que «diatermia».
  const df = new Map<string, number>();
  for (const a of out)
    for (const w of new Set([...a.titulo, ...a.cuerpo])) df.set(w, (df.get(w) ?? 0) + 1);
  const n = out.length;
  const idf = (d: number) => Math.log((n + 1) / (d + 1));
  const medio = [...df.values()].reduce((s, d) => s + idf(d), 0) / df.size;
  PESO = new Map([...df].map(([w, d]) => [w, Math.min(2, Math.max(0.5, idf(d) / medio))]));
  ATOMOS = out;
  return out;
}

function base0(t: Tabla) {
  return {
    tipo: "tabla" as const,
    fuente: `Tabla ${t.numero}. ${t.titulo}`,
    pagina: t.paginas[0],
    pagina2: t.paginas[1] !== t.paginas[0] ? t.paginas[1] : undefined,
  };
}

/* ---------------------------------------------------------------- la pregunta */

interface Grupo {
  /* La palabra escrita (primera) y sus equivalentes del léxico, como raíces. */
  palabras: string[];
  sistema?: number;
  /* Lo escrito a medias («hipogluc») casa como prefijo; una palabra entera, no. */
  prefijo?: boolean;
  /* Añadida por una expresión: suma puntos, pero no se exige para responder. */
  bonus?: boolean;
}

export function gruposDe(pregunta: string): Grupo[] {
  let q = unificar(pregunta);
  const extra: string[] = [];
  for (const [re, mas, modo] of FRASES)
    if (re.test(q)) {
      if (modo === "sustituye") q = q.replace(re, ` ${mas} `);
      else extra.push(mas);
    }
  const vistos = new Set<string>();
  const grupos: Grupo[] = [];
  // Con glucosa en la pregunta, una cifra de 2-3 dígitos es un valor (lo miran los umbrales),
  // no una palabra que la respuesta tenga que contener.
  const hayGlucosa = /glucos|glucem|azucar|hipogluc|hipergluc|mg/.test(q);
  const meter = (w: string, bonus: boolean) => {
    if (STOP.has(w) || vistos.has(w)) return;
    // Las cifras sueltas de una letra («2 h», «3,5») no discriminan; las de más, sí («54», «450»).
    if (/^\d$/.test(w)) return;
    vistos.add(w);
    if (hayGlucosa && /^\d{2,3}$/.test(w) && ALIAS_SISTEMA[w] === undefined) {
      grupos.push({ palabras: [w], bonus: true });
      const v = Number(w);
      const tema =
        v < 70
          ? "hipoglucemia"
          : v >= 250
            ? "hiperglucemia persistente"
            : v > 180
              ? "hiperglucemia"
              : "";
      for (const x of palabras(tema))
        if (!vistos.has(x)) {
          vistos.add(x);
          grupos.push({ palabras: [raiz(x)], bonus: true });
        }
      return;
    }
    if (ALIAS_SISTEMA[w] !== undefined) {
      grupos.push({ palabras: [w], sistema: ALIAS_SISTEMA[w] });
      return;
    }
    const r = raiz(w);
    grupos.push({
      palabras: [...new Set([r, ...(LEXICO[w] ?? []).map(raiz)])],
      prefijo: r === w && w.length >= 5 && !LEXICO[w],
      bonus,
    });
  };
  for (const w of palabras(q)) meter(w, false);
  for (const w of palabras(extra.join(" "))) meter(w, true);
  if (grupos.length && grupos.every((g) => g.sistema !== undefined || g.bonus))
    for (const g of grupos) if (g.sistema !== undefined) delete g.sistema;
  return grupos;
}

function puntuarPalabra(a: Atomo, t: string, cuerpo: string[], prefijo: boolean, techo = Infinity) {
  const peso = (w: string) => Math.min(techo, PESO!.get(w) ?? 1);
  // En una frase del texto, el título (subapartado) orienta y el cuerpo responde; en una fila
  // de tabla o un tramo, el título (la fila, el tramo) es lo que se pregunta.
  const [pt, pc] = a.r.tipo === "texto" ? [2.2, 1.8] : [3, 1.6];
  const c = (x: string) => casa(t, x, prefijo);
  let w: string | undefined;
  if ((w = a.titulo.find(c))) return { s: pt * peso(w), casa: true, titulo: true };
  if ((w = a.claves.find(c))) return { s: 1.5 * peso(w), casa: true, titulo: false };
  if ((w = cuerpo.find(c))) return { s: pc * peso(w), casa: true, titulo: false };
  if ((w = a.parrafo.find(c))) return { s: 0.4 * peso(w), casa: true, titulo: false };
  // Una errata: en el título cubre; en el cuerpo suma poco y no cubre («precio» no es «previo»).
  if (t.length >= 5 && (w = a.titulo.find((x) => casiIgual(t, x))))
    return { s: 0.8 * peso(w), casa: true, titulo: true };
  if (t.length >= 5 && (w = cuerpo.find((x) => casiIgual(t, x))))
    return { s: 0.4 * peso(w), casa: false, titulo: false };
  return { s: 0, casa: false, titulo: false };
}

export function responder(pregunta: string, { max = 3 } = {}): Respuesta[] {
  const ats = atomos();
  const grupos = gruposDe(pregunta);
  const utiles = grupos.filter((g) => g.sistema === undefined && !g.bonus);
  const conPuntos = grupos.filter((g) => g.sistema === undefined);
  if (!utiles.length) return [];
  atomos();
  // ¿Puede el capítulo contestar esta palabra? (alguna raíz del índice casa con ella)
  const conocida = (g: Grupo) =>
    g.palabras.some((t, k) => {
      if (PESO!.has(t)) return true;
      for (const v of PESO!.keys()) if (casa(t, v, k === 0 && !!g.prefijo)) return true;
      return false;
    });
  const conocidas = utiles.filter(conocida);
  // Si casi toda la pregunta es ajena al capítulo («seguro médico privado»), no consta.
  if (!conocidas.length || conocidas.length < Math.ceil(utiles.length / 2)) return [];
  const ajenas = utiles.filter(
    (g) =>
      !conocidas.includes(g) &&
      g.palabras[0].length >= 5 &&
      !/(ar|er|ir|an|en|s)$/.test(g.palabras[0]),
  );
  if (ajenas.length >= conocidas.length) return [];
  // Peso de cada palabra: su rareza (la de la palabra escrita o, si no está, su equivalente).
  const pesoDe = (g: Grupo) => Math.max(...g.palabras.map((t) => PESO!.get(t) ?? 0)) || 1;
  const pesoTotal = conocidas.reduce((n, g) => n + pesoDe(g), 0);
  const sis = grupos.find((g) => g.sistema !== undefined)?.sistema;
  const qn = normalizar(pregunta);
  const conducta = RE_CONDUCTA.test(qn);
  const definicion = RE_DEFINICION.test(qn);
  const tramo = tramoDeConsulta(unificar(pregunta))?.clave;
  // Preguntas que piden una cifra («cuánto», «a partir de qué edad», «objetivo», un valor de
  // glucosa): mejor la frase que la da.
  const pideCifra =
    /\b(cuanto|cuanta|cuantos|cuantas|que (glucosa|glucemia|cifra|valor|dosis|objetivo|edad)|a partir de|umbral|objetivos?|cuando|edad)\b/.test(
      qn,
    );
  const cifraGlucosa = qn.replace(/\b780\b/g, "").match(/\b(\d{2,3})\b/);
  const valorGlucosa = cifraGlucosa ? Number(cifraGlucosa[1]) : null;
  // Cobertura: al menos la mitad de las palabras útiles (y como mucho tres exigidas).
  // Cobertura: la parte (por peso) de la pregunta que la respuesta contiene.

  // Cuánto cubre la pregunta un átomo con un cuerpo dado.
  const cubrir = (a: Atomo, cuerpo: string[]) => {
    let score = 0;
    let casados = 0;
    let cubierto = 0;
    let enTitulo = 0;
    for (const g of conPuntos) {
      let mejor = { s: 0, casa: false, titulo: false };
      const techo = PESO!.get(g.palabras[0]) ?? 1;
      g.palabras.forEach((t, k) => {
        const r = puntuarPalabra(a, t, cuerpo, k === 0 && !!g.prefijo, k > 0 ? techo : Infinity);
        // El equivalente del léxico vale algo menos que la palabra escrita.
        if (k > 0) r.s *= 0.85;
        if (r.s > mejor.s) mejor = r;
      });
      score += mejor.s;
      if (g.bonus) continue;
      if (mejor.casa) {
        casados++;
        if (conocidas.includes(g)) cubierto += pesoDe(g);
      }
      if (mejor.titulo) enTitulo++;
    }
    return { score, casados, enTitulo, cobertura: cubierto / pesoTotal };
  };

  const cand: { a: Atomo; score: number }[] = [];
  for (const a of ats) {
    // Fila por sistema: con sistema nombrado, su casilla; sin él, la casilla que mejor
    // responde (no la suma de las cuatro: «ejercicio» de una y «80» de otra no responden).
    let celda = sis;
    let r = cubrir(a, a.cuerpo);
    if (a.porSis) {
      if (sis !== undefined) r = cubrir(a, [...a.porSis[sis], ...a.claves]);
      else
        a.porSis.forEach((c, k) => {
          const rk = cubrir(a, [...c, ...a.claves]);
          if (k === 0 || rk.score > r.score) [r, celda] = [rk, k];
        });
    }
    let { score } = r;
    const { casados, enTitulo, cobertura } = r;
    if (!casados || score <= 0 || cobertura < 0.5) continue;
    // Sin coincidencia en el título, la respuesta tiene que contener casi toda la pregunta.
    if (!enTitulo && cobertura < 0.6) continue;
    // Precisión: la parte del título que casa desempata «Diatermia» frente a un título largo.
    if (enTitulo && a.titulo.length) score += 0.6 * (enTitulo / a.titulo.length);
    // Sistema nombrado: su casilla responde; un texto que nombra solo otros sistemas, no.
    if (sis !== undefined) {
      if (a.porSis) score += 2;
      else if (a.nombra.includes(sis)) score += 1.5;
      else if (a.nombraParrafo.includes(sis)) score += 0.8;
      else if (a.nombra.length) score -= 1.5;
    }
    if (tramo && a.tramo) score += a.tramo === tramo ? 6 : -2;
    if (pideCifra && /\d/.test(a.todo)) score += 1;
    if (valorGlucosa !== null && /mg\/dl/.test(a.todo))
      score += 0.4 + cumpleUmbral(a.todo, valorGlucosa);
    // Palabras de la pregunta que van seguidas en la respuesta («dosis basal de respaldo»).
    const seq = celda !== undefined && a.seqSis ? a.seqSis[celda] : a.seq;
    for (let k = 0; k + 1 < conPuntos.length; k++) {
      const [g1, g2] = [conPuntos[k].palabras, conPuntos[k + 1].palabras];
      const seguidas = (xs: string[]) => {
        for (let j = 0; j + 1 < xs.length; j++)
          if (g1.some((t) => casa(t, xs[j])) && g2.some((t) => casa(t, xs[j + 1]))) return true;
        return false;
      };
      if (seguidas(a.seqTitulo)) score += 1.2;
      else if (seguidas(seq)) score += 0.8;
    }
    // Ante «qué hago», la Figura 3 es la conducta del capítulo.
    if (conducta && enTitulo && a.r.id.startsWith("F3/")) score += 1;
    // La sigla responde a «qué es»; si se pregunta algo más, la frase que lo dice va antes.
    if (a.sigla && !definicion && utiles.length > 1) score -= 1.5;
    if (a.sigla) score += definicion ? 3 : conducta ? -3 : 0;
    if (
      definicion &&
      !a.sigla &&
      a.r.tipo === "texto" &&
      /\b(es|son|refleja|se define)\b/.test(a.r.texto)
    )
      score += 0.5;
    // Las frases muy cortas («Ejercicio físico») no son una respuesta.
    if (a.r.tipo === "texto" && !a.r.items && a.r.texto.length < 40) score -= 2;
    cand.push({ a, score });
  }
  cand.sort((x, y) => y.score - x.score || x.a.r.id.localeCompare(y.a.r.id));

  // Como mucho una respuesta por párrafo, fila o tramo.
  const vistos = new Set<string>();
  const out: Respuesta[] = [];
  for (const c of cand) {
    const clave = c.a.r.ruta + (c.a.r.tipo === "texto" ? "" : c.a.r.titulo);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    out.push(resolver(c.a, sis, c.score));
    if (out.length >= max) break;
  }
  return out;
}

/* Con un sistema nombrado, la fila de tabla responde con su casilla. */
function resolver(a: Atomo, sis: number | undefined, score: number): Respuesta {
  if (sis !== undefined && a.r.porSistema) {
    const s = a.r.porSistema[sis];
    return {
      ...a.r,
      texto: s.texto,
      sistema: s.nombre,
      ruta: s.ruta,
      porSistema: undefined,
      score,
    };
  }
  return { ...a.r, score };
}
