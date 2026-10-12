/* Edición editorial (A03): las Functions de este build no reciben texto de búsqueda. POST a
   /api/pasajes y /api/sin-respuesta responden 410 sin leer el cuerpo ni llamar al modelo ni al
   KV. La lectura con clave de las consultas ya registradas (GET /api/sin-respuesta) se mantiene
   para su responsable; los bindings y datos de producción se resuelven aparte. */
export const RECOGIDA_CERRADA = true;

export const cerrada = () =>
  new Response(JSON.stringify({ error: "No disponible en esta edición" }), {
    status: 410,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
