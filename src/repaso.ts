/* Tarjetas de repaso: las cifras de cada apartado («Cifras del apartado», contenido/cifras.ts)
   y las siglas que el capítulo desarrolla (glosario), TAL CUAL, con su página. No añaden texto
   clínico: la pregunta es la etiqueta de la cifra (o la sigla) y la respuesta, el valor (o el
   desarrollo).

   Repaso espaciado por cajas (Leitner): lo que se recuerda sube de caja y vuelve más tarde
   (1, 3, 7, 16 y 35 días); lo que no, vuelve a la caja 1 y se repite en la misma ronda. El
   progreso se guarda solo en este dispositivo (prefs.ts, «mseen:repaso»). */
import { CIFRAS, type Cifra } from "./contenido/cifras";
import { GLOSARIO, apartadoPorSlug } from "./contenido";
import { href } from "./rutas";
import type { ProgresoRepaso } from "./prefs";

export interface Tarjeta {
  id: string;
  mazo: "cifras" | "siglas";
  /* Apartado de la cifra (las siglas no tienen). */
  apartado?: string;
  pregunta: string;
  respuesta: string;
  pagina: number;
  /* Dónde leerla: el apartado (o su subapartado) o la sigla en el glosario. */
  ruta: string;
  /* Dosis orientativas de la Figura 3: la respuesta lleva su nota. */
  asterisco: boolean;
}

/* Las cifras de un apartado con la misma etiqueta (p. ej., «necesidad clínica no cubierta»:
   TIR, TBR y TAR, p. 5) son una sola pregunta: una tarjeta con todos sus valores. */
function tarjetasDeCifras(): Tarjeta[] {
  const out: Tarjeta[] = [];
  for (const [slug, lista] of Object.entries(CIFRAS)) {
    const grupos = new Map<string, Cifra[]>();
    for (const c of lista) grupos.set(c.etiqueta, [...(grupos.get(c.etiqueta) ?? []), c]);
    for (const [etiqueta, cs] of grupos)
      out.push({
        id: `c/${slug}/${etiqueta}`,
        mazo: "cifras",
        apartado: slug,
        pregunta: etiqueta,
        respuesta: cs.map((c) => c.valor).join(" · "),
        pagina: cs[0].p,
        ruta: href("capitulo", slug, cs[0].ancla),
        asterisco: cs.some((c) => c.valor.includes("*")),
      });
  }
  return out;
}

export const TARJETAS: Tarjeta[] = [
  ...tarjetasDeCifras(),
  // Las siglas que el capítulo usa sin desarrollar no tienen nada que repasar.
  ...GLOSARIO.filter((g) => !/no desarrollada/.test(g.desarrollo)).map((g): Tarjeta => ({
    id: `s/${g.sigla}`,
    mazo: "siglas",
    pregunta: g.sigla,
    respuesta: g.desarrollo,
    pagina: g.pagina,
    ruta: href("consultar", "glosario", g.sigla),
    asterisco: false,
  })),
];

/* Mazo según la ruta: todo, «cifras», «siglas» o las cifras de un apartado. */
export function mazo(filtro: string | undefined): Tarjeta[] {
  if (!filtro) return TARJETAS;
  if (filtro === "cifras" || filtro === "siglas") return TARJETAS.filter((t) => t.mazo === filtro);
  return TARJETAS.filter((t) => t.apartado === filtro);
}

export const nombreDelMazo = (filtro: string | undefined) => {
  if (!filtro) return "Todas";
  if (filtro === "cifras") return "Cifras";
  if (filtro === "siglas") return "Siglas";
  const a = apartadoPorSlug(filtro);
  return a ? `Cifras del apartado ${a.n}` : "Todas";
};

/* Días hasta la siguiente vez, según la caja a la que sube la tarjeta (1-5). */
export const INTERVALOS = [0, 1, 3, 7, 16, 35] as const;
export const CAJA_MAX = 5;
/* «Aprendida»: la que ya no vuelve hasta dentro de una semana o más (caja 3 en adelante). */
export const APRENDIDA = 3;

const dos = (n: number) => String(n).padStart(2, "0");
/* Fecha local «AAAA-MM-DD» (el repaso es por días del lector, no por horas UTC). */
export const fechaLocal = (d = new Date()) =>
  `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
export const sumarDias = (iso: string, n: number) => {
  const [a, m, d] = iso.split("-").map(Number);
  return fechaLocal(new Date(a, m - 1, d + n));
};

/* `repetida`: la tarjeta ya se falló en esta ronda. Acertarla minutos después no la sube de
   caja: vuelve mañana, como una nueva. */
export function calificar(
  p: ProgresoRepaso,
  id: string,
  seAcordaba: boolean,
  hoy: string,
  { repetida = false } = {},
): ProgresoRepaso {
  const caja = seAcordaba && !repetida ? Math.min(CAJA_MAX, (p[id]?.caja ?? 0) + 1) : 1;
  return { ...p, [id]: { caja, proxima: seAcordaba ? sumarDias(hoy, INTERVALOS[caja]) : hoy } };
}

/* Ronda: primero lo que toca hoy (lo más atrasado antes), luego tarjetas nuevas en el orden
   del capítulo. */
export function ronda(
  lista: Tarjeta[],
  p: ProgresoRepaso,
  hoy: string,
  { nuevas = 10, max = 20 } = {},
): Tarjeta[] {
  const tocan = lista
    .filter((t) => p[t.id] && p[t.id].proxima <= hoy)
    .sort((a, b) => p[a.id].proxima.localeCompare(p[b.id].proxima) || p[a.id].caja - p[b.id].caja);
  const sinVer = lista.filter((t) => !p[t.id]).slice(0, nuevas);
  return [...tocan, ...sinVer].slice(0, max);
}

export function resumen(lista: Tarjeta[], p: ProgresoRepaso, hoy: string) {
  let paraHoy = 0;
  let sinVer = 0;
  let aprendidas = 0;
  for (const t of lista) {
    const e = p[t.id];
    if (!e) sinVer++;
    else {
      if (e.proxima <= hoy) paraHoy++;
      if (e.caja >= APRENDIDA) aprendidas++;
    }
  }
  return { total: lista.length, paraHoy, sinVer, aprendidas };
}
