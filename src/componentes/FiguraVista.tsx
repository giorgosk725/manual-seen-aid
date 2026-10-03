/* Figura transcrita (F1, F2, infografía): la transcripción caja a caja manda; la imagen de
   la maquetación es un apoyo plegado («Ver la figura original»). Preparada para que el
   autor añada o sustituya imágenes: basta con cambiar `imagen.src` en src/contenido. */
import { useState } from "react";
import { Image as ImageIcon, Maximize2 } from "lucide-react";
import { AbrirEnVisor } from "./Visor";
import type { Figura } from "../contenido";
import { Texto } from "../texto";
import { PaginaBadge } from "../ui";
import { BRAND_ACCENT } from "../tokens";
import { TituloBloque } from "../nivel";

const TONO = {
  azul: { soft: "#eef3f8", ink: "#15324f", strong: "#1f4e79" },
  verde: { soft: "#ecfdf5", ink: "#065f46", strong: "#15803d" },
  amarillo: { soft: "#fffbeb", ink: "#854d0e", strong: "#ca8a04" },
  naranja: { soft: "#fff7ed", ink: "#9a3412", strong: "#ea580c" },
  rojo: { soft: "#fef2f2", ink: "#991b1b", strong: "#dc2626" },
};

export function ImagenFigura({ figura, abierta = false }: { figura: Figura; abierta?: boolean }) {
  const [ver, setVer] = useState(abierta);
  if (!figura.imagen) return null;
  return (
    <div className="no-imprimir mt-3">
      <button
        type="button"
        onClick={() => setVer((v) => !v)}
        aria-expanded={ver}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      >
        <ImageIcon size={14} aria-hidden="true" />
        {ver ? "Ocultar la figura original" : "Ver la figura original"}
      </button>
      <AbrirEnVisor
        imagen={{
          src: figura.imagen.src,
          alt: figura.imagen.alt,
          titulo: figura.titulo,
          nota: `p. ${figura.pagina}`,
        }}
        etiqueta={`Pantalla completa con zoom: ${figura.titulo}`}
        className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
      >
        <Maximize2 size={14} aria-hidden="true" /> Pantalla completa con zoom
      </AbrirEnVisor>
      {ver && (
        <figure
          className="animate-in mt-3 overflow-hidden rounded-xl border bg-white"
          style={{ borderColor: "#e6e6e6" }}
        >
          <img
            src={figura.imagen.src}
            alt={figura.imagen.alt}
            loading="lazy"
            className="block w-full"
          />
          <figcaption className="px-3 py-2 text-xs text-slate-500">{figura.imagen.nota}</figcaption>
        </figure>
      )}
    </div>
  );
}

export function FiguraVista({ figura }: { figura: Figura }) {
  return (
    <section aria-label={figura.titulo} className="bloque-papel">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: BRAND_ACCENT.ink }}
          >
            {figura.numero ? `Figura ${figura.numero}` : "Infografía"} · transcripción
          </div>
          <TituloBloque className="text-sm font-semibold text-slate-800">
            {figura.cabecera || figura.titulo}
          </TituloBloque>
        </div>
        <PaginaBadge p={figura.pagina} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {figura.cajas.map((c, i) => {
          const t = c.tono ? TONO[c.tono] : null;
          return (
            <div
              key={i}
              className="rounded-xl border p-3"
              style={{
                borderColor: t ? `${t.strong}40` : "#e6e6e6",
                background: t ? `linear-gradient(160deg, ${t.soft}, #ffffff 70%)` : "#ffffff",
              }}
            >
              {c.titulo && (
                <div className="mb-1.5 text-sm font-bold" style={{ color: t ? t.ink : "#1e293b" }}>
                  <Texto>{c.titulo}</Texto>
                </div>
              )}
              <ul className="space-y-1 text-sm text-slate-700">
                {c.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: t ? t.strong : "#94a3b8" }}
                    />
                    <span>
                      <Texto>{it}</Texto>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs italic text-slate-500">{figura.titulo}</p>
      <ImagenFigura figura={figura} />
    </section>
  );
}
