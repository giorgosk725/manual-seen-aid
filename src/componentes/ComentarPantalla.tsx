/* «¿Algo que comentar de esta pantalla?» (14-10-2026), al pie de cada pantalla: para quien revisa
   el complemento. Abre un correo sin destinatario con la pantalla, su dirección y la versión ya
   escritas (se contesta a quien envió el enlace), o copia esos datos. No envía ni guarda nada. */
import { useState } from "react";
import { Copy, Mail, MessageSquare } from "lucide-react";
import { VERSION_APP } from "../version";

export function ComentarPantalla({ titulo }: { titulo?: string }) {
  const [copiado, setCopiado] = useState<"si" | "no" | null>(null);
  const pantalla = titulo || "Inicio";
  const datos = `Pantalla: ${pantalla}\nDirección: ${window.location.href}\nVersión: ${VERSION_APP}\n\nComentario:\n`;
  const asunto = `Complemento del capítulo 89 · ${pantalla}`;
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(datos);
      setCopiado("si");
    } catch {
      setCopiado("no");
    }
  };
  const boton =
    "inline-flex min-h-11 items-center gap-1.5 rounded-lg border bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:min-h-9";
  return (
    <aside
      aria-label="Comentar esta pantalla"
      className="no-imprimir mt-10 flex flex-wrap items-center gap-2 border-t pt-3 text-sm text-slate-600"
      style={{ borderColor: "#e6e6e6" }}
    >
      <span className="flex items-center gap-1.5">
        <MessageSquare size={15} aria-hidden="true" />
        ¿Algo que comentar de esta pantalla?
      </span>
      <a
        href={`mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(datos)}`}
        className={boton}
        style={{ borderColor: "#d4d4d4" }}
      >
        <Mail size={14} aria-hidden="true" /> Escribir un correo
      </a>
      <button type="button" onClick={copiar} className={boton} style={{ borderColor: "#d4d4d4" }}>
        <Copy size={14} aria-hidden="true" /> Copiar los datos de la pantalla
      </button>
      <span role="status" className="text-xs text-slate-600">
        {copiado === "si"
          ? "Copiados: pégalos en un mensaje con tu comentario."
          : copiado === "no"
            ? `No se pudo copiar. Indica la pantalla «${pantalla}» y la versión ${VERSION_APP}.`
            : ""}
      </span>
    </aside>
  );
}
