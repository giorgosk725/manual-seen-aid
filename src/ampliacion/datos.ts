/* AMPLIACIÓN DEL AUTOR — FUERA DEL CAPÍTULO.
   Fichas técnicas de los cuatro sistemas, sets de infusión, compatibilidad de insulinas y
   criterios de elección, tomados del proyecto asistente-aid del mismo autor (datos validados,
   cada uno con su fuente en `fuentes.ts`). NO es texto del capítulo: la interfaz lo muestra
   siempre bajo el rótulo «Ampliación del autor» y separado del texto literal.
   Generado el 2-10-2026 desde asistente-aid (src/data); para actualizar, repetir la extracción. */
import type {
  Sistema,
  InfusionSet,
  Criterio,
  FichaGrupo,
  CompatInsulina,
  InsulinaRapida,
} from "./tipos";

export const SISTEMAS_AMPLIACION: Sistema[] = [
  {
    id: "mm780",
    name: "MiniMed 780G",
    short: "780G",
    algo: "SmartGuard · PID + predictivo + lógica difusa",
    verified: "julio de 2026",
    sources: [
      "seen_aid2026",
      "holt2026",
      "castro2026",
      "minimed_flex_ce2026",
      "sed2026",
      "panther",
      "griffin2023",
      "dimolfetta2025",
      "edd2026",
      "ficha_mm780",
      "petrovski2023",
      "instinctCE",
    ],
    tags: {
      pedsAge: "≥2 años",
      movil: "No",
      sintubo: "No",
    },
    detail: {
      formato: "Bomba con catéter; reservorio 180/300 UI; set de uso prolongado, hasta 7 días.",
      infResumen:
        "Bomba con catéter\nReservorio 180/300 UI\nSets de teflón o acero\nCambio 2–7 días según set",
      infSets:
        "Extended: teflón 90°, hasta 7 días\nMio Advance/Mio/Quick-set: teflón, cambio habitual 3 días\nMio 30/Silhouette: teflón angulado (20–45°)\nSure-T: acero, cambio habitual 2 días",
      sensores:
        "Guardian 4 y Simplera Sync (7 días, calentamiento 2 h): mejor exactitud en hipoglucemia que fuera de rango; Simplera Sync mejora la adherencia en jóvenes. Instinct (15 días, fabricado por Abbott, MARD 8,2 %): la mejor exactitud publicada para este sistema; intercambiable con Simplera Sync sin retocar parámetros.",
      algoritmoLoc: "En la bomba.",
      estrategia:
        "SmartGuard combina control PID (en la práctica PD con realimentación de insulina), modelos predictivos y lógica difusa (MD-Logic): administra microbolos cada 5 min (la basal automática parte de la insulina total diaria, que se actualiza cada medianoche a partir de la DTD de los últimos 2–6 días) y bolos de autocorrección hacia el objetivo configurable (100 / 110 / 120 mg/dl; objetivo temporal de 150 que desactiva las autocorrecciones). El objetivo y la duración de la insulina activa los fija el usuario.",
      bolosCorr:
        "Sí; hasta cada 5 min cuando la basal automática alcanza su máximo y la glucosa supera 120 mg/dl (objetivo de corrección 120).",
      objetivo: "100, 110 o 120 mg/dl.",
      indicacion: "≥2 años; DTD ≥6 UI/día; marcado CE en gestación y en diabetes tipo 2.",
      gestacionTxt: "Marcado CE; evidencia CRISTAL.",
      plataforma: "CareLink.",
      insulina:
        "Análogos rápidos U100: NovoRapid (aspart), Humalog (lispro) y Fiasp (autorizada en perfusión continua según su ficha CIMA y de uso habitual en España con el 780G; las guías del usuario en español de fuera de la UE solo citan NovoRapid y Humalog). Apidra no figura.",
      cartucho: "No; reservorio autollenable (180/300 UI).",
      bateria:
        "Pila AA recambiable (no recargable); dura ~1–2 semanas según el uso. No se enchufa: se cambia la pila; llevar siempre una de repuesto (ficha técnica del fabricante).",
      app: "App MiniMed de visualización y datos; el bolo se administra en la bomba, no desde el móvil.",
      seguidores: "Sí (CareLink Connect).",
    },
    params: [
      {
        name: "Objetivo glucémico y objetivo temporal",
        level: "directo",
        note: "Objetivo configurable: 100, 110 o 120 mg/dl (100 = el más intensivo si el TBR lo permite); un único objetivo para las 24 h (no admite tramos horarios).",
        modes: [
          {
            name: "Objetivo temporal",
            desc: "150 mg/dl; suspende las autocorrecciones mientras está activo (p. ej., ejercicio).",
          },
        ],
      },
      {
        name: "Duración de la insulina activa (2–8 h)",
        level: "directo",
        note: "Más corta intensifica las autocorrecciones; valorar 2 h si el TBR es seguro.",
      },
      {
        name: "Ratio insulina/HC",
        level: "directo",
        note: "Clave para el bolo prandial.",
      },
      {
        name: "Tasa basal programada",
        level: "manual",
        note: "No influye en SmartGuard; respaldo en modo manual.",
      },
      {
        name: "Factor de sensibilidad",
        level: "manual",
        note: "Solo correcciones en modo manual; no modifica las autocorrecciones.",
      },
    ],
    takeaway: "objetivo, duración de la insulina activa y ratio I/HC.",
  },
  {
    id: "ciq",
    name: "Tandem Control-IQ",
    short: "Control-IQ",
    algo: "Control-IQ+ · basado en predicciones (treat-to-range)",
    verified: "julio de 2026",
    sources: [
      "seen_aid2026",
      "holt2026",
      "dimolfetta2026_ciq_ejercicio",
      "sed2026",
      "panther",
      "griffin2023",
      "dimolfetta2025",
      "shah2026",
      "messer2023",
      "ficha_ciq",
      "catalogo_ciq2026",
      "man_tslim_ciq",
      "circuit",
      "iqp2",
    ],
    tags: {
      pedsAge: "≥6 años (Control-IQ) / ≥2 años (Control-IQ+)",
      movil: "No",
      sintubo: "No",
    },
    detail: {
      formato:
        "Bomba con catéter; t:slim X2 (300 UI, 112 g, con pantalla táctil). Variante compacta Mobi (200 UI, 30 g, sin pantalla: se maneja desde el móvil).",
      infResumen:
        "Bomba con catéter\nt:slim X2 hasta 300 UI\nMobi compacta 200 UI\nSets de teflón o acero\nCambio habitual 2–3 días",
      infSets:
        "Autosoft 90: teflón 90° (tubo de 12 cm solo en Mobi)\nAutosoft 30/VariSoft: teflón angulado\nTruSteel: acero 90°, cambio habitual 2 días\nKit mensual (referencia única, especificando el modelo de set): 10 sets, 10 cartuchos y 3 sensores G7 (catálogo Novalab, mayo de 2026)",
      sensores:
        "Dexcom G6 y G7 (Tabla 1 del capítulo SEEN 2026): el G7 con calentamiento de 30 min y 12 h de gracia; el G6, 2 h de calentamiento y sin periodo de gracia. En la vida real el G7 dura una mediana de 8,6 días en jóvenes. La integración de Control-IQ+ con FreeStyle Libre 3 Plus (t:slim X2, software 7.10.2; guía SED 2026), anunciada en 2026 en otros países europeos, NO está disponible en España por ahora.",
      algoritmoLoc: "En la bomba.",
      estrategia:
        "Control-IQ+, algoritmo basado en predicciones (a 30 min) de planteamiento distinto al MPC (sin optimización): cuando la predicción queda dentro de la banda objetivo (112,5–160 mg/dl) entrega la basal programada; por encima sube la basal y añade bolos de autocorrección (máx. 1/h, hacia 110 si prevé >180); por debajo la reduce, y la suspende si prevé <70. Objetivo no configurable, con modos Sueño y Ejercicio.",
      bolosCorr:
        "Sí; máx. 1/h cuando predice >180 mg/dl a 30 min y alcanza la basal máxima; administra el 60 % de la corrección hacia 110 mg/dl; no en Modo Sueño.",
      objetivo:
        "Modo estándar (diurno): 112,5–160 mg/dl (corrige hacia 110 si se prevé >180). Modo Sueño: 112,5–120 (sin bolos de corrección automáticos). Modo Ejercicio: 140–160.",
      indicacion:
        "Control-IQ: ≥6 años, 25–140 kg, 10–100 UI/día. Control-IQ+: ≥2 años, 9–200 kg, 5–200 UI/día; marcado CE en gestación (DM1) y en DM2 (adultos) desde junio de 2026.",
      gestacionTxt:
        "Control-IQ clásico: sin indicación. Control-IQ+: marcado CE en gestación (DM1) desde junio de 2026 (CIRCUIT: +12,5 puntos de tiempo en rango gestacional); objetivo no específico de gestación.",
      plataforma: "Tandem Source.",
      insulina:
        "Análogos rápidos U100: NovoRapid (aspart) y Humalog (lispro). Según la guía del usuario (Control-IQ 7.8.1, Novalab), NovoRapid es compatible hasta 72 h en el cartucho y Humalog hasta 48 h. Fiasp y Apidra no figuran; Lyumjev figura, pero no está comercializada en España.",
      cartucho: "No; cartucho autollenable (t:slim 300 UI; Mobi 200 UI).",
      bateria:
        "Batería recargable integrada (litio); se carga por cable USB. Una carga dura varios días; conviene cargarla un poco a diario (p. ej. 10–15 min). Mobi: recargable con base de carga inalámbrica (ficha técnica del fabricante).",
      app: "App Tandem t:slim. En t:slim X2 el móvil sirve para el bolo remoto (en smartphones compatibles); en Mobi, para el manejo completo (catálogo Novalab, mayo de 2026).",
      seguidores:
        "Parcial: Dexcom Follow o LibreLinkUp (solo glucosa). Tandem Source es la plataforma de descarga, no de seguidores.",
    },
    params: [
      {
        name: "Tasa basal programada",
        level: "directo",
        note: "Modula el perfil en automático; conviene ajustarla bien.",
      },
      {
        name: "Factor de sensibilidad",
        level: "directo",
        note: "Interviene en bolos correctores y autocorrecciones.",
      },
      {
        name: "Ratio insulina/HC",
        level: "directo",
        note: "Clave para el bolo prandial.",
      },
      {
        name: "Rango objetivo y modos Sueño/Ejercicio",
        level: "fijo",
        note: "Rango no editable; se interviene con basal, factor y los modos temporales.",
        modes: [
          {
            name: "Modo estándar (diurno)",
            desc: "112,5–160 mg/dl; corrige hacia 110 si prevé >180.",
          },
          {
            name: "Modo Sueño",
            desc: "112,5–120 mg/dl; sin bolos de corrección automáticos.",
          },
          {
            name: "Modo Ejercicio",
            desc: "140–160 mg/dl.",
          },
        ],
      },
      {
        name: "Duración de la insulina activa (~5 h)",
        level: "fijo",
        note: "Fija en automático; solo relevante fuera del modo automático.",
      },
    ],
    takeaway: "basal programada, factor de sensibilidad y ratio I/HC (el objetivo es fijo).",
  },
  {
    id: "camaps",
    name: "myLoop CamAPS",
    short: "CamAPS",
    algo: "MPC adaptativo (Cambridge)",
    verified: "julio de 2026",
    sources: [
      "seen_aid2026",
      "holt2026",
      "camaps_liberty_lanzamiento2026",
      "hohendorff2026",
      "sed2026",
      "panther",
      "griffin2023",
      "dimolfetta2025",
      "ficha_camaps",
      "man_camaps",
      "man_ypsopump",
      "smash",
      "closeit",
    ],
    tags: {
      pedsAge: "≥1 año",
      movil: "Sí",
      sintubo: "No",
    },
    detail: {
      formato:
        "Nombre comercial completo: myLoop powered by CamAPS. Bomba con catéter (YpsoPump, 160 UI).",
      infResumen:
        "YpsoPump con catéter\nReservorio/cartucho 160 UI\nSets de teflón o acero\nCambio habitual 2–3 días",
      infSets:
        "Orbitsoft/Inset: teflón 90°\nOrbitmicro/Orbitmicro 2.0: acero 90°\nLongitudes y tubos según set disponible",
      sensores:
        "Dexcom G7 y FreeStyle Libre 3 Plus (Tabla 1 del capítulo SEEN 2026; el G6 no figura para este sistema). El sensor se vincula solo a la app de CamAPS; no usar a la vez la app del propio sensor (interfiere en la comunicación). Con Libre 3, el valor que muestra la app y el que guarda el registro no siempre coinciden (más en hipoglucemia): la descarga y lo que el paciente vio pueden no cuadrar.",
      algoritmoLoc: "En la app del móvil.",
      estrategia:
        "Control predictivo por modelo (MPC) adaptativo del grupo de Cambridge: modula la administración cada 8–12 min según una predicción a 2,5–4 h hacia un objetivo configurable (80–198, def. 104). Aprende de forma continua de tres modos: actualiza la DTD cada 24 h, ajusta las necesidades por franja horaria y aprende del patrón posprandial. Boost intensifica la administración hacia el mismo objetivo (no lo cambia); Ease-off la reduce y sube el objetivo preestablecido en 45 mg/dl.",
      bolosCorr: "No; modula la administración continua, sin bolos de corrección diferenciados.",
      objetivo: "Por tramos 80–198 mg/dl; por defecto 104.",
      indicacion:
        "≥1 año; peso ≥10 kg; DTD 5–350 UI/día; CamAPS FX con indicación en embarazo. Liberty (primera función de asa cerrada completa comercializada; aprobación del organismo notificado en enero de 2026; Android/iOS): de uso periódico para momentos de mayor carga; al activarla prescinde del contaje y del bolo prandial con un algoritmo que se anticipa más dentro de límites de seguridad, manteniendo Boost, Ease-off, Add Meal y el bolo manual; con función Block antiactivación accidental; no estudiada en <13 años ni gestación. Liberty se comercializa en Alemania, Austria y Suiza desde el 1 de septiembre de 2026 (≥13 años, fuera del embarazo); en España, confirmar disponibilidad con Ypsomed.",
      gestacionTxt: "Indicación en gestación, con evidencia sólida (AiDAPT).",
      plataforma: "Glooko.",
      insulina:
        "Cualquier análogo rápido U100 según la guía de la YpsoPump: NovoRapid, Fiasp, Humalog y Apidra. NovoRapid y Fiasp existen en cartucho precargado PumpCart (fichas técnicas en CIMA).",
      cartucho:
        "Sí; cartucho precargado PumpCart de 1,6 ml (NovoRapid o Fiasp, 160 UI) o reservorio autollenable.",
      bateria:
        "YpsoPump: pila AAA recambiable (no recargable); dura varias semanas, llevar una de repuesto. Además, el móvil que ejecuta la app debe mantenerse cargado (el algoritmo vive en el teléfono) (ficha técnica del fabricante).",
      app: "La app CamAPS FX es el control del sistema; bolo desde el móvil.",
      seguidores: "Sí (CamAPS Companion; Glooko).",
    },
    params: [
      {
        name: "Objetivo glucémico; Boost / Ease-off",
        level: "directo",
        note: "Objetivo configurable por tramos: 80–198 mg/dl (por defecto 104; un objetivo por debajo de ~90 suele reservarse para gestación). En los primeros ~14 días conviene evitar Boost/Ease-off salvo por seguridad, mientras el algoritmo aprende.",
        modes: [
          {
            name: "Boost",
            desc: "el algoritmo asume mayores necesidades (≈+35 % de las necesidades de insulina) y entrega más insulina en respuesta a la glucosa; el objetivo no cambia. Para necesidades altas: enfermedad, hiperglucemia inusual, bolo olvidado o hidratos infraestimados. Programable hasta 24 h por adelantado y hasta 13 h de duración. Tener en cuenta la insulina ya administrada antes de añadir corrección manual.",
          },
          {
            name: "Ease-off",
            desc: "sube el objetivo preestablecido en 45 mg/dl y la sensibilidad (menos insulina) y suspende la administración por debajo de ~126 mg/dl. Para ejercicio o riesgo de hipoglucemia; iniciar 1–2 h antes y ajustar el inicio/fin a la actividad. Programable hasta 24 h por adelantado y hasta 24 h de duración.",
          },
        ],
      },
      {
        name: "Ratio insulina/HC",
        level: "directo",
        note: "Determina el bolo y contribuye a la adaptación del algoritmo.",
      },
      {
        name: "Tasa basal programada",
        level: "manual",
        note: "No interviene en automático; solo modo manual o tras salir de la automatización.",
      },
      {
        name: "Factor de sensibilidad",
        level: "manual",
        note: "Solo bolos correctores; no modifica el automático.",
      },
      {
        name: "Duración de la insulina activa",
        level: "manual",
        note: "Ajustable 2–8 h; solo en el calculador de bolos, no modifica el automático.",
      },
    ],
    takeaway: "objetivo y ratio I/HC.",
  },
  {
    id: "op5",
    name: "Omnipod 5",
    short: "Omnipod 5",
    algo: "SmartAdjust · MPC adaptativo",
    verified: "julio de 2026",
    sources: [
      "seen_aid2026",
      "holt2026",
      "dimolfetta2026_op5",
      "sed2026",
      "panther",
      "dimolfetta2025",
      "sawyer2026",
      "ficha_op5",
      "sscp_op5",
      "securet2d",
    ],
    tags: {
      pedsAge: "≥2 años",
      movil: "No",
      sintubo: "Sí",
    },
    detail: {
      formato: "Pod desechable, sin catéter (≤200 UI; 72 h continuas).",
      infResumen: "Pod sin tubo\nHasta 200 UI\nCánula integrada\nCambio cada 72 h",
      infSets:
        "Inserción automática del pod\nSin elección de catéter externo\nRotación de zonas y adhesión, claves",
      sensores:
        "Dexcom G7; FreeStyle Libre 2 Plus (Tabla 1 del capítulo SEEN 2026; el G6 no figura para este sistema).",
      algoritmoLoc:
        "En el pod; control con el controlador de Insulet (en España, sin app de móvil por ahora).",
      estrategia:
        "SmartAdjust, control predictivo por modelo (MPC) adaptativo integrado en el pod: usa la dosis total diaria (DTD; Insulet la llama insulina total diaria) para una basal adaptativa (que asume ≈50 % de la DTD y se recalcula con cada pod, ~72–80 h, con el historial de los últimos pods), ajustada cada 5 min según predicción a 60 min hacia un objetivo configurable (110–150; objetivo 100 en EE. UU., pendiente en Europa); puede aumentar la basal hasta el 400 % para corregir la hiperglucemia.",
      bolosCorr: "No; incrementa la basal adaptativa, sin bolos automáticos de corrección.",
      objetivo: "Por tramos 110–150 mg/dl (saltos de 10; hasta 8 tramos/día).",
      indicacion: "≥2 años; sin peso mínimo; ≥5 UI/día.",
      gestacionTxt: "Sin indicación en gestación.",
      plataforma: "Omnipod Discover.",
      insulina:
        "Aspart y lispro U100 (NovoRapid, Humalog). El SSCP de Omnipod 5 admite también los biosimilares Trurapi, Kirsty e insulina lispro Sanofi, no comercializados en España. Fiasp y Apidra no figuran entre las insulinas indicadas; la guía SED 2026 tampoco cita Fiasp para este sistema (solo para la YpsoPump).",
      cartucho: "No; pod autollenable (≤200 UI, 72 h).",
      bateria:
        "El pod es desechable, con batería interna no recargable que dura su vida útil (~72 h) y se desecha con el pod. El controlador de Insulet es recargable por USB (ficha técnica del fabricante).",
      app: "Controlador de Insulet (gestor dedicado); bolo desde el controlador. La app Omnipod 5 para móvil no está disponible en España (septiembre de 2026).",
      seguidores: "Sí (Omnipod VIEW).",
    },
    params: [
      {
        name: "Objetivo por tramos; Función Actividad",
        level: "directo",
        note: "Objetivo configurable por tramos: 110–150 mg/dl (saltos de 10; hasta 8 tramos/día).",
        modes: [
          {
            name: "Función Actividad",
            desc: "fija el objetivo en 150 mg/dl y reduce la administración durante 1–24 h (ejercicio).",
          },
        ],
      },
      {
        name: "Ratio insulina/HC",
        level: "directo",
        note: "Determina el bolo y contribuye a la DTD de la basal adaptativa.",
      },
      {
        name: "Tasa basal programada",
        level: "indirecto",
        note: "Solo estima la DTD inicial del primer pod; luego no afecta a SmartAdjust.",
      },
      {
        name: "Factor de sensibilidad",
        level: "indirecto",
        note: "Solo SmartBolus; puede influir vía DTD.",
      },
      {
        name: "Duración de la insulina activa (2–6 h)",
        level: "indirecto",
        note: "Solo SmartBolus; puede influir vía DTD.",
      },
    ],
    takeaway:
      "objetivo y ratio I/HC (el factor y la duración solo influyen de forma indirecta, vía DTD).",
  },
];

export const SETS_INFUSION: Record<string, InfusionSet[]> = {
  mm780: [
    {
      name: "Medtronic Extended",
      material: "Teflón",
      angle: "90°",
      cannula: [6, 9],
      tubing: [60, 80],
      insertion: "Insertador integrado desechable",
      change: 7,
    },
    {
      name: "MiniMed Mio Advance",
      material: "Teflón",
      angle: "90°",
      cannula: [6, 9],
      tubing: [60, 110],
      insertion: "Insertador integrado desechable",
      change: 3,
    },
    {
      name: "MiniMed Mio 30",
      material: "Teflón",
      angle: "30°",
      cannula: [13],
      tubing: [60, 110],
      insertion: "Insertador integrado desechable",
      change: 3,
    },
    {
      name: "MiniMed Quick-set",
      material: "Teflón",
      angle: "90°",
      cannula: [6, 9],
      tubing: [45, 60, 80, 110],
      insertion: "Insertador reutilizable",
      change: 3,
    },
    {
      name: "MiniMed Silhouette",
      material: "Teflón",
      angle: "20–45°",
      cannula: [13, 17],
      tubing: [45, 60, 80],
      insertion: "Insertador reutilizable",
      change: 3,
    },
    {
      name: "MiniMed Sure-T",
      material: "Acero",
      angle: "90°",
      cannula: [6, 8, 10],
      tubing: [45, 60, 80],
      insertion: "Inserción manual",
      change: 2,
    },
  ],
  ciq: [
    {
      name: "Autosoft 90",
      material: "Teflón",
      angle: "90°",
      cannula: [6, 9],
      tubing: [12, 60, 110],
      insertion: "Insertador integrado desechable",
      change: 3,
    },
    {
      name: "Autosoft 30",
      material: "Teflón",
      angle: "30°",
      cannula: [13],
      tubing: [60],
      insertion: "Insertador integrado desechable",
      change: 3,
    },
    {
      name: "VariSoft",
      material: "Teflón",
      angle: "20–45°",
      cannula: [13],
      tubing: [60],
      insertion: "Inserción manual",
      change: 3,
    },
    {
      name: "TruSteel",
      material: "Acero",
      angle: "90°",
      cannula: [6, 8],
      tubing: [60],
      insertion: "Inserción manual",
      change: 2,
    },
  ],
  camaps: [
    {
      name: "Mylife Ypsopump Orbitsoft",
      material: "Teflón",
      angle: "90°",
      cannula: [6, 9],
      tubing: [45, 60, 80],
      insertion: "Insertador reutilizable",
      change: 3,
    },
    {
      name: "Mylife Ypsopump Orbitmicro",
      material: "Acero",
      angle: "90°",
      cannula: [5.5, 8.5],
      tubing: [45, 60, 80],
      insertion: "Insertador reutilizable",
      change: 2,
    },
    {
      name: "Mylife Ypsopump Orbitmicro 2.0",
      material: "Acero",
      angle: "90°",
      cannula: [5.5, 8.5],
      tubing: [45, 60, 80],
      insertion: "Insertador reutilizable",
      change: 2,
    },
    {
      name: "Mylife Ypsopump Inset",
      material: "Teflón",
      angle: "90°",
      cannula: [6, 9],
      tubing: [46, 60, 80],
      insertion: "Insertador integrado desechable",
      change: 3,
    },
  ],
  op5: [],
};

export const INSULINAS_RAPIDAS: InsulinaRapida[] = [
  {
    id: "aspart",
    name: "NovoRapid (aspart)",
  },
  {
    id: "fiasp",
    name: "Fiasp (aspart)",
  },
  {
    id: "lispro",
    name: "Humalog (lispro)",
  },
  {
    id: "glulisina",
    name: "Apidra (glulisina)",
  },
];

export const COMPAT_INSULINA: Record<string, Record<string, CompatInsulina>> = {
  aspart: {
    mm780: {
      status: "ok",
    },
    ciq: {
      status: "ok",
    },
    camaps: {
      status: "ok",
    },
    op5: {
      status: "ok",
    },
  },
  lispro: {
    mm780: {
      status: "ok",
    },
    ciq: {
      status: "ok",
    },
    camaps: {
      status: "ok",
    },
    op5: {
      status: "ok",
    },
  },
  fiasp: {
    mm780: {
      status: "ok",
      note: "autorizada en perfusión continua (ficha CIMA) y de uso habitual en España con el 780G; no figura en las guías del usuario en español de fuera de la UE",
    },
    ciq: {
      status: "evitar",
      note: "no figura entre las insulinas compatibles de la guía del usuario (Control-IQ 7.8.1)",
    },
    camaps: {
      status: "ok",
      note: "disponible en cartucho PumpCart",
    },
    op5: {
      status: "evitar",
      note: "no figura entre las insulinas indicadas en el SSCP de Omnipod 5 (España)",
    },
  },
  glulisina: {
    mm780: {
      status: "verificar",
      note: "no figura en la guía del usuario; verificar",
    },
    ciq: {
      status: "evitar",
      note: "no figura entre las insulinas compatibles de la guía del usuario (Control-IQ 7.8.1)",
    },
    camaps: {
      status: "ok",
      note: "la YpsoPump admite cualquier análogo rápido U100",
    },
    op5: {
      status: "evitar",
      note: "no figura entre las insulinas indicadas en el SSCP de Omnipod 5 (España)",
    },
  },
};

export const CRITERIOS: Criterio[] = [
  {
    id: "peds",
    label: "Edad autorizada",
    info: "Edad mínima autorizada.",
    src: [],
    s: {
      mm780: {
        v: "yes",
        t: "≥2 años",
      },
      ciq: {
        v: "partial",
        t: "≥6 años\nControl-IQ+: ≥2 años",
      },
      camaps: {
        v: "yes",
        t: "≥1 año",
      },
      op5: {
        v: "yes",
        t: "≥2 años",
      },
    },
  },
  {
    id: "gest",
    label: "Gestación / planificación",
    info: "Indicación y evidencia.",
    src: ["circuit"],
    s: {
      mm780: {
        v: "yes",
        t: "CE (CRISTAL)\nObjetivo mín. 100 mg/dl",
      },
      ciq: {
        v: "yes",
        t: "Control-IQ+: CE (CIRCUIT)",
      },
      camaps: {
        v: "yes",
        t: "Indicación\nAiDAPT",
      },
      op5: {
        v: "no",
        t: "Sin indicación",
      },
    },
  },
  {
    id: "t2",
    label: "Diabetes tipo 2",
    info: "Indicación y marcado CE.",
    src: ["ce_mm780_dt2", "ce_ciq_dt2", "iqp2", "securet2d"],
    s: {
      mm780: {
        v: "yes",
        t: "Marcado CE",
      },
      ciq: {
        v: "yes",
        t: "Control-IQ+ · CE adultos (≥18)",
      },
      camaps: {
        v: "no",
        t: "Sin CE en DM2",
      },
      op5: {
        v: "partial",
        t: "FDA adultos (≥18)\nSin CE en DM2",
      },
    },
  },
  {
    id: "lowdose",
    label: "Necesidades de insulina bajas",
    info: "DTD mínima para activar el automático e incrementos finos de dosis.",
    src: [],
    s: {
      mm780: {
        v: "partial",
        t: "≥6 UI/día",
      },
      ciq: {
        v: "partial",
        t: "Control-IQ+ ≥5 UI/día",
      },
      camaps: {
        v: "yes",
        t: "Desde 5 UI/día",
      },
      op5: {
        v: "yes",
        t: "Desde 5 UI/día",
      },
    },
  },
  {
    id: "highdose",
    label: "Capacidad del reservorio",
    info: "Insulina máxima del reservorio.",
    src: [],
    s: {
      mm780: {
        v: "yes",
        t: "300 UI",
      },
      ciq: {
        v: "yes",
        t: "t:slim 300 UI\nMobi 200 UI",
      },
      camaps: {
        v: "partial",
        t: "YpsoPump 160 UI",
      },
      op5: {
        v: "partial",
        t: "Pod 200 UI",
      },
    },
  },
  {
    id: "water",
    label: "Deporte acuático / inmersión",
    info: "Resistencia al agua e inmersión del dispositivo. La clasificación IP no implica que el fabricante recomiende nadar con la bomba; la inmersión puede limitar la comunicación con el sensor.",
    src: ["seen_aid2026", "man_mm780_g4"],
    s: {
      mm780: {
        v: "no",
        t: "IPX8 (2,4 m, 30 min)\nretirar para nadar",
      },
      ciq: {
        v: "no",
        t: "t:slim X2 IP27 (0,91 m, 30 min)\nMobi IP28 (2,4 m, 2 h)\nretirar para nadar",
      },
      camaps: {
        v: "no",
        t: "YpsoPump IPX8 (1 m, 60 min)\nretirar para nadar",
      },
      op5: {
        v: "yes",
        t: "Pod IP28 (7,6 m, 60 min)\nse mantiene dentro de esos límites",
      },
    },
  },
];

export const FICHA_FILAS: FichaGrupo[] = [
  {
    g: "Indicación y objetivo",
    rows: [
      {
        k: "Edad autorizada",
        crit: "peds",
      },
      {
        k: "Diabetes tipo 2",
        crit: "t2",
      },
      {
        k: "Gestación",
        crit: "gest",
      },
      {
        k: "Objetivo en automático",
        f: "objetivo",
      },
      {
        k: "Necesidades mínimas de insulina",
        crit: "lowdose",
      },
    ],
  },
  {
    g: "Algoritmo",
    rows: [
      {
        k: "Ubicación del algoritmo",
        f: "algoritmoLoc",
      },
      {
        k: "Estrategia de automatización",
        f: "estrategia",
      },
      {
        k: "Autocorrecciones entre comidas",
        f: "bolosCorr",
      },
    ],
  },
  {
    g: "Equipo y uso",
    rows: [
      {
        k: "Formato",
        f: "formato",
      },
      {
        k: "Capacidad del reservorio",
        crit: "highdose",
      },
      {
        k: "Cartucho precargado",
        f: "cartucho",
      },
      {
        k: "Batería / carga",
        f: "bateria",
      },
      {
        k: "Resistencia al agua",
        crit: "water",
      },
      {
        k: "Sensores compatibles",
        f: "sensores",
      },
      {
        k: "Insulinas compatibles",
        f: "insulina",
      },
    ],
  },
  {
    g: "Datos y conectividad",
    rows: [
      {
        k: "App y bolo desde el móvil",
        f: "app",
      },
      {
        k: "Seguidores (monitorización remota)",
        f: "seguidores",
      },
      {
        k: "Plataforma de descarga",
        f: "plataforma",
      },
    ],
  },
];
