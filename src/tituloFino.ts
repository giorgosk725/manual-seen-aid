/* 1.0.38 (Fable, 1.0.37): el título de la pestaña del navegador cuando la pantalla sabe más que la
   ruta (el enunciado de una pregunta frecuente, el título de una hoja, una hoja que no existe). Lo
   fija la pantalla perezosa y lo pone la Shell; así App no carga los datos de la pantalla. */
import { useEffect, useSyncExternalStore } from "react";

let actual: string | null = null;
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

export function useFijarTitulo(titulo: string | null) {
  useEffect(() => {
    actual = titulo;
    avisar();
    return () => {
      if (actual !== titulo) return;
      actual = null;
      avisar();
    };
  }, [titulo]);
}

const suscribir = (f: () => void) => {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
};
export const useTituloFino = () =>
  useSyncExternalStore(
    suscribir,
    () => actual,
    () => null,
  );
