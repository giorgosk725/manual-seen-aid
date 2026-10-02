/* Destinos de la navegación: cada concepto tiene un único hogar y una única etiqueta. */
import {
  BookOpen,
  Columns3,
  Droplets,
  FlaskConical,
  GraduationCap,
  History,
  Info,
  LayoutGrid,
  Library,
  ListTree,
  Search,
  SpellCheck,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { href } from "./rutas";

export interface Destino {
  id: string;
  etiqueta: string;
  corto?: string;
  href: string;
  icono: LucideIcon;
  /* Categoría (color por función; tokens.CATEGORIA_HEX). */
  cat: "leer" | "consultar" | "confiar" | "aprender";
  descripcion: string;
}

export const DESTINOS: Destino[] = [
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

export const ICONO_CAPITULO = BookOpen;
export const ICONO_CONSULTAR = Columns3;
export const ICONO_EVIDENCIA = FlaskConical;

export const destino = (id: string) => DESTINOS.find((d) => d.id === id)!;
