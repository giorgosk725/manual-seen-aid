import React from "react";
import { VERSION_APP } from "./version";
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
/* Tras «Actualizar» (V54-13): se apunta desde qué versión se actualizó; al volver a cargar se
   confirma la versión que ha quedado y se vuelve a comprobar en seguida, por si la que estaba
   en espera también se había quedado antigua (entonces se ofrece otra vez). */
const DESDE = "mseen:actualizado-desde";
const sesion = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};
const actualizar = () => {
  try {
    sesion()?.setItem(DESDE, VERSION_APP);
  } catch {
    /* sin almacenamiento de sesión: se actualiza igual, sin confirmación */
  }
  return updateSW(true);
};
const updateSW = registerSW({
  onNeedRefresh() {
    // Se guarda también en la ventana: el aviso puede montarse después del evento.
    (window as unknown as { __mseenActualizar?: () => void }).__mseenActualizar = actualizar;
    window.dispatchEvent(
      new CustomEvent("mseen:sw-need-refresh", { detail: { update: actualizar } }),
    );
  },
  onRegisteredSW(_url, r) {
    if (!r) return;
    let desde: string | null = null;
    try {
      desde = sesion()?.getItem(DESDE) ?? null;
      sesion()?.removeItem(DESDE);
    } catch {
      /* nada que confirmar */
    }
    if (desde) {
      (window as unknown as { __mseenActualizado?: string }).__mseenActualizado = desde;
      window.dispatchEvent(new CustomEvent("mseen:sw-actualizado", { detail: { desde } }));
      r.update().catch(() => {});
    }
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
