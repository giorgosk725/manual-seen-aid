import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { ErrorBoundary } from "./ui";
import App from "./App";
import { limpiarMarcaDeRecarga, recargarUnaVez } from "./recarga";
import { migrarPrivacidad } from "./edicion";
import "./index.css";

/* Si Vite no puede precargar un trozo (despliegue a medias, red cortada), recarga una vez. */
window.addEventListener("vite:preloadError", (e) => {
  if (recargarUnaVez()) e.preventDefault();
});
limpiarMarcaDeRecarga();
// Edición editorial: borra las búsquedas y criterios que guardaban versiones anteriores.
migrarPrivacidad();

/* Sin invitación a instalar: el navegador no ofrece por su cuenta «Instalar la app» (la barra o
   la ventana del móvil). La web sigue funcionando sin conexión. */
window.addEventListener("beforeinstallprompt", (e) => e.preventDefault());

/* Service worker en modo «prompt»: al detectar una versión nueva se avisa a la app (evento)
   y es el lector quien decide recargar. Comprobación cada hora y al volver a primer plano:
   el contenido es clínico y una versión vieja no debe quedarse semanas en un dispositivo. */
const UNA_HORA = 60 * 60 * 1000;
const updateSW = registerSW({
  onNeedRefresh() {
    // Se guarda también en la ventana: el aviso puede montarse después del evento.
    (window as unknown as { __mseenActualizar?: () => void }).__mseenActualizar = () =>
      updateSW(true);
    window.dispatchEvent(
      new CustomEvent("mseen:sw-need-refresh", { detail: { update: () => updateSW(true) } }),
    );
  },
  onRegisteredSW(_url, r) {
    if (!r) return;
    setInterval(() => r.update().catch(() => {}), UNA_HORA);
    let ultima = Date.now();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - ultima < 60 * 1000) return;
      ultima = Date.now();
      r.update().catch(() => {});
    });
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
