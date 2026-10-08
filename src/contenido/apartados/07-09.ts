/* Apartados 7–9 del capítulo. Texto literal del PDF publicado el 8-10-2026. */
import type { Apartado } from "../tipos";

export const A07: Apartado = {
  n: 7,
  slug: "07-educacion",
  titulo: "Educación terapéutica y plan de seguridad",
  corto: "Educación y seguridad",
  paginas: [6, 10],
  bloques: [
    {
      t: "p",
      p: 6,
      texto:
        "La educación terapéutica es esencial. El acceso a los sistemas de asa cerrada no garantiza por sí solo un uso seguro ni buenos resultados: de un buen programa educativo dependen la seguridad y la continuidad del uso, así como la optimización posterior y la experiencia del paciente. Debe estructurarse en dos niveles: un programa estructurado de educación terapéutica (PEET) previo al inicio y mantenido durante los primeros meses, y un plan de seguridad personalizado disponible durante todo el uso.",
    },
    {
      t: "p",
      p: 6,
      texto:
        "El PEET debe adaptarse al sistema, a la experiencia previa y a los recursos del centro. En la práctica, puede organizarse en cuatro fases: valoración inicial, intervención educativa, seguimiento y evaluación/alta del programa. Debe estar planificado, ser flexible, progresivo, basado en evidencia y disponible por escrito, con profesionales entrenados en tecnología y trabajo interdisciplinar.",
    },
    {
      t: "lista",
      p: 6,
      p2: 7,
      intro: "Los contenidos mínimos incluyen:",
      items: [
        "Componentes del sistema; bases de ISCI y MCG.",
        "Activación y salida de modo automático.",
        "Recambio de set, reservorio, pod y sensor.",
        "Recuento de hidratos y bolo prandial anticipado: como norma general, administrarlo 10-15 min antes de comer, salvo hipoglucemia o glucemia en descenso.",
        "Modos temporales: ejercicio, enfermedad intercurrente, viajes y exploraciones.",
        "Gestión de alarmas y descarga de datos.",
        "Seguridad digital: proteger credenciales y dispositivos vinculados, revisar las funciones de administración remota disponibles y seguir las recomendaciones del fabricante.",
        "Actuación ante hipoglucemia, hiperglucemia persistente, cetonemia y fallo de infusión.",
      ],
    },
    {
      t: "lista",
      p: 7,
      intro:
        "El plan de seguridad debe entregarse antes de activar el modo automático. Debe incluir:",
      items: [
        "Pauta de respaldo con insulina basal y rápida en pluma, con las dosis de conversión a inyecciones ya calculadas.",
        "Glucómetro capilar y tiras de β-hidroxibutirato (β-OHB).",
        "Recambios de set, cánula, reservorio o pods, sensores y baterías/cargadores.",
        "Glucagón.",
        "Contactos del equipo asistencial y del soporte técnico.",
        "Algoritmo de actuación ante hiperglucemia persistente y sospecha de fallo de infusión (Figura 3).",
      ],
    },
    { t: "figura", p: 8, id: "F3" },
    {
      t: "p",
      p: 8,
      texto:
        "Dos reglas operativas merecen mención específica dentro del plan de seguridad. La primera es el tratamiento de la hipoglucemia, que en asa cerrada suele requerir menos hidratos que en MDI o ISCI no automatizada, porque el sistema ya ha reducido o suspendido la insulina.",
    },
    {
      t: "p",
      p: 8,
      p2: 9,
      texto:
        "En determinados episodios de hipoglucemia leve, sobre todo cuando el algoritmo ya ha reducido o suspendido la infusión y no existe insulina activa relevante, pueden bastar cantidades menores que la regla clásica de 15 g: como orientación, 5-10 g ante glucemia 54-70 mg/dl con flecha estable o ascendente, reservando cantidades en torno a 15 g para glucemia < 54 mg/dl, doble flecha descendente o insulina activa significativa. Debe reevaluarse con glucosa capilar a los 15 min y evitarse el sobretratamiento; la evidencia específica en AID es aún limitada, por lo que conviene individualizar. Los hidratos para tratar la hipoglucemia no deben anunciarse como comida; en CamAPS FX existe la opción de registrarlos como “tratamiento de hipoglucemia”, que los documenta y suaviza la entrega de insulina sin contabilizarlos como ingesta.",
    },
    { t: "diagrama", p: 8, id: "hipoglucemia" },
    {
      t: "p",
      p: 9,
      texto:
        "La segunda regla es que toda hiperglucemia persistente sin causa clara debe hacer sospechar fallo de infusión hasta demostrar lo contrario. Esta regla debe enseñarse en el PEET, practicarse con casos y quedar por escrito.",
    },
    { t: "h3", p: 9, id: "interrupcion", texto: "Interrupción del sistema y pauta alternativa" },
    {
      t: "p",
      p: 9,
      texto:
        "Toda interrupción del sistema —fallo, retirada programada o cese de la administración de insulina— exige valorar el tiempo previsto sin infusión, porque los sistemas con bomba o pod administran únicamente acción rápida o ultrarrápida y carecen de depósito basal. Las interrupciones muy breves, con reanudación o sustitución inmediata, no suelen requerir medidas adicionales: el pod no se desconecta —si falla, se despega o debe retirarse, se sustituye por uno nuevo—, mientras que la bomba con catéter puede desconectarse y reconectarse a través del set de infusión. Cuando la bomba con catéter se desconecta físicamente del cuerpo, debe suspenderse o pausarse la administración según las instrucciones del fabricante, para evitar que el sistema registre como administrada una insulina que no se ha infundido realmente. Tras la reconexión, debe reanudarse la administración y el sistema vuelve a ajustar la infusión, siempre que la interrupción haya sido breve y no exista hiperglucemia o cetonemia. Como umbral operativo, a partir de aproximadamente 1 h sin administración de insulina debe actuarse —glucemia capilar, valoración de cetonemia según el contexto y reposición de la insulina no administrada— por el riesgo de hiperglucemia y cetosis.",
    },
    {
      t: "p",
      p: 9,
      texto:
        "La duración prevista y el estado del sistema marcan la forma de reposición. En interrupciones programadas y de pocas horas —orientativamente hasta 2-3 h, como en deporte, baño o algunas exploraciones— puede valorarse, si no existe riesgo de hipoglucemia, administrar antes de la desconexión un bolo de acción rápida o ultrarrápida para cubrir la insulina basal prevista durante ese período. Esta estimación debe basarse en la administración basal o automática reciente, o en la pauta de respaldo individualizada. En desconexiones por ejercicio debe aplicarse además la reducción correspondiente según el tipo de actividad, la glucemia, la tendencia y la insulina activa.",
    },
    {
      t: "p",
      p: 9,
      texto:
        "En interrupciones prolongadas, con el sistema indisponible o ante un fallo definitivo, se pasa a múltiples dosis con pluma: insulina basal —preferentemente glargina U-100 si se busca facilitar el retorno posterior al sistema— y análogo ultrarrápido para comidas y correcciones, según la ratio insulina/hidratos y el factor de sensibilidad de la pauta de respaldo. La dosis basal de respaldo debe aproximarse a la basal diaria realmente necesaria o a la administración basal/automática reciente del sistema; si no se dispone de una estimación fiable, puede orientarse en torno al 40-50 % de la DTD reciente, individualizando según el control previo, riesgo de hipoglucemia, ejercicio, enfermedad intercurrente y cetonemia.",
    },
    {
      t: "p",
      p: 9,
      texto:
        "Cuando se prevea una interrupción prolongada o no sea posible reanudar el sistema —por ejemplo, cirugía, ingreso o exploraciones prolongadas— y se decida administrar glargina de forma programada, puede adelantarse aproximadamente dos horas antes de la retirada del dispositivo para evitar un vacío de insulinización. Al reiniciar el sistema debe tenerse en cuenta el efecto residual de la basal administrada —menor y más predecible con glargina U-100 que con basales ultralargas— para evitar la superposición de insulina basal. Ante la duda clínica, discordancia con el sensor o hiperglucemia persistente, debe confirmarse la glucosa con glucemia capilar. Si existe cetonemia, hiperglucemia persistente o sospecha de fallo de infusión, se seguirá el algoritmo de la figura 3. Además de quedar registrada en la historia clínica, esta pauta debe entregarse a la persona con diabetes en un formato resumido, claro y adaptado a su sistema.",
    },
    {
      t: "p",
      p: 9,
      texto:
        "Estas pautas son orientativas y se apoyan en la farmacocinética de las insulinas más que en ensayos específicos en asa cerrada, por lo que deben individualizarse.",
    },
    {
      t: "p",
      p: 9,
      texto:
        "La educación debe incluir habilidades de comunicación y anticipación: la persona debe saber cuándo resolver una incidencia por sí misma, cuándo contactar con soporte técnico y cuándo con el equipo sanitario, idealmente con instrucciones escritas que distingan los problemas técnicos, los de seguridad y las dudas de optimización. La descarga no sustituye a la entrevista: turnos, actividad física, sueño, alcohol, estrés, hábitos alimentarios y barreras emocionales explican a menudo patrones que el informe solo refleja indirectamente.",
    },
    {
      t: "p",
      p: 9,
      texto:
        "En personas con alto riesgo de abandono de la tecnología, baja alfabetización digital, idioma diferente o ausencia de cuidador entrenado, el PEET debe simplificarse y priorizar objetivos de seguridad: manejo de hipoglucemia, hiperglucemia persistente, cuerpos cetónicos, recambio del sistema y pauta alternativa. La optimización fina de parámetros puede posponerse hasta confirmar que estas competencias básicas están consolidadas.",
    },
    { t: "h3", p: 10, id: "capacitacion", texto: "Capacitación del equipo asistencial" },
    {
      t: "p",
      p: 10,
      texto:
        "La implementación segura no depende solo de la educación de la persona, sino de la capacitación del equipo: conocer las diferencias entre sistemas, acompañar la elección, iniciar y configurar el dispositivo, interpretar descargas, optimizar parámetros y resolver incidencias son competencias que exigen formación específica y mantenimiento. Disponer de programas formativos escalonados y circuitos asistenciales claros reduce la variabilidad en el acceso y en la calidad; esta capacitación es más decisiva cuanto menor es la experiencia del equipo con un sistema concreto o mayor la complejidad del caso.",
    },
  ],
};

export const A08: Apartado = {
  n: 8,
  slug: "08-iniciacion",
  titulo: "Iniciación, seguimiento y optimización en la práctica clínica",
  corto: "Iniciación y seguimiento",
  paginas: [10, 13],
  bloques: [
    {
      t: "p",
      p: 10,
      texto:
        "La iniciación y el seguimiento de un sistema de asa cerrada siguen una secuencia estructurada en cuatro fases: selección individualizada y preparación, inicio del sistema, seguimiento estrecho durante los primeros 3 meses y seguimiento mantenido a largo plazo. La transición desde MDI (cálculo de parámetros iniciales y manejo del solapamiento basal) se sintetiza en la tabla 2; los parámetros clásicos modificables por sistema, en la tabla 3; las herramientas del sistema y la conducta recomendada ante situaciones clínicas frecuentes, en la tabla 4; y el análisis estructurado de la descarga, en la tabla 5.",
    },
    { t: "tabla", p: 10, id: "T2" },
    { t: "diagrama", p: 10, id: "transicion" },
    { t: "tabla", p: 11, id: "T3" },
    { t: "tabla", p: 11, id: "T4" },
    {
      t: "p",
      p: 12,
      lead: "Configuración inicial (v. Tabla 2).",
      texto:
        "Antes de activar el modo automático debe quedar configurado un núcleo común a todos los sistemas —tasa basal por tramos, ratio insulina/hidratos y factor de sensibilidad— y, según el sistema, el objetivo glucémico, el peso y la DTD, y la insulina activa. La fuente de partida es la pauta previa del paciente, trasladada al esquema del sistema elegido; cuando no se dispone de referencia, las reglas del 450 y del 1700 sobre la DTD orientan la ratio y el factor de sensibilidad iniciales. Son solo un punto de partida que se personaliza después —por franja horaria y tipo de ingesta— con la descarga y la experiencia.",
    },
    {
      t: "p",
      p: 12,
      texto:
        "Al pasar de MDI, la DTD inicial suele reducirse en función del control previo (HbA1c, TBR), del riesgo de hipoglucemia y del análogo basal en uso; las pautas orientativas se recogen en la tabla 2. El tipo de basal previa debe tenerse en cuenta, ya que condiciona además el riesgo de solapamiento de los primeros días.",
    },
    {
      t: "p",
      p: 12,
      texto:
        "Los sistemas requieren disponer de un perfil basal inicial cuya influencia durante el modo automático varíe según el sistema. Sin patrón previo, una basal plana (~ 40-50 % de la DTD reducida/24 h) es un inicio razonable; si hay descargas previas conviene buscar un patrón horario —como el fenómeno del alba— y reflejarlo, y una programación de ISCI que funcionaba puede trasladarse tal cual. Su peso varía por sistema: en Control-IQ interviene directamente en el modo automático; en MiniMed 780G y CamAPS FX actúa sobre todo en modo manual; y en Omnipod 5 contribuye al inicio y luego cede ante la basal adaptativa. En todos resulta imprescindible como respaldo al salir a modo manual; conviene revisar y actualizar estos ajustes manuales en cada visita, porque las necesidades de insulina cambian con el uso del sistema y son los que rigen si se revierte a asa abierta por fallo del sensor u otra causa.",
    },
    {
      t: "p",
      p: 12,
      lead: "Seguimiento estrecho durante los primeros 3 meses.",
      texto:
        "La estructura recomendada incluye un contacto remoto en las primeras 72 h y a la semana, una revisión presencial a las 2-4 semanas, y una visita a los 3 meses con determinación de HbA1c. El contacto remoto inicial se centra en resolución de dudas, revisión de alarmas e identificación de salidas a modo manual. La revisión presencial a las 2-4 semanas permite ajustes finos (ratios y objetivos configurables) e incorporación de modos temporales, revisión del patrón posprandial, los bolos omitidos o tardíos y la frecuencia de correcciones automáticas. La visita a los 3 meses incorpora la HbA1c y el análisis estructurado de la descarga (v. Tabla 5).",
    },
    { t: "diagrama", p: 12, id: "seguimiento" },
    {
      t: "p",
      p: 12,
      lead: "Seguimiento mantenido.",
      texto:
        "Superada la fase inicial, la intensidad del seguimiento se ajusta a la estabilidad alcanzada: con buen control, uso sostenido y sin incidencias, las visitas pueden espaciarse (orientativamente a 3-6 meses el primer año, y más una vez consolidada la estabilidad), reservando el seguimiento frecuente para quien lo necesita. Las plataformas que convierten los datos en métricas y alertas ayudan a identificar a quién contactar y a optimizar el tiempo asistencial. Cada visita incluye HbA1c, análisis estructurado de la descarga, revisión de ajustes y valoración del uso sostenido; además, el seguimiento mantiene la revisión analítica periódica y el cribado de complicaciones crónicas (retinopatía, nefropatía, neuropatía y riesgo cardiovascular) propios del control de la DM1. La reevaluación anual añade la idoneidad del sistema y la satisfacción.",
    },
    {
      t: "p",
      p: 12,
      p2: 13,
      lead: "Reevaluación y criterios de reconsideración del tratamiento.",
      texto:
        "Cuando los objetivos no se alcanzan a pesar de la optimización, el seguimiento incorpora un proceso de reevaluación. Las opciones incluyen refuerzo del PEET, cambio a un sistema alternativo o cambio de modalidad terapéutica. La reconsideración del tratamiento con sistema de asa cerrada y eventual transición a una pauta alternativa puede plantearse, tras una evaluación estructurada del soporte educativo y técnico, en tres situaciones: (a) uso insuficiente o discontinuo del sistema pese a intervenciones educativas y de apoyo; (b) uso no seguro del sistema que conduzca a descompensaciones hiperglucémicas frecuentes con riesgo de cetoacidosis; (c) no consecución sostenida de los objetivos individualizados de control. Estas circunstancias no son criterios automáticos de retirada, sino motivos para una decisión compartida que valore el equilibrio entre beneficios obtenidos, seguridad, dificultades de uso y disponibilidad de alternativas.",
    },
  ],
};

export const A09: Apartado = {
  n: 9,
  slug: "09-descarga",
  titulo: "Interpretación de la descarga y resolución de problemas",
  corto: "Descarga y problemas",
  paginas: [13, 17],
  bloques: [
    {
      t: "p",
      p: 13,
      texto:
        "El análisis estructurado de la descarga es el eje del seguimiento en la práctica clínica y se apoya en tres ejes: optimizar los ajustes (umbrales y alarmas del sensor y parámetros de la bomba), identificar las conductas que explican el patrón (bolos omitidos o tardíos, sobretratamiento de hipoglucemias, hidratos fantasma, infrarrecuento) y abordarlas teniendo en cuenta las emociones y creencias subyacentes. En muchos casos, los patrones persistentes responden a conductas de uso modificables, por lo que la intervención educativa puede ser tan relevante como el ajuste técnico. La tabla 5 resume, en ocho pasos, la revisión sistemática de la descarga en consulta —de la visión global a la causa específica y al plan de cambios— y sirve de mapa para los apartados que siguen.",
    },
    {
      t: "p",
      p: 13,
      texto:
        "La tasa basal, la ratio I/HC y el factor de sensibilidad pueden modificarse, cuando proceda, orientativamente en un 10–20 %, mientras que el objetivo glucémico se ajusta entre los valores permitidos por cada sistema. Aunque algunos cambios pueden tener efecto desde la siguiente administración, su impacto sobre el patrón glucémico debe evaluarse durante varios días antes de realizar nuevos ajustes. En cambio, los objetivos y modos temporales se utilizan de forma anticipada ante situaciones concretas; por ejemplo, elevando el objetivo 1–2 h antes de un ejercicio previsto. En las modalidades híbridas, un mayor cumplimiento de los bolos prandiales se asocia a mejores resultados, lo que refuerza la importancia de evitar su omisión o retraso.",
    },
    { t: "tabla", p: 13, id: "T5" },
    { t: "h3", p: 14, id: "patrones", texto: "Interpretación de patrones en la descarga" },
    {
      t: "p",
      p: 14,
      lead: "Hiperglucemia posprandial precoz.",
      texto:
        "Si la glucosa sube en los primeros 60–90 min, la causa habitual es bolo tardío o insuficiente, ingesta mal estimada o comida de alto índice glucémico. Conviene adelantar el bolo y revisar ratio y recuento; el manejo del bolo ya omitido o retrasado se trata en resolución de incidencias.",
    },
    {
      t: "p",
      p: 14,
      lead: "Hiperglucemia tardía tras comidas grasas o proteicas.",
      texto:
        "Si el ascenso aparece 3–5 h después de la ingesta valorar el efecto de la grasa y las proteínas, un bolo insuficiente o una estrategia prandial inadecuada. En Control-IQ el bolo extendido es limitado en la versión clásica y dispone de mayor duración en Control-IQ+; en CamAPS FX puede utilizarse la función de absorción lenta. En los demás sistemas, la estrategia debe individualizarse según las herramientas disponibles, la respuesta previa y el riesgo de hipoglucemia.",
    },
    {
      t: "p",
      p: 14,
      lead: "Hipoglucemia nocturna.",
      texto:
        "Revisar primero ejercicio vespertino, alcohol, bolo tardío de cena, corrección manual, objetivo demasiado bajo o ratios agresivas, e identificar si el patrón se concentra en una franja antes de subir objetivos globalmente. En Tandem, el modo sueño no autocorrige, pero ajusta basal; en MiniMed, un objetivo más alto o temporal puede ayudar; en CamAPS FX, Ease-off o un objetivo más alto; en Omnipod 5, la Función Actividad (objetivo 150 mg/dl) o un objetivo configurado más alto.",
    },
    {
      t: "p",
      p: 14,
      lead: "Hiperglucemia matutina.",
      texto:
        "Puede deberse a fenómeno del alba, infraestimación de la cena, fallo de infusión nocturno, salida de automático, objetivo nocturno alto, alcohol con hiperglucemia tardía o problemas del sensor. Distinguir la hiperglucemia estable desde la madrugada del ascenso brusco al despertar orienta si se ajustan objetivos, ratios, basal de respaldo o conducta del bolo.",
    },
    {
      t: "p",
      p: 15,
      lead: "Variabilidad elevada con TIR aceptable.",
      texto:
        "No basta con el TIR, hay que revisar coeficiente de variación, oscilaciones posprandiales, sobretratamiento de hipoglucemia, bolos repetidos, ejercicio y horarios irregulares. La meta puede ser reducir carga y variabilidad más que bajar la HbA1c.",
    },
    {
      t: "p",
      p: 15,
      lead: "Tiempo por debajo del rango elevado.",
      texto:
        "Es el dato que más debe frenar la intensificación: obliga a revisar hipoglucemias nocturnas, bolos manuales, ratios, actividad física, alcohol, objetivos temporales y sobretratamiento de hiperglucemias. Solo con un TBR aceptable se buscan más TITR u objetivos más estrictos.",
    },
    {
      t: "p",
      p: 15,
      lead: "Exceso de autocorrecciones.",
      texto:
        "En MiniMed 780G o Tandem Control-IQ, un exceso de bolos automáticos de corrección puede indicar bolos omitidos o tardíos, ratios insuficientes, comidas no anunciadas o un objetivo poco intensivo; en Control-IQ debe revisarse además el factor de sensibilidad, mientras que en MiniMed 780G son especialmente relevantes el objetivo y la duración de la insulina activa. No es automáticamente un éxito del algoritmo; puede señalar un problema no evidente —bolos omitidos, ratio insuficiente o mayor necesidad de insulina— y riesgo de hipoglucemia tardía si se añaden bolos manuales.",
    },
    {
      t: "p",
      p: 15,
      lead: "Salidas repetidas del modo automático.",
      texto:
        "El tiempo fuera del modo automático es una métrica de salud del sistema en sí misma: una persona que pasa muchas horas en manual no se está beneficiando plenamente de la automatización, y antes de cualquier ajuste de parámetros debe resolverse la causa de salida. Las causas concretas y la actuación inmediata se desarrollan en el apartado de resolución de incidencias.",
    },
    {
      t: "p",
      p: 15,
      texto:
        "El informe debe interpretarse siempre junto a la persona con diabetes: unas mismas métricas —autocorrecciones repetidas, TBR bajo, mejoría nocturna aparente— pueden responder a causas técnicas o conductuales distintas, y sin esa conversación el informe se queda en números.",
    },
    { t: "h3", p: 15, id: "incidencias", texto: "Resolución de incidencias" },
    {
      t: "p",
      p: 15,
      texto:
        "Si la interpretación de patrones del apartado anterior orienta los ajustes a partir de la descarga, este apartado se centra en la actuación inmediata ante incidencias concretas. La Figura 3 desarrolla el algoritmo de hiperglucemia persistente y sospecha de fallo de infusión, y la tabla 5 resume el análisis estructurado de la descarga.",
    },
    {
      t: "p",
      p: 15,
      lead: "Hiperglucemia persistente y sospecha de fallo de infusión.",
      texto:
        "Una glucemia ≥ 250 mg/dl persistente (orientativamente ≥ 2 h) o cualquier hiperglucemia inexplicada que no responde a la corrección debe interpretarse como sospecha de fallo del set. En personas tratadas con iSGLT2 —por indicación cardiorrenal o fuera de ficha técnica en la DM1— debe mantenerse una alta sospecha de cetoacidosis y medirse la cetonemia ante síntomas o situaciones de riesgo, con independencia del nivel de glucemia, ya que puede cursar con glucemia normal o solo moderadamente elevada. Los signos a considerar incluyen ardor en la zona de inserción, despegado parcial del adhesivo, lectura errática del sensor en proximidad del set o ausencia de respuesta a las autocorrecciones. La actuación recomendada combina cambio del set, determinación de cetonemia y corrección con pluma según el plan de seguridad (v. Figura 3). La regla orientativa es “ante la duda, cambia el set”.",
    },
    {
      t: "lista",
      p: 15,
      intro:
        "**Cetonemia.** La determinación de cetonemia capilar (β-hidroxibutirato) es el método de referencia y guía la decisión clínica según cuatro tramos operativos (v. Figura 3):",
      items: [
        "β-OHB <0,6 mmol/l: sin cetosis significativa; si la hiperglucemia persiste o no responde a una corrección, mantener la sospecha de fallo de infusión, administrar la corrección con pluma y recambiar el set/pod según el plan de seguridad.",
        "β-OHB 0,6–0,9 mmol/l: cetonemia leve; vigilancia estrecha, revisión del sistema y reevaluación de glucemia y cetonemia en 1–2 h. Si la hiperglucemia no responde o existe sospecha de fallo de infusión, administrar la corrección con pluma y recambiar el set/pod. Si β-OHB aumenta a ≥1,0 mmol/l, seguir las recomendaciones del tramo siguiente.",
        "β-OHB 1,0–2,9 mmol/l: cetosis significativa / probable fallo de infusión; administrar la corrección con pluma y recambiar el set/pod según el plan de seguridad.",
        "β-OHB ≥3,0 mmol/l o presencia de signos de gravedad —vómitos persistentes, dolor abdominal, respiración rápida o profunda, somnolencia, confusión, deshidratación, imposibilidad para beber o deterioro del estado general—: posible cetoacidosis diabética; valoración hospitalaria urgente.",
      ],
    },
    { t: "diagrama", p: 15, id: "cetonemia" },
    {
      t: "p",
      p: 15,
      p2: 16,
      texto:
        "La dosis de corrección con pluma puede calcularse mediante el factor de sensibilidad o, alternativamente, según el peso corporal (v. Figura 3). En pediatría, los umbrales se modifican según el protocolo local. Tras una corrección con pluma, el sistema no contabiliza esa insulina como activa, por lo que debe extremarse la vigilancia para evitar la superposición de dosis (apilamiento) y seguir el plan individual para la reanudación segura de la automatización.",
    },
    {
      t: "p",
      p: 16,
      lead: "Bolos omitidos o retrasados.",
      texto:
        "Causa frecuente de hiperglucemia posprandial persistente. Ante un bolo omitido o retrasado debe evitarse administrar automáticamente el bolo completo sin considerar la glucemia, la tendencia, la insulina activa y la respuesta previa del algoritmo; la conducta se individualiza según el tiempo transcurrido, la composición de la comida y el sistema utilizado. Como orientación educativa en sistemas híbridos, si el bolo se omite o retrasa durante la primera hora tras la ingesta, puede valorarse administrar solo una parte de la dosis prevista, teniendo en cuenta la glucemia, tendencia e insulina activa; transcurrido más tiempo, suele ser preferible utilizar el calculador de corrección en lugar de administrar el bolo prandial completo. La pauta debe individualizarse según el sistema y el plan educativo.",
    },
    {
      t: "p",
      p: 16,
      lead: "Hidratos de carbono fantasma (ghost carbs).",
      texto:
        "Algunas personas introducen hidratos de carbono no asociados a una ingesta real para inducir un bolo adicional. Esta práctica se desaconseja, ya que puede aumentar el riesgo de hipoglucemia, favorecer la variabilidad glucémica y distorsionar el funcionamiento o la interpretación del sistema. Su detección debe motivar una intervención educativa: explorar la causa subyacente —por ejemplo, una corrección percibida como insuficiente, temor a la hiperglucemia o una comprensión inadecuada del funcionamiento del sistema— y ofrecer una alternativa segura.",
    },
    {
      t: "p",
      p: 16,
      lead: "Pérdidas de señal y salidas del modo automático.",
      texto:
        "Frecuentes y casi siempre transitorias (distancia entre dispositivos, interferencias electromagnéticas o desgaste de batería). La actuación inmediata: reiniciar Bluetooth, acercar dispositivos y verificar baterías; las salidas reiteradas reducen el tiempo en automático y deben revisarse (v. tabla 5).",
    },
    {
      t: "p",
      p: 16,
      lead: "Lecturas falsamente bajas por compresión del sensor.",
      texto:
        "La presión sobre el sensor —típicamente al dormir sobre él— puede producir una lectura falsamente baja que lleve al algoritmo a reducir o suspender la insulina injustificadamente, con hiperglucemia de rebote posterior. Es sugestiva una caída brusca de la glucosa seguida de la recuperación rápida al cambiar de postura; ante la duda, confirmar con glucemia capilar y evitar el sobretratamiento.",
    },
    {
      t: "p",
      p: 16,
      lead: "Problemas cutáneos.",
      texto:
        "La irritación local, la dermatitis de contacto y la lipohipertrofia pueden aparecer con el uso prolongado de sensores y sistemas de infusión. La rotación sistemática de las zonas de inserción constituye una medida preventiva fundamental. Ante irritación persistente pueden valorarse películas barrera —como copolímeros acrílicos—, adhesivos alternativos o hipoalergénicos y el cambio de zona; si las lesiones son extensas, recurrentes o de difícil control, debe considerarse valoración dermatológica. La lipohipertrofia puede explicar hipoglucemias y variabilidad glucémica inexplicadas, por lo que debe explorarse al menos una vez al año mediante inspección y palpación. Deben evitarse las zonas afectadas y reforzarse la rotación de los puntos de inserción, ya que corregir estos factores puede mejorar el control y el rendimiento del sistema sin necesidad de modificar sus parámetros.",
    },
    {
      t: "p",
      p: 16,
      lead: "Tipos de catéter y cánula.",
      texto:
        "Ante fallos repetidos de infusión debe revisarse no solo el algoritmo, sino también la zona de inserción y el tipo de set. Las cánulas metálicas pueden ser útiles en personas con acodamientos repetidos o fallos inexplicados de las cánulas blandas, individualizando la comodidad y la frecuencia de recambio.",
    },
    {
      t: "p",
      p: 16,
      lead: "Fatiga por alarmas.",
      texto:
        "La sobrecarga de alertas puede llevar a desactivar alarmas relevantes o, de forma progresiva, a dejar de utilizar el sistema. Su prevención y manejo forman parte del seguimiento, especialmente en adolescentes, e incluyen individualizar los umbrales, reducir las alarmas que no requieren intervención sin comprometer las alertas de seguridad, evitar duplicidades entre sensor y bomba y revisar los ajustes predeterminados.",
    },
    {
      t: "p",
      p: 16,
      lead: "Rechazo del dispositivo.",
      texto:
        "Dificultad de aceptación por imagen corporal, visibilidad o sobrecarga del manejo. Estrategias: cambio de localización (zonas menos visibles), valoración de formatos alternativos (parche), transiciones temporales planificadas a una pauta alternativa cuando la carga del dispositivo comprometa la continuidad del tratamiento —siempre con plan de seguridad escrito y limitadas en el tiempo, para prevenir el abandono definitivo— y, en casos seleccionados, apoyo psicológico estructurado.",
    },
    {
      t: "lista",
      p: 16,
      p2: 17,
      intro:
        "**Errores que conviene evitar.** Conviene prestar atención a tres errores recurrentes:",
      items: [
        "Corregir sin atender a la insulina activa: los bolos manuales sucesivos, sumados a autocorrecciones o aumentos de basal, pueden producir hipoglucemia tardía. En personas con ansiedad por hiperglucemia conviene trabajar la tolerancia al tiempo de acción de la insulina y evitar la “persecución” de la glucosa.",
        "Descargar datos sin tomar decisiones: una descarga útil debe acabar siempre en una recomendación concreta —un cambio, una conducta a practicar, una alarma a ajustar o una fecha de reevaluación.",
        "Olvidar la dimensión emocional: alarmas, visibilidad del dispositivo, miedo a la hipoglucemia, presión de los cuidadores o fatiga tecnológica pueden explicar resultados subóptimos; la respuesta no siempre es técnica, sino educativa, psicológica u organizativa.",
      ],
    },
    {
      t: "p",
      p: 17,
      texto:
        "Como orientación rápida para decidir por dónde empezar: ante una hiperglucemia posprandial, revisar primero el momento del bolo y la ratio; ante una hiperglucemia basal o nocturna, el objetivo, el perfil basal o el factor según el sistema; y ante una hipoglucemia, el objetivo, la insulina activa, las ratios y el sobretratamiento.",
    },
  ],
};
