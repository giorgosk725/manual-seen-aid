/* El último sistema consultado en esta visita (0.78.1, auditoría del adjunto): una situación que se
   abre sin sistema en la ruta empieza por él, no por MiniMed 780G. Solo en memoria: la edición
   editorial no guarda visitas (src/edicion.ts). */
let ultimo: number | undefined;

export const recordarSistema = (c: number) => {
  if (c >= 0 && c <= 3) ultimo = c;
};

export const sistemaReciente = () => ultimo;

/* 1.0.12 (24.ª ronda, senior): «Los cuatro» en una situación: sin sistema preelegido. */
export const olvidarSistema = () => {
  ultimo = undefined;
};
