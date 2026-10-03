/* Iconos de la app con la identidad del Manual SEEN: libro abierto (el manual) con el asa
   cerrada (aro con tres nodos: sensor, algoritmo y bomba) y la franja de cuatro colores.
   Uso (desde la raíz): `node scripts/iconos.mjs`. Escribe en public/:
   - favicon.svg (esquinas redondeadas)
   - pwa-192.png y pwa-512.png (propósito «any», esquinas redondeadas y transparentes)
   - pwa-maskable-512.png (a sangre; el dibujo cabe en la zona segura del 80 %)
   - apple-touch-icon.png (180 px, a sangre: iOS pone su propia máscara) */
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";

const AZUL_OSC = "#3F6E9F";
const FRANJA = ["#739DCB", "#8E254E", "#E0A83E", "#B5668C"];

/* Dibujo en una caja de 120 × 120. `radio` = esquinas; `escala` encoge el dibujo hacia el
   centro (para la zona segura del icono a sangre). */
const svg = ({ radio = 26, escala = 1 } = {}) => {
  const t = (60 * (1 - escala)).toFixed(2);
  const franja = FRANJA.map(
    (c, i) => `<rect x="${22 + i * 19}" y="94" width="19" height="6" fill="${c}"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <!-- Manual SEEN · AID: libro abierto con el asa cerrada y la franja de cuatro colores del
       Manual SEEN (azul, burdeos, mostaza y rosa). Generado por scripts/iconos.mjs. -->
  <rect width="120" height="120" rx="${radio}" fill="${AZUL_OSC}"/>
  <g transform="translate(${t} ${t}) scale(${escala})">
    <path d="M22 30c10-5 20-5 34 2v54c-14-7-24-7-34-2z" fill="#ffffff"/>
    <path d="M98 30c-10-5-20-5-34 2v54c14-7 24-7 34-2z" fill="#eef3f9"/>
    <circle cx="81" cy="57" r="12" fill="none" stroke="#8E254E" stroke-width="4"/>
    <circle cx="81" cy="45" r="3.8" fill="#E0A83E"/>
    <circle cx="70.6" cy="63" r="3.8" fill="#E0A83E"/>
    <circle cx="91.4" cy="63" r="3.8" fill="#E0A83E"/>
    ${franja}
  </g>
</svg>`;
};

writeFileSync("public/favicon.svg", svg() + "\n");

const b = await chromium.launch();
const p = await b.newPage();
const png = async (contenido, lado, destino, fondoTransparente) => {
  await p.setViewportSize({ width: lado, height: lado });
  await p.setContent(
    `<html><body style="margin:0;background:transparent">${contenido.replace(
      'width="120" height="120"',
      `width="${lado}" height="${lado}"`,
    )}</body></html>`,
  );
  await p.screenshot({ path: destino, omitBackground: fondoTransparente });
  console.log(destino);
};
await png(svg(), 192, "public/pwa-192.png", true);
await png(svg(), 512, "public/pwa-512.png", true);
await png(svg({ radio: 0, escala: 0.82 }), 512, "public/pwa-maskable-512.png", false);
await png(svg({ radio: 0, escala: 0.9 }), 180, "public/apple-touch-icon.png", false);
await b.close();
