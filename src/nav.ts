/* Destinos de la navegación: cada concepto tiene un único hogar y una única etiqueta. */
import {
  Activity,
  TrendingDown,
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
  FileText,
  FlaskConical,
  Footprints,
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
  ListOrdered,
  ListTree,
  type LucideIcon,
  MapPinned,
  MessageCircleQuestion,
  Puzzle,
  Route,
  ScanLine,
  Search,
  SlidersHorizontal,
  Table2,
  Target,
  Telescope,
  TrendingUp,
  Unplug,
  Workflow,
} from "lucide-react";
import { href } from "./rutas";
import type { DiagramaId } from "./contenido/diagramas";
import { retirado } from "./edicion";

export interface Destino {
  id: string;
  etiqueta: string;
  corto?: string;
  href: string;
  icono: LucideIcon;
  /* Categoría (color por función; tokens.CATEGORIA_HEX). */
  cat: "leer" | "consultar" | "confiar" | "aprender" | "pacientes";
  /* De dónde sale (tabla, figura o apartado): lo único que acompaña al nombre en las tarjetas. */
  fuente?: string;
}

export const DESTINOS: Destino[] = [
  {
    id: "visual",
    etiqueta: "Figuras y diagramas",
    corto: "Diagramas",
    href: href("visual"),
    icono: Workflow,
    cat: "consultar",
  },
  {
    id: "figuras",
    etiqueta: "Figuras",
    corto: "Figuras",
    href: href("visual", "figuras"),
    icono: Images,
    cat: "consultar",
  },
  {
    id: "sistemas",
    etiqueta: "Sistemas AID",
    href: href("sistemas"),
    icono: Cpu,
    cat: "consultar",
    fuente: "Tablas 1, 3 y 4",
  },
  {
    id: "elegir",
    etiqueta: "Elección del sistema",
    corto: "Criterios",
    href: href("sistemas", "elegir"),
    icono: Handshake,
    cat: "consultar",
    fuente: "Apartado 6, Figura 2 y Tabla 1",
  },
  {
    id: "comparar",
    etiqueta: "Comparar los cuatro",
    corto: "Comparar",
    href: href("sistemas", "todos", "esencial"),
    icono: Columns3,
    cat: "consultar",
    fuente: "Tabla 1",
  },
  {
    id: "parametros",
    etiqueta: "Comparar los parámetros",
    corto: "Parámetros",
    href: href("sistemas", "todos", "parametros"),
    icono: SlidersHorizontal,
    cat: "consultar",
    fuente: "Tabla 3",
  },
  {
    id: "situacion",
    etiqueta: "Situaciones",
    corto: "Situación",
    href: href("consultar", "situacion"),
    icono: Route,
    cat: "consultar",
    fuente: "Tablas 4 y 6 · apartado 10",
  },
  {
    id: "inicio",
    etiqueta: "Iniciación del sistema",
    corto: "Iniciar",
    href: href("consultar", "inicio"),
    icono: CirclePlay,
    cat: "consultar",
    fuente: "Apartado 8 y Tabla 2",
  },
  {
    id: "descarga",
    etiqueta: "Interpretación de la descarga",
    corto: "Descarga",
    href: href("consultar", "descarga", "1"),
    icono: ListChecks,
    cat: "consultar",
    fuente: "Tabla 5",
  },
  {
    id: "hipoglucemia",
    etiqueta: "Hipoglucemia en asa cerrada",
    corto: "Hipoglucemia",
    href: href("visual", "hipoglucemia"),
    icono: TrendingDown,
    cat: "consultar",
    fuente: "Apartado 7",
  },
  {
    id: "interrupcion",
    etiqueta: "Interrupción del sistema",
    corto: "Interrupción",
    href: href("consultar", "interrupcion"),
    icono: Clock3,
    cat: "consultar",
    fuente: "Apartado 7",
  },
  {
    id: "capitulo",
    etiqueta: "Índice del capítulo",
    corto: "Capítulo",
    href: href("capitulo"),
    icono: ListTree,
    cat: "leer",
  },
  {
    id: "tablas",
    etiqueta: "Tablas",
    href: href("consultar", "tablas"),
    icono: Table2,
    cat: "consultar",
  },
  {
    id: "figura-3",
    etiqueta: "Hiperglucemia y cetonemia",
    corto: "Cetonemia",
    href: href("consultar", "figura-3"),
    icono: Droplets,
    cat: "consultar",
    fuente: "Figura 3",
  },
  {
    id: "infografia",
    etiqueta: "Infografía",
    href: href("consultar", "infografia"),
    icono: LayoutGrid,
    cat: "consultar",
  },
  {
    id: "buscar",
    etiqueta: "Buscar",
    href: href("buscar"),
    icono: Search,
    cat: "consultar",
  },
  {
    id: "preguntas",
    etiqueta: "Preguntas frecuentes",
    corto: "Preguntas",
    href: href("preguntas"),
    icono: MessageCircleQuestion,
    cat: "consultar",
  },
  // El PDF publicado de «Información para pacientes» (en el precache: también sin conexión).
  {
    id: "pdf-pacientes",
    etiqueta: "Información para pacientes",
    corto: "PDF",
    href: "pdf/manual-seen-aid-pacientes.pdf",
    icono: FileText,
    cat: "pacientes",
  },
  {
    id: "pacientes",
    etiqueta: "Material para el paciente",
    corto: "Pacientes",
    href: href("pacientes"),
    icono: HeartHandshake,
    cat: "pacientes",
    fuente: "Hojas para imprimir",
  },
  {
    id: "bibliografia",
    etiqueta: "Bibliografía",
    href: href("bibliografia"),
    icono: Library,
    cat: "confiar",
  },
  {
    id: "sobre",
    etiqueta: "Sobre este complemento",
    corto: "Sobre",
    href: href("sobre"),
    icono: Info,
    cat: "confiar",
  },
  {
    id: "casos",
    etiqueta: "Casos guiados",
    corto: "Casos",
    href: href("casos"),
    icono: ClipboardCheck,
    cat: "aprender",
  },
  {
    id: "test",
    // En el menú, corto; el título de la pantalla dice «complementaria basada en el capítulo».
    etiqueta: "Autoevaluación",
    corto: "Test",
    href: href("test"),
    icono: GraduationCap,
    cat: "aprender",
  },
  {
    id: "repaso",
    etiqueta: "Tarjetas de repaso",
    corto: "Repaso",
    href: href("repaso"),
    icono: Layers,
    cat: "aprender",
  },
];

/* El mapa de consulta (portada, 0.70.0): cuatro bloques, cada uno con la pregunta que responde.
   `etiquetas` cambia el nombre de una entrada solo aquí («Todas las situaciones»). */
export const MAPA_CONSULTA: {
  id: string;
  titulo: string;
  ids: string[];
  etiquetas?: Record<string, string>;
  ancho?: boolean;
}[] = [
  { id: "sistemas", titulo: "Sistemas y ajuste de parámetros", ids: ["comparar"] },
  {
    id: "situaciones",
    titulo: "Situaciones clínicas",
    // 0.72.2: las urgencias van arriba en la portada; aquí, el acceso a todas.
    ids: ["situacion"],
    etiquetas: { situacion: "Todas las situaciones" },
  },
  { id: "en-consulta", titulo: "Iniciación y seguimiento", ids: ["inicio", "descarga"] },
  {
    id: "pacientes",
    titulo: "Material para el paciente",
    ids: ["pdf-pacientes", "pacientes"],
    etiquetas: { pacientes: "Plan de seguridad y hojas informativas" },
  },
];

/* Navegación global: cuatro áreas en la barra inferior (Inicio · Leer · Paciente · Buscar).
   Cada sección de la ruta pertenece a una, y el destino activo sale de aquí. «Aprender» y «mas»
   son grupos del menú sin botón propio. */
export type Area = "inicio" | "consultar" | "leer" | "aprender" | "pacientes" | "buscar" | "mas";
const AREA_DE_SECCION: Record<string, Area> = {
  "": "inicio",
  consultar: "consultar",
  sistemas: "consultar",
  visual: "leer",
  capitulo: "leer",
  repaso: "leer",
  test: "leer",
  casos: "leer",
  buscar: "buscar",
  // Hogar de las preguntas frecuentes: «Leer y comprender» (V54-07), como en el lateral.
  preguntas: "leer",
  mas: "mas",
  pacientes: "pacientes",
  bibliografia: "leer",
  cambios: "mas",
  sobre: "mas",
};
export const areaDe = (seccion: string): Area => AREA_DE_SECCION[seccion] ?? "inicio";

/* Menú (barra lateral de escritorio y menú del móvil): las dos formas de uso y los recursos
   (edición editorial, A09). El índice de los apartados solo se despliega dentro de la lectura. */
export const MENU: { area: Area; titulo: string; ids: string[] }[] = [
  {
    area: "inicio",
    titulo: "Consultar",
    ids: [
      "sistemas",
      "figura-3",
      "hipoglucemia",
      "interrupcion",
      "situacion",
      "inicio",
      "descarga",
    ],
  },
  {
    area: "leer",
    titulo: "Leer y comprender",
    ids: ["capitulo", "tablas", "visual", "preguntas", "casos", "repaso", "test"].filter(
      (id) => !retirado(id),
    ),
  },
  { area: "pacientes", titulo: "Recursos", ids: ["pacientes", "bibliografia", "sobre"] },
];

/* ¿Está activo este destino en esta ruta? (un único criterio para lateral, menú y hubs).
   Comparar (Tabla 1) y Parámetros (Tabla 3) son vistas de Tablas: cada una se marca con su
   tabla, y «Tablas» con las demás. */
export function destinoActivo(
  id: string,
  ruta: { seccion: string; sub?: string; detalle?: string },
) {
  if (id === "capitulo") return ruta.seccion === "capitulo";
  // Figuras (#/visual/figuras) y Diagramas (#/visual y #/visual/<diagrama>) comparten sección.
  if (id === "figuras") return ruta.seccion === "visual" && ruta.sub === "figuras";
  // «Figuras y diagramas»: una sola entrada (0.70.0); la hipoglucemia es de Consultar.
  if (id === "visual") return ruta.seccion === "visual" && ruta.sub !== "hipoglucemia";
  const d = DESTINOS.find((x) => x.id === id);
  if (!d) return false;
  const [seccion, sub] = d.href.replace(/^#\//, "").split("/");
  if (seccion !== ruta.seccion) return false;
  return sub ? ruta.sub === sub : true;
}

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
