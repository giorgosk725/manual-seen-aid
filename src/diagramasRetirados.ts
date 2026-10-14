/* Diagramas que no van en esta edición (0.70.0, simplificación): redibujaban una tabla o una
   figura que ya está en la app (Elección compartida = Figura 2, Transición desde MDI = Tabla 2,
   Exploraciones = Tabla 6). Sus datos se conservan. */
import type { DiagramaId } from "./contenido";

export const DIAGRAMAS_RETIRADOS: DiagramaId[] = ["eleccion", "transicion", "exploraciones"];
export const diagramaEnEdicion = (id: DiagramaId) => !DIAGRAMAS_RETIRADOS.includes(id);
