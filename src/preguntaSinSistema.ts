/* Una pregunta frecuente sin el nombre del sistema delante («MiniMed 780G: ¿cómo…?» → «¿Cómo…?»),
   donde ya se lee bajo el nombre del sistema (la pestaña Preguntas de su ficha y su tema en
   Preguntas frecuentes). Si el nombre lleva algo más («… en la gestación: ¿…?»), se deja entera.
   Solo cambia la presentación: la pregunta guardada (y su huella de aprobación) sigue igual. */
export const sinNombreDelSistema = (q: string) =>
  q.replace(
    /^(MiniMed 780G|Control-IQ\+?|CamAPS FX|Omnipod 5): ¿(.)/,
    (_m, _n, l: string) => `¿${l.toUpperCase()}`,
  );
