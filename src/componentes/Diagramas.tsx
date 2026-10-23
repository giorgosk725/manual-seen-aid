/* Diagramas a partir del texto del capítulo (datos en src/contenido/diagramas.ts). HTML y CSS,
   no SVG: el texto es real (se lee a 360 px, se busca, se imprime y lo lee un lector de pantalla). */
import { sinCortes } from "../sinCortes";
import { paginasPorApartado } from "../paginasApartado";
import { NOTA_ADAPTA_OMNIPOD } from "../notas-complementarias";
import { FuentePie } from "./FuentePie";
import { VeaseTambien } from "./VeaseTambien";
import { SinCortes } from "./SinCortes";
import { BloquesPorSistema } from "./BloquesPorSistema";
import { GUIA_POR_SISTEMA } from "../porSistema";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  Droplets,
  Cpu,
  Images,
  RefreshCw,
  SlidersHorizontal,
  Syringe,
  Target,
  Timer,
  TrendingUp,
  Utensils,
} from "lucide-react";
import {
  DIAGRAMAS,
  CLAVE_ALGORITMO,
  RECORDATORIO_HIBRIDO,
  EJERCICIO,
  ESCALA_CETONEMIA,
  HIPOGLUCEMIA,
  OBJETIVOS_MCG,
  SEGUIMIENTO,
  TRANSICION,
  HOSPITAL,
  EXPLORACIONES_ESTADO,
  INTERRUPCION_LINEA,
  EXPLORACIONES_TEXTO,
  ELECCION_TEXTO,
  type DiagramaId,
  type EstadoExploracion,
  type TonoFranja,
} from "../contenido/diagramas";
import { F2, FIGURA3, TABLAS, algoritmoDelCapitulo, ubicacionDeDiagrama } from "../contenido";
import { CORTO_SISTEMA, FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { sistemaReciente } from "../sistemaReciente";
import { elegirRuta, href } from "../rutas";
import { BotonImprimir, Segmented } from "../ui";
import { SISTEMA_HEX, TRAMO_HEX } from "../tokens";
import { Lineas, Texto } from "../texto";
import { siglasPorTexto } from "../siglas";
import { SIGLAS_CONSULTA } from "../inicio";
import { useNivelTitulo, type Nivel } from "../nivel-contexto";

/* Colores de franja (familia AGP). Texto con contraste AA sobre cada fondo. */
const TONO: Record<TonoFranja, { bg: string; fg: string }> = {
  "muy-alto": { bg: "#c2410c", fg: "#ffffff" },
  alto: { bg: "#fde68a", fg: "#713f12" },
  rango: { bg: "#15803d", fg: "#ffffff" },
  estrecho: { bg: "#bbf7d0", fg: "#14532d" },
  bajo: { bg: "#dc2626", fg: "#ffffff" },
  "muy-bajo": { bg: "#7f1d1d", fg: "#ffffff" },
};

/* Un fragmento literal tal como se pinta suelto (0.78.1): inicial en mayúscula y sin raya
   colgante (el inciso que cierra el fragmento, «—…—», entre paréntesis; una raya sin pareja, fuera)
   y, si se pide, punto final solo si falta. Las palabras no cambian. */
function fragmento(t: string, punto = false): string {
  let s = t.trim().replace(/\s—([^—]+)—$/, " ($1)");
  if ((s.match(/—/g) ?? []).length % 2) s = s.replace(/^—\s*/, "").replace(/\s*—$/, "");
  s = s.charAt(0).toLocaleUpperCase("es") + s.slice(1);
  return punto && !/[.!?:…]$/.test(s) ? `${s}.` : s;
}

/* Nivel del título del diagrama: 2 en su pantalla (#/visual, tras el h1) y 3 dentro de un
   apartado. Los subtítulos del diagrama van un nivel por debajo. */
/* 1: el diagrama es la pantalla (Interrupción), bajo su h1. */
const NivelDiagrama = createContext<Nivel | 1>(3);
function Sub({
  children,
  className,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const nivel = useContext(NivelDiagrama);
  const H = nivel === 1 ? "h2" : nivel === 2 ? "h3" : nivel === 3 ? "h4" : "h5";
  return (
    <H id={id} className={className} style={style}>
      {children}
    </H>
  );
}

/* Por dónde seguir desde un diagrama que se consulta (0.72.0, auditoría de urgencias). */
const SEGUIR_DIAGRAMA: Partial<Record<DiagramaId, { texto: string; ruta: string }[]>> = {
  hipoglucemia: [
    { texto: "Plan de seguridad (hoja para el paciente)", ruta: href("pacientes") },
    // 0.95.1 (16.ª ronda, guardia): a la situación (con lo de cada sistema), no al párrafo.
    { texto: "Hipoglucemia nocturna", ruta: href("consultar", "situacion", "sueno") },
    { texto: "Tiempo por debajo del rango elevado", ruta: href("capitulo", "09-descarga", "b10") },
  ],
};

/* 0.97.1 (17.ª ronda, R1): el plan de seguridad, el del último sistema consultado; sin ninguno, el
   enlace dice adónde lleva (la lista de material). */
const planDelSistema = (l: { texto: string; ruta: string }) => {
  if (l.ruta !== href("pacientes")) return l;
  const c = sistemaReciente();
  return c === undefined
    ? { texto: "Material para el paciente", ruta: l.ruta }
    : {
        texto: `Plan de seguridad · ${CORTO_SISTEMA[c]}`,
        ruta: href("pacientes", "plan", ORDEN_SISTEMAS[c]),
      };
};

export function MarcoDiagrama({
  id,
  children,
  enApartado = false,
  tituloFuera = false,
}: {
  id: DiagramaId;
  children: ReactNode;
  enApartado?: boolean;
  /* 0.78.1: en su pantalla (#/visual/<id>) el título es la cabecera editorial de la página (h1,
     como en el resto de pantallas); el marco no lo repite y sus subtítulos van en h2. */
  tituloFuera?: boolean;
}) {
  const meta = DIAGRAMAS.find((d) => d.id === id)!;
  const ref = useRef<HTMLElement>(null);
  const donde = ubicacionDeDiagrama(id);
  const nivelContexto = useNivelTitulo();
  const nivel: Nivel = enApartado ? nivelContexto : 2;
  const Titulo = `h${nivel}` as "h2" | "h3" | "h4";
  return (
    <NivelDiagrama.Provider value={tituloFuera ? 1 : nivel}>
      <section
        ref={ref}
        {...(tituloFuera ? { "aria-label": meta.titulo } : { "aria-labelledby": `diag-${id}` })}
        className="bloque-papel imprimible prosa-72 tarjeta p-4"
      >
        {!tituloFuera && (
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {/* 0.70.0: solo el título (sin rótulo ni resumen); la fuente, al pie. 0.92.0
                  (revisión de tarjetas, ★4): título de tarjeta (15/700), no 16/800. */}
              <Titulo id={`diag-${id}`} className="titulo-tarjeta">
                {meta.titulo}
              </Titulo>
            </div>
          </div>
        )}
        {children}
        <FuentePie
          className="mt-3"
          fuentes={[
            {
              texto: paginasPorApartado(meta.paginas, donde?.apartado.n),
              ruta: donde ? href("capitulo", donde.apartado.slug, donde.ancla) : undefined,
            },
          ]}
        />
        {/* 0.97.1 (17.ª ronda, visual; §15): por dónde seguir, en la lista de «Véase también» de
            toda la app (antes, chips con flecha). */}
        {!enApartado && SEGUIR_DIAGRAMA[id] && (
          <VeaseTambien
            enCaja
            sinSangrar
            nivel={3}
            className="no-imprimir mt-4"
            filas={SEGUIR_DIAGRAMA[id]!.map(planDelSistema).map((l) => ({
              href: l.ruta,
              t: l.texto,
            }))}
          />
        )}
        <div className="separador no-imprimir mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
          {!enApartado && donde && (
            // 1.0.9 (22.ª ronda, visual): la misma receta que en la Figura 3 (texto con flecha),
            // no un chip con libro.
            <a
              href={href("capitulo", donde.apartado.slug, donde.ancla)}
              className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
            >
              Leer en el capítulo: {donde.apartado.n}. {donde.apartado.corto}{" "}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          )}
          {enApartado && (
            <a href={href("visual", id)} className="chip tap-44 min-h-9 text-xs sm:min-h-8">
              <Images size={12} aria-hidden="true" /> Abrir a pantalla completa
            </a>
          )}
          <BotonImprimir objetivo={ref} compacto>
            Imprimir
          </BotonImprimir>
        </div>
      </section>
    </NivelDiagrama.Provider>
  );
}

/* ---------- 1. Objetivos de MCG ---------- */
function Escalera({ i, yaEnTexto }: { i: number; yaEnTexto?: (t: string) => boolean }) {
  const p = OBJETIVOS_MCG[i];
  // 1.0.0 (18.ª ronda, adjunto y senior): en una situación, sin las frases que su texto literal ya
  // trae palabra por palabra justo debajo (HbA1c en la gestación; el aviso pediátrico del ingreso).
  const extras = p.extras.filter((e) => !yaEnTexto?.(e.texto) && !e.encabeza);
  // 1.0.9 (22.ª ronda, adjunto): la frase que repetía las cifras de las franjas, encima y solo
  // hasta su condición («…fundamentalmente a partir de consenso de expertos, objetivos
  // orientativos:»); el resto, ya en las franjas. La frase entera, a un toque en la fuente.
  const encabezan = p.extras
    .filter((e) => e.encabeza && e.texto.includes(e.encabeza))
    .map((e) => `${e.texto.slice(0, e.texto.indexOf(e.encabeza!) + e.encabeza!.length)}:`);
  const aviso = p.aviso && !yaEnTexto?.(p.aviso) ? p.aviso : null;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        {/* 0.92.0 (revisión de tarjetas, ★4): título de tarjeta, no 14/700. */}
        <Sub className="titulo-tarjeta">{p.nombre}</Sub>
      </div>
      {encabezan.map((t) => (
        <p key={t} className="mb-1.5 text-[13px] leading-snug text-slate-700">
          <SinCortes texto={t} />
        </p>
      ))}
      <ol className="space-y-1">
        {/* Solo los objetivos del capítulo: el TAR > 180 de adultos va sin cifra (A07). */}
        {p.franjas.map((f, j) => {
          const t = TONO[f.tono];
          return (
            <li key={j} className="linea flex items-stretch overflow-hidden rounded-lg border">
              <span
                className="flex w-28 shrink-0 items-center px-2 py-2 text-xs font-bold"
                style={{ background: t.bg, color: t.fg }}
              >
                <SinCortes texto={f.franja} />
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2 bg-white px-2 py-1.5">
                <span className="w-16 shrink-0 whitespace-nowrap text-base font-extrabold tabular-nums text-slate-900">
                  <SinCortes texto={f.objetivo} />
                </span>
                {f.nota && (
                  <span className="text-xs leading-snug text-slate-600">
                    <SinCortes texto={f.nota} />
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <ul className="mt-2 space-y-1 text-xs text-slate-700">
        {/* 1.0.11 (23.ª ronda, adjunto): con `desde`, solo la parte que no repite una franja
            («priorizando en el hospital…»; la de 70–100 mg/dl ya va arriba). */}
        {extras.map((e) => {
          const i = e.desde ? e.texto.indexOf(e.desde) : -1;
          const t = i > 0 ? e.texto.slice(i).replace(/^./, (x) => x.toUpperCase()) : e.texto;
          return (
            <li key={e.texto} className="flex gap-1.5">
              <span aria-hidden="true">·</span>
              <span>
                <SinCortes texto={t} />
              </span>
            </li>
          );
        })}
        {aviso && (
          <li className="font-semibold text-slate-800">
            <SinCortes texto={aviso} />
          </li>
        )}
      </ul>
    </div>
  );
}

/* Los objetivos de una población, sueltos (0.72.0: arriba de su situación —gestación, hospital—,
   en vez de un enlace al pie). Subtítulos en h2 bajo el h1 de la pantalla. */
const APARTADO_DE_POBLACION: Record<string, number> = {
  general: 5,
  gestacion: 10,
  hospital: 10,
  fragilidad: 10,
};
export function ObjetivosDePoblacion({
  id,
  yaEnTexto,
}: {
  id: string;
  yaEnTexto?: (t: string) => boolean;
}) {
  const i = OBJETIVOS_MCG.findIndex((p) => p.id === id);
  if (i < 0) return null;
  const o = OBJETIVOS_MCG[i];
  const ps = [o.pagina, ...o.extras.map((e) => e.p).filter((x): x is number => !!x)];
  return (
    <NivelDiagrama.Provider value={1}>
      <Escalera i={i} yaEnTexto={yaEnTexto} />
      {/* El apartado propio de cada población: las pp. 4, 17 y 20 son límite de dos apartados
          (0.73.0: salía «Apartado 9, p. 17» en la gestación). */}
      <FuentePie
        className="mt-3"
        fuentes={[{ texto: paginasPorApartado(ps, APARTADO_DE_POBLACION[o.id] ?? 10) }]}
      />
    </NivelDiagrama.Provider>
  );
}
function ObjetivosMCG({ opcion }: { opcion?: string }) {
  const [sel, setSel] = useState(
    OBJETIVOS_MCG.find((p) => p.id === opcion)?.id ?? OBJETIVOS_MCG[0].id,
  );
  const i = OBJETIVOS_MCG.findIndex((p) => p.id === sel);
  return (
    <div>
      <div className="no-imprimir mb-3 lg:hidden">
        <Segmented
          label="Población"
          wrap
          value={sel}
          onChange={setSel}
          options={OBJETIVOS_MCG.map((p) => ({ id: p.id, label: p.nombre }))}
        />
      </div>
      <div className="lg:hidden">
        <Escalera i={i} />
      </div>
      <div className="hidden gap-x-6 gap-y-5 lg:grid lg:grid-cols-2">
        {OBJETIVOS_MCG.map((_, k) => (
          <Escalera key={k} i={k} />
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Objetivos recogidos en el capítulo. «—»: sin objetivo para esa franja.
      </p>
    </div>
  );
}

/* ---------- 2. Escala de cetonemia ---------- */
function EscalaCetonemia() {
  const { tramos, tope, gravedad, pediatria, ejercicio, apilamiento } = ESCALA_CETONEMIA;
  const pct = (v: number) => `${(v / tope) * 100}%`;
  const naranja = FIGURA3.tramos.find((t) => t.clave === "naranja")!;
  const amarillo = FIGURA3.tramos.find((t) => t.clave === "amarillo")!;
  const plumas = naranja.pasos.filter((p) => p.icono === "pluma");
  const subeAmarillo = amarillo.pasos.find((p) => p.icono === "aviso")!;
  return (
    <div>
      {/* Los signos de gravedad mandan sobre la cifra: arriba, para todos los tramos. */}
      <p
        role="note"
        className="mb-3 rounded-lg border-2 px-3 py-2 text-sm font-semibold"
        style={{
          borderColor: TRAMO_HEX.rojo.border,
          background: TRAMO_HEX.rojo.soft,
          color: TRAMO_HEX.rojo.ink,
        }}
      >
        <Texto>{gravedad.texto}</Texto>
      </p>
      <div className="relative pb-6 pt-1">
        <div
          className="flex h-10 overflow-hidden rounded-lg"
          aria-label="Escala de β-OHB de 0 a 4 mmol/l: cada tramo enlaza con su rama de la Figura 3"
          role="group"
        >
          {tramos.map((t) => (
            <a
              key={t.clave}
              href={href("consultar", "figura-3", t.clave)}
              className="tap-44 block h-full transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ width: pct(t.hasta - t.desde), background: TRAMO_HEX[t.clave].ink }}
              aria-label={`Tramo ${t.etiqueta}: ver la rama en la Figura 3`}
            />
          ))}
        </div>
        {/* Ticks, con el 1,5 del ejercicio y de la dosis de rescate. */}
        {[0, 0.6, 1.0, 1.5, 3.0].map((v) => (
          <span
            key={v}
            className="absolute bottom-0 -translate-x-1/2 text-xs font-semibold tabular-nums text-slate-600"
            style={{ left: v === 0 ? "6px" : pct(v) }}
          >
            {v === 0 ? "0" : v.toFixed(1).replace(".", ",")}
          </span>
        ))}
        <span className="absolute bottom-0 right-0 text-xs text-slate-500">mmol/l</span>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {tramos.map((t) => (
          <li key={t.clave}>
            <a
              href={href("consultar", "figura-3", t.clave)}
              className="block h-full rounded-xl border p-2.5 transition hover:brightness-95"
              style={{
                borderColor: TRAMO_HEX[t.clave].border,
                background: TRAMO_HEX[t.clave].soft,
              }}
            >
              <span className="block text-sm font-bold" style={{ color: TRAMO_HEX[t.clave].ink }}>
                {t.etiqueta}
              </span>
              {/* El texto empieza en minúscula en el capítulo (sigue a «;»): mayúscula solo al pintar. */}
              <span className="mt-0.5 block text-xs text-slate-700 first-letter:uppercase">
                {t.accion}
              </span>
              {/* Lo que la Figura 3 añade para subir de rama: no solo la cifra. */}
              {t.clave === "amarillo" && (
                <span className="mt-1 block text-xs text-slate-700">
                  Figura 3: <Texto>{subeAmarillo.texto}</Texto>
                </span>
              )}
              <span className="mt-1 block text-xs font-semibold text-slate-600">
                Ver la rama en la Figura 3 →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-700">
        <Texto>{pediatria.texto}</Texto>
      </p>
      <section className="mt-3 space-y-2 text-xs text-slate-700">
        <div>
          <Sub className="rotulo text-slate-500">Ejercicio y cetonemia</Sub>
          <p className="mt-0.5">
            <Texto>{ejercicio.texto}</Texto>
          </p>
        </div>
        <div>
          <Sub className="rotulo text-slate-500">
            Insulina con pluma en la rama naranja (Figura 3)
          </Sub>
          <p className="mt-0.5">
            {plumas.map((p) => (
              <span key={p.texto}>
                <Texto>{p.texto}</Texto>{" "}
                {(p.detalle ?? []).map((d) => (
                  <span key={d}>
                    <Texto>{d}</Texto>{" "}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <p className="mt-1">
            <Texto>{FIGURA3.notaAsterisco}</Texto>
          </p>
          <p className="mt-1">
            <Texto>{apilamiento.texto}</Texto>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------- 3. Glucemia y ejercicio ---------- */
function Ejercicio() {
  const { min, max } = EJERCICIO.escala;
  const pct = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <div>
      <div className="relative pb-6 pt-1">
        <div
          className="relative h-10 overflow-hidden rounded-lg"
          style={{ background: "#e2e8f0" }}
          role="img"
          aria-label="Escala de glucemia de 40 a 320 mg/dl con las zonas para el ejercicio"
        >
          {EJERCICIO.zonas.map((z) => (
            <span
              key={z.etiqueta}
              className="absolute top-0 flex h-full items-center justify-center text-xs font-bold"
              style={{
                left: pct(z.desde),
                width: `calc(${pct(z.hasta)} - ${pct(z.desde)})`,
                background: TONO[z.tono].bg,
                color: TONO[z.tono].fg,
              }}
            >
              <span className="hidden sm:inline">
                <SinCortes texto={z.etiqueta} />
              </span>
            </span>
          ))}
          <span
            aria-hidden="true"
            className="marca-ejercicio absolute top-0 h-full border-l-2 border-dashed border-slate-900"
            style={{ left: pct(EJERCICIO.marca.valor) }}
          />
        </div>
        {[90, 126, 180, 270].map((v) => (
          <span
            key={v}
            className="absolute bottom-0 -translate-x-1/2 text-xs font-semibold tabular-nums text-slate-600"
            style={{ left: pct(v) }}
          >
            {v}
          </span>
        ))}
        <span className="absolute bottom-0 right-0 text-xs text-slate-500">mg/dl</span>
      </div>
      <ul className="mt-2 grid gap-2 sm:grid-cols-3">
        {EJERCICIO.zonas.map((z) => (
          <li
            key={z.etiqueta}
            className="linea flex gap-2 rounded-xl border p-2.5 text-xs text-slate-700"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 h-3 w-3 shrink-0 rounded-sm"
              style={{ background: TONO[z.tono].bg }}
            />
            <span>
              <span className="block font-bold text-slate-900">
                <SinCortes texto={z.etiqueta} />
              </span>
              {/* 0.78.1: «con cifras <90…» empieza a media frase: inicial en mayúscula y punto. */}
              <SinCortes texto={fragmento(z.texto, true)} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex gap-2 text-xs text-slate-700">
        <span
          aria-hidden="true"
          className="marca-ejercicio mt-1 h-3 w-0 shrink-0 border-l-2 border-dashed border-slate-900"
        />
        <span>
          <SinCortes texto={EJERCICIO.marca.texto} />
        </span>
      </p>
      {/* La cetonemia manda sobre la glucemia para empezar (p. 19): junto a la escala. */}
      {/* 0.79.1: la caja, al ancho de su texto (con el texto a 72ch, medía 1206 px a 1920). */}
      <p
        className="mt-2 w-fit rounded-lg border px-3 py-2 text-xs font-semibold"
        style={{
          borderColor: TRAMO_HEX.naranja.border,
          background: TRAMO_HEX.naranja.soft,
          color: TRAMO_HEX.naranja.ink,
        }}
      >
        <span className="block max-w-[72ch]">
          <SinCortes texto={EJERCICIO.cetonemia} />
        </span>
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {EJERCICIO.fases.map((f) => (
          <div key={f.titulo} className="rounded-xl p-3" style={{ background: "#f1f5f9" }}>
            <Sub className="mb-1.5 text-sm font-extrabold text-slate-900">{f.titulo}</Sub>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {f.items.map((it) => (
                <li key={it} className="flex gap-1.5">
                  <span aria-hidden="true">·</span>
                  <span>
                    <SinCortes texto={it} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="linea mt-3 max-w-[78ch] rounded-xl border p-3 text-xs text-slate-700 print:max-w-none">
        <Sub className="mb-1 text-sm font-extrabold text-slate-900">Según el tipo de ejercicio</Sub>
        <ul className="space-y-1.5">
          {EJERCICIO.tipo.map((t) => (
            <li key={t} className="flex gap-1.5">
              <span aria-hidden="true">·</span>
              <span>
                <SinCortes texto={t} />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2">
          <SinCortes texto={EJERCICIO.herramientas} />{" "}
          <a
            href={href("consultar", "tablas", "T4")}
            className="no-imprimir inline-flex min-h-11 items-center gap-1 font-semibold text-slate-800 underline sm:min-h-0"
          >
            Ver la Tabla 4 <ArrowRight size={12} aria-hidden="true" />
          </a>
        </p>
      </div>
    </div>
  );
}

/* ---------- 4. Calendario de seguimiento ---------- */
/* Las dos fases del capítulo, rotuladas; el espaciado de visitas, con borde discontinuo: es una
   opción con condiciones, no una cita fija. */
function Seguimiento() {
  const colores = [
    { punto: "#4340a6", tinta: "#343093", fondo: "#eef2ff" },
    { punto: "#0f766e", tinta: "#0b5540", fondo: "#ecfdf5" },
  ];
  return (
    <div className="space-y-4">
      {SEGUIMIENTO.fases.map((f, k) => {
        const c = colores[k];
        return (
          <section key={f.titulo}>
            <Sub className="mb-2 text-sm font-extrabold" style={{ color: c.tinta }}>
              {sinCortes(f.titulo)}
            </Sub>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {f.hitos.map((h) => (
                <li
                  key={h.cuando}
                  className={`rounded-xl p-2.5 ${"condicional" in h && h.condicional ? "border-2 border-dashed" : "border"}`}
                  style={{ borderColor: `${c.punto}55`, background: c.fondo }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: c.punto }}
                    />
                    <span className="text-sm font-extrabold text-slate-900">
                      <SinCortes texto={h.cuando} />
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs font-semibold" style={{ color: c.tinta }}>
                    {h.tipo}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-slate-700">
                    <SinCortes texto={h.que} />
                  </p>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
      <ul className="space-y-1 text-xs text-slate-600">
        {SEGUIMIENTO.notas.map((n) => (
          <li key={n.texto}>
            <SinCortes texto={n.texto} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 5. Los cuatro algoritmos ---------- */
/* 13-10-2026 (0.57): una tarjeta por sistema con lo esencial de un vistazo (dónde está el
   algoritmo, cómo y cada cuánto actúa, predicción, objetivo, corrección automática, aprendizaje y
   parámetros), en fragmentos literales de la Tabla 1 (CLAVE_ALGORITMO) y con las mismas filas a la
   misma altura en las cuatro (subgrid). Las celdas enteras, debajo, en cada tarjeta. */
const FILAS_ALGORITMO = [
  "Localización del algoritmo",
  "Estrategia de automatización",
  "Bolos automáticos de corrección",
  "Lógica del algoritmo y aprendizaje",
  "Objetivo glucémico en modo automático",
  "Parámetros configurables en modo automático",
];

function DatoAlgoritmo({
  icono: I,
  etiqueta,
  hex,
  children,
}: {
  icono: typeof Cpu;
  etiqueta: string;
  hex: string;
  children: ReactNode;
}) {
  return (
    <div className="separador flex gap-2.5 border-t px-3 py-2">
      <I size={16} className="mt-0.5 shrink-0" style={{ color: hex }} aria-hidden="true" />
      <div className="min-w-0">
        <div className="rotulo text-slate-500">{etiqueta}</div>
        <div className="text-sm font-semibold leading-snug text-slate-900">{children}</div>
      </div>
    </div>
  );
}

/* 0.78.1: cada fragmento suelto, con la inicial en mayúscula y sin cortes entre cifra y unidad. */
const unidos = (xs: string[]) => <SinCortes texto={xs.map((x) => fragmento(x)).join(" · ")} />;

function Algoritmos() {
  const fila = (etiqueta: string, c: number) =>
    TABLAS.T1.filas.find((f) => f.etiqueta === etiqueta)?.celdas[c] ?? "";
  return (
    <div>
      <p
        className="mb-3 flex items-start gap-2 rounded-lg border-l-4 px-3 py-2 text-sm text-slate-800"
        style={{ borderColor: "#64748b", background: "#f1f5f9" }}
      >
        <Utensils size={16} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
        <span>{RECORDATORIO_HIBRIDO.texto}</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ORDEN_SISTEMAS.map((id, c) => {
          const h = SISTEMA_HEX[c];
          const k = CLAVE_ALGORITMO[c];
          const [nombre, tipo] = algoritmoDelCapitulo(c).split(": algoritmo de tipo ");
          const parametros = fila("Parámetros configurables en modo automático", c)
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean);
          return (
            <article
              key={id}
              aria-labelledby={`alg-${id}`}
              className="row-span-9 grid grid-rows-subgrid gap-0 overflow-hidden rounded-xl border border-t-4 bg-white"
              // 0.78.1: el filete superior lee `--sis` (en nocturno, la tinta clara del sistema).
              style={{
                ["--sis" as string]: h.strong,
                borderColor: "var(--linea)",
                borderTopColor: "var(--sis)",
              }}
            >
              <header
                className="flex items-center gap-2.5 px-3 py-2.5"
                style={{ background: h.soft }}
              >
                <img
                  src={FOTO_SISTEMA[id]}
                  alt=""
                  className="foto-sistema h-11 w-11 shrink-0 rounded-md bg-white object-cover"
                />
                <div className="min-w-0">
                  <Sub
                    id={`alg-${id}`}
                    className="text-base font-extrabold leading-tight"
                    style={{ color: h.ink }}
                  >
                    {TABLAS.T1.columnas[c]}
                  </Sub>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
                    <span className="font-semibold">{nombre}</span>
                    {tipo && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                        style={{ background: h.ink }}
                      >
                        {tipo}
                      </span>
                    )}
                  </div>
                </div>
              </header>
              <DatoAlgoritmo icono={Cpu} etiqueta="Localización del algoritmo" hex={h.strong}>
                {unidos(k.donde)}
              </DatoAlgoritmo>
              <DatoAlgoritmo icono={Timer} etiqueta="Estrategia de automatización" hex={h.strong}>
                {unidos(k.actua)}
              </DatoAlgoritmo>
              <DatoAlgoritmo icono={TrendingUp} etiqueta="Horizonte de predicción" hex={h.strong}>
                {k.prediccion.length ? (
                  unidos(k.prediccion)
                ) : (
                  <span className="font-normal italic text-slate-600">
                    No consta en el capítulo
                  </span>
                )}
              </DatoAlgoritmo>
              <DatoAlgoritmo icono={Target} etiqueta="Objetivo" hex={h.strong}>
                <span className="tabular-nums">{unidos(k.objetivo)}</span>
              </DatoAlgoritmo>
              <DatoAlgoritmo icono={Syringe} etiqueta="Bolos de corrección" hex={h.strong}>
                {/* «Sí»/«No» en su línea: pegado al detalle se leía al revés (0.72.0). */}
                <span
                  className="mb-0.5 block w-fit rounded px-1.5 text-xs font-extrabold"
                  style={
                    k.correccion.si
                      ? { background: h.ink, color: "#fff" }
                      : { background: "#e2e8f0", color: "#334155" }
                  }
                >
                  {k.correccion.si ? "Sí" : "No"}
                </span>
                <span className="block font-normal text-slate-800">
                  {unidos(k.correccion.texto)}
                </span>
              </DatoAlgoritmo>
              <DatoAlgoritmo
                icono={RefreshCw}
                etiqueta="Lógica del algoritmo y aprendizaje"
                hex={h.strong}
              >
                {unidos(k.aprendizaje)}
              </DatoAlgoritmo>
              <DatoAlgoritmo icono={SlidersHorizontal} etiqueta="Parámetros" hex={h.strong}>
                <ul className="mt-0.5 flex flex-wrap gap-1">
                  {parametros.map((x) => {
                    const directo = x.endsWith("*");
                    return (
                      <li
                        key={x}
                        className={`rounded-md border px-1.5 py-0.5 text-xs leading-snug ${directo ? "font-bold" : "font-normal text-slate-600"}`}
                        style={
                          directo
                            ? { borderColor: h.strong, background: h.soft, color: h.ink }
                            : { borderColor: "#e2e8f0", background: "#f8fafc" }
                        }
                      >
                        {x}
                      </li>
                    );
                  })}
                </ul>
              </DatoAlgoritmo>
              <details className="separador border-t px-3 py-2 text-xs">
                <summary className="con-chevron tap-44 cursor-pointer font-semibold text-slate-700">
                  Celdas completas
                </summary>
                <dl className="mt-2 space-y-1.5">
                  {FILAS_ALGORITMO.map((e) => (
                    <div key={e}>
                      <dt className="font-bold text-slate-600">{e}</dt>
                      <dd className="text-slate-900">
                        <Lineas>{fila(e, c)}</Lineas>
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            </article>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-600">{TABLAS.T1.notas[0]}</p>
      <p className="mt-1.5 rounded-md border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600">
        {NOTA_ADAPTA_OMNIPOD}
      </p>
    </div>
  );
}

/* ---------- 6. Hipoglucemia en asa cerrada ---------- */
/* La frase entera de la p. 8, con sus condiciones, arriba y con el mismo peso que las cifras;
   las dos cantidades como orientación, sin flechas de árbol (no cubre todos los casos). */
function Hipoglucemia() {
  // 1.0.5 (decisión del autor del 22-10-2026; 21.ª ronda, R1): sin la frase entera debajo de las
  // tarjetas (repetía sus cifras); queda encima su condición, literal y sin las cifras («En
  // determinados episodios… pueden bastar cantidades menores que la regla clásica de 15 g:»). La
  // frase entera, a un toque en la fuente.
  const [condicion, resto] = HIPOGLUCEMIA.orientacion.split(/:\s*(?=como orientación)/);
  return (
    <div>
      {resto ? (
        <p className="mb-2 max-w-[72ch] text-[15px] leading-snug text-slate-800">
          <Texto>{`${condicion}:`}</Texto>
        </p>
      ) : null}
      {/* 0.72.0: primero las dos cantidades, en grande; debajo, la frase literal de la que salen.
          Sin el párrafo que empieza «La primera es…» (fuera de su contexto no se entendía). */}
      <div className="grid gap-2 sm:grid-cols-2">
        {HIPOGLUCEMIA.ramas.map((r) => (
          <p
            key={r.cantidad}
            className="rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800"
            style={{ borderColor: "var(--linea)", borderTop: `4px solid ${TONO[r.tono].bg}` }}
          >
            <span className="block text-2xl font-extrabold leading-tight tabular-nums text-slate-900 sm:text-3xl">
              {r.cantidad}
            </span>
            <span className="mt-0.5 block">
              <Texto>{fragmento(r.condicion)}</Texto>
            </span>
          </p>
        ))}
      </div>
      {!resto && (
        <p
          className="mt-3 max-w-[72ch] border-l-2 pl-3 text-sm text-slate-700"
          style={{ borderColor: "#cbd5e1" }}
        >
          <Texto>{HIPOGLUCEMIA.orientacion}</Texto>
        </p>
      )}
      {/* 0.97.1 (17.ª ronda, visual; DISENO_VISUAL §5 y §15): las notas, filas sobre el papel con
          línea fina (antes, cada una en su tarjeta con un cuadro de icono). */}
      <ul className="mt-3 max-w-[72ch] divide-y divide-[var(--linea-suave)] text-sm text-slate-800">
        {HIPOGLUCEMIA.despues.map((d) => (
          <li key={d.texto} className="py-2.5 first:pt-1">
            {"tema" in d && d.tema && <strong>{d.tema}: </strong>}
            <Texto>{d.texto}</Texto>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 7. Transición desde MDI ---------- */
/* La Tabla 2 entera, fila a fila, con su recomendación orientativa y su nota; sin numerar. */
function Transicion() {
  const t = TABLAS.T2;
  return (
    <div>
      <p className="mb-3 text-sm text-slate-700">{TRANSICION.partida}</p>
      <ul className="space-y-2">
        {t.filas.map((f) => (
          <li key={f.etiqueta} className="linea rounded-xl border p-2.5">
            <div className="text-sm font-bold text-slate-900">{f.etiqueta}</div>
            <div className="mt-1 grid gap-1 text-xs sm:grid-cols-[1fr_1fr] sm:gap-3">
              <div>
                <span className="font-semibold text-slate-500">{t.columnas[0]}: </span>
                <span className="text-slate-800">
                  <Lineas>{f.celdas[0]}</Lineas>
                </span>
              </div>
              {f.celdas[1] && (
                <div>
                  <span className="font-semibold text-slate-500">{t.columnas[1]}: </span>
                  <span className="text-slate-700">
                    <Lineas>{f.celdas[1]}</Lineas>
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-600">{t.notas[1]}</p>
      <a
        href={href("consultar", "tablas", "T2")}
        className="no-imprimir mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-700 hover:underline sm:min-h-8"
      >
        Tabla 2 en el capítulo <ArrowRight size={12} aria-hidden="true" />
      </a>
    </div>
  );
}

/* Gestación por sistema (0.73.0): los mismos bloques literales que la situación «Gestación»
   (src/porSistema.ts), en vez de las tarjetas de fragmentos empalmados de antes. */
/* Identificador del sistema en las rutas de Situaciones (orden de la Tabla 1). */
const SLUG_SITUACION = ["minimed-780g", "control-iq", "camaps", "omnipod-5"];
function GestacionSistemas({ opcion }: { opcion?: string }) {
  const g = GUIA_POR_SISTEMA.gestacion;
  const c = ORDEN_SISTEMAS.findIndex((x) => x === opcion);
  const sel = c >= 0 ? c : 0;
  return (
    <>
      <BloquesPorSistema
        bloques={g.bloques}
        comun={g.comun}
        comunDe={g.comunDe}
        seleccion={sel}
        onElegir={(i) => elegirRuta("visual", "gestacion-sistemas", ORDEN_SISTEMAS[i])}
        sinFuente
      />
      {/* 0.77.0 (auditoría): lo complementario (no es del capítulo), en Situaciones; aquí, un
          enlace, para que la fuente del marco siga siendo la del capítulo y la única. */}
      {g.complementos?.[sel] && (
        <a
          href={href("consultar", "situacion", `gestacion:${SLUG_SITUACION[sel]}`)}
          className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 sm:min-h-9"
        >
          {g.complementos[sel].titulo} (complementarias)
        </a>
      )}
    </>
  );
}

/* ---------- 9. Hospital: cuándo no continuar el sistema ---------- */
function Hospital() {
  const H = HOSPITAL;
  const ivTabla6 = TABLAS.T6.filas.find((f) => f.etiqueta.startsWith("Cirugía prolongada"));
  return (
    <div className="space-y-3">
      <p
        className="rounded-lg border-l-4 px-3 py-2 text-sm font-semibold text-slate-900"
        style={{ borderColor: "#475569", background: "#f1f5f9" }}
      >
        {H.ambito.texto}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: "#a7f3d0", background: "#ecfdf5" }}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <Sub className="text-sm font-bold" style={{ color: "#065f46" }}>
              Pueden mantenerse
            </Sub>
          </div>
          <p className="text-sm text-slate-800">{H.mantener.texto}</p>
          <ul className="mt-1.5 space-y-1 text-xs text-slate-700">
            {H.condiciones.map((x) => (
              <li key={x.texto} className="flex gap-1.5">
                <span aria-hidden="true">·</span>
                {x.texto}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: "#fecaca", background: "#fef2f2" }}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <Sub className="text-sm font-bold" style={{ color: "#991b1b" }}>
              {H.noApropiada.intro}
            </Sub>
          </div>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-slate-800">
            {/* 0.78.1: «—excluida la anestesia—» al final, entre paréntesis (sigue en minúscula:
                continúa la frase del título). */}
            {H.noApropiada.items.map((x) => (
              <li key={x}>{x.replace(/\s—([^—]+)—$/, " ($1)")}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center" aria-hidden="true">
        <ArrowDown size={18} className="text-slate-400" />
      </div>
      <p className="rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-white">
        {H.entonces.texto}
      </p>
      <ul className="grid gap-2 md:grid-cols-3">
        {H.pasos.map((x) => (
          <li key={x.cuando} className="tarjeta p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">{x.cuando}</span>
            </div>
            <p className="text-xs leading-snug text-slate-800">{x.texto}</p>
          </li>
        ))}
      </ul>
      {/* La perfusión intravenosa: cuándo se va a ella (p. 21 y Tabla 6) y cómo se vuelve. */}
      <div className="grid gap-2 md:grid-cols-2">
        <div
          className="rounded-xl border p-3 text-xs leading-snug text-slate-800"
          style={{ borderColor: "#fed7aa", background: "#fff7ed" }}
        >
          <Sub className="mb-1 text-sm font-bold text-slate-900">
            Hacia la perfusión intravenosa
          </Sub>
          <p>{H.haciaIV.texto}</p>
          {ivTabla6 && (
            <p className="mt-1">
              Tabla 6 · {ivTabla6.etiqueta}: {ivTabla6.celdas[0]}
            </p>
          )}
        </div>
        <div
          className="rounded-xl p-3 text-xs leading-snug text-slate-800"
          style={{ background: "#f1f5f9" }}
        >
          <Sub className="mb-1 text-sm font-bold text-slate-900">Vuelta desde la perfusión</Sub>
          <p>Nota de la Tabla 6: {H.desdeIV.texto}</p>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div
          className="rounded-xl p-3 text-xs leading-snug text-slate-800"
          style={{ background: "#f1f5f9" }}
        >
          <Sub className="mb-1 text-sm font-bold text-slate-900">Mientras se mantiene</Sub>
          <p>{H.mientras.texto}</p>
          <p className="mt-1">{H.contingencia.texto}</p>
        </div>
        <div
          className="rounded-xl p-3 text-xs leading-snug text-slate-800"
          style={{ background: "#f1f5f9" }}
        >
          <Sub className="mb-1 text-sm font-bold text-slate-900">
            Precisión de la MCG en el ingreso
          </Sub>
          {H.mcg.map((x) => (
            <p key={x.texto} className="mt-1 first:mt-0">
              {x.texto}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 10. Exploraciones: la Tabla 6 como mapa ---------- */
const ESTADO_EXPLORACION: Record<
  EstadoExploracion,
  { etiqueta: string; corta: string; tinta: string; bg: string; borde: string; punto: string }
> = {
  retirar: {
    etiqueta: "Retirar o suspender",
    corta: "Retirar o suspender",
    tinta: "text-red-800",
    bg: "#fef2f2",
    borde: "#fecaca",
    punto: "#dc2626",
  },
  depende: {
    etiqueta: "Depende del dispositivo, del modelo o del contexto",
    corta: "Depende",
    tinta: "text-amber-900",
    bg: "#fffbeb",
    borde: "#fde68a",
    punto: "#ca8a04",
  },
  // Casi todas las celdas «mantener» llevan condiciones: se dicen en la propia celda.
  mantener: {
    etiqueta: "Puede mantenerse, con las condiciones de la celda",
    corta: "Puede mantenerse",
    tinta: "text-emerald-800",
    bg: "#ecfdf5",
    borde: "#a7f3d0",
    punto: "#15803d",
  },
};

function Exploraciones() {
  const T6 = TABLAS.T6;
  return (
    <div>
      <p
        className="mb-3 rounded-lg border-l-4 px-3 py-2 text-sm text-slate-900"
        style={{ borderColor: "#475569", background: "#f1f5f9" }}
      >
        {EXPLORACIONES_TEXTO.porSeparado}
      </p>
      <ul className="mb-3 flex flex-wrap gap-2 text-xs" aria-label="Leyenda">
        {(Object.keys(ESTADO_EXPLORACION) as EstadoExploracion[]).map((k) => (
          <li key={k} className="insignia inline-flex items-center gap-1.5 bg-white font-normal">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: ESTADO_EXPLORACION[k].punto }}
            />
            {ESTADO_EXPLORACION[k].etiqueta}
          </li>
        ))}
      </ul>
      <div className="hidden grid-cols-[12rem_1fr_1fr] gap-2 pb-1 rotulo text-slate-500 md:grid">
        <span>{T6.cabeceraEtiqueta}</span>
        <span>{T6.columnas[0]}</span>
        <span>{T6.columnas[1]}</span>
      </div>
      <ol className="space-y-2">
        {T6.filas.map((f, i) => (
          <li
            key={f.etiqueta}
            className="grid gap-1.5 tarjeta p-2 md:grid-cols-[12rem_1fr_1fr] md:gap-2"
          >
            <span className="text-sm font-bold text-slate-900">
              <Lineas>{f.etiqueta}</Lineas>
            </span>
            {f.celdas.map((celda, j) => {
              const e = ESTADO_EXPLORACION[EXPLORACIONES_ESTADO[i][j]];
              return (
                <span
                  key={j}
                  className="flex gap-2 rounded-lg border px-2 py-1.5 text-xs leading-snug text-slate-800"
                  style={{ background: e.bg, borderColor: e.borde }}
                >
                  <span className="sr-only">{T6.columnas[j]}: </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: e.punto }}
                  />
                  <span className="min-w-0 flex-1">
                    <span aria-hidden="true" className="block rotulo text-slate-600 md:hidden">
                      {T6.columnas[j]}
                    </span>
                    {/* El estado, también escrito (no solo color). */}
                    <span className={`block text-[11px] font-bold ${e.tinta}`}>{e.corta}</span>
                    <Lineas>{celda}</Lineas>
                  </span>
                </span>
              );
            })}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-600">{T6.notas[0]}</p>
      <ul className="mt-2 space-y-1 text-xs text-slate-700">
        {EXPLORACIONES_TEXTO.notas.map((n) => (
          <li key={n} className="flex gap-1.5">
            <span aria-hidden="true">·</span>
            {n}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs text-slate-500">
        El color resume cada celda; manda el texto de la tabla.
      </p>
    </div>
  );
}

/* ---------- 11. Elección compartida (la Figura 2 como diagrama) ---------- */
function CajaEleccion({ i, tono = "azul" }: { i: number; tono?: "azul" | "centro" }) {
  const caja = F2.cajas[i];
  return (
    <div
      className={`h-full rounded-xl border p-3 ${tono === "centro" ? "border-indigo-200 bg-indigo-50" : "border-sky-200 bg-sky-50"}`}
    >
      <Sub
        className="mb-1.5 text-sm font-extrabold"
        style={{ color: tono === "centro" ? "#3730a3" : "#1e3a8a" }}
      >
        {caja.titulo}
      </Sub>
      <ul className="space-y-1 text-xs leading-snug text-slate-800">
        {caja.items.map((x) => (
          <li key={x}>
            <Texto>{x}</Texto>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Eleccion() {
  const decision = F2.cajas[1];
  const resultado = decision.items[decision.items.length - 1];
  return (
    <div className="space-y-3">
      {/* Como en la figura: perfil y características llevan a la decisión compartida; de ella
          sale el sistema más adecuado; el contexto asistencial en el centro, entre las notas. */}
      <div className="grid items-stretch gap-2 lg:grid-cols-[1fr_auto_0.9fr_auto_1fr]">
        <CajaEleccion i={0} />
        <div className="flex items-center justify-center" aria-hidden="true">
          <ArrowRight size={18} className="hidden text-slate-400 lg:block" />
          <ArrowDown size={18} className="text-slate-400 lg:hidden" />
        </div>
        <div className="flex h-full flex-col gap-2">
          <div className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
            <Sub className="mb-1.5 text-sm font-extrabold" style={{ color: "#3730a3" }}>
              {decision.titulo}
            </Sub>
            <ul className="space-y-1 text-xs leading-snug text-slate-800">
              {decision.items.slice(0, -1).map((x) => (
                <li key={x}>
                  <Texto>{x}</Texto>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center" aria-hidden="true">
            <ArrowDown size={18} className="text-slate-400" />
          </div>
          <p className="rounded-xl bg-indigo-900 px-3 py-2 text-center text-sm text-white">
            <Texto>{resultado}</Texto>
          </p>
        </div>
        <div className="flex items-center justify-center" aria-hidden="true">
          <ArrowRight size={18} className="hidden rotate-180 text-slate-400 lg:block" />
          <ArrowDown size={18} className="text-slate-400 lg:hidden" />
        </div>
        <CajaEleccion i={2} />
      </div>
      <div className="grid gap-2 md:grid-cols-[1fr_0.9fr_1fr]">
        <p className="linea rounded-xl border p-3 text-xs leading-snug text-slate-700">
          <Texto>{F2.cajas[4].items[0]}</Texto>
        </p>
        <CajaEleccion i={3} tono="centro" />
        <p className="linea rounded-xl border p-3 text-xs leading-snug text-slate-700">
          <Texto>{F2.cajas[4].items.slice(1).join(" ")}</Texto>
        </p>
      </div>
      <div
        className="rounded-xl border p-3"
        style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}
      >
        <p className="text-sm font-semibold text-slate-900">{F2.cajas[5].titulo}</p>
        <ul className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
          {F2.cajas[5].items.map((x) => (
            <li key={x} className="insignia bg-white font-normal">
              {x}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded-xl p-3 text-xs leading-snug text-slate-800"
        style={{ background: "#f1f5f9" }}
      >
        <Sub className="mb-1 text-sm font-bold text-slate-900">En el texto del apartado 6</Sub>
        <p>{ELECCION_TEXTO.factores}</p>
        <p className="mt-1">{ELECCION_TEXTO.noJerarquia}</p>
      </div>
      <p className="text-xs text-slate-500">Dibujo hecho con el texto de la figura, caja a caja.</p>
    </div>
  );
}

/* ---------- 12. Interrupción del sistema según su duración ---------- */

/* Como pantalla de consulta (Interrupción del sistema, bajo su h1): subtítulos en h2. */
/* 0.97.1 (17.ª ronda, R1): qué sistemas son de cada formato (Tabla 1, «Formato») y la fila
   «Desconexión» de su ficha (Modos), a un toque: en la guardia no hay que saber de memoria que
   CamAPS FX es una bomba con catéter. */
function DesconexionEnFicha({ cols }: { cols: number[] }) {
  return (
    <p className="no-imprimir mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0 text-[13px] text-slate-600">
      <span>Desconexión en la ficha:</span>
      {cols.map((c) => (
        <a
          key={c}
          href={href("sistemas", ORDEN_SISTEMAS[c], "modos:desconexion")}
          className="tap-44 inline-flex min-h-11 items-center gap-1 font-semibold sm:min-h-6"
          style={{ color: SISTEMA_HEX[c].ink }}
        >
          {CORTO_SISTEMA[c]}
          <ArrowRight size={12} aria-hidden="true" />
        </a>
      ))}
    </p>
  );
}

export function InterrupcionPantalla() {
  return (
    <NivelDiagrama.Provider value={1}>
      <InterrupcionLinea />
    </NivelDiagrama.Provider>
  );
}
function InterrupcionLinea() {
  const L = INTERRUPCION_LINEA;
  const detalle = (empieza: string) => L.detalles.find((d) => d.cuando.startsWith(empieza));
  const respaldo = detalle("Basal de respaldo");
  const reinicio = detalle("Al reiniciar");
  const cetonemia = detalle("Cetonemia");
  // 0.72.0: las siglas del glosario, pulsables la primera vez que salen en la pantalla (en el
  // orden en que se pintan).
  // 0.78.1: cada tramo con su punto solo si le falta («…cetosis..»); los formatos, que empiezan
  // a media frase, con la inicial en mayúscula y sin rayas colgantes.
  const pod = fragmento(L.formatos.pod, true);
  const bomba = `${fragmento(L.formatos.bomba, true)} ${L.formatos.pausa}`;
  const tramo = L.tramos.map((t) => fragmento(t.texto, true));
  const orden = [
    L.premisa,
    cetonemia?.texto ?? "",
    pod,
    bomba,
    tramo[0],
    L.tramos[0].condicion ?? "",
    tramo[1],
    tramo[2],
    respaldo?.texto ?? "",
    ...L.programadas.flatMap((x) => [x.texto, ...x.mas]),
    reinicio?.texto ?? "",
    ...L.detalles.map((d) => d.texto),
  ];
  const porTexto = new Map<string, Set<string>>();
  siglasPorTexto(orden, new Set(SIGLAS_CONSULTA)).forEach((x, k) => {
    if (!porTexto.has(orden[k])) porTexto.set(orden[k], x);
  });
  const TS = ({ children }: { children: string }) => (
    <Texto siglas={porTexto.get(children)}>{children}</Texto>
  );
  /* 0.72.0: cada caso, una tarjeta con su tiempo arriba en grande y el tono de su riesgo; los
     detalles del apartado, dentro del caso al que se refieren (fragmentos literales). */
  /* Cada caso: cabecera con el color de su riesgo y cuerpo; en la rejilla, las cabeceras de
     la fila quedan a la misma altura (subrejilla). */
  const Tramo = ({
    cuando,
    tono,
    children,
  }: {
    cuando: string;
    tono: { soft: string; strong: string; ink: string };
    children: ReactNode;
  }) => (
    // 0.92.0 (revisión de tarjetas, ★5): sin alto fijo en la cabecera (58 px aunque cupiera en
    // una línea). En la rejilla, cada caso ocupa dos filas de una subrejilla: las cabeceras de
    // una fila toman la altura de la más alta y el cuerpo acaba con su texto (`self-start`). La
    // tarjeta se dibuja en sus dos partes (cabecera arriba, cuerpo abajo), sin aire vacío dentro.
    <li className="min-w-0 md:row-span-2 md:grid md:grid-rows-subgrid">
      <span
        className="cabecera-tramo tarjeta flex items-start rounded-b-none border-b-0 px-3 py-2.5 text-[15px] font-bold leading-snug"
        style={{
          background: tono.soft,
          color: tono.ink,
          borderTop: `4px solid ${tono.strong}`,
          ["--tono" as string]: tono.strong,
        }}
      >
        {cuando}
      </span>
      {/* 0.94.0 (rediseño, fase 2): algo más de aire en el cuerpo (en la pantalla, a 15 px). */}
      <span className="tarjeta block space-y-2 self-start rounded-t-none border-t-0 px-3 py-3 text-sm leading-snug text-slate-800">
        {children}
      </span>
    </li>
  );
  const Anexo = ({ titulo, texto }: { titulo: string; texto: string }) => (
    <span className="casilla anexo mt-1 block px-3 py-2 text-[13px] leading-snug">
      <span className="rotulo block">{titulo}</span>
      <TS>{texto}</TS>
    </span>
  );
  const PROGRAMADA = { soft: "#f1f5f9", strong: "#475569", ink: "#334155" };
  return (
    <div className="prosa-72 space-y-4">
      <p className="text-sm text-slate-700">
        <TS>{L.premisa}</TS>
      </p>
      {cetonemia && (
        <a
          href={href("consultar", "figura-3")}
          className="no-imprimir flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 rounded-md border px-3 py-2 text-sm text-slate-900 transition hover:border-slate-500 sm:w-fit"
          style={{ borderColor: TRAMO_HEX.rojo.border, background: TRAMO_HEX.rojo.soft }}
        >
          <Droplets size={16} aria-hidden="true" style={{ color: TRAMO_HEX.rojo.strong }} />
          {/* 0.75.1: en el móvil, el enlace baja debajo del texto (no lo estrecha). */}
          <span className="min-w-0 max-w-[72ch] flex-1 basis-[calc(100%-2rem)] sm:basis-0">
            <span className="font-bold">{cetonemia.cuando}: </span>
            <TS>{cetonemia.texto}</TS>
          </span>
          <span className="shrink-0 pl-6 text-xs font-semibold underline sm:pl-0">
            Ver la Figura 3
          </span>
          <ArrowRight size={14} aria-hidden="true" className="shrink-0 text-slate-500" />
        </a>
      )}
      {/* 1.0.0 (18.ª ronda, R1): a los dos casos de un toque (el programado, el más habitual en la
          guardia, quedaba a unas 2,4 pantallas). */}
      <nav
        aria-label="Casos de la interrupción"
        className="no-imprimir -my-1 flex flex-wrap items-center gap-x-3 gap-y-0 text-[13px]"
      >
        <span className="text-slate-600">Ir a:</span>
        {(
          [
            ["interrupcion-no-programada", "Si no estaba programada"],
            ["interrupcion-programada", "Si está programada"],
            // 1.0.9 (22.ª ronda, R1): lo propio de la bomba o del pod quedaba a unos 2400 px.
            ["interrupcion-formato", "Según el formato"],
          ] as const
        ).map(([id, t]) => (
          <span key={id} className="inline-flex items-center gap-x-2">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById(id);
                el?.scrollIntoView({ block: "start" });
                const h = el?.querySelector<HTMLElement>("h2, h3, h4");
                if (h) {
                  h.setAttribute("tabindex", "-1");
                  h.focus({ preventScroll: true });
                }
              }}
              className="tap-44 inline-flex min-h-11 items-center px-1 font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline sm:min-h-8"
            >
              {t}
            </button>
          </span>
        ))}
      </nav>
      {/* Dos caminos que no son una sola línea de tiempo: lo programado se decide antes de
          desconectar; lo no programado se actúa a partir de aproximadamente 1 h sin insulina. */}
      <section id="interrupcion-no-programada" className="scroll-mt-20 lg:scroll-mt-6">
        <Sub className="titulo-tarjeta mb-1.5">Si no estaba programada</Sub>
        <ol className="grid gap-3 md:grid-cols-3 md:gap-y-0">
          <Tramo cuando={L.tramos[0].cuando} tono={TRAMO_HEX.verde}>
            <span className="block">
              <TS>{tramo[0]}</TS>
            </span>
            <span className="block font-semibold">
              <TS>{L.tramos[0].condicion ?? ""}</TS>
            </span>
          </Tramo>
          <Tramo cuando={L.tramos[1].cuando} tono={TRAMO_HEX.amarillo}>
            <span className="block">
              <TS>{tramo[1]}</TS>
            </span>
          </Tramo>
          <Tramo cuando={L.tramos[2].cuando} tono={TRAMO_HEX.rojo}>
            <span className="block">
              <TS>{tramo[2]}</TS>
            </span>
            {respaldo && <Anexo titulo={respaldo.cuando} texto={respaldo.texto} />}
          </Tramo>
        </ol>
      </section>
      <section id="interrupcion-programada" className="scroll-mt-20 lg:scroll-mt-6">
        <Sub className="titulo-tarjeta mb-1.5">
          Si está programada: se decide antes de desconectar
        </Sub>
        <ul className="grid gap-3 md:grid-cols-2 md:gap-y-0">
          {L.programadas.map((x, k) => (
            <Tramo key={x.cuando} cuando={x.cuando} tono={PROGRAMADA}>
              <span className="block">
                <TS>{x.texto}</TS>
              </span>
              {x.mas.map((m) => (
                <span key={m} className="block">
                  <TS>{m}</TS>
                </span>
              ))}
              {k === 1 && reinicio && <Anexo titulo={reinicio.cuando} texto={reinicio.texto} />}
            </Tramo>
          ))}
        </ul>
      </section>
      {/* 1.0.1 (19.ª ronda, R1): el formato, después de los casos (antes, primero: lo que decide
          la conducta, programada o no, quedaba por debajo de la primera pantalla). */}
      <section
        id="interrupcion-formato"
        className="tarjeta grid scroll-mt-20 gap-x-6 gap-y-3 p-4 md:grid-cols-2 lg:scroll-mt-6"
      >
        {/* 1.0.10 (23.ª ronda, R1 y visual): título visible, como los otros dos casos (desde
            «Ir a» se llegaba a una caja sin encabezado). */}
        {/* 1.0.12 (24.ª ronda, visual): con el estilo de los otros dos casos (antes, 16/400). */}
        <Sub className="titulo-tarjeta md:col-span-2">Según el formato</Sub>
        <div className="text-sm leading-snug text-slate-800">
          <span className="rotulo mb-1 block">Pod</span>
          <p>
            <TS>{pod}</TS>
          </p>
          <DesconexionEnFicha cols={[3]} />
        </div>
        <div className="text-sm leading-snug text-slate-800">
          <span className="rotulo mb-1 block">Bomba con catéter</span>
          <p>
            <TS>{bomba}</TS>
          </p>
          <DesconexionEnFicha cols={[0, 1, 2]} />
        </div>
      </section>
      {L.detalles
        .filter((d) => d !== respaldo && d !== reinicio && d !== cetonemia)
        .map((d) => (
          <p key={d.cuando} className="text-sm text-slate-800">
            <span className="font-bold text-slate-900">{d.cuando}: </span>
            <TS>{d.texto}</TS>
          </p>
        ))}
      <p className="text-xs text-slate-600">{L.nota}</p>
    </div>
  );
}

const CUERPO: Record<DiagramaId, (props: { opcion?: string }) => JSX.Element> = {
  "objetivos-mcg": ObjetivosMCG,
  cetonemia: EscalaCetonemia,
  ejercicio: Ejercicio,
  seguimiento: Seguimiento,
  algoritmos: Algoritmos,
  hipoglucemia: Hipoglucemia,
  transicion: Transicion,
  "gestacion-sistemas": GestacionSistemas,
  hospital: Hospital,
  exploraciones: Exploraciones,
  eleccion: Eleccion,
  interrupcion: InterrupcionLinea,
};

export function DiagramaVista({
  id,
  enApartado = false,
  opcion,
  tituloFuera = false,
}: {
  id: DiagramaId;
  enApartado?: boolean;
  /* Pestaña inicial (población, sistema) cuando el diagrama tiene varias. */
  opcion?: string;
  tituloFuera?: boolean;
}) {
  const Cuerpo = CUERPO[id];
  return (
    <MarcoDiagrama id={id} enApartado={enApartado} tituloFuera={tituloFuera}>
      <Cuerpo opcion={opcion} />
    </MarcoDiagrama>
  );
}
