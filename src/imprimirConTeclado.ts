/* Imprimir desde el navegador (Ctrl+P o su menú) una pantalla con región imprimible: se marca
   igual que con el botón, para que salga igual (0.85.1, novena ronda, R3: la ficha de un sistema
   salía distinta con Ctrl+P que con «Imprimir la ficha»). Antes, solo en Pacientes.tsx. */
import { useEffect, type RefObject } from "react";
import { abrirPlegables } from "./imprimir";

export function useImprimirConTeclado(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const html = document.documentElement;
    let marcado = false;
    let restaurar = () => {};
    const antes = () => {
      if (html.classList.contains("imprimiendo")) return;
      // 1.0.39 (Fable, 1.0.39): solo si hay región que imprimir (la lista de Situaciones, sin una
      // abierta, no la tiene: con «imprimiendo» todo se ocultaba y salían caras en blanco). Sin
      // región, se imprime la pantalla como está.
      const r = ref.current;
      if (!r || !(r.classList.contains("imprimible") || r.querySelector(".imprimible"))) return;
      marcado = true;
      html.classList.add("imprimiendo");
      restaurar = abrirPlegables(ref.current);
    };
    const despues = () => {
      if (!marcado) return;
      marcado = false;
      html.classList.remove("imprimiendo");
      restaurar();
    };
    window.addEventListener("beforeprint", antes);
    window.addEventListener("afterprint", despues);
    return () => {
      window.removeEventListener("beforeprint", antes);
      window.removeEventListener("afterprint", despues);
      despues();
    };
  }, [ref]);
}
