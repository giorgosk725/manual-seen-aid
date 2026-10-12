/* Identificación de esta versión (A10): la versión del complemento, el código del que sale y
   cuándo se construyó, y la fuente clínica con su huella. Un solo sitio para portada, «Sobre»,
   hojas y aviso de actualización. */
import { CAPITULO } from "./contenido";
import { VERSION_APP } from "./contenido/cambios";

const build = typeof __BUILD__ !== "undefined" ? __BUILD__ : { sha: "desarrollo", fecha: "" };

export const BUILD = {
  version: VERSION_APP,
  sha: build.sha,
  fecha: build.fecha,
  fuente: {
    titulo: CAPITULO.titulo,
    fecha: CAPITULO.fechaFuente,
    fechaISO: CAPITULO.fechaFuenteISO,
    paginas: CAPITULO.paginas,
    isbn: CAPITULO.isbn,
    sha256: CAPITULO.pdfSha256,
  },
  pacientes: {
    fecha: CAPITULO.fechaPdfPacientes,
    sha256: CAPITULO.pdfPacientesSha256,
  },
} as const;
