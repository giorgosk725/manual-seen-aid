/* El índice de búsqueda (buscador.ts, con la versión extendida y la ampliación del autor) va
   en su propio trozo: se pide la primera vez que alguien abre la paleta o escribe en la
   portada, y desde entonces queda en memoria. Con el service worker ya está en el
   dispositivo, así que también funciona sin conexión. */
import { useEffect, useState } from "react";

type Motor = typeof import("./buscador");

let listo: Motor | null = null;
let pedido: Promise<Motor> | null = null;

export const precargarBuscador = () => (pedido ??= import("./buscador").then((m) => (listo = m)));

/* Devuelve el motor cuando está cargado (null mientras tanto). Con `activo` en falso no pide
   nada: la portada solo lo carga cuando se escribe. */
export function useBuscador(activo = true): Motor | null {
  const [motor, setMotor] = useState<Motor | null>(listo);
  useEffect(() => {
    if (motor || !activo) return;
    let vivo = true;
    precargarBuscador().then((m) => {
      if (vivo) setMotor(m);
    });
    return () => {
      vivo = false;
    };
  }, [motor, activo]);
  return motor;
}
