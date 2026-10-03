/* Destinos de la navegación: cada concepto tiene un único hogar y una única etiqueta. */
import {
  Activity,
  Baby,
  BookOpen,
  CalendarClock,
  Clock3,
  Columns3,
  Cpu,
  Droplets,
  Footprints,
  FlaskConical,
  GraduationCap,
  Handshake,
  HeartHandshake,
  History,
  Hospital,
  Images,
  Info,
  LayoutGrid,
  Library,
  ListChecks,
  ListOrdered,
  ListTree,
  Route,
  ScanLine,
  Search,
  SpellCheck,
  Table2,
  Target,
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
      "Todo lo visual en un sitio: diagramas a partir del texto, figuras con zoom, tablas y sistemas.",
  },
  {
    id: "sistemas",
    etiqueta: "Sistemas",
    href: href("sistemas"),
    icono: Cpu,
    cat: "consultar",
    descripcion:
      "Los cuatro sistemas con foto: lo que dice el capítulo de cada uno y la ficha ampliada del autor.",
  },
  {
    id: "situacion",
    etiqueta: "Situación y sistema",
    corto: "Situación",
    href: href("consultar", "situacion"),
    icono: Route,
    cat: "consultar",
    descripcion:
      "Elige la situación (ejercicio, enfermedad, exploración…) y el sistema: la conducta exacta.",
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
    href: href("consultar", "tablas", "T1"),
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
    descripcion: "La Figura 3 como recorrido: elige el tramo de β-OHB y ve solo tu rama.",
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
    descripcion: "Búsqueda instantánea sobre el texto literal (sin IA generativa).",
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
    descripcion: "Las diez referencias del capítulo, con el DOI enlazado.",
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
    descripcion: "Alcance, fuente única, correcciones aplicadas y descargo educativo.",
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
];

/* «Consultar», agrupado (barra lateral, hub de Consultar y «Más»). */
export const GRUPOS_CONSULTAR: { id: string; titulo: string; ids: string[] }[] = [
  { id: "sistemas", titulo: "Sistemas", ids: ["sistemas"] },
  {
    id: "situaciones",
    titulo: "Situaciones y recorridos",
    ids: ["situacion", "figura-3", "descarga", "interrupcion"],
  },
  { id: "figuras", titulo: "Figuras y tablas", ids: ["visual", "tablas", "infografia"] },
  { id: "glosario", titulo: "Glosario", ids: ["glosario"] },
];

export const ICONO_CAPITULO = BookOpen;
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
