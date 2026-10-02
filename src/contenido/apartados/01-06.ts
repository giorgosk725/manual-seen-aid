/* Apartados 1–6 del capítulo. Texto literal (PDF 30-9-2026) con las correcciones
   editoriales 1/11, 2/11 y 4/11 aplicadas (ver docs/CORRECCIONES.md). */
import type { Apartado } from "../tipos";

export const A01: Apartado = {
  n: 1,
  slug: "01-introduccion",
  titulo: "Introducción",
  corto: "Introducción",
  paginas: [1, 1],
  bloques: [
    {
      t: "p",
      p: 1,
      texto:
        "La diabetes mellitus tipo 1 (DM1) se caracteriza por una destrucción autoinmune de las células β pancreáticas que conduce a un déficit absoluto de insulina. Las pautas con múltiples dosis de insulina (MDI) y la infusión subcutánea continua de insulina (ISCI), optimizadas con monitorización continua de glucosa (MCG), comparten un denominador común: la persona con DM1 interpreta los datos y decide los ajustes varias veces al día. Los sistemas automatizados de administración de insulina (AID, *automated insulin delivery*), también denominados sistemas de asa cerrada, integran bomba, sensor MCG y un algoritmo de control que modula la infusión según el valor y la tendencia de la glucosa intersticial. La evidencia disponible frente a MDI con MCG o ISCI con MCG no automatizada muestra mayor tiempo en rango, menor tiempo en hipoglucemia y reducción de la carga cognitiva del manejo, con beneficios documentados en gestación, niños y adolescentes, adultos y personas mayores con DM1. Los sistemas AID pueden considerarse una modalidad preferente de administración de insulina en personas con DM1 capaces de utilizarlos con seguridad, por sí mismas o con apoyo, y que deseen hacerlo.",
    },
    {
      t: "p",
      p: 1,
      texto:
        "Este capítulo aborda la automatización de la insulinoterapia desde una perspectiva práctica, dando continuidad al capítulo del Manual SEEN “Tratamiento insulínico del paciente con diabetes tipo 1: múltiples dosis de insulina”; para la profundización técnica por sistema se remite a la Guía SED de Sistemas de Asa Cerrada 2026.",
    },
  ],
};

export const A02: Apartado = {
  n: 2,
  slug: "02-componentes",
  titulo: "Componentes del sistema de asa cerrada",
  corto: "Componentes",
  paginas: [1, 2],
  bloques: [
    {
      t: "p",
      p: 1,
      texto:
        "Un sistema de asa cerrada se compone de tres elementos esenciales: bomba o pod de infusión subcutánea continua de insulina, sensor de MCG y algoritmo de control. En la práctica clínica debe añadirse un cuarto elemento funcional: la plataforma de descarga y análisis de datos, imprescindible para seguimiento, optimización y telemedicina (Figura 1).",
    },
    { t: "figura", p: 2, id: "F1" },
    {
      t: "p",
      p: 2,
      texto:
        "La bomba administra análogos de insulina rápida o ultrarrápida, según la compatibilidad y las recomendaciones específicas del sistema. En modo manual, sigue tasas basales programadas y bolos manuales; en modo automático, la administración basal programada queda reemplazada o modulada por el algoritmo.",
    },
    {
      t: "p",
      p: 2,
      texto:
        "El sensor de MCG mide la glucosa intersticial, que en estabilidad se aproxima a la capilar, pero durante los cambios rápidos presenta un retraso fisiológico y técnico. Por ello debe confirmarse la glucemia capilar ante discordancia clínica, hipoglucemia de instauración rápida, hiperglucemia persistente o sospecha de fallo del sensor. De su precisión depende la seguridad del algoritmo: un sensor inestable o con pérdida de señal puede provocar salidas del modo automático o decisiones subóptimas.",
    },
    {
      t: "p",
      p: 2,
      texto:
        "El algoritmo es el componente que más diferencia a unos sistemas de otros; sus tipos y el carácter híbrido de los sistemas actuales se desarrollan en el apartado siguiente. Para el clínico, lo esencial es conocer qué parámetros modifican realmente el comportamiento automático de cada sistema.",
    },
    {
      t: "p",
      p: 2,
      texto:
        "Las plataformas de descarga muestran uso del sensor, tiempo en modo automático, tiempo en rango (TIR), tiempo por debajo del rango (TBR), tiempo por encima del rango (TAR), coeficiente de variación, bolos, autocorrecciones, insulina total, distribución basal/bolos, modos temporales, alarmas y salidas del sistema. Más allá de volcar cifras, las plataformas más útiles depuran y jerarquizan esa información, resaltan los patrones relevantes y permiten filtrarla por prioridades, de modo que el equipo identifique con rapidez dónde actuar. La tendencia es, precisamente, hacia herramientas que transforman el dato en información útil para la toma de decisiones.",
    },
  ],
};

export const A03: Apartado = {
  n: 3,
  slug: "03-algoritmos",
  titulo: "Algoritmos de control y carácter híbrido de los sistemas actuales",
  corto: "Algoritmos",
  paginas: [3, 3],
  bloques: [
    {
      t: "p",
      p: 3,
      // Corrección editorial 1/11: «(MPC)» va tras «basado en modelo», no tras «lógica difusa».
      texto:
        "Los sistemas de asa cerrada emplean tres tipos de algoritmo de control, con frecuencia combinados, que recalculan la infusión cada pocos minutos a partir del valor y la tendencia de la glucosa del sensor: control proporcional-integral-derivativo (PID), control predictivo basado en modelo (MPC) y lógica difusa.",
    },
    {
      t: "p",
      p: 3,
      texto:
        "En las modalidades híbridas el anuncio de las comidas y el bolo prandial siguen siendo necesarios para optimizar el control. Tras la ingesta, la glucosa plasmática se eleva con rapidez, mientras la glucosa intersticial detectada por el sensor lo hace con un retraso de 5-15 min. La insulina rápida subcutánea inicia su efecto a los 15-30 min y alcanza el pico cuando la glucemia ya ha experimentado una parte significativa de la excursión posprandial. En términos de ingeniería de control, la ingesta y el ejercicio son perturbaciones rápidas que el algoritmo intenta compensar con herramientas relativamente lentas: la insulina subcutánea y un sensor con retraso intersticial.",
    },
    {
      t: "p",
      p: 3,
      texto:
        "La reciente incorporación de modalidades de asa cerrada completa (*fully closed-loop*) abre un nuevo escenario en la automatización de la insulinoterapia. CamAPS Liberty es una función de CamAPS FX que, cuando se activa, permite un funcionamiento de asa cerrada completa en el que toda la administración de insulina la gestiona el sistema, lo que elimina la necesidad imperativa de pautar bolos para comidas y tentempiés, manteniendo el bolo manual como una opción discrecional junto a las funciones Boost y Ease-off. Por el momento no se recomienda en menores de 13 años ni en gestación.",
    },
  ],
};

export const A04: Apartado = {
  n: 4,
  slug: "04-sistemas",
  titulo: "Sistemas AID comercializados en España",
  corto: "Sistemas en España",
  paginas: [3, 4],
  bloques: [
    {
      t: "p",
      p: 3,
      // Corrección editorial 2/11: «comercializados en España» (sin «o de próxima incorporación»).
      texto:
        "Entre los sistemas de asa cerrada comercializados en España se encuentran MiniMed 780G, Tandem Control-IQ/IQ+, myLoop powered by CamAPS y Omnipod 5. Sus características principales comparadas se recogen en la tabla 1. La disponibilidad comercial, la financiación y las condiciones de uso pueden cambiar con el tiempo y diferir entre comunidades autónomas, por lo que deben confirmarse en la ficha técnica vigente y en el circuito asistencial correspondiente antes de la prescripción.",
    },
    { t: "tabla", p: 3, id: "T1" },
    {
      t: "p",
      p: 4,
      texto:
        "El detalle técnico de cada sistema y la evidencia que lo respalda se desarrollan en la Guía de Uso de Sistemas de Asa Cerrada de la Sociedad Española de Diabetes. En la práctica clínica, las principales diferencias entre sistemas incluyen: MiniMed 780G, con el algoritmo SmartGuard, autocorrecciones frecuentes, objetivo y duración de la insulina activa ajustables y objetivo temporal para el ejercicio; Tandem, con dos formatos de bomba —t:slim X2 y Mobi— y Control-IQ o Control-IQ+ según el dispositivo y la versión de *software*, un perfil basal programado que interviene en el modo automático y los modos sueño y ejercicio; myLoop, con el algoritmo CamAPS FX alojado en la aplicación, que requiere un teléfono compatible, objetivo configurable por tramos, las funciones *Boost* y *Ease-off* y la modalidad *Liberty* de asa cerrada completa; y Omnipod 5, con el algoritmo *SmartAdjust* alojado en el pod, sin tubo externo, objetivo configurable por tramos y función de actividad.",
    },
    {
      t: "p",
      p: 4,
      texto:
        "La elección entre sistemas debe integrar características clínicas, preferencias individuales, indicaciones regulatorias, disponibilidad local, experiencia del equipo y condiciones de financiación.",
    },
  ],
};

export const A05: Apartado = {
  n: 5,
  slug: "05-resultados",
  titulo: "Resultados clínicos: métricas, evidencia, seguridad y calidad de vida",
  corto: "Resultados clínicos",
  paginas: [4, 5],
  bloques: [
    {
      t: "p",
      p: 4,
      texto:
        "La evaluación combina hemoglobina glucosilada (HbA1c) y métricas de MCG. La HbA1c conserva valor pronóstico, pero no informa de la hipoglucemia, la variabilidad ni la distribución diaria; el seguimiento se apoya en TBR, TIR, TAR, coeficiente de variación, indicador de gestión de la glucosa (GMI), uso del sensor, tiempo en modo automático, salidas del sistema y patrón de bolos.",
    },
    {
      t: "p",
      p: 4,
      texto:
        "El TIR 70-180 mg/dl es la métrica principal de control global (objetivo general > 70 % en adultos no gestantes). El TBR es el indicador prioritario de seguridad: < 70 mg/dl debe mantenerse por debajo del 4 % y < 54 mg/dl por debajo del 1 %. El TAR informa de la hiperglucemia: el TAR > 180 mg/dl complementa al TIR, mientras que el de nivel 2 (> 250 mg/dl, objetivo < 5 %) ayuda a detectar hiperglucemia mantenida o fallo de infusión. El coeficiente de variación (objetivo ≤ 36 %) refleja la variabilidad glucémica y se relaciona estrechamente con el riesgo de hipoglucemia.",
    },
    {
      t: "p",
      p: 4,
      p2: 5,
      texto:
        "El TITR —tiempo en rango estrecho, 70-140 mg/dl— refleja la proporción de tiempo en valores más próximos al rango fisiológico y puede aportar información adicional cuando el TBR es seguro y el TIR ya es adecuado. La automatización ha hecho más alcanzable esta métrica, pero la evidencia sobre su relación con complicaciones clínicas y con resultados percibidos por las personas es todavía inicial. Estudios recientes sugieren que plantear o alcanzar objetivos elevados de TITR puede asociarse, en algunas personas, con mayor carga de autocuidado o malestar emocional relacionado con la diabetes, especialmente si se interpreta como un objetivo rígido; estos datos son cualitativos u observacionales y no demuestran causalidad. Por ello, el TITR puede utilizarse como métrica complementaria de optimización, individualizada y acordada con la persona, sin sustituir al TIR ni al TBR ni considerarse todavía un objetivo clínico primario universal.",
    },
    {
      t: "p",
      p: 5,
      texto:
        "Los ensayos y los estudios de vida real muestran un incremento clínicamente relevante del TIR, reducción de HbA1c y mantenimiento o descenso del TBR, con baja frecuencia de eventos graves de seguridad en las cohortes evaluadas. La magnitud del beneficio suele ser mayor frente a MDI con MCG o en personas con control basal subóptimo, y más discreta frente a ISCI con MCG ya optimizada. La heterogeneidad de poblaciones, comparadores y apoyo educativo impide establecer comparaciones directas fiables entre dispositivos. El beneficio se ha documentado en gestación, población pediátrica y personas mayores, con las particularidades del apartado de situaciones especiales.",
    },
    {
      t: "p",
      p: 5,
      texto:
        "Los resultados comunicados por las personas muestran beneficios en satisfacción, carga terapéutica, miedo a la hipoglucemia y calidad del sueño, con magnitud variable según población e instrumento; son especialmente relevantes en niños, adolescentes, cuidadores y personas con hipoglucemia recurrente.",
    },
    {
      t: "p",
      p: 5,
      texto:
        "La seguridad global es favorable, pero la cetoacidosis sigue siendo posible en cualquier terapia con infusión subcutánea continua: su prevención exige educación estructurada, detección precoz del fallo de infusión, disponibilidad de pluma, medición de cetonemia y recambio del sistema. Antes de intensificar objetivos debe revisarse siempre la seguridad (TBR, hipoglucemia relevante, episodios nocturnos y capacidad de respuesta).",
    },
    {
      t: "p",
      p: 5,
      texto:
        "Cuando el control glucémico de partida ya es bueno, la ganancia de TIR puede ser moderada, pero persiste un beneficio relevante en estabilidad nocturna, reducción de hipoglucemias y variabilidad, menor carga de autocuidado y mayor seguridad percibida. En personas con HbA1c elevada, bolos omitidos o acceso previo limitado a la tecnología, el incremento de TIR puede ser mayor, aunque exige un acompañamiento educativo más intenso para evitar expectativas irreales y favorecer un uso sostenido del sistema.",
    },
  ],
};

export const A06: Apartado = {
  n: 6,
  slug: "06-indicaciones",
  titulo: "Indicaciones y selección individualizada",
  corto: "Indicaciones",
  paginas: [5, 6],
  bloques: [
    {
      t: "p",
      p: 5,
      texto:
        "Estos resultados han desplazado el umbral de indicación. Considerar los AID como modalidad preferente de administración de insulina implica sustituir el modelo restrictivo —basado solo en HbA1c elevada o hipoglucemia recurrente o inadvertida— por una indicación amplia, modulada en la práctica por la priorización clínica, la decisión compartida y la disponibilidad efectiva de recursos. En contextos de disponibilidad limitada, esa indicación amplia puede coexistir con estrategias transitorias de priorización progresiva, sin que ello suponga una restricción conceptual del beneficio de la tecnología.",
    },
    {
      t: "p",
      p: 5,
      texto:
        "Cuando los recursos obligan a escalonar la implantación, la priorización debe basarse en la necesidad clínica y en el beneficio esperado, mediante criterios transparentes y adaptados al contexto asistencial. Entre las situaciones que razonablemente merecen una especial prioridad se encuentran la edad pediátrica y adolescente, por la elevada variabilidad glucémica y el impacto sobre el niño o adolescente y sus cuidadores; la planificación gestacional y el embarazo; la hipoglucemia grave, inadvertida o de repetición; y la dificultad para alcanzar objetivos individualizados pese a un tratamiento optimizado. También deben considerarse la elevada variabilidad glucémica, la sobrecarga asociada al autocuidado, la afectación de la calidad de vida y la carga mental relacionada con la diabetes. Valores como HbA1c > 7 %, TIR < 70 %, TBR ≥ 4 % o TAR de nivel 2 > 250 mg/dl ≥ 5 % permiten identificar una necesidad clínica no cubierta, pero no deben utilizarse como umbrales rígidos de elegibilidad.",
    },
    {
      t: "p",
      p: 5,
      texto:
        "Los requisitos previos —seguimiento clínico, experiencia en MCG o ISCI o disposición a adquirirla, educación suficiente, expectativas realistas y capacidad de respuesta ante alarmas— deben entenderse como capacidades generalmente adquiribles. Su ausencia inicial no contraindica el sistema, sino que orienta el plan educativo. Las situaciones de precaución —dificultad técnica sin apoyo, rechazo persistente al dispositivo, trastorno psicopatológico activo no estabilizado o barreras graves para el seguimiento— requieren soporte adicional y reevaluación.",
    },
    {
      t: "p",
      p: 5,
      p2: 6,
      // Corrección editorial 4/11: sin guion tras «Omnipod 5».
      texto:
        "Aunque este capítulo se centra en la DM1, la automatización se está extendiendo a otras situaciones de insulinoterapia intensiva. La de mayor desarrollo es la diabetes tipo 2 con tratamiento insulínico, con ensayos y aprobaciones recientes —MiniMed 780G, Control-IQ+ y Omnipod 5 ya cuentan con autorización para su uso en este grupo— y una recomendación específica en las guías más actuales. En la diabetes asociada a fibrosis quística, la postrasplante y la de origen pancreático (tipo 3c) la evidencia es aún limitada y su uso debe individualizarse. En todos los casos, la indicación depende de la evidencia, la autorización vigente, la disponibilidad y la financiación.",
    },
    {
      t: "p",
      p: 6,
      texto:
        "La elección integra factores clínicos —edad, peso, dosis total de insulina, situación reproductiva e indicaciones regulatorias aprobadas— y factores personales —formato de bomba, control desde el móvil, destreza manual, agudeza visual, capacidad cognitiva, apoyo familiar o del cuidador, acceso a un equipo con experiencia en el sistema y disposición al anuncio de comidas—. No puede basarse solo en la eficacia media de los ensayos ni en una jerarquía tecnológica rígida. La indicación se concreta en una decisión compartida, estructurada y registrada en la historia clínica: se exponen las características, los beneficios, las limitaciones y los compromisos de cada sistema (anuncio de comidas, alarmas, recambios, visibilidad), se contrastan con las preferencias y circunstancias de la persona y se acuerda la opción. Además de ser un requisito ético y normativo, esta decisión compartida se asocia con un mejor uso sostenido del sistema (Figura 2).",
    },
    { t: "figura", p: 6, id: "F2" },
  ],
};
