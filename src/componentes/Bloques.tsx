/* Renderiza los bloques de un apartado: párrafos, subapartados, listas, tablas y figuras,
   cada uno con su página de origen y un id estable (ancla). */
import { Fragment, useEffect } from "react";
import { Link2 } from "lucide-react";
import {
  FIGURAS,
  TABLAS,
  diagramasTrasBloque,
  idDeBloque,
  type Apartado,
  type Bloque,
} from "../contenido";
import { extendidosTrasBloque } from "../extendida";
import { VersionExtendida } from "./VersionExtendida";
import { TextoConRemisiones } from "./Remisiones";
import { PaginaBadge } from "../ui";
import { TablaVista } from "./TablaVista";
import { FiguraVista } from "./FiguraVista";
import { Figura3Lectura } from "./Figura3Vista";
import { Figura1Animada } from "./Figura1Animada";
import { DiagramaVista } from "./Diagramas";
import { href } from "../rutas";

function Ancla({ id, slug }: { id: string; slug: string }) {
  return (
    <a
      href={href("capitulo", slug, id)}
      aria-label="Enlace a este bloque"
      title="Enlace a este bloque"
      className="no-imprimir absolute -left-6 top-1 hidden rounded p-0.5 text-slate-300 opacity-0 transition hover:text-slate-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 group-hover:opacity-100 lg:block"
    >
      <Link2 size={14} />
    </a>
  );
}

function Marco({
  id,
  ancla,
  slug,
  p,
  p2,
  children,
  ancho,
}: {
  id: string;
  ancla: string;
  slug: string;
  p: number;
  p2?: number;
  children: React.ReactNode;
  ancho?: boolean;
}) {
  return (
    <div id={id} className={`group relative scroll-mt-24 ${ancho ? "" : "prosa"}`}>
      <Ancla id={ancla} slug={slug} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        <div className="shrink-0 pt-1 lg:absolute lg:-right-16 lg:top-0 lg:pt-1.5">
          <PaginaBadge p={p} p2={p2} />
        </div>
      </div>
    </div>
  );
}

function BloqueVista({
  b,
  i,
  slug,
  prefijo,
  nivelSub,
}: {
  b: Bloque;
  i: number;
  slug: string;
  prefijo?: string;
  nivelSub: 2 | 3;
}) {
  const ancla = idDeBloque(b, i);
  // En «Capítulo entero» varios apartados conviven en la página: ids con prefijo.
  const id = prefijo ? `${prefijo}-${ancla}` : ancla;
  const Sub = nivelSub === 3 ? "h3" : "h2";
  switch (b.t) {
    case "p":
      return (
        <Marco id={id} ancla={ancla} slug={slug} p={b.p} p2={b.p2}>
          <p className="bloque-papel">
            {b.lead && <strong>{b.lead} </strong>}
            <TextoConRemisiones>{b.texto}</TextoConRemisiones>
          </p>
        </Marco>
      );
    case "h3":
      return (
        <Marco id={id} ancla={ancla} slug={slug} p={b.p}>
          <Sub className="mt-6 text-xl font-extrabold tracking-tight text-slate-900">{b.texto}</Sub>
        </Marco>
      );
    case "lista":
      return (
        <Marco id={id} ancla={ancla} slug={slug} p={b.p} p2={b.p2}>
          <div className="bloque-papel">
            {b.intro && (
              <p>
                <TextoConRemisiones>{b.intro}</TextoConRemisiones>
              </p>
            )}
            <ul className="mt-2 list-disc space-y-1.5 pl-6">
              {b.items.map((it, j) => (
                <li key={j}>
                  <TextoConRemisiones>{it}</TextoConRemisiones>
                </li>
              ))}
            </ul>
          </div>
        </Marco>
      );
    case "tabla":
      return (
        <div id={id} className="scroll-mt-24 lg:-mr-16">
          <TablaVista tabla={TABLAS[b.id]} modo="lectura" />
        </div>
      );
    case "diagrama":
      return (
        <div id={id} className="scroll-mt-24 lg:-mr-16">
          <DiagramaVista id={b.id} enApartado />
        </div>
      );
    case "figura":
      return (
        <div id={id} className="scroll-mt-24 lg:-mr-16">
          {b.id === "F1" && (
            <div className="mb-4">
              <Figura1Animada />
            </div>
          )}
          {b.id === "F3" ? <Figura3Lectura /> : <FiguraVista figura={FIGURAS[b.id]!} />}
        </div>
      );
  }
}

export function Bloques({
  apartado,
  destacado,
  prefijo,
  nivelSub = 2,
}: {
  apartado: Apartado;
  destacado?: string;
  prefijo?: string;
  nivelSub?: 2 | 3;
}) {
  // Enlace profundo a un bloque: se desplaza hasta él y lo destella.
  useEffect(() => {
    if (!destacado) return;
    // Solo si la dirección sigue apuntando a este bloque (nunca al salir de la pantalla).
    if (!window.location.hash.endsWith(`/${destacado}`)) return;
    const el = document.getElementById(destacado);
    if (!el) return;
    // Si el destino está dentro de un plegable (versión extendida), se abre.
    const plegable = el.closest("details");
    if (plegable) plegable.open = true;
    el.scrollIntoView({ block: "start" });
    el.classList.add("destello");
    const t = setTimeout(() => el.classList.remove("destello"), 2000);
    return () => clearTimeout(t);
  }, [destacado, apartado.slug]);
  return (
    <div className="space-y-5">
      {apartado.bloques.map((b, i) => {
        const diagramas = diagramasTrasBloque(apartado, i);
        const extendidos = extendidosTrasBloque(apartado, i);
        return (
          <Fragment key={i}>
            <BloqueVista b={b} i={i} slug={apartado.slug} prefijo={prefijo} nivelSub={nivelSub} />
            {/* Diagramas posteriores a la 0.3.0: tras su ancla, sin mover las anclas b1, b2… */}
            {diagramas.map((d) => (
              <div
                key={d.id}
                id={prefijo ? `${prefijo}-d-${d.id}` : `d-${d.id}`}
                className="scroll-mt-24 lg:-mr-16"
              >
                <DiagramaVista id={d.id} enApartado />
              </div>
            ))}
            {extendidos.length > 0 && (
              <VersionExtendida
                fragmentos={extendidos}
                id={`${prefijo ? prefijo + "-" : ""}ext-tras-${idDeBloque(b, i)}`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
