/* Bancos de preguntas de «Preguntas al capítulo» (respuestas.ts) y cómo se miden. Los usan
   respuestas.test.ts (umbrales) y scripts de medición. Cada banco es [pregunta, lo que debe
   contener la primera respuesta] (null = el capítulo no lo trata: «no consta»). */
import { responder, type Respuesta } from "./respuestas";
import { normalizar } from "./busqueda";

export const BANCO: [string, RegExp][] = [
  // Hiperglucemia, cetonemia y Figura 3 (pp. 8 y 15)
  ["glucosa alta dos horas qué hago", /F3\/inicio|≥ ?250 mg\/dl persistente/],
  [
    "hiperglucemia que no baja tras corregir",
    /F3\/inicio|no responde a la corrección|no desciende tras una corrección/,
  ],
  ["cetonas 1,2", /F3\/naranja/],
  ["cetonemia 0,7 qué hago", /F3\/amarillo/],
  ["beta hidroxibutirato 3,5", /F3\/rojo/],
  ["cetonas 0,4 con glucosa alta", /F3\/verde/],
  ["cuándo ir a urgencias por cetonas", /F3\/rojo|valoración hospitalaria/],
  ["segunda dosis con pluma cuándo", /nunca antes de 2 h/],
  ["dosis de insulina con pluma si no hay plan", /0,1 UI\/kg/],
  ["qué beber con cetonas y glucosa baja", /líquidos azucarados/],
  ["la insulina de la pluma la cuenta el sistema como activa", /no contabiliza|NO la contabiliza/],
  [
    "umbral de glucosa para sospechar fallo con iSGLT2",
    /alta sospecha de cetoacidosis|con independencia del nivel de glucemia/,
  ],
  ["signos de cetoacidosis", /F3\/rojo|vómitos persistentes/],
  ["regla de oro", /REGLA DE ORO/],
  ["ante la duda cambia el set", /cambia el set/],
  // Hipoglucemia
  ["hipoglucemia leve cuántos hidratos", /5-10 g/],
  ["hipoglucemia menor de 54 cuántos hidratos", /15 g/],
  ["se anuncian los hidratos de la hipoglucemia", /no deben anunciarse como comida/],
  ["tratamiento de hipoglucemia en CamAPS", /tratamiento de hipoglucemia/],
  ["hipoglucemia nocturna qué revisar", /Hipoglucemia nocturna/],
  ["lectura falsamente baja al dormir sobre el sensor", /compresión/],
  // Ejercicio (p. 19 y Tabla 4)
  ["modo ejercicio control iq", /T4\/0.*(Modo ejercicio|140–160)/],
  ["ejercicio con omnipod 5", /T4\/0.*Actividad/],
  ["ejercicio con 780G", /T4\/0.*Objetivo temporal 150/],
  ["ease-off", /Ease-off/],
  ["con qué glucosa empezar el ejercicio", /126–180 mg\/dl/],
  ["ejercicio con glucosa 80", /<90 mg\/dl|retrasar el inicio/],
  ["cuántos hidratos durante el ejercicio", /10-20 g/],
  ["ejercicio con cetonas", /1,5 mmol\/l|≥1,0 mmol\/l en contexto/],
  ["ejercicio anaeróbico o de pesas", /T4\/1|anaeróbico/],
  ["hipoglucemia por la noche después del ejercicio", /hipoglucemia diferida/],
  ["nadar con la bomba", /acuátic|inmersión/],
  ["reducir el bolo antes del ejercicio", /25-33 %/],
  // Interrupción y pauta alternativa (p. 9)
  [
    "cuánto tiempo puedo estar desconectado",
    /1 h sin administración|superiores a 1 h|más de aproximadamente 1 h/,
  ],
  ["desconectar la bomba para el baño", /baño|muy breves/],
  [
    "pauta alternativa con plumas si falla el sistema",
    /múltiples dosis con pluma|pauta de respaldo/,
  ],
  ["dosis de la basal de respaldo", /40-50 %/],
  ["glargina antes de retirar la bomba", /dos horas antes de la retirada|2 h antes de suspender/],
  ["cuándo reanudar el sistema después de la glargina", /22 h|efecto residual/],
  ["se despega el pod", /se despega|pod no se desconecta/],
  // Hospital, cirugía y exploraciones (pp. 20-22, Tabla 6)
  ["resonancia magnética con bomba", /T6\/0/],
  ["TAC con el sensor", /T6\/1/],
  ["radiografía con la bomba", /T6\/2/],
  ["cirugía corta con AID", /T6\/6/],
  ["cirugía larga", /T6\/7/],
  [
    "se puede mantener el sistema en el ingreso hospitalario",
    /pueden mantenerse cuando la persona puede utilizarlos/,
  ],
  ["objetivos de MCG en el hospital", /TIR 70–180 mg\/dl >60 %/],
  ["cuándo no se puede mantener el AID en el hospital", /no es apropiada/],
  ["la MCG y la capilar no coinciden", /valor más bajo/],
  ["pasar de perfusión intravenosa al sistema", /60 min/],
  ["pauta de respaldo con Omnipod 5 en el hospital", /50 % basal y 50 % prandial/],
  ["PET con el sensor", /T6\/3|PET/],
  ["control del aeropuerto con la bomba", /aeroportuarios/],
  ["diatermia", /T6\/4|diatermia/],
  // Gestación (pp. 17-18)
  ["objetivo de TIR en el embarazo", /TIRp 63–140/],
  [
    "qué sistemas están autorizados en el embarazo",
    /T1\/8|marcado CE para su uso durante la gestación/,
  ],
  ["objetivo de CamAPS en el embarazo", /100 mg\/dl en el primer trimestre|80–90 mg\/dl/],
  ["780G en el embarazo", /objetivo mínimo configurable, de 100 mg\/dl|T1\/8/],
  ["Omnipod 5 en el embarazo", /Omnipod 5 no dispone|T1\/8/],
  ["HbA1c en el embarazo", /<6,0 %|<6,5 %/],
  ["el sistema durante el parto", /parto/],
  // Parámetros y sistemas (Tablas 1-3)
  ["ratio insulina hidratos en CamAPS", /T3\/2/],
  ["factor de sensibilidad en Control-IQ", /T3\/3/],
  ["duración de la insulina activa en 780G", /T3\/4/],
  ["qué parámetros cuentan en automático en Omnipod", /T1\/10/],
  ["objetivo en modo automático del 780G", /T1\/6/],
  ["dónde está el algoritmo de CamAPS", /T1\/2/],
  ["sensores compatibles con Omnipod 5", /T1\/1/],
  ["plataforma de descarga de Tandem", /T1\/9/],
  ["a partir de qué edad Liberty", /13 años/],
  ["qué es Liberty", /asa cerrada completa/],
  ["reducción de la dosis al pasar de MDI a bomba", /T2\/2/],
  ["basal plana inicial", /40-50 % de la DTD/],
  ["regla del 450", /450/],
  ["cuándo revisar después de iniciar el sistema", /72 h|2-4 semanas/],
  ["cuánto modificar la basal o la ratio", /10–20 %/],
  ["demasiadas autocorrecciones", /autocorrecciones/],
  ["salidas del modo automático", /[Ss]alidas/],
  ["bolo olvidado", /omitidos? o retrasados?|omite o retrasa/],
  ["hidratos fantasma", /fantasma/],
  // Definiciones (glosario)
  ["qué es el TBR", /sigla\/TBR/],
  ["qué significa GMI", /sigla\/GMI/],
  ["qué es el TITR", /sigla\/TITR|tiempo en rango estrecho/],
  ["objetivo de TIR", /> 70 %/],
  ["objetivo del coeficiente de variación", /≤ ?36 %/],
  // Otras situaciones
  ["corticoides", /[Gg]lucocorticoides/],
  ["diálisis", /diálisis/i],
  ["alcohol", /alcohol/],
  ["enfermedad con vómitos y glucosa normal", /no debe suspenderse/],
  ["objetivos en personas mayores frágiles", /fragilidad/],
  ["adolescente que se salta los bolos", /omisión (o retraso )?de bolos/],
  ["diabulimia", /diabulimia/],
  ["AID en diabetes tipo 2", /diabetes tipo 2/],
  ["lipohipertrofia", /lipohipertrofia/],
  ["fatiga por alarmas", /[Ff]atiga por alarmas/],
  ["seguridad digital", /credenciales/],
  ["qué incluye el plan de seguridad", /plan de seguridad debe entregarse|Pauta de respaldo/],
  ["cánulas metálicas", /cánulas metálicas/],
  ["comida rica en grasa", /T4\/5|grasa/],
];

/* Lo que el capítulo no trata: mejor «no consta» que una respuesta forzada. */
export const NO_CONSTA = [
  "precio del omnipod",
  "receta de cocina",
  "seguro médico privado",
  "cuánto cuesta la bomba",
];

/* Banco de control: preguntas escritas DESPUÉS de ajustar el motor con el banco de arriba y
   no usadas para ajustarlo. Mide lo que cabe esperar con preguntas nuevas. */
export const CONTROL: [string, RegExp | null][] = [
  ["qué hago si tengo cetonas de 2", /F3\/naranja/],
  ["glucosa 300 desde hace tres horas", /F3\/inicio|≥ ?250 mg\/dl persistente/],
  ["cuánto bajo la dosis total al empezar con la bomba", /T2\/2/],
  ["duración de la insulina activa en omnipod", /T3\/4/],
  ["puedo ir a la piscina con el omnipod", /acuátic|inmersión/],
  ["objetivo glucémico de control iq", /T1\/6/],
  ["boost en camaps", /Boost/],
  ["qué es el GMI", /GMI|gestión de la glucosa/],
  ["qué significa TAR", /sigla\/TAR/],
  ["corrección con pluma según el peso", /peso corporal|0,1 UI\/kg/],
  ["hipoglucemia grave prioridad", /hipoglucemia grave/],
  ["requisitos para empezar con un sistema", /requisitos previos/i],
  ["cuándo retirar el sistema por mal uso", /reconsideración|uso no seguro|uso insuficiente/],
  ["el sensor da lecturas raras tras la resonancia", /alterarse transitoriamente|1 h/],
  ["embarazo con control iq modo sueño", /modo sueño/],
  ["después del parto qué hacer con el objetivo", /parto/],
  ["alcohol e hipoglucemia diferida", /12-24 h|alcohol/],
  ["los padres siguen los datos del adolescente", /seguimiento remoto compartido/],
  ["transición de pediatría a adultos", /traspaso|transición de pediatría/],
  ["anciano con demencia", /demencia/],
  ["glucocorticoides a dosis altas", /dosis altas/],
  ["hemodiálisis e hipoglucemia", /hemodiálisis/],
  ["hiperglucemia por la mañana", /matutina/],
  ["subida de glucosa después de comer", /posprandial/],
  ["pizza y bolo", /grasa/],
  ["lectura baja falsa", /compresión|falsamente baja/],
  ["irritación de la piel por el sensor", /irritación|cutáneos/],
  ["la bomba pierde la señal", /señal/],
  ["qué contenidos debe tener la educación", /contenidos mínimos/i],
  ["cuántas fases tiene el PEET", /cuatro fases/],
  ["telemedicina", /telemedicina/],
  ["qué algoritmo usa el 780g", /T1\/[234]/],
  ["dieta cetogénica", null],
  ["vacaciones de verano", null],
];

/* Tercer banco, escrito con el motor ya cerrado y pasado UNA vez (4-10-2026) para medir sin
   ajustar: es la cifra honesta de lo que cabe esperar. No se ajusta el motor a él; si se
   amplía el léxico, se escribe un banco nuevo. */
export const CIEGO: [string, RegExp | null][] = [
  [
    "qué hago si la glucosa no baja con el bolo",
    /F3\/inicio|no responde a la corrección|desciende/,
  ],
  ["cetonas 0,8", /F3\/amarillo/],
  ["cetonemia de 3,2 con vómitos", /F3\/rojo/],
  ["hipoglucemia leve con camaps", /5-10 g|tratamiento de hipoglucemia/],
  ["cuánto azúcar tomo si tengo una hipo", /5-10 g|15 g/],
  ["control iq en el embarazo", /Control-IQ\+|T1\/8|CIRCUIT/],
  ["objetivo nocturno de camaps en el embarazo", /81 mg\/dl|noche/],
  ["deporte de contacto con la bomba", /deportes de contacto/],
  ["modo actividad del omnipod", /Actividad/i],
  ["objetivo temporal de medtronic para el ejercicio", /[Oo]bjetivo temporal/],
  ["qué hago con la bomba en un TAC", /T6\/1/],
  ["ecografía con el sensor", /T6\/5/],
  ["en ayunas en el hospital", /ayunas/],
  ["basal antes de quitar la bomba en el hospital", /2 h antes de suspender/],
  ["cuántas horas después de la glargina vuelvo al sistema", /22 h|efecto residual/],
  ["fibrosis quística", /fibrosis quística/],
  ["a quién priorizar si hay pocos sistemas", /prioriza|prioridad/],
  ["decisión compartida", /decisión compartida/i],
  ["cada cuánto ver al paciente con buen control", /3-6 meses/],
  ["objetivo glucémico del omnipod", /T1\/6/],
  ["bolo extendido en control iq", /bolo extendido/],
  ["fenómeno del alba", /alba/],
  ["ratio en 780G", /T3\/2/],
  ["qué hace la bomba en modo manual", /modo manual/],
  ["qué insulina usa la bomba", /análogos de insulina rápida|ultrarrápida/],
  ["por qué no usar hidratos fantasma", /fantasma/],
  ["apoyo psicológico", /apoyo psicológico/],
  ["ansiedad por la hiperglucemia", /persecución|ansiedad/],
  ["suenan demasiadas alarmas", /[Ff]atiga por alarmas|alarmas/],
  ["aplicación del móvil de camaps", /teléfono compatible|aplicación/],
  ["cómo se llama el algoritmo de omnipod", /SmartAdjust|T1\/[234]/],
  ["precio de la insulina", null],
];

/* Cuarto banco (4-10-2026): escrito después de cerrar el motor y pasado una sola vez. Es la
   cifra que se comunica como acierto esperable con preguntas nuevas. */
export const FINAL: [string, RegExp | null][] = [
  ["me pica la zona del sensor", /irritación|cutáneos|dermatitis/],
  ["cuerpos cetónicos en el embarazo", /cetoacidosis|cetonemia/],
  ["usar iSGLT2 con un sistema AID", /iSGLT2/],
  ["viaje en avión con la bomba", /aeroportuarios|viaje/],
  ["bolo antes de comer cuánto tiempo", /10-15 min/],
  ["glucosa de 45", /54|15 g/],
  ["qué es la HbA1c", /HbA1c/],
  ["autocorrecciones del MiniMed", /T1\/5|autocorrecciones/],
  ["cuándo usar Boost en CamAPS", /Boost/],
  ["Tandem t:slim y Mobi", /Mobi/],
  ["sistema en niños pequeños", /pediátric|niños/],
  ["plan de respaldo antes de empezar", /T2\/0|respaldo/],
  ["hiperglucemia tras el desayuno", /posprandial/],
  ["cuándo pedir la HbA1c", /3 meses|HbA1c/],
  ["fallo del sensor", /sensor/],
  ["parto y posparto", /parto/],
  ["objetivo de TBR en mayores frágiles", /<1%|fragilidad/],
  ["Dexcom con Omnipod", /T1\/1|Dexcom/],
  ["cuánto cuesta un sensor", null],
  ["qué hago si me olvido el bolo de la comida", /omitido o retrasado|omite o retrasa/],
];

/* Quinto banco: medido a ciegas una vez con el motor de la 0.8.0 (50 % a la primera). */
export const QUINTO: [string, RegExp | null][] = [
  ["glucosa 320 y cetonas 0,3", /F3\/verde/],
  ["qué hago si tengo cetonas y vómitos", /F3\/rojo|vómitos/],
  ["cuánto dura el modo ejercicio", /T4\/0|duración/],
  ["nadar con control iq", /acuátic|inmersión/],
  ["insulina en el hospital si quito el omnipod", /50 % basal|perfil basal detallado/],
  ["rayos X con el pod", /T6\/2/],
  ["cuándo ver de nuevo tras iniciar el sistema", /72 h|2-4 semanas/],
  ["HbA1c objetivo antes del embarazo", /6,5 %/],
  ["modo sueño de tandem", /[Mm]odo sueño|T4\/2/],
  ["factor de sensibilidad en omnipod", /T3\/3/],
  ["ratio en camaps durante el embarazo", /ratio/],
  ["personas mayores con demencia", /demencia/],
  ["alarmas que no sirven para nada", /alarmas/],
  ["pasar a plumas definitivamente", /múltiples dosis con pluma|pauta alternativa|transición/],
  ["cuánto cuesta la tira de cetonas", null],
  ["el sensor marca bajo pero me encuentro bien", /compresión|falsamente baja|capilar/],
];

/* Todo lo que enseña una respuesta (para comprobar lo que contiene). */
export const etiqueta = (r: Respuesta) =>
  [
    r.id,
    r.titulo,
    r.contexto ?? "",
    r.texto,
    r.sistema ?? "",
    ...(r.items ?? []),
    ...(r.partes ?? []).map((p) => p.texto),
    ...(r.porSistema ?? []).map((s) => s.texto),
  ].join(" · ");

/* Bancos ciegos escritos por otro agente sin ver el motor (src/bancos/ciegoN.json): cada
   pregunta lleva fragmentos LITERALES del capítulo que tendría una respuesta correcta («aceptables»;
   vacío = el capítulo no lo trata). Se miden con medirCiego. */
export interface PreguntaCiega {
  q: string;
  perfil: string;
  aceptables: string[];
}
const limpio = (s: string) => normalizar(s).replace(/[·:]/g, " ").replace(/\s+/g, " ").trim();
export function medirCiego(banco: PreguntaCiega[]) {
  let primera = 0;
  let entreTres = 0;
  let equivocadas = 0;
  for (const p of banco) {
    const rs = responder(p.q);
    const ok = (r: Respuesta) => p.aceptables.some((a) => limpio(etiqueta(r)).includes(limpio(a)));
    const directa = rs.some((r) => !r.aproximada);
    const ok1 = p.aceptables.length ? !!rs[0] && ok(rs[0]) : !directa;
    if (ok1) primera++;
    if (p.aceptables.length ? rs.some(ok) : !directa) entreTres++;
    if (p.aceptables.length && rs[0] && !rs[0].aproximada && !ok1) equivocadas++;
  }
  return {
    n: banco.length,
    primera: primera / banco.length,
    entreTres: entreTres / banco.length,
    equivocadas: equivocadas / banco.length,
  };
}

/* Acierto de la primera respuesta y de las tres que se enseñan, con los fallos. */
export function medir(banco: [string, RegExp | null][]) {
  let primera = 0;
  let entreTres = 0;
  const fallos: string[] = [];
  for (const [q, espera] of banco) {
    const rs = responder(q);
    const directa = rs.some((r) => !r.aproximada);
    const ok1 = espera === null ? !directa : !!rs[0] && espera.test(etiqueta(rs[0]));
    const ok3 = espera === null ? !directa : rs.some((r) => espera.test(etiqueta(r)));
    if (ok1) primera++;
    if (ok3) entreTres++;
    if (!ok1)
      fallos.push(
        `«${q}» → ${rs[0] ? `${rs[0].id} · ${rs[0].titulo.slice(0, 60)}` : "(no consta)"}${ok3 ? " (buena entre las tres)" : ""}`,
      );
  }
  return {
    n: banco.length,
    primera: primera / banco.length,
    entreTres: entreTres / banco.length,
    fallos,
  };
}
