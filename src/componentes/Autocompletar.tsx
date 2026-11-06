/* Sugerencias mientras se escribe (buscador.ts, sugerir): preguntas frecuentes, situaciones,
   sistemas, herramientas, hojas y siglas que empiezan por lo escrito. Una pregunta rellena la
   caja (y responde con sus pasajes); lo demás abre su pantalla. Lo usan los tres buscadores. */
import { BookA, Cpu, FileText, MessageCircleQuestion, Route, Wrench } from "lucide-react";
import type { Sugerencia } from "../buscador";

const ICONO: Record<Sugerencia["tipo"], typeof Route> = {
  pregunta: MessageCircleQuestion,
  situacion: Route,
  sistema: Cpu,
  herramienta: Wrench,
  hoja: FileText,
  sigla: BookA,
};
const ROTULO: Record<Sugerencia["tipo"], string> = {
  pregunta: "Pregunta",
  situacion: "Situación",
  sistema: "Sistema",
  herramienta: "Herramienta",
  hoja: "Hoja",
  sigla: "Sigla",
};

export function Autocompletar({
  items,
  onElegir,
  onIr,
  id,
  campo,
}: {
  items: Sugerencia[];
  onElegir: (texto: string) => void;
  onIr?: () => void;
  /* 1.0.26 (traído del asistente): la lista que controla el campo (cuadro combinado). */
  id?: string;
  /* Con el id del campo, ↓ ↑ recorren las sugerencias y ↑ desde la primera (o Esc) vuelve a él. */
  campo?: string;
}) {
  if (!items.length) return null;
  const fila =
    "flex min-h-11 w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-100";
  return (
    <ul
      id={id}
      className="mt-2 divide-y tarjeta"
      aria-label="Sugerencias"
      onKeyDown={(e) => {
        if (!campo || !["ArrowDown", "ArrowUp", "Escape"].includes(e.key)) return;
        const els = [...e.currentTarget.querySelectorAll<HTMLElement>("a[href], button")];
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (i < 0) return;
        e.preventDefault();
        if (e.key === "Escape" || (e.key === "ArrowUp" && i === 0))
          document.getElementById(campo)?.focus();
        else els[e.key === "ArrowDown" ? Math.min(els.length - 1, i + 1) : i - 1]?.focus();
      }}
    >
      {items.map((s) => {
        const I = ICONO[s.tipo];
        const dentro = (
          <>
            <I size={15} className="shrink-0 text-slate-500" aria-hidden="true" />
            <span className="min-w-0 flex-1">{s.texto}</span>
            <span className="shrink-0 text-xs text-slate-500">{ROTULO[s.tipo]}</span>
          </>
        );
        return (
          <li key={`${s.tipo}/${s.texto}`}>
            {s.ruta ? (
              <a href={s.ruta} onClick={onIr} className={fila}>
                {dentro}
              </a>
            ) : (
              <button type="button" onClick={() => onElegir(s.texto)} className={fila}>
                {dentro}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
