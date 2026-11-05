import { useEffect } from "react";
import { VERSION_APP } from "./version";

/* 1.0.20 (27.ª ronda, senior): la cabecera de cada cara y el colofón, en los márgenes de la
   página (@page), como la ficha desde la 1.0.9: no ocupan sitio en la región impresa (la Tabla 3
   y la 4 pasaban a una segunda hoja solo por el colofón). Sin cabecera, no se pone nada. */
export function useMargenesImpresos(cabecera: string | undefined) {
  useEffect(() => {
    if (!cabecera) return undefined;
    const st = document.createElement("style");
    st.dataset.cabeceraImpresa = "";
    const fuente = `8pt "Open Sans Variable", "Open Sans", sans-serif`;
    const colofon = `Manual de Endocrinología y Nutrición (SEEN) · Capítulo 89 · Complemento interactivo ${VERSION_APP} · impreso el ${new Date().toLocaleDateString("es-ES")}`;
    const arriba = `font: ${fuente}; color: #6b6b6b; vertical-align: bottom; padding-bottom: 3mm;`;
    st.textContent = `@page { @top-left { content: "${cabecera.replace(/"/g, "")}"; ${arriba} } @top-right { content: "Página " counter(page) " de " counter(pages); ${arriba} } @bottom-left { content: "${colofon}"; font: 7.5pt "Open Sans Variable", "Open Sans", sans-serif; color: #6b6b6b; vertical-align: top; padding-top: 3mm; } }`;
    document.head.append(st);
    return () => st.remove();
  }, [cabecera]);
}
