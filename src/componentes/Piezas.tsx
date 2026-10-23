import { CORTO_SISTEMA } from "../ampliacion/ids";
import { COLUMNA_DE_NOTA, NOTAS_POR_PASAJE } from "../notas-complementarias";
/* Pinta una «pieza» por referencia (inicio.ts): frases de un párrafo, una lista, una fila de
   tabla, la casilla de un sistema, la línea de inicialización, un hito o un enlace. La usan «Iniciación del sistema» y las guías por referencias (guias/) de la ficha
   de cada sistema. Aquí no hay texto propio: todo sale del capítulo con su página. */
import { ArrowRight } from "lucide-react";
import { useContext } from "react";
import { PiezasSinTitulos, SistemaDelRecorrido, sinPuntos } from "./piezasContexto";
import { TABLAS } from "../contenido";
import { PaginaBadge } from "../ui";
import { Lineas, Texto } from "../texto";
import { siglasPorTexto } from "../siglas";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import {
  frasesDe,
  incisosDelSistema,
  lineasInicializacion,
  listaDe,
  soloDeOtroSistema,
  frasePorSistema,
  textosDePieza,
  type Pieza,
} from "../inicio";

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
        <div className="rotulo" style={{ color: hex.ink }}>
          Tabla {t.numero}
        </div>
        <h3 className="titulo-tarjeta">
          <Lineas>{etiqueta}</Lineas>
        </h3>
      </div>
      <PaginaBadge p={t.paginas[0]} p2={t.paginas[1]} />
    </div>
  );
}

/* 0.92.0 (revisión de tarjetas, ★2): `sinPleca` dentro de una tarea o de la tarjeta de un sistema
   (la pantalla o la caja ya son de ese sistema: la pleca repetía la de su contenedor). */
function Casilla({
  nombre,
  texto,
  c,
  siglas,
  sinPleca = false,
}: {
  nombre: string;
  texto: string;
  c: number;
  siglas?: Set<string>;
  sinPleca?: boolean;
}) {
  return (
    <div
      className={`casilla p-3 text-sm text-slate-800 ${sinPleca ? "" : "casilla-sistema"}`}
      style={sinPleca ? undefined : { ["--sis" as string]: SISTEMA_HEX[c].strong }}
    >
      {/* 1.0.1 (19.ª ronda, visual; §16 y §18): el nombre corto con su grafía, en la tinta del
          sistema (antes, «TANDEM CONTROL-IQ» en versalitas). */}
      {nombre && (
        <span
          className="rotulo-sistema mb-1 block text-[13px]"
          style={{ color: SISTEMA_HEX[c].ink }}
        >
          {CORTO_SISTEMA[c] ?? nombre}
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

/* La primera línea de la Tabla 3 del sistema, si dice que su objetivo no se configura, junto a la
   fila «Objetivo del algoritmo…» de la Tabla 2. */
function objetivoNoConfigurable(etiqueta: string, c?: number): string | null {
  if (c === undefined || c < 0 || !/^Objetivo del algoritmo/.test(etiqueta)) return null;
  const l = (TABLAS.T3.filas[0].celdas[c] ?? "").split(/\n/)[0].trim();
  return /no configurable/i.test(l) ? l : null;
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
  const sinTitulos = useContext(PiezasSinTitulos);
  const delRecorrido = useContext(SistemaDelRecorrido);
  const deEste = (t: string) =>
    delRecorrido === undefined ? t : incisosDelSistema(t, delRecorrido);
  const caja = compacta ? "" : "tarjeta p-3";
  const borde = undefined;
  const Rotulo = ({ tabla, etiqueta }: { tabla: keyof typeof TABLAS; etiqueta: string }) =>
    compacta && sinTitulos ? (
      <p className="titulo-tarjeta mb-1">
        <Lineas siglas={pend(etiqueta)}>{etiqueta}</Lineas>
      </p>
    ) : compacta ? (
      <h4 className="titulo-tarjeta mb-1">
        <Lineas siglas={pend(etiqueta)}>{etiqueta}</Lineas>
      </h4>
    ) : (
      <CabeceraTabla tabla={tabla} etiqueta={etiqueta} />
    );
  switch (pieza.t) {
    case "frase": {
      const f = frasesDe(pieza.apartado, pieza.bloque, pieza.k, pieza.trozo, pieza.quitar);
      const sg = pend(f.frases.join(" "));
      const frases =
        delRecorrido === undefined
          ? f.frases
          : f.frases
              .filter((x) => !soloDeOtroSistema(x, delRecorrido))
              .map((x) => frasePorSistema(x, delRecorrido));
      if (!frases.length) return null;
      return (
        <p className={compacta ? "text-[15px] leading-relaxed text-slate-800" : "prosa"}>
          {f.lead && !sinTitulos && <strong>{f.lead} </strong>}
          {sinTitulos ? (
            <Texto siglas={sg}>{sinPuntos(frases.join(" "))}</Texto>
          ) : (
            <Texto siglas={sg}>{frases.join(" ")}</Texto>
          )}
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
      // Una fila numerada (Tabla 5: «1», «2»…): el título es su primera casilla (el elemento).
      const numerada = /^\d+$/.test(f.etiqueta.trim());
      if (compacta)
        return (
          <div>
            <Rotulo tabla={pieza.tabla} etiqueta={numerada ? f.celdas[0] : f.etiqueta} />
            {/* 0.92.0 (revisión de tarjetas, ★2): «Recomendación orientativa» no es de un sistema:
                casilla gris sin pleca y rótulo gris (antes, pleca y rótulo burdeos o, dentro de
                una tarjeta de sistema, los de su contenedor). */}
            {!numerada && (
              <div className="casilla p-3">
                <div className="rotulo mb-0.5">{t.columnas[0]}</div>
                <div className="text-[15px] font-medium text-slate-900">
                  <Lineas siglas={pend(f.celdas[0])}>{f.celdas[0]}</Lineas>
                </div>
                {/* 1.0.1 (19.ª ronda, adjunto): con un sistema cuyo objetivo no se configura
                    (Control-IQ, Tabla 3), dicho aquí: la recomendación general parecía decir que
                    sí (la ficha y la hoja ya lo dicen). */}
                {/* 1.0.10 (23.ª ronda, R5 y adjunto): no en Fases, donde la fila de la Tabla 3
                    va en el mismo paso (salía tres veces); sin «(Tabla 3)» en línea: la fuente
                    va al pie. */}
                {delRecorrido === undefined &&
                  sis !== undefined &&
                  objetivoNoConfigurable(f.etiqueta, sis) && (
                    <p className="mt-1.5 text-sm font-semibold text-slate-800">
                      {CORTO_SISTEMA[sis]}: {objetivoNoConfigurable(f.etiqueta, sis)}
                    </p>
                  )}
              </div>
            )}
            {t.columnas.slice(1).map((col, k) => (
              <p key={col} className="mt-1.5 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">{col}: </span>
                {/* 0.78.1 (segunda ronda, R5): las líneas de la casilla, separadas («; » si la
                    línea no acaba en punto); antes se pegaban. */}
                <Texto siglas={pend(f.celdas[k + 1])}>
                  {deEste(f.celdas[k + 1].replace(/([^.;:])\n/g, "$1; ").replace(/\n/g, " "))}
                </Texto>
              </p>
            ))}
          </div>
        );
      return (
        <div className={caja} style={borde}>
          <Rotulo tabla={pieza.tabla} etiqueta={f.etiqueta} />
          <dl className="grid gap-2 sm:grid-cols-2">
            {t.columnas.map((col, c) => (
              // 0.92.0 (revisión de tarjetas): sin la pleca burdeos en la primera columna.
              <div key={col} className="casilla p-2.5">
                <dt className="rotulo mb-0.5">{col}</dt>
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
          {sis !== undefined && compacta && sinTitulos ? (
            // 0.96.0 (16.ª ronda, adjunto): dentro de la tarjeta de un bloque (la herramienta del
            // sistema en una situación, los bloques de la ficha), la casilla como dato de una fila,
            // sin caja gris dentro de la tarjeta; las filas las separa una línea fina.
            <p className="text-[15px] leading-snug text-slate-800">
              <Lineas siglas={pend(f.celdas[sis])}>{f.celdas[sis]}</Lineas>
            </p>
          ) : sis !== undefined ? (
            <Casilla
              nombre={compacta ? "" : t.columnas[sis]}
              texto={f.celdas[sis]}
              c={sis}
              siglas={pend(f.celdas[sis])}
              sinPleca={compacta}
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
                className={`casilla p-2.5 text-sm text-slate-800 ${compacta ? "" : "casilla-sistema"}`}
                style={
                  compacta
                    ? undefined
                    : {
                        ["--sis" as string]:
                          sis !== undefined ? SISTEMA_HEX[sis].strong : hex.strong,
                      }
                }
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-xs text-slate-600">
            <span className="font-semibold">{TABLAS.T2.columnas[1]}: </span>
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
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: hex.strong }}
            aria-hidden="true"
          />
          <div>
            <h3 className="titulo-tarjeta">{pieza.rotulo}</h3>
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
