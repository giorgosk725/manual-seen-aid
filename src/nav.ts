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
  History,
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
  SlidersHorizontal,
  SpellCheck,
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
  },
  {
    id: "comparar",
    etiqueta: "Comparar sistemas",
    corto: "Comparar",
    href: href("consultar", "tablas", "T1"),
    icono: Columns3,
    cat: "consultar",
    descripcion:
      "La Tabla 1 con los sistemas que elijas: cada característica con los sistemas uno junto a otro.",
  },
  {
    id: "parametros",
    etiqueta: "Parámetros por sistema",
    corto: "Parámetros",
    href: href("consultar", "tablas", "T3"),
    icono: SlidersHorizontal,
    cat: "consultar",
    descripcion:
      "Cómo se ajustan los parámetros clásicos en cada sistema (Tabla 3) y cuáles son configurables en automático.",
  },
  {
    id: "situacion",
    etiqueta: "Situación y sistema",
    corto: "Situación",
    href: href("consultar", "situacion"),
    icono: Route,
    cat: "consultar",
    descripcion:
      "Elige la situación (ejercicio, enfermedad, exploración…) y el sistema: la conducta que da el capítulo.",
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
  },
  {
    id: "descarga",
    etiqueta: "Revisar la descarga",
    corto: "Descarga",
    href: href("consultar", "descarga", "1"),
    icono: ListChecks,
    cat: "consultar",
    descripcion: "La Tabla 5 en ocho pasos, con el patrón del capítulo que corresponde a cada uno.",
  },
  {
    id: "interrupcion",
    etiqueta: "Interrupción del sistema",
    corto: "Interrupción",
    href: href("consultar", "interrupcion"),
    icono: Clock3,
    cat: "consultar",
    descripcion: "Cuánto va a durar la interrupción y qué dice el capítulo para ese caso.",
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
    id: "glosario",
    etiqueta: "Glosario de siglas",
    corto: "Glosario",
    href: href("consultar", "glosario"),
    icono: SpellCheck,
    cat: "consultar",
    descripcion: "Las siglas del capítulo, con el desarrollo que da el propio capítulo.",
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
      "Información para pacientes y resumen, para imprimir en una cara o compartir con QR, y el plan de seguridad de cada sistema.",
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
    id: "cambios",
    etiqueta: "Qué ha cambiado",
    href: href("cambios"),
    icono: History,
    cat: "confiar",
    descripcion: "Fecha de cada revisión del capítulo y de la app, y lo pendiente.",
  },
  {
    id: "sobre",
    etiqueta: "Sobre esta versión",
    corto: "Sobre",
    href: href("sobre"),
    icono: Info,
    cat: "confiar",
    descripcion: "Qué es, de dónde sale el texto, alcance y datos, y la guía rápida.",
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

/* «Consultar», agrupado por tarea (hub de Consultar). */
export const GRUPOS_CONSULTAR: { id: string; titulo: string; ids: string[] }[] = [
  { id: "sistemas", titulo: "Sistemas", ids: ["sistemas", "comparar", "parametros"] },
  { id: "seguimiento", titulo: "Inicio y seguimiento", ids: ["inicio", "descarga"] },
  { id: "situaciones", titulo: "Situaciones", ids: ["figura-3", "situacion", "interrupcion"] },
  {
    id: "recursos",
    titulo: "Tablas, figuras, glosario y preguntas",
    ids: ["tablas", "visual", "glosario", "preguntas"],
  },
];

/* Navegación global: cinco áreas. Cada sección de la ruta pertenece a una sola, y el destino
   activo de la barra inferior y de la lateral sale de aquí (no de comprobaciones sueltas). */
export type Area = "inicio" | "consultar" | "leer" | "buscar" | "mas";
const AREA_DE_SECCION: Record<string, Area> = {
  "": "inicio",
  consultar: "consultar",
  sistemas: "consultar",
  visual: "consultar",
  capitulo: "leer",
  repaso: "leer",
  test: "leer",
  casos: "leer",
  buscar: "buscar",
  preguntas: "buscar",
  mas: "mas",
  pacientes: "mas",
  bibliografia: "mas",
  cambios: "mas",
  sobre: "mas",
};
export const areaDe = (seccion: string): Area => AREA_DE_SECCION[seccion] ?? "inicio";

/* Menú (barra lateral de escritorio y menú del móvil): tres grupos breves. El índice de los
   apartados solo se despliega dentro de la lectura. */
export const MENU: { area: Area; titulo: string; ids: string[] }[] = [
  {
    area: "consultar",
    titulo: "Consultar",
    ids: [
      "sistemas",
      "comparar",
      "inicio",
      "descarga",
      "figura-3",
      "situacion",
      "interrupcion",
      "tablas",
      "visual",
    ],
  },
  { area: "leer", titulo: "Leer y comprender", ids: ["capitulo", "casos", "repaso", "test"] },
  {
    area: "mas",
    titulo: "Más recursos",
    ids: ["pacientes", "glosario", "bibliografia", "cambios", "sobre"],
  },
];

/* ¿Está activo este destino en esta ruta? (un único criterio para lateral, menú y hubs).
   Comparar (Tabla 1) y Parámetros (Tabla 3) son vistas de Tablas: cada una se marca con su
   tabla, y «Tablas» con las demás. */
export function destinoActivo(
  id: string,
  ruta: { seccion: string; sub?: string; detalle?: string },
) {
  const tabla = ruta.seccion === "consultar" && ruta.sub === "tablas" ? (ruta.detalle ?? "") : null;
  if (id === "comparar") return tabla?.startsWith("T1") ?? false;
  if (id === "parametros") return tabla?.startsWith("T3") ?? false;
  if (id === "tablas") return tabla != null && !/^T[13]/.test(tabla);
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
