/* Frases de un párrafo del capítulo, sin cortar en «p. ej.», «v. Tabla», «aprox.» ni en
   decimales. La usan «Preguntas al capítulo» (respuestas.ts) y el recorrido «Iniciar un
   sistema» (inicio.ts), que citan frases sueltas del texto literal. */
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
