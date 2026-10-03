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
      viewBox={`-4 -4 ${n + 8} ${n + 8}`}
      shapeRendering="crispEdges"
      className="qr shrink-0 rounded bg-white"
    >
      {/* Zona de silencio de 4 módulos alrededor (ISO/IEC 18004). */}
      <rect x={-4} y={-4} width={n + 8} height={n + 8} fill="#ffffff" />
      <path d={d} fill="#000000" />
    </svg>
  );
}
