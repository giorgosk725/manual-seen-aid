/* Renderiza los bloques de un apartado: párrafos, subapartados, listas, tablas y figuras,
   cada uno con su página de origen y un id estable (ancla). */
import { useEffect } from "react";
import { Link2 } from "lucide-react";
import { FIGURAS, TABLAS, idDeBloque, type Apartado, type Bloque } from "../contenido";
import { Texto } from "../texto";
import { PaginaBadge } from "../ui";
import { TablaVista } from "./TablaVista";
import { FiguraVista } from "./FiguraVista";
import { Figura3Lectura } from "./Figura3Vista";
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
  slug,
  p,
  p2,
  children,
  ancho,
}: {
  id: string;
  slug: string;
  p: number;
  p2?: number;
  children: React.ReactNode;
  ancho?: boolean;
}) {
  return (
    <div id={id} className={`group relative scroll-mt-24 ${ancho ? "" : "prosa"}`}>
      <Ancla id={id} slug={slug} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        <div className="shrink-0 pt-1 lg:absolute lg:-right-16 lg:top-0 lg:pt-1.5">
          <PaginaBadge p={p} p2={p2} />
        </div>
      </div>
    </div>
  );
}

function BloqueVista({ b, i, slug }: { b: Bloque; i: number; slug: string }) {
  const id = idDeBloque(b, i);
  switch (b.t) {
    case "p":
      return (
        <Marco id={id} slug={slug} p={b.p} p2={b.p2}>
          <p className="bloque-papel">
            {b.lead && <strong>{b.lead} </strong>}
            <Texto>{b.texto}</Texto>
          </p>
        </Marco>
      );
    case "h3":
      return (
        <Marco id={id} slug={slug} p={b.p}>
          <h2 className="mt-6 text-xl font-extrabold tracking-tight text-slate-900">{b.texto}</h2>
        </Marco>
      );
    case "lista":
      return (
        <Marco id={id} slug={slug} p={b.p}>
          <div className="bloque-papel">
            {b.intro && (
              <p>
                <Texto>{b.intro}</Texto>
              </p>
            )}
            <ul className="mt-2 list-disc space-y-1.5 pl-6">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Texto>{it}</Texto>
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
    case "figura":
      return (
        <div id={id} className="scroll-mt-24 lg:-mr-16">
          {b.id === "F3" ? <Figura3Lectura /> : <FiguraVista figura={FIGURAS[b.id]!} />}
        </div>
      );
  }
}

export function Bloques({ apartado, destacado }: { apartado: Apartado; destacado?: string }) {
  // Enlace profundo a un bloque: se desplaza hasta él y lo destella.
  useEffect(() => {
    if (!destacado) return;
    const el = document.getElementById(destacado);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    el.classList.add("destello");
    const t = setTimeout(() => el.classList.remove("destello"), 2000);
    return () => clearTimeout(t);
  }, [destacado, apartado.slug]);
  return (
    <div className="space-y-5">
      {apartado.bloques.map((b, i) => (
        <BloqueVista key={i} b={b} i={i} slug={apartado.slug} />
      ))}
    </div>
  );
}
