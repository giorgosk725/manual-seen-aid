/* Un anuncio para el lector de pantalla cuando se deja de teclear (0.72.0, WCAG 4.1.3): siempre
   montado, en una sola región, con retardo para no leer cada tecla. */
import { useEffect, useState } from "react";

export function Anuncio({ texto, retardo = 1000 }: { texto: string; retardo?: number }) {
  const [dicho, setDicho] = useState("");
  useEffect(() => {
    // 1.0.38 (Fable, 1.0.37): lo anunciado antes se retira enseguida (un error ya corregido seguía
    // en la región durante el retardo, junto a un resultado válido); lo nuevo, tras el retardo.
    setDicho((d) => (d && d !== texto ? "" : d));
    const t = window.setTimeout(() => setDicho(texto), retardo);
    return () => window.clearTimeout(t);
  }, [texto, retardo]);
  return (
    <p role="status" className="sr-only">
      {dicho}
    </p>
  );
}
