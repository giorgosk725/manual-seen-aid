/* Buscar, Bibliografía, Qué ha cambiado, Sobre esta versión, Autoevaluación y «Más» (móvil). */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink, Moon, Sun, XCircle } from "lucide-react";
import { BIBLIOGRAFIA, CAPITULO, apartadoPorSlug } from "../contenido";
import { CAMBIOS, PENDIENTES, VERSION_APP } from "../contenido/cambios";
import { PREGUNTAS } from "../contenido/test";
import { DESTINOS } from "../nav";
import { href } from "../rutas";
import { Badge, CabeceraEditorial, Revelar, ToneCard } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import { buscar, marcar } from "../buscador";
import { useNocturno } from "../prefs";

const fecha = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const TIPO: Record<string, string> = {
  texto: "Texto",
  tabla: "Tabla",
  figura: "Figura",
  referencia: "Bibliografía",
  sigla: "Sigla",
};

/* ---------- Buscar ---------- */
export function Buscar({ inicial }: { inicial?: string }) {
  const [q, setQ] = useState(inicial ?? "");
  useEffect(() => {
    if (inicial != null) setQ(inicial);
  }, [inicial]);
  // Lo escrito se guarda en la URL (sin apilar historial): al volver con Atrás desde un
  // resultado, la búsqueda sigue ahí y el enlace se puede compartir.
  useEffect(() => {
    const t = setTimeout(() => {
      const destino = href("buscar", q || undefined);
      if (window.location.hash !== destino) window.location.replace(destino);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);
  const res = useMemo(() => (q.trim().length >= 2 ? buscar(q, 60) : []), [q]);
  return (
    <div>
      <CabeceraEditorial titulo="Buscar en el capítulo" hex={CATEGORIA_HEX.consultar} level={1}>
        <p className="text-sm text-slate-600">
          Búsqueda instantánea sobre el texto literal: párrafos, tablas, figuras, bibliografía y
          siglas. Sin inteligencia generativa.
        </p>
      </CabeceraEditorial>
      <label className="sr-only" htmlFor="buscar-q">
        Texto a buscar
      </label>
      <input
        id="buscar-q"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="p. ej. cetonemia, modo sueño, glargina, TBR…"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-soft placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        autoComplete="off"
      />
      {q.trim().length >= 2 && (
        <p className="mt-2 text-xs text-slate-500" aria-live="polite">
          {res.length === 0
            ? "Nada en el capítulo con esas palabras."
            : `${res.length} resultado${res.length === 1 ? "" : "s"}`}
        </p>
      )}
      <ol className="mt-3 space-y-2">
        {res.map((r) => (
          <li key={r.entrada.id}>
            <a
              href={r.entrada.ruta}
              className="block rounded-xl border bg-white p-3 shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
              style={{ borderColor: "#e5ebf1" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <Badge tone="sky">{TIPO[r.entrada.tipo]}</Badge>
                  <span className="font-semibold">{r.entrada.titulo}</span>
                </span>
                <span className="pagina-badge">p. {r.entrada.pagina}</span>
              </div>
              <p className="mt-1 text-sm text-slate-800">
                {marcar(r.fragmento, q).map((t, i) =>
                  t.hit ? (
                    <mark key={i} className="resaltado">
                      {t.t}
                    </mark>
                  ) : (
                    <span key={i}>{t.t}</span>
                  ),
                )}
              </p>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Bibliografía ---------- */
export function Bibliografia({ destacada }: { destacada?: string }) {
  useEffect(() => {
    if (!destacada) return;
    document.getElementById(destacada)?.scrollIntoView({ block: "center" });
  }, [destacada]);
  return (
    <div>
      <CabeceraEditorial titulo="Bibliografía" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Las diez referencias del capítulo (pp. 24–25), tal como aparecen, con el DOI enlazado
          cuando lo tienen.
        </p>
      </CabeceraEditorial>
      <ol className="space-y-2">
        {BIBLIOGRAFIA.map((r) => (
          <Revelar
            as="li"
            key={r.n}
            id={`ref-${r.n}`}
            className={`scroll-mt-24 rounded-xl border bg-white p-3 shadow-soft ${destacada === `ref-${r.n}` ? "ring-2 ring-sky-300" : ""}`}
          >
            <div className="flex gap-3">
              <span
                className="w-6 shrink-0 text-right text-sm font-extrabold tabular-nums"
                style={{ color: CATEGORIA_HEX.confiar.ink }}
              >
                {r.n}.
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{r.cita}</p>
                {r.doi ? (
                  <a
                    href={`https://doi.org/${r.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    doi.org/{r.doi} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex max-w-full items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                  >
                    <span className="min-w-0 break-all">{r.url.replace(/^https?:\/\//, "")}</span>{" "}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="mt-1 block text-xs text-slate-500">Sin DOI ni enlace.</span>
                )}
              </div>
            </div>
          </Revelar>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Qué ha cambiado ---------- */
export function Cambios() {
  return (
    <div>
      <CabeceraEditorial titulo="Qué ha cambiado" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Cada revisión del capítulo y cada versión de la app, con su fecha. Lo que no se sabe,
          abajo, como pendiente.
        </p>
      </CabeceraEditorial>
      <ol className="relative space-y-4 border-l-2 pl-5" style={{ borderColor: "#e5ebf1" }}>
        {CAMBIOS.map((c, i) => (
          <Revelar as="li" key={i} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white"
              style={{
                background:
                  c.ambito === "capitulo"
                    ? CATEGORIA_HEX.leer.strong
                    : CATEGORIA_HEX.confiar.strong,
              }}
            />
            <div
              className="rounded-xl border bg-white p-3 shadow-soft"
              style={{ borderColor: "#e5ebf1" }}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Badge tone={c.ambito === "capitulo" ? "sky" : "emerald"}>
                  {c.ambito === "capitulo" ? "Capítulo" : "App"}
                </Badge>
                <time dateTime={c.fecha}>{fecha(c.fecha)}</time>
              </div>
              <h2 className="mt-1 text-sm font-bold text-slate-900">{c.titulo}</h2>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {c.detalle.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          </Revelar>
        ))}
      </ol>
      <ToneCard tone="amber" title="Pendiente" className="mt-6">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
          {PENDIENTES.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </ToneCard>
    </div>
  );
}

/* ---------- Sobre esta versión ---------- */
const CORRECCIONES = [
  "1/11 (p. 3): «control predictivo basado en modelo (MPC) y lógica difusa».",
  "2/11 (pp. 3–4): «Sistemas AID comercializados en España» en el texto y en el título de la Tabla 1.",
  "3/11 (p. 4, Tabla 1): indicación de Omnipod 5 «≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día».",
  "4/11 (p. 5): sin guion tras «Omnipod 5».",
  "5/11 (p. 8, Figura 3): cabecera de la columna amarilla «β-OHB 0,6-0,9 mmol/l»; nota al pie de las dosis con asterisco; «Precisan atención urgente» en negrita; «iSGLT2»; acentos y «β-OHB» unificado.",
  "6/11 (p. 11, Tabla 3): modo ejercicio «140–160 mg/dl».",
  "7/11 (p. 11, Tabla 4): fila «Ejercicio anaeróbico o de alta intensidad» reconstruida como fila normal con una celda común a los cuatro sistemas.",
  "8/11 (p. 21, Tabla 6): «Tomografía computarizada (TC)».",
  "9/11 (p. 24, infografía): «En modalidades híbridas»; «Requieren anuncio de comidas y bolo prandial»; «DM1»; «Mejora consistente del control glucémico con buen perfil de seguridad»; «Bomba de insulina o pod»; «Iniciar».",
  "10/11 (p. 24, bibliografía): referencia 6 completa (Holt RIG et al., Diabetes Care 2026, doi:10.2337/dci26-0122).",
  "11/11 (encabezado gráfico de todas las páginas): no afecta al texto; no aplica a la app.",
  "Errata que el autor corregirá en la editorial, ya aplicada aquí (Tabla 1, Control-IQ+): «peso 9–200 kg, DTD 5–200 UI/día».",
];

export function Sobre() {
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Sobre esta versión" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Manual SEEN · AID {VERSION_APP}. Qué es, de dónde sale el texto y qué no es.
        </p>
      </CabeceraEditorial>
      <section
        className="prosa rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e5ebf1" }}
        aria-labelledby="s-que"
      >
        <h2 id="s-que" className="text-base font-extrabold text-slate-900">
          Qué es
        </h2>
        <p className="mt-2 text-sm">
          Una web estática, instalable y que funciona sin conexión, para leer el capítulo «
          {CAPITULO.titulo}» ({CAPITULO.autor}, {CAPITULO.obra}) mejor que en papel, consultarlo en
          dos toques y ver cuándo y en qué se ha actualizado.
        </p>
        <h2 className="mt-5 text-base font-extrabold text-slate-900">Fuente única</h2>
        <p className="mt-2 text-sm">
          El texto es el del capítulo, literal, de la maquetación final del {CAPITULO.fechaFuente} (
          {CAPITULO.editorial}, {CAPITULO.paginas} páginas), con las 11 correcciones editoriales
          anotadas aplicadas. Cada bloque lleva la página de origen. No hay contenido inventado ni
          traído de otras fuentes; las figuras, que en el PDF son imágenes, están transcritas caja a
          caja.
        </p>
        <h2 className="mt-5 text-base font-extrabold text-slate-900">
          Dos capas, siempre separadas
        </h2>
        <p className="mt-2 text-sm">
          Todo lo que viene del capítulo se muestra como texto literal con su página. La única
          excepción, rotulada en ámbar como «Ampliación del autor · fuera del capítulo», es la ficha
          técnica de cada sistema (indicación, algoritmo, equipo, parámetros, sets de infusión,
          insulinas): material propio del autor, validado en su proyecto asistente-aid, con sus
          fuentes al pie. No forma parte del Manual SEEN.
        </p>
        <h2 className="mt-5 text-base font-extrabold text-slate-900">Qué no es</h2>
        <p className="mt-2 text-sm">
          Material educativo para profesionales. No es un producto sanitario, no contiene
          calculadoras, no pide ni guarda datos de pacientes y no sustituye la ficha técnica de cada
          sistema, los protocolos del centro ni el juicio clínico. Las únicas preferencias que
          guarda el navegador son el modo nocturno y el tamaño de letra.
        </p>
      </section>
      <section
        className="rounded-2xl border bg-white p-4 shadow-soft"
        style={{ borderColor: "#e5ebf1" }}
        aria-labelledby="s-corr"
      >
        <h2 id="s-corr" className="text-base font-extrabold text-slate-900">
          Correcciones editoriales aplicadas
        </h2>
        <ol className="mt-2 space-y-1 text-sm text-slate-700">
          {CORRECCIONES.map((c, i) => (
            <li key={i} className="flex gap-2">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </section>
      <ToneCard tone="amber" title="Pendiente (no se ha inventado nada para rellenarlo)">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
          {PENDIENTES.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </ToneCard>
      <section
        className="rounded-2xl border bg-white p-4 text-sm text-slate-700 shadow-soft"
        style={{ borderColor: "#e5ebf1" }}
      >
        <h2 className="text-base font-extrabold text-slate-900">Tecnología</h2>
        <p className="mt-2">
          Vite, React y TypeScript; PWA con uso sin conexión; sin servidor ni analítica. Código en
          el repositorio público <code>manual-seen-aid</code>. Castellano de España; unidades mg/dl
          y mmol/l; siglas DM1/DM2; «duración de la insulina activa».
        </p>
      </section>
    </div>
  );
}

/* ---------- Autoevaluación ---------- */
function Pregunta({ p, n }: { p: (typeof PREGUNTAS)[number]; n: number }) {
  const [elegida, setElegida] = useState<number | null>(null);
  const ap = apartadoPorSlug(p.apartado);
  return (
    <li className="rounded-2xl border bg-white p-4 shadow-soft" style={{ borderColor: "#e5ebf1" }}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-bold">Pregunta {n}</span>
        {p.provisional && <Badge tone="amber">Provisional · ejemplo</Badge>}
      </div>
      <p className="mt-1 text-base font-semibold text-slate-900">{p.enunciado}</p>
      <ol className="mt-3 space-y-1.5">
        {p.opciones.map((o, i) => {
          const esCorrecta = i === p.correcta;
          const marcada = elegida === i;
          const resuelta = elegida != null;
          let estilo = "border-slate-300 bg-white hover:border-slate-400";
          if (resuelta && esCorrecta) estilo = "border-emerald-400 bg-emerald-50";
          else if (resuelta && marcada) estilo = "border-red-400 bg-red-50";
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setElegida(i)}
                disabled={resuelta}
                aria-pressed={marcada}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-default ${estilo}`}
              >
                <span className="w-5 shrink-0 font-bold text-slate-500">
                  {String.fromCharCode(97 + i)})
                </span>
                <span className="flex-1">{o}</span>
                {resuelta && esCorrecta && (
                  <CheckCircle2 size={16} className="text-emerald-700" aria-label="Correcta" />
                )}
                {resuelta && marcada && !esCorrecta && (
                  <XCircle size={16} className="text-red-700" aria-label="Incorrecta" />
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {elegida != null && (
        <div
          className="animate-in mt-3 rounded-xl p-3 text-sm"
          style={{ background: "#eef3f8" }}
          aria-live="polite"
        >
          <p className="font-bold text-slate-900">
            {elegida === p.correcta ? "Correcto." : "No es esa."} Por qué, con el capítulo:
          </p>
          <p className="mt-1 text-slate-800">{p.razon}</p>
          <a
            href={href("capitulo", p.apartado, p.ancla)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:underline"
          >
            Leer en el apartado {ap?.n}: {ap?.titulo} (p. {p.pagina}){" "}
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      )}
    </li>
  );
}

export function Test() {
  return (
    <div>
      <CabeceraEditorial titulo="Autoevaluación" hex={CATEGORIA_HEX.aprender} level={1}>
        <p className="text-sm text-slate-600">
          Cada respuesta se razona con el texto del capítulo y enlaza a la página que la justifica.
        </p>
      </CabeceraEditorial>
      <ToneCard tone="amber" title="Preguntas pendientes del autor" className="mb-4">
        <p className="text-sm text-slate-800">
          El capítulo deja el hueco de la autoevaluación (p. 24) sin preguntas. Las dos de abajo son
          ejemplos provisionales para dejar lista la estructura; las definitivas las escribirá el
          autor.
        </p>
      </ToneCard>
      <ol className="space-y-3">
        {PREGUNTAS.map((p, i) => (
          <Pregunta key={p.id} p={p} n={i + 1} />
        ))}
      </ol>
    </div>
  );
}

/* ---------- Más (móvil): el resto de destinos y las preferencias ---------- */
export function Mas() {
  const [night, toggle] = useNocturno();
  const ids = ["bibliografia", "cambios", "sobre", "test"];
  return (
    <div>
      <CabeceraEditorial titulo="Más" hex={CATEGORIA_HEX.confiar} level={1} />
      <ul className="space-y-2">
        {ids.map((id) => {
          const d = DESTINOS.find((x) => x.id === id)!;
          const I = d.icono;
          return (
            <li key={id}>
              <a
                href={d.href}
                className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
                style={{ borderColor: "#e5ebf1" }}
              >
                <I
                  size={18}
                  className="shrink-0"
                  style={{ color: CATEGORIA_HEX[d.cat].strong }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900">{d.etiqueta}</span>
                  <span className="block text-xs text-slate-500">{d.descripcion}</span>
                </span>
              </a>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={night}
            className="flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left shadow-soft transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            style={{ borderColor: "#e5ebf1" }}
          >
            {night ? (
              <Sun size={18} className="shrink-0" aria-hidden="true" />
            ) : (
              <Moon size={18} className="shrink-0" aria-hidden="true" />
            )}
            <span className="text-sm font-bold text-slate-900">
              {night ? "Modo día" : "Modo nocturno"}
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}
