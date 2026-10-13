/* Huella de un texto (V54-05): dos djb2, de izquierda a derecha y al revés (64 bits), sin
   dependencias. Liga una revisión al contenido exacto que se revisó. */
export function huella(txt: string): string {
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < txt.length; i++) {
    h1 = (Math.imul(h1, 33) ^ txt.charCodeAt(i)) >>> 0;
    h2 = (Math.imul(h2, 33) ^ txt.charCodeAt(txt.length - 1 - i)) >>> 0;
  }
  return h1.toString(36) + h2.toString(36);
}
