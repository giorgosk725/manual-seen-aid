/* Los casos guiados en el índice de búsqueda: título, tema, sistema y las palabras con las que
   se pide un caso («ejemplo», «practicar»…). A mano y pequeño: así el índice no carga los
   casos enteros. casos.test.tsx comprueba que cada caso de src/casos tiene su entrada. */
export const CASOS_INDICE: { id: string; titulo: string; texto: string; pagina: number }[] = [
  {
    id: "ejemplo-descarga",
    titulo: "Ejemplo comentado · Una descarga de 14 días",
    texto:
      "Ejemplo comentado de una descarga de 14 días con MiniMed 780G: revisar la descarga paso a paso con la Tabla 5 (uso del sensor, TBR, TIR, GMI, bolos, patrones, posprandial, autocorrecciones, DTD, pauta de respaldo, hiperglucemia persistente). Caso, ejemplo, practicar, interpretar el informe, análisis estructurado.",
    pagina: 13,
  },
  {
    id: "hiperglucemia-pod",
    titulo: "Caso guiado · Hiperglucemia que no baja",
    texto:
      "Caso guiado con Omnipod 5: hiperglucemia persistente que no baja tras una corrección, cetonemia, β-OHB, fallo de infusión, cambio de pod, insulina con pluma, Figura 3. Caso, ejemplo, practicar.",
    pagina: 8,
  },
  {
    id: "ejercicio-ciq",
    titulo: "Caso guiado · Salir a correr",
    texto:
      "Caso guiado con Tandem Control-IQ: ejercicio aeróbico planificado, modo ejercicio, hidratos antes y durante, hipoglucemia diferida, cetonemia antes de correr, Tabla 4. Caso, ejemplo, practicar, deporte.",
    pagina: 19,
  },
  {
    id: "cirugia-780g",
    titulo: "Caso guiado · Ingreso para una cirugía larga",
    texto:
      "Caso guiado con MiniMed 780G: ingreso hospitalario, cirugía prolongada, insulina intravenosa, vuelta al sistema, discrepancia sensor y capilar, pauta alternativa, basal antes de suspender la bomba, Tabla 6. Caso, ejemplo, practicar, quirófano.",
    pagina: 20,
  },
];
