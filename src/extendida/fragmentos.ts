/* Versión extendida del autor · NO publicada en el Manual SEEN.
   Fragmentos de los borradores de mayo de 2026 (V93, V85, tablas V85) que no entraron en el
   capítulo por espacio y siguen siendo válidos, APROBADOS uno a uno por el autor (3-10-2026).
   Texto literal del borrador con las convenciones de la app (DM1, UI, «duración de la insulina
   activa»). `null` en `partes` = una frase del borrador omitida porque cambió en la versión
   publicada (se muestra «[…]»). Nunca contradice el capítulo: si lo hiciera, manda el capítulo.
   Generado desde los .docx del autor; la auditoría (scripts/auditoria/fidelidad_extra.py)
   comprueba cada parte contra su borrador. No editar a mano. */
import type { SistemaId } from "../ampliacion/tipos";

export type BorradorId = "V93" | "V85" | "V79" | "T85";

export const BORRADORES: Record<BorradorId, { nombre: string; fecha: string }> = {
  V93: { nombre: "V93 integrado", fecha: "31-5-2026" },
  V85: { nombre: "V85 limpio", fecha: "31-5-2026" },
  V79: { nombre: "V79 limpio", fecha: "30-5-2026" },
  T85: { nombre: "Tablas V85", fecha: "31-5-2026" },
};

export interface ParteExtendida {
  borrador: BorradorId;
  texto: string;
  /* Celda o nota de tabla del borrador de la que sale (interfaz). */
  contexto?: string;
}

export interface FragmentoExtendido {
  id: string;
  /* Rótulo de interfaz (no es texto del borrador). */
  titulo: string;
  partes: (ParteExtendida | null)[];
  /* Apartado y ancla (id de tabla o de subapartado) tras la que se muestra. */
  donde: { apartado: string; ancla?: string };
  /* Fichas de sistema en las que también aparece. */
  sistemas: SistemaId[];
  /* Dónde trata lo mismo el texto publicado (interfaz). */
  relacion: string;
}

export const FRAGMENTOS_EXTENDIDOS: FragmentoExtendido[] = [
  {
    id: "E01",
    titulo: "MiniMed 780G: qué mueve el automático",
    partes: [
      {
        borrador: "V85",
        texto:
          "En modo automático, los únicos parámetros que modifican el comportamiento del algoritmo son el objetivo glucémico (100, 110 o 120 mg/dl) y la duración de la insulina activa (ajustable, 2-8 h); un objetivo de 100 mg/dl y una duración de la insulina activa de 2 h constituyen la configuración más intensiva cuando el perfil de seguridad lo permite; la ratio insulina/hidratos modula el bolo prandial.",
      },
    ],
    donde: { apartado: "04-sistemas" },
    sistemas: ["mm780"],
    relacion: "Tabla 1 (p. 4) y Tabla 3 (p. 10)",
  },
  {
    id: "E02",
    titulo: "Control-IQ: por qué importan basal, factor y ratio",
    partes: [
      {
        borrador: "V85",
        texto:
          "A diferencia de los sistemas en los que la basal programada solo actúa en modo manual o de respaldo, Control-IQ utiliza el perfil basal programado durante el modo automático; además, administra bolos de autocorrección hasta una vez por hora (en torno al 60 % de la dosis calculada) cuando predice hiperglucemia, por lo que el perfil basal, el factor de sensibilidad y la ratio conservan relevancia clínica directa.",
      },
    ],
    donde: { apartado: "04-sistemas" },
    sistemas: ["ciq"],
    relacion: "Tabla 1 (p. 4) y Tabla 3 (p. 10)",
  },
  {
    id: "E03",
    titulo: "Control-IQ: duración de la insulina activa fija",
    partes: [
      {
        borrador: "V93",
        texto:
          "Fija en 5 h durante Control-IQ; su configuración solo es modificable y relevante fuera del modo automático.",
        contexto:
          "Tabla 4 del borrador (hoy Tabla 3) · Tandem Control-IQ · Duración de la insulina activa",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T3" },
    sistemas: ["ciq"],
    relacion: "Tabla 3 (p. 10)",
  },
  {
    id: "E04",
    titulo: "Control-IQ: cuándo ajustar el factor",
    partes: [
      {
        borrador: "V93",
        texto:
          "interviene en los bolos del usuario y en las autocorrecciones (60 % hacia 110 mg/dl); ajustar si hay hipoglucemia 2-3 h tras una corrección o hiperglucemia persistente.",
        contexto:
          "Tabla 4 del borrador (hoy Tabla 3) · Tandem Control-IQ · Factor de sensibilidad / corrección",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T3" },
    sistemas: ["ciq"],
    relacion: "Tabla 3 (p. 10)",
  },
  {
    id: "E05",
    titulo: "CamAPS FX: qué pesa en automático y la ratio tras las comidas",
    partes: [
      {
        borrador: "V85",
        texto:
          "En modo automático, lo que más influye en el resultado es la ratio insulina/hidratos, la calidad del anuncio de comidas y el objetivo.",
      },
      {
        borrador: "V93",
        texto:
          "Determina el bolo prandial; la respuesta posprandial contribuye a la adaptación del algoritmo. Si existe hipoglucemia o reducción automática reiterada tras las comidas, valorar una ratio menos intensa.",
        contexto:
          "Tabla 4 del borrador (hoy Tabla 3) · mylife CamAPS FX · Ratio insulina/hidratos de carbono",
      },
    ],
    donde: { apartado: "04-sistemas" },
    sistemas: ["camaps"],
    relacion: "pp. 17-18 y Tabla 3 (p. 10)",
  },
  {
    id: "E07",
    titulo: "Omnipod 5: el pod, SmartAdjust y el único ajuste del automático",
    partes: [
      {
        borrador: "V85",
        texto:
          "Sistema tipo parche, sin catéter externo: un pod desechable aloja el reservorio, la cánula y la batería para 72 horas.",
      },
      null,
      {
        borrador: "V85",
        texto:
          "El algoritmo SmartAdjust (MPC) reside en el propio pod —por lo que sigue en automático aunque el móvil no esté disponible—, predice la glucemia a 60 minutos y ajusta una basal adaptativa calculada a partir de la insulina total diaria, recalculada en cada cambio de pod; no administra bolos de autocorrección, sino que aumenta la basal adaptativa (hasta cuatro veces).",
      },
      null,
      {
        borrador: "V85",
        texto:
          "En modo automático, el único ajuste que cambia la administración es el objetivo glucémico (configurable por tramos, 110-150 mg/dl).",
      },
    ],
    donde: { apartado: "04-sistemas" },
    sistemas: ["op5"],
    relacion: "Tabla 1 (pp. 3-4)",
  },
  {
    id: "E08",
    titulo: "Omnipod 5: la ratio y la DTD",
    partes: [
      {
        borrador: "T85",
        texto:
          "Clave para el bolo prandial; ratios eficaces aumentan la DTD útil y mejoran la adaptación del algoritmo.",
        contexto:
          "Tabla 4 del borrador (hoy Tabla 3) · Omnipod 5 · Ratio insulina/hidratos de carbono",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T3" },
    sistemas: ["op5"],
    relacion: "Tabla 3 (p. 10)",
  },
  {
    id: "E09",
    titulo: "Tabla 1: fila «Diferencial clínico principal»",
    partes: [
      {
        borrador: "T85",
        texto:
          "Autocorrecciones frecuentes e integración completa bomba-sensor; distintas opciones de sensor según disponibilidad.",
        contexto: "Tabla 1 del borrador · Diferencial clínico principal · MiniMed 780G",
      },
      {
        borrador: "T85",
        texto:
          "Basal programada y factor de sensibilidad con influencia directa; modos Sueño y Ejercicio.",
        contexto: "Tabla 1 del borrador · Diferencial clínico principal · Tandem Control-IQ",
      },
      {
        borrador: "T85",
        texto:
          "Objetivo muy configurable, control desde smartphone, funciones Boost/Ease-off/SAM e indicación híbrida en gestación.",
        contexto: "Tabla 1 del borrador · Diferencial clínico principal · mylife CamAPS FX",
      },
      {
        borrador: "T85",
        texto:
          "Sistema sin catéter externo, algoritmo alojado en el pod y objetivo configurable por tramos.",
        contexto: "Tabla 1 del borrador · Diferencial clínico principal · Omnipod 5",
      },
      {
        borrador: "T85",
        texto:
          "El diferencial clínico resume el rasgo más distintivo de cada sistema; no constituye una recomendación exclusiva ni una jerarquía entre sistemas.",
        contexto: "Nota de la Tabla 1 del borrador",
      },
    ],
    donde: { apartado: "04-sistemas", ancla: "T1" },
    sistemas: [],
    relacion: "p. 4",
  },
  {
    id: "E10",
    titulo: "MiniMed 780G en gestación: CE 2025 y CRISTAL",
    partes: [
      {
        borrador: "T85",
        texto:
          "Uso en gestación autorizado en Europa (CE 2025); evidencia: CRISTAL (mejoró el TIR nocturno y la satisfacción y redujo el tiempo en hipoglucemia; sin mejoría del TIR global).",
        contexto: "Tabla 1 del borrador · Indicación en gestación · MiniMed 780G",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "gestacion" },
    sistemas: ["mm780"],
    relacion: "p. 17 y Tabla 1 (p. 4)",
  },
  {
    id: "E11",
    titulo: "Nota de la tabla de parámetros",
    partes: [
      {
        borrador: "T85",
        texto:
          "Nota: el objetivo glucémico configurable influye directamente sobre la administración automática en MiniMed 780G, CamAPS FX y Omnipod 5. En Control-IQ el rango del algoritmo no es editable libremente: la optimización se realiza mediante la basal programada, el factor de sensibilidad, la ratio y los modos Sueño/Ejercicio. El impacto real de cada parámetro varía entre sistemas; la tabla orienta la optimización en consulta y no sustituye la documentación técnica oficial.",
        contexto: "Nota de la Tabla 4 del borrador (hoy Tabla 3)",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T3" },
    sistemas: [],
    relacion: "Tablas 1 y 3 (pp. 4 y 10)",
  },
  {
    id: "E14",
    titulo: "Elegir el sistema que encaja, no «el mejor»",
    partes: [
      {
        borrador: "V93",
        texto:
          "Los estudios pivotales difieren en edad, HbA1c basal, tratamiento previo y apoyo educativo, y los de vida real dependen de la selección de usuarios y de la experiencia de los equipos. Por eso, más que buscar el sistema «mejor», conviene elegir el que encaja con el perfil clínico, conductual y social de cada persona.",
      },
    ],
    donde: { apartado: "05-resultados" },
    sistemas: [],
    relacion: "p. 5 y Figura 2 (p. 6)",
  },
  {
    id: "E17",
    titulo: "Solapamiento según la basal previa",
    partes: [
      {
        borrador: "V85",
        texto:
          "El tipo de análogo basal previo condiciona cuánto persiste su efecto al iniciar la bomba y, por tanto, el riesgo de solapamiento con la basal del sistema. Las basales de acción prolongada (glargina U100, detemir) se agotan en torno a 24 h, por lo que puede administrarse la última dosis la víspera e iniciar la bomba al día siguiente. Las de acción ultralarga (glargina U300, degludec) mantienen efecto durante 24-48 h o más; para evitar el apilamiento conviene anticipar la reducción de su dosis en los días previos o iniciar la bomba con la basal reducida hasta que el efecto residual decaiga, individualizando según el control y el riesgo de hipoglucemia.",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T2" },
    sistemas: [],
    relacion: "Tabla 2 (p. 10) y p. 9",
  },
  {
    id: "E18",
    titulo: "Tabla 2: fila glargina U100 o detemir",
    partes: [
      {
        borrador: "T85",
        texto:
          "Coordinar la última dosis y el inicio del sistema según el horario, la dosis y el efecto residual esperado; puede requerirse una basal inicial reducida.",
        contexto:
          "Tabla 3 del borrador (hoy Tabla 2) · Solapamiento con glargina U100 o detemir · Recomendación orientativa",
      },
      {
        borrador: "T85",
        texto: "Individualizar según el control y el riesgo de hipoglucemia.",
        contexto:
          "Tabla 3 del borrador (hoy Tabla 2) · Solapamiento con glargina U100 o detemir · Notas",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T2" },
    sistemas: [],
    relacion: "Tabla 2 (p. 10)",
  },
  {
    id: "E20",
    titulo: "Distribución basal/bolo inicial",
    partes: [
      {
        borrador: "T85",
        texto: "40-50 % basal / 50-60 % bolos.",
        contexto:
          "Tabla 3 del borrador (hoy Tabla 2) · Distribución basal/bolo inicial · Recomendación orientativa",
      },
      {
        borrador: "T85",
        texto: "Ajustar al perfil de la persona y al sistema.",
        contexto: "Tabla 3 del borrador (hoy Tabla 2) · Distribución basal/bolo inicial · Notas",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T2" },
    sistemas: [],
    relacion: "Tabla 2 (p. 10)",
  },
  {
    id: "E21",
    titulo: "Regla del 450: ajuste fino",
    partes: [
      {
        borrador: "T85",
        texto:
          "Para análogos rápidos; ajuste fino según las excursiones posprandiales observadas en la descarga.",
        contexto:
          "Tabla 3 del borrador (hoy Tabla 2) · Cálculo inicial de la ratio I/HC (regla del 450) · Notas",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T2" },
    sistemas: [],
    relacion: "Tabla 2 (p. 10)",
  },
  {
    id: "E23",
    titulo: "Descarga: signos de infrarrecuento",
    partes: [
      {
        borrador: "T85",
        texto:
          "Nº de bolos/día, bolos tardíos o con anuncio incompleto, modificaciones manuales de la dosis sugerida, «hidratos falsos» como sustituto de bolo e infracontaje («líneas verticales» en la MCG).",
        contexto: "Tabla 5 del borrador · Paso 2, Bolos y comidas · Qué mirar",
      },
    ],
    donde: { apartado: "09-descarga", ancla: "T5" },
    sistemas: [],
    relacion: "Tabla 5, paso 4 (p. 13)",
  },
  {
    id: "E24",
    titulo: "Descarga: hipoglucemia y correcciones «en V»",
    partes: [
      {
        borrador: "T85",
        texto:
          "TBR <70 y <54 mg/dl; horarios de hipoglucemia; sobretratamiento de hipoglucemias (correcciones «en V»); relación con ejercicio, alcohol, correcciones manuales o ingesta tardía.",
        contexto: "Tabla 5 del borrador · Paso 3, Seguridad: TBR · Qué mirar",
      },
    ],
    donde: { apartado: "09-descarga", ancla: "T5" },
    sistemas: [],
    relacion: "Tabla 5, paso 2 (p. 13)",
  },
  {
    id: "E25",
    titulo: "Descarga: un cambio cada vez",
    partes: [
      {
        borrador: "T85",
        texto:
          "Uno o dos cambios por visita; reevaluar a las 2-4 semanas; no ajustar varios parámetros a la vez.",
        contexto: "Tabla 5 del borrador · Paso 4, Control global · Actuación",
      },
    ],
    donde: { apartado: "09-descarga", ancla: "T5" },
    sistemas: [],
    relacion: "Nota de la Tabla 5 (p. 13)",
  },
  {
    id: "E28",
    titulo: "Ejercicio: primero el objetivo, luego el bolo",
    partes: [
      {
        borrador: "V93",
        texto:
          "Solo de forma complementaria, si el ejercicio se realiza en las dos horas siguientes a una comida rica en hidratos, se reduce además el bolo prandial; el documento es explícito en que el objetivo se eleva antes de reducir el bolo, no en paralelo.",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "ejercicio" },
    sistemas: [],
    relacion: "p. 19",
  },
  {
    id: "E29",
    titulo: "Control-IQ: umbral del modo Ejercicio",
    partes: [
      {
        borrador: "T85",
        texto:
          "Modo Ejercicio (objetivo 140-160 mg/dl; suspende basal si predice <80 mg/dl); activar 1-2 h antes.",
        contexto:
          "Tabla 2 del borrador (hoy Tabla 4) · Ejercicio aeróbico planificado · Tandem Control-IQ",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T4" },
    sistemas: ["ciq"],
    relacion: "Tabla 4 (p. 11)",
  },
  {
    id: "E32",
    titulo: "CamAPS FX: cuándo sí y cuándo no Boost",
    partes: [
      {
        borrador: "T85",
        texto:
          "Boost puede considerarse ante una mayor necesidad transitoria de insulina, siempre que se haya descartado fallo del set y se valore la insulina activa; no utilizarlo como sustituto habitual del bolo de comida.",
        contexto:
          "Tabla 2 del borrador (hoy Tabla 4) · Hiperglucemia puntual sin sospecha de fallo de infusión · mylife CamAPS FX",
      },
      {
        borrador: "T85",
        texto: "Medir cetonemia; cambiar el set y corregir con pluma según el plan; no usar Boost.",
        contexto:
          "Tabla 2 del borrador (hoy Tabla 4) · Hiperglucemia persistente o inexplicada · mylife CamAPS FX",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T4" },
    sistemas: ["camaps"],
    relacion: "p. 20 y Tabla 4 (p. 11)",
  },
  {
    id: "E33",
    titulo: "MiniMed 780G: mayor necesidad transitoria",
    partes: [
      {
        borrador: "T85",
        texto:
          "Mantener automático con autocorrecciones; intensificar la monitorización; configuración más intensiva si persiste (objetivo 100 mg/dl, duración de la insulina activa 2 h); vigilar cetonemia.",
        contexto:
          "Tabla 2 del borrador (hoy Tabla 4) · Mayor necesidad transitoria leve · MiniMed 780G",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T4" },
    sistemas: ["mm780"],
    relacion: "Tabla 4 (p. 11)",
  },
  {
    id: "E36",
    titulo: "MiniMed 780G: noche",
    partes: [
      {
        borrador: "T85",
        texto:
          "Sin modo nocturno específico; revisar la configuración global solo ante un patrón nocturno persistente y con TBR seguro.",
        contexto: "Tabla 2 del borrador (hoy Tabla 4) · Sueño / período nocturno · MiniMed 780G",
      },
    ],
    donde: { apartado: "08-iniciacion", ancla: "T4" },
    sistemas: ["mm780"],
    relacion: "Tabla 4 (p. 11)",
  },
  {
    id: "E40",
    titulo: "Hospital: continuar no es iniciar",
    partes: [
      {
        borrador: "V93",
        texto:
          "La hospitalización requiere diferenciar la continuación supervisada del sistema de asa cerrada (en personas seleccionadas, estables y capaces de autocuidado, dentro de un protocolo institucional) de la iniciación hospitalaria (que exige infraestructura y formación específicas y suele reservarse a programas concretos o a investigación). La continuación es razonable cuando la persona está estable y puede gestionar el dispositivo, el hospital dispone de protocolos claros y el personal tiene competencia técnica. En cambio, en situación crítica o con inestabilidad hemodinámica (UCI, sepsis, shock, cirugía mayor o cetoacidosis) debe sustituirse por el tratamiento hospitalario estándar —insulina intravenosa en el paciente crítico—, porque los algoritmos no están diseñados para esos cambios rápidos y la precisión del sensor puede degradarse.",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "ingreso" },
    sistemas: [],
    relacion: "pp. 20-21",
  },
  {
    id: "E41",
    titulo: "Hospital: qué degrada el sistema",
    partes: [
      {
        borrador: "V93",
        texto:
          "Varios factores hospitalarios condicionan el rendimiento: los algoritmos no están diseñados para los cambios rápidos de la nutrición artificial o los glucocorticoides, y la precisión del sensor puede alterarse por anasarca, hipoxia grave, anemia o hipotensión sostenida.",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "ingreso" },
    sistemas: [],
    relacion: "p. 21",
  },
  {
    id: "E43",
    titulo: "Perioperatorio: objetivo ADA 2026",
    partes: [
      {
        borrador: "V93",
        texto:
          "En el período perioperatorio, los objetivos siguen el estándar vigente (ADA 2026: 100-180 mg/dl).",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "ingreso" },
    sistemas: [],
    relacion: "p. 21",
  },
  {
    id: "E44",
    titulo: "Cirugía con el sistema puesto",
    partes: [
      {
        borrador: "V93",
        texto:
          "cuando se opta por mantenerlo, conviene programarlo como primera intervención del día,",
      },
      null,
      {
        borrador: "V93",
        texto:
          "alejar la bomba y el sensor del campo y de la diatermia y emplear cánula de teflón.",
      },
      {
        borrador: "V93",
        texto:
          "Sin protocolo local, personal entrenado y acuerdo con anestesia, debe priorizarse la pauta convencional o la perfusión intravenosa.",
      },
      {
        borrador: "V93",
        texto:
          "En descompensación grave, inestabilidad hemodinámica o pérdida de fiabilidad del sensor o de la absorción, es preferible retirarlo temporalmente y reintroducirlo una vez recuperada la estabilidad, idealmente antes del alta y con interconsulta a endocrinología.",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "ingreso" },
    sistemas: [],
    relacion: "p. 21 y Tabla 6",
  },
  {
    id: "E47",
    titulo: "PET con FDG: por qué",
    partes: [
      {
        borrador: "V93",
        texto:
          "En la PET con FDG deben seguirse las instrucciones de Medicina Nuclear sobre ayuno, glucemia e insulinoterapia previa, dado que la insulina reciente y la hiperglucemia pueden alterar la distribución del trazador y reducir la calidad diagnóstica.",
      },
    ],
    donde: { apartado: "10-situaciones", ancla: "exploraciones" },
    sistemas: [],
    relacion: "p. 21",
  },
  {
    id: "E49",
    titulo: "DIY: Nightscout y AAPS",
    partes: [
      {
        borrador: "V93",
        texto:
          "Sus plataformas (Nightscout, AAPS) pueden no integrarse con la descarga oficial del centro.",
      },
    ],
    donde: { apartado: "11-diy" },
    sistemas: [],
    relacion: "p. 22",
  },
  {
    id: "E50",
    titulo: "Lo que la automatización no resuelve",
    partes: [
      {
        borrador: "V85",
        texto:
          "Los AID reducen la carga terapéutica, pero no sustituyen completamente la toma de decisiones.",
      },
      null,
      {
        borrador: "V85",
        texto:
          "La absorción subcutánea de insulina, el retraso intersticial, la precisión del sensor, las incidencias del sistema de infusión, la conectividad y la disponibilidad de consumibles condicionan el rendimiento.",
      },
    ],
    donde: { apartado: "12-horizonte" },
    sistemas: [],
    relacion: "p. 23",
  },
  {
    id: "E52",
    titulo: "Barreras técnicas, prácticas y psicológicas",
    partes: [
      { borrador: "V85", texto: "Las barreras no son solo tecnológicas." },
      {
        borrador: "V85",
        texto:
          "El coste, la variabilidad territorial, la falta de equipos entrenados, la sobrecarga asistencial, la alfabetización digital, las barreras lingüísticas, la discapacidad visual o manual, los problemas cutáneos y la fatiga tecnológica pueden limitar el inicio o la continuidad.",
      },
      {
        borrador: "V85",
        texto:
          "Tampoco son solo prácticas: la imagen corporal —sobre todo en mujeres y adolescentes—, la ansiedad ante alarmas y, en una minoría, los síntomas depresivos asociados al uso sostenido son barreras psicológicas reales, aunque la mayoría de estudios muestre mejora de la calidad de vida y menos miedo a la hipoglucemia; deben identificarse y abordarse con soporte educativo, adaptación del sistema, seguimiento flexible y, cuando proceda, apoyo psicológico.",
      },
    ],
    donde: { apartado: "12-horizonte" },
    sistemas: [],
    relacion: "p. 23",
  },
  {
    id: "E54",
    titulo: "Evaluación económica",
    partes: [
      {
        borrador: "V85",
        texto:
          "La evaluación económica condiciona la implantación universal de estos sistemas. Su coste-efectividad depende del comparador, del control basal, del precio del dispositivo, del horizonte temporal y de la incorporación de variables como el tiempo en rango, la hipoglucemia, la calidad de vida y la carga terapéutica.",
      },
      null,
      {
        borrador: "V85",
        texto:
          "En contextos de recursos limitados, la indicación amplia debe combinarse con criterios transparentes de priorización clínica y con la negociación de precios sostenibles.",
      },
    ],
    donde: { apartado: "12-horizonte" },
    sistemas: [],
    relacion: "p. 23",
  },
  {
    id: "E56",
    titulo: "Hacia dónde van los sistemas",
    partes: [
      { borrador: "V85", texto: "El desarrollo previsible apunta en varias direcciones." },
      {
        borrador: "V85",
        texto:
          "Los algoritmos avanzan hacia una mayor automatización —incluido el anuncio cualitativo de las comidas o la supresión del recuento de hidratos—, apoyada en el aprendizaje a partir de datos multicéntricos y en la integración de señales de dispositivos vestibles.",
      },
      {
        borrador: "V85",
        texto:
          "En el hardware se esperan sensores más duraderos y con menos interferencias, sensores duales de glucosa y cetonemia para detectar antes el fallo de infusión, y bombas más pequeñas e interoperables.",
      },
      {
        borrador: "V85",
        texto:
          "En el plano farmacológico, los análogos ultrarrápidos y la exploración de vías de administración alternativas (intraperitoneal, intradérmica o inhalada) buscan reducir el componente híbrido.",
      },
    ],
    donde: { apartado: "12-horizonte" },
    sistemas: [],
    relacion: "p. 23",
  },
];
