/* Código QR en SVG (sin red: se genera en el navegador con qrcode-generator). */
import { useMemo } from "react";
import qrcode from "qrcode-generator";

export function QR({ texto, tam = 112, titulo }: { texto: string; tam?: number; titulo: string }) {
  const { n, d } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(texto);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x} ${y}h1v1h-1z`;
    return { n, d };
  }, [texto]);
  return (
    <svg
      role="img"
      aria-label={titulo}
      width={tam}
      height={tam}
      viewBox={`-2 -2 ${n + 4} ${n + 4}`}
      shapeRendering="crispEdges"
      className="qr shrink-0 rounded bg-white"
    >
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#ffffff" />
      <path d={d} fill="#000000" />
    </svg>
  );
}
