/* Las seis tablas del capítulo, literales (PDF 30-9-2026). Correcciones aplicadas:
   3/11 (Tabla 1, Omnipod 5, indicación), 6/11 (Tabla 3, «mg/dl»), 7/11 (Tabla 4, fila
   «Ejercicio anaeróbico» reconstruida), 8/11 (Tabla 6, «computarizada») y la errata que
   el autor corregirá en la editorial (Tabla 1, Control-IQ+: «peso 9–200 kg, DTD 5–200 UI/día»). */
import type { Tabla, TablaId } from "./tipos";

export const SISTEMAS = [
  "MiniMed 780G",
  "Tandem Control-IQ",
  "myLoop CamAPS",
  "Omnipod 5",
] as const;
export type Sistema = (typeof SISTEMAS)[number];

export const T1: Tabla = {
  id: "T1",
  numero: 1,
  titulo:
    "Sistemas AID comercializados en España: comparación práctica para la elección compartida",
  paginas: [3, 4],
  cabeceraEtiqueta: "Característica",
  columnas: [...SISTEMAS],
  porSistema: true,
  filas: [
    {
      etiqueta: "Formato",
      celdas: [
        "Bomba con catéter; reservorio 180/300 UI; set hasta 7 días (Extended Wear Infusion Set)",
        "Bomba con catéter; t:slim X2 (reservorio 300 UI). Variante compacta: Mobi (200 UI)",
        "Bomba con catéter (YpsoPump, 160 UI).",
        "Pod desechable, sin tubo externo (reservorio ≤ 200 UI; 72 h continuas)",
      ],
    },
    {
      etiqueta: "Sensores compatibles",
      celdas: [
        "Guardian 4; Simplera Sync; Instinct",
        "Dexcom G6, G7",
        "Dexcom G7; FreeStyle Libre 3 Plus",
        "Dexcom G7; FreeStyle Libre 2 Plus",
      ],
    },
    {
      etiqueta: "Localización del algoritmo",
      celdas: [
        "En la bomba",
        "En la bomba",
        "En la app del smartphone",
        "En el pod; control mediante el controlador (Europa) o la app del smartphone (EE. UU.)",
      ],
    },
    {
      etiqueta: "Lógica del algoritmo y aprendizaje",
      celdas: [
        "SmartGuard: algoritmo de tipo PID + lógica difusa. Posee autoaprendizaje continuo que actualiza el valor basal automático cada medianoche, basándose en la dosis total diaria (DTD) de los últimos 2–6 días",
        "Control-IQ: algoritmo de tipo MPC, que ajusta la administración cada 5 min a partir de una predicción a 30 min. No incorpora autoaprendizaje, por lo que su rendimiento depende de mantener optimizados el ritmo basal y el factor de sensibilidad.",
        "CamAPS FX: algoritmo de tipo MPC adaptativo. Posee un aprendizaje multinivel (DTD, variaciones diurnas y patrones posprandiales) que se actualiza cada 24 h",
        "SmartAdjust: algoritmo de tipo MPC. Posee autoaprendizaje por pod: calcula una «basal adaptativa» que se recalcula con cada cambio de pod a partir del historial de administración de insulina, ponderando los pods más recientes.",
      ],
    },
    {
      etiqueta: "Estrategia de automatización",
      celdas: [
        "Administra microbolos cada 5 min calculados por el algoritmo para alcanzar el objetivo",
        "Modula (aumenta, reduce o suspende) la basal programada cada 5 min, basándose en una predicción a 30 min",
        "Modula la administración de forma continua mediante bolos extendidos cada 8–12 min, basándose en una predicción a largo plazo de 2,5 a 4 h",
        "Administra microbolos cada 5 min según una predicción a 60 min. En modo automático sustituye el perfil basal programado por su propia “basal adaptativa”",
      ],
    },
    {
      etiqueta: "Bolos automáticos de corrección",
      celdas: [
        "Sí; hasta uno cada 5 min si se predice > 120 mg/dl. Incluye módulo de seguridad (Safe Bolus) que reduce la dosis si se predice hipoglucemia",
        "Sí; máx. uno por hora si se predice > 180 mg/dl a 30 min. Administra el 60 % de la dosis para un objetivo de 110 mg/dl; no actúa en modo Sueño",
        "No; modula la administración continua de insulina, sin bolos de corrección diferenciados",
        "No; no utiliza bolos automáticos; en su lugar, incrementa la tasa basal adaptativa hasta un 400 %",
      ],
    },
    {
      etiqueta: "Objetivo glucémico en modo automático",
      celdas: [
        "100, 110 o 120 mg/dl",
        "Rango: 112,5–160 mg/dl\nModo sueño: 112,5–120\nModo ejercicio: 140–160",
        "Por tramos, rango 80–198 mg/dl (bloques de hasta cada 30 min)\nDe fábrica: 104 mg/dl",
        "110, 120, 130, 140 o 150 mg/dl (hasta 8 tramos/día)",
      ],
    },
    {
      etiqueta: "Indicación",
      celdas: [
        "≥ 2 años; DTD ≥ 6 UI/día\nAutorización en diabetes tipo 2 (marcado CE)",
        // Errata corregida (autor): «peso 9–200 kg, DTD 5–200 UI/día».
        "Control-IQ: ≥ 6 años, 25–140 kg, DTD 10–100 UI/día\nControl-IQ+: ≥ 2 años, peso 9–200 kg, DTD 5–200 UI/día; autorización en diabetes tipo 2 (FDA y marcado CE)",
        "≥ 1 año; peso ≥ 10 kg; DTD 5–350 UI/día;\nLiberty: > 13 años",
        // Corrección editorial 3/11.
        "≥ 2 años; sin peso mínimo; DTD ≥ 5 UI/día\nAutorización en diabetes tipo 2 (≥ 18 años) por la FDA",
      ],
    },
    {
      etiqueta: "Gestación: autorización y evidencia",
      celdas: [
        "Autorizado (CE); evidencia: CRISTAL",
        "Control-IQ: sin autorización\nControl-IQ+: autorizado (FDA y CE); evidencia: CIRCUIT",
        "CamAPS FX: autorizado (CE); evidencia: AiDAPT.\nLiberty: no autorizado",
        "No",
      ],
    },
    {
      etiqueta: "Plataforma de descarga",
      celdas: ["CareLink", "Tandem Source", "Glooko", "Omnipod Discover"],
    },
    {
      etiqueta: "Parámetros configurables en modo automático",
      celdas: [
        "Objetivo de glucosa*\nDuración de la insulina activa*\nRatios I/HC",
        "Factor de sensibilidad*\nBasal programada*\nRatios I/HC",
        "Objetivo de glucosa*\nRatios I/HC",
        "Objetivo de glucosa*\nFactor de sensibilidad\nDuración de la insulina activa\nRatios I/HC",
      ],
    },
  ],
  notas: [
    "*Parámetro con efecto directo sobre el algoritmo en modo automático; el resto interviene sobre todo en los bolos administrados por el paciente o en el modo manual.",
    "AID: administración automatizada de insulina; CE: marcado europeo de conformidad; FDA: Food and Drug Administration; HC: hidratos de carbono; I/HC: ratio insulina/hidratos de carbono; MCG: monitorización continua de glucosa; MPC: control predictivo basado en modelo; PID: control proporcional-integral-derivativo; UI: unidades de insulina.",
  ],
};

export const T2: Tabla = {
  id: "T2",
  numero: 2,
  titulo:
    "Transición de MDI a sistema de asa cerrada: inicio seguro, parámetros iniciales y solapamiento basal",
  paginas: [10, 10],
  cabeceraEtiqueta: "Aspecto",
  columnas: ["Recomendación orientativa", "Notas"],
  porSistema: false,
  filas: [
    {
      etiqueta: "Plan de respaldo antes del inicio",
      celdas: [
        "Entregar una pauta escrita con basal y rápida en pluma, el cálculo de corrección, material para medir cetonemia y un contacto asistencial ante fallo del sistema",
        "Requisito de seguridad; debe estar disponible desde el primer día y revisarse en cada cambio relevante",
      ],
    },
    {
      etiqueta: "Inicialización del modo automático (por sistema)",
      celdas: [
        "MiniMed 780G: SmartGuard requiere 48 h previas de administración de insulina en modo manual. Programar: objetivo, duración de la insulina activa y ratio I/HC\nControl-IQ: iniciar modo automático tras introducir peso y DTD. Programar: tasa basal, factor de sensibilidad y ratio I/HC\nCamAPS FX: iniciar modo automático tras introducir peso y DTD. Programar: objetivo personal y ratios I/HC\nOmnipod 5: iniciar modo automático desde el primer pod. Programar: tasa basal inicial —utilizada para estimar la DTD inicial—, objetivo glucémico, ratio I/HC, factor de sensibilidad y duración de la insulina activa",
        "La calidad de los datos iniciales condiciona el arranque del algoritmo; se afinan después con la descarga periódica",
      ],
    },
    {
      etiqueta: "Reducción de la DTD al pasar de MDI",
      celdas: [
        "Valorar una reducción inicial de la DTD respecto a MDI (orientativamente del 10-20 %) en casos de buen control previo o riesgo de hipoglucemia; poco o nada si el control era deficiente (HbA1c > 8 %)",
        "En asa cerrada, el algoritmo ajusta después la basal automáticamente; esta cifra es solo el punto de partida",
      ],
    },
    {
      etiqueta: "Distribución basal/bolo inicial",
      celdas: [
        "Ritmo basal inicial = ~40-50 % de la DTD reducida/24 h; o individualizar según MCG",
        "Sirve sobre todo para el modo manual; en Tandem Control-IQ, el perfil basal sí interviene en automático",
      ],
    },
    {
      etiqueta: "Cálculo inicial de ratio I/HC (g de HC por 1 UI)",
      celdas: [
        "Regla del 450: g de HC por unidad = 450/DTD",
        "Alternativa: cálculo individualizado basado en educación diabetológica previa a la instalación",
      ],
    },
    {
      etiqueta: "Cálculo inicial del factor de sensibilidad",
      celdas: [
        "Regla del 1700: mg/dl por unidad = 1700/DTD",
        "Puede valorarse la regla del 1800 en personas con riesgo elevado de hipoglucemia",
      ],
    },
    {
      etiqueta: "Objetivo del calculador de bolos manual",
      celdas: [
        "Individualizar (orientativamente 100 mg/dl general; 90 mg/dl preconcepcional/gestación; 120 mg/dl en riesgo elevado de hipoglucemia)",
        "No confundir con el objetivo glucémico del algoritmo automático, que se configura por separado (v. Tabla 1)",
      ],
    },
    {
      etiqueta: "Objetivo del algoritmo automático (inicio)",
      celdas: [
        "Adaptar al perfil clínico: más conservador si hay HbA1c elevada de larga evolución, retinopatía inestable o miedo a la hipoglucemia; más estricto en planificación gestacional y gestación",
        "No confundir con el objetivo del calculador de bolos manual",
      ],
    },
    {
      etiqueta: "Solapamiento con glargina U–300 o degludec",
      celdas: [
        "Las basales ultralargas mantienen un efecto residual durante los primeros días; coordinar la última dosis y el inicio del sistema",
        "Posible riesgo de hipoglucemia en personas con buen control previo; vigilar estrechamente, sobre todo las primeras 48 h",
      ],
    },
  ],
  notas: [
    "DTD: dosis total diaria de insulina; HbA1c: hemoglobina glucosilada; HC: hidratos de carbono; I/HC: ratio insulina/hidratos de carbono; MCG: monitorización continua de glucosa; MDI: múltiples dosis de insulina.",
    "*Nota: los parámetros iniciales son solo el valor de partida; el algoritmo de cada sistema los modula según su propia lógica, y el ajuste fino posterior se realiza a partir del análisis estructurado de la descarga.",
  ],
};

export const T3: Tabla = {
  id: "T3",
  numero: 3,
  titulo: "Ajuste práctico de los parámetros clásicos por sistema",
  paginas: [10, 11],
  cabeceraEtiqueta: "Aspecto práctico",
  columnas: [...SISTEMAS],
  porSistema: true,
  filas: [
    {
      etiqueta: "Objetivo glucémico y funciones temporales con impacto en automático",
      celdas: [
        "Objetivo seleccionable (100, 110 o 120 mg/dl)\nObjetivo temporal de 150 mg/dl (suspende las autocorrecciones mientras está activo)",
        // Corrección editorial 6/11: «140–160 mg/dl».
        "Objetivo fijo no configurable\nSe interviene con la tasa basal, el factor de sensibilidad y los modos sueño (112,5–120 mg/dl) y ejercicio (140–160 mg/dl)",
        "Objetivo configurable por tramos hasta cada 30 min (rango 80–198 mg/dl);\nBoost intensifica la administración\nEase-off eleva el objetivo",
        "Objetivo configurable por tramos hasta 8 (110, 120, 130, 140 o 150 mg/dl); Función Actividad fija el objetivo en 150 mg/dl",
      ],
    },
    {
      etiqueta: "Tasa basal programada",
      celdas: [
        "Se utiliza en modo manual o de respaldo; no influye en el modo automático",
        "Sí interviene en automático; Control-IQ modula continuamente el perfil basal programado, por lo que conviene ajustarlo bien. Control-IQ+ añade además basal temporal configurable del 0 al 250 % durante 15 min–72 h, manteniendo las correcciones automáticas.",
        "Se utiliza en modo manual o de respaldo; no influye en el modo automático",
        "Se utiliza en modo manual o de respaldo y para estimar la DTD inicial con la que inicia la basal adaptativa del primer pod; posteriormente, no influye en el modo automático",
      ],
    },
    {
      etiqueta: "Ratio insulina/hidratos de carbono",
      celdas: [
        "Clave para el bolo prandial; ajustar si el patrón posprandial es inadecuado",
        "Clave para el bolo prandial; ajustar si el patrón posprandial es inadecuado",
        "Clave para el bolo prandial\nLa respuesta posprandial contribuye a la adaptación del algoritmo",
        "Clave para el bolo prandial\nLos bolos administrados contribuyen a la DTD utilizada para actualizar la basal adaptativa en pods sucesivos",
      ],
    },
    {
      etiqueta: "Factor de sensibilidad",
      celdas: [
        "No interviene en SmartGuard: se usa en el calculador de bolos fuera del modo automático; no modifica las autocorrecciones",
        "Sí interviene en el funcionamiento automático. Condiciona las correcciones manuales, los bolos automáticos de corrección y la intensidad de la modulación basal",
        "El algoritmo adapta internamente su sensibilidad; el factor configurado se usa en el calculador para correcciones indicadas por la persona y no ajusta directamente la modulación automática",
        "Se usa en SmartBolus para correcciones indicadas por la persona; no modifica directamente SmartAdjust",
      ],
    },
    {
      etiqueta: "Duración de la insulina activa",
      celdas: [
        "Ajustable, 2–8 h\nUna duración de la insulina activa más corta intensifica especialmente las autocorrecciones automáticas",
        "No modificable en modo automático; el ajuste configurable solo es relevante fuera del modo automático",
        "Ajustable 2–8 h. Se usa en el calculador de bolos para comidas y correcciones indicadas por la persona; el algoritmo estima la insulina activa de forma automática",
        "Ajustable, 2–6 h. Se utiliza en el calculador de bolos; no modifica directamente SmartAdjust, aunque puede influir indirectamente a través de cambios sostenidos en la DTD",
      ],
    },
  ],
  notas: [
    "DTD: dosis total diaria de insulina; I/HC: ratio insulina/hidratos de carbono; TBR: tiempo por debajo del rango.",
  ],
};

export const T4: Tabla = {
  id: "T4",
  numero: 4,
  titulo: "Herramientas del sistema y conducta recomendada ante situaciones clínicas frecuentes",
  paginas: [11, 12],
  cabeceraEtiqueta: "Situación clínica",
  columnas: [...SISTEMAS],
  porSistema: true,
  filas: [
    {
      etiqueta:
        "Ejercicio aeróbico planificado o situación previsible de mayor riesgo de hipoglucemia.\nActivar la función temporal 1–2 h antes e individualizar la duración según respuesta previa",
      celdas: [
        "Objetivo temporal 150 mg/dl; suspende las autocorrecciones mientras está activo",
        "Modo ejercicio, rango 140–160 mg/dl; reduce o suspende la administración si predice descenso. Mantiene posibles autocorrecciones automáticas si se superan los umbrales del algoritmo",
        "Modo Ease-off: eleva temporalmente el objetivo y reduce la administración automática de insulina; permite inicio inmediato o diferido y duración configurable. En hipoglucemia recurrente por tramo horario, valorar objetivo más alto en ese periodo",
        "Función Actividad, objetivo 150 mg/dl; reduce la administración automática, con duración programable de 1–24 h",
      ],
    },
    {
      // Corrección editorial 7/11: fila reconstruida con una sola celda común a los cuatro sistemas.
      etiqueta: "Ejercicio anaeróbico o de alta intensidad",
      unida: true,
      celdas: [
        "Habitualmente sin modo temporal específico; mantener el objetivo estándar para no favorecer la hiperglucemia reactiva. En CamAPS FX, no usar Boost de rutina (riesgo de hipoglucemia diferida)",
      ],
    },
    {
      etiqueta: "Sueño/período nocturno",
      celdas: [
        "Sin modo nocturno específico",
        "Modo sueño: franja horaria configurable Objetivo: 112,5–120 mg/dl; mantiene la modulación basal sin bolos de autocorrección",
        "Sin modo nocturno específico\nObjetivo configurable por tramos",
        "Sin modo nocturno específico\nObjetivo configurable por tramos",
      ],
    },
    {
      etiqueta:
        "Mayor necesidad transitoria leve sin sospecha de fallo de infusión (enfermedad leve, menstruación o estrés)",
      celdas: [
        "Intensificar la monitorización, vigilar cetonemia y mantener el automático; ajustar configuración (objetivo, duración de la insulina activa) si es posible",
        "Intensificar la monitorización, vigilar cetonemia y mantener el automático; ajustar configuración (tasa basal, factor de sensibilidad)",
        "Intensificar la monitorización, vigilar cetonemia y mantener el automático; valorar Modo Boost y si se mantiene ajustar el objetivo",
        "Intensificar la monitorización, vigilar cetonemia y mantener el automático; ajustar el objetivo",
      ],
    },
    {
      etiqueta: "Hiperglucemia puntual sin sospecha de fallo de infusión",
      celdas: [
        "Mantener SmartGuard. Ante hiperglucemia mantenida, confirmar la glucemia capilar y administrar el bolo corrector recomendado por el sistema.",
        "Mantener automático y administrar bolo corrector según el calculador",
        "Mantener automático y valorar Boost o bolo corrector según el calculador",
        "Mantener automático y administrar bolo corrector según el calculador",
      ],
    },
    {
      etiqueta: "Comida rica en grasa/proteína (absorción lenta)",
      celdas: [
        "Sin función específica",
        "Función: bolo extendido (hasta 2 h; Control-IQ+: de 15 min a 8 h)",
        "Función comida de absorción lenta",
        "Función bolo extendido disponible solo en modo manual",
      ],
    },
    {
      etiqueta: "Hiperglucemia persistente o inexplicada (sospecha de fallo de infusión)",
      unida: true,
      celdas: [
        "Medir cetonemia, corregir con pluma y recambiar el set/pod según el plan de seguridad (v. Figura 3)",
      ],
    },
  ],
  notas: ["TBR: tiempo por debajo del rango; β-OHB: β-hidroxibutirato."],
};

export const T5: Tabla = {
  id: "T5",
  numero: 5,
  titulo: "Análisis estructurado de la descarga del sistema de asa cerrada en consulta",
  paginas: [13, 14],
  cabeceraEtiqueta: "Paso",
  columnas: ["Elemento", "Qué mirar", "Interpretación", "Actuación"],
  porSistema: false,
  filas: [
    {
      etiqueta: "1",
      celdas: [
        "Uso, representatividad de los datos y funcionamiento del sistema",
        "Datos de MCG de los últimos 14 días; % uso del sensor; tiempo en modo automático y causa de pérdida de conectividad e incidencias",
        "Uso de MCG ≥ 70 % en 14 días permite interpretar patrones\nTiempo en modo automático: cuanto mayor sea su uso, mayor es el beneficio",
        "Resolver problemas de adhesivo, suministro, conectividad o alarmas técnicas; revisar las causas de salida antes de modificar ajustes del sistema",
      ],
    },
    {
      etiqueta: "2",
      celdas: [
        "Seguridad clínica, TBR y alertas de hipoglucemia",
        "TBR < 70 y < 54 mg/dl\nAlertas de glucosa baja/urgente\nEpisodios nocturnos",
        "Hipoglucemia inadvertida o grave. Relación con ejercicio, alcohol, bolos correctores adicionales o sobretratamiento",
        "Configuración más conservadora según el sistema\nCorregir el sobretratamiento\nAjustar alarmas (un elevado número de alertas no equivale siempre a hipoglucemia real)",
      ],
    },
    {
      etiqueta: "3",
      celdas: [
        "Control global y exposición glucémica",
        "TIR 70–180 mg/dl, TAR > 180 y > 250 mg/dl, glucosa media, GMI, coeficiente de variación y TITR 70–140 mg/dl cuando proceda; comparación con HbA1c si está disponible",
        "Interpretar hiperglucemia después de confirmar que el TBR es seguro.\nEl GMI complementa la HbA1c, pero una discordancia relevante no justifica por sí sola un cambio de tratamiento; conviene investigar su causa.\nUn TAR > 250 mg/dl elevado debe hacer revisar episodios de hiperglucemia persistente y descartar problemas recurrentes del sistema de infusión",
        "Priorizar uno o dos cambios concretos y reevaluables. Si existe hiperglucemia persistente o no hay respuesta a la corrección, pasar directamente al paso 8 y aplicar la figura 3",
      ],
    },
    {
      etiqueta: "4",
      celdas: [
        "Bolos, comidas e interacción con el sistema",
        "Número de bolos diarios; bolos omitidos o tardíos, modificación de la dosis sugerida; infrarrecuento; bolos correctores adicionales administrados por el paciente; hidratos fantasma (ghost carbs)",
        "La modificación repetida de la dosis sugerida o la administración de correcciones adicionales puede aumentar el riesgo de hipoglucemia diferida",
        "Reforzar el bolo anticipado; simplificar el contaje; revisar la insulina activa y evitar bolos correctores repetidos no justificados o hidratos fantasma.",
      ],
    },
    {
      etiqueta: "5",
      celdas: [
        "Patrones horarios y uso de funciones temporales",
        "Ayuno, noche, posprandial precoz y tardío, respuesta tras corrección o tras hipoglucemia, ejercicio, alcohol, enfermedad intercurrente y utilización de objetivo temporal, modos sueño/ejercicio, Boost/Ease-off o Función Actividad",
        "Un patrón repetido orienta el ajuste; un episodio aislado, no. El uso inadecuado de una función temporal puede explicar hiperglucemia o hipoglucemia sin que exista un error de configuración. Distinguir conducta de uso, ajuste del sistema e incidencia técnica",
        "Ajustar el parámetro, la conducta o la función correspondiente según el sistema, la franja horaria y la tabla 3; reforzar la educación si el problema deriva del uso de funciones temporales",
      ],
    },
    {
      etiqueta: "6",
      celdas: [
        "Patrón posprandial específico",
        "Momento del bolo; cantidad de hidratos estimada; composición rica en grasa/proteína; comida no anunciada; evolución de la glucosa en las 1–5 h posteriores; hipoglucemia tras el bolo o tras la respuesta automática del sistema",
        "En sistemas híbridos, el algoritmo compensa, pero no sustituye, el bolo prandial. Las excursiones posprandiales pueden reflejar bolo tardío, ratio inadecuada o una composición de la comida que requiere una estrategia específica",
        "Reforzar el bolo anticipado; ajustar la ratio I/HC si el patrón es consistente; utilizar funciones de comida lenta o bolo extendido si están disponibles; evitar correcciones adicionales precoces",
      ],
    },
    {
      etiqueta: "7",
      celdas: [
        "Respuesta automática, DTD y vigencia del plan de respaldo",
        "DTD actual; distribución entre bolos prandiales/bolos automáticos —MiniMed 780G o Control-IQ— y administración automática sostenida —CamAPS FX u Omnipod 5—; bolos correctores adicionales administrados por el paciente; cambios recientes de peso",
        "Una respuesta automática intensa o sostenida puede reflejar bolos omitidos o tardíos, ratio insuficiente, comida de absorción lenta, objetivo poco intensivo o mayor necesidad transitoria de insulina.",
        "Si la DTD ha cambiado de forma sostenida, reevaluar y actualizar la pauta de respaldo con insulina basal y rápida en pluma, incluyendo correcciones y actuación ante fallo del sistema",
      ],
    },
    {
      etiqueta: "8",
      celdas: [
        "Bandera roja: hiperglucemia persistente o sospecha de fallo de infusión",
        "Episodios de glucosa ≥ 250 mg/dl durante ≥ 2 h o sin respuesta a una corrección",
        "Sospechar fallo de infusión (set/pod despegado, caducado; dolor, humedad o calor en la inserción)",
        "Aplicar la figura 3. Si se identifica retrospectivamente, revisar si se aplicó correctamente el plan de seguridad, actualizarlo si procede y reforzar el entrenamiento",
      ],
    },
  ],
  notas: [
    "AID: administración automatizada de insulina; DTD: dosis total diaria de insulina; GMI: indicador de gestión de la glucosa; HC: hidratos de carbono; I/HC: ratio insulina/hidratos de carbono; MCG: monitorización continua de glucosa; TAR: tiempo por encima del rango; TBR: tiempo por debajo del rango; TIR: tiempo en rango; TITR: tiempo en rango estrecho; β-OHB: β-hidroxibutirato.",
    "Nota: esquema operativo para la revisión sistemática de la descarga en consulta, organizado desde la calidad y representatividad de los datos y la seguridad hasta la identificación de patrones e incidencias que requieren actuación inmediata. Siempre que sea posible, los hallazgos deben compararse con la descarga previa y con los cambios acordados en la última visita. En cada revisión se recomienda priorizar la seguridad y realizar pocos cambios documentados, reevaluables a las 2–4 semanas. En modalidades de asa cerrada completa sin bolo prandial, la interpretación de comidas y bolos debe adaptarse a las características del sistema. La figura 3 recoge el algoritmo de actuación ante hiperglucemia persistente y sospecha de fallo de infusión.",
  ],
};

export const T6: Tabla = {
  id: "T6",
  numero: 6,
  titulo: "Actuación ante exploraciones diagnósticas, procedimientos y cirugía",
  paginas: [21, 22],
  cabeceraEtiqueta: "Procedimiento",
  columnas: ["Bomba o pod", "Sensor/transmisor"],
  porSistema: false,
  filas: [
    {
      etiqueta: "Resonancia magnética (RM)",
      celdas: [
        "Retirar antes de entrar en la sala; con bomba con catéter, retirar también el set si la cánula es metálica. Al finalizar, reconectar o colocar un set o pod nuevo.",
        "Retirar, salvo autorización específica del modelo; colocar uno nuevo al finalizar.",
      ],
    },
    {
      // Corrección editorial 8/11: «computarizada».
      etiqueta: "Tomografía computarizada (TC)",
      celdas: [
        "Retirar y mantener fuera de la sala.",
        "Según el modelo: algunos pueden mantenerse fuera del área explorada (en ciertos modelos, con protección plomada); otros deben retirarse.",
      ],
    },
    {
      etiqueta: "Radiografía o DEXA",
      celdas: [
        "Retirar si lo exige el dispositivo; si puede mantenerse, dejar fuera del campo de exposición.",
        "Según el modelo: algunos pueden mantenerse y otros deben retirarse; seguir las instrucciones específicas del dispositivo.",
      ],
    },
    {
      etiqueta: "PET, medicina nuclear o radioterapia",
      celdas: [
        "Retirar si queda en el campo de exposición o así lo indican sus instrucciones.",
        "Según el modelo y el tipo de exposición.",
      ],
    },
    {
      etiqueta: "Diatermia o electrocirugía",
      celdas: [
        "En diatermia, retirar si así lo indican las instrucciones del dispositivo. En electrocirugía, mantener fuera del campo y evitar cánulas metálicas.",
        "En diatermia, retirar si así lo indican las instrucciones del dispositivo; en electrocirugía, actuar según el modelo y la localización. Si permanece y existe riesgo de interferencia, confirmar con glucemia capilar.",
      ],
    },
    {
      etiqueta: "Ecografía, ECG o endoscopia sin electrocirugía",
      celdas: ["Mantener si no interfiere con el procedimiento.", "Mantener."],
    },
    {
      etiqueta: "Cirugía corta (≤ 1 comida omitida), persona estable",
      celdas: [
        "Puede mantenerse la bomba o el AID, incluido el modo automático, si la situación clínica lo permite y existe protocolo institucional; situar el set fuera del campo y garantizar el acceso de anestesia al dispositivo.",
        "Mantener si es compatible con el procedimiento y las lecturas son fiables.",
      ],
    },
    {
      etiqueta: "Cirugía prolongada o compleja, o inestabilidad clínica",
      celdas: [
        "Suspender la bomba/AID y realizar transición a insulina intravenosa sin interrumpir la cobertura insulínica.",
        "Según el contexto clínico.",
      ],
    },
  ],
  notas: [
    "Nota: las recomendaciones deben contrastarse con las instrucciones de uso vigentes de cada componente y del mercado correspondiente. Si la retirada de la bomba o del pod se prolonga o se prevé que se prolongue más de aproximadamente 1 h, debe aplicarse la pauta prevista en «Interrupción del sistema y pauta alternativa»; las interrupciones de menor duración no suelen requerir medidas adicionales si no existe hiperglucemia o cetonemia. Para volver al sistema desde insulina intravenosa, una vez recuperada la estabilidad clínica, reanudar el sistema y mantener ambas vías en paralelo aproximadamente 60 min antes de suspender la perfusión, de acuerdo con el protocolo de transición utilizado.",
    "AID, administración automatizada de insulina; DEXA, absorciometría de rayos X de doble energía; ECG, electrocardiograma; PET, tomografía por emisión de positrones; RM, resonancia magnética; TC, tomografía computarizada.",
  ],
};

export const TABLAS: Record<TablaId, Tabla> = { T1, T2, T3, T4, T5, T6 };
export const LISTA_TABLAS: Tabla[] = [T1, T2, T3, T4, T5, T6];
