/* Test de autoevaluación. ESTRUCTURA lista; las preguntas definitivas las escribirá el autor.
   Las dos de aquí son ejemplos PROVISIONALES (provisional: true) y se muestran como tales.
   Cada pregunta justifica la respuesta con una cita literal del capítulo y su página. */

export interface Pregunta {
  id: string;
  provisional: boolean;
  enunciado: string;
  opciones: string[];
  /* Índice de la opción correcta. */
  correcta: number;
  /* Razonamiento: cita literal del capítulo. */
  razon: string;
  pagina: number;
  /* Apartado que la justifica (slug) y, si procede, ancla del subapartado. */
  apartado: string;
  ancla?: string;
}

export const PREGUNTAS: Pregunta[] = [
  {
    id: "ej-1",
    provisional: true,
    enunciado:
      "En el seguimiento de una persona con un sistema de asa cerrada, ¿cuál es el indicador prioritario de seguridad?",
    opciones: [
      "El tiempo en rango (TIR 70-180 mg/dl)",
      "El tiempo por debajo del rango (TBR)",
      "La HbA1c",
      "El coeficiente de variación",
    ],
    correcta: 1,
    razon:
      "«El TBR es el indicador prioritario de seguridad: < 70 mg/dl debe mantenerse por debajo del 4 % y < 54 mg/dl por debajo del 1 %.»",
    pagina: 4,
    apartado: "05-resultados",
  },
  {
    id: "ej-2",
    provisional: true,
    enunciado:
      "Una persona con asa cerrada presenta glucosa del sensor ≥ 250 mg/dl durante más de 2 h sin causa clara. ¿Qué debe sospecharse en primer lugar?",
    opciones: [
      "Fenómeno del alba",
      "Ratio insulina/hidratos insuficiente",
      "Fallo de infusión",
      "Compresión del sensor",
    ],
    correcta: 2,
    razon:
      "«La segunda regla es que toda hiperglucemia persistente sin causa clara debe hacer sospechar fallo de infusión hasta demostrar lo contrario.» Y, en resolución de incidencias: «La regla orientativa es “ante la duda, cambia el set”.»",
    pagina: 8,
    apartado: "07-educacion",
  },
];
