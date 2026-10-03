/* 404.html: si alguien teclea una dirección de la app sin «#» (p. ej. la impresa en una hoja:
   /pacientes/resumen), se le lleva a su pantalla (/#/pacientes/resumen). Script propio (la CSP
   no admite scripts en línea). */
(function () {
  var secciones =
    /^\/(capitulo|consultar|visual|sistemas|pacientes|buscar|bibliografia|cambios|sobre|test|mas)(\/|$)/;
  var ruta = window.location.pathname.replace(/\/+$/, "");
  if (secciones.test(ruta + "/")) window.location.replace("/#" + ruta);
})();
