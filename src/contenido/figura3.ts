/* Figura 3 (p. 8), transcrita caja a caja como recorrido: sospechar → comprobar → confirmar
   glucemia capilar y medir cetonemia → cuatro tramos de β-OHB. Corrección editorial 5/11
   aplicada: cabecera de la columna amarilla sin «<0,6», «iSGLT2», acentos, «β-OHB» unificado,
   «Precisan atención urgente» en negrita y la nota del asterisco bajo la figura. */
import type { Figura3 } from "./tipos";

export const FIGURA3: Figura3 = {
  titulo:
    "Figura 3. Algoritmo de actuación ante hiperglucemia persistente, sospecha de fallo de infusión o cetosis en sistemas de asa cerrada.",
  pagina: 8,
  cabecera:
    "Algoritmo de actuación ante hiperglucemia persistente, sospecha de fallo de infusión o cetosis en sistemas de asa cerrada",
  sospechar: {
    titulo: "Sospechar fallo de infusión o cetosis ante:",
    items: [
      "Glucosa del sensor ≥250 mg/dl persistente ≥2 h.",
      "Glucosa que no desciende tras una corrección.",
      "Síntomas de hiperglucemia, enfermedad intercurrente, vómitos o incidencia del set/pod",
    ],
  },
  comprobar: {
    titulo: "Comprobar:",
    items: [
      "Zona de inserción y adhesivo.",
      "Reservorio/pod e insulina.",
      "Conexiones, si aplica.",
    ],
  },
  confirmar: "Confirmar glucemia capilar y medir cetonemia (β-OHB)",
  tramos: [
    {
      clave: "verde",
      rango: "β-OHB <0,6 mmol/l",
      titulo: "Sin cetosis significativa",
      pasos: [
        {
          icono: "pluma",
          texto:
            "**Si existe una causa clara y el sistema funciona:** corrección habitual según calculador o FSI, si procede.",
        },
        {
          icono: "ojo",
          texto:
            "**Si la hiperglucemia no responde a una corrección previa o existe sospecha de fallo de infusión:**",
          detalle: [
            "Administrar insulina rápida con **PLUMA** según plan individual.",
            "Cambiar set/pod, reservorio (si aplica) e insulina.",
          ],
        },
        { icono: "agua", texto: "Hidratación con agua." },
        { icono: "reloj", texto: "Reevaluar glucemia y β-OHB en 1-2 h." },
        {
          icono: "aviso",
          texto:
            "Si aparece cetonemia ≥0,6 mmol/l o la glucosa no desciende: seguir la rama correspondiente.",
        },
      ],
    },
    {
      clave: "amarillo",
      rango: "β-OHB 0,6-0,9 mmol/l",
      titulo: "Cetonemia leve (vigilancia estrecha)",
      pasos: [
        {
          icono: "pluma",
          texto:
            "**Si existe una causa clara y el sistema funciona:** corrección habitual según calculador o FSI, si procede.",
        },
        {
          icono: "ojo",
          texto:
            "**Si la hiperglucemia no responde a una corrección previa o existe sospecha de fallo de infusión:**",
          detalle: [
            "Administrar insulina rápida con **PLUMA** según plan individual.",
            "Cambiar set/pod, reservorio (si aplica) e insulina.",
          ],
        },
        { icono: "agua", texto: "Hidratación con agua." },
        { icono: "reloj", texto: "Reevaluar glucemia y β-OHB en 1-2 h." },
        {
          icono: "aviso",
          texto:
            "Si β-OHB aumenta a ≥1,0 mmol/l, no desciende la glucemia o aparecen síntomas: seguir recomendaciones de la rama naranja.",
        },
      ],
    },
    {
      clave: "naranja",
      rango: "β-OHB 1,0-2,9 mmol/l",
      titulo: "Cetosis significativa / probable fallo de infusión",
      pasos: [
        {
          icono: "pluma",
          texto: "Administrar insulina rápida con **PLUMA** según plan individual.",
          detalle: [
            "Si no existe plan específico: **0,1 UI/kg\\*** de insulina rápida.",
            "Si β-OHB ≥1,5 mmol/l, puede considerarse **0,15 UI/kg\\* como dosis total de rescate**, no como dosis adicional.",
          ],
        },
        {
          icono: "recambio",
          texto: "Cambiar set/pod, reservorio (si aplica), insulina y zona de inserción.",
        },
        {
          icono: "agua",
          texto: "Hidratación según glucemia:",
          detalle: [
            "Si la glucemia está elevada: líquidos sin hidratos.",
            "Si la glucemia es baja o está en descenso: aportar hidratos de carbono (líquidos azucarados) para permitir la insulinización sin inducir hipoglucemia.",
          ],
        },
        { icono: "reloj", texto: "Reevaluar glucemia y β-OHB en 1-2 h." },
        {
          icono: "pluma",
          texto:
            "Si la glucemia no desciende, la cetonemia se mantiene o aumenta, valorar una nueva dosis según el plan o protocolo, nunca antes de 2 h desde la dosis anterior.",
        },
        {
          icono: "aviso",
          texto:
            "**Si tras una segunda dosis correctamente** administrada persiste β-OHB ≥1,0 mmol/l o no hay mejoría: acudir a valoración hospitalaria, sin esperar a los signos de gravedad.",
        },
      ],
    },
    {
      clave: "rojo",
      rango: "β-OHB ≥3,0 mmol/l o signos de gravedad",
      titulo: "Posible cetoacidosis diabética",
      pasos: [
        {
          icono: "ambulancia",
          texto: "**URGENCIAS / VALORACIÓN HOSPITALARIA INMEDIATA.** No retrasar la asistencia.",
        },
        {
          icono: "pluma",
          texto: "Si no retrasa el traslado: insulina rápida con **PLUMA** según plan individual.",
          detalle: [
            "Si no existe pauta específica: **0,15 UI/kg\\*** como dosis total de rescate.",
          ],
        },
        { icono: "agua", texto: "Hidratación según glucemia, si la tolera." },
        {
          icono: "urgente",
          texto: "**Signos de gravedad:**",
          detalle: [
            "Vómitos persistentes.",
            "Dolor abdominal.",
            "Respiración rápida o profunda.",
            "Somnolencia o confusión.",
            "Deshidratación o incapacidad para beber.",
            "**Precisan atención urgente.**",
          ],
        },
      ],
    },
  ],
  pie: [
    {
      titulo: "Insulina con PLUMA:",
      texto:
        "el algoritmo **NO** la contabiliza como insulina activa, con riesgo de apilamiento e hipoglucemia. Evitar nuevas correcciones antes de 2 h, salvo pauta individualizada. Si no se puede reanudar el sistema en 1 h, pasar a pauta alternativa.",
    },
    {
      titulo: "Situaciones especiales:",
      texto:
        "en gestación, tratamiento con iSGLT2, vómitos o enfermedad intercurrente, medir cetonemia con independencia de la glucemia.",
    },
    {
      titulo: "Registrar siempre:",
      texto:
        "anotar hora, glucemia, β-OHB, dosis de insulina administrada y acciones realizadas (cambio de set/pod, hidratación, etc.).",
    },
  ],
  abreviaturas:
    "AID: administración automatizada de insulina. β-OHB: β-hidroxibutirato. DTD: dosis total diaria. FSI: factor de sensibilidad a la insulina. iSGLT2: inhibidor del cotransportador sodio-glucosa tipo 2.",
  reglaDeOro:
    "REGLA DE ORO: ante hiperglucemia persistente sin causa clara, medir cetonas y cambiar el set/pod.",
  // Corrección editorial 5/11: nota al pie de las dosis con asterisco.
  notaAsterisco:
    "*Dosis orientativas para personas adultas, basadas en las reglas de días de enfermedad; no sustituyen al plan individual acordado con el equipo. En pediatría y en gestación se seguirá el protocolo correspondiente.",
};
