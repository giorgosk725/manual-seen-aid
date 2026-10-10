/* Destinos de la navegación: cada concepto tiene un único hogar y una única etiqueta. */
import {
  Activity,
  Baby,
  BookOpen,
  CalendarClock,
  CirclePlay,
  ClipboardCheck,
  Clock3,
  CodeXml,
  Columns3,
  Cpu,
  Droplets,
  Footprints,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Hospital,
  Images,
  Info,
  Layers,
  LayoutGrid,
  Library,
  ListChecks,
  MessageCircleQuestion,
  ListOrdered,
  ListTree,
  MapPinned,
  Puzzle,
  Route,
  ScanLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Table2,
  Target,
  Telescope,
  TrendingUp,
  Unplug,
  type LucideIcon,
} from "lucide-react";
import { href } from "./rutas";
import type { DiagramaId } from "./contenido/diagramas";

export interface Destino {
  id: string;
  etiqueta: string;
  corto?: string;
  href: string;
  icono: LucideIcon;
  /* Categoría (color por función; tokens.CATEGORIA_HEX). */
  cat: "leer" | "consultar" | "confiar" | "aprender" | "pacientes";
  descripcion: string;
  /* De dónde sale (tabla, figura o apartado): lo único que acompaña al nombre en las tarjetas. */
  fuente?: string;
}

export const DESTINOS: Destino[] = [
  {
    id: "visual",
    etiqueta: "Figuras y diagramas",
    corto: "Visual",
    href: href("visual"),
    icono: Images,
    cat: "consultar",
    descripcion:
      "Figuras, tablas y diagramas: los diagramas a partir del texto, las figuras con zoom, las tablas y los sistemas.",
  },
  {
    id: "sistemas",
    etiqueta: "Sistemas",
    href: href("sistemas"),
    icono: Cpu,
    cat: "consultar",
    descripcion:
      "Los cuatro sistemas con foto: lo que dice el capítulo de cada uno y su ficha técnica ampliada.",
    fuente: "Tablas 1, 3 y 4 · ficha técnica",
  },
  {
    id: "comparar",
    etiqueta: "Comparar sistemas",
    corto: "Comparar",
    href: href("sistemas", "todos", "esencial"),
    icono: Columns3,
    cat: "consultar",
    descripcion:
      "La Tabla 1 con los sistemas que elijas: cada característica con los sistemas uno junto a otro.",
    fuente: "Tabla 1",
  },
  {
    id: "parametros",
    etiqueta: "Parámetros por sistema",
    corto: "Parámetros",
    href: href("sistemas", "todos", "parametros"),
    icono: SlidersHorizontal,
    cat: "consultar",
    descripcion:
      "Cómo se ajustan los parámetros clásicos en cada sistema (Tabla 3) y cuáles son configurables en automático.",
    fuente: "Tabla 3",
  },
  {
    id: "situacion",
    etiqueta: "Situaciones",
    corto: "Situación",
    href: href("consultar", "situacion"),
    icono: Route,
    cat: "consultar",
    descripcion:
      "Elige la situación (ejercicio, enfermedad, exploración…) y el sistema: la conducta que da el capítulo.",
    fuente: "Tablas 4 y 6 · apartado 10",
  },
  {
    id: "inicio",
    etiqueta: "Iniciar un sistema",
    corto: "Iniciar",
    href: href("consultar", "inicio"),
    icono: CirclePlay,
    cat: "consultar",
    descripcion:
      "El apartado 8 en sus cuatro fases, sistema a sistema, y la hoja de comprobación del inicio para imprimir.",
    fuente: "Apartado 8 y Tabla 2",
  },
  {
    id: "descarga",
    etiqueta: "Revisar la descarga",
    corto: "Descarga",
    href: href("consultar", "descarga", "1"),
    icono: ListChecks,
    cat: "consultar",
    descripcion: "La Tabla 5 en ocho pasos, con el patrón del capítulo que corresponde a cada uno.",
    fuente: "Tabla 5",
  },
  {
    id: "interrupcion",
    etiqueta: "Interrupción del sistema",
    corto: "Interrupción",
    href: href("consultar", "interrupcion"),
    icono: Clock3,
    cat: "consultar",
    descripcion: "Cuánto va a durar la interrupción y qué dice el capítulo para ese caso.",
    fuente: "Apartado 7",
  },
  {
    id: "capitulo",
    etiqueta: "Índice del capítulo",
    corto: "Capítulo",
    href: href("capitulo"),
    icono: ListTree,
    cat: "leer",
    descripcion: "Los 13 apartados del capítulo, cada uno en una pantalla con su texto íntegro.",
  },
  {
    id: "tablas",
    etiqueta: "Tablas",
    href: href("consultar", "tablas"),
    icono: Table2,
    cat: "consultar",
    descripcion: "Las seis tablas del capítulo; las de sistemas se filtran por sistema.",
  },
  {
    id: "figura-3",
    etiqueta: "Cetonemia paso a paso",
    corto: "Cetonemia",
    href: href("consultar", "figura-3"),
    icono: Droplets,
    cat: "consultar",
    descripcion:
      "La Figura 3 como recorrido: elige el tramo de β-OHB para ver su rama, con las notas comunes de la figura.",
    fuente: "Figura 3",
  },
  {
    id: "infografia",
    etiqueta: "Infografía",
    href: href("consultar", "infografia"),
    icono: LayoutGrid,
    cat: "consultar",
    descripcion: "El mapa del capítulo en cuatro bloques, con enlace a cada apartado.",
  },
  {
    id: "buscar",
    etiqueta: "Buscar",
    href: href("buscar"),
    icono: Search,
    cat: "consultar",
    descripcion:
      "En el texto del capítulo por palabras y, con conexión, también por el sentido; aparte, lo que no es del capítulo.",
  },
  {
    id: "preguntas",
    etiqueta: "Preguntas frecuentes",
    corto: "Preguntas",
    href: href("preguntas"),
    icono: MessageCircleQuestion,
    cat: "consultar",
    descripcion:
      "Las preguntas revisadas, por temas, con los pasajes del capítulo que las responden: el camino cuando la búsqueda libre no da nada.",
  },
  {
    id: "pacientes",
    etiqueta: "Para el paciente",
    corto: "Pacientes",
    href: href("pacientes"),
    icono: HeartHandshake,
    cat: "pacientes",
    descripcion:
      "Hojas para entregar al paciente: la información completa, hojas breves por situación y el plan de seguridad de cada sistema; con letra grande.",
    fuente: "Hojas para imprimir",
  },
  {
    id: "plan",
    etiqueta: "Plan de seguridad por sistema",
    corto: "Plan",
    href: href("pacientes", "plan"),
    icono: ShieldCheck,
    cat: "pacientes",
    descripcion:
      "La hoja del plan de seguridad de cada sistema, hecha solo con texto del capítulo, para rellenar a mano.",
    fuente: "Figura 3 y Tabla 4",
  },
  {
    id: "bibliografia",
    etiqueta: "Bibliografía",
    href: href("bibliografia"),
    icono: Library,
    cat: "confiar",
    descripcion: "Las diez referencias del capítulo, con su enlace.",
  },
  {
    id: "sobre",
    etiqueta: "Sobre esta app",
    corto: "Sobre",
    href: href("sobre"),
    icono: Info,
    cat: "confiar",
    descripcion: "Qué es, de dónde sale el texto, datos, lo pendiente y el historial de versiones.",
  },
  {
    id: "casos",
    etiqueta: "Casos guiados",
    corto: "Casos",
    href: href("casos"),
    icono: ClipboardCheck,
    cat: "aprender",
    descripcion:
      "Casos para practicar con el texto del capítulo, paso a paso: cada respuesta se apoya en frases literales con su página.",
  },
  {
    id: "test",
    etiqueta: "Autoevaluación",
    corto: "Test",
    href: href("test"),
    icono: GraduationCap,
    cat: "aprender",
    descripcion: "Test con respuesta razonada y la página del capítulo que la justifica.",
  },
  {
    id: "repaso",
    etiqueta: "Tarjetas de repaso",
    corto: "Repaso",
    href: href("repaso"),
    icono: Layers,
    cat: "aprender",
    descripcion:
      "Las cifras y las siglas del capítulo como tarjetas, con su página; repaso espaciado guardado en este dispositivo.",
  },
];

/* El mapa de consulta (portada): cuatro bloques, cada uno con la pregunta que responde. */
export const MAPA_CONSULTA: { id: string; titulo: string; ids: string[] }[] = [
  { id: "sistemas", titulo: "¿Qué sistema?", ids: ["sistemas", "comparar", "parametros"] },
  {
    id: "situaciones",
    titulo: "¿Qué hago en esta situación?",
    ids: ["situacion", "figura-3", "interrupcion"],
  },
  { id: "en-consulta", titulo: "En la consulta", ids: ["inicio", "descarga"] },
  { id: "pacientes", titulo: "Para el paciente", ids: ["pacientes", "plan"] },
];

/* Navegación global: cuatro áreas en la barra inferior (Inicio · Leer · Paciente · Buscar).
   Cada sección de la ruta pertenece a una, y el destino activo sale de aquí. «Aprender» y «mas»
   son grupos del menú sin botón propio. */
export type Area = "inicio" | "leer" | "aprender" | "pacientes" | "buscar" | "mas";
const AREA_DE_SECCION: Record<string, Area> = {
  "": "inicio",
  consultar: "inicio",
  sistemas: "inicio",
  visual: "leer",
  capitulo: "leer",
  repaso: "leer",
  test: "leer",
  casos: "leer",
  buscar: "buscar",
  preguntas: "buscar",
  mas: "mas",
  pacientes: "pacientes",
  bibliografia: "leer",
  cambios: "mas",
  sobre: "mas",
};
export const areaDe = (seccion: string): Area => AREA_DE_SECCION[seccion] ?? "inicio";

/* Menú (barra lateral de escritorio y menú del móvil): tres grupos, el esqueleto del mapa de
   consulta. El índice de los apartados solo se despliega dentro de la lectura. */
export const MENU: { area: Area; titulo: string; ids: string[] }[] = [
  {
    area: "inicio",
    titulo: "Consultar",
    ids: ["sistemas", "situacion", "inicio", "descarga", "pacientes"],
  },
  { area: "leer", titulo: "Leer capítulo", ids: ["capitulo", "tablas", "visual", "bibliografia"] },
  { area: "aprender", titulo: "Aprender", ids: ["preguntas", "casos", "repaso", "test"] },
];

/* ¿Está activo este destino en esta ruta? (un único criterio para lateral, menú y hubs).
   Comparar (Tabla 1) y Parámetros (Tabla 3) son vistas de Tablas: cada una se marca con su
   tabla, y «Tablas» con las demás. */
export function destinoActivo(
  id: string,
  ruta: { seccion: string; sub?: string; detalle?: string },
) {
  if (id === "capitulo") return ruta.seccion === "capitulo";
  const d = DESTINOS.find((x) => x.id === id);
  if (!d) return false;
  const [seccion, sub] = d.href.replace(/^#\//, "").split("/");
  if (seccion !== ruta.seccion) return false;
  return sub ? ruta.sub === sub : true;
}

/* Entrada a las tablas por la pregunta que responde cada una (texto de la app; el título y
   el contenido son los del capítulo). Las tres por sistema se parecen: así se distinguen. */
export const PREGUNTA_TABLA: Record<"T1" | "T2" | "T3" | "T4" | "T5" | "T6", string> = {
  T1: "¿Qué características diferencian a los sistemas?",
  T2: "¿Cómo se pasa de MDI a un sistema?",
  T3: "¿Cómo se ajusta cada parámetro en cada sistema?",
  T4: "¿Qué herramienta del sistema usar en cada situación?",
  T5: "¿Cómo se revisa la descarga, paso a paso?",
  T6: "¿Qué hacer con el sistema ante una exploración o una cirugía?",
};

export const ICONO_CAPITULO = BookOpen;
/* Icono de cada apartado (índice en mosaico de la portada y cabecera del apartado). */
export const ICONO_APARTADO: Record<string, LucideIcon> = {
  "01-introduccion": BookOpen,
  "02-componentes": Puzzle,
  "03-algoritmos": GitBranch,
  "04-sistemas": MapPinned,
  "05-resultados": TrendingUp,
  "06-indicaciones": ClipboardCheck,
  "07-educacion": GraduationCap,
  "08-iniciacion": CirclePlay,
  "09-descarga": Activity,
  "10-situaciones": Route,
  "11-diy": CodeXml,
  "12-horizonte": Telescope,
  "13-infografia": LayoutGrid,
};
export const ICONO_CONSULTAR = Columns3;
export const ICONO_EVIDENCIA = FlaskConical;

export const destino = (id: string) => DESTINOS.find((d) => d.id === id)!;

/* Icono de cada diagrama (galería, portada, tira de recursos de cada apartado). */
export const ICONO_DIAGRAMA: Record<DiagramaId, LucideIcon> = {
  "objetivos-mcg": Target,
  cetonemia: Droplets,
  ejercicio: Footprints,
  seguimiento: CalendarClock,
  algoritmos: Cpu,
  hipoglucemia: Activity,
  transicion: ListOrdered,
  "gestacion-sistemas": Baby,
  hospital: Hospital,
  exploraciones: ScanLine,
  eleccion: Handshake,
  interrupcion: Unplug,
};
