/* Diagramas que no van en esta edición (0.70.0, simplificación): redibujaban una tabla o una
   figura que ya está en la app (Elección compartida = Figura 2, Transición desde MDI = Tabla 2,
   Exploraciones = Tabla 6). 0.72.2 (revisión editorial): también los que repetían una pantalla de
   consulta (Algoritmos = Sistemas › Resumen y Cómo funciona; Escala de cetonemia = Figura 3;
   Hospital = la situación «Ingreso hospitalario»). Sus datos se conservan. */
import type { DiagramaId } from "./contenido";
import { href } from "./rutas";

export const DIAGRAMAS_RETIRADOS: DiagramaId[] = [
  "eleccion",
  "transicion",
  "exploraciones",
  "algoritmos",
  "cetonemia",
  "hospital",
];
export const diagramaEnEdicion = (id: DiagramaId) => !DIAGRAMAS_RETIRADOS.includes(id);

/* Diagramas con un solo hogar en una pantalla de consulta (0.72.2-0.73.0): la galería y la
   búsqueda llevan allí (la interrupción; la gestación por sistema, con el texto entero). */
export const HOGAR_DE_DIAGRAMA: Partial<Record<DiagramaId, string>> = {
  interrupcion: href("consultar", "interrupcion"),
  "gestacion-sistemas": href("consultar", "situacion", "gestacion"),
};
export const rutaDeDiagrama = (id: DiagramaId) => HOGAR_DE_DIAGRAMA[id] ?? href("visual", id);
