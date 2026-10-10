/* Pinta una «pieza» por referencia (inicio.ts): frases de un párrafo, una lista, una fila de
   tabla, la casilla de un sistema, la línea de inicialización, un hito o un enlace. La usan «Iniciar un sistema» y las guías por referencias (guias/) de la ficha
   de cada sistema. Aquí no hay texto propio: todo sale del capítulo con su página. */
import { ArrowRight } from "lucide-react";
import { TABLAS } from "../contenido";
import { PaginaBadge } from "../ui";
import { Lineas } from "../texto";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { frasesDe, lineasInicializacion, listaDe, type Pieza } from "../inicio";

const hex = CATEGORIA_HEX.consultar;

export function EnlacePagina({ ruta, p }: { ruta: string; p: number }) {
  return (
    <a
      href={ruta}
      className="ml-1 inline-flex min-h-6 items-center gap-0.5 whitespace-nowrap text-xs font-semibold text-slate-600 hover:underline"
    >
      p. {p} <ArrowRight size={11} aria-hidden="true" />
    </a>
  );
}

/* Rótulo de tabla y fila, como en «Situación y sistema». */
function CabeceraTabla({ tabla, etiqueta }: { tabla: keyof typeof TABLAS; etiqueta: string }) {
  const t = TABLAS[tabla];
  return (
    <div className="mb-1.5 flex flex-wrap items-start justify-between gap-2">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: hex.ink }}>
          Tabla {t.numero}
        </div>
        <h3 className="text-sm font-bold text-slate-900">
          <Lineas>{etiqueta}</Lineas>
        </h3>
      </div>
      <PaginaBadge p={t.paginas[0]} p2={t.paginas[1]} />
    </div>
  );
}

function Casilla({ nombre, texto, c }: { nombre: string; texto: string; c: number }) {
  return (
    <div
      className="rounded-xl p-3 text-sm text-slate-800"
      style={{ background: SISTEMA_HEX[c].soft }}
    >
      <span
        className="mb-1 block text-xs font-bold uppercase tracking-wide"
        style={{ color: SISTEMA_HEX[c].ink }}
      >
        {nombre}
      </span>
      <Lineas>{texto}</Lineas>
    </div>
  );
}

export function PiezaVista({ pieza, sis }: { pieza: Pieza; sis?: number }) {
  const caja = "rounded-xl border bg-white p-3";
  const borde = { borderColor: "#e6e6e6" };
  switch (pieza.t) {
    case "frase": {
      const f = frasesDe(pieza.apartado, pieza.bloque, pieza.k, pieza.trozo);
      return (
        <p className="prosa">
          {f.lead && <strong>{f.lead} </strong>}
          {f.frases.join(" ")}
          <EnlacePagina ruta={f.ruta} p={f.pagina} />
        </p>
      );
    }
    case "lista": {
      const l = listaDe(pieza.apartado, pieza.bloque);
      return (
        <div className={caja} style={borde}>
          <p className="text-sm font-semibold text-slate-900">
            {l.intro}
            <EnlacePagina ruta={l.ruta} p={l.pagina} />
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-800">
            {l.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      );
    }
    case "fila": {
      const t = TABLAS[pieza.tabla];
      const f = t.filas[pieza.fila];
      return (
        <div className={caja} style={borde}>
          <CabeceraTabla tabla={pieza.tabla} etiqueta={f.etiqueta} />
          <dl className="grid gap-2 sm:grid-cols-2">
            {t.columnas.map((col, c) => (
              <div
                key={col}
                className="rounded-lg p-2.5"
                style={{ background: c === 0 ? hex.soft : "#f8fafc" }}
              >
                <dt
                  className="mb-0.5 text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: c === 0 ? hex.ink : "#475569" }}
                >
                  {col}
                </dt>
                <dd className="text-sm text-slate-800">
                  <Lineas>{f.celdas[c]}</Lineas>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );
    }
    case "casilla": {
      const t = TABLAS[pieza.tabla];
      const f = t.filas[pieza.fila];
      return (
        <div className={caja} style={borde}>
          <CabeceraTabla tabla={pieza.tabla} etiqueta={f.etiqueta} />
          {sis !== undefined ? (
            <Casilla nombre={t.columnas[sis]} texto={f.celdas[sis]} c={sis} />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {t.columnas.map((nombre, c) => (
                <Casilla key={nombre} nombre={nombre} texto={f.celdas[c]} c={c} />
              ))}
            </div>
          )}
          {(sis !== undefined ? [f.celdas[sis]] : f.celdas).some((c) => c.includes("*")) && (
            <p className="mt-1.5 text-xs text-slate-600">
              {t.notas.find((n) => n.startsWith("*"))}
            </p>
          )}
        </div>
      );
    }
    case "inicializacion": {
      const f = TABLAS.T2.filas[1];
      return (
        <div className={caja} style={borde}>
          <CabeceraTabla tabla="T2" etiqueta={f.etiqueta} />
          <ul className="space-y-1.5">
            {lineasInicializacion(sis).map((l) => (
              <li
                key={l}
                className="rounded-lg p-2.5 text-sm text-slate-800"
                style={{ background: sis !== undefined ? SISTEMA_HEX[sis].soft : hex.soft }}
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-xs text-slate-600">
            <span className="font-bold uppercase tracking-wide">{TABLAS.T2.columnas[1]}: </span>
            {f.celdas[1]}
          </p>
        </div>
      );
    }
    case "hito": {
      const f = frasesDe(pieza.apartado, pieza.bloque, pieza.k);
      return (
        <div className="flex gap-3">
          <span
            className="mt-1 h-3 w-3 shrink-0 rounded-full"
            style={{ background: hex.strong }}
            aria-hidden="true"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{pieza.rotulo}</h3>
            <p className="text-sm text-slate-800">
              {f.frases.join(" ")}
              <EnlacePagina ruta={f.ruta} p={f.pagina} />
            </p>
          </div>
        </div>
      );
    }
    case "enlace":
      return (
        <a
          href={pieza.ruta}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-800 hover:underline"
        >
          {pieza.texto} <ArrowRight size={14} aria-hidden="true" />
        </a>
      );
  }
}
