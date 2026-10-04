/* «Cifras del apartado»: los umbrales y tiempos que el capítulo da en cada apartado, tal cual
   los escribe, con su página. Es una lectura rápida del MISMO texto (no añade nada): cada
   ficha enlaza al apartado o subapartado donde está la frase. */

export interface Cifra {
  valor: string;
  etiqueta: string;
  p: number;
  /* Ancla del subapartado (id de h3) si procede. */
  ancla?: string;
}

export const CIFRAS: Record<string, Cifra[]> = {
  "03-algoritmos": [
    { valor: "5-15 min", etiqueta: "retraso de la glucosa intersticial tras la ingesta", p: 3 },
    { valor: "15-30 min", etiqueta: "inicio de efecto de la insulina rápida subcutánea", p: 3 },
    {
      valor: "< 13 años",
      etiqueta: "Liberty (asa cerrada completa) no recomendada; tampoco en gestación",
      p: 3,
    },
  ],
  "05-resultados": [
    {
      valor: "> 70 %",
      etiqueta: "TIR 70-180 mg/dl, objetivo general en adultos no gestantes",
      p: 4,
    },
    {
      valor: "< 4 % · < 1 %",
      etiqueta: "TBR < 70 mg/dl y < 54 mg/dl, indicador prioritario de seguridad",
      p: 4,
    },
    { valor: "< 5 %", etiqueta: "TAR de nivel 2 (> 250 mg/dl)", p: 4 },
    { valor: "≤ 36 %", etiqueta: "coeficiente de variación", p: 4 },
    {
      valor: "70-140 mg/dl",
      etiqueta: "TITR, métrica complementaria; no es objetivo primario universal",
      p: 4,
    },
  ],
  "06-indicaciones": [
    {
      valor: "HbA1c > 7 %",
      etiqueta: "necesidad clínica no cubierta (no umbral rígido de elegibilidad)",
      p: 5,
    },
    { valor: "TIR < 70 %", etiqueta: "necesidad clínica no cubierta", p: 5 },
    { valor: "TBR ≥ 4 %", etiqueta: "necesidad clínica no cubierta", p: 5 },
    { valor: "TAR > 250 ≥ 5 %", etiqueta: "necesidad clínica no cubierta", p: 5 },
  ],
  "07-educacion": [
    {
      valor: "10-15 min",
      etiqueta: "bolo prandial antes de comer (salvo hipoglucemia o descenso)",
      p: 7,
    },
    // Figura 3 (p. 8, imagen): la fidelidad se coteja con su transcripción (figura3.ts).
    {
      valor: "0,1 UI/kg*",
      etiqueta: "insulina rápida con pluma si β-OHB 1,0–2,9 mmol/l y no hay plan específico",
      p: 8,
      ancla: "b5",
    },
    {
      valor: "0,15 UI/kg*",
      etiqueta:
        "puede considerarse como dosis total de rescate (no adicional) si β-OHB ≥1,5 mmol/l; con ≥3,0, si no hay pauta específica y sin retrasar el traslado",
      p: 8,
      ancla: "b5",
    },
    {
      valor: "1-2 h",
      etiqueta: "reevaluar glucemia y β-OHB tras corregir; nueva dosis nunca antes de 2 h",
      p: 8,
      ancla: "b5",
    },
    { valor: "5-10 g", etiqueta: "hipoglucemia 54-70 mg/dl con flecha estable o ascendente", p: 8 },
    {
      valor: "~15 g",
      etiqueta: "glucemia < 54 mg/dl, doble flecha descendente o insulina activa significativa",
      p: 8,
    },
    {
      valor: "15 min",
      etiqueta: "reevaluar con glucosa capilar tras tratar la hipoglucemia",
      p: 8,
    },
    {
      valor: "~1 h",
      etiqueta: "sin administración de insulina: actuar (capilar, cetonemia, reposición)",
      p: 9,
      ancla: "interrupcion",
    },
    {
      valor: "2-3 h",
      etiqueta: "interrupción programada: valorar bolo previo que cubra la basal",
      p: 9,
      ancla: "interrupcion",
    },
    {
      valor: "40-50 % DTD",
      etiqueta: "basal de respaldo si no hay estimación fiable",
      p: 9,
      ancla: "interrupcion",
    },
    {
      valor: "~2 h antes",
      etiqueta: "adelantar la glargina programada antes de retirar el dispositivo",
      p: 9,
      ancla: "interrupcion",
    },
  ],
  "08-iniciacion": [
    { valor: "48 h", etiqueta: "MiniMed 780G: insulina en modo manual antes de SmartGuard", p: 10 },
    {
      valor: "10-20 %",
      etiqueta:
        "reducción orientativa de la DTD al pasar de MDI, con buen control previo o riesgo de hipoglucemia",
      p: 10,
    },
    { valor: "40-50 %", etiqueta: "de la DTD reducida como ritmo basal inicial (24 h)", p: 10 },
    { valor: "450 / DTD", etiqueta: "regla del 450: g de HC por unidad", p: 10 },
    {
      valor: "1700 / DTD",
      etiqueta: "regla del 1700: mg/dl por unidad (1800 si riesgo de hipoglucemia)",
      p: 10,
    },
    {
      valor: "72 h · 1 sem · 2-4 sem · 3 m",
      etiqueta: "seguimiento estrecho: remoto, remoto, presencial, visita con HbA1c",
      p: 12,
    },
    {
      valor: "3-6 meses",
      etiqueta: "visitas el primer año con buen control; después, más espaciadas",
      p: 12,
    },
  ],
  "09-descarga": [
    {
      valor: "10–20 %",
      etiqueta: "cambio orientativo de basal, ratio I/HC o factor de sensibilidad",
      p: 13,
    },
    { valor: "≥ 70 % en 14 días", etiqueta: "uso de MCG que permite interpretar patrones", p: 13 },
    {
      valor: "≥ 250 mg/dl ≥ 2 h",
      etiqueta: "bandera roja: hiperglucemia persistente o sospecha de fallo de infusión",
      p: 15,
      ancla: "incidencias",
    },
    {
      valor: "200 mg/dl",
      etiqueta: "umbral rebajado en personas tratadas con iSGLT2",
      p: 15,
      ancla: "incidencias",
    },
    {
      valor: "<0,6 · 0,6–0,9 · 1,0–2,9 · ≥3,0",
      etiqueta: "β-OHB (mmol/l): los cuatro tramos operativos",
      p: 15,
      ancla: "incidencias",
    },
    {
      valor: "60–90 min / 3–5 h",
      etiqueta: "hiperglucemia posprandial precoz / tardía (grasa y proteína)",
      p: 14,
      ancla: "patrones",
    },
  ],
  "10-situaciones": [
    {
      valor: "< 6,5 % · < 6,0 %",
      etiqueta: "HbA1c preconcepcional · ideal en gestación (hasta < 7,0 % si hipoglucemia)",
      p: 17,
      ancla: "gestacion",
    },
    {
      valor: "> 70 %",
      etiqueta: "TIRp 63–140 mg/dl; TBRp < 63 < 4 %, < 54 < 1 %; TARp > 140 < 25 %",
      p: 17,
      ancla: "gestacion",
    },
    {
      valor: "30–45 min",
      etiqueta: "anticipación del bolo en fases avanzadas de la gestación",
      p: 17,
      ancla: "gestacion",
    },
    {
      valor: "~100 → 80–90 mg/dl",
      etiqueta: "CamAPS FX: objetivo por trimestre (≈81 de noche si el TBR lo permite)",
      p: 17,
      ancla: "gestacion",
    },
    {
      valor: "12-24 h",
      etiqueta: "hipoglucemia diferida tras alcohol (adolescencia)",
      p: 18,
      ancla: "adolescencia",
    },
    {
      valor: "< 1 %",
      etiqueta: "tiempo < 70 mg/dl como objetivo primario en fragilidad",
      p: 19,
      ancla: "mayores",
    },
    {
      valor: "126–180 mg/dl",
      etiqueta: "glucemia recomendada para iniciar el ejercicio",
      p: 19,
      ancla: "ejercicio",
    },
    {
      valor: "< 90 · > 270",
      etiqueta: "ejercicio: hidratos y retrasar · medir cetonemia y descartar fallo",
      p: 19,
      ancla: "ejercicio",
    },
    {
      valor: "≥ 1,5 mmol/l",
      etiqueta: "evitar el ejercicio con esta cetonemia, sea cual sea la glucemia",
      p: 19,
      ancla: "ejercicio",
    },
    {
      valor: "25-33 %",
      etiqueta: "reducción del bolo si el ejercicio sigue a una comida (≤ 2 h)",
      p: 19,
      ancla: "ejercicio",
    },
    {
      valor: "10-20 g",
      etiqueta: "hidratos rápidos durante la actividad si la glucosa baja de ~126",
      p: 19,
      ancla: "ejercicio",
    },
    {
      valor: "> 60 % · 0 %",
      etiqueta: "hospital: TIR 70–180 · TBR < 70; TAR > 180 < 25 %, > 250 < 5 %, 70–100 < 15 %",
      p: 20,
      ancla: "ingreso",
    },
    {
      valor: "50 % · 50 %",
      etiqueta: "hospital: basal y prandial de partida si no hay perfil basal detallado",
      p: 20,
      ancla: "ingreso",
    },
    {
      valor: "~2 h antes",
      etiqueta: "basal subcutánea antes de suspender la bomba en el hospital",
      p: 20,
      ancla: "ingreso",
    },
    {
      valor: "~22 h",
      etiqueta: "reanudar el sistema tras la última dosis de una basal de ~24 h",
      p: 21,
      ancla: "ingreso",
    },
    {
      valor: "primeras 24 h",
      etiqueta: "tras la inserción de un nuevo sensor: confirmar con glucemia capilar",
      p: 21,
      ancla: "ingreso",
    },
    {
      valor: "~1 h",
      etiqueta: "lecturas del sensor alteradas tras una RM, hasta normalizarse",
      p: 21,
      ancla: "exploraciones",
    },
    {
      valor: "60 min",
      etiqueta: "sistema y perfusión intravenosa en paralelo antes de retirar la perfusión",
      p: 22,
      ancla: "exploraciones",
    },
  ],
};
