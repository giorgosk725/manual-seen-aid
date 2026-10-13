/* El contenido del que sale cada pasaje citado (V54-05), para ligar una aprobación al texto
   efectivo y no solo a su identificador. Resuelve el id del pasaje («t/09-descarga/b2/1»,
   «T1/7», «F3/naranja», «sigla/TIR»…) al bloque, fila, nota, figura o sigla de `contenido`
   que lo contiene, con su contexto (el subapartado del bloque, la cabecera de la tabla). Solo
   depende de `contenido`: el motor (respuestas.ts) importa las frecuentes, y esto no puede
   depender de él. Un id que no se resuelve devuelve «?id»: cambia la huella y se ve. */
import { APARTADOS, FIGURA3, FIGURAS, GLOSARIO, TABLAS, idDeBloque } from "./contenido";

export function contenidoDePasaje(id: string): string {
  const partes = id.split("/");
  const [tipo] = partes;
  if (tipo === "t" || tipo === "l") {
    const a = APARTADOS.find((x) => x.slug === partes[1]);
    if (!a) return `?${id}`;
    let sub = "";
    for (let i = 0; i < a.bloques.length; i++) {
      const b = a.bloques[i];
      if (b.t === "h3") sub = b.texto;
      if (idDeBloque(b, i) === partes[2]) return JSON.stringify([a.titulo, sub, b]);
    }
    return `?${id}`;
  }
  if (/^T\d+$/.test(tipo)) {
    const t = TABLAS[tipo as keyof typeof TABLAS];
    if (!t) return `?${id}`;
    const cabecera = [t.titulo, t.cabeceraEtiqueta, t.columnas];
    if (partes[1] === "nota") return JSON.stringify([cabecera, t.notas[Number(partes[2])] ?? "?"]);
    const fila = t.filas[Number(partes[1])];
    return fila ? JSON.stringify([cabecera, fila]) : `?${id}`;
  }
  // La Figura 3 se cita por tramos, pie y notas: cualquier cambio en ella cuenta.
  if (tipo === "F3") return JSON.stringify(FIGURA3);
  if (tipo === "sigla") {
    const g = GLOSARIO.find((x) => x.sigla === partes[1]);
    return g ? JSON.stringify(g) : `?${id}`;
  }
  const f = Object.values(FIGURAS).find((x) => x.id === tipo);
  if (f) {
    const c = f.cajas[Number(partes[1])];
    return c ? JSON.stringify([f.titulo, c]) : `?${id}`;
  }
  return `?${id}`;
}
