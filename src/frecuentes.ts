/* Preguntas frecuentes del buscador: cada una lleva los pasajes del capítulo (ids de los átomos
   de respuestas.ts) que se enseñan primero, rotulados «Pregunta frecuente», cuando la búsqueda se
   le parece. Cada una lleva su estado de revisión (REVISIONES, abajo, y docs/FRECUENTES.md):
   solo las aprobadas salen en la edición (FRECUENTES); las demás se conservan en FRECUENTES_TODAS
   y no entran en el emparejador, la página, las sugerencias ni el índice de búsqueda. La
   pregunta y sus «variantes» (otras formas de preguntarlo) son texto de la app; los pasajes, texto
   literal del capítulo. Para cambiar una, se edita aquí y se vuelve a pasar la revisión. */

import { CAPITULO } from "./contenido";
import APROBADAS from "./frecuentes.aprobadas.json";
import { contenidoDePasaje } from "./pasajes-fuente";
import { huella } from "./huella";

export interface Frecuente {
  id: string;
  tema: string;
  pregunta: string;
  variantes: string[];
  pasajes: string[];
  /* La pregunta es sobre un sistema (columna de la Tabla 1): sus casillas van primero. */
  sistema?: number;
  /* Como mucho una continuación operativa (una herramienta de la app), tras los pasajes. */
  siguiente?: { texto: string; ruta: string };
}

export const TODAS: Frecuente[] = [
  {
    id: "f01",
    tema: "Selección e indicación",
    pregunta: "¿Hace falta una HbA1c alta o un umbral concreto para indicar un sistema AID?",
    variantes: [
      "umbral de HbA1c para poner un asa cerrada",
      "criterios para indicar un sistema AID",
      "con buena HbA1c se puede poner asa cerrada",
    ],
    pasajes: ["t/06-indicaciones/b2/3", "t/06-indicaciones/b1/1"],
  },
  {
    id: "f02",
    tema: "Selección e indicación",
    pregunta: "¿A quién priorizar cuando no hay sistemas para todos?",
    variantes: [
      "priorización del asa cerrada con recursos limitados",
      "a quién dar primero un sistema AID",
    ],
    pasajes: ["t/06-indicaciones/b2/0", "t/06-indicaciones/b2/1", "t/06-indicaciones/b2/2"],
  },
  {
    id: "f03",
    tema: "Selección e indicación",
    pregunta: "¿Hace falta experiencia previa con bomba o sensor para empezar?",
    variantes: [
      "requisitos previos para el asa cerrada",
      "puede empezar sin haber usado bomba",
      "sin experiencia en MCG se puede iniciar",
    ],
    pasajes: ["t/06-indicaciones/b3/0", "t/06-indicaciones/b3/1"],
  },
  {
    id: "f04",
    tema: "Selección e indicación",
    pregunta: "¿Cuándo hay que tener precaución al indicar un AID?",
    variantes: [
      "contraindicaciones del asa cerrada",
      "cuándo no poner un sistema AID",
      "situaciones de precaución",
    ],
    pasajes: ["t/06-indicaciones/b3/2"],
  },
  {
    id: "f05",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué sistemas AID hay en España?",
    variantes: [
      "sistemas comercializados en España",
      "qué bombas de asa cerrada hay",
      "qué sistemas automáticos existen",
    ],
    pasajes: ["t/04-sistemas/b1/0", "t/04-sistemas/b1/2"],
  },
  {
    id: "f06",
    tema: "Sistemas y parámetros",
    pregunta: "¿Desde qué edad, peso y dosis se puede usar cada sistema?",
    variantes: [
      "edad mínima de cada sistema",
      "indicación por edad y peso",
      "dosis total mínima para cada bomba",
    ],
    pasajes: ["T1/7"],
  },
  {
    id: "f07",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué parámetros influyen en el modo automático de cada sistema?",
    variantes: [
      "qué mueve el automático",
      "qué parámetros cambian el algoritmo",
      "qué se puede ajustar en modo automático",
    ],
    pasajes: ["T1/10", "T1/nota/0/0"],
  },
  {
    id: "f08",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué objetivo de glucosa se puede programar en cada sistema?",
    variantes: [
      "objetivo glucémico del algoritmo",
      "objetivo en modo automático de cada bomba",
      "target de cada sistema",
    ],
    pasajes: ["T1/6", "T3/0"],
  },
  {
    id: "f09",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué sistemas hacen autocorrecciones?",
    variantes: [
      "bolos automáticos de corrección",
      "qué bomba autocorrige",
      "hace correcciones solo el sistema",
    ],
    pasajes: ["T1/5"],
  },
  {
    id: "f10",
    tema: "Sistemas y parámetros",
    pregunta: "¿Por qué hay que seguir anunciando las comidas en un sistema híbrido?",
    variantes: [
      "hace falta el bolo de la comida en asa cerrada",
      "por qué el sistema no lo hace todo solo",
      "anuncio de comidas en sistemas híbridos",
    ],
    pasajes: ["t/03-algoritmos/b2/0", "t/03-algoritmos/b2/1", "t/03-algoritmos/b2/2"],
  },
  {
    id: "f11",
    tema: "myLoop CamAPS",
    sistema: 2,
    pregunta: "¿Qué es Liberty y quién puede usarlo?",
    variantes: [
      "Liberty en el embarazo",
      "asa cerrada completa",
      "sistema sin bolos para las comidas",
      "CamAPS Liberty",
    ],
    // 13-10-2026: primero el pasaje propio de CamAPS FX/Liberty; en las filas de la Tabla 1
    // (indicación y gestación), la casilla de myLoop CamAPS a la vista y los otros sistemas
    // plegados. Edad: manda la Tabla 1 («Liberty: > 13 años»), decisión del autor del
    // 13-10-2026; por eso no va la frase del apartado 3 («no se recomienda en menores de 13 años»).
    pasajes: ["t/03-algoritmos/b3/1", "T1/7", "T1/8"],
  },
  {
    id: "f12",
    tema: "Sistemas y parámetros",
    pregunta: "¿Qué sistemas están autorizados en la gestación?",
    variantes: [
      "asa cerrada en el embarazo",
      "qué bomba usar en una embarazada",
      "autorización en gestación",
    ],
    pasajes: ["T1/8", "t/10-situaciones/b3/2", "t/10-situaciones/b3/3"],
  },
  {
    id: "f13",
    tema: "Inicio del sistema",
    pregunta: "¿Qué hay que tener listo antes de iniciar el sistema?",
    variantes: [
      "plan de respaldo antes de empezar",
      "preparación antes del inicio",
      "qué entregar antes de activar el automático",
    ],
    pasajes: ["T2/0", "l/07-educacion/b4"],
  },
  {
    id: "f14",
    tema: "Inicio del sistema",
    pregunta: "¿Cuánto reducir la dosis al pasar de MDI a un sistema AID?",
    variantes: [
      "reducción de la DTD al pasar de plumas a bomba",
      "transición desde MDI dosis inicial",
      "cuánto bajo la insulina al empezar con la bomba",
    ],
    pasajes: ["T2/2", "t/08-iniciacion/b7/0"],
  },
  {
    id: "f15",
    tema: "Inicio del sistema",
    pregunta: "¿Cómo calcular la ratio y el factor de sensibilidad iniciales?",
    variantes: [
      "regla del 450 y del 1700",
      "ratio inicial insulina hidratos",
      "factor de sensibilidad al inicio",
    ],
    pasajes: ["T2/4", "T2/5", "t/08-iniciacion/b6/1"],
  },
  {
    id: "f16",
    tema: "Inicio del sistema",
    pregunta: "¿Qué basal inicial programar si no hay un patrón previo?",
    variantes: ["tasa basal inicial", "perfil basal al empezar", "basal plana al inicio"],
    pasajes: ["T2/3", "t/08-iniciacion/b8/1"],
  },
  {
    id: "f17",
    tema: "Inicio del sistema",
    pregunta: "¿Qué hacer con la glargina U-300 o la degludec al iniciar el sistema?",
    variantes: [
      "solapamiento con basal ultralarga",
      "última dosis de degludec antes de la bomba",
      "efecto residual de la basal al empezar",
    ],
    pasajes: ["T2/8", "t/08-iniciacion/b7/1"],
  },
  {
    id: "f18",
    tema: "Inicio del sistema",
    pregunta: "¿Cada cuánto revisar al paciente tras iniciar el sistema?",
    variantes: [
      "seguimiento de los primeros 3 meses",
      "cuándo citar después del inicio",
      "primeras visitas tras empezar",
    ],
    pasajes: ["t/08-iniciacion/b9/0", "t/08-iniciacion/b9/1"],
  },
  {
    id: "f19",
    tema: "Educación y plan de seguridad",
    pregunta: "¿Qué contenidos debe tener la educación del paciente?",
    variantes: [
      "qué enseñar antes de empezar",
      "contenidos del programa educativo",
      "PEET contenidos mínimos",
    ],
    pasajes: ["l/07-educacion/b3"],
  },
  {
    id: "f20",
    tema: "Educación y plan de seguridad",
    pregunta: "¿Qué debe incluir el plan de seguridad?",
    variantes: [
      "qué lleva el plan de seguridad",
      "material de respaldo que debe tener el paciente",
      "plan de seguridad del asa cerrada",
    ],
    pasajes: ["l/07-educacion/b4"],
  },
  {
    id: "f21",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cómo revisar una descarga de forma ordenada?",
    variantes: [
      "pasos para leer la descarga",
      "análisis de la descarga en consulta",
      "por dónde empiezo a mirar la descarga",
    ],
    pasajes: ["t/09-descarga/b1/2", "T5/nota/1/2"],
  },
  {
    id: "f22",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cuánto uso del sensor hace falta para interpretar la descarga?",
    variantes: [
      "uso mínimo de MCG para valorar",
      "datos suficientes de sensor",
      "porcentaje de uso del sensor",
    ],
    pasajes: ["T5/0"],
  },
  {
    id: "f23",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué objetivos de TIR, TBR y TAR hay que buscar?",
    variantes: [
      "objetivos de MCG",
      "tiempo en rango objetivo",
      "cuánto tiempo por debajo del rango se acepta",
    ],
    pasajes: ["t/05-resultados/b2/0", "t/05-resultados/b2/1", "t/05-resultados/b2/2"],
  },
  {
    id: "f24",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cuánto se pueden cambiar los parámetros de una vez?",
    variantes: [
      "porcentaje de ajuste de ratio o basal",
      "cuánto modificar el factor de sensibilidad",
      "cada cuánto reevaluar un cambio",
    ],
    pasajes: ["t/09-descarga/b2/0", "t/09-descarga/b2/1"],
  },
  {
    id: "f25",
    tema: "Descarga y seguimiento",
    pregunta: "Hay hipoglucemias en la descarga: ¿qué revisar antes de intensificar?",
    variantes: [
      "TBR alto qué hacer",
      "tiempo por debajo del rango elevado",
      "antes de bajar el objetivo con hipoglucemias",
    ],
    pasajes: ["t/09-descarga/b10/0", "t/09-descarga/b10/1", "t/05-resultados/b7/1"],
  },
  {
    id: "f26",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué significa un exceso de autocorrecciones?",
    variantes: [
      "muchos bolos automáticos de corrección",
      "demasiadas autocorrecciones en la descarga",
    ],
    pasajes: ["t/09-descarga/b11/0", "t/09-descarga/b11/1"],
  },
  {
    id: "f27",
    tema: "Descarga y seguimiento",
    pregunta: "El paciente sale a menudo del modo automático: ¿qué hacer?",
    variantes: [
      "salidas repetidas del modo automático",
      "poco tiempo en automático",
      "se cae del automático",
    ],
    pasajes: ["t/09-descarga/b12/0", "t/09-descarga/b22/1", "T5/0"],
  },
  {
    id: "f28",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué revisar ante hipoglucemias nocturnas repetidas?",
    variantes: [
      "hipoglucemia nocturna en asa cerrada",
      "bajadas de madrugada",
      "hipos por la noche con la bomba",
    ],
    pasajes: ["t/09-descarga/b7/0", "t/09-descarga/b7/1"],
  },
  {
    id: "f29",
    tema: "Descarga y seguimiento",
    pregunta: "¿Qué son los hidratos fantasma y qué hacer si se detectan?",
    variantes: ["ghost carbs", "meter hidratos falsos para forzar un bolo", "hidratos de mentira"],
    pasajes: ["t/09-descarga/b21/0", "t/09-descarga/b21/1", "t/09-descarga/b21/2"],
  },
  {
    id: "f30",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cómo manejar un bolo olvidado o retrasado?",
    variantes: ["se olvidó el bolo de la comida", "bolo tarde qué hacer", "bolo omitido"],
    pasajes: ["t/09-descarga/b20/1", "t/09-descarga/b20/2"],
  },
  {
    id: "f31",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Cuándo sospechar un fallo del set de infusión?",
    variantes: [
      "signos de que el set no funciona",
      "hiperglucemia que no baja con la bomba",
      "sospecha de fallo de infusión",
    ],
    pasajes: ["t/09-descarga/b16/0", "t/09-descarga/b16/2", "t/09-descarga/b16/4"],
  },
  {
    id: "f32",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué hacer según la cifra de cetonemia?",
    variantes: [
      "tramos de cetonas",
      "cetonas en sangre qué hacer",
      "β-OHB qué significa cada cifra",
    ],
    pasajes: ["l/09-descarga/b17"],
  },
  {
    id: "f33",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué dosis de insulina con pluma si no hay un plan específico?",
    variantes: [
      "corrección con pluma en UI por kilo",
      "dosis de rescate con pluma",
      "cuánta insulina con pluma por cetonas",
    ],
    pasajes: ["t/09-descarga/b19/0", "F3/naranja", "F3/nota"],
  },
  {
    id: "f34",
    tema: "Incidencias y cetonemia",
    pregunta: "¿El sistema cuenta la insulina puesta con pluma?",
    variantes: [
      "la insulina de la pluma cuenta como activa",
      "riesgo de apilamiento con la pluma",
      "cuándo repetir la corrección con pluma",
    ],
    pasajes: ["F3/pie/0", "t/09-descarga/b19/2"],
  },
  {
    id: "f35",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Cuándo hay que ir a urgencias por cetonas?",
    variantes: ["signos de cetoacidosis", "cuándo derivar al hospital", "cetonas altas urgencias"],
    pasajes: ["F3/rojo"],
  },
  {
    id: "f36",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué vigilar en una persona tratada con iSGLT2?",
    variantes: [
      "gliflozinas y asa cerrada",
      "iSGLT2 cetoacidosis euglucémica",
      "toma dapagliflozina o empagliflozina",
    ],
    pasajes: ["t/09-descarga/b16/1", "F3/pie/1"],
  },
  {
    id: "f37",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Cuántos hidratos dar en una hipoglucemia leve con un sistema AID?",
    variantes: [
      "tratar una hipoglucemia con asa cerrada",
      "gramos de azúcar para una bajada",
      "regla de los 15 gramos en AID",
    ],
    // Pasajes aprobados el 8-10-2026: condicionantes, cantidades y reevaluación juntos. La
    // propuesta del 12-10 (poner delante «suele requerir menos hidratos», t/07-educacion/b6/1) se
    // descartó el 13-10-2026 por decisión del autor: no es una regla universal.
    pasajes: ["t/07-educacion/b7/0", "t/07-educacion/b7/1"],
  },
  {
    id: "f38",
    tema: "Interrupción del sistema",
    pregunta: "¿Cuánto tiempo puede estar desconectado el sistema?",
    variantes: [
      "bolo antes de una desconexión breve",
      "cuánto tiempo sin bomba",
      "interrupción breve del sistema",
    ],
    pasajes: ["t/07-educacion/b11/4", "t/07-educacion/b11/1"],
  },
  {
    id: "f39",
    tema: "Interrupción del sistema",
    pregunta: "¿Qué dosis basal poner en la pauta alternativa con plumas?",
    variantes: ["pasar a plumas si falla la bomba", "basal de respaldo", "pauta alternativa MDI"],
    pasajes: ["t/07-educacion/b13/0", "t/07-educacion/b13/1"],
  },
  {
    id: "f40",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué pasa con las lecturas bajas al dormir sobre el sensor?",
    variantes: [
      "compresión del sensor",
      "hipoglucemias falsas por la noche",
      "baja la glucosa al apoyarse en el sensor",
    ],
    pasajes: ["t/09-descarga/b23/0", "t/09-descarga/b23/1"],
  },
  {
    id: "f41",
    tema: "Situaciones especiales",
    pregunta: "¿Cómo preparar el ejercicio con un sistema AID?",
    variantes: [
      "modo ejercicio antes de entrenar",
      "ejercicio aeróbico con asa cerrada",
      "objetivo temporal para el deporte",
    ],
    pasajes: ["t/10-situaciones/b20/1", "t/10-situaciones/b22/0", "t/10-situaciones/b22/1"],
  },
  {
    id: "f42",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede hacer ejercicio con la glucosa alta?",
    variantes: [
      "ejercicio con hiperglucemia",
      "deporte con cetonas",
      "glucosa por encima de 270 y ejercicio",
    ],
    pasajes: ["t/10-situaciones/b20/2", "t/10-situaciones/b20/3"],
  },
  {
    id: "f43",
    tema: "Situaciones especiales",
    pregunta: "¿Qué hacer con la bomba o el sensor en una resonancia o un TC?",
    variantes: [
      "resonancia magnética con bomba",
      "TAC con el sensor puesto",
      "pruebas de imagen y asa cerrada",
    ],
    pasajes: ["T6/0", "T6/1", "t/10-situaciones/b41/2"],
  },
  {
    id: "f44",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede mantener el sistema en una cirugía?",
    variantes: ["operación con la bomba puesta", "cirugía y asa cerrada", "quirófano con AID"],
    pasajes: ["T6/6", "T6/7"],
  },
  {
    id: "f45",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede mantener el sistema durante un ingreso?",
    variantes: [
      "asa cerrada en el hospital",
      "ingreso hospitalario con bomba",
      "cuándo retirar el sistema en planta",
    ],
    pasajes: ["t/10-situaciones/b34/0", "t/10-situaciones/b34/3", "t/10-situaciones/b36/0"],
  },
  {
    id: "f46",
    tema: "Situaciones especiales",
    pregunta: "¿Qué objetivos glucémicos hay en la gestación?",
    variantes: ["HbA1c objetivo en el embarazo", "TIR en gestación", "objetivos preconcepcionales"],
    pasajes: ["t/10-situaciones/b4/1", "t/10-situaciones/b4/2", "t/10-situaciones/b4/3"],
  },
  {
    id: "f47",
    tema: "Situaciones especiales",
    pregunta: "Con cetosis y glucemia normal en una enfermedad, ¿se suspende la insulina?",
    variantes: [
      "vómitos y cetonas con glucosa normal",
      "enfermedad intercurrente con cetosis",
      "no come y tiene cetonas",
    ],
    pasajes: ["t/10-situaciones/b27/2", "t/10-situaciones/b27/1"],
  },
  {
    id: "f48",
    tema: "Situaciones especiales",
    pregunta: "¿Qué hacer si un paciente usa un sistema DIY?",
    variantes: [
      "AndroidAPS o Loop casero",
      "sistemas de código abierto en consulta",
      "paciente con asa cerrada hecha en casa",
    ],
    pasajes: ["t/11-diy/b3/0", "t/11-diy/b3/1"],
  },
  {
    id: "f49",
    tema: "Situaciones especiales",
    pregunta: "¿Qué recomendar sobre el alcohol con un sistema AID?",
    variantes: [
      "salir de fiesta con la bomba",
      "alcohol e hipoglucemia diferida",
      "beber alcohol con asa cerrada",
    ],
    pasajes: ["t/10-situaciones/b14/2"],
  },
  {
    id: "f50",
    tema: "Situaciones especiales",
    pregunta: "¿Se puede mantener el sistema con glucocorticoides?",
    variantes: ["corticoides y asa cerrada", "dexametasona con la bomba", "Boost con corticoides"],
    pasajes: ["t/10-situaciones/b29/0", "t/10-situaciones/b29/1", "t/10-situaciones/b29/2"],
  },
  // Diez más (0.31.0, 10-10-2026), de las consultas sin pregunta frecuente de las pruebas simuladas.
  {
    id: "f51",
    tema: "Educación y plan de seguridad",
    pregunta: "¿Qué hacer si la bomba falla o se queda sin insulina?",
    variantes: [
      "la bomba se ha quedado sin insulina",
      "fallo de la bomba qué hacer",
      "se ha roto la bomba",
      "pauta alternativa si falla el sistema",
    ],
    pasajes: ["t/07-educacion/b11/0", "t/07-educacion/b11/4", "t/07-educacion/b13/0"],
    siguiente: { texto: "Interrupción del sistema, paso a paso", ruta: "#/consultar/interrupcion" },
  },
  {
    id: "f52",
    tema: "Educación y plan de seguridad",
    pregunta: "¿Cuándo confirmar la glucosa con glucemia capilar?",
    variantes: [
      "cuándo pinchar glucemia capilar",
      "glucemia capilar o sensor",
      "cuándo no fiarse del sensor",
    ],
    pasajes: ["t/02-componentes/b4/1", "t/10-situaciones/b38/2"],
  },
  {
    id: "f53",
    tema: "Incidencias y cetonemia",
    pregunta: "El sensor pierde la señal: ¿qué hacer?",
    variantes: [
      "pérdida de señal del sensor",
      "el sensor no conecta por bluetooth",
      "sensor sin señal",
    ],
    pasajes: ["t/09-descarga/b22/0", "t/09-descarga/b22/1", "t/02-componentes/b4/2"],
  },
  {
    id: "f54",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué revisar ante irritación de la piel por sensores o sistemas de infusión?",
    variantes: [
      "irritación por el adhesivo",
      "problemas de piel con el sensor",
      "rotación de las zonas de inserción",
    ],
    pasajes: ["t/09-descarga/b24/2", "t/09-descarga/b24/1", "t/09-descarga/b24/4"],
  },
  {
    id: "f55",
    tema: "Incidencias y cetonemia",
    pregunta: "¿Qué revisar ante fallos repetidos de infusión?",
    variantes: [
      "la cánula se dobla",
      "acodamientos del catéter",
      "qué set usar si falla la infusión",
      "cánula metálica",
    ],
    pasajes: ["t/09-descarga/b25/0", "t/09-descarga/b25/1"],
  },
  {
    id: "f56",
    tema: "Incidencias y cetonemia",
    pregunta: "Tras una corrección con pluma, ¿qué precauciones hay antes de volver a corregir?",
    variantes: [
      "cuánto esperar tras corregir con pluma",
      "apilamiento de insulina con pluma",
      "corregir con pluma y volver a corregir",
    ],
    pasajes: ["F3/pie/0", "l/09-descarga/b28/0"],
  },
  {
    id: "f57",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cómo manejar una comida rica en grasa o proteína?",
    variantes: [
      "hiperglucemia tardía tras la pizza",
      "comida grasa con la bomba",
      "bolo extendido en asa cerrada",
    ],
    pasajes: ["T4/5", "t/09-descarga/b6/0", "t/09-descarga/b6/1", "t/09-descarga/b6/2"],
  },
  {
    id: "f58",
    tema: "Situaciones especiales",
    pregunta: "¿Qué precauciones tomar con el sistema en el control del aeropuerto?",
    variantes: [
      "escáner del aeropuerto",
      "pasar el arco de seguridad con el sensor",
      "viajar en avión con la bomba",
    ],
    pasajes: ["t/10-situaciones/b43/0"],
  },
  {
    id: "f59",
    tema: "Incidencias y cetonemia",
    pregunta: "Demasiadas alarmas: ¿qué hacer con la fatiga por alarmas?",
    variantes: ["fatiga por alarmas", "el paciente apaga las alarmas", "sobrecarga de alertas"],
    pasajes: ["t/09-descarga/b26/1"],
  },
  {
    id: "f60",
    tema: "Situaciones especiales",
    pregunta: "¿Qué hacer ante una enfermedad intercurrente (gripe, fiebre)?",
    variantes: [
      "tengo gripe con la bomba",
      "fiebre y glucosa alta",
      "días de enfermedad con asa cerrada",
    ],
    pasajes: ["t/10-situaciones/b27/0", "t/10-situaciones/b27/1", "t/10-situaciones/b27/3"],
    siguiente: { texto: "Hiperglucemia y cetonemia", ruta: "#/consultar/figura-3" },
  },
  // 0.35.0: una comparación entre variantes del mismo sistema es una sola pregunta.
  {
    id: "f61",
    tema: "Tandem Control-IQ",
    pregunta: "¿Qué diferencia hay entre Control-IQ y Control-IQ+?",
    variantes: [
      "diferencias entre control-iq y control-iq plus",
      "qué diferencia hay con control-iq+",
      "control-iq plus diferencias",
    ],
    pasajes: ["T1/7", "T1/8", "T3/1", "T4/5", "t/09-descarga/b6/1", "t/04-sistemas/b4/1"],
    sistema: 1,
  },
  {
    id: "f62",
    tema: "Uso en el día a día",
    pregunta: "En el ejercicio, ¿se anuncian al sistema los hidratos para evitar la bajada?",
    variantes: [
      "hidratos durante el ejercicio sin anunciar",
      "se meten en la bomba los hidratos del deporte",
    ],
    pasajes: ["t/10-situaciones/b22/2", "t/10-situaciones/b22/3", "t/10-situaciones/b22/4"],
  },
  {
    id: "f63",
    tema: "Uso en el día a día",
    // Revisada el 13-10-2026 (sigue pendiente): el bolo prandial, en las modalidades que lo
    // requieren (híbridas); las de asa cerrada completa, aparte.
    pregunta: "En los sistemas híbridos, ¿cuándo hay que poner el bolo de la comida?",
    variantes: [
      "cuánto antes de comer se pone el bolo",
      "bolo prandial anticipado",
      "bolo de la comida con asa cerrada híbrida",
    ],
    pasajes: ["l/07-educacion/b3/3", "t/09-descarga/b2/3", "t/09-descarga/b5/1", "T5/nota/1/3"],
  },
  {
    id: "f64",
    tema: "Uso en el día a día",
    pregunta: "La glucosa sube en la primera hora después de comer: ¿qué revisar?",
    variantes: ["pico posprandial precoz", "sube mucho después de comer"],
    pasajes: ["t/09-descarga/b5/0", "t/09-descarga/b5/1"],
  },
  {
    id: "f65",
    tema: "Uso en el día a día",
    pregunta: "Glucosa alta al despertar: ¿qué revisar?",
    variantes: ["hiperglucemia matutina", "fenómeno del alba con asa cerrada"],
    pasajes: ["t/09-descarga/b8/0", "t/09-descarga/b8/1"],
  },
  {
    id: "f66",
    tema: "Uso en el día a día",
    pregunta: "El TIR está bien pero la glucosa oscila mucho: ¿qué mirar?",
    variantes: ["mucha variabilidad con buen tiempo en rango", "coeficiente de variación alto"],
    pasajes: ["t/09-descarga/b9/0", "t/09-descarga/b9/1"],
  },
  {
    id: "f67",
    tema: "Uso en el día a día",
    pregunta: "Ejercicio de fuerza o muy intenso: ¿se sube el objetivo?",
    variantes: ["pesas o sprint con asa cerrada", "ejercicio anaeróbico sube la glucosa"],
    pasajes: ["T4/1", "t/10-situaciones/b23/1"],
  },
  {
    id: "f68",
    tema: "Uso en el día a día",
    pregunta: "Después del ejercicio, ¿hasta cuándo mantener el objetivo alto?",
    variantes: ["hipoglucemia diferida tras el deporte", "cuándo quitar el modo ejercicio"],
    pasajes: ["t/10-situaciones/b25/0", "t/10-situaciones/b25/1"],
  },
  {
    id: "f69",
    tema: "Uso en el día a día",
    pregunta: "Desconexión breve (ducha, deporte, una prueba): ¿qué hacer con la insulina?",
    variantes: ["desconectar la bomba un rato", "bolo antes de desconectar la bomba"],
    // Revisada el 13-10-2026 (sigue pendiente): con el umbral de aproximadamente 1 h sin
    // administración y la pauta de respaldo individualizada.
    pasajes: [
      "t/07-educacion/b11/1",
      "t/07-educacion/b11/2",
      "t/07-educacion/b11/3",
      "t/07-educacion/b11/4",
      "t/07-educacion/b12/1",
      "t/07-educacion/b12/2",
      "t/07-educacion/b12/3",
    ],
  },
  {
    id: "f70",
    tema: "Uso en el día a día",
    pregunta: "Tras una resonancia con el sensor puesto, ¿se puede fiar de las lecturas?",
    variantes: ["lecturas del sensor después de una resonancia", "sensor tras RM"],
    pasajes: ["t/10-situaciones/b42/0", "t/10-situaciones/b42/1"],
  },
  {
    id: "f71",
    tema: "Uso en el día a día",
    pregunta: "¿Qué errores conviene evitar al revisar una descarga?",
    variantes: ["errores frecuentes en la consulta de descarga", "qué no hacer con la descarga"],
    pasajes: ["l/09-descarga/b28/0", "l/09-descarga/b28/1", "l/09-descarga/b28/2"],
  },
  {
    id: "f72",
    tema: "Situaciones especiales",
    pregunta: "Persona mayor con deterioro cognitivo: ¿qué tener en cuenta?",
    variantes: ["asa cerrada en ancianos", "sistema AID en persona mayor"],
    pasajes: ["t/10-situaciones/b17/1", "t/10-situaciones/b17/3", "t/10-situaciones/b17/4"],
  },
  {
    id: "f73",
    tema: "Situaciones especiales",
    pregunta: "En diálisis, ¿se puede mantener el sistema?",
    variantes: ["asa cerrada en hemodiálisis", "AID y enfermedad renal avanzada"],
    pasajes: [
      "t/10-situaciones/b31/1",
      "t/10-situaciones/b31/2",
      "t/10-situaciones/b31/3",
      "t/10-situaciones/b31/5",
    ],
  },
  {
    id: "f74",
    tema: "Situaciones especiales",
    pregunta: "Adolescente: ¿cómo plantear el seguimiento remoto de los padres?",
    variantes: ["los padres ven los datos del adolescente", "seguimiento compartido adolescente"],
    pasajes: ["t/10-situaciones/b15/0", "t/10-situaciones/b15/1"],
  },
  {
    id: "f75",
    tema: "Descarga y seguimiento",
    pregunta: "¿Cuándo reconsiderar el tratamiento con asa cerrada?",
    variantes: ["retirar el sistema AID", "cuándo dejar el asa cerrada"],
    pasajes: ["t/08-iniciacion/b12/2", "t/08-iniciacion/b12/3"],
  },
  {
    id: "f76",
    tema: "Descarga y seguimiento",
    pregunta: "Con buen control, ¿cada cuánto revisar?",
    variantes: ["frecuencia de visitas con asa cerrada estable", "seguimiento a largo plazo"],
    pasajes: ["t/08-iniciacion/b11/0", "t/08-iniciacion/b11/2"],
  },
  {
    id: "f77",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G: ¿cómo decide y qué aprende?",
    variantes: ["algoritmo SmartGuard de la 780G", "autoaprendizaje de la 780G"],
    pasajes: ["T1/3", "T1/4"],
    sistema: 0,
  },
  {
    id: "f78",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G: ¿qué objetivo poner y para qué sirve el objetivo temporal?",
    variantes: ["objetivo 100 en la 780G", "objetivo temporal 150 MiniMed"],
    pasajes: ["T1/6", "T3/0", "T4/0"],
    sistema: 0,
  },
  {
    id: "f79",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G: ¿qué ajustes mueven de verdad el modo automático?",
    variantes: ["qué se puede tocar en la 780G", "insulina activa en la 780G"],
    pasajes: ["T1/10", "T3/4", "T3/1", "T3/3"],
    sistema: 0,
  },
  {
    id: "f80",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G: muchas autocorrecciones, ¿es buena señal?",
    variantes: ["la 780G pone muchos bolos automáticos", "autocorrecciones 780G"],
    pasajes: ["T1/5", "t/09-descarga/b11/0", "t/09-descarga/b11/1"],
    sistema: 0,
  },
  {
    id: "f81",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G en la gestación: ¿qué limitación tiene?",
    variantes: ["780G embarazo objetivo", "MiniMed gestación hidratos fantasma"],
    pasajes: ["T1/8", "t/10-situaciones/b8/0", "t/10-situaciones/b8/1"],
    sistema: 0,
  },
  {
    id: "f82",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G: ¿cómo se inicia el modo automático?",
    variantes: ["arrancar SmartGuard", "inicio de la 780G"],
    pasajes: ["T2/1"],
    sistema: 0,
  },
  {
    id: "f83",
    tema: "MiniMed 780G",
    pregunta: "MiniMed 780G: ¿qué hacer ante enfermedad leve o una comida grasa?",
    variantes: ["780G comida grasa", "MiniMed enfermedad leve"],
    pasajes: ["T4/3", "T4/5"],
    sistema: 0,
  },
  {
    id: "f84",
    tema: "Tandem Control-IQ",
    pregunta: "Control-IQ: ¿por qué hay que afinar la basal y el factor de sensibilidad?",
    variantes: ["Control-IQ no aprende", "basal programada en Tandem"],
    pasajes: ["T1/3", "T3/1", "T3/3"],
    sistema: 1,
  },
  {
    id: "f85",
    tema: "Tandem Control-IQ",
    pregunta: "Control-IQ: ¿cómo usar los modos sueño y ejercicio?",
    variantes: ["modo sueño Tandem", "modo ejercicio Control-IQ"],
    pasajes: ["T1/6", "T4/2", "T4/0"],
    sistema: 1,
  },
  {
    id: "f86",
    tema: "Tandem Control-IQ",
    pregunta: "Control-IQ: ¿cuándo pone bolos automáticos de corrección?",
    variantes: ["autocorrecciones de Control-IQ", "bolo automático Tandem"],
    pasajes: ["T1/5"],
    sistema: 1,
  },
  {
    id: "f87",
    tema: "Tandem Control-IQ",
    pregunta: "Control-IQ+ en la gestación: ¿cómo se intensifica?",
    variantes: ["Control-IQ+ embarazo", "modo sueño continuo en la gestación"],
    pasajes: [
      "t/10-situaciones/b9/0",
      "t/10-situaciones/b9/1",
      "t/10-situaciones/b9/2",
      "t/10-situaciones/b9/3",
      "t/10-situaciones/b9/4",
    ],
    sistema: 1,
  },
  {
    id: "f88",
    tema: "Tandem Control-IQ",
    pregunta: "Control-IQ: ¿cómo se inicia el modo automático?",
    variantes: ["arrancar Control-IQ", "inicio de Tandem"],
    pasajes: ["T2/1"],
    sistema: 1,
  },
  {
    id: "f89",
    tema: "Tandem Control-IQ",
    pregunta: "Control-IQ: ¿qué hacer ante enfermedad leve o una hiperglucemia puntual?",
    variantes: ["Tandem enfermedad leve", "Control-IQ hiperglucemia aislada"],
    pasajes: ["T4/3", "T4/4"],
    sistema: 1,
  },
  {
    id: "f90",
    tema: "myLoop CamAPS",
    pregunta: "CamAPS FX: ¿dónde está el algoritmo y qué aprende?",
    variantes: ["algoritmo de CamAPS en el móvil", "CamAPS en el móvil"],
    pasajes: ["T1/2", "T1/3", "T1/1"],
    sistema: 2,
  },
  {
    id: "f91",
    tema: "myLoop CamAPS",
    pregunta: "CamAPS FX: ¿para qué sirven Boost y Ease-off?",
    variantes: ["qué es Boost", "qué es Ease-off"],
    pasajes: ["T3/0", "t/10-situaciones/b7/1", "T4/3"],
    sistema: 2,
  },
  {
    id: "f92",
    tema: "myLoop CamAPS",
    pregunta: "CamAPS FX: ¿cuentan el factor de sensibilidad y la insulina activa en automático?",
    variantes: ["factor de sensibilidad en CamAPS", "insulina activa CamAPS"],
    pasajes: ["t/10-situaciones/b7/0", "T3/3", "T3/4"],
    sistema: 2,
  },
  {
    id: "f93",
    tema: "myLoop CamAPS",
    pregunta: "CamAPS FX en la gestación: ¿qué objetivo poner?",
    variantes: ["CamAPS embarazo objetivo", "objetivo 80 en la gestación"],
    pasajes: ["T1/8", "t/10-situaciones/b6/2", "t/10-situaciones/b6/3", "t/10-situaciones/b6/4"],
    sistema: 2,
  },
  {
    id: "f94",
    tema: "myLoop CamAPS",
    pregunta: "CamAPS FX: ¿qué hacer con una comida grasa o un ejercicio intenso?",
    variantes: ["comida de absorción lenta CamAPS", "Boost en el ejercicio"],
    pasajes: ["T4/5", "T4/1"],
    sistema: 2,
  },
  {
    id: "f95",
    tema: "myLoop CamAPS",
    pregunta: "CamAPS FX: ¿cómo se inicia el modo automático?",
    variantes: ["arrancar CamAPS", "inicio de CamAPS"],
    pasajes: ["T2/1"],
    sistema: 2,
  },
  {
    id: "f96",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿qué es la basal adaptativa y por qué cambia con cada pod?",
    variantes: ["SmartAdjust basal adaptativa", "Omnipod aprende con cada pod"],
    pasajes: ["T1/3", "T1/4", "T3/2"],
    sistema: 3,
  },
  {
    id: "f97",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿para qué sirve la basal programada?",
    variantes: ["basal programada en Omnipod", "basal del primer pod"],
    pasajes: ["T3/1", "T2/1"],
    sistema: 3,
  },
  {
    id: "f98",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿hace autocorrecciones?",
    variantes: ["bolos automáticos en Omnipod", "factor de sensibilidad Omnipod"],
    pasajes: ["T1/5", "T3/3"],
    sistema: 3,
  },
  {
    id: "f99",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿cuándo usar la Función Actividad?",
    variantes: ["Función Actividad Omnipod", "objetivo 150 en el Omnipod"],
    pasajes: ["T3/0", "T4/0"],
    sistema: 3,
  },
  {
    id: "f100",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿se puede nadar con el pod?",
    variantes: ["Omnipod en la piscina", "nadar con Omnipod"],
    pasajes: ["t/10-situaciones/b24/1", "t/10-situaciones/b24/2"],
    sistema: 3,
  },
  {
    id: "f101",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿qué hacer si el pod se despega o falla?",
    variantes: ["se cae el pod", "pod despegado qué hago"],
    pasajes: ["t/07-educacion/b11/1", "t/07-educacion/b11/4"],
    sistema: 3,
  },
  {
    id: "f102",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿se puede usar en la gestación?",
    variantes: ["Omnipod embarazo", "Omnipod gestación autorizado"],
    pasajes: ["T1/8", "t/10-situaciones/b3/3"],
    sistema: 3,
  },
  {
    id: "f103",
    tema: "Omnipod 5",
    pregunta: "Omnipod 5: ¿qué hacer con una comida grasa?",
    variantes: ["bolo extendido Omnipod", "Omnipod comida grasa"],
    pasajes: ["T4/5"],
    sistema: 3,
  },
];

/* Registro de revisión. Aprobación = visto bueno del autor a la correspondencia pregunta–pasajes
   (docs/FRECUENTES.md, «Estado de revisión»), ligada a la huella de lo aprobado
   (frecuentes.aprobadas.json: pregunta, variantes, pasajes, sistema, continuación y PDF fuente).
   Si cambia cualquiera de esas cosas, la huella deja de coincidir y la pregunta vuelve a
   «borrador» y sale de la edición hasta una nueva aprobación (npm run aprobar:frecuentes). */
export type EstadoFrecuente = "aprobada" | "borrador";
export interface Revision {
  estado: EstadoFrecuente;
  fecha: string;
  registro: string;
}
/* Propuestas de cambio sobre preguntas ya aprobadas: no se usan en la app (la edición sigue con
   los pasajes aprobados) hasta que el autor las revise. */
export const PROPUESTAS: Record<string, { pasajes: string[]; nota: string; fecha: string }> = {
  /* f11 (13-10-2026), ya aplicada arriba; se conserva aquí como registro. */
  f11: {
    pasajes: ["t/03-algoritmos/b3/1", "T1/7", "T1/8"],
    nota: "Primero el pasaje propio de CamAPS FX/Liberty; en las filas de la Tabla 1, la casilla de myLoop CamAPS a la vista y los otros sistemas plegados. Edad: manda la Tabla 1 («Liberty: > 13 años»), decisión del autor del 13-10-2026.",
    fecha: "2026-10-13",
  },
};

/* Huella de lo que se revisa de una pregunta: la pregunta, sus variantes, los ids de sus
   pasajes y EL CONTENIDO de cada uno (bloque, fila, figura o sigla, con su contexto: V54-05),
   el sistema, la continuación y el PDF fuente. Cambiar cualquiera la deja sin revisión vigente. */
export function huellaDe(f: Frecuente): string {
  return huella(
    JSON.stringify([
      f.pregunta,
      f.variantes,
      f.pasajes,
      f.pasajes.map(contenidoDePasaje),
      f.sistema ?? null,
      f.siguiente ?? null,
      CAPITULO.pdfSha256,
    ]),
  );
}

/* Cada revisión es un evento (fecha, versión, evidencia y huella de lo revisado); se añaden, no
   se sustituyen (npm run aprobar:frecuentes). Vigente = el último evento con la huella actual. */
export interface EventoRevision {
  fecha: string;
  version: string;
  evidencia: string;
  huella: string;
}
export const EVENTOS = APROBADAS as Record<string, EventoRevision[]>;

export function revisionDe(f: Frecuente): Revision {
  const ultimo = EVENTOS[f.id]?.at(-1);
  if (!ultimo) return { estado: "borrador", fecha: "", registro: "Sin revisión registrada" };
  if (ultimo.huella === huellaDe(f))
    return { estado: "aprobada", fecha: ultimo.fecha, registro: ultimo.evidencia };
  return {
    estado: "borrador",
    fecha: "",
    registro: `Cambió después de su revisión del ${ultimo.fecha}: necesita una revisión nueva`,
  };
}

export type FrecuenteRevisada = Frecuente & { revision: Revision };
export const FRECUENTES_TODAS: FrecuenteRevisada[] = TODAS.map((f) => ({
  ...f,
  revision: revisionDe(f),
}));
/* Las que salen en esta edición: solo las aprobadas. */
export const FRECUENTES: FrecuenteRevisada[] = FRECUENTES_TODAS.filter(
  (f) => f.revision.estado === "aprobada",
);
