/* «p. 3» o «pp. 11–12» (0.84.1, octava ronda: con raya corta, como las cifras y el índice). */
export const paginasDe = (p: number, p2?: number) =>
  p2 && p2 !== p ? `pp. ${p}–${p2}` : `p. ${p}`;
