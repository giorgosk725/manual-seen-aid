/* El índice de búsqueda (buscador.ts, con la ampliación técnica y las
   hojas para el paciente) va en su propio trozo: se pide la primera vez que alguien abre la
   paleta o escribe en la portada, y desde entonces queda en memoria. Con el service worker ya
   está en el dispositivo, así que también funciona sin conexión. Si la carga falla (red
   cortada antes de tenerlo, despliegue a medias), se puede reintentar: el fallo no se queda
   guardado. */
import { useCallback, useEffect, useState } from "react";

type Motor = typeof import("./buscador");
export type EstadoBuscador = "inactivo" | "cargando" | "listo" | "error";

let listo: Motor | null = null;
let pedido: Promise<Motor> | null = null;

export const precargarBuscador = () =>
  (pedido ??= import("./buscador")
    .then((m) => (listo = m))
    .catch((e) => {
      pedido = null; // el siguiente intento vuelve a pedirlo
      throw e;
    }));

/* Motor (cuando está cargado), estado de la carga y cómo reintentar. Con `activo` en falso no
   pide nada: la portada solo lo carga cuando se escribe o se enfoca el buscador. */
export function useBuscador(activo = true): {
  motor: Motor | null;
  estado: EstadoBuscador;
  reintentar: () => void;
} {
  const [motor, setMotor] = useState<Motor | null>(listo);
  const [fallo, setFallo] = useState(false);
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    if (motor || !activo) return;
    let vivo = true;
    setFallo(false);
    precargarBuscador().then(
      (m) => {
        if (vivo) setMotor(m);
      },
      () => {
        if (vivo) setFallo(true);
      },
    );
    return () => {
      vivo = false;
    };
  }, [motor, activo, intento]);
  const reintentar = useCallback(() => setIntento((n) => n + 1), []);
  const estado: EstadoBuscador = motor
    ? "listo"
    : fallo
      ? "error"
      : activo
        ? "cargando"
        : "inactivo";
  return { motor, estado, reintentar };
}
