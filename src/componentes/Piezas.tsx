import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE } from "../notas-complementarias";
/* Pinta una «pieza» por referencia (inicio.ts): frases de un párrafo, una lista, una fila de
   tabla, la casilla de un sistema, la línea de inicialización, un hito o un enlace. La usan «Iniciación del sistema» y las guías por referencias (guias/) de la ficha
   de cada sistema. Aquí no hay texto propio: todo sale del capítulo con su página. */
import { ArrowRight } from "lucide-react";
import { TABLAS } from "../contenido";
import { PaginaBadge } from "../ui";
import { Lineas, Texto } from "../texto";
import { siglasPorTexto } from "../siglas";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { frasesDe, lineasInicializacion, listaDe, textosDePieza, type Pieza } from "../inicio";

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

function Casilla({
  nombre,
  texto,
  c,
  siglas,
}: {
  nombre: string;
  texto: string;
  c: number;
  siglas?: Set<string>;
}) {
  return (
    <div
      className="rounded-xl p-3 text-sm text-slate-800"
      style={{ background: SISTEMA_HEX[c].soft }}
    >
      {nombre && (
        <span
          className="mb-1 block text-xs font-bold uppercase tracking-wide"
          style={{ color: SISTEMA_HEX[c].ink }}
        >
          {nombre}
        </span>
      )}
      <Lineas siglas={siglas}>{texto}</Lineas>
    </div>
  );
}

/* `compacta`: dentro de una tarea de «Iniciación del sistema», la pieza va sin su cabecera de tabla,
   sin badge de página y sin enlace de página junto a cada frase; la procedencia la pone la
   tarea, una sola vez, al pie. Fuera de ahí (guías de la ficha), todo como siempre. */
/* La nota complementaria registrada de una pieza (M61-03), la misma que en la lectura y en la
   búsqueda: junto a la frase del apartado 3 sobre Liberty y a la fila de indicación. */
function notaDePieza(pieza: Pieza, sis?: number): string | null {
  if (pieza.t === "frase") {
    for (const k of pieza.k) {
      const x = NOTAS_POR_PASAJE[`t/${pieza.apartado}/${pieza.bloque}/${k}`];
      if (x) return x;
    }
  }
  if (pieza.t === "casilla") {
    const clave = `${pieza.tabla}/${pieza.fila}`;
    if (sis === undefined || COLUMNA_DE_NOTA[clave] === undefined || sis === COLUMNA_DE_NOTA[clave])
      return NOTAS_POR_PASAJE[clave] ?? null;
  }
  return null;
}

export function PiezaVista(props: Parameters<typeof PiezaVistaBase>[0]) {
  const nota = notaDePieza(props.pieza, props.sis);
  const base = <PiezaVistaBase {...props} />;
  return nota ? (
    <>
      {base}
      <p className="mt-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600">
        {nota}
      </p>
    </>
  ) : (
    base
  );
}

function PiezaVistaBase({
  pieza,
  sis,
  compacta = false,
  siglas,
}: {
  pieza: Pieza;
  sis?: number;
  compacta?: boolean;
  /* Siglas pendientes de marcar en este bloque: la primera aparición se hace pulsable y se
     quita del conjunto (el conjunto lo crea quien pinta el bloque). */
  siglas?: Set<string>;
}) {
  // Qué siglas se marcan en cada texto de la pieza (su primera aparición), sin mutar nada.
  const textos = siglas ? textosDePieza(pieza, sis) : [];
  const porTexto = new Map(
    siglas ? siglasPorTexto(textos, siglas).map((x, i) => [textos[i], x] as const) : [],
  );
  const pend = (t: string) => porTexto.get(t);
  const T = ({ children }: { children: string }) => (
    <Texto siglas={pend(children)}>{children}</Texto>
  );
  const caja = compacta ? "" : "rounded-xl border bg-white p-3";
  const borde = compacta ? undefined : { borderColor: "#e6e6e6" };
  const Rotulo = ({ tabla, etiqueta }: { tabla: keyof typeof TABLAS; etiqueta: string }) =>
    compacta ? (
      <h4 className="mb-1 text-sm font-bold text-slate-900">
        <Lineas siglas={pend(etiqueta)}>{etiqueta}</Lineas>
      </h4>
    ) : (
      <CabeceraTabla tabla={tabla} etiqueta={etiqueta} />
    );
  switch (pieza.t) {
    case "frase": {
      const f = frasesDe(pieza.apartado, pieza.bloque, pieza.k, pieza.trozo);
      return (
        <p className={compacta ? "text-[15px] leading-relaxed text-slate-800" : "prosa"}>
          {f.lead && <strong>{f.lead} </strong>}
          <T>{f.frases.join(" ")}</T>
          {!compacta && <EnlacePagina ruta={f.ruta} p={f.pagina} />}
        </p>
      );
    }
    case "lista": {
      const l = listaDe(pieza.apartado, pieza.bloque);
      return (
        <div className={caja} style={borde}>
          <p className="text-sm font-semibold text-slate-900">
            <T>{l.intro}</T>
            {!compacta && <EnlacePagina ruta={l.ruta} p={l.pagina} />}
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-800">
            {l.items.map((it) => (
              <li key={it}>
                <T>{it}</T>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "fila": {
      const t = TABLAS[pieza.tabla];
      const f = t.filas[pieza.fila];
      // En una tarea o un paso: la recomendación, a la vista; las demás columnas, como matiz.
      if (compacta)
        return (
          <div>
            <Rotulo tabla={pieza.tabla} etiqueta={f.etiqueta} />
            <div className="rounded-lg p-3" style={{ background: hex.soft }}>
              <div
                className="mb-0.5 text-[11px] font-bold uppercase tracking-wide"
                style={{ color: hex.ink }}
              >
                {t.columnas[0]}
              </div>
              <div className="text-[15px] font-medium text-slate-900">
                <Lineas siglas={pend(f.celdas[0])}>{f.celdas[0]}</Lineas>
              </div>
            </div>
            {t.columnas.slice(1).map((col, k) => (
              <p key={col} className="mt-1.5 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">{col}: </span>
                <Texto siglas={pend(f.celdas[k + 1])}>{f.celdas[k + 1].replace(/\n/g, " ")}</Texto>
              </p>
            ))}
          </div>
        );
      return (
        <div className={caja} style={borde}>
          <Rotulo tabla={pieza.tabla} etiqueta={f.etiqueta} />
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
                  <Lineas siglas={pend(f.celdas[c])}>{f.celdas[c]}</Lineas>
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
          <Rotulo tabla={pieza.tabla} etiqueta={f.etiqueta} />
          {sis !== undefined ? (
            <Casilla
              nombre={compacta ? "" : t.columnas[sis]}
              texto={f.celdas[sis]}
              c={sis}
              siglas={pend(f.celdas[sis])}
            />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {t.columnas.map((nombre, c) => (
                <Casilla
                  key={nombre}
                  nombre={nombre}
                  texto={f.celdas[c]}
                  c={c}
                  siglas={pend(f.celdas[c])}
                />
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
          <Rotulo tabla="T2" etiqueta={f.etiqueta} />
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
              <T>{f.frases.join(" ")}</T>
              {!compacta && <EnlacePagina ruta={f.ruta} p={f.pagina} />}
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
