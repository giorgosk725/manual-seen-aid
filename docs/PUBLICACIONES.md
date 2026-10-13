# Publicaciones

Cada línea la escribe `npm run publicar` tras comprobar lo servido (desde la 0.55.0). Las tres
primeras se reconstruyen de lo comprobado al publicar a mano con wrangler. Recuperar una
versión: `git checkout <commit>` y `npm run publicar` desde ahí (o «Rollback» al deployment en
Cloudflare Pages).

| Fecha (UTC)      | Canal  | Versión | Commit       | Build                                   | Recuperación          |
| ---------------- | ------ | ------- | ------------ | --------------------------------------- | --------------------- |
| 2026-10-13       | main   | 0.52.0  | 33647a98c7cf | index-Dxo606HR.js (deployment 20c075f4) | 0.51.0 (0dfaa7b)      |
| 2026-10-13       | main   | 0.53.0  | 02a1de1c8603 | index-DAjxyslO.js (deployment fcaac40d) | 0.52.0 (33647a98c7cf) |
| 2026-10-13       | main   | 0.54.0  | 3fad3486eae1 | index-DRDvLmxF.js (deployment aa18c1a5) | 0.53.0 (02a1de1c8603) |
| 2026-10-13 10:57 | main   | 0.55.0  | ac0ef5c4ac44 | index-B_9TeiEa.js                       | 0.54.0 (3fad3486eae1) |
| 2026-10-13 11:37 | prueba | 0.56.0  | 511e4e545a56 | index-3VzbTsDM.js                       | —                     |
| 2026-10-13 11:48 | main   | 0.56.0  | 5eacc59f850c | index-DUa3OXUF.js                       | 0.55.0 (ac0ef5c4ac44) |
| 2026-10-13 12:29 | prueba | 0.57.0  | f74913702813 | index-eLiPNGHy.js                       | 0.56.0 (511e4e545a56) |
| 2026-10-13 12:37 | main   | 0.57.0  | 38849882e467 | index-EwZnS8UC.js                       | 0.56.0 (5eacc59f850c) |
| 2026-10-13 13:16 | prueba | 0.58.0  | 2e295187bc02 | index-D-jZqvmQ.js                       | 0.57.0 (f74913702813) |
| 2026-10-13 13:58 | main   | 0.58.0  | de017bf3b79c | index-6GOkmKBE.js                       | 0.57.0 (38849882e467) |
| 2026-10-13 14:42 | prueba | 0.59.0  | 73b3b0f90862 | index-DmCkxvW-.js                       | 0.58.0 (2e295187bc02) |
| 2026-10-13 14:47 | main   | 0.59.0  | ddc520fe5d79 | index-C5PoARyt.js                       | 0.58.0 (de017bf3b79c) |
| 2026-10-13 14:56 | prueba | 0.60.0  | 750adbb58a3c | index-CiH9f-Hk.js                       | 0.59.0 (73b3b0f90862) |
| 2026-10-13 17:04 | main   | 0.60.0  | 4412a5105900 | index-D5r13FZB.js                       | 0.59.0 (ddc520fe5d79) |
| 2026-10-13 17:21 | prueba | 0.61.0  | 9ae62cb87b8f | index-BSPTo5zZ.js                       | 0.60.0 (750adbb58a3c) |
| 2026-10-13 17:30 | main   | 0.61.0  | 805fb92ae16e | index-9OdHJuuE.js                       | 0.60.0 (4412a5105900) |
| 2026-10-13 18:04 | prueba | 0.62.0  | 69e49db69088 | index-BS8vWCEp.js                       | 0.61.0 (9ae62cb87b8f) |
| 2026-10-13 18:46 | main   | 0.63.0  | 28063bb421bb | index-CBzQgHYd.js                       | 0.61.0 (805fb92ae16e) |
| 2026-10-13 20:55 | main   | 0.64.0  | 9096fcd7e77e | index-qzLWKW6E.js                       | 0.63.0 (28063bb421bb) |
| 2026-10-13 21:57 | main   | 0.65.0  | f265b15bbee2 | index-BAgPGTEf.js                       | 0.64.0 (9096fcd7e77e) |
