/* Diagramas que no van en esta edición (0.70.0, simplificación): redibujaban una tabla o una
   figura que ya está en la app (Elección compartida = Figura 2, Transición desde MDI = Tabla 2,
   Exploraciones = Tabla 6). 0.72.2 (revisión editorial): también los que repetían una pantalla de
   consulta (Algoritmos = Sistemas › Resumen y Cómo funciona; Escala de cetonemia = Figura 3;
   Hospital = la situación «Ingreso hospitalario»). Sus datos se conservan. */
import type { DiagramaId } from "./contenido";

export const DIAGRAMAS_RETIRADOS: DiagramaId[] = [
  "eleccion",
  "transicion",
  "exploraciones",
  "algoritmos",
  "cetonemia",
  "hospital",
];
export const diagramaEnEdicion = (id: DiagramaId) => !DIAGRAMAS_RETIRADOS.includes(id);
