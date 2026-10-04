/* Raíz de una palabra española: el algoritmo Snowball para español (Porter), sobre texto ya
   en minúsculas y sin tildes (normalizar). Reúne las formas de una misma palabra:
   «desconectado», «desconectar» y «desconectarse» → «desconect»; «reanudar», «reanudación» →
   «reanud»; «hipoglucemias» → «hipoglucemi». Referencia:
   https://snowballstem.org/algorithms/spanish/stemmer.html (sin tildes, las listas de sufijos
   con tilde quedan como sus formas sin tilde). */

const VOCAL = /[aeiou]/;
const esVocal = (c: string | undefined) => !!c && VOCAL.test(c);

/* Regiones R1, R2 y RV (índices donde empiezan). */
function regiones(w: string) {
  const n = w.length;
  const tras = (desde: number) => {
    for (let i = desde + 1; i < n; i++) if (!esVocal(w[i]) && esVocal(w[i - 1])) return i + 1;
    return n;
  };
  const r1 = tras(0);
  const r2 = tras(r1);
  let rv = n;
  if (n >= 2) {
    if (!esVocal(w[1])) {
      for (let i = 2; i < n; i++)
        if (esVocal(w[i])) {
          rv = i + 1;
          break;
        }
    } else if (esVocal(w[0]) && esVocal(w[1])) {
      for (let i = 2; i < n; i++)
        if (!esVocal(w[i])) {
          rv = i + 1;
          break;
        }
    } else rv = 3;
  }
  return { r1, r2, rv: Math.min(rv, n) };
}

const terminaEn = (w: string, sufijos: string[]) =>
  sufijos.filter((s) => w.endsWith(s)).sort((a, b) => b.length - a.length)[0];

/* Paso 0: pronombres pegados («desconectarse» → «desconectar»). */
const PRONOMBRES = [
  "selas",
  "selos",
  "sela",
  "selo",
  "las",
  "les",
  "los",
  "nos",
  "me",
  "se",
  "la",
  "le",
  "lo",
];
function paso0(w: string, rv: number) {
  const p = terminaEn(w, PRONOMBRES);
  if (!p) return w;
  const resto = w.slice(0, -p.length);
  for (const v of ["iendo", "ando", "ar", "er", "ir"])
    if (resto.endsWith(v) && resto.length - v.length >= rv) return resto;
  if (resto.endsWith("yendo") && resto.slice(0, -5).endsWith("u") && resto.length - 5 >= rv)
    return resto;
  return w;
}

/* Paso 1: sufijos de derivación. */
function paso1(w: string, r1: number, r2: number): string | null {
  const en = (i: number) => i >= r2;
  const quitar = (s: string) => w.slice(0, -s.length);
  let s = terminaEn(w, [
    "anza",
    "anzas",
    "ico",
    "ica",
    "icos",
    "icas",
    "ismo",
    "ismos",
    "able",
    "ables",
    "ible",
    "ibles",
    "ista",
    "istas",
    "oso",
    "osa",
    "osos",
    "osas",
    "amiento",
    "amientos",
    "imiento",
    "imientos",
  ]);
  const candidatos: [string[], (b: string, s: string) => string | null][] = [
    [
      ["adora", "ador", "acion", "adoras", "adores", "aciones", "ante", "antes", "ancia", "ancias"],
      (b) => (b.endsWith("ic") && en(b.length - 2) ? b.slice(0, -2) : b),
    ],
    [["logia", "logias"], (b) => b + "log"],
    [["ucion", "uciones"], (b) => b + "u"],
    [["encia", "encias"], (b) => b + "ente"],
    [
      ["mente"],
      (b) =>
        ["ante", "able", "ible"].some((x) => b.endsWith(x) && en(b.length - x.length))
          ? b.slice(0, -4)
          : b,
    ],
    [
      ["idad", "idades"],
      (b) => {
        for (const x of ["abil", "ic", "iv"])
          if (b.endsWith(x) && en(b.length - x.length)) return b.slice(0, -x.length);
        return b;
      },
    ],
    [
      ["iva", "ivo", "ivas", "ivos"],
      (b) => (b.endsWith("at") && en(b.length - 2) ? b.slice(0, -2) : b),
    ],
  ];
  // El sufijo más largo de todas las listas manda.
  let mejor: { s: string; f: ((b: string, s: string) => string | null) | null } | null = s
    ? { s, f: null }
    : null;
  for (const [lista, f] of candidatos) {
    const t = terminaEn(w, lista);
    if (t && (!mejor || t.length > mejor.s.length)) mejor = { s: t, f };
  }
  const amente = w.endsWith("amente") ? "amente" : null;
  if (amente && (!mejor || amente.length >= mejor.s.length)) {
    if (w.length - 6 < r1) return null;
    let b = w.slice(0, -6);
    if (b.endsWith("iv") && en(b.length - 2)) {
      b = b.slice(0, -2);
      if (b.endsWith("at") && en(b.length - 2)) b = b.slice(0, -2);
    } else
      for (const x of ["os", "ic", "ad"])
        if (b.endsWith(x) && en(b.length - x.length)) b = b.slice(0, -x.length);
    return b;
  }
  if (!mejor) return null;
  s = mejor.s;
  if (!en(w.length - s.length)) return null;
  const base = quitar(s);
  return mejor.f ? mejor.f(base, s) : base;
}

const VERBALES_Y = [
  "ya",
  "ye",
  "yan",
  "yen",
  "yeron",
  "yendo",
  "yo",
  "yas",
  "yes",
  "yais",
  "yamos",
];
const VERBALES = [
  "arian",
  "arias",
  "aran",
  "aras",
  "ariais",
  "aria",
  "areis",
  "ariamos",
  "aremos",
  "ara",
  "are",
  "erian",
  "erias",
  "eran",
  "eras",
  "eriais",
  "eria",
  "ereis",
  "eriamos",
  "eremos",
  "era",
  "ere",
  "irian",
  "irias",
  "iran",
  "iras",
  "iriais",
  "iria",
  "ireis",
  "iriamos",
  "iremos",
  "ira",
  "ire",
  "aba",
  "ada",
  "ida",
  "ia",
  "iera",
  "ad",
  "ed",
  "id",
  "ase",
  "iese",
  "aste",
  "iste",
  "an",
  "aban",
  "ian",
  "aran",
  "ieran",
  "asen",
  "iesen",
  "aron",
  "ieron",
  "ado",
  "ido",
  "ando",
  "iendo",
  "io",
  "ar",
  "er",
  "ir",
  "as",
  "abas",
  "adas",
  "idas",
  "ias",
  "aras",
  "ieras",
  "ases",
  "ieses",
  "is",
  "ais",
  "abais",
  "iais",
  "arais",
  "ierais",
  "aseis",
  "ieseis",
  "asteis",
  "isteis",
  "ados",
  "idos",
  "amos",
  "abamos",
  "iamos",
  "imos",
  "aramos",
  "ieramos",
  "iesemos",
  "asemos",
];

/* Palabras que el algoritmo junta con otras de sentido distinto en este capítulo:
   «actividad» (física) no es «activar» (el modo automático); «plana» (basal) no es «plan»;
   «comunicación» (entre dispositivos) no es «común». */
const EXCEPCIONES: Record<string, string> = {
  actividad: "actividad",
  actividades: "actividad",
  plana: "plana",
  planas: "plana",
  comunicacion: "comunicacion",
  comunicaciones: "comunicacion",
  fabricante: "fabricante",
  fabricantes: "fabricante",
};

export function raizEs(palabra: string): string {
  if (EXCEPCIONES[palabra]) return EXCEPCIONES[palabra];
  let w = palabra;
  if (w.length <= 3) return w;
  const { r1, r2, rv } = regiones(w);
  w = paso0(w, rv);
  const p1 = paso1(w, r1, r2);
  if (p1 !== null) w = p1;
  else {
    // Paso 2a: verbos con «y» tras «u».
    const y = terminaEn(w, VERBALES_Y);
    if (y && w.length - y.length >= rv && w.slice(0, -y.length).endsWith("u"))
      w = w.slice(0, -y.length);
    else {
      // Paso 2b: el resto de terminaciones verbales.
      const e = terminaEn(w, ["en", "es", "eis", "emos"]);
      const v = terminaEn(w, VERBALES);
      const s = [e, v].filter(Boolean).sort((a, b) => b!.length - a!.length)[0];
      if (s && w.length - s.length >= rv) {
        w = w.slice(0, -s.length);
        if (s === e && w.endsWith("gu") && w.length - 1 >= rv) w = w.slice(0, -1);
      }
    }
  }
  // Paso 3: vocal residual.
  const r = terminaEn(w, ["os", "a", "o", "e"]);
  if (r && w.length - r.length >= rv) {
    w = w.slice(0, -r.length);
    if (r === "e" && w.endsWith("gu") && w.length - 1 >= rv) w = w.slice(0, -1);
  }
  return w;
}
