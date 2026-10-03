"""Auditoría de fidelidad app ↔ PDF del capítulo (30-9-2026).

- Párrafos, subtítulos y listas: deben aparecer LITERALMENTE (normalizados) en el texto de su
  página (o páginas, si el párrafo salta). Se informa la primera divergencia.
- Celdas de tabla, notas y referencias: el PDF intercala las columnas línea a línea, así que se
  comprueba que cada palabra de la celda esté en las páginas de la tabla (multiconjunto) y que
  los NÚMEROS coincidan exactamente.
- Correcciones editoriales esperadas: se marcan aparte.

Uso (desde la raíz): npx vite-node scripts/auditoria/exportar-contenido.mjs
                     python scripts/auditoria/fidelidad.py [ruta-al-PDF]
"""
import json, re, sys, unicodedata
from collections import Counter
import fitz

PDF = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\giorg\Downloads\Capitulo_AID_SEEN_30-09-2026_ANOTADO_FINAL_11_OBSERVACIONES.pdf"
APP = "_audit_contenido.json"
OUT = "_audit_fidelidad.json"

doc = fitz.open(PDF)
paginas = {i + 1: p.get_text("text") for i, p in enumerate(doc)}

def norm(s: str) -> str:
    s = s.replace("\u00ad", "")
    s = re.sub(r"(\w)-\n(?=[a-záéíóúñü])", r"\1", s)          # guion de partición
    s = s.replace("\n", " ")
    s = s.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
    s = s.replace("−", "-")
    s = re.sub(r"\s*([–—])\s*", r"\1", s)
    s = re.sub(r"\s+([,.;:)\]])", r"\1", s)
    s = re.sub(r"([(\[])\s+", r"\1", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip().lower()

def palabras(s: str):
    s = re.sub(r"(\w)-\n(?=[a-záéíóúñü])", r"\1", s)  # une palabras partidas con guion
    s = unicodedata.normalize("NFC", s.lower())
    return re.findall(r"[0-9]+(?:[.,][0-9]+)?|[a-záéíóúñüβ]+", s)

def numeros(s: str):
    return re.findall(r"\d+(?:[.,]\d+)?", s)

CORRECCIONES = [
    ("1/11", r"basado en modelo \(mpc\) y lógica difusa"),
    ("2/11", r"comercializados en españa"),
    ("3/11", r"sin peso mínimo"),
    ("4/11", r"control-iq\+ y omnipod 5 ya cuentan"),
    ("6/11", r"ejercicio \(140–160 mg/dl\)"),
    ("7/11", r"ejercicio anaeróbico o de alta intensidad|habitualmente sin modo temporal específico"),
    ("8/11", r"computarizada"),
    ("errata", r"peso 9–200 kg"),
    ("10/11", r"hirsch ib, kirkman ms"),
]

def correccion(t):
    for etiqueta, rx in CORRECCIONES:
        if re.search(rx, t):
            return etiqueta
    return None

app = json.load(open(APP, encoding="utf-8"))
res = {"parrafos_ok": 0, "parrafos_fallo": [], "celdas_ok": 0, "celdas_fallo": [], "refs_fallo": [], "corr": []}

# --- Párrafos ---
for b in app["parrafos"]:
    pags = [b["p"]] + ([b["p2"]] if b.get("p2") else [])
    fuente = norm(" ".join(paginas[p] for p in pags))
    # Quitar cabecera/pie de página que se cuela entre páginas.
    fuente = re.sub(r"ec-europe - 30/09/2026 \d+ ", "", fuente)
    t = norm(b["texto"])
    if t in fuente:
        res["parrafos_ok"] += 1
        continue
    c = correccion(t)
    if c:
        res["corr"].append((c, b["id"]))
        continue
    lo, hi = 0, len(t)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if t[:mid] in fuente:
            lo = mid
        else:
            hi = mid - 1
    # ¿está en otra página? (página mal asignada)
    otra = [p for p, txt in paginas.items() if t[: min(120, len(t))] in norm(txt)]
    res["parrafos_fallo"].append({"id": b["id"], "p": pags, "en_pagina": otra, "ok_hasta": t[max(0, lo - 70):lo], "diverge": t[lo:lo + 90]})

# --- Celdas de tabla ---
for c in app["tablas"]:
    p0, p1 = c["paginas"]
    fuente = " ".join(paginas[p] for p in range(p0, p1 + 1))
    bolsa = Counter(palabras(fuente))
    faltan = [w for w, n in Counter(palabras(c["texto"])).items() if bolsa[w] < 1]
    nums_f = set(numeros(fuente))
    nums_faltan = [n for n in numeros(c["texto"]) if n not in nums_f]
    t = norm(c["texto"])
    if not faltan and not nums_faltan:
        res["celdas_ok"] += 1
        continue
    corr = correccion(t)
    if corr:
        res["corr"].append((corr, c["id"]))
        continue
    res["celdas_fallo"].append({"id": c["id"], "palabras_que_no_estan": faltan, "numeros_que_no_estan": nums_faltan, "texto": c["texto"][:160]})

# --- Bibliografía (pp. 24–25) ---
fuente = paginas[24] + " " + paginas[25]
bolsa = Counter(palabras(fuente))
for r in app["refs"]:
    faltan = [w for w in set(palabras(r["texto"])) if bolsa[w] < 1]
    if faltan and not correccion(norm(r["texto"])):
        res["refs_fallo"].append({"id": r["id"], "faltan": faltan})

# --- Glosario: cada sigla aparece en el capítulo y su página la contiene ---
todo = " ".join(paginas.values())
res["glosario_fallo"] = []
for g in app["glosario"]:
    if g["sigla"] not in paginas[g["pagina"]]:
        donde = [p for p, txt in paginas.items() if g["sigla"] in txt][:3]
        res["glosario_fallo"].append({"sigla": g["sigla"], "pagina_app": g["pagina"], "aparece_en": donde})

# --- Cifras: cada valor (sus números) aparece en la página indicada ---
res["cifras_fallo"] = []
for slug, lista in app["cifras"].items():
    for c in lista:
        nums = numeros(c["valor"])
        txt = paginas[c["p"]]
        faltan = [n for n in nums if n not in txt]
        if faltan:
            donde = [p for p, t in paginas.items() if all(n in t for n in nums)][:4]
            res["cifras_fallo"].append({"apartado": slug, "valor": c["valor"], "p": c["p"], "faltan": faltan, "todos_en": donde})

# --- Diagramas: números exactos y palabras en la página indicada (algoritmos: Tabla 1, pp. 3–4) ---
res["diagramas_fallo"] = []
VACIAS = {"no", "se", "indica", "en", "la", "tabla", "1", "p"}  # «no se indica en la Tabla 1» es interfaz
for d in app.get("diagramas", []):
    pags = (
        [3, 4] if d["id"].startswith("algoritmos")
        else [4, 5] if d["id"].startswith("objetivos general")
        else list(range(d["p"], d["p2"] + 1)) if d.get("p2")
        else [d["p"]]
    )
    fuente = " ".join(paginas[x] for x in pags)
    if 8 in pags:  # la Figura 3 es imagen: se compara con su transcripción
        fuente += " " + " ".join(f["texto"] for f in app["figura3"])
    bolsa = Counter(palabras(fuente))
    nums_f = set(numeros(fuente))
    texto = d["texto"]
    if texto.startswith("no se indica"):
        continue
    faltan_n = [n for n in numeros(texto) if n not in nums_f]
    faltan_w = [w for w in set(palabras(texto)) if bolsa[w] < 1 and w not in VACIAS]
    if faltan_n or faltan_w:
        res["diagramas_fallo"].append({"id": d["id"], "p": pags, "numeros": faltan_n, "palabras": faltan_w, "texto": texto[:120]})

json.dump(res, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("párrafos OK", res["parrafos_ok"], "| divergencias", len(res["parrafos_fallo"]))
print("celdas OK", res["celdas_ok"], "| divergencias", len(res["celdas_fallo"]))
print("referencias con palabras ausentes", len(res["refs_fallo"]))
print("glosario con página dudosa", len(res["glosario_fallo"]))
print("cifras con número ausente en su página", len(res["cifras_fallo"]))
print("correcciones editoriales detectadas", len(res["corr"]))
print("diagramas: frases con algo que no está en su página", len(res["diagramas_fallo"]), "de", len(app.get("diagramas", [])))
for f in res["diagramas_fallo"]:
    print("  ", f)
