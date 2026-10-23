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
| 2026-10-13 23:01 | main   | 0.65.1  | 846bf3d6394e | index-Wr0FUw4O.js                       | 0.65.0 (f265b15bbee2) |
| 2026-10-14 05:52 | main   | 0.65.2  | 44a8bffe330a | index-CWIALDm5.js                       | 0.65.1 (846bf3d6394e) |
| 2026-10-14 06:06 | main   | 0.65.3  | 395c44ae5ced | index-BCLKIH60.js                       | 0.65.2 (44a8bffe330a) |
| 2026-10-14 06:31 | main   | 0.66.0  | f0861dc9b583 | index-CdST3TwD.js                       | 0.65.3 (395c44ae5ced) |
| 2026-10-14 07:18 | main   | 0.66.1  | 2c2c9685bc81 | index-ghBxENhz.js                       | 0.66.0 (f0861dc9b583) |
| 2026-10-14 07:55 | prueba | 0.67.0  | f0e8c899d556 | index-Bjkt8O1q.js                       | 0.62.0 (69e49db69088) |
| 2026-10-14 08:08 | main   | 0.67.0  | 6a755cd4dbe5 | index-Dn1wFn05.js                       | 0.66.1 (2c2c9685bc81) |
| 2026-10-14 08:27 | main   | 0.68.0  | 7abc099613f0 | index-B2gCkaoi.js                       | 0.67.0 (6a755cd4dbe5) |
| 2026-10-14 08:39 | main   | 0.68.1  | b3198eed4863 | index-B6Binibh.js                       | 0.68.0 (7abc099613f0) |
| 2026-10-14 10:27 | prueba | 0.70.0  | daa4ed8a21f4 | index-Dnc1R9ln.js                       | 0.67.0 (f0e8c899d556) |
| 2026-10-14 13:22 | main   | 0.70.0  | 8d2043429ecc | index-Bs84SBac.js                       | 0.68.1 (b3198eed4863) |
| 2026-10-14 19:50 | main   | 0.71.0  | dac002c6f3ca | index-BKaXsyL6.js                       | 0.70.0 (8d2043429ecc) |
| 2026-10-15 05:37 | main   | 0.72.0  | a9177c015329 | index-siStAzw6.js                       | 0.71.0 (dac002c6f3ca) |
| 2026-10-15 07:44 | main   | 0.72.1  | aa74c5d89c58 | index-TYg3aYU3.js                       | 0.72.0 (a9177c015329) |
| 2026-10-15 11:34 | main   | 0.72.2  | 56d62c819c17 | index-C1fS0YKf.js                       | 0.72.1 (aa74c5d89c58) |
| 2026-10-15 12:29 | main   | 0.73.0  | d443c165242c | index-BEml_B3Z.js                       | 0.72.2 (56d62c819c17) |
| 2026-10-15 14:17 | main   | 0.74.0  | 1aef3d171100 | index-Dqk1EDWd.js                       | 0.73.0 (d443c165242c) |
| 2026-10-16 05:25 | main   | 0.76.0  | 78b550ad9143 | index-D-jMwQU4.js                       | 0.74.0 (1aef3d171100) |
| 2026-10-16 09:14 | main   | 0.76.1  | 9d93d3ef56d3 | index-BA8yRpue.js                       | 0.76.0 (78b550ad9143) |
| 2026-10-16 10:52 | main   | 0.76.2  | 1c2ac689bb36 | index-sFrMmvk3.js                       | 0.76.1 (9d93d3ef56d3) |
| 2026-10-19 16:58 | main   | 0.76.3  | 9ba6288adb9c | index-fYlhWwlb.js                       | 0.76.2 (1c2ac689bb36) |
| 2026-10-20 23:02 | main   | 0.91.0  | d91be46481c6 | index-D1ROmRl1.js                       | 0.76.3 (9ba6288adb9c) |
| 2026-10-20 23:10 | main   | 0.91.1  | 43a1d1f29926 | index-DN-9pC0n.js                       | 0.91.0 (d91be46481c6) |
| 2026-10-20 23:24 | main   | 0.91.2  | eeba8a00dfb1 | index-BggYRyzk.js                       | 0.91.1 (43a1d1f29926) |
| 2026-10-21 15:37 | main   | 0.92.0  | 2cc4169da017 | index-fyu922hE.js                       | 0.91.2 (eeba8a00dfb1) |
| 2026-10-21 15:56 | main   | 0.92.1  | c6fd9cb682d7 | index-jYJpffWg.js                       | 0.92.0 (2cc4169da017) |
| 2026-10-21 16:05 | main   | 0.92.2  | 09eaaab95482 | index-CQPkAxCj.js                       | 0.92.1 (c6fd9cb682d7) |

Nota (21-10-2026): el despliegue de la 0.92.1 (index-jYJpffWg.js) se construyó mientras ya se
editaban en la copia de trabajo los cambios de la 0.92.2 (orden de Parámetros y temas de
Preguntas abiertos en el ordenador), así que llevaba ya esos cambios sin estar en c6fd9cb. Quedó
sustituido 9 minutos después por la 0.92.2 (09eaaab), que es su commit exacto. Para recuperar la
0.92.1 tal cual, construir desde c6fd9cb, no usar aquel despliegue.
| 2026-10-21 16:57 | main | 0.93.0 | 9ec4f59abfeb | index-1ou5Mg4v.js | 0.92.2 (09eaaab95482) |
| 2026-10-21 18:31 | main | 0.93.1 | 783729571289 | index-DSIhmauG.js | 0.93.0 (9ec4f59abfeb) |
| 2026-10-21 20:22 | main | 0.94.0 | 4ec14a19ed53 | index-tXD4PolN.js | 0.93.1 (783729571289) |
| 2026-10-21 20:44 | main | 0.94.1 | a6852c066851 | index-ogOGtxld.js | 0.94.0 (4ec14a19ed53) |
| 2026-10-21 20:53 | main | 0.95.0 | 4dd80dcfc6b2 | index-C3pKouH9.js | 0.94.1 (a6852c066851) |
| 2026-10-22 05:30 | main | 0.96.0 | 3b5b554a29e3 | index-BpYbGkq_.js | 0.95.0 (4dd80dcfc6b2) |

Nota (22-10-2026): la 0.96.0 se desplegó bien, pero la comprobación final de `npm run publicar` falló por el retraso de propagación (la web aún servía la 0.95.0); 20 s después servía la 0.96.0 (index-BpYbGkq_.js) y esta línea se anotó a mano.
| 2026-10-22 06:29 | main | 0.97.0 | 265735686f29 | index-CfGTAHg0.js | 0.96.0 (3b5b554a29e3) |
| 2026-10-22 10:54 | main | 0.98.0 | ca4f64d27d78 | index-DMo8YeSN.js | 0.97.0 (265735686f29) |
| 2026-10-22 11:29 | main | 0.99.0 | fe9201bc03a3 | index-B77jK-u-.js | 0.98.0 (ca4f64d27d78) |
| 2026-10-22 12:24 | main | 1.0.0 | 7ed39961066d | index-BlHxnAxu.js | 0.99.0 (fe9201bc03a3) |
| 2026-10-22 12:40 | main | 1.0.1 | a9677b0809ab | index-CPRnIGiF.js | 1.0.0 (7ed39961066d) |
| 2026-10-22 13:23 | main | 1.0.2 | f42d3bc62d88 | index-9mHuU0oG.js | 1.0.1 (a9677b0809ab) |
| 2026-10-22 13:34 | main | 1.0.3 | fa8361062e09 | index-BxVQPBHr.js | 1.0.2 (f42d3bc62d88) |
| 2026-10-22 14:10 | main | 1.0.4 | 1dd04ef16577 | index-BHDWAdoW.js | 1.0.3 (fa8361062e09) |
| 2026-10-22 15:22 | main | 1.0.5 | aad60c60d2e1 | index-CH4zSR1F.js | 1.0.4 (1dd04ef16577) |
| 2026-10-22 16:46 | main | 1.0.6 | a9bf65f89854 | index-_FgKy273.js | 1.0.5 (aad60c60d2e1) |
| 2026-10-22 18:34 | main | 1.0.7 | 1b19f7130a3a | index-BlHSmK5q.js | 1.0.6 (a9bf65f89854) |
| 2026-10-22 18:53 | main | 1.0.8 | c2f10223d8f0 | index-CMzdmpI7.js | 1.0.7 (1b19f7130a3a) |
| 2026-10-22 21:06 | main | 1.0.9 | 40ffb0d317a3 | index-Cd_FD46t.js | 1.0.8 (c2f10223d8f0) |
| 2026-10-22 22:20 | main | 1.0.10 | 5502da364532 | index-CP1UdfoP.js | 1.0.9 (40ffb0d317a3) |
| 2026-10-23 05:38 | main | 1.0.11 | 8f3faf124767 | index-CruJfwvI.js | 1.0.10 (5502da364532) |
