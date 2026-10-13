/* Calculadora de parámetros iniciales (#/consultar/inicio/calculadora[:<sistema>]): de qué
   tratamiento viene, qué sistema, las dosis, y salen la DTD de inicio, la basal, la ratio, el
   factor y qué programar en ese sistema. Solo las reglas de la Tabla 2 y del apartado 8
   (calculadora.ts); lo escrito vive en memoria mientras la app está abierta. */
import { useState, type ReactNode } from "react";
import { AlertTriangle, Calculator, Pen, ShieldCheck, Syringe } from "lucide-react";
import {
  CONTROLES,
  DESDE_ISCI,
  INICIALIZACION,
  LIMITES,
  NUCLEO_COMUN,
  OBJETIVOS_CALCULADOR,
  REGLAS,
  calcular,
  coma,
  fueraDeIndicacion,
  indicacionDe,
  num,
  objetivoAlgoritmoDe,
  papelEnAutomatico,
  type Clave,
  type Control,
  type Origen,
} from "../calculadora";
import { TABLAS, rutaDeTabla } from "../contenido";
import { FOTO_SISTEMA, ORDEN_SISTEMAS } from "../ampliacion/ids";
import { href } from "../rutas";
import { CATEGORIA_HEX, SISTEMA_HEX } from "../tokens";
import { FuentePie } from "./FuentePie";

const hex = CATEGORIA_HEX.consultar;
const CORTOS = ["MiniMed 780G", "Control-IQ", "CamAPS FX", "Omnipod 5"];

/* Lo escrito sigue al cambiar de fase y volver, mientras la app está abierta. */
const memoria = {
  origen: "mdi" as Origen,
  basal: "",
  rapida: "",
  dtdIsci: "",
  peso: "",
  control: "bueno" as Control,
  reduccion: 10,
  basalPct: 45,
  regla: 1700 as 1700 | 1800,
  objetivo: 100,
  ultralarga: false,
  isciFunciona: true,
};

function useMemoria<K extends keyof typeof memoria>(k: K) {
  const [v, setV] = useState(memoria[k]);
  return [
    v,
    (x: (typeof memoria)[K]) => {
      memoria[k] = x;
      setV(x);
    },
  ] as const;
}

function Paso({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`calc-paso-${n}`} className="space-y-2">
      <h2
        id={`calc-paso-${n}`}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-bold text-white"
        style={{ background: "#1f2f5c" }}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs tabular-nums">
          {n}
        </span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Opciones<T extends string | number>({
  etiqueta,
  opciones,
  valor,
  onChange,
}: {
  etiqueta: string;
  opciones: { v: T; t: ReactNode }[];
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-sm font-semibold text-slate-800">{etiqueta}</div>
      <div role="group" aria-label={etiqueta} className="flex flex-wrap gap-1.5">
        {opciones.map((o) => {
          const on = o.v === valor;
          return (
            <button
              key={String(o.v)}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.v)}
              className={`inline-flex min-h-11 items-center rounded-full border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${on ? "text-white" : "bg-white text-slate-700 hover:border-slate-400"}`}
              style={
                on ? { background: "#334155", borderColor: "#334155" } : { borderColor: "#d4d4d4" }
              }
            >
              {o.t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Campo({
  id,
  etiqueta,
  unidad,
  valor,
  onChange,
  max,
}: {
  id: string;
  etiqueta: string;
  unidad: string;
  valor: string;
  onChange: (v: string) => void;
  max: number;
}) {
  const v = num(valor);
  const error = valor !== "" && (v > max || !/^\d+([.,]\d+)?$/.test(valor.trim()));
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-800">
        {etiqueta}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="0"
          className="h-12 w-full min-w-0 rounded-lg border bg-white px-3 text-lg tabular-nums text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          style={{ borderColor: error ? "#b91c1c" : "#cbd5e1" }}
        />
        <span className="shrink-0 text-sm text-slate-600">{unidad}</span>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-red-800">
          Revisa la cifra (entre 0 y {max}).
        </p>
      )}
    </div>
  );
}

function Cifra({
  titulo,
  valor,
  unidad,
  cuenta,
  regla,
  color,
}: {
  titulo: string;
  valor: string;
  unidad: string;
  cuenta: string;
  regla: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-3" style={{ borderColor: "#e2e8f0" }}>
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{titulo}</div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tabular-nums" style={{ color }}>
          {valor}
        </span>
        <span className="text-sm font-semibold text-slate-600">{unidad}</span>
      </div>
      <div className="mt-0.5 text-xs tabular-nums text-slate-600">{cuenta}</div>
      <div className="mt-1 text-xs text-slate-500">{regla}</div>
    </div>
  );
}

const NOMBRE_CLAVE: Record<Clave, string> = {
  peso: "Peso",
  dtd: "DTD",
  basal: "Tasa basal",
  factor: "Factor de sensibilidad",
  ratio: "Ratio I/HC",
  objetivo: "Objetivo del calculador de bolos manual",
  objetivoAlg: "Objetivo glucémico del algoritmo",
  ia: "Duración de la insulina activa",
};

export function CalculadoraInicio({
  sis,
  onSistema,
}: {
  sis?: number;
  onSistema: (c: number) => void;
}) {
  const [origen, setOrigen] = useMemoria("origen");
  const [basal, setBasal] = useMemoria("basal");
  const [rapida, setRapida] = useMemoria("rapida");
  const [dtdIsci, setDtdIsci] = useMemoria("dtdIsci");
  const [peso, setPeso] = useMemoria("peso");
  const [control, setControl] = useMemoria("control");
  const [reduccion, setReduccion] = useMemoria("reduccion");
  const [basalPct, setBasalPct] = useMemoria("basalPct");
  const [regla, setRegla] = useMemoria("regla");
  const [objetivo, setObjetivo] = useMemoria("objetivo");
  const [ultralarga, setUltralarga] = useMemoria("ultralarga");
  const [isciFunciona, setIsciFunciona] = useMemoria("isciFunciona");

  const elegirControl = (c: Control) => {
    const x = CONTROLES.find((k) => k.id === c)!;
    setControl(c);
    setReduccion(x.reduccion);
    setRegla(x.regla);
    if (c === "riesgo") setObjetivo(120);
  };
  const invalido = (s: string, max: number) => s !== "" && num(s) > max;
  const calculaIsci = origen === "isci" && !isciFunciona;
  const r =
    (origen === "mdi" && !invalido(basal, LIMITES.dosis) && !invalido(rapida, LIMITES.dosis)) ||
    (calculaIsci && !invalido(dtdIsci, LIMITES.dosis))
      ? calcular({
          origen,
          basal: num(basal),
          rapida: num(rapida),
          dtdIsci: num(dtdIsci),
          peso: num(peso),
          reduccion,
          basalPct,
          regla,
          objetivo,
        })
      : null;
  const h = sis !== undefined ? SISTEMA_HEX[sis] : null;
  const color = h?.ink ?? "#1f2f5c";
  const pesoKg = invalido(peso, LIMITES.peso) ? 0 : num(peso);
  const avisos = r && sis !== undefined ? fueraDeIndicacion(sis, r.dtdInicial, pesoKg) : [];

  const valorDe = (k: Clave, c: number): ReactNode => {
    const aCalcular = origen === "mdi" || calculaIsci;
    const desdeBomba = (
      <span className="font-normal italic text-slate-600">el de la bomba actual</span>
    );
    switch (k) {
      case "peso":
        return pesoKg > 0 ? (
          `${coma(pesoKg)} kg`
        ) : (
          <span className="font-normal italic text-slate-600">escribe el peso</span>
        );
      case "dtd":
        return r ? `${coma(r.dtdInicial)} UI/día` : "—";
      case "basal":
        if (!aCalcular) return desdeBomba;
        return r ? `${coma(r.basalHora)} UI/h (basal plana; ${coma(r.basalDia)} UI/día)` : "—";
      case "factor":
        if (!aCalcular) return desdeBomba;
        return r ? `1 UI por ${r.factor} mg/dl` : "—";
      case "ratio":
        if (!aCalcular) return desdeBomba;
        return r ? `1 UI por ${coma(r.ratio)} g de HC` : "—";
      case "objetivo":
        return `${objetivo} mg/dl`;
      case "objetivoAlg":
        return <span className="font-normal">{objetivoAlgoritmoDe(c).replace(/\n/g, " · ")}</span>;
      case "ia":
        return <span className="font-normal">{papelEnAutomatico("ia", c)}</span>;
    }
  };

  const fuentes = [
    { texto: `Tabla 2, p. ${TABLAS.T2.paginas[0]}`, ruta: rutaDeTabla("T2") },
    { texto: "Apartado 8, p. 12", ruta: href("capitulo", "08-iniciacion") },
    { texto: "Tabla 1, pp. 3-4", ruta: rutaDeTabla("T1") },
    { texto: `Tabla 3, p. ${TABLAS.T3.paginas[0]}`, ruta: rutaDeTabla("T3") },
  ].map((f) => ({ texto: f.texto, ruta: f.ruta ?? undefined }));

  return (
    <div className="space-y-5">
      <Paso n={1} titulo="¿De qué tratamiento viene?">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { v: "mdi", t: "MDI", d: "Plumas: basal y rápida", I: Pen },
              { v: "isci", t: "Bomba de insulina", d: "ISCI", I: Syringe },
            ] as const
          ).map((o) => {
            const on = origen === o.v;
            return (
              <button
                key={o.v}
                type="button"
                aria-pressed={on}
                onClick={() => setOrigen(o.v)}
                className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                style={
                  on
                    ? { borderColor: hex.strong, background: hex.soft }
                    : { borderColor: "#e2e8f0", background: "#fff" }
                }
              >
                <o.I size={22} aria-hidden="true" style={{ color: on ? hex.strong : "#64748b" }} />
                <span className="text-base font-extrabold text-slate-900">{o.t}</span>
                <span className="text-xs text-slate-600">{o.d}</span>
              </button>
            );
          })}
        </div>
      </Paso>

      <Paso n={2} titulo="¿Qué sistema?">
        <div role="group" aria-label="Sistema" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ORDEN_SISTEMAS.map((id, c) => {
            const on = sis === c;
            const hs = SISTEMA_HEX[c];
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => onSistema(c)}
                className="flex min-h-14 items-center gap-2 rounded-xl border-2 p-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                style={
                  on
                    ? { borderColor: hs.strong, background: hs.soft }
                    : { borderColor: "#e2e8f0", background: "#fff" }
                }
              >
                <img
                  src={FOTO_SISTEMA[id]}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg bg-white object-cover"
                />
                <span
                  className="min-w-0 text-sm font-bold leading-tight"
                  style={{ color: on ? hs.ink : "#1e293b" }}
                >
                  {CORTOS[c]}
                </span>
              </button>
            );
          })}
        </div>
      </Paso>

      <Paso n={3} titulo={origen === "mdi" ? "Dosis actuales y perfil" : "Programación actual"}>
        {origen === "mdi" ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo
                id="calc-basal"
                etiqueta="Insulina basal"
                unidad="UI/día"
                valor={basal}
                onChange={setBasal}
                max={LIMITES.dosis}
              />
              <Campo
                id="calc-rapida"
                etiqueta="Insulina rápida"
                unidad="UI/día"
                valor={rapida}
                onChange={setRapida}
                max={LIMITES.dosis}
              />
              <Campo
                id="calc-peso"
                etiqueta="Peso"
                unidad="kg"
                valor={peso}
                onChange={setPeso}
                max={LIMITES.peso}
              />
            </div>
            <Opciones
              etiqueta="Control previo"
              opciones={CONTROLES.map((c) => ({ v: c.id, t: c.texto }))}
              valor={control}
              onChange={elegirControl}
            />
            <div>
              <label
                htmlFor="calc-reduccion"
                className="mb-1 flex items-baseline justify-between text-sm font-semibold text-slate-800"
              >
                <span>Reducción de la DTD</span>
                <span className="text-lg font-extrabold tabular-nums" style={{ color: hex.strong }}>
                  {reduccion} %
                </span>
              </label>
              <input
                id="calc-reduccion"
                type="range"
                min={0}
                max={20}
                step={5}
                value={reduccion}
                onChange={(e) => setReduccion(Number(e.target.value))}
                className="h-11 w-full"
                style={{ accentColor: hex.strong }}
              />
              <div
                className="flex justify-between text-[11px] tabular-nums text-slate-500"
                aria-hidden="true"
              >
                <span>0 %</span>
                <span>5 %</span>
                <span>10 %</span>
                <span>15 %</span>
                <span>20 %</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{REGLAS.reduccion.texto}.</p>
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={ultralarga}
                onChange={(e) => setUltralarga(e.target.checked)}
                className="h-6 w-6 shrink-0 accent-slate-700"
              />
              La basal previa es glargina U–300 o degludec
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <Opciones
              etiqueta="¿La programación de la bomba funcionaba?"
              opciones={[
                { v: "si", t: "Sí: se traslada" },
                { v: "no", t: "No, o no hay referencia" },
              ]}
              valor={isciFunciona ? "si" : "no"}
              onChange={(v) => setIsciFunciona(v === "si")}
            />
            <p
              className="rounded-lg px-3 py-2 text-sm text-slate-800"
              style={{ background: "#f1f5f9" }}
            >
              {isciFunciona
                ? `${DESDE_ISCI.trasladar.charAt(0).toUpperCase()}${DESDE_ISCI.trasladar.slice(1)}.`
                : `${DESDE_ISCI.sinReferencia.charAt(0).toUpperCase()}${DESDE_ISCI.sinReferencia.slice(1)}. ${DESDE_ISCI.basalPlana}.`}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {!isciFunciona && (
                <Campo
                  id="calc-dtd"
                  etiqueta="DTD actual"
                  unidad="UI/día"
                  valor={dtdIsci}
                  onChange={setDtdIsci}
                  max={LIMITES.dosis}
                />
              )}
              <Campo
                id="calc-peso"
                etiqueta="Peso"
                unidad="kg"
                valor={peso}
                onChange={setPeso}
                max={LIMITES.peso}
              />
            </div>
          </div>
        )}
        {(origen === "mdi" || calculaIsci) && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Opciones
              etiqueta="Basal, % de la DTD"
              opciones={[40, 45, 50].map((v) => ({ v, t: `${v} %` }))}
              valor={basalPct}
              onChange={setBasalPct}
            />
            <Opciones
              etiqueta="Factor de sensibilidad"
              opciones={[
                { v: 1700 as const, t: "Regla del 1700" },
                { v: 1800 as const, t: "Regla del 1800" },
              ]}
              valor={regla}
              onChange={setRegla}
            />
            <Opciones
              etiqueta="Objetivo del calculador manual"
              opciones={OBJETIVOS_CALCULADOR.map((o) => ({ v: o.mgdl, t: `${o.mgdl}` }))}
              valor={objetivo}
              onChange={setObjetivo}
            />
          </div>
        )}
      </Paso>

      <Paso n={4} titulo="Parámetros de partida">
        {(origen === "mdi" || calculaIsci) && !r && (
          <p
            className="rounded-lg border border-dashed px-3 py-4 text-center text-sm text-slate-600"
            style={{ borderColor: "#cbd5e1" }}
          >
            <Calculator size={18} className="mx-auto mb-1 text-slate-400" aria-hidden="true" />
            {origen === "mdi"
              ? "Escribe la insulina basal y la rápida de un día."
              : "Escribe la DTD actual."}
          </p>
        )}
        {r && (
          <div aria-live="polite" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Cifra
              titulo="DTD de inicio"
              valor={coma(r.dtdInicial)}
              unidad="UI/día"
              cuenta={
                origen === "mdi"
                  ? `${coma(r.dtdPrevia)} UI − ${reduccion} %`
                  : `${coma(r.dtdPrevia)} UI (sin reducción)`
              }
              regla={origen === "mdi" ? "Reducción respecto a MDI" : "DTD de la bomba"}
              color={color}
            />
            <Cifra
              titulo="Tasa basal"
              valor={coma(r.basalHora)}
              unidad="UI/h"
              cuenta={`${basalPct} % = ${coma(r.basalDia)} UI/día ÷ 24 h`}
              regla="Basal plana; o individualizar según MCG"
              color={color}
            />
            <Cifra
              titulo="Ratio I/HC"
              valor={coma(r.ratio)}
              unidad="g por 1 UI"
              cuenta={`450 ÷ ${coma(r.dtdInicial)}`}
              regla="Regla del 450"
              color={color}
            />
            <Cifra
              titulo="Factor de sensibilidad"
              valor={String(r.factor)}
              unidad="mg/dl por 1 UI"
              cuenta={`${regla} ÷ ${coma(r.dtdInicial)}`}
              regla={`Regla del ${regla}`}
              color={color}
            />
          </div>
        )}
        {(origen === "mdi" || calculaIsci) && (
          <p className="text-xs text-slate-600">
            Objetivo del calculador de bolos manual: <strong>{objetivo} mg/dl</strong>.{" "}
            {REGLAS.objetivo.nota.replace(" (v. Tabla 1)", "")}.
          </p>
        )}
        {avisos.map((a) => (
          <p
            key={a}
            role="note"
            className="flex gap-2 rounded-lg border px-3 py-2 text-sm text-amber-900"
            style={{ borderColor: "#f3d38a", background: "#fffbeb" }}
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {a} Indicación: «{indicacionDe(sis!).replace(/\n/g, " · ")}».
            </span>
          </p>
        ))}
        {origen === "mdi" && ultralarga && (
          <p
            role="note"
            className="flex gap-2 rounded-lg border px-3 py-2 text-sm text-amber-900"
            style={{ borderColor: "#f3d38a", background: "#fffbeb" }}
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {REGLAS.solapamiento.texto}. {REGLAS.solapamiento.nota}.
            </span>
          </p>
        )}
      </Paso>

      <Paso n={5} titulo={sis !== undefined ? `Qué programar en ${CORTOS[sis]}` : "Qué programar"}>
        {sis === undefined ? (
          <p className="text-sm text-slate-600">Elige el sistema en el paso 2.</p>
        ) : (
          <div
            className="overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: "#e2e8f0", borderTopColor: h!.strong, borderTopWidth: 4 }}
          >
            <p
              className="px-3 py-2 text-sm font-semibold"
              style={{ background: h!.soft, color: h!.ink }}
            >
              {INICIALIZACION[sis].previo.charAt(0).toUpperCase() +
                INICIALIZACION[sis].previo.slice(1)}
              .
            </p>
            <Lista
              titulo="Núcleo común a todos los sistemas"
              claves={NUCLEO_COMUN.claves}
              sis={sis}
              valorDe={valorDe}
              color={h!.strong}
            />
            <Lista
              titulo={`Además, en ${CORTOS[sis]}`}
              claves={INICIALIZACION[sis].programar}
              sis={sis}
              valorDe={valorDe}
              color={h!.strong}
            />
          </div>
        )}
      </Paso>

      <div
        className="flex gap-2 rounded-xl border px-3 py-2.5 text-sm text-slate-800"
        style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
      >
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
        <span>
          <strong>Antes del inicio:</strong>{" "}
          {REGLAS.respaldo.texto.charAt(0).toLowerCase() + REGLAS.respaldo.texto.slice(1)}.
        </span>
      </div>
      <div className="space-y-1 text-xs text-slate-600">
        <p>{REGLAS.partida}</p>
        <p>
          Las cuentas aplican las reglas del capítulo a lo que se escribe; la pauta la decide el
          profesional. Nada de lo escrito se guarda ni se envía.
        </p>
      </div>
      <FuentePie fuentes={fuentes} />
    </div>
  );
}

function Lista({
  titulo,
  claves,
  sis,
  valorDe,
  color,
}: {
  titulo: string;
  claves: Clave[];
  sis: number;
  valorDe: (k: Clave, c: number) => ReactNode;
  color: string;
}) {
  return (
    <div className="border-t" style={{ borderColor: "#eceff3" }}>
      <div className="px-3 pt-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {titulo}
      </div>
      <ul className="divide-y" style={{ borderColor: "#eceff3" }}>
        {claves.map((k) => {
          const papel = k === "ia" || k === "objetivoAlg" ? null : papelEnAutomatico(k, sis);
          return (
            <li key={k} className="flex gap-2.5 px-3 py-2">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: color }}
              />
              <div className="min-w-0">
                <div className="text-sm text-slate-700">{NOMBRE_CLAVE[k]}</div>
                <div className="text-sm font-bold text-slate-900">{valorDe(k, sis)}</div>
                {papel && <div className="mt-0.5 text-xs text-slate-500">{papel}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
