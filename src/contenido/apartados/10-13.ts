/* Apartados 10–13 del capítulo. Texto literal (PDF 5-10-2026). */
import type { Apartado } from "../tipos";

export const A10: Apartado = {
  n: 10,
  slug: "10-situaciones",
  titulo: "Situaciones especiales",
  corto: "Situaciones especiales",
  paginas: [17, 22],
  bloques: [
    {
      t: "p",
      p: 17,
      texto:
        "El uso del sistema de asa cerrada en la práctica habitual incluye situaciones que requieren ajustes específicos o manejo diferenciado: gestación, adolescencia y transición a la atención adulta, personas mayores, ejercicio físico, enfermedad intercurrente con riesgo de cetosis, tratamiento con glucocorticoides, enfermedad renal avanzada, hospitalización y exploraciones diagnósticas.",
    },
    { t: "h3", p: 17, id: "gestacion", texto: "Gestación" },
    {
      t: "p",
      p: 17,
      texto:
        "El uso de sistemas de asa cerrada durante la gestación en la DM1 está respaldado por evidencia aleatorizada y recogido en las recomendaciones actuales cuando se emplean sistemas con autorización y evidencia específicas para este contexto. La elección debe considerar además la capacidad del sistema para alcanzar los objetivos glucémicos de la gestación, la experiencia del equipo y la situación clínica individual. CamAPS FX dispone de marcado CE para su uso durante la gestación y de evidencia aleatorizada específica, principalmente del ensayo AiDAPT, además de permitir objetivos glucémicos suficientemente bajos; su modalidad Liberty, en cambio, no está autorizada durante la gestación. MiniMed 780G dispone asimismo de marcado CE para gestación y cuenta con evidencia específica procedente del ensayo CRISTAL; Control-IQ+ obtuvo autorización de la FDA y marcado CE para su uso durante la gestación en 2026, con apoyo en los resultados del ensayo CIRCUIT; y Omnipod 5 no dispone actualmente de autorización específica para su uso durante la gestación.",
    },
    {
      t: "p",
      p: 17,
      texto:
        "Los objetivos glucémicos son más estrictos que en la población general. En la planificación preconcepcional se recomienda una HbA1c <6,5 %, tan próxima a la normalidad como sea posible sin hipoglucemia significativa. Durante la gestación, el objetivo ideal es una HbA1c <6,0 % si puede alcanzarse con seguridad, pudiendo individualizarse hasta <7,0 % cuando sea necesario para evitar hipoglucemia significativa. Las métricas de MCG adquieren especial relevancia, con objetivos específicos para la gestación (subíndice p): TIRp 63–140 mg/dl >70 %, TBRp <63 mg/dl <4 %, TBRp <54 mg/dl <1 % y TARp >140 mg/dl <25 %. Como métrica complementaria de variabilidad, se recomienda mantener un coeficiente de variación ≤36 %.",
    },
    {
      t: "p",
      p: 17,
      texto:
        "AiDAPT mostró con CamAPS FX un mayor tiempo en rango específico de gestación y menor ganancia ponderal materna, además de señales favorables en algunos desenlaces maternos. CRISTAL evidenció con MiniMed 780G una mejoría principalmente nocturna y una reducción del tiempo por debajo del rango, sin diferencia significativa en el tiempo en rango global. CIRCUIT mostró con Control-IQ una mejoría significativa del tiempo en rango específico de gestación, junto con una reducción del tiempo por encima y por debajo del rango. Los tres ensayos difieren en diseño, población, tratamiento comparador y control glucémico de partida, y no tuvieron potencia suficiente para establecer diferencias concluyentes en los principales desenlaces obstétricos o neonatales, por lo que sus resultados no deben compararse directamente.",
    },
    {
      t: "p",
      p: 17,
      texto:
        "La planificación preconcepcional es la situación óptima, pero una proporción importante de las gestaciones en personas con diabetes pregestacional no son planificadas; por ello, una vez confirmado el embarazo conviene iniciar o adaptar precozmente un sistema con evidencia específica, especialmente cuando el control glucémico no es óptimo. El seguimiento debe intensificarse durante la gestación, ajustando de forma progresiva la ratio insulina/hidratos de carbono, el factor de sensibilidad y los objetivos glucémicos conforme cambian las necesidades de insulina, y anticipando el bolo prandial, habitualmente 10–15 min y, en fases avanzadas, hasta 30–45 min según la respuesta individual. Con CamAPS FX, el objetivo del algoritmo puede reducirse progresivamente: como orientación, alrededor de 100 mg/dl en el primer trimestre y 80–90 mg/dl a partir del segundo, pudiendo individualizarse aproximadamente a 81 mg/dl durante la noche si el TBR lo permite. Tras el parto debe elevarse nuevamente el objetivo. Son objetivos exigentes, que requieren utilizar los valores más bajos configurables y una supervisión estrecha.",
    },
    {
      t: "p",
      p: 17,
      p2: 18,
      texto:
        "En CamAPS FX, el factor de sensibilidad y la duración de la insulina activa configurados se utilizan en el calculador de bolos y no determinan directamente la administración automatizada; en modo automático adquieren especial relevancia el objetivo glucémico, la ratio insulina/hidratos de carbono y la correcta administración del bolo prandial. Boost puede utilizarse transitoriamente cuando aumentan las necesidades de insulina —por ejemplo, ante hiperglucemia posprandial, enfermedad leve sin cetosis o glucocorticoides antenatales—, mientras que Ease-off puede ser útil ante ejercicio o situaciones de mayor sensibilidad a la insulina, incluido el periodo periparto y el posparto inmediato.",
    },
    {
      t: "p",
      p: 18,
      texto:
        "Una limitación práctica de MiniMed 780G durante la gestación es que su objetivo mínimo configurable, de 100 mg/dl, permanece por encima de los objetivos glucémicos específicos del embarazo. Este aspecto debe considerarse en la selección y optimización del sistema, evitando estrategias no estandarizadas —como los hidratos fantasma— para forzar una mayor administración de insulina y priorizando el ajuste supervisado de los parámetros disponibles y del bolo prandial.",
    },
    {
      t: "p",
      p: 18,
      texto:
        "Control-IQ+ dispone de marcado CE para su uso durante la gestación en la DM1 desde junio de 2026, indicación respaldada por los resultados del ensayo CIRCUIT. No incorpora un objetivo gestacional específico configurable; la estrategia de intensificación se basa en optimizar la tasa basal, la ratio insulina/hidratos de carbono y el factor de sensibilidad. Puede utilizarse el modo sueño de forma continuada para emplear el rango de tratamiento más bajo disponible, de 112,5–120 mg/dl, reservando un rango más alto para el ejercicio. Esta estrategia fue utilizada en CIRCUIT y está recogida en las recomendaciones específicas de Tandem para la gestación. Durante este modo se intensifica la modulación basal, pero no se administran bolos automáticos de corrección, por lo que resultan especialmente importantes la revisión frecuente de los parámetros y la correcta administración del bolo prandial.",
    },
    {
      t: "p",
      p: 18,
      texto:
        "Durante la gestación debe extremarse la vigilancia de la cetoacidosis, que puede aparecer con glucemias menos elevadas que fuera del embarazo y comporta un riesgo importante para el feto. Debe disponerse de medición de cetonemia y reforzar su determinación ante hiperglucemia persistente, enfermedad intercurrente, vómitos o síntomas compatibles, además de llevar siempre material de recambio e insulina alternativa en pluma.",
    },
    {
      t: "p",
      p: 18,
      texto:
        "El sistema puede mantenerse durante el parto y el posparto inmediato en personas entrenadas y clínicamente estables, cuando puedan manejarlo con seguridad y exista un plan acordado con el equipo asistencial. Tras el parto, el aumento brusco de la sensibilidad a la insulina suele exigir una reducción importante de las necesidades de insulina y la adaptación de los ajustes del sistema.",
    },
    { t: "h3", p: 18, id: "adolescencia", texto: "Adolescencia y transición" },
    {
      t: "p",
      p: 18,
      texto:
        "La adolescencia y la transición de pediatría a adultos son etapas de vulnerabilidad: omisión o retraso de bolos, comidas no estructuradas, sobrecarga por alarmas, preocupaciones por la imagen corporal y paso progresivo a la autonomía. La omisión de bolos es uno de los predictores más consistentes de empeoramiento del control y de discontinuación del sistema; debe revisarse activamente en cada descarga y abordarse desde la educación, no solo desde el reajuste de parámetros. Como en esta etapa el control de partida suele ser peor, el incremento de TIR que aporta el asa cerrada es de los mayores, lo que refuerza la prioridad de iniciar y mantener el sistema pese a las dificultades de adherencia.",
    },
    {
      t: "p",
      p: 18,
      texto:
        "La conducta alimentaria alterada y la manipulación de la insulina con fines de control del peso (diabulimia) son banderas rojas específicas de esta etapa, particularmente en mujeres. Su detección precoz exige una entrevista activa: descensos no explicados de la dosis total diaria, episodios repetidos de cetoacidosis sin causa técnica identificable, preocupación desproporcionada por el peso, restricción alimentaria y discordancia entre HbA1c y patrón de glucemia obligan a la derivación a una unidad especializada. El consumo de alcohol merece una guía operativa específica: anticipar el riesgo de hipoglucemia diferida hasta 12-24 h tras la ingesta, valorar el uso de Ease-off (CamAPS FX) o un objetivo glucémico más conservador la noche del consumo y la mañana siguiente, y educar sobre la prudencia con los bolos prandiales en comidas asociadas a alcohol.",
    },
    {
      t: "p",
      p: 18,
      texto:
        "El seguimiento remoto compartido con los progenitores debe individualizarse: aporta valor en seguridad y reduce ansiedad familiar, pero su mantenimiento sin acuerdo del adolescente vulnera la autonomía progresiva y puede deteriorar la relación con el dispositivo y con el equipo. La regla operativa razonable es pactar el alcance del seguimiento compartido, revisarlo periódicamente y aceptar su reducción progresiva conforme avanza la autonomía. La transición de pediatría a adultos requiere un informe estructurado de traspaso: sistema, parámetros vigentes, objetivos individualizados, historia de incidencias, plan de seguridad y contactos. Conviene un período de solapamiento con visita conjunta cuando sea posible, y mantener explícitamente los soportes (descarga, educación, soporte técnico) durante los primeros meses. El abordaje incorpora, además, revisar los bolos en cada descarga, ajustar alarmas para reducir la fatiga y mantener un tono no culpabilizador, identificando barreras concretas y soluciones prácticas.",
    },
    { t: "h3", p: 19, id: "mayores", texto: "Población mayor con DM1" },
    {
      t: "p",
      p: 19,
      texto:
        "Los datos muestran reducción de la hipoglucemia, sobre todo nocturna y desapercibida. El ensayo AIDE T1D, en adultos mayores con DM1, incluyó deterioro cognitivo leve con efectividad comparable a la de quienes no lo tenían, pero excluyó la demencia establecida, escenario en el que las decisiones se apoyan en evidencia indirecta y valoración individualizada. Los objetivos se individualizan según estado funcional, cognitivo y comorbilidad: con autonomía conservada, equivalentes a la población general; en fragilidad o expectativa de vida limitada, se relajan, priorizando evitar la hipoglucemia (tiempo con glucosa <70 mg/dl, <1% como objetivo primario) y limitar la carga terapéutica. La selección valora destreza manual, agudeza visual, capacidad cognitiva y apoyo familiar, y las interfaces más sencillas facilitan el uso sostenido. El deterioro cognitivo progresivo exige la reevaluación periódica con el entorno cuidador y valorar la capacidad de respuesta ante alarmas e incidencias.",
    },
    { t: "h3", p: 19, id: "ejercicio", texto: "Ejercicio físico" },
    {
      t: "p",
      p: 19,
      texto:
        "El manejo del ejercicio se apoya en el documento de posicionamiento conjunto de la Asociación Europea para el Estudio de la Diabetes y la Sociedad Internacional de Diabetes Pediátrica y del Adolescente sobre el uso de los sistemas de asa cerrada durante la actividad física, que adapta las recomendaciones al tipo de actividad y a su carácter planificado o no. El ejercicio aeróbico tiende a bajar la glucosa; el anaeróbico o de fuerza puede elevarla transitoriamente, y el mixto combina ambos efectos.",
    },
    {
      t: "p",
      p: 19,
      texto:
        "Antes de empezar conviene valorar la glucemia de partida, su tendencia y la insulina activa: un bolo reciente o una flecha descendente aumentan el riesgo de hipoglucemia. Como referencia, se recomienda iniciar el ejercicio con una glucemia de 126–180 mg/dl; con cifras <90 mg/dl deben administrarse hidratos de carbono y retrasar el inicio. Si la glucemia supera 270 mg/dl, debe medirse la cetonemia y descartarse un fallo de infusión. Si la β-OHB es ≥1,0 mmol/l en contexto de hiperglucemia persistente o sospecha de fallo de infusión, debe aplicarse previamente el algoritmo de la figura 3; en cualquier caso, el ejercicio debe evitarse con cetonemia ≥1,5 mmol/l, con independencia de la glucemia, hasta corregir la cetosis y reevaluar la situación clínica.",
    },
    { t: "diagrama", p: 19, id: "ejercicio" },
    {
      t: "p",
      p: 19,
      texto:
        "En la actividad planificada con descenso esperado, la primera medida es elevar el objetivo glucémico mediante el modo o el objetivo temporal del sistema, iniciado 1-2 h antes de la actividad. Solo de forma complementaria, si el ejercicio se realiza en las 2 h siguientes a una comida rica en hidratos, se reduce además el bolo prandial en un 25-33 %. Durante la actividad conviene vigilar las lecturas y las flechas de tendencia y tomar pequeñas cantidades de hidratos rápidos (orientativamente 10-20 g) si la glucosa baja de unos 126 mg/dl, sin anunciarlos al sistema y habitualmente en menor cantidad que sin AID porque el algoritmo ya ha reducido la insulina. Estas cantidades se refieren a la prevención del descenso glucémico durante la actividad y no sustituyen el tratamiento de una hipoglucemia ya establecida. Conviene comprobar la glucosa del sensor a los 20–30 min y repetir la ingesta si es necesario.",
    },
    {
      t: "p",
      p: 19,
      texto:
        "En la actividad no planificada, si se prevé un descenso o una estabilidad de la glucosa, el objetivo debe elevarse de inmediato al iniciar el esfuerzo, tomando hidratos rápidos si la glucosa está baja. En cambio, ante un esfuerzo breve y de alta intensidad o anaeróbico, que tiende a elevar la glucosa, suele preferirse mantener el objetivo habitual y evitar sobrecorregir la hiperglucemia reactiva, ya que la corrección puede desencadenar una hipoglucemia posterior inducida por el sistema; en general, conviene dejar actuar al algoritmo.",
    },
    {
      t: "p",
      p: 19,
      texto:
        "Como recomendación práctica, en deportes de contacto o actividades acuáticas puede ser necesario retirar temporalmente las bombas con catéter, según el dispositivo, las recomendaciones del fabricante y el tipo y duración de la actividad. La clasificación de resistencia al agua no implica necesariamente que se recomiende nadar con la bomba; Omnipod 5, por su formato parche sin tubo, puede mantenerse durante la actividad acuática dentro de los límites de inmersión especificados por el fabricante. La inmersión puede además limitar la comunicación entre el sensor y el sistema AID. Cuando sea necesario interrumpir la administración de insulina, deben evitarse desconexiones prolongadas: las superiores a 1 h pueden aumentar el riesgo de hiperglucemia y cetosis, por lo que conviene planificar la reconexión y, cuando proceda, la corrección de insulina (v. «Interrupción del sistema y pauta alternativa»).",
    },
    {
      t: "p",
      p: 19,
      texto:
        "El riesgo de hipoglucemia diferida persiste durante varias horas tras el ejercicio, en especial por la noche. Por ello conviene mantener el objetivo más alto o el modo de ejercicio durante un tiempo después de la actividad y vigilar la noche siguiente; superada esa ventana, debe desactivarse para no perpetuar una hiperglucemia por un objetivo elevado mantenido de más. Las herramientas específicas por sistema —objetivo temporal de MiniMed, modo ejercicio de Tandem, Función Actividad de Omnipod (objetivo 150 mg/dl) y Ease-off de CamAPS FX— y su anticipación se sintetizan en la tabla 4; en el ejercicio prolongado o repetido, el ajuste se individualiza según la respuesta observada en las descargas.",
    },
    { t: "h3", p: 20, id: "enfermedad", texto: "Enfermedad intercurrente y riesgo de cetosis" },
    {
      t: "p",
      p: 20,
      texto:
        "Las enfermedades intercurrentes incrementan las necesidades de insulina y el riesgo de cetosis. La actuación se apoya en el plan de seguridad: aumento de la frecuencia de determinaciones de glucemia y cetonemia, hidratación según tolerancia, y activación de criterios de derivación a urgencias cuando proceda. Cuando la cetosis se acompaña de glucemia normal o baja —por ejemplo, por escasa ingesta o vómitos—, la insulina no debe suspenderse, ya que es necesaria para resolver la cetosis; en esa situación deben aportarse hidratos de carbono, preferiblemente líquidos azucarados en cantidades pequeñas y frecuentes, que permitan administrarla sin provocar hipoglucemia. Ante hiperglucemia persistente o inexplicada con sospecha de cetosis se aplica el algoritmo de la Figura 3.",
    },
    { t: "h3", p: 20, id: "glucocorticoides", texto: "Glucocorticoides sistémicos" },
    {
      t: "p",
      p: 20,
      texto:
        "Pueden producir incrementos rápidos y variables de las necesidades de insulina que los algoritmos comerciales no siempre anticipan adecuadamente. En personas seleccionadas, puede mantenerse el sistema AID con monitorización estrecha y ajustes individualizados, pero las dosis altas o los cambios rápidos de pauta pueden requerir perfiles alternativos, modo manual o insulina adicional bajo supervisión del equipo. Las funciones intensificadoras disponibles en algunos sistemas solo deben utilizarse tras descartar fallo de infusión y con un plan de seguimiento definido.",
    },
    { t: "h3", p: 20, id: "dialisis", texto: "Diálisis y enfermedad renal avanzada" },
    {
      t: "p",
      p: 20,
      texto:
        "La enfermedad renal crónica avanzada modifica la farmacocinética de la insulina, la sensibilidad y el riesgo de hipoglucemia. El mantenimiento del sistema puede considerarse en pacientes seleccionados, estables y con autocuidado preservado, con monitorización estrecha y coordinación con nefrología. En hemodiálisis, el riesgo de hipoglucemia puede incrementarse durante y tras la sesión. En diálisis peritoneal, la carga glucídica del líquido puede favorecer hiperglucemia sostenida. La evidencia específica es limitada. En personas seleccionadas debe priorizarse la seguridad mediante objetivos menos intensivos y ajustes prudentes de los parámetros que realmente modifican el modo automático de cada sistema, junto con monitorización estrecha y un plan de respaldo claramente establecido.",
    },
    { t: "h3", p: 20, id: "ingreso", texto: "Ingreso hospitalario" },
    {
      t: "p",
      p: 20,
      texto:
        "El posicionamiento internacional de 2026, avalado por la EASD, la ADA, la JBDS-IP y la Australian Diabetes Society, proporciona un marco común para el uso hospitalario de MCG, bombas de insulina y sistemas AID. Las recomendaciones siguientes se refieren a adultos hospitalizados no críticos y no deben extrapolarse directamente a población pediátrica.",
    },
    {
      t: "p",
      p: 20,
      texto:
        "La MCG, la bomba de insulina y los sistemas AID pueden mantenerse cuando la persona puede utilizarlos de forma segura y el centro dispone de personal, procedimientos y recursos que permitan su supervisión. La capacidad de autocuidado debe reevaluarse durante el ingreso —idealmente en cada contacto asistencial—, ya que puede cambiar con la evolución clínica. El hospital debe disponer además de procedimientos que definan las responsabilidades de la persona y del equipo asistencial respecto al manejo del dispositivo y al registro de sus datos. Cuando no existen contraindicaciones, puede mantenerse el modo automático del AID; en personas en ayunas o con mayor riesgo de hipoglucemia puede valorarse temporalmente un objetivo glucémico más alto o un modo menos intensivo, según las posibilidades del sistema y el protocolo institucional.",
    },
    {
      t: "p",
      p: 20,
      texto:
        "En personas hospitalizadas que mantienen la MCG, este posicionamiento propone, fundamentalmente a partir de consenso de expertos, objetivos orientativos de TIR 70–180 mg/dl >60 %, TAR >180 mg/dl <25 %, TAR >250 mg/dl <5 % y TBR <70 mg/dl 0 %. Introduce además el tiempo próximo a hipoglucemia (70–100 mg/dl), que debería mantenerse <15 %, priorizando en el hospital la prevención de hipoglucemia y de complicaciones agudas frente a objetivos ambulatorios más estrictos.",
    },
    {
      t: "p",
      p: 20,
      p2: 21,
      texto:
        "La continuación del sistema no es apropiada cuando la persona o el equipo asistencial no pueden manejarlo con seguridad, existe alteración del nivel de conciencia que impide el autocuidado —excluida la anestesia—, cetoacidosis diabética o estado hiperosmolar, falta de material necesario, determinadas exploraciones incompatibles o situaciones que comprometan la precisión de la MCG. En estos casos debe establecerse una pauta alternativa sin interrupción de la cobertura insulínica. Si la transición desde bomba/AID a una pauta subcutánea está programada, la insulina basal debe administrarse aproximadamente 2 h antes de suspender la bomba. Cuando el sistema no proporciona un perfil basal detallado —como puede ocurrir con Omnipod 5—, la pauta de respaldo puede estimarse a partir de la dosis total diaria; en el ámbito hospitalario, una distribución inicial aproximada del 50 % basal y 50 % prandial puede utilizarse como punto de partida, individualizándola según la ingesta y la situación clínica. La bomba o el AID pueden reanudarse cuando hayan desaparecido las contraindicaciones y el efecto de la insulina basal administrada haya disminuido suficientemente; como orientación, unas 22 h tras la última dosis de una basal de duración cercana a 24 h, individualizando según el preparado utilizado.",
    },
    {
      t: "p",
      p: 21,
      texto:
        "Mientras se mantiene la bomba o el AID, las dosis suplementarias de insulina deben administrarse preferentemente a través de la propia bomba, salvo que exista una razón clínica para utilizar una pauta alternativa. La persona debe compartir con el equipo asistencial los datos relevantes de glucosa e insulina, y la MCG no elimina la necesidad de glucemia capilar cuando sea preciso validar sus lecturas.",
    },
    {
      t: "p",
      p: 21,
      texto:
        "La MCG hospitalaria debe interpretarse teniendo en cuenta posibles interferencias y situaciones que alteran su precisión. Pueden producirse lecturas inexactas con mala perfusión periférica, hipoglucemia, hiperglucemia grave, compresión del sensor, acidosis, anemia grave o sustancias interferentes específicas del dispositivo. Debe confirmarse con glucemia capilar durante las primeras 24 h tras la inserción de un nuevo sensor y cuando exista discordancia con la situación clínica, valores extremos o sospecha de interferencia. Ante discrepancias entre MCG y glucemia capilar, debe utilizarse el valor más bajo para orientar las decisiones clínicas y minimizar el riesgo de hipoglucemia; si las discrepancias clínicamente relevantes persisten, debe plantearse la sustitución o suspensión del sensor.",
    },
    {
      t: "p",
      p: 21,
      texto:
        "En el **período perioperatorio**, los objetivos glucémicos deben seguir el estándar hospitalario vigente. En procedimientos quirúrgicos cortos —orientativamente, aquellos que no ocasionan más de una comida omitida— puede mantenerse la bomba o el AID, incluido el modo automático, si la situación clínica lo permite y existe un protocolo institucional. En intervenciones más prolongadas o complejas, con riesgo de prolongación del procedimiento, debe realizarse transición a perfusión intravenosa de insulina (v. Tabla 6). Si se mantiene el sistema, debe comprobarse que dispone de insulina y material suficientes, situar el set de infusión fuera del campo quirúrgico —preferentemente renovado el día previo cuando proceda— y garantizar que el anestesista tenga acceso a la bomba para poder suspenderla o desconectarla si fuera necesario. La hospitalización debe contemplar además un plan de contingencia ante la retirada inesperada del sistema y su reintroducción una vez recuperadas las condiciones de seguridad, siempre que sea posible antes del alta.",
    },
    {
      t: "h3",
      p: 21,
      id: "exploraciones",
      texto: "Exploraciones diagnósticas y procedimientos con radiación o campos electromagnéticos",
    },
    {
      t: "p",
      p: 21,
      texto:
        "Ante una exploración, la bomba o el pod y el sensor/transmisor deben valorarse por separado, ya que la compatibilidad de un componente no implica la del sistema completo. No es necesario retirar sistemáticamente toda la tecnología. En los sistemas comercializados en España revisados para este capítulo, la bomba o el pod debe retirarse antes de una resonancia magnética (RM) o una tomografía computarizada (TC); en radiografía, PET, radioterapia, electrocirugía o diatermia, la conducta depende del dispositivo y de su exposición al campo. El sensor/transmisor puede mantenerse en determinadas exploraciones y modelos (Tabla 6).",
    },
    {
      t: "p",
      p: 21,
      texto:
        "Si un sensor autorizado permanece colocado durante una RM, sus lecturas pueden alterarse transitoriamente y suelen normalizarse en aproximadamente 1 h; con la diatermia se ha descrito un comportamiento similar, aunque con menor evidencia. Hasta entonces, conviene confirmar la glucemia capilar antes de tomar decisiones terapéuticas o reanudar la automatización. En la PET con fluorodesoxiglucosa (FDG) deben seguirse además las indicaciones de Medicina Nuclear sobre ayuno, glucemia e insulinoterapia previa.",
    },
    {
      t: "p",
      p: 21,
      texto:
        "En los controles aeroportuarios, las restricciones varían entre dispositivos; conviene llevar la documentación de viaje y solicitar inspección alternativa cuando estén contraindicados determinados escáneres o equipos de rayos X.",
    },
    { t: "tabla", p: 21, id: "T6" },
  ],
};

export const A11: Apartado = {
  n: 11,
  slug: "11-diy",
  titulo: "Sistemas de asa cerrada de código abierto (DIY)",
  corto: "Código abierto (DIY)",
  paginas: [22, 22],
  bloques: [
    {
      t: "p",
      p: 22,
      texto:
        "Junto con los sistemas comerciales coexisten sistemas de asa cerrada de desarrollo propio (DIY) basados en código abierto, desarrollados desde la comunidad de personas con DM1 bajo el lema #WeAreNotWaiting y con situaciones regulatorias diferentes. Tidepool Loop se originó en este ecosistema, pero obtuvo autorización de la FDA como controlador glucémico automatizado interoperable y su algoritmo se integra actualmente en un sistema comercial disponible en Estados Unidos, por lo que no es equiparable a un sistema DIY puro. Entre los sistemas DIY no comercializados como productos sanitarios integrados en nuestro entorno se encuentran AndroidAPS, para Android y basado en OpenAPS, y Trio, para iOS y desarrollado a partir del ecosistema OpenAPS/iAPS.",
    },
    {
      t: "p",
      p: 22,
      texto:
        "La evidencia disponible procede fundamentalmente de estudios observacionales y de ensayos aleatorizados. El más sólido, CREATE, comparó un sistema DIY basado en AndroidAPS/OpenAPS frente a terapia con bomba aumentada por sensor y mostró una mejoría significativa del tiempo en rango, sin episodios de hipoglucemia grave ni cetoacidosis durante el período de estudio. Estos resultados indican que los sistemas DIY pueden aportar beneficios clínicos relevantes en personas adecuadamente capacitadas y con seguimiento clínico, pero no permiten afirmar equivalencia de eficacia o seguridad frente al conjunto de sistemas AID comerciales actuales.",
    },
    {
      t: "p",
      p: 22,
      texto:
        "En nuestro entorno, los sistemas DIY no deben presentarse ni ofrecerse desde la consulta como tecnologías comerciales autorizadas, y su acompañamiento clínico no equivale a una prescripción ni a una validación regulatoria del sistema. Cuando una persona ya utiliza uno de estos sistemas o solicita información sobre ellos, debe recibir una atención clínica no discriminatoria: el profesional puede revisar los resultados y los parámetros relevantes para la seguridad y la insulinoterapia, orientar los ajustes clínicos dentro de su competencia, reforzar la educación terapéutica y garantizar un plan de respaldo y de actuación ante incidencias. La instalación, la actualización del software y el soporte técnico específico del sistema corresponden a la persona y a los recursos de la comunidad o del desarrollador, no al circuito asistencial habitual. Conviene documentar en la historia clínica el sistema utilizado, la información facilitada sobre su situación regulatoria, los datos revisados, el plan de seguridad y el seguimiento acordado, en el marco de una alianza terapéutica basada en información transparente y decisión compartida.",
    },
    {
      t: "p",
      p: 22,
      texto:
        "Las vías de descarga o visualización de datos pueden no integrarse con las plataformas oficiales del centro, por lo que conviene documentar el sistema utilizado y los datos empleados en cada valoración. No debe imponerse el cambio a un sistema comercial salvo que exista una razón clínica o de seguridad justificada y tras un proceso de decisión compartida; tampoco deben recomendarse activamente como estándar asistencial. En pediatría, su uso exige una valoración especialmente cuidadosa de la competencia técnica del cuidador, la carga familiar y la salvaguarda del menor.",
    },
  ],
};

export const A12: Apartado = {
  n: 12,
  slug: "12-horizonte",
  titulo: "Implementación y horizonte próximo",
  corto: "Implementación y horizonte",
  paginas: [23, 23],
  bloques: [
    {
      t: "p",
      p: 23,
      texto:
        "A medida que los sistemas AID se consolidan como una modalidad preferente de administración de insulina en la DM1, el reto principal deja de ser demostrar su eficacia y pasa a ser garantizar una implementación clínica consistente. La automatización no debe entenderse únicamente como la prescripción de un dispositivo, sino como un proceso asistencial que incluye selección individualizada, decisión compartida, formación estructurada, revisión periódica de resultados y capacidad de soporte mantenido. En la práctica real, el beneficio dependerá tanto de las prestaciones del sistema como de la organización del equipo y de su capacidad para acompañar a la persona durante el inicio, la optimización y los cambios en sus necesidades.",
    },
    {
      t: "p",
      p: 23,
      texto:
        "La financiación, la disponibilidad territorial, la capacitación del equipo, la accesibilidad a programas estructurados de educación terapéutica y el reconocimiento organizativo del papel de los profesionales que la proporcionan pueden condicionar tanto el inicio como la continuidad del tratamiento. También influyen la alfabetización digital, las barreras lingüísticas o funcionales y la capacidad de adaptar el seguimiento a las necesidades de cada persona. A escala del sistema sanitario persisten retos como la inercia clínica, la heterogeneidad en los circuitos de acceso y la falta de estandarización de los programas educativos y de seguimiento. Por ello, la evaluación de los programas de automatización debería ir más allá de la HbA1c, el tiempo en rango o la hipoglucemia, e incorporar resultados relevantes para la persona —como la carga terapéutica, la experiencia de uso, la confianza en el sistema, la calidad de vida y la persistencia del tratamiento—, junto con indicadores asistenciales y de utilización de recursos.",
    },
    {
      t: "p",
      p: 23,
      texto:
        "La valoración económica de los AID no depende únicamente del coste del dispositivo, sino también del perfil basal de riesgo, del comparador utilizado, de los beneficios clínicos acumulados y de los recursos necesarios para un uso seguro y mantenido. Por ello, una indicación amplia debe acompañarse de una implantación equitativa y sostenible, con criterios transparentes de acceso y modelos asistenciales capaces de sostener el soporte técnico y educativo a largo plazo.",
    },
    {
      t: "p",
      p: 23,
      texto:
        "El horizonte próximo apunta hacia sistemas progresivamente más sencillos de utilizar y capaces de reducir la carga de decisiones diarias. Las modalidades de asa cerrada completa comienzan a cuestionar la necesidad del bolo prandial en indicaciones concretas, mientras que la ampliación regulatoria de algunos sistemas está extendiendo su uso a poblaciones previamente menos representadas. Otros avances, como una mayor interoperabilidad, o las aproximaciones bihormonales, deberán demostrar que aportan beneficios clínicamente relevantes y no únicamente mayor sofisticación tecnológica. El verdadero progreso no se medirá por el grado de automatización alcanzado, sino por la capacidad de traducirlo, con seguridad y equidad, en mejores resultados y menos carga para cada persona con DM1, dentro de una atención que sigue precisando educación, criterio clínico y acompañamiento.",
    },
  ],
};

export const A13: Apartado = {
  n: 13,
  slug: "13-infografia",
  titulo: "Infografía",
  corto: "Infografía",
  paginas: [23, 24],
  bloques: [{ t: "figura", p: 24, id: "INFO" }],
};
