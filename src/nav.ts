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
  descripcion: string;
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
    descripcion: "Diagramas hechos con el texto del capítulo, con su página.",
  },
  {
    id: "figuras",
    etiqueta: "Figuras",
    corto: "Figuras",
    href: href("visual", "figuras"),
    icono: Images,
    cat: "consultar",
    descripcion: "Las figuras originales del capítulo y la infografía, con zoom.",
  },
  {
    id: "sistemas",
    etiqueta: "Sistemas AID",
    href: href("sistemas"),
    icono: Cpu,
    cat: "consultar",
    descripcion:
      "Los cuatro sistemas con foto: lo que dice el capítulo de cada uno (Tablas 1, 3 y 4).",
    fuente: "Tablas 1, 3 y 4",
  },
  {
    id: "elegir",
    etiqueta: "Elección del sistema",
    corto: "Criterios",
    href: href("sistemas", "elegir"),
    icono: Handshake,
    cat: "consultar",
    descripcion:
      "Los factores de la elección (apartado 6 y Figura 2) y las celdas de indicación, gestación, formato, sensores y algoritmo de la Tabla 1.",
    fuente: "Apartado 6, Figura 2 y Tabla 1",
  },
  {
    id: "comparar",
    etiqueta: "Comparar los cuatro",
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
    etiqueta: "Comparar los parámetros",
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
    etiqueta: "Iniciación del sistema",
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
    etiqueta: "Interpretación de la descarga",
    corto: "Descarga",
    href: href("consultar", "descarga", "1"),
    icono: ListChecks,
    cat: "consultar",
    descripcion: "La Tabla 5 en ocho pasos, con el patrón del capítulo que corresponde a cada uno.",
    fuente: "Tabla 5",
  },
  {
    id: "hipoglucemia",
    etiqueta: "Hipoglucemia en asa cerrada",
    corto: "Hipoglucemia",
    href: href("visual", "hipoglucemia"),
    icono: TrendingDown,
    cat: "consultar",
    descripcion: "Cómo se trata la hipoglucemia leve en asa cerrada según el plan de seguridad.",
    fuente: "Apartado 7",
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
    etiqueta: "Hiperglucemia y cetonemia",
    corto: "Cetonemia",
    href: href("consultar", "figura-3"),
    icono: Droplets,
    cat: "consultar",
    descripcion:
      "La Figura 3: la urgencia y los signos de gravedad delante; cada rama se abre a mano, con las notas comunes de la figura.",
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
  // El PDF publicado de «Información para pacientes» (en el precache: también sin conexión).
  {
    id: "pdf-pacientes",
    etiqueta: "Información para pacientes",
    corto: "PDF",
    href: "pdf/manual-seen-aid-pacientes.pdf",
    icono: FileText,
    cat: "pacientes",
    descripcion: "El PDF de la Información para pacientes publicado por el Manual SEEN.",
  },
  {
    id: "pacientes",
    etiqueta: "Material para el paciente",
    corto: "Pacientes",
    href: href("pacientes"),
    icono: HeartHandshake,
    cat: "pacientes",
    descripcion:
      "La Información para pacientes publicada por el Manual SEEN y material complementario: hojas breves y plantillas del plan de seguridad, con letra grande.",
    fuente: "Hojas para imprimir",
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
    etiqueta: "Sobre este complemento",
    corto: "Sobre",
    href: href("sobre"),
    icono: Info,
    cat: "confiar",
    descripcion:
      "Fuente, alcance, capa docente, estado de evaluación, qué se transmite y guarda, y uso sin conexión.",
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
    // En el menú, corto; el título de la pantalla dice «complementaria basada en el capítulo».
    etiqueta: "Autoevaluación",
    corto: "Test",
    href: href("test"),
    icono: GraduationCap,
    cat: "aprender",
    descripcion:
      "Preguntas de repaso basadas en el capítulo, con la explicación y la página que la justifica.",
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
    ids: ["figura-3", "hipoglucemia", "interrupcion", "situacion"],
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
