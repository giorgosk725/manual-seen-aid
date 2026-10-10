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
  apartadoDePagina,
  LISTA_TABLAS,
  idDeBloque,
  type Tabla,
} from "./contenido";
import { href } from "./rutas";
import { plano } from "./marcado";
import { normalizar, tramoDeConsulta, type Respuesta } from "./busqueda";
import { SIS_IDS, SITUACIONES } from "./situaciones";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";
import { frases } from "./frases";
import { raizEs } from "./raiz";
import { FRECUENTES, type Frecuente } from "./frecuentes";

export { frases };

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
    "demasiadas tanto tanta algun alguna tomo tomar llama llaman " +
    "sistemas dispositivo usar uso algo mejor pasa ocurre favor otra otro hay vez veces modo dos " +
    "tres alta alto pacientes personas porque aunque sino pues entonces dispositivos tras " +
    "significa significado definicion quiere decir"
  ).split(" "),
);

/* Palabras que no definen la pregunta: verbos de petición («quiero», «conviene», «sirve»),
   adjetivos vagos («distintos», «nueva») y lo que es tema de todo el capítulo («AID», «bomba»,
   «diabetes»). Suman si la respuesta las tiene, pero no se exigen ni deciden si consta. */
const GENERICAS = new Set(
  (
    "quiero quiere queremos queria quisiera quedarme quedar quedarse conviene convendria " +
    "necesito necesita necesitamos sirve sirven servir funciona funcionan funcionar ocurre " +
    "dice dicen saber explica explicar explicame recomienda recomiendan recomendado " +
    "recomendable aconseja aconsejable demostro demostrado demuestra muestra mostro encontro " +
    "hablar hablo concreto concreta concretos distinto distinta distintos distintas " +
    "diferentes varios varias nuevo nueva nuevos nuevas normal normales posible posibles " +
    "importante general cosa cosas rato todo toda todos todas ahora hoy ayer luego aun " +
    "todavia solo mismo misma igual tal aqui alli momento estoy estaba soy fue he ha han " +
    "hemos habia tenia sigo viene vengo vienen haciendo hecho correcto correcta adecuado " +
    "adecuada mio mia tu tus nuestro papel manera forma pequeno pequena pequenos pequenas " +
    "grande grandes puesto puesta puestos puestas hecha visto dicho ayudar ayuda " +
    "medico medicos endocrino endocrinologo doctor doctora " +
    "lunes martes miercoles jueves viernes sabado domingo finde aparece aparecen aparecer " +
    "sale salen sucede suceden aparato aparatos maquina medidor chisme harto harta " +
    "agobiado agobiada cansado cansada frustrado frustrada estresado estresada diferencial " +
    "habitual habituales mucho mucha mal salgo sales meto mete metes pongo pone ponga " +
    "pongan ponerme ponerse mandado mandaron recetado recetaron dijo dicho puse hice hago " +
    "hacen paso pasan pasado tome tomado llevo llevas noto nota notado siento sienta " +
    "estoy esta estas estaba sabado lunes " +
    "realmente exactamente concretamente verdaderamente basicamente " +
    "aid bomba bombas diabetes diabetico diabeticos diabetica diabeticas automatica " +
    "automatico asa cerrada cerrado senal senales signo signos"
  ).split(" "),
);

/* Raíz suave: plural y género («objetivos» = «objetivo», «nocturnas» = «nocturno»). */
const raizSuave = (w: string) => {
  if (w.length <= 4) return w;
  const sinPlural = w.replace(/(es|s)$/, "");
  return sinPlural.length > 5 ? sinPlural.replace(/[ao]$/, "") : sinPlural;
};
/* Raíz: Snowball para español (raiz.ts) reúne las formas de una palabra («desconectado»,
   «desconectar», «desconectarse»); si deja menos de 5 letras, choca con otras («nadar» y
   «nada» → «nad»), y entonces vale la raíz suave. */
const raiz = (w: string) => {
  const s = raizEs(w);
  return s.length >= 5 ? s : raizSuave(w);
};

/* Sigla ↔ desarrollo, del propio glosario del capítulo: donde se escribe el desarrollo
   («dosis total diaria»), se añade la sigla («dtd»), en la pregunta y en el texto; así casan
   las dos formas. Una sola pasada y el desarrollo más largo primero («tiempo en rango
   estrecho» es TITR, no TIR). Se añaden formas cortas que el capítulo usa. */
const DESARROLLOS: [string, string][] = (() => {
  const pares: [string, string][] = [];
  for (const g of GLOSARIO) {
    const sigla = normalizar(g.sigla);
    if (!/^[a-z0-9]+$/.test(sigla) || /no desarrollada|subindice|:/.test(normalizar(g.desarrollo)))
      continue;
    // El desarrollo sin el comentario entre paréntesis; y la forma española entre «».
    const d = normalizar(g.desarrollo);
    const base = d.replace(/\s*\(.*\)\s*$/, "").trim();
    if (base.length > 6) pares.push([base, sigla]);
    const es = d.match(/«([^»]+)»/);
    if (es) pares.push([es[1], sigla]);
  }
  pares.push(["dosis total diaria", "dtd"], ["factor de sensibilidad", "fsi"]);
  return pares.sort((a, b) => b[0].length - a[0].length);
})();
const RE_DESARROLLO = new RegExp(
  `\\b(${DESARROLLOS.map(([d]) => d.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")})\\b`,
  "g",
);
const SIGLA_DE = new Map(DESARROLLOS);

/* Formas fijas: β-OHB en cualquiera de sus escrituras es «bohb»; Control-IQ, una palabra.
   «DIA» en mayúsculas es la duración de la insulina activa (en minúsculas sería «día»). */
const unificar = (s: string) =>
  normalizar(s.replace(/\bDIA\b/g, " duración de la insulina activa "))
    .replace(RE_DESARROLLO, (m) => `${m} ${SIGLA_DE.get(m) ?? ""} `)
    .replace(/\b(?:diabetes(?: mellitus)?|dm) (?:de )?tipo ([12])\b/g, " dm$1 ")
    .replace(/\bnivel ([12])\b/g, " nivel$1 nivel ")
    .replace(/(\d)\s?%/g, "$1 % porcentaje ")
    .replace(/[<>≤≥]\s?\d+(?:,\d+)?/g, "$& umbral ")
    // «Población mayor», «personas mayores», «edad avanzada»: la vejez, no «mayor que».
    .replace(
      /\b(?:poblacion|personas?|pacientes?|adultos?) mayor(?:es)?\b|\bedad avanzada\b|\bancian[oa]s?\b/g,
      "$& ancianidad ",
    )
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

/* Lo que distingue a cada tramo de la Figura 3 de los demás («leve», «cetoacidosis»…): sin una
   cifra de β-OHB, una rama solo responde si se la nombra por ahí (lo común a todas —cetosis,
   fallo de infusión, hiperglucemia— no basta: la conducta depende del tramo). */
let PROPIAS_TRAMO: Map<string, string[]> | null = null;
function propiasDeTramo(): Map<string, string[]> {
  if (PROPIAS_TRAMO) return PROPIAS_TRAMO;
  const comunes = new Set(palabras(`${FIGURA3.cabecera} cetonemia ohb mmol`).map(raiz));
  const de = (tr: (typeof FIGURA3.tramos)[number]) =>
    palabras(`${tr.rango} ${tr.titulo}`)
      .filter((w) => !STOP.has(w) && !/\d/.test(w))
      .map(raiz)
      .filter((w) => !comunes.has(w));
  const todas = FIGURA3.tramos.map((tr) => [tr.clave, de(tr)] as const);
  PROPIAS_TRAMO = new Map(
    todas.map(([clave, ws]) => [
      clave,
      ws.filter((w) => todas.every(([otra, os]) => otra === clave || !os.includes(w))),
    ]),
  );
  return PROPIAS_TRAMO;
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
  if (
    t.length >= 7 &&
    w.length > t.length &&
    w.endsWith(t) &&
    !/^(des|in|im|re|pre|sub|anti|contra|sobre)$/.test(w.slice(0, w.length - t.length))
  )
    return true;
  if (prefijo && t.length >= 5 && w.length - t.length <= 4 && w.startsWith(t)) return true;
  const corta = Math.min(t.length, w.length);
  // Raíces que difieren en la última letra («anunc», de «anuncian», y «anunci», de «anunciarse»).
  if (corta >= 5 && Math.abs(t.length - w.length) === 1) {
    const [c, l] = t.length < w.length ? [t, w] : [w, t];
    if (l.startsWith(c) && /[aeiou]$/.test(l)) return true;
  }
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
  quito: ["retirar", "retirada", "desconectarse"],
  quite: ["retirar", "retirada", "desconectarse"],
  quitarse: ["retirar", "retirada", "desconectarse"],
  quitarla: ["retirar", "retirada", "desconectarse"],
  quitarlo: ["retirar", "retirada", "desconectarse"],
  retirar: ["retirada", "retirarse"],
  despega: ["despegado", "adhesivo"],
  despegado: ["adhesivo"],
  nino: ["pediatria", "pediatrica"],
  ninos: ["pediatria", "pediatrica"],
  infantil: ["pediatria", "pediatrica"],
  mayores: ["ancianidad", "mayor", "fragilidad"],
  fragil: ["fragilidad", "ancianidad"],
  fragiles: ["fragilidad", "ancianidad"],
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
  futbol: ["ejercicio", "actividad", "anaerobico"],
  baloncesto: ["ejercicio", "actividad", "anaerobico"],
  tenis: ["ejercicio", "actividad", "anaerobico"],
  padel: ["ejercicio", "actividad", "anaerobico"],
  bicicleta: ["ejercicio", "actividad", "aerobico"],
  ciclismo: ["ejercicio", "actividad", "aerobico"],
  franja: ["tramos", "tramo"],
  franjas: ["tramos", "tramo"],
  glicada: ["hba1c"],
  glicosilada: ["hba1c"],
  glucosilada: ["hba1c"],
  a1c: ["hba1c"],
  hb: ["hba1c"],
  brazo: ["insercion", "zona"],
  abdomen: ["insercion", "zona"],
  muslo: ["insercion", "zona"],
  gluteo: ["insercion", "zona"],
  bateria: ["bateria", "interrupcion", "fallo"],
  pila: ["bateria", "interrupcion", "fallo"],
  pilas: ["bateria", "interrupcion", "fallo"],
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
  repuesto: ["recambios", "recambio", "material"],
  recambio: ["recambios"],
  parche: ["pod", "set", "sensor", "adhesivo"],
  aprende: ["autoaprendizaje", "aprendizaje"],
  aprender: ["autoaprendizaje", "aprendizaje"],
  aprendizaje: ["autoaprendizaje"],
  decide: ["decision", "seleccion", "eleccion"],
  decidir: ["decision", "seleccion", "eleccion"],
  elegir: ["decision", "seleccion", "eleccion"],
  escoger: ["decision", "seleccion", "eleccion"],
  eleccion: ["decision", "seleccion"],
  autocorreccion: ["correccion", "automaticos"],
  cv: ["coeficiente", "variacion"],
  discrepancias: ["discordancia"],
  discordancia: ["discrepancias"],
  roto: ["fallo", "averia", "interrupcion"],
  rota: ["fallo", "averia", "interrupcion"],
  rompe: ["fallo", "averia", "interrupcion"],
  estropeado: ["fallo", "averia", "interrupcion"],
  averiado: ["fallo", "averia", "interrupcion"],
  averia: ["fallo", "interrupcion"],
  casero: ["diy", "desarrollo"],
  consulta: ["visita", "revision", "contacto"],
  cita: ["visita", "revision", "contacto"],
  hijo: ["pediatrica", "pediatria", "edad"],
  hija: ["pediatrica", "pediatria", "edad"],
  bebe: ["pediatrica", "pediatria", "edad"],
  pinchazo: ["capilar"],
  dedo: ["capilar"],
  glucometro: ["capilar"],
  tarde: ["tardio", "retrasado", "retraso"],
  servicio: ["soporte"],
  llamar: ["contactar", "contacto"],
  enfermeria: ["equipo", "asistencial", "profesionales"],
  enfermera: ["equipo", "asistencial", "profesionales"],
  bluetooth: ["comunicacion", "conexion"],
  ayuno: ["ayunas"],
  sensor: ["mcg", "monitorizacion"],
  gastroenteritis: ["enfermedad", "intercurrente", "vomitos"],
  mcg: ["sensor", "sensores"],
  autobolo: ["correccion", "automaticos"],
  autobolos: ["correccion", "automaticos"],
  microbolos: ["microbolos", "automaticos"],
  catarro: ["enfermedad", "intercurrente"],
  resfriado: ["enfermedad", "intercurrente"],
  infeccion: ["enfermedad", "intercurrente"],
  betametasona: ["glucocorticoides"],
  metilprednisolona: ["glucocorticoides"],
  hidrocortisona: ["glucocorticoides"],
  deflazacort: ["glucocorticoides"],
  esteroides: ["glucocorticoides"],
  ayunas: ["ayuno"],
  bajada: ["hipoglucemia"],
  bajadas: ["hipoglucemia"],
  bajon: ["hipoglucemia"],
  bajones: ["hipoglucemia"],
  duermo: ["nocturna", "sueno", "dormir"],
  golpe: ["brusca", "brusco", "rapida"],
  bulto: ["lipohipertrofia", "lipodistrofia"],
  bultos: ["lipohipertrofia", "lipodistrofia"],
  barriga: ["abdomen", "zona", "zonas"],
  tripa: ["abdomen", "zona", "zonas"],
  fiesta: ["alcohol"],
  copas: ["alcohol"],
  cerveza: ["alcohol"],
  vino: ["alcohol"],
  dejar: ["abandono", "retirada", "interrupcion", "transiciones"],
  temporada: ["temporal", "temporales", "temporalmente"],
  verguenza: ["visibles", "imagen", "emocional"],
  densitometria: ["dexa"],
  entrenar: ["ejercicio", "actividad"],
  entreno: ["ejercicio", "actividad"],
  entrenamiento: ["ejercicio", "actividad"],
  limite: ["umbral"],
  minimo: ["umbral"],
  minima: ["umbral"],
  maximo: ["umbral"],
  maxima: ["umbral"],
  escrito: ["escrita", "formato"],
  recontrolar: ["reevaluarse", "reevaluar"],
  diarrea: ["enfermedad", "intercurrente", "vomitos"],
  cateter: ["set", "cateter", "infusion"],
  aguja: ["canula", "set", "infusion"],
  agujas: ["canula", "set", "infusion"],
  canula: ["canula", "set", "infusion"],
  canulas: ["canula", "set", "infusion"],
  dobla: ["acodamientos", "acodamiento"],
  doblada: ["acodamientos", "acodamiento"],
  doblado: ["acodamientos", "acodamiento"],
  acodada: ["acodamientos", "acodamiento"],
  acodado: ["acodamientos", "acodamiento"],
  vacio: ["interrupcion", "fallo"],
  vacia: ["interrupcion", "fallo"],
  sensores: ["mcg", "monitorizacion"],
  operado: ["cirugia", "quirurgico", "intervencion"],
};

/* El léxico también por raíz: «olvidados», «repuestos» o «averiada» usan la entrada de su
   palabra. */
const LEX_RAIZ = new Map<string, string[]>();
for (const [k, v] of Object.entries(LEXICO)) if (!LEX_RAIZ.has(raiz(k))) LEX_RAIZ.set(raiz(k), v);
const lexico = (w: string): string[] | undefined =>
  LEXICO[w] ?? (raiz(w) !== w ? LEX_RAIZ.get(raiz(w)) : undefined);

/* Faltas de ortografía: se compara cómo suena la palabra (b/v, s/z/c, ll/y, h muda…). */
const fonetica = (w: string) =>
  w
    .replace(/ch/g, "X")
    .replace(/h/g, "")
    .replace(/v/g, "b")
    .replace(/z/g, "s")
    .replace(/c([ei])/g, "s$1")
    .replace(/qu([ei])/g, "k$1")
    .replace(/c/g, "k")
    .replace(/ll/g, "y")
    .replace(/g([ei])/g, "j$1")
    .replace(/(.)\1+/g, "$1");

/* Expresiones enteras → palabras del capítulo (sobre la pregunta ya normalizada). En lo que
   sustituye, cada palabra se exige; «a|b» es una sola palabra exigida que puede ser a o b. */
type Modo = "sustituye" | "suma";
const FRASES: [RegExp, string, Modo][] = [
  // «cetonas con glucosa normal»: la cetonemia con glucemia normal (iSGLT2, Figura 3).
  [
    /(glucosa|glucemia|azucar)\s+(normal(es)?|buena|bien|en rango|no (muy |tan )?alta)|sin hiperglucemia|euglucemi\w*/,
    "glucemia normal|independencia",
    "sustituye",
  ],
  // «se me cae el pod», «se suelta el sensor»: el adhesivo que se despega.
  [
    /(se )?(me |le )?(cae|caen|ha caido|suelta|sueltan|despega|despegan|ha despegado) (el |la |un |una )?(pod|sensor|parche|bomba|set|cateter)/,
    "despega despegado adhesivo",
    "sustituye",
  ],
  // «sin batería», «pila gastada»: interrupción del sistema y pluma.
  [
    /sin (bateria|pila|pilas)|(bateria|pila) (agotada|gastada|muerta|acabada)|(se )?(ha )?(acabado|agotado) la (bateria|pila)/,
    "interrupcion fallo infusion pluma",
    "sustituye",
  ],
  // «bajar el objetivo», «cambiar el objetivo»: el objetivo glucémico y sus valores permitidos.
  [
    /(?<!no (puedo|puede|se puede|podemos|consigo) )(bajar|subir|cambiar|modificar|ajustar|poner|elegir) (el |los |un |mi )?objetivos?( glucemicos?| de (glucosa|glucemia))?/,
    "objetivo glucemico",
    "sustituye",
  ],
  // «se ha quedado sin insulina», «se acabó la insulina»: interrupción del sistema y pluma.
  [
    /quedad[oa] sin insulina|sin insulina|(se )?(ha )?(acabado|terminado|agotado) la insulina|insulina (se )?(ha )?(acabado|terminado|agotado)|(reservorio|deposito|pod) vacio/,
    "interrupcion fallo infusion pluma",
    "sustituye",
  ],
  // «no me deja entrar en automático», «no entra en automático»: las salidas del modo automático.
  [
    /no (me |le |se |nos )?(deja|permite|puede|consigue|consigo|puedo) (entrar|volver|pasar|activar|meter\w*|ponerlo|ponerse) (en|al) (el )?(modo )?automatico|no (entra|vuelve|pasa|entro|vuelvo) (en|al) (el )?(modo )?automatico/,
    "salidas|salida automatico",
    "sustituye",
  ],
  // «sale mucho del automático»: las salidas del modo automático (Tabla 5, paso 1).
  [
    /\b(se )?(sale|salen|salgo|cae|caen)\s+(mucho |muchas veces |a menudo |continuamente |tanto )?(del|de) (modo )?automatico|salidas? (del|de) (modo )?automatico|caidas? (del|de) (modo )?automatico/,
    "salidas|salida automatico",
    "sustituye",
  ],
  // «antes de tocar los parámetros»: lo que el capítulo pide revisar antes de modificar ajustes.
  [
    /antes de (cambiar|modificar|tocar|ajustar|subir|bajar) (los |el |la |las )?(parametros?|ajustes?|configuracion|ratios?|objetivos?)/,
    "antes modificar ajustes",
    "suma",
  ],
  // «qué parámetros cambian/mueven el automático»: los configurables (Tabla 1 y su nota).
  [
    /(parametros?|ajustes?)\s+(que\s+)?(\w+\s+){0,2}(cambian|mueven|modifican|influyen|afectan|actuan|cuentan)\b.{0,25}?(automatico|algoritmo)|que (mueve|cambia|modifica) (el |al )?(modo )?automatico/,
    "parametros configurables automatico",
    "sustituye",
  ],
  [
    /(glucosa|glucemia|azucar)\s+(muy )?(alt[oa]s?|elevad[oa]s?|subid[oa]|disparad[oa]|por encima|por las nubes|altisim[oa])|me sube (la )?(glucosa|azucar)/,
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
  [
    /a partir de (que|cuantos) (edad|anos)|edad minima|que edad/,
    "edad|anos|ano|indicacion",
    "sustituye",
  ],
  [/(cuando|a que hora).*(reanud|volver|reconect|poner otra vez)/, "reanudarse", "suma"],
  [
    /no coinciden?|no cuadra|discrepa\w*|distint[oa]s? (de|a) la capilar|marca (distinto|diferente|otra cosa)/,
    "discrepancias|discordancia",
    "sustituye",
  ],
  [
    /me levanto|al levantarme|me despierto|al despertar(me)?|por las mananas/,
    "matutina|despertar|alba",
    "sustituye",
  ],
  // «sin tener que ponerse bolos»: el asa cerrada completa (Liberty).
  [
    /(sin|no (haga|hace|hiciera) falta|sin tener que) (poner(se|me)? )?(el |los )?bolos?|sin bolos/,
    "liberty|completa",
    "sustituye",
  ],
  [/hace(n)? falta|hagan? falta|haciendo falta|hacer falta/, "necesario", "sustituye"],
  [/\b(me )?(pita|pitan|pitido|pitidos|suena|suenan)\b/, "alarmas|alertas", "sustituye"],
  [/(dormir|duermo|tumbad[oa]) (de lado|encima|sobre)/, "compresion|dormir", "sustituye"],
  [/hidratos (de mentira|falsos|ficticios)|falsos hidratos/, "fantasma", "sustituye"],
  [
    /(fiesta|copas|botellon|emborrach\w*).{0,30}beber|beber.{0,30}(fiesta|copas|alcohol)/,
    "alcohol",
    "sustituye",
  ],
  [/pasa de (ponerse|poner|pincharse)|no se (los )?pone/, "omision", "sustituye"],
  [/peso minimo|cuanto (tiene que |debe )?pesar/, "peso|kg|indicacion", "sustituye"],
  [
    /(empezar|comenzar|antes de) (a )?(entrenar|correr|hacer (deporte|ejercicio)|nadar)/,
    "ejercicio|actividad",
    "sustituye",
  ],
  [/recontrol\w*|volver a medir|repetir (la )?medicion/, "reevaluarse|reevaluar", "sustituye"],
  [
    /(salir a|ir a|voy a|vamos a) (correr|nadar|andar|caminar|pedalear|entrenar)|hacer (deporte|ejercicio)/,
    "ejercicio",
    "sustituye",
  ],
  [
    /\b(harto|harta|cansad[oa]|agobiad[oa]|me agobia|me molesta|me saca de quicio)\b/,
    "fatiga sobrecarga",
    "suma",
  ],
  [/no funciona|no va bien/, "fallo", "sustituye"],
  [/(senales|signos) de (alarma|alerta)/, "signos", "sustituye"],
  [/dias? de enfermedad/, "enfermedad intercurrente", "sustituye"],
  [/servicio tecnico/, "soporte tecnico", "sustituye"],
  [
    /(movil|telefono|app|aplicacion|sensor)\b.{0,25}\bdesconecta\w*|desconecta\w*\b.{0,25}\b(movil|telefono|app|aplicacion|bluetooth)|perdida de (senal|conexion|comunicacion)/,
    "comunicacion|conexion|bluetooth",
    "sustituye",
  ],
  [
    /(bajadas?|hipoglucemias?|lecturas?|alarmas?) falsas?|falsas? (bajadas?|hipoglucemias?|alarmas?)/,
    "falsamente|falsas|compresion",
    "sustituye",
  ],
  [
    /quedar(me|se)? embarazada|buscar (un )?embarazo|planificar (un |el )?embarazo/,
    "planificacion|gestacional gestacion|embarazo",
    "sustituye",
  ],
  [/(se me|se) dispara/, "hiperglucemia|ascenso", "sustituye"],
  [/dieta absoluta|nada por boca|sin comer/, "ayunas", "sustituye"],
  [/(despues de|tras|al) (empezar|iniciar|comenzar)/, "inicio|iniciacion", "sustituye"],
  [/cirugia (mayor|larga|compleja|importante)/, "cirugia prolongada|compleja", "sustituye"],
  // Hidratos y una hipoglucemia: el tratamiento de la hipoglucemia leve.
  [
    /(hidratos|azucar|zumo|glucosa).{0,25}hipoglucemia|hipoglucemia.{0,25}(hidratos|azucar)/,
    "leve tratarse",
    "suma",
  ],
  [
    /contar (los )?(hidratos|carbohidratos|raciones)/,
    "recuento|anuncio hidratos|comidas",
    "sustituye",
  ],
  [/material de (repuesto|recambio)|repuestos?|recambios?/, "recambios|repuesto", "sustituye"],
  [/loops? caseros?|caseros?|hechos? en casa|androidaps|openaps|\bloop\b/, "diy", "sustituye"],
  // «mi madre tiene 80 años»: la persona es ella; «madre» no pregunta por los progenitores.
  [/\b(mi|a mi|de mi) (madre|padre|abuel[oa]|marido|mujer|pareja|tia|tio)\b/, " ", "sustituye"],
  [/cuant[oa]s? (hidratos|gramos|carbohidratos)/, "hidratos cantidades g", "sustituye"],
  [/(se )?salta(rse)? (los )?bolos|no se pone (los )?bolos/, "omision bolos", "sustituye"],
  [/multiples dosis( diarias)?|inyecciones multiples|desde (las )?plumas/, "mdi", "sustituye"],
  [/pasar de mdi|de plumas a (la )?bomba|desde mdi/, "mdi transicion", "sustituye"],
  [
    /(cuando|cada cuanto) (revisar|ver|veo|citar|cito|visito)|primeras visitas|seguimiento inicial/,
    "seguimiento|contacto|revision|visita",
    "sustituye",
  ],
  [/cuanto (modificar|cambiar|subir|bajar)/, "modificarse", "sustituye"],
  [
    /(cuantos|demasiad[oa]s|much[oa]s) (bolos automaticos|autocorrecciones)/,
    "exceso autocorrecciones",
    "sustituye",
  ],
  [/plan de seguridad/, "incluir", "suma"],
  [/(personas|pacientes) mayores|edad avanzada/, "ancianidad|mayor", "sustituye"],
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
    /(pasar|paso|volver|cambiar|cambio) de (la )?(perfusion|insulina intravenosa|intravenosa|iv)\b/,
    "volver desde insulina intravenosa paralelo",
    "sustituye",
  ],
];

/* Señales: conducta («qué hago», una cifra con unidad) frente a definición («qué es»). */
const RE_CONDUCTA =
  /\b(que (hago|hacer|hacemos|debo)|como (actuo|actuar|tratar|manejar)|actuacion|pauta|tratamiento|cuando|cuanto|cuantos|cuantas)\b|\d+[,.]\d+|\d+\s*(mg|mmol|g\b|h\b|horas|ui)|(glucosa|glucemia|azucar) (de )?\d{2,3}\b/;
const RE_DEFINICION = /\b(que es|que son|que significa|significado|definicion|que quiere decir)\b/;

/* Una cifra de verdad (con unidad, decimal o comparador), no una numeración («1 Seleccionar →
   2 Educar»). */
const RE_CIFRA =
  /\d+\s*(h|horas?|min|minutos|dias?|semanas?|meses|anos?|%|mg|mmol|g|ui|kg)\b|\d+[,.]\d+|[<>≤≥]\s?\d/;

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

/* Edades del texto: «≥ 1 año», «≥ 2 años», «< 7 años». */
function cumpleEdad(texto: string, v: number): number {
  let mejor = 0;
  for (const m of normalizar(texto).matchAll(/(<|>|≤|≥)?\s?(\d{1,3})\s?anos?\b/g)) {
    const u = Number(m[2]);
    const ok =
      m[1] === "<"
        ? v < u
        : m[1] === ">"
          ? v > u
          : m[1] === "≤"
            ? v <= u
            : m[1] === "≥"
              ? v >= u
              : v === u;
    mejor = Math.max(mejor, ok ? 1.5 : 0.3);
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

/* Una frase que empieza por un conector necesita la anterior para entenderse. */
const RE_CONECTOR =
  /^(Por ello|Por eso|Por tanto|Por el momento|Por ahora|Esta|Este|Estas|Estos|Esto|Ello|Ese|Esa|Dicho|Dicha|Ambos|Ambas|En esa|En ese|En estos|En estas|Además|Sin embargo|No obstante|Aun así|Así|Hasta entonces|También|En cambio|Durante este|Su |Sus )/;

const NOMBRE_SIS = (i: number) => LISTA_TABLAS[0].columnas[i];

let ATOMOS: Atomo[] | null = null;
let PESO: Map<string, number> | null = null;
/* Palabras del capítulo (y del léxico) por cómo suenan, y todas tal como se escriben. */
let SONIDO: Map<string, string> | null = null;
let SUPERFICIE: Map<string, string> | null = null;

function rutaTabla(t: Tabla, fila: number, col?: number) {
  const st = SITUACIONES.find((x) => x.tabla === t.id && x.fila === fila);
  if (st)
    return href("consultar", "situacion", col === undefined ? st.id : `${st.id}:${SIS_IDS[col]}`);
  if (col !== undefined && (t.id === "T1" || t.id === "T3")) {
    // La sección de la ficha que enseña esa fila: parámetros, lo esencial o cómo funciona.
    const e = t.filas[fila]?.etiqueta ?? "";
    const seccion =
      t.id === "T3" || e.startsWith("Parámetros configurables")
        ? "parametros"
        : ["Formato", "Indicación", "Gestación: autorización y evidencia"].includes(e)
          ? "esencial"
          : "funciona";
    return href("sistemas", ORDEN_SISTEMAS[col], seccion);
  }
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
              // «Ver en el apartado» lleva a la frase y la resalta (fraseCitada.ts).
              ruta: fs.length > 1 ? href("capitulo", a.slug, `${id}~${k}`) : ruta,
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
              ruta: href("capitulo", a.slug, `${id}~${k}`),
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
  // La nota del asterisco: a quién se refieren las dosis (adultos; no en pediatría ni gestación).
  add(
    {
      ...F3,
      id: "F3/nota",
      titulo: "Dosis orientativas de la Figura 3 (nota del asterisco)",
      texto: plano(FIGURA3.notaAsterisco),
      ruta: href("consultar", "figura-3"),
    },
    {
      titulo: "dosis orientativas UI/kg",
      claves: `${FIGURA3.cabecera} 0,1 0,15 UI/kg insulina pluma rescate poblacion`,
      cuerpo: FIGURA3.notaAsterisco,
    },
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
        ruta: href("capitulo", apartadoDePagina(g.pagina)?.slug ?? APARTADOS[0].slug),
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
  // Vocabulario para corregir faltas: la forma más frecuente de cada sonido.
  const cuenta = new Map<string, number>();
  for (const a of out)
    for (const w of palabras(`${a.r.titulo} ${a.todo}`))
      if (w.length >= 4 && !/\d/.test(w) && !STOP.has(w)) cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
  for (const w of [...Object.keys(LEXICO), ...GENERICAS]) cuenta.set(w, 1e6);
  SONIDO = new Map();
  SUPERFICIE = new Map();
  for (const [w] of [...cuenta].sort((x, y) => y[1] - x[1])) {
    const f = fonetica(w);
    if (!SONIDO.has(f)) SONIDO.set(f, w);
    if (!SUPERFICIE.has(w)) SUPERFICIE.set(w, raiz(w));
  }
  ATOMOS = out;
  return out;
}

/* ¿Entiende el capítulo esta palabra? (ella, su raíz o su equivalente del léxico) */
function conocible(w: string) {
  if (STOP.has(w) || GENERICAS.has(w) || lexico(w) || ALIAS_SISTEMA[w] !== undefined) return true;
  const r = raiz(w);
  if (PESO!.has(r)) return true;
  for (const v of PESO!.keys()) if (casa(r, v)) return true;
  return false;
}

/* Una palabra que el capítulo no tiene: la que suena igual («bomitos» → «vomitos») o, si es
   larga (7 letras o más), la única que está a una errata. */
function corregir(w: string): string | null {
  if (w.length < 4 || /\d/.test(w)) return null;
  const f = SONIDO!.get(fonetica(w));
  if (f && f !== w) return f;
  if (w.length < 7) return null;
  const cand = new Map<string, string>();
  for (const [v, r] of SUPERFICIE!)
    if (Math.abs(v.length - w.length) <= 1 && casiIgual(w, v) && !cand.has(r)) cand.set(r, v);
  return cand.size === 1 ? [...cand.values()][0] : null;
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
  /* Como se escribió (ya normalizada) y si es una palabra genérica (GENERICAS). */
  escrita?: string;
  generica?: boolean;
}

export function gruposDe(pregunta: string): Grupo[] {
  atomos();
  // Primero las faltas, para que las expresiones casen («asucar alto» → «azucar alto»).
  let q = unificar(pregunta).replace(/[a-zñ]{4,}/g, (w) => (conocible(w) ? w : (corregir(w) ?? w)));
  const extra: string[] = [];
  q = q
    .replace(/\b(bajadas?|bajon(es)?|hipos?)\b/g, "hipoglucemia")
    .replace(/\b(subidas?|subidon(es)?)\b/g, "hiperglucemia");
  // Las alternativas «a|b» viajan como una marca («zzalt0») hasta hacerse un grupo.
  const alternativas: string[][] = [];
  for (const [re, mas, modo] of FRASES)
    if (re.test(q)) {
      const texto = mas.replace(/\S*\|\S*/g, (alt) => {
        alternativas.push(alt.split("|"));
        return `zzalt${alternativas.length - 1}`;
      });
      if (modo === "sustituye") q = q.replace(re, ` ${texto} `);
      else extra.push(texto);
    }
  const vistos = new Set<string>();
  const grupos: Grupo[] = [];
  // Una edad («80 años», «hijo de 1 año»): la pregunta es por la edad o, en los extremos, por
  // la población (mayores, pediatría). Cualquiera de esas palabras la cubre.
  q = q.replace(/\b(\d{1,3}) (anos|ano|meses)\b/g, (_, n: string, u: string) => {
    const v = u === "meses" ? 0 : Number(n);
    const pob = v >= 65 ? "ancianidad fragilidad" : v < 18 ? "pediatrica pediatria" : "";
    grupos.push({
      palabras: [...new Set(palabras(`${pob} edad anos ano`).map(raiz))],
      escrita: `${n} ${u}`,
    });
    return " ";
  });
  // Con la edad dicha, «hijo» o «niño» ya no añaden nada.
  if (grupos.length) q = q.replace(/\b(hij[oa]s?|nin[oa]s?|bebes?)\b/g, " ");
  // Con glucosa en la pregunta, una cifra de 2-3 dígitos es un valor (lo miran los umbrales),
  // no una palabra que la respuesta tenga que contener.
  const hayGlucosa = /glucos|glucem|azucar|hipogluc|hipergluc|mg/.test(q);
  const meter = (w: string, bonus: boolean) => {
    if (STOP.has(w) || vistos.has(w)) return;
    const alt = /^zzalt(\d+)$/.exec(w);
    if (alt) {
      vistos.add(w);
      const ps = alternativas[Number(alt[1])].map(raiz);
      grupos.push({ palabras: [...new Set(ps)], escrita: ps.join("|"), bonus });
      return;
    }
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
    const lex = lexico(w);
    grupos.push({
      palabras: [...new Set([r, ...(lex ?? []).map(raiz)])],
      prefijo: r === w && w.length >= 5 && !lex,
      bonus,
      escrita: w,
      generica: GENERICAS.has(w),
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

/* Sistemas y bombas que el capítulo no trata: la consulta que los nombra no tiene respuesta
   específica, aunque comparta palabras generales («configurar», «parámetros»). */
const NO_CUBIERTOS: [RegExp, string][] = [
  [/\bilet\b|beta bionics/, "iLet"],
  [/diabeloop|dblg1/, "Diabeloop (DBLG1)"],
  [/medtrum|nano\b/, "Medtrum"],
  [/twiist/, "Twiist"],
  [/kaleido/, "Kaleido"],
  [/\bdana\b/, "Dana"],
  [/accu-?chek|insight\b|\bsolo\b/, "Accu-Chek Insight/Solo"],
  [/\b(640g|670g|770g)\b/, "MiniMed 640G/670G/770G"],
  [/basal-?iq/, "Basal-IQ"],
  [/\bdash\b/, "Omnipod DASH"],
];
export function sistemaNoCubierto(pregunta: string): string | null {
  const q = normalizar(pregunta);
  return NO_CUBIERTOS.find(([re]) => re.test(q))?.[1] ?? null;
}

/* El número de paso que pide la consulta («paso 7», «paso tres», «séptimo paso»), o null. */
const PASO_PALABRA: Record<string, number> = {
  uno: 1,
  primer: 1,
  primero: 1,
  primera: 1,
  dos: 2,
  segundo: 2,
  segunda: 2,
  tres: 3,
  tercer: 3,
  tercero: 3,
  tercera: 3,
  cuatro: 4,
  cuarto: 4,
  cuarta: 4,
  cinco: 5,
  quinto: 5,
  quinta: 5,
  seis: 6,
  sexto: 6,
  sexta: 6,
  siete: 7,
  septimo: 7,
  septima: 7,
  ocho: 8,
  octavo: 8,
  octava: 8,
};
export function numeroDePaso(pregunta: string): number | null {
  const q = normalizar(pregunta);
  // «paso 7», «paso tres» y, si no, «séptimo paso».
  for (const c of [/\bpaso\s*(\d|[a-z]+)\b/.exec(q)?.[1], /\b([a-z]+)\s+paso\b/.exec(q)?.[1]]) {
    if (!c) continue;
    const n = /^\d$/.test(c) ? Number(c) : PASO_PALABRA[c];
    if (n && n >= 1 && n <= 8) return n;
  }
  return null;
}

/* «Paso 7 de la descarga»: ese paso de la Tabla 5 es la respuesta, delante de lo demás. */
export function responder(pregunta: string, opciones: { max?: number } = {}): Respuesta[] {
  const base = responderBase(pregunta, opciones);
  const q = normalizar(pregunta);
  const paso = numeroDePaso(pregunta);
  if (!paso || !/descarga|tabla 5/.test(q)) return base;
  const a = atomos().find((x) => x.r.id === `T5/${paso - 1}`);
  if (!a) return base;
  const r = resolver(a, undefined, 9);
  return [r, ...base.filter((x) => x.id !== r.id)].slice(0, opciones.max ?? 3);
}

function responderBase(pregunta: string, { max = 3 } = {}): Respuesta[] {
  const ats = atomos();
  const grupos = gruposDe(pregunta);
  // Las palabras genéricas no se exigen, salvo que la pregunta no tenga otras.
  const todas = grupos.filter((g) => g.sistema === undefined && !g.bonus);
  const especificas = todas.filter((g) => !g.generica);
  const utiles = especificas.length ? especificas : todas;
  const conPuntos = grupos.filter((g) => g.sistema === undefined);
  if (!utiles.length) return [];
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
  // Ajena: una palabra con contenido que el capítulo no tiene («semaglutida»); un verbo o un
  // plural que no casa no cuenta como ajena.
  const ajenas = utiles.filter(
    (g) =>
      !conocidas.includes(g) &&
      g.palabras[0].length >= 5 &&
      !/(ar|er|ir|an|en|s)$/.test(g.palabras[0]) &&
      !/(ar|er|ir)(me|se|lo|la|le)?$|(ando|iendo)$/.test(g.escrita ?? ""),
  );
  const hayTramo = !!tramoDeConsulta(unificar(pregunta));
  if (ajenas.length >= conocidas.length && !hayTramo) return [];
  // Peso de cada palabra: su rareza (la de la palabra escrita o, si no está, su equivalente).
  const pesoDe = (g: Grupo) => Math.max(...g.palabras.map((t) => PESO!.get(t) ?? 0)) || 1;
  // Lo ajeno pesa en contra: una pregunta sobre «semaglutida en DM1» no la cubre «DM1».
  const pesoTotal = conocidas.reduce((n, g) => n + pesoDe(g), 0) + ajenas.length;
  const sis = grupos.find((g) => g.sistema !== undefined)?.sistema;
  const qn = normalizar(pregunta);
  const conducta = RE_CONDUCTA.test(qn);
  const definicion = RE_DEFINICION.test(qn);
  const tramo = tramoDeConsulta(unificar(pregunta))?.clave;
  const siglasEscritas = [...qn.matchAll(RE_DESARROLLO)].map((m) => SIGLA_DE.get(m[1]) ?? "");
  // Preguntas que piden una cifra («cuánto», «a partir de qué edad», «objetivo», un valor de
  // glucosa): mejor la frase que la da.
  const pideCifra =
    /\b(cuanto|cuanta|cuantos|cuantas|que (glucosa|glucemia|cifra|valor|dosis|objetivo|edad)|a partir de|umbral|objetivos?|cuando|edad)\b/.test(
      qn,
    );
  const edad = qn.match(/\b(\d{1,3}) anos?\b/);
  const valorEdad = edad ? Number(edad[1]) : null;
  const cifraGlucosa = qn
    .replace(/\b780\b/g, "")
    .replace(/\b\d{1,3} anos?\b/g, "")
    .match(/\b(\d{2,3})\b/);
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
      let segunda = 0;
      const techo = PESO!.get(g.palabras[0]) ?? 1;
      g.palabras.forEach((t, k) => {
        const r = puntuarPalabra(a, t, cuerpo, k === 0 && !!g.prefijo, k > 0 ? techo : Infinity);
        // El equivalente del léxico vale algo menos que la palabra escrita.
        if (k > 0) r.s *= 0.85;
        if (r.s > mejor.s) [segunda, mejor] = [mejor.s, r];
        else segunda = Math.max(segunda, r.s);
      });
      // Si la respuesta dice la idea de dos maneras («fallo» e «interrupción»), suma un poco.
      const s = mejor.s + 0.25 * segunda;
      score += g.generica && especificas.length ? 0.4 * s : s;
      if (g.bonus) continue;
      if (mejor.casa) {
        casados++;
        if (conocidas.includes(g)) cubierto += pesoDe(g);
      }
      if (mejor.titulo) enTitulo++;
    }
    return { score, casados, enTitulo, cobertura: cubierto / pesoTotal };
  };

  const cand: { a: Atomo; score: number; cob: number; tit: number }[] = [];
  const cercanas: { a: Atomo; score: number; cob: number; tit: number }[] = [];
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
    if (!casados || score <= 0) continue;
    // Responde si cubre la pregunta: la mitad (por peso) con el título a favor, o casi toda sin
    // él. Si cubre al menos un tercio, vale solo como «lo más cercano», cuando nada responde.
    const floja = cobertura < 0.5 || (!enTitulo && cobertura < 0.6);
    if (floja && cobertura < (utiles.length >= 5 ? 0.25 : 0.34)) continue;
    // Cuanto más de la pregunta cubre, mejor (desempata frases del mismo tema).
    score += 1.5 * cobertura;
    // Precisión: la parte del título que casa desempata «Diatermia» frente a un título largo.
    if (enTitulo && a.titulo.length) score += 0.6 * (enTitulo / a.titulo.length);
    // Sistema nombrado: su casilla responde; un texto que nombra solo otros sistemas, no.
    if (sis !== undefined) {
      if (a.porSis) score += 2;
      else if (a.nombra.includes(sis)) score += 1.5;
      else if (a.nombraParrafo.includes(sis)) score += 0.8;
      else if (a.nombra.length) score -= 1.5;
      // Liberty (asa cerrada completa, no comercializado) no es ninguno de los cuatro.
      else if (a.parrafo.includes("liberty") || a.cuerpo.includes("liberty")) score -= 1.5;
    }
    if (tramo && a.tramo) score += a.tramo === tramo ? 6 : -2;
    else if (a.tramo) {
      const propias = propiasDeTramo().get(a.tramo) ?? [];
      if (!conPuntos.some((g) => g.palabras.some((t) => propias.some((x) => casa(t, x)))))
        score -= 3;
    }
    if (pideCifra && RE_CIFRA.test(normalizar(a.todo))) score += 1;
    // La edad decide en la infancia («≥ 1 año», «≥ 2 años»); en un adulto, cualquiera la cumple.
    if (valorEdad !== null && valorEdad < 18) score += cumpleEdad(a.todo, valorEdad);
    if (valorGlucosa !== null && /mg\/dl/.test(a.todo))
      score += 0.4 + cumpleUmbral(a.todo, valorGlucosa);
    // Palabras de la pregunta que van seguidas en la respuesta («dosis basal de respaldo»).
    const seq = celda !== undefined && a.seqSis ? a.seqSis[celda] : a.seq;
    for (let k = 0; k + 1 < conPuntos.length; k++) {
      if (conPuntos[k].generica && conPuntos[k + 1].generica) continue;
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
    // La sigla cuyo desarrollo ya está escrito en la pregunta («tiempo en rango»: TIR, y su
    // variante TIRp) no aporta nada nuevo.
    if (
      a.sigla &&
      (qn.includes(desarrolloDe(a)) ||
        siglasEscritas.some((x) => normalizar(a.r.titulo).startsWith(x)))
    )
      score -= 8;
    // La sigla responde a «qué es»; si se pregunta algo más, la frase que lo dice va antes.
    if (a.sigla && !definicion && utiles.length > 1) score -= 3;
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
    (floja ? cercanas : cand).push({ a, score, cob: cobertura, tit: enTitulo });
  }
  // Nada responde de lleno: lo más cercano, marcado como tal (la pregunta es sobre todo del
  // capítulo; si las palabras ajenas eran mayoría, ya no consta).
  const lista = cand.length ? cand : cercanas;
  lista.sort((x, y) => y.score - x.score || x.a.r.id.localeCompare(y.a.r.id));
  // Y si la primera cubre poco de la pregunta y apenas saca ventaja a la siguiente de otro
  // párrafo, tampoco se presenta como «la respuesta»: así acertaba menos de la mitad de las
  // veces en los bancos de prueba (docs/PREGUNTAS_2026-10-04.md).
  const bloque = (c: (typeof lista)[number]) => c.a.r.ruta.replace(/~\d+$/, "") + c.a.r.titulo;
  const rival = lista.find((c) => lista[0] && bloque(c) !== bloque(lista[0]));
  const dudosa =
    !!lista[0] && lista[0].cob < 0.75 && (rival ? lista[0].score - rival.score : 9) < 1;
  const aproximada = !cand.length || dudosa;

  // Como mucho una respuesta por párrafo, fila o tramo.
  const vistos = new Set<string>();
  const out: Respuesta[] = [];
  for (const c of lista) {
    const clave = c.a.r.ruta.replace(/~\d+$/, "") + (c.a.r.tipo === "texto" ? "" : c.a.r.titulo);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    let r = resolver(c.a, sis, c.score);
    // Otra frase del mismo párrafo casi igual de buena: va con ella, en el orden del texto, en
    // vez de quedar escondida (como mucho una respuesta por párrafo).
    const m = /^t\/(.+)\/(\d+)$/.exec(c.a.r.id);
    const otra = m
      ? lista.find((o) => o !== c && o.a.r.id.startsWith(`t/${m[1]}/`) && o.score >= 0.85 * c.score)
      : undefined;
    if (m && otra) {
      const [k1, k2] = [Number(m[2]), Number(otra.a.r.id.split("/").pop())];
      const [x, y] = k1 < k2 ? [c.a.r, otra.a.r] : [otra.a.r, c.a.r];
      r = {
        ...r,
        texto: Math.abs(k1 - k2) === 1 ? `${x.texto} ${y.texto}` : `${x.texto} … ${y.texto}`,
        contexto: x.contexto,
      };
    }
    out.push(aproximada ? { ...r, aproximada } : r);
    if (out.length >= max) break;
  }
  return out;
}

/* ------------------------------------------------- palabras y sentido juntos */

/* Los pasajes más parecidos por el sentido (semantica.ts → /api/pasajes: ids de átomos con su
   similitud, de más a menos) se funden con los del motor por rango recíproco: sube lo que las
   dos listas ponen arriba. Salvaguardas: con una cifra de β-OHB manda el motor (la rama de la
   Figura 3); con un sistema nombrado no entran pasajes que solo hablan de otros; como mucho uno
   por párrafo; y lo que solo aporta el sentido con similitud baja va como «coincidencia
   parcial». Si el capítulo no lo trata (el motor no da nada), el sentido solo propone, nunca
   responde. Sin parecidos (sin conexión), es el motor de siempre. */
const RRF = 60;
const SENTIDO_DIRECTO = 0.7;
const SENTIDO_MINIMO = 0.6;

export function fusionar(
  pregunta: string,
  parecidos: { id: string; s: number }[],
  { max = 3 } = {},
): Respuesta[] {
  const lex = responder(pregunta, { max: 10 });
  if (!parecidos.length || tramoDeConsulta(unificar(pregunta))) return lex.slice(0, max);
  const ats = atomos();
  const porId = new Map(ats.map((a) => [a.r.id, a]));
  const sis = gruposDe(pregunta).find((g) => g.sistema !== undefined)?.sistema;
  const valeSentido = (a: Atomo) =>
    sis === undefined || !!a.porSis || a.nombra.includes(sis) || !a.nombra.length;
  const sem = parecidos
    .filter((p) => p.s >= SENTIDO_MINIMO)
    .map((p) => ({ a: porId.get(p.id), s: p.s }))
    .filter((x): x is { a: Atomo; s: number } => !!x.a && valeSentido(x.a));
  // Clave de párrafo (como en responder): una sola respuesta por párrafo, fila o tramo.
  const clave = (r: { ruta: string; tipo: string; titulo: string }) =>
    r.ruta.replace(/~\d+$/, "") + (r.tipo === "texto" ? "" : r.titulo);
  const puntos = new Map<string, { r: Respuesta; s: number; lexico: boolean; sim: number }>();
  lex.forEach((r, k) => puntos.set(clave(r), { r, s: 1 / (RRF + k), lexico: true, sim: 0 }));
  sem.forEach(({ a, s }, k) => {
    const c = clave(a.r);
    const ya = puntos.get(c);
    if (ya) {
      ya.s += 1 / (RRF + k);
      ya.sim = Math.max(ya.sim, s);
    } else
      puntos.set(c, {
        r: { ...resolver(a, sis, 0), aproximada: !lex.length || s < SENTIDO_DIRECTO },
        s: 1 / (RRF + k),
        lexico: false,
        sim: s,
      });
  });
  const orden = [...puntos.values()].sort((x, y) => y.s - x.s);
  // El capítulo no lo trata: el sentido propone, sin presentarlo como respuesta.
  if (!lex.length)
    return orden
      .filter((x) => x.sim >= SENTIDO_DIRECTO)
      .slice(0, max)
      .map((x) => ({ ...x.r, aproximada: true }));
  return orden.slice(0, max).map((x) => x.r);
}

/* El desarrollo de una sigla del glosario, sin el comentario entre paréntesis. */
const desarrolloDe = (a: Atomo) =>
  normalizar(a.r.texto.replace(/^[^:]*:\s*/, "").replace(/\s*\(.*$/, "")).trim();

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
      casillas: a.r.porSistema,
      score,
    };
  }
  return { ...a.r, score };
}

/* ------------------------------------------------------ preguntas frecuentes */

/* Una pregunta frecuente (frecuentes.ts) responde con sus pasajes, revisados de antemano, cuando
   la búsqueda se le parece de verdad: lo importante de la búsqueda está en la pregunta (o en una
   de sus formas) y lo importante de la pregunta, en la búsqueda. Se compara con las mismas
   palabras, raíces y expresiones que el resto del motor. Con una cifra de β-OHB manda la rama
   de la Figura 3, no una pregunta general. */
export interface RespuestaFrecuente {
  id: string;
  pregunta: string;
  respuestas: Respuesta[];
}

let CANDIDATAS: { f: Frecuente; formas: { grupos: Grupo[]; negadas: Grupo[] }[] }[] | null = null;
const UMBRAL_BUSQUEDA = 0.7;
const UMBRAL_PREGUNTA = 0.6;

const contenido = (gs: Grupo[]) => gs.filter((g) => g.sistema === undefined && !g.bonus);
const pesoGrupo = (g: Grupo) =>
  g.generica ? 0.3 : Math.max(...g.palabras.map((t) => PESO!.get(t) ?? 3));
const casanGrupos = (a: Grupo, b: Grupo) =>
  a.palabras.some((t) => b.palabras.some((u) => casa(t, u) || casa(u, t)));
/* Parte (por peso) de `a` que tiene equivalente en `b`. */
function cubre(a: Grupo[], b: Grupo[]) {
  const total = a.reduce((n, g) => n + pesoGrupo(g), 0);
  if (!total) return 0;
  const dentro = a.filter((g) => b.some((h) => casanGrupos(g, h)));
  return dentro.reduce((n, g) => n + pesoGrupo(g), 0) / total;
}

/* Lo que un texto niega («sin embarazo», «no hay cetonas»), cada palabra con sus equivalentes
   (el grupo del texto: «embarazo» ~ «gestación»). */
function negadasDe(texto: string, gs: Grupo[]): Grupo[] {
  return [...normalizar(texto).matchAll(/\b(?:sin|no)\s+(?:hay\s+|tiene\s+)?([a-zñ]{4,})/g)].map(
    (m) => {
      const r = raiz(m[1]);
      return gs.find((g) => g.escrita === m[1] || g.palabras.includes(r)) ?? { palabras: [r] };
    },
  );
}

/* La frecuente que más se parece, con las dos coberturas, sin umbral (para medir y afinar). */
export function mejorFrecuente(
  pregunta: string,
): (RespuestaFrecuente & { deBusqueda: number; dePregunta: number }) | null {
  const ats = atomos();
  if (tramoDeConsulta(unificar(pregunta))) return null;
  const grupos = gruposDe(pregunta);
  const q = contenido(grupos);
  if (!q.length || q.every((g) => g.generica)) return null;
  CANDIDATAS ??= FRECUENTES.map((f) => ({
    f,
    formas: [f.pregunta, ...f.variantes].map((t) => {
      const grupos = contenido(gruposDe(t));
      return { grupos, negadas: negadasDe(t, grupos) };
    }),
  }));
  const sis = grupos.find((g) => g.sistema !== undefined)?.sistema;
  const porId = new Map(ats.map((a) => [a.r.id, a]));
  // Lo que la búsqueda niega no puede ser lo que la pregunta frecuente pide (salvo que ella
  // también lo niegue: «sin experiencia en MCG»).
  const negadas = negadasDe(pregunta, q);
  // La búsqueda tiene que estar casi entera en la pregunta y al revés: manda la menor de las dos
  // coberturas; desempata la suma.
  const valor = (a: number, b: number) => Math.min(a, b) + 0.5 * (a + b);
  let mejor: { f: Frecuente; deBusqueda: number; dePregunta: number } | null = null;
  for (const { f, formas } of CANDIDATAS) {
    // Con un sistema nombrado, solo vale una pregunta cuyos pasajes digan algo de ese sistema
    // (una fila por sistema o un texto que lo nombra); si no, responde el motor con lo suyo.
    if (
      sis !== undefined &&
      !f.pasajes.some((id) => {
        const a = porId.get(id);
        return !!a && (!!a.porSis || a.nombra.includes(sis));
      })
    )
      continue;
    for (const { grupos: c, negadas: niega } of formas) {
      const choca = (n: Grupo) =>
        c.some((g) => casanGrupos(n, g) && !niega.some((m) => casanGrupos(m, g)));
      if (negadas.some(choca)) continue;
      const deBusqueda = cubre(q, c);
      const dePregunta = cubre(c, q);
      if (!mejor || valor(deBusqueda, dePregunta) > valor(mejor.deBusqueda, mejor.dePregunta))
        mejor = { f, deBusqueda, dePregunta };
    }
  }
  if (!mejor) return null;
  const puntos = mejor.deBusqueda + mejor.dePregunta;
  const respuestas = mejor.f.pasajes
    .map((id) => porId.get(id))
    .filter((a): a is Atomo => !!a)
    .map((a) => resolver(a, sis, puntos));
  if (!respuestas.length) return null;
  return {
    id: mejor.f.id,
    pregunta: mejor.f.pregunta,
    respuestas,
    deBusqueda: mejor.deBusqueda,
    dePregunta: mejor.dePregunta,
  };
}

export function preguntaFrecuente(pregunta: string): RespuestaFrecuente | null {
  const m = mejorFrecuente(pregunta);
  if (!m || m.deBusqueda < UMBRAL_BUSQUEDA || m.dePregunta < UMBRAL_PREGUNTA) return null;
  return { id: m.id, pregunta: m.pregunta, respuestas: m.respuestas };
}

/* Una pregunta frecuente por su id, con sus pasajes tal cual (pantalla «Preguntas frecuentes»
   por temas: el camino cuando la búsqueda libre no da nada). */
export function respuestaDeFrecuente(id: string): RespuestaFrecuente | null {
  const f = FRECUENTES.find((x) => x.id === id);
  if (!f) return null;
  const porId = new Map(atomos().map((a) => [a.r.id, a]));
  const respuestas = f.pasajes
    .map((x) => porId.get(x))
    .filter((a): a is Atomo => !!a)
    .map((a) => resolver(a, undefined, 2));
  return respuestas.length ? { id: f.id, pregunta: f.pregunta, respuestas } : null;
}

/* Por el sentido (semantica.ts → /api/frecuente): las preguntas frecuentes más parecidas a la
   búsqueda, de más a menos, ya filtradas por el umbral de similitud del servicio. Aquí pasan las
   mismas salvaguardas que por las palabras: nada con una cifra de β-OHB ni con una búsqueda solo
   de palabras genéricas, un sistema nombrado necesita pasajes con algo suyo y lo que la búsqueda
   niega no puede ser lo que la pregunta pide. Devuelve la primera que las pasa. */
export function frecuentePorSentido(pregunta: string, ids: string[]): RespuestaFrecuente | null {
  const ats = atomos();
  if (tramoDeConsulta(unificar(pregunta))) return null;
  const grupos = gruposDe(pregunta);
  const q = contenido(grupos);
  if (!q.length || q.every((g) => g.generica)) return null;
  const sis = grupos.find((g) => g.sistema !== undefined)?.sistema;
  const porId = new Map(ats.map((a) => [a.r.id, a]));
  const negadas = negadasDe(pregunta, q);
  for (const id of ids) {
    const f = FRECUENTES.find((x) => x.id === id);
    if (!f) continue;
    const pasajes = f.pasajes.map((p) => porId.get(p)).filter((a): a is Atomo => !!a);
    if (!pasajes.length) continue;
    if (sis !== undefined && !pasajes.some((a) => !!a.porSis || a.nombra.includes(sis))) continue;
    const propia = contenido(gruposDe(f.pregunta));
    const niega = negadasDe(f.pregunta, propia);
    const choca = (n: Grupo) =>
      propia.some((g) => casanGrupos(n, g) && !niega.some((m) => casanGrupos(m, g)));
    if (negadas.some(choca)) continue;
    return { id: f.id, pregunta: f.pregunta, respuestas: pasajes.map((a) => resolver(a, sis, 1)) };
  }
  return null;
}

/* ------------------------------------------------------ entrega 3: responder con más mano */

/* Una respuesta por su id (cambiar de tramo de la Figura 3 dentro de la tarjeta). */
export function respuestaPorId(id: string, sis?: number): Respuesta | null {
  const a = atomos().find((x) => x.r.id === id);
  return a ? resolver(a, sis, 1) : null;
}

/* La frase anterior y la siguiente del mismo párrafo (ids t/<apartado>/<bloque>/<k>). */
export function contextoDe(id: string): { antes?: string; despues?: string } {
  const m = id.match(/^(t\/.+)\/(\d+)$/);
  if (!m) return {};
  const k = Number(m[2]);
  const ats = atomos();
  const frase = (n: number) => ats.find((x) => x.r.id === `${m[1]}/${n}`)?.r.texto;
  return { antes: k > 0 ? frase(k - 1) : undefined, despues: frase(k + 1) };
}

/* Preguntas frecuentes cercanas por el sentido: las que tienen entre sus pasajes alguno de los
   átomos parecidos, en el orden de parecido (para cuando la búsqueda no da nada). */
export function faqsCercanas(parecidos: { id: string; s: number }[], max = 3): Frecuente[] {
  const out: Frecuente[] = [];
  for (const p of parecidos) {
    for (const f of FRECUENTES) if (f.pasajes.includes(p.id) && !out.includes(f)) out.push(f);
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

/* Preguntas frecuentes relacionadas con lo respondido: las que citan alguno de esos pasajes y,
   si no llegan, las del mismo tema que la frecuente enseñada. */
export function frecuentesRelacionadas(ids: string[], frecuenteId?: string, max = 3): Frecuente[] {
  const out: Frecuente[] = [];
  for (const f of FRECUENTES)
    if (f.id !== frecuenteId && f.pasajes.some((p) => ids.includes(p))) out.push(f);
  if (frecuenteId && out.length < max) {
    const tema = FRECUENTES.find((f) => f.id === frecuenteId)?.tema;
    for (const f of FRECUENTES)
      if (f.tema === tema && f.id !== frecuenteId && !out.includes(f)) out.push(f);
  }
  return out.slice(0, max);
}

/* Seguimiento: la búsqueda nueva solo nombra un sistema («y en Omnipod 5», «con Control-IQ») o
   solo palabras genéricas: hereda el tema de la búsqueda anterior. */
export function esSeguimiento(q: string): boolean {
  if (tramoDeConsulta(unificar(q))) return false;
  const ws = palabras(q);
  const sis = ws.filter((w) => ALIAS_SISTEMA[w] !== undefined);
  // Lo que no es sistema ni palabra vacía ni genérica: si hay algo, es una búsqueda con tema.
  const resto = ws.filter(
    (w) => ALIAS_SISTEMA[w] === undefined && !STOP.has(w) && !GENERICAS.has(w) && w.length > 2,
  );
  return sis.length > 0 && resto.length === 0;
}

/* La búsqueda anterior con el sistema nuevo: «hipoglucemia nocturna 780G» + «y en Omnipod 5»
   → «hipoglucemia nocturna omnipod 5». */
export function conContexto(q: string, anterior: string | null): string | null {
  if (!anterior || !esSeguimiento(q)) return null;
  const tema = palabras(anterior).filter((w) => ALIAS_SISTEMA[w] === undefined);
  if (!tema.length || tema.every((w) => STOP.has(w))) return null;
  const nuevo = palabras(q).filter((w) => !STOP.has(w) || ALIAS_SISTEMA[w] !== undefined);
  return `${tema.join(" ")} ${nuevo.join(" ")}`.trim();
}

const CORTO_SISTEMA = ["780G", "Control-IQ", "CamAPS", "Omnipod 5"];

/* Dos intenciones en una consulta («hipoglucemia nocturna y comidas grasas con 780G»): las partes
   separadas por «y», coma, punto y coma o «¿», con alguna palabra con contenido cada una. Si la
   consulta nombra un sistema, cada parte lo hereda. Null si no hay dos partes. */
export function partesDe(pregunta: string): string[] | null {
  const q = normalizar(pregunta);
  const trozos = q
    .split(/(?<!\d)\s*[,;]\s*(?!\d)|\s+y\s+|\s*[¿?]\s*/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (trozos.length < 2 || trozos.length > 3) return null;
  const sis = gruposDe(q).find((g) => g.sistema !== undefined)?.sistema;
  const nombre = sis !== undefined ? CORTO_SISTEMA[sis] : null;
  const partes = trozos
    // Una cifra de β-OHB ya la responde la rama de la Figura 3: no es otra intención.
    .filter((t) => !tramoDeConsulta(unificar(t)))
    .filter((t) => contenido(gruposDe(t)).some((g) => !g.generica))
    .map((t) =>
      nombre && !gruposDe(t).some((g) => g.sistema !== undefined) ? `${t} ${nombre}` : t,
    );
  return partes.length >= 2 ? partes : null;
}

/* Respuesta en una línea: con una pregunta de cifra («cada cuánto», «desde qué edad», «qué
   objetivo») y una casilla breve de una tabla por sistema entre las respuestas, esa casilla, para
   enseñarla encima de los pasajes. No si ya es la primera respuesta. */
export function datoCorto(pregunta: string, rs: Respuesta[]): Respuesta | null {
  const q = normalizar(pregunta);
  if (
    !/\b(cada cuant|cuant[oa]s?|desde que edad|que edad|a partir de|hasta que|que objetivo|rango|minim|maxim|peso|dtd|cuanto dura|duracion)/.test(
      q,
    )
  )
    return null;
  const i = rs.findIndex(
    (r) => !!r.sistema && r.texto.length > 0 && r.texto.length <= 120 && !r.texto.includes("\n"),
  );
  return i > 0 ? rs[i] : null;
}
