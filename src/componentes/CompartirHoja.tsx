/* «Compartir el enlace» y «Mostrar el QR» de una hoja imprimible (hojas para el paciente y hoja
   de comprobación de «Iniciar un sistema»). El enlace es siempre la dirección pública. */
import { useState } from "react";
import { Link2, QrCode } from "lucide-react";
import { direccion } from "../compartir";
import { Modal } from "../ui";
import { QR } from "./QR";

const BOTON =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500";

export function CompartirHoja({ ruta, titulo }: { ruta: string; titulo: string }) {
  const [aviso, setAviso] = useState("");
  const [verQR, setVerQR] = useState(false);
  const url = direccion(ruta);
  const compartir = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setAviso("Enlace copiado.");
    } catch (e) {
      // Cerrar la hoja de compartir no es un fallo; si no se pudo copiar, se muestra el enlace.
      if (e instanceof DOMException && e.name === "AbortError") return;
      setAviso(`Copia este enlace: ${url}`);
    }
  };
  return (
    <>
      <button type="button" onClick={compartir} className={BOTON}>
        <Link2 size={15} aria-hidden="true" /> Compartir el enlace
      </button>
      <button type="button" onClick={() => setVerQR(true)} className={BOTON}>
        <QrCode size={15} aria-hidden="true" /> Mostrar el QR
      </button>
      <Modal open={verQR} onClose={() => setVerQR(false)} ariaLabel={`Código QR: ${titulo}`}>
        <div className="flex flex-col items-center gap-3 p-5 text-center">
          <QR texto={url} tam={260} titulo={`Código QR para abrir esta hoja: ${url}`} />
          <p className="text-sm font-semibold text-slate-900">{titulo}</p>
          <p className="break-all text-xs text-slate-600">{url}</p>
          <button
            type="button"
            onClick={() => setVerQR(false)}
            className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:border-slate-500"
          >
            Cerrar
          </button>
        </div>
      </Modal>
      {aviso && (
        <span role="status" className="break-all text-xs text-slate-600">
          {aviso}
        </span>
      )}
    </>
  );
}
