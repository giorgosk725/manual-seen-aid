/* Tipos de la ampliación del autor (fuera del capítulo). */
export type SistemaId = "mm780" | "ciq" | "camaps" | "op5";
export type NivelParametro = "directo" | "manual" | "fijo" | "indirecto";

export interface ParametroSistema {
  name: string;
  level: NivelParametro;
  note: string;
  modes?: { name: string; desc: string }[];
}

export interface Sistema {
  id: SistemaId;
  name: string;
  short: string;
  algo: string;
  verified: string;
  sources: string[];
  tags: { pedsAge: string; movil: string; sintubo: string };
  detail: Record<string, string>;
  params: ParametroSistema[];
  takeaway: string;
}

export interface InfusionSet {
  name: string;
  material: "Teflón" | "Acero";
  angle: string;
  cannula: number[];
  tubing: number[];
  insertion: string;
  change: number;
}

export interface InsulinaRapida {
  id: string;
  name: string;
}
export interface CompatInsulina {
  status: "ok" | "evitar" | "verificar";
  note?: string;
}

export interface Criterio {
  id: string;
  label: string;
  info: string;
  src: string[];
  s: Record<string, { v: "yes" | "partial" | "no"; t: string }>;
}

export interface FichaFila {
  k: string;
  f?: string;
  crit?: string;
}
export interface FichaGrupo {
  g: string;
  rows: FichaFila[];
}

export interface Fuente {
  label: string;
  kind: string;
  ref?: string;
  url?: string;
  date?: string;
  checked: string;
}
