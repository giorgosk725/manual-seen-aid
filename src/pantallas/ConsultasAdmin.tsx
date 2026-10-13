/* Pantalla administrativa de las consultas sin respuesta (#/sobre/consultas), fuera de la
   edición pública (V54-12): solo entra en el build con CON_CONSULTAS_ADMIN (src/edicion.ts). El
   registro está cerrado (las Functions responden 410); qué hacer con los datos históricos lo
   decide su responsable (docs/EDICION_EDITORIAL.md). */
import { useState } from "react";
import { CabeceraEditorial } from "../ui";
import { CATEGORIA_HEX } from "../tokens";
import { href } from "../rutas";
import { URL_SIN_RESPUESTA } from "../consultas";
import { ponerConsulta } from "../consultaBuscar";

/* ---------- Consultas sin respuesta (#/sobre/consultas): la lista, con la clave ---------- */
interface ConsultaRegistrada {
  q: string;
  n: number;
  i: number;
  m: string;
}
export function ConsultasSinRespuesta() {
  const [clave, setClave] = useState(() => {
    try {
      return localStorage.getItem("mseen:clave") ?? "";
    } catch {
      return "";
    }
  });
  const [estado, setEstado] = useState<"inicial" | "cargando" | "error" | "listo">("inicial");
  const [filas, setFilas] = useState<ConsultaRegistrada[]>([]);
  const cargar = async () => {
    setEstado("cargando");
    try {
      localStorage.setItem("mseen:clave", clave);
    } catch {
      /* sin almacenamiento */
    }
    try {
      const r = await fetch(URL_SIN_RESPUESTA, { headers: { "X-Clave": clave } });
      if (!r.ok) throw new Error(String(r.status));
      const d = (await r.json()) as { consultas?: unknown };
      setFilas(Array.isArray(d.consultas) ? (d.consultas as ConsultaRegistrada[]) : []);
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  };
  return (
    <div className="space-y-4">
      <CabeceraEditorial titulo="Consultas sin respuesta" hex={CATEGORIA_HEX.confiar} level={1}>
        <p className="text-sm text-slate-600">
          Lo que se ha buscado sin encontrar ningún pasaje ni pregunta frecuente: el texto y las
          veces. Sirve para añadir equivalencias y preguntas frecuentes.
        </p>
      </CabeceraEditorial>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void cargar();
        }}
      >
        <label className="flex flex-col text-sm">
          <span className="text-xs font-semibold text-slate-600">Clave de lectura</span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="off"
            className="min-h-11 rounded-md border border-slate-300 px-3 text-base"
          />
        </label>
        <button
          type="submit"
          disabled={clave.length < 16 || estado === "cargando"}
          className="tap-44 rounded-md border border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50"
        >
          {estado === "cargando" ? "Cargando…" : "Ver la lista"}
        </button>
      </form>
      {estado === "error" && (
        <p role="alert" className="text-sm text-slate-700">
          No se pudo cargar: clave incorrecta o sin conexión.
        </p>
      )}
      {estado === "listo" && filas.length === 0 && (
        <p className="text-sm text-slate-700">Todavía no hay consultas registradas.</p>
      )}
      {filas.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-600">
              <th className="py-1 pr-2 font-semibold">Consulta</th>
              <th className="py-1 pr-2 text-right font-semibold">Veces</th>
              <th className="py-1 pr-2 text-right font-semibold">Con resultados</th>
              <th className="py-1 font-semibold">Último mes</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.q} className="border-t" style={{ borderColor: "#e6e6e6" }}>
                <td className="py-1.5 pr-2">
                  <a
                    href={href("buscar")}
                    onClick={() => ponerConsulta(f.q)}
                    className="underline underline-offset-2"
                  >
                    {f.q}
                  </a>
                </td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{f.n}</td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{f.i}</td>
                <td className="py-1.5 tabular-nums">{f.m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
