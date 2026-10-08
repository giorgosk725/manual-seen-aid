/* Figuras 1 y 2 e infografía: en el PDF son imágenes; aquí, cada caja transcrita en texto,
   en orden de lectura. La infografía lleva las seis correcciones de la anotación 9/11.
   Las imágenes de public/figuras/ son recortes del PDF publicado en el Manual el 8-10-2026
   (vectorial, a 1440 px, por el marco de cada figura). */
import type { Figura, FiguraId } from "./tipos";

export const F1: Figura = {
  id: "F1",
  numero: 1,
  titulo:
    "Figura 1. Arquitectura clínica de un sistema automatizado de administración de insulina.",
  pagina: 2,
  cabecera: "Arquitectura clínica de un sistema automatizado de administración de insulina",
  imagen: {
    src: "figuras/figura-1.webp",
    alt: "Figura 1 del capítulo: diagrama circular con el sensor de MCG, el algoritmo de control, la bomba de insulina o pod y la plataforma de descarga, alrededor de la persona con diabetes tipo 1, y el equipo sanitario.",
    nota: "Imagen del capítulo publicado en el Manual SEEN (8-10-2026).",
  },
  cajas: [
    {
      titulo: "El circuito",
      items: [
        "1) Sensor de monitorización continua de glucosa (MCG)",
        "2) Algoritmo de control",
        "3) Bomba de insulina o pod",
        "Persona con diabetes tipo 1",
        "4) Plataforma de descarga y análisis de datos",
      ],
    },
    {
      titulo: "A",
      items: [
        "Sensor, algoritmo y bomba o pod forman un circuito de retroalimentación continua que ajusta dinámicamente la administración de insulina.",
      ],
    },
    {
      titulo: "B",
      items: [
        "La plataforma de datos permite seguimiento, interpretación, optimización y telemedicina.",
      ],
    },
    {
      titulo: "C",
      items: ["Educación, interacción de la persona y seguridad siguen siendo esenciales."],
    },
    {
      titulo: "Equipo sanitario",
      items: [
        "Seguimiento",
        "Interpretación de descargas",
        "Optimización terapéutica",
        "Telemedicina",
      ],
    },
  ],
};

export const F2: Figura = {
  id: "F2",
  numero: 2,
  titulo: "Figura 2. Elección compartida del sistema de asa cerrada.",
  pagina: 6,
  cabecera: "Elección compartida del sistema de asa cerrada",
  imagen: {
    src: "figuras/figura-2.webp",
    alt: "Figura 2 del capítulo: el perfil de la persona y las características del sistema confluyen en la decisión compartida, que lleva al sistema de asa cerrada más adecuado, con el contexto asistencial debajo.",
    nota: "Imagen del capítulo publicado en el Manual SEEN (8-10-2026).",
  },
  cajas: [
    {
      titulo: "Perfil de la persona — Factores individuales y clínicos",
      tono: "azul",
      items: [
        "**Edad y etapa vital.** Niñez, adolescencia, adultez, edad avanzada",
        "**Gestación o planificación gestacional**",
        "**Riesgo de hipoglucemia y patrón glucémico.** Hipoglucemias previas, variabilidad, objetivos",
        "**Estilo de vida y ejercicio físico.** Rutinas, horarios, intensidad",
        "**Preferencia: bomba con tubo o pod**",
        "**Capacidad de manejo tecnológico.** Alfabetización digital, conectividad",
        "**Soporte familiar o cuidador.** Disponibilidad y participación",
        "**Preferencias y expectativas.** Autonomía deseada, carga percibida",
      ],
    },
    {
      titulo: "Decisión compartida",
      items: [
        "Diálogo, información y acuerdo entre persona con diabetes y equipo sanitario",
        "Elección individualizada y adecuada al contexto",
        "**Sistema de asa cerrada** más adecuado para esa persona, en ese momento",
      ],
    },
    {
      titulo: "Características del sistema — Aspectos técnicos y funcionales",
      tono: "azul",
      items: [
        "**Indicaciones y ficha técnica.** Edad, peso, requerimientos de insulina",
        "**Sensor compatible.** Tipo de sensor y conectividad",
        "**Objetivo glucémico.** Objetivos disponibles y grado de personalización",
        "**Estrategia de automatización.** Funcionamiento del algoritmo y capacidad de corrección automática",
        "**Modos temporales.** Ejercicio, enfermedad, objetivos temporales",
        "**Requisitos de app / teléfono.** Dispositivos, conectividad, actualizaciones",
        "**Facilidad de uso.** Interfaz, curva de aprendizaje, soporte",
      ],
    },
    {
      titulo: "Contexto asistencial",
      items: ["Disponibilidad local", "Experiencia del equipo", "Soporte y educación terapéutica"],
    },
    {
      titulo: "Notas",
      items: [
        "No existe un sistema universalmente superior; la elección depende del perfil clínico, las preferencias y el contexto asistencial.",
        "La disponibilidad local, la experiencia del equipo y la calidad del soporte y de la educación terapéutica son determinantes para el éxito terapéutico.",
      ],
    },
    {
      titulo:
        "La elección debe revaluarse con el tiempo según la experiencia de uso, la evolución clínica y la disponibilidad del sistema.",
      items: ["Datos y resultados", "Cambios clínicos o personales", "Nuevas opciones disponibles"],
    },
  ],
};

export const INFO: Figura = {
  id: "INFO",
  titulo: "Infografía.",
  pagina: 24,
  cabecera:
    "Tratamiento insulínico del paciente con diabetes tipo 1: automatización de la insulinoterapia",
  imagen: {
    src: "figuras/infografia.webp",
    alt: "Infografía del capítulo en cuatro bloques: beneficios, qué es un sistema de asa cerrada, indicación e implementación y seguimiento, con el plan de seguridad y la franja «No olvides».",
    nota: "Imagen del capítulo publicado en el Manual SEEN (8-10-2026).",
  },
  cajas: [
    {
      titulo: "1. Beneficios",
      items: [
        "Gráfico: glucosa (mg/dl: 250, 180, 70, 54) a lo largo de 24 h con la franja «Tiempo en rango».",
        "↑ TIR",
        "↓ HbA1c",
        "↓ Hipoglucemias",
        "↓ Variabilidad",
        "↓ Carga mental",
        "↑ Calidad de vida",
        "↑ Sueño",
        "↓ Miedo a la hipoglucemia",
        // Corrección 9/11 (4).
        "Mejora consistente del control glucémico con buen perfil de seguridad",
      ],
    },
    {
      titulo: "2. ¿Qué es un sistema de asa cerrada?",
      items: [
        "1 Sensor MCG: mide glucosa",
        "2 Algoritmo: calcula la insulina cada pocos minutos",
        // Corrección 9/11 (5).
        "3 Bomba de insulina o pod: libera la insulina",
        "4 Plataforma de datos: descarga, análisis, seguimiento y telemedicina",
        "Descarga de datos",
        // Correcciones 9/11 (1) y (2).
        "**En modalidades híbridas:** ajusta la insulina automáticamente · Requieren anuncio de comidas y bolo prandial",
      ],
    },
    {
      titulo: "3. Indicación. ¿Para quién?",
      items: [
        // Corrección 9/11 (3).
        "**Modalidad preferente en DM1.** Capacidad de uso seguro + preferencias de la persona",
        "Decisión compartida",
        "No umbrales rígidos",
        "**Grupos prioritarios:** infancia y adolescencia · gestación / planificación · hipoglucemias graves · alta variabilidad glucémica · dificultad para alcanzar objetivos",
        "Acceso equitativo",
      ],
    },
    {
      titulo: "4. Implementación y seguimiento",
      items: [
        // Corrección 9/11 (6): «Iniciar».
        "1 Seleccionar → 2 Educar → 3 Iniciar (inicio supervisado) → 4 Analizar → 5 Optimizar",
        "Proceso iterativo y centrado en la persona",
      ],
    },
    {
      titulo: "Plan de seguridad y respaldo",
      tono: "azul",
      items: [
        "Toda persona que utiliza un sistema de asa cerrada debe disponer de un plan de respaldo individualizado y revisado en consulta.",
        "**Hiperglucemia persistente = sospecha de fallo de infusión:** confirmar glucemia capilar, medir cetonemia (β-OHB), cambiar set/pod y corregir con pluma",
      ],
    },
    {
      titulo: "No olvides…",
      items: [
        "**Tecnología adaptada a la persona:** objetivos clínicos · preferencias · contexto de vida",
        "**Evaluación integral del beneficio:** control glucémico · seguridad · calidad de vida",
        "**Transformar datos en decisiones individualizadas:** optimizar ajustes · identificar conductas · explorar barreras y emociones",
        "**Implementación estructurada:** circuitos asistenciales · educación terapéutica estructurada · apoyo continuado",
      ],
    },
  ],
};

export const FIGURAS: Partial<Record<FiguraId, Figura>> = { F1, F2, INFO };
