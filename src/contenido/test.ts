/* Test de autoevaluación: las 10 preguntas del AUTOR (cuestionario v2, mayo de 2026), con las
   convenciones de la app (DM1, «duración de la insulina activa»). PENDIENTES DE VALIDACIÓN DEL
   AUTOR: se muestran con ese rótulo hasta que las apruebe (`validada: true`).
   `explicacion` es texto del autor (no del capítulo). `citas` son frases LITERALES del capítulo
   final con su página: el test de contenido comprueba que cada una está en su bloque.
   Comprobación del 3-10-2026: las 10 respaldadas por el texto final; la 3 con un matiz
   («deben ofrecerse» frente a «pueden considerarse», p. 1), pendiente de decisión del autor. */

export interface CitaCapitulo {
  /* Apartado (slug) y ancla del bloque. */
  apartado: string;
  ancla: string;
  p: number;
  /* Literal; «[…]» separa dos trozos del mismo bloque. */
  texto: string;
}

export interface Pregunta {
  id: string;
  validada: boolean;
  enunciado: string;
  opciones: string[];
  /* Índice de la opción correcta. */
  correcta: number;
  /* Explicación del autor (no es texto del capítulo). */
  explicacion: string;
  citas: CitaCapitulo[];
  /* Apartado y ancla que la desarrolla. */
  apartado: string;
  ancla?: string;
  pagina: number;
}

export const PREGUNTAS: Pregunta[] = [
  {
    id: "q01",
    validada: false,
    enunciado:
      "¿Cuál de las siguientes afirmaciones resume mejor los retos actuales de los sistemas AID en diabetes tipo 1?",
    opciones: [
      "Los sistemas AID han eliminado la necesidad de educación terapéutica y seguimiento clínico.",
      "Las principales limitaciones actuales son exclusivamente el coste y la financiación.",
      "Persisten retos relacionados con el predominio de sistemas híbridos, la absorción subcutánea de insulina, el retraso intersticial, los fallos de infusión, la conectividad, la carga tecnológica, la equidad de acceso y la necesidad de equipos entrenados.",
      "Los problemas de hiperglucemia persistente y cetosis desaparecen al utilizar el modo automático.",
    ],
    correcta: 2,
    explicacion:
      "Los AID mejoran resultados y reducen carga, pero no sustituyen por completo al usuario ni al equipo clínico. Persisten limitaciones fisiológicas, técnicas, educativas y organizativas. La seguridad depende de educación estructurada, plan de respaldo y seguimiento experto.",
    citas: [
      {
        apartado: "03-algoritmos",
        ancla: "b2",
        p: 3,
        texto:
          "la ingesta y el ejercicio son perturbaciones rápidas que el algoritmo intenta compensar con herramientas relativamente lentas: la insulina subcutánea y un sensor con retraso intersticial",
      },
      {
        apartado: "12-horizonte",
        ancla: "b2",
        p: 23,
        texto:
          "La financiación, la disponibilidad territorial, la capacitación del equipo, la accesibilidad a programas estructurados de educación terapéutica […] pueden condicionar tanto el inicio como la continuidad del tratamiento",
      },
    ],
    apartado: "12-horizonte",
    ancla: "b2",
    pagina: 23,
  },
  {
    id: "q02",
    validada: false,
    enunciado:
      "Una paciente con DM1 sobre AID muestra en la descarga de los últimos 14 días: uso de sensor 96 %, tiempo en automático 94 %, TIR 68 %, TAR 28 %, TBR <70 mg/dl 5,3 %, TBR <54 mg/dl 1,4 % y CV 38 %. ¿Cuál es la actuación inicial más adecuada?",
    opciones: [
      "Reducir el objetivo glucémico configurable y acortar la duración de la insulina activa para incrementar el TIR.",
      "Revisar hipoglucemias y sobretratamiento, y reducir el TBR antes de intensificar parámetros dirigidos al TIR.",
      "Mantener la configuración y reevaluar en 3 meses, dado que el TIR >65 % se aproxima al objetivo.",
      "Suspender el modo automático hasta que la paciente recupere capacidad de contaje preciso.",
    ],
    correcta: 1,
    explicacion:
      "El TBR es la prioridad de seguridad: debe mantenerse <4 % para <70 mg/dl y <1 % para <54 mg/dl. Antes de intensificar objetivos o parámetros para mejorar TIR, deben revisarse causas de hipoglucemia, sobretratamiento, ejercicio, alcohol, bolos manuales y ratios excesivas.",
    citas: [
      {
        apartado: "05-resultados",
        ancla: "b2",
        p: 4,
        texto:
          "El TBR es el indicador prioritario de seguridad: < 70 mg/dl debe mantenerse por debajo del 4 % y < 54 mg/dl por debajo del 1 %",
      },
      {
        apartado: "09-descarga",
        ancla: "b10",
        p: 15,
        texto: "Es el dato que más debe frenar la intensificación",
      },
    ],
    apartado: "05-resultados",
    ancla: "b2",
    pagina: 4,
  },
  {
    id: "q03",
    validada: false,
    enunciado:
      "Un varón de 34 años con DM1, HbA1c 6,9 %, TIR 75 %, TBR <70 mg/dl 2 %, sin hipoglucemias graves, expresa interés en valorar el inicio de un sistema de asa cerrada. ¿Cuál es la respuesta clínica más adecuada?",
    opciones: [
      "No es candidato actualmente porque no cumple criterios de TIR <70 %, TBR ≥4 % o HbA1c >7 % que justifiquen el cambio.",
      "La indicación solo está justificada cuando exista hipoglucemia problemática o planificación de gestación.",
      "Procede primero un periodo mínimo obligatorio con ISCI no automatizada antes de plantear el inicio del sistema.",
      "Es candidato; los AID deben ofrecerse como modalidad preferente de administración de insulina en personas con DM1 capaces de utilizarlos de forma segura y que deseen hacerlo, en el marco de una decisión compartida.",
    ],
    correcta: 3,
    explicacion:
      "La indicación actual es amplia y no debe limitarse a mal control o hipoglucemia problemática. Los umbrales de HbA1c, TIR o TBR orientan prioridad cuando los recursos son limitados, pero no son barreras rígidas. En pacientes ya bien controlados puede mejorar carga, estabilidad y seguridad percibida.",
    citas: [
      {
        apartado: "01-introduccion",
        ancla: "b1",
        p: 1,
        texto:
          "Los sistemas AID pueden considerarse una modalidad preferente de administración de insulina en personas con DM1 capaces de utilizarlos con seguridad, por sí mismas o con apoyo, y que deseen hacerlo",
      },
      {
        apartado: "06-indicaciones",
        ancla: "b2",
        p: 5,
        texto: "no deben utilizarse como umbrales rígidos de elegibilidad",
      },
    ],
    apartado: "06-indicaciones",
    ancla: "b2",
    pagina: 5,
  },
  {
    id: "q04",
    validada: false,
    enunciado:
      "En una visita de seguimiento, la descarga de un adolescente con AID muestra de forma reiterada bolos prandiales omitidos en almuerzo y cena, con aumento sostenido de la basal automática en las horas posteriores. ¿Cuál es la actuación inicial más adecuada?",
    opciones: [
      "Aumentar la ratio insulina/hidratos para que las autocorrecciones compensen los bolos omitidos.",
      "Reducir el objetivo glucémico para que el algoritmo intervenga antes en el periodo posprandial.",
      "Recomendar paso temporal a modo manual hasta que la persona recupere regularidad en el contaje y los bolos.",
      "Explorar de forma no enjuiciadora los motivos de la omisión antes de modificar parámetros del sistema.",
    ],
    correcta: 3,
    explicacion:
      "Los bolos omitidos suelen reflejar barreras de uso: sobrecarga, miedo a hipoglucemia, dificultad de contaje, contexto escolar o fatiga tecnológica. Ajustar parámetros sin abordar la causa traslada la carga al algoritmo y puede aumentar hipoglucemia tardía. El primer paso es educativo y no culpabilizador.",
    citas: [
      {
        apartado: "10-situaciones",
        ancla: "b13",
        p: 18,
        texto:
          "debe revisarse activamente en cada descarga y abordarse desde la educación, no solo desde el reajuste de parámetros",
      },
      {
        apartado: "10-situaciones",
        ancla: "b15",
        p: 18,
        texto:
          "mantener un tono no culpabilizador, identificando barreras concretas y soluciones prácticas",
      },
    ],
    apartado: "10-situaciones",
    ancla: "adolescencia",
    pagina: 18,
  },
  {
    id: "q05",
    validada: false,
    enunciado:
      "¿Cuál de las siguientes pautas refleja mejor el tratamiento de la hipoglucemia en una persona con DM1 sobre sistema AID?",
    opciones: [
      "Administrar siempre 15 g de hidratos de carbono de absorción rápida e introducir la ingesta como comida en el sistema.",
      "Ajustar la cantidad de hidratos al contexto —insulina activa, ejercicio y flecha de tendencia—, habitualmente con menos cantidad que en MDI, y no registrarlos como comida o bolo prandial; si el sistema lo permite, pueden registrarse como tratamiento de hipoglucemia.",
      "Tratar con líquidos azucarados sin determinar glucemia capilar, dado que el sensor es suficiente en cualquier escenario.",
      "Suspender manualmente el modo automático para que el sistema deje de administrar insulina hasta normalizar la glucemia.",
    ],
    correcta: 1,
    explicacion:
      "En AID, el algoritmo puede haber reducido o suspendido insulina, por lo que muchas hipoglucemias requieren menos hidratos que en MDI o ISCI no automatizada. Los hidratos de rescate no deben registrarse como comida/bolo prandial. Debe reevaluarse a los 15 minutos y evitar el sobretratamiento.",
    citas: [
      {
        apartado: "07-educacion",
        ancla: "b7",
        p: 8,
        texto: "como orientación, 5-10 g ante glucemia 54-70 mg/dl con flecha estable o ascendente",
      },
      {
        apartado: "07-educacion",
        ancla: "b7",
        p: 8,
        texto: "Debe reevaluarse con glucosa capilar a los 15 min y evitarse el sobretratamiento",
      },
      {
        apartado: "07-educacion",
        ancla: "b7",
        p: 8,
        texto: "Los hidratos para tratar la hipoglucemia no deben anunciarse como comida",
      },
    ],
    apartado: "07-educacion",
    ancla: "b7",
    pagina: 8,
  },
  {
    id: "q06",
    validada: false,
    enunciado:
      "Un paciente con AID consulta por glucemia mantenida >250 mg/dl durante 3 horas, con corrección automática del algoritmo sin descenso y sin causa identificable. ¿Cuál es la actuación más adecuada?",
    opciones: [
      "Determinar cetonemia capilar, administrar insulina rápida con pluma y recambiar el set/pod aunque la zona parezca normal.",
      "Programar un bolo corrector adicional desde la bomba con cobertura superior al factor habitual y reevaluar en una hora.",
      "Mantener la observación 1-2 horas más, dado que las autocorrecciones del sistema suelen normalizar la glucemia sin intervención adicional.",
      "Cambiar el sensor antes de tomar otras decisiones, dado que una lectura discordante podría explicar la ausencia de respuesta.",
    ],
    correcta: 0,
    explicacion:
      "Toda hiperglucemia ≥250 mg/dl persistente —orientativamente ≥2 horas— o inexplicada que no responde a corrección debe considerarse fallo de infusión hasta demostrar lo contrario. La actuación combina cetonemia, corrección con pluma y recambio de set/pod. Un bolo adicional desde la bomba puede reproducir el problema.",
    citas: [
      {
        apartado: "09-descarga",
        ancla: "b16",
        p: 15,
        texto:
          "Una glucemia ≥ 250 mg/dl persistente (orientativamente ≥ 2 h) o cualquier hiperglucemia inexplicada que no responde a la corrección debe interpretarse como sospecha de fallo del set",
      },
      {
        apartado: "09-descarga",
        ancla: "b16",
        p: 15,
        texto:
          "La actuación recomendada combina cambio del set, determinación de cetonemia y corrección con pluma",
      },
    ],
    apartado: "09-descarga",
    ancla: "b16",
    pagina: 15,
  },
  {
    id: "q07",
    validada: false,
    enunciado:
      "Un paciente con AID y elevada ansiedad por la hiperglucemia administra de forma habitual bolos manuales adicionales cuando la glucemia supera 180 mg/dl, además de las autocorrecciones del sistema. ¿Cuál es la consecuencia más probable y la actuación adecuada?",
    opciones: [
      "Mejor control glucémico sostenido; la conducta debe reforzarse mediante alarmas de hiperglucemia más sensibles.",
      "Resultado neutro en cuanto a seguridad; el sistema descuenta todos los bolos manuales y evita cualquier apilamiento.",
      "Riesgo elevado de hipoglucemia tardía por apilamiento de insulina activa; la actuación combina educación sobre el tiempo de acción de la insulina y abordaje de la ansiedad asociada.",
      "Riesgo de cetoacidosis por sobreinfusión; debe pasarse a modo manual y suspender las autocorrecciones.",
    ],
    correcta: 2,
    explicacion:
      "Los bolos manuales sucesivos, sumados a autocorrecciones o aumentos de basal, pueden producir hipoglucemia tardía. Es el patrón de “perseguir la glucosa”. La respuesta debe incluir educación sobre insulina activa, revisión de alarmas y abordaje de la ansiedad ante hiperglucemia.",
    citas: [
      {
        apartado: "09-descarga",
        ancla: "b28",
        p: 16,
        texto:
          "los bolos manuales sucesivos, sumados a autocorrecciones o aumentos de basal, pueden producir hipoglucemia tardía",
      },
      {
        apartado: "09-descarga",
        ancla: "b28",
        p: 16,
        texto: "evitar la “persecución” de la glucosa",
      },
    ],
    apartado: "09-descarga",
    ancla: "b28",
    pagina: 16,
  },
  {
    id: "q08",
    validada: false,
    enunciado:
      "Una mujer de 32 años con DM1 en tratamiento con MDI y MCG, HbA1c 7,3 %, confirma una gestación no planificada en la semana 8. ¿Cuál es la actuación más adecuada respecto al inicio de un sistema de asa cerrada?",
    opciones: [
      "Valorar el inicio precoz de un sistema con evidencia clínica específica e indicación o marco regulatorio aplicable en gestación, junto a educación intensiva y seguimiento estrecho.",
      "Iniciar cualquier sistema de asa cerrada disponible y centrarse en el bolo prandial inmediato para minimizar hipoglucemia gestacional.",
      "Mantener MDI con MCG durante toda la gestación, ya que el cambio tecnológico durante el embarazo añade riesgo sin beneficio demostrado.",
      "Posponer cualquier inicio de AID hasta el posparto para planificar adecuadamente una segunda gestación desde la fase preconcepcional.",
    ],
    correcta: 0,
    explicacion:
      "La gestación en DM1 exige objetivos más estrictos y revisión frecuente. Si el control no es óptimo, debe valorarse un sistema con evidencia y/o indicación adecuada en gestación, con equipo experto y seguimiento estrecho. No todos los sistemas tienen la misma evidencia ni la misma situación regulatoria.",
    citas: [
      {
        apartado: "10-situaciones",
        ancla: "b6",
        p: 17,
        texto:
          "una vez confirmado el embarazo conviene iniciar o adaptar precozmente un sistema con evidencia específica, especialmente cuando el control glucémico no es óptimo",
      },
    ],
    apartado: "10-situaciones",
    ancla: "gestacion",
    pagina: 17,
  },
  {
    id: "q09",
    validada: false,
    enunciado:
      "Un paciente con AID planifica una carrera continua de 60 minutos a media tarde, 90 minutos después del almuerzo. ¿Cuál es el manejo más adecuado?",
    opciones: [
      "Mantener la configuración habitual y activar el modo de ejercicio solo si la glucemia desciende por debajo de 126 mg/dl.",
      "Suspender el modo automático antes de la carrera, omitir el bolo prandial del almuerzo y aportar hidratos cada 15 minutos.",
      "Activar con antelación el modo de ejercicio u objetivo temporal correspondiente y valorar la reducción del bolo de la comida previa según el tipo de actividad, la insulina activa y la respuesta habitual; administrar hidratos durante el ejercicio si son necesarios, sin anunciarlos como comida.",
      "Mantener configuración habitual y administrar un bolo corrector preventivo si la glucemia supera 180 mg/dl al inicio del ejercicio.",
    ],
    correcta: 2,
    explicacion:
      "En ejercicio aeróbico planificado con descenso esperado, el modo de ejercicio u objetivo temporal suele activarse con antelación. Cuando existe insulina activa por una comida reciente puede ser necesario reducir el bolo, siempre de forma individualizada según patrón previo, duración e intensidad del ejercicio.",
    citas: [
      {
        apartado: "10-situaciones",
        ancla: "b22",
        p: 19,
        texto:
          "la primera medida es elevar el objetivo glucémico mediante el modo o el objetivo temporal del sistema, iniciado 1-2 h antes de la actividad",
      },
      {
        apartado: "10-situaciones",
        ancla: "b22",
        p: 19,
        texto: "se reduce además el bolo prandial en un 25-33 %",
      },
      {
        apartado: "10-situaciones",
        ancla: "b22",
        p: 19,
        texto:
          "tomar pequeñas cantidades de hidratos rápidos (orientativamente 10-20 g) si la glucosa baja de unos 126 mg/dl, sin anunciarlos al sistema",
      },
    ],
    apartado: "10-situaciones",
    ancla: "ejercicio",
    pagina: 19,
  },
  {
    id: "q10",
    validada: false,
    enunciado:
      "Una paciente con DM1 sobre AID inicia tratamiento con prednisona 40 mg/día por una exacerbación inflamatoria. ¿Cuál es la actuación inicial más adecuada respecto al manejo del sistema?",
    opciones: [
      "Suspender el modo automático y pasar a modo manual con basal aumentada un 30-40 % durante todo el tratamiento esteroideo.",
      "Intensificar la monitorización y establecer con el equipo un plan individualizado; según dosis, duración, patrón glucémico y sistema utilizado, puede requerir ajustes del perfil, modo manual o insulina adicional, midiendo cetonemia si aparece hiperglucemia persistente o clínica compatible.",
      "Mantener la configuración habitual y reevaluar en una semana, dado que los algoritmos actuales se adaptan automáticamente a los cambios de sensibilidad.",
      "Desactivar las autocorrecciones del algoritmo para evitar hipoglucemia tras la dosis matutina, cuyo efecto hiperglucemiante es transitorio.",
    ],
    correcta: 1,
    explicacion:
      "Los glucocorticoides pueden producir aumentos rápidos y variables de las necesidades de insulina, que el algoritmo no siempre anticipa adecuadamente. La conducta debe individualizarse; no debe asumirse que mantener el modo automático sin ajustes será suficiente.",
    citas: [
      {
        apartado: "10-situaciones",
        ancla: "b29",
        p: 20,
        texto:
          "las dosis altas o los cambios rápidos de pauta pueden requerir perfiles alternativos, modo manual o insulina adicional bajo supervisión del equipo",
      },
    ],
    apartado: "10-situaciones",
    ancla: "glucocorticoides",
    pagina: 20,
  },
];
