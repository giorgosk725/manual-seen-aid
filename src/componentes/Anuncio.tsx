/* Un anuncio para el lector de pantalla cuando se deja de teclear (0.72.0, WCAG 4.1.3): siempre
   montado, en una sola región, con retardo para no leer cada tecla. */
import { useEffect, useState } from "react";

export function Anuncio({ texto, retardo = 1000 }: { texto: string; retardo?: number }) {
  const [dicho, setDicho] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setDicho(texto), retardo);
    return () => window.clearTimeout(t);
  }, [texto, retardo]);
  return (
    <p role="status" className="sr-only">
      {dicho}
    </p>
  );
}
