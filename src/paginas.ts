/* «p. 3» o «pp. 11-12». */
export const paginasDe = (p: number, p2?: number) =>
  p2 && p2 !== p ? `pp. ${p}-${p2}` : `p. ${p}`;
