# Consultas sin respuesta

Desde la 0.31.0, cuando una búsqueda no encuentra ningún pasaje ni pregunta frecuente (y lleva
dos segundos así, con el lector parado), la app manda el texto de la consulta a la función
`/api/sin-respuesta` (`functions/api/sin-respuesta.ts`), que lo cuenta en un almacén KV de
Cloudflare (`CONSULTAS`, `wrangler.toml`).

## Qué se guarda y qué no

- Se guarda: el texto en minúsculas, sin espacios de más y recortado a 80 caracteres, cuántas
  veces se ha hecho, cuántas de ellas tenían al menos resultados del índice (pero ningún pasaje) y
  el mes de la última. Cada registro caduca a los seis meses de la última vez (TTL de KV).
- No se guarda: IP, navegador, fecha exacta, ni nada de quién la hizo. Cloudflare no registra el
  cuerpo de la petición.
- No se manda: consultas de menos de 4 letras, ni las que contienen un correo, una URL o una
  cifra de cinco dígitos o más (teléfonos, números de historia). La misma consulta se manda una
  vez por sesión del navegador. También se manda la que nombra un sistema que el capítulo no trata
  (iLet, Diabeloop…), porque tampoco tiene respuesta específica.
- «Sobre esta app» lo dice en una frase y el aviso de «sin resultados» lo recuerda junto al
  buscador. El filtro no garantiza que un texto libre no lleve un nombre: por eso se pide escribir
  las dudas sin datos del paciente.

## Cómo leer la lista

En la app, `#/sobre/consultas` (sin enlace desde el menú): pide la clave de lectura, la guarda
en el navegador y enseña la tabla (consulta, veces, con resultados, último mes), con cada consulta
enlazada al buscador para probarla. La clave está en `.local/clave-consultas.txt` (fuera del
repositorio) y en Cloudflare como secreto `CLAVE_CONSULTAS` del proyecto (producción). Para
cambiarla:

```bash
npx wrangler pages secret put CLAVE_CONSULTAS --project-name manual-seen-aid
```

También por la API, con la cabecera `X-Clave`:

```bash
curl -H "X-Clave: $(cat .local/clave-consultas.txt)" https://manual-seen-aid.pages.dev/api/sin-respuesta
```

## Para qué sirve

Cada consulta de la lista es una de tres cosas: una palabra que falta en el léxico
(`LEXICO`/`FRASES` en `src/respuestas.ts`), una pregunta frecuente que falta (`src/frecuentes.ts`)
o algo que el capítulo no trata. Las dos primeras se arreglan; la tercera se deja como está.
