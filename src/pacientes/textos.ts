/* Textos para pacientes, LITERALES, del autor del capítulo. Capa «Para el paciente»: no es
   texto del capítulo y se muestra siempre rotulada.
   · Información para pacientes: versión corregida V5 del autor. La maquetación de la editorial
     del 5-10-2026 es idéntica a ella palabra por palabra (la del 30-9-2026 era anterior).
   · Resumen: maquetación de la editorial del 30-9-2026 (idéntica palabra por palabra a la V6 del autor).
   Generado desde los .docx del autor; la auditoría (scripts/auditoria/fidelidad_extra.py) lo comprueba.
   No editar a mano. */

export interface SeccionPaciente {
  pregunta: string;
  parrafos: string[];
}

export const TITULO_CAPITULO_PACIENTES =
  "Tratamiento insulínico del paciente con diabetes mellitus tipo 1: automatización de la insulinoterapia";
export const AUTOR_PACIENTES =
  "Georgios Kyriakos. Servicio de Endocrinología y Nutrición. Hospital General Universitario Santa Lucía. Cartagena. Murcia.";

export const INFORMACION_PACIENTES = {
  rotulo: "Información para pacientes",
  fuente: "Maquetación de la editorial (ec-europe, 5-10-2026), igual a la versión V5 del autor",
  secciones: [
    {
      pregunta: "¿Qué es un sistema de asa cerrada?",
      parrafos: [
        "Es un sistema que combina tres elementos que funcionan juntos: un sensor que mide la glucosa de forma continua, una bomba (con tubo o catéter) o un pod (sin tubo externo) que administra la insulina, y un algoritmo -un programa de cálculo- que, a partir de los datos del sensor, ajusta la insulina automáticamente cada pocos minutos: la aumenta, la reduce o la suspende para mantener la glucosa en el objetivo y prevenir subidas y bajadas. Se llama «asa cerrada» porque cierra el círculo entre medir la glucosa y administrar la insulina.",
      ],
    },
    {
      pregunta: "¿Lo hace todo solo?",
      parrafos: [
        "No. Aunque a veces se llama «páncreas artificial», la mayoría de los sistemas son híbridos: ayudan mucho, pero la persona debe anunciar las comidas, administrar los bolos antes de comer, responder a alarmas, cambiar los dispositivos y saber actuar si la glucosa sube o baja. Existen modalidades más automatizadas que pueden reducir la necesidad de anunciar comidas, pero tampoco eliminan la necesidad de supervisión, formación y un plan de seguridad.",
      ],
    },
    {
      pregunta: "¿Hay un único sistema o varios? ¿Cómo se elige?",
      parrafos: [
        "No hay un solo sistema, sino varios disponibles. Se diferencian sobre todo en tres cosas: el formato (bombas con tubo o catéter o sistemas tipo parche/pod, sin tubo externo), el sensor de glucosa compatible y el algoritmo que controla la insulina, que no funciona igual en todos. La elección no es automática. Se valora junto con su equipo sanitario, teniendo en cuenta su perfil clínico, sus preferencias y estilo de vida, los sensores compatibles, la experiencia del equipo y la disponibilidad o condiciones de acceso en su centro sanitario. No existe un «mejor sistema» único para todos: el adecuado es el que mejor se ajusta a cada persona.",
      ],
    },
    {
      pregunta: "¿Qué beneficios puede tener?",
      parrafos: [
        "Suelen aumentar el tiempo con la glucosa en rango, reducir hipoglucemias -sobre todo nocturnas-, mejorar la estabilidad glucémica y disminuir la carga mental del manejo diario. En personas con buen control previo, la mejoría puede notarse más en estabilidad, seguridad y calidad de vida.",
      ],
    },
    {
      pregunta: "¿Quién puede usarlo?",
      parrafos: [
        "Puede considerarse en personas con diabetes tipo 1 que puedan usarlo de forma segura, por sí mismas o con ayuda, y que deseen usarlo. Puede ser especialmente útil si hay hipoglucemias, glucosa muy variable, dificultad para alcanzar objetivos, alta carga de autocuidado o edad pediátrica. En el embarazo y su planificación debe utilizarse un sistema adecuado para esa situación y con seguimiento especializado. El acceso depende de la indicación clínica y de los circuitos de cada centro.",
      ],
    },
    {
      pregunta: "¿Qué material se debe tener siempre disponible?",
      parrafos: [
        "Se debe tener una pauta alternativa escrita, facilitada por el equipo sanitario, para pasar temporalmente a insulina en pluma -múltiples dosis- si el sistema falla, se interrumpe o deja de administrar insulina correctamente. Esa pauta debe indicar qué insulina basal y rápida utilizar, en qué dosis, cómo calcular las correcciones y cuándo reanudar el sistema de forma segura.",
        "Material recomendado: insulina rápida y basal de respaldo en pluma, agujas, glucómetro, medidor de cetonas en sangre y tiras, recambios del set de infusión o pods, sensores si procede, cargadores, glucagón y teléfonos de contacto.",
      ],
    },
    {
      pregunta: "¿Qué hacer si se tiene hipoglucemia?",
      parrafos: [
        "En los sistemas de asa cerrada, algunas hipoglucemias pueden requerir menos hidratos de carbono porque el sistema ya ha reducido o suspendido la insulina. Seguir la cantidad indicada en el plan; como orientación, a menudo pueden bastar 5-10 g, aunque puede necesitarse más si la glucosa es muy baja, desciende rápidamente, existe ejercicio reciente o hay insulina activa significativa. Comprobar de nuevo la glucemia capilar a los 15 min y evitar el sobretratamiento. Si los síntomas no coinciden con el sensor, la glucosa cambia rápidamente o existen dudas, confirmar con glucemia capilar. Los hidratos usados para tratar una hipoglucemia no deben anunciarse como comida, salvo indicación concreta de su equipo o del propio sistema.",
      ],
    },
    {
      pregunta: "¿Qué hacer si la glucosa está alta y no baja?",
      parrafos: [
        "Regla clave: si la glucosa está alta y no baja, sospechar fallo de infusión hasta demostrar lo contrario. Una glucosa en torno a 250 mg/dl o más durante unas 2 h, o que no baja tras una corrección, puede indicar que la insulina no está llegando bien: cánula acodada, tubo obstruido, adhesivo despegado, fuga o fallo del pod. Confirmar la glucemia capilar y medir cetonas en sangre. Revisar el set o pod e hidratarse según la glucosa: líquidos sin azúcar si está elevada; si está baja o descendiendo, tomar líquidos con azúcar en pequeñas cantidades para poder mantener la insulina sin provocar hipoglucemia. Si las cetonas están entre 0,6 y 0,9 mmol/l, aumentar la vigilancia y repetir glucosa y cetonas en 1-2 h; si son ≥1,0 mmol/l, seguir de inmediato la pauta escrita de seguridad. Si la glucosa no respondió a una corrección previa o existe sospecha de fallo de infusión, cambiar el set de infusión o el pod y administrar la corrección con pluma según la pauta escrita. El sistema no contabiliza la insulina administrada con pluma como insulina activa; existe riesgo de superposición de dosis e hipoglucemia, por lo que no debe repetirse una corrección antes de 2 h salvo indicación del plan individual. Si toma medicamentos del grupo de los iSGLT2 (gliflozinas), está embarazada, tiene vómitos o una infección u otra enfermedad aguda, mida las cetonas aunque la glucosa no esté muy alta.",
      ],
    },
    {
      pregunta: "¿Qué hacer si hay que interrumpir el sistema o si falla?",
      parrafos: [
        "Si se usa una bomba con tubo y se necesita retirarla durante poco tiempo -por ejemplo, para una ducha, un cambio de dispositivo o una prueba breve-, revisar la glucosa y volver a conectarla lo antes posible. Si se usa un pod o sistema tipo parche, no retirar salvo indicación del equipo o necesidad médica; si se despega, falla o deja de administrar insulina, se deberá sustituir por uno nuevo. Si se prevé estar o se ha estado más de aproximadamente 1 h sin recibir insulina a través del sistema, si no se sabe cuándo se reanudará o si la glucosa está alta, seguir la pauta alternativa escrita facilitada por el equipo sanitario.",
      ],
    },
    {
      pregunta: "¿Cuándo se debe acudir a urgencias?",
      parrafos: [
        "Acudir a urgencias si las cetonas en sangre son ≥3,0 mmol/l; si aparecen vómitos, dolor abdominal, respiración rápida o profunda, somnolencia, confusión, mal estado general o imposibilidad para beber líquidos; o si la glucosa sigue alta o las cetonas no mejoran a pesar de seguir el plan de seguridad.",
      ],
    },
    {
      pregunta: "¿Qué se debe tener en cuenta con el ejercicio?",
      parrafos: [
        "El ejercicio puede bajar o subir la glucosa según el tipo, la intensidad y la duración. Si se espera que la glucosa baje, puede ser útil activar el modo de ejercicio u objetivo temporal más alto 1-2 h antes. Si el ejercicio se realiza después de comer, puede ser necesario reducir el bolo según el plan acordado. Si la glucosa es >270 mg/dl, medir cetonas y revisar el set o el pod; si son ≥1,0 mmol/l, seguir primero la pauta indicada en «¿Qué hacer si la glucosa está alta y no baja?» antes de iniciar o reanudar el ejercicio. No realizar ejercicio si las cetonas en sangre son ≥1,5 mmol/l, independientemente de la glucosa. Si se toman hidratos para prevenir un descenso durante el ejercicio, comprobar el sensor 20-30 min después y repetir la toma si es necesario según el plan; si ya hay hipoglucemia, actuar como se indica en el apartado de hipoglucemia.",
      ],
    },
    {
      pregunta: "¿Qué pasa si se viaja o se tiene una prueba médica?",
      parrafos: [
        "Cuando se realiza un viaje, hay que llevar material de repuesto, insulina rápida, insulina basal, medidor de glucosa, medidor de cetonas, cargadores y el plan de seguridad. La bomba o el pod y el sensor deben valorarse por separado. En los sistemas revisados para este manual, la bomba o el pod debe retirarse antes de una resonancia magnética o una TC; el manejo del sensor depende del modelo. Para radiografías, PET, radioterapia, electrocirugía, diatermia u otras pruebas, seguir las instrucciones específicas del dispositivo y consultar con el equipo. En los controles aeroportuarios, revisar también las indicaciones de viaje del fabricante y solicitar una inspección alternativa cuando esté indicado.",
      ],
    },
    {
      pregunta: "Mensaje final",
      parrafos: [
        "Los sistemas de asa cerrada pueden facilitar el manejo diario de la diabetes, reducir la carga del tratamiento y mejorar la calidad de vida. Para usarlos con seguridad, es importante contar con una formación adecuada y un plan claro ante incidencias. Ante dudas o situaciones que no se resuelvan, contactar con el equipo sanitario.",
      ],
    },
  ] as SeccionPaciente[],
};

export const RESUMEN_CAPITULO = {
  rotulo: "Resumen",
  fuente: "Maquetación de la editorial (ec-europe, 30-9-2026)",
  parrafos: [
    "Los sistemas de administración automatizada de insulina (AID, automated insulin delivery), también denominados sistemas de asa cerrada, integran monitorización continua de glucosa, bomba de insulina o pod y un algoritmo que ajusta dinámicamente la administración de insulina según los valores y las tendencias de la glucosa. Pueden considerarse una modalidad preferente de administración de insulina en la diabetes tipo 1 en personas capaces de utilizarlos con seguridad, por sí mismas o con apoyo, con el objetivo de aumentar el tiempo en rango, reducir la hipoglucemia y la variabilidad glucémica, mejorar la seguridad y disminuir la carga cotidiana del autocuidado.",
    "La mayoría de los sistemas AID actualmente disponibles son híbridos: automatizan gran parte de la administración de insulina y, en algunos casos, realizan autocorrecciones, pero siguen requiriendo la participación de la persona para anunciar comidas, administrar bolos prandiales, responder a alarmas, realizar recambios y actuar ante incidencias. Las modalidades de asa cerrada completa (fully closed-loop), como la modalidad Liberty de myLoop powered by CamAPS FX, reducen la necesidad de bolos para las comidas en las situaciones en las que está previsto su uso, aunque no sustituyen la educación terapéutica ni el plan de seguridad.",
    "En España están comercializados MiniMed 780G, los sistemas Tandem t:slim X2 y Mobi, myLoop powered by CamAPS FX —incluida la modalidad Liberty— y Omnipod 5. Estos sistemas difieren en formato, sensores compatibles, localización y lógica del algoritmo, objetivos glucémicos, modos temporales, autocorrecciones y parámetros que influyen realmente en el funcionamiento automático. Por ello, la elección debe individualizarse mediante decisión compartida, considerando el perfil clínico, las preferencias de la persona, las autorizaciones regulatorias, la disponibilidad local, la financiación, la experiencia del equipo y la capacidad de uso seguro.",
    "La evidencia muestra que los sistemas AID aumentan el tiempo en rango y reducen la hemoglobina glucosilada (HbA1c), habitualmente sin incrementar la hipoglucemia y, en muchos perfiles, disminuyéndola. Además, pueden mejorar la calidad de vida, la calidad del sueño, la confianza en el tratamiento y la carga percibida. Su beneficio potencial es especialmente relevante en personas con hipoglucemia problemática, elevada variabilidad glucémica, dificultad para alcanzar objetivos individualizados, alta carga de autocuidado, edad pediátrica o adolescente, gestación o necesidad de mayor seguridad.",
    "La iniciación debe ser estructurada y acompañarse de seguimiento experto. La evaluación combina HbA1c con métricas de monitorización continua de glucosa y del propio sistema: tiempo en rango, tiempo por debajo y por encima del rango, variabilidad, tiempo en modo automático, bolos, autocorrecciones, dosis total diaria y salidas del sistema. La seguridad debe priorizarse: antes de intensificar los objetivos para aumentar el tiempo en rango debe corregirse cualquier exceso de hipoglucemia. La descarga debe interpretarse junto a la persona y traducirse en decisiones concretas sobre bolos omitidos o tardíos, patrón posprandial, ejercicio, alarmas, salidas del modo automático, problemas de infusión, problemas cutáneos o fatiga tecnológica.",
    "La educación terapéutica y un plan de respaldo por escrito son elementos esenciales. La persona debe saber tratar la hipoglucemia, reconocer una hiperglucemia persistente, medir la cetonemia, sospechar un fallo de infusión cuando la glucosa elevada no responde a las correcciones, administrar la corrección con pluma y cambiar el set de infusión o el pod según la pauta acordada. Las interrupciones del sistema, el ejercicio, la gestación, las enfermedades intercurrentes, los ingresos hospitalarios y los procedimientos y exploraciones diagnósticas requieren recomendaciones específicas según el sistema. Su uso seguro y eficaz requiere individualización, formación continuada, seguimiento clínico estructurado y soporte asistencial mantenido.",
  ],
};
