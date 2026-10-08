// Vectores de significado (Workers AI, @cf/baai/bge-m3) de una lista de textos, con caché en disco
// para no pedir dos veces el mismo texto. La credencial es la de wrangler (OAuth) o la variable
// CLOUDFLARE_API_TOKEN; la cuenta, CLOUDFLARE_ACCOUNT_ID o la del proyecto.
// Uso como módulo: import { embeber } from "./embeber.mjs"; await embeber(["texto", …])
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";

export const MODELO = "@cf/baai/bge-m3";
const CUENTA = process.env.CLOUDFLARE_ACCOUNT_ID ?? "48acd6a4debc742bccd81b84be547379";
const CACHE = new URL("./cache/vectores.json", import.meta.url);

function credencial() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const rutas = [
    join(process.env.APPDATA ?? "", "xdg.config", ".wrangler", "config", "default.toml"),
    join(homedir(), ".wrangler", "config", "default.toml"),
    join(homedir(), ".config", ".wrangler", "config", "default.toml"),
  ];
  for (const r of rutas)
    if (existsSync(r)) {
      const m = readFileSync(r, "utf8").match(/^oauth_token = "(.+)"$/m);
      if (m) return m[1];
    }
  throw new Error(
    "Sin credencial de Cloudflare: haz «npx wrangler login» o define CLOUDFLARE_API_TOKEN",
  );
}

const clave = (t) => createHash("sha1").update(`${MODELO}\n${t}`).digest("hex");

export async function embeber(textos, { lote = 50 } = {}) {
  mkdirSync(new URL("./cache/", import.meta.url), { recursive: true });
  const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};
  const faltan = [...new Set(textos.filter((t) => !cache[clave(t)]))];
  const token = faltan.length ? credencial() : null;
  for (let i = 0; i < faltan.length; i += lote) {
    const trozo = faltan.slice(i, i + lote);
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CUENTA}/ai/run/${MODELO}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: trozo }),
      },
    );
    const d = await res.json();
    if (!d.success) throw new Error(`Workers AI: ${JSON.stringify(d.errors)}`);
    d.result.data.forEach((v, k) => (cache[clave(trozo[k])] = v.map((x) => +x.toFixed(5))));
    writeFileSync(CACHE, JSON.stringify(cache));
    process.stderr.write(`  ${Math.min(i + lote, faltan.length)}/${faltan.length}\n`);
  }
  return textos.map((t) => cache[clave(t)]);
}

export const coseno = (a, b) => {
  let p = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    p += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return p / Math.sqrt(na * nb);
};
