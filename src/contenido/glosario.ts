/* Glosario de siglas del capítulo. El desarrollo es el que da el propio capítulo (pies de
   tabla y de figura o primera mención en el texto), con la página en la que lo hace.
   Las siglas que el capítulo usa sin desarrollar se marcan como tales: no se inventa nada. */
import type { Sigla } from "./tipos";

export const GLOSARIO: Sigla[] = [
  { sigla: "ADA", desarrollo: "American Diabetes Association", pagina: 24 },
  {
    sigla: "AID",
    desarrollo: "administración automatizada de insulina (automated insulin delivery)",
    pagina: 1,
  },
  { sigla: "β-OHB", desarrollo: "β-hidroxibutirato", pagina: 7 },
  { sigla: "CE", desarrollo: "marcado europeo de conformidad", pagina: 4 },
  { sigla: "DEXA", desarrollo: "absorciometría de rayos X de doble energía", pagina: 22 },
  {
    sigla: "DIY",
    desarrollo:
      "sistemas de asa cerrada de desarrollo propio (do it yourself) basados en código abierto",
    pagina: 22,
  },
  { sigla: "DM1", desarrollo: "diabetes mellitus tipo 1", pagina: 1 },
  { sigla: "DTD", desarrollo: "dosis total diaria de insulina", pagina: 3 },
  {
    sigla: "EASD",
    desarrollo:
      "European Association for the Study of Diabetes (en la p. 19, «Asociación Europea para el Estudio de la Diabetes»)",
    pagina: 24,
  },
  { sigla: "ECG", desarrollo: "electrocardiograma", pagina: 22 },
  { sigla: "FDA", desarrollo: "Food and Drug Administration", pagina: 4 },
  { sigla: "FDG", desarrollo: "fluorodesoxiglucosa", pagina: 21 },
  {
    sigla: "FSI",
    desarrollo: "factor de sensibilidad a la insulina (abreviaturas de la Figura 3)",
    pagina: 8,
  },
  { sigla: "GMI", desarrollo: "indicador de gestión de la glucosa", pagina: 4 },
  { sigla: "HbA1c", desarrollo: "hemoglobina glucosilada", pagina: 4 },
  { sigla: "HC", desarrollo: "hidratos de carbono", pagina: 4 },
  { sigla: "I/HC", desarrollo: "ratio insulina/hidratos de carbono", pagina: 4 },
  { sigla: "ISCI", desarrollo: "infusión subcutánea continua de insulina", pagina: 1 },
  { sigla: "iSGLT2", desarrollo: "inhibidor del cotransportador sodio-glucosa tipo 2", pagina: 8 },
  {
    sigla: "ISPAD",
    desarrollo:
      "International Society for Pediatric and Adolescent Diabetes (en la p. 19, «Sociedad Internacional de Diabetes Pediátrica y del Adolescente»)",
    pagina: 25,
  },
  {
    sigla: "JBDS-IP",
    desarrollo: "sigla no desarrollada en el capítulo (posicionamiento hospitalario de 2026)",
    pagina: 20,
  },
  { sigla: "MCG", desarrollo: "monitorización continua de glucosa", pagina: 1 },
  { sigla: "MDI", desarrollo: "múltiples dosis de insulina", pagina: 1 },
  { sigla: "MPC", desarrollo: "control predictivo basado en modelo", pagina: 3 },
  { sigla: "PEET", desarrollo: "programa estructurado de educación terapéutica", pagina: 6 },
  { sigla: "PET", desarrollo: "tomografía por emisión de positrones", pagina: 22 },
  { sigla: "PID", desarrollo: "control proporcional-integral-derivativo", pagina: 3 },
  { sigla: "RM", desarrollo: "resonancia magnética", pagina: 21 },
  { sigla: "TAR", desarrollo: "tiempo por encima del rango", pagina: 2 },
  { sigla: "TBR", desarrollo: "tiempo por debajo del rango", pagina: 2 },
  { sigla: "TC", desarrollo: "tomografía computarizada", pagina: 21 },
  { sigla: "TIR", desarrollo: "tiempo en rango", pagina: 2 },
  { sigla: "TITR", desarrollo: "tiempo en rango estrecho", pagina: 4 },
  { sigla: "UI", desarrollo: "unidades de insulina", pagina: 4 },
];
