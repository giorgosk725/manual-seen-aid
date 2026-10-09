/* ¿Hay casos guiados en esta edición? Solo mira si existe el archivo, sin cargarlo (los datos
   van en el trozo perezoso de la pantalla, no en la entrada de la app). Lo usa «Leer y
   comprender» para ofrecerlos o no. */
export const HAY_CASOS = Object.keys(import.meta.glob("./casos-borrador/*.json")).length > 0;
