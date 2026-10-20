/* «p. 3» o «pp. 11–12» (0.84.1, octava ronda: con raya corta, como las cifras y el índice). */
export const paginasDe = (p: number, p2?: number) =>
  // 0.85.1 (novena ronda, senior): espacio duro tras «p.» y «pp.»: la referencia no se parte.
  p2 && p2 !== p ? `pp.\u00a0${p}–${p2}` : `p.\u00a0${p}`;
