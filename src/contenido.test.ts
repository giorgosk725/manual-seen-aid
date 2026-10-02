/* Integridad del contenido: estructura, páginas, correcciones editoriales aplicadas y
   convenciones de escritura. Si una corrección se pierde al editar, esto lo dice. */
import { describe, expect, it } from "vitest";
import {
  APARTADOS,
  BIBLIOGRAFIA,
  FIGURA3,
  GLOSARIO,
  INFO,
  LISTA_TABLAS,
  TABLAS,
  F1,
  F2,
} from "./contenido";
import { PREGUNTAS } from "./contenido/test";
import { CAMBIOS, PENDIENTES } from "./contenido/cambios";
import { buscar, indice, normalizar } from "./buscador";

const todoElTexto = () =>
  JSON.stringify({
    APARTADOS,
    LISTA_TABLAS,
    F1,
    F2,
    INFO,
    FIGURA3,
    BIBLIOGRAFIA,
    GLOSARIO,
    PREGUNTAS,
  });

describe("apartados", () => {
  it("son 13, numerados en orden y con slug único", () => {
    expect(APARTADOS).toHaveLength(13);
    APARTADOS.forEach((a, i) => expect(a.n).toBe(i + 1));
    expect(new Set(APARTADOS.map((a) => a.slug)).size).toBe(13);
  });
  it("cada bloque lleva una página dentro del rango del apartado y del capítulo (1–25)", () => {
    for (const a of APARTADOS) {
      expect(a.paginas[0]).toBeLessThanOrEqual(a.paginas[1]);
      let anterior = 0;
      for (const b of a.bloques) {
        expect(b.p).toBeGreaterThanOrEqual(1);
        expect(b.p).toBeLessThanOrEqual(25);
        expect(b.p).toBeGreaterThanOrEqual(a.paginas[0]);
        expect(b.p).toBeLessThanOrEqual(a.paginas[1]);
        // Las páginas no retroceden dentro de un apartado (orden de lectura).
        expect(b.p).toBeGreaterThanOrEqual(anterior);
        anterior = b.p;
        if (b.t === "p" && b.p2) expect(b.p2).toBe(b.p + 1);
      }
    }
  });
  it("los apartados se encadenan por páginas sin huecos", () => {
    for (let i = 1; i < APARTADOS.length; i++) {
      expect(APARTADOS[i].paginas[0]).toBeGreaterThanOrEqual(APARTADOS[i - 1].paginas[1] - 0);
      expect(APARTADOS[i].paginas[0] - APARTADOS[i - 1].paginas[1]).toBeLessThanOrEqual(1);
    }
  });
  it("los ids de subapartado son únicos dentro de su apartado y no chocan con b<n>", () => {
    for (const a of APARTADOS) {
      const ids = a.bloques.filter((b) => b.t === "h3").map((b) => (b as { id: string }).id);
      expect(new Set(ids).size).toBe(ids.length);
      ids.forEach((id) => expect(id).not.toMatch(/^b\d+$/));
    }
  });
  it("las seis tablas y las cuatro figuras aparecen una vez cada una", () => {
    const tablas = APARTADOS.flatMap((a) =>
      a.bloques.filter((b) => b.t === "tabla").map((b) => (b as { id: string }).id),
    );
    expect(tablas.sort()).toEqual(["T1", "T2", "T3", "T4", "T5", "T6"]);
    const figuras = APARTADOS.flatMap((a) =>
      a.bloques.filter((b) => b.t === "figura").map((b) => (b as { id: string }).id),
    );
    expect(figuras.sort()).toEqual(["F1", "F2", "F3", "INFO"]);
  });
  it("el marcado en línea está equilibrado (asteriscos pares)", () => {
    for (const a of APARTADOS)
      for (const b of a.bloques) {
        const textos = b.t === "p" ? [b.texto] : b.t === "lista" ? [b.intro ?? "", ...b.items] : [];
        for (const t of textos) {
          const n = (t.replace(/\\\*/g, "").match(/\*/g) || []).length;
          expect(n % 2, t.slice(0, 60)).toBe(0);
        }
      }
  });
});

describe("tablas", () => {
  it("cada fila tiene tantas celdas como columnas (o una sola si está unida)", () => {
    for (const t of LISTA_TABLAS)
      for (const f of t.filas) {
        if (f.unida) expect(f.celdas).toHaveLength(1);
        else expect(f.celdas, `${t.id}: ${f.etiqueta}`).toHaveLength(t.columnas.length);
      }
  });
  it("las tablas por sistema tienen los cuatro sistemas en el mismo orden", () => {
    const orden = ["MiniMed 780G", "Tandem Control-IQ", "myLoop CamAPS", "Omnipod 5"];
    for (const id of ["T1", "T3", "T4"] as const) expect(TABLAS[id].columnas).toEqual(orden);
    expect(TABLAS.T1.filas).toHaveLength(11);
    expect(TABLAS.T5.filas).toHaveLength(8);
    expect(TABLAS.T6.filas).toHaveLength(8);
  });
});

describe("correcciones editoriales aplicadas", () => {
  const todo = todoElTexto();
  it("1/11 MPC tras «basado en modelo»", () => {
    expect(todo).toContain("control predictivo basado en modelo (MPC) y lógica difusa");
    expect(todo).not.toContain("lógica difusa (MPC)");
  });
  it("2/11 «comercializados en España» sin «próxima incorporación»", () => {
    expect(todo).not.toContain("próxima incorporación");
    expect(TABLAS.T1.titulo).toContain("Sistemas AID comercializados en España");
  });
  it("3/11 indicación de Omnipod 5 sin la nota al editor", () => {
    const ind = TABLAS.T1.filas.find((f) => f.etiqueta === "Indicación")!;
    expect(ind.celdas[3]).toMatch(/^≥ 2 años; sin peso mínimo; DTD ≥ 5 UI\/día/);
    expect(todo).not.toContain("Si puede ir");
  });
  it("4/11 sin guion tras Omnipod 5", () => {
    expect(todo).not.toContain("Omnipod 5-");
    expect(todo).toContain("Control-IQ+ y Omnipod 5 ya cuentan");
  });
  it("5/11 Figura 3: columna amarilla, iSGLT2, nota con asterisco, negrita", () => {
    expect(FIGURA3.tramos[1].rango).toBe("β-OHB 0,6-0,9 mmol/l");
    expect(FIGURA3.tramos[1].rango).not.toContain("<0,6");
    expect(FIGURA3.abreviaturas).toContain("iSGLT2");
    expect(FIGURA3.pie[1].texto).toContain("iSGLT2");
    expect(FIGURA3.notaAsterisco).toMatch(/^\*Dosis orientativas para personas adultas/);
    const rojo = FIGURA3.tramos[3].pasos.at(-1)!;
    expect(rojo.detalle?.at(-1)).toBe("**Precisan atención urgente.**");
    expect(JSON.stringify(FIGURA3)).not.toMatch(/segun |sintomas|especifica:|β -OHB/);
  });
  it("6/11 modo ejercicio en mg/dl (Tabla 3)", () => {
    expect(TABLAS.T3.filas[0].celdas[1]).toContain("ejercicio (140–160 mg/dl)");
    expect(todo).not.toContain("mg/l)");
  });
  it("7/11 fila «Ejercicio anaeróbico» reconstruida (Tabla 4)", () => {
    const f = TABLAS.T4.filas[1];
    expect(f.etiqueta).toBe("Ejercicio anaeróbico o de alta intensidad");
    expect(f.unida).toBe(true);
    expect(todo).not.toContain("||||");
  });
  it("8/11 tomografía computarizada (Tabla 6)", () => {
    expect(TABLAS.T6.filas[1].etiqueta).toBe("Tomografía computarizada (TC)");
    expect(todo).not.toContain("computerizada");
  });
  it("9/11 los seis cambios de la infografía", () => {
    const info = JSON.stringify(INFO);
    expect(info).toContain("En modalidades híbridas");
    expect(info).not.toMatch(/sigue siendo híbrido/i);
    expect(info).toContain("Requieren anuncio de comidas y bolo prandial");
    expect(info).not.toContain("No sustituye el bolo prandial");
    expect(info).toContain("Modalidad preferente en DM1");
    expect(info).toContain("Mejora consistente del control glucémico con buen perfil de seguridad");
    expect(info).not.toContain("Evidencia sólida");
    expect(info).toContain("Bomba de insulina o pod");
    expect(info).toContain("3 Iniciar");
    expect(info).not.toContain("Inciar");
  });
  it("10/11 referencia 6 completa con DOI", () => {
    const r6 = BIBLIOGRAFIA.find((r) => r.n === 6)!;
    expect(r6.doi).toBe("10.2337/dci26-0122");
    expect(r6.cita).toContain("Peters AL");
    expect(r6.cita).not.toContain("{{{");
  });
  it("errata del autor: Control-IQ+ peso 9–200 kg, DTD 5–200 UI/día", () => {
    const ind = TABLAS.T1.filas.find((f) => f.etiqueta === "Indicación")!;
    expect(ind.celdas[1]).toContain("Control-IQ+: ≥ 2 años, peso 9–200 kg, DTD 5–200 UI/día");
    expect(todo).not.toContain("DTD 9–200 kg");
  });
});

describe("convenciones de escritura", () => {
  const todo = todoElTexto();
  it("siglas DM1/DM2 (nunca DT1/DT2), unidades en minúscula, sin «AIT»", () => {
    expect(todo).not.toMatch(/\bDT[12]\b/);
    expect(todo).not.toMatch(/mg\/dL|mmol\/L/);
    expect(todo).not.toMatch(/\bAIT\b/);
  });
  it("la bibliografía tiene 10 referencias, 9 con DOI", () => {
    expect(BIBLIOGRAFIA).toHaveLength(10);
    expect(BIBLIOGRAFIA.filter((r) => r.doi)).toHaveLength(9);
    for (const r of BIBLIOGRAFIA) if (r.doi) expect(r.cita).toContain(r.doi);
  });
  it("el glosario no repite siglas y todas llevan página", () => {
    expect(new Set(GLOSARIO.map((g) => g.sigla)).size).toBe(GLOSARIO.length);
    for (const g of GLOSARIO) expect(g.pagina).toBeGreaterThan(0);
  });
  it("las preguntas de ejemplo están marcadas como provisionales y apuntan a un apartado real", () => {
    for (const p of PREGUNTAS) {
      expect(p.provisional).toBe(true);
      expect(APARTADOS.some((a) => a.slug === p.apartado)).toBe(true);
      expect(p.correcta).toBeLessThan(p.opciones.length);
    }
  });
  it("los cambios llevan fecha ISO y hay pendientes visibles", () => {
    for (const c of CAMBIOS) expect(c.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(PENDIENTES.length).toBeGreaterThanOrEqual(3);
  });
});

describe("buscador", () => {
  it("normaliza tildes y mayúsculas", () => {
    expect(normalizar("Cetonemía β-OHB")).toBe("cetonemia β-ohb");
  });
  it("encuentra texto, tablas, figuras y siglas", () => {
    const r = buscar("cetonemia");
    expect(r.length).toBeGreaterThan(5);
    expect(buscar("computarizada").some((x) => x.entrada.tipo === "tabla")).toBe(true);
    expect(buscar("TITR").some((x) => x.entrada.tipo === "sigla")).toBe(true);
    expect(buscar("regla de oro").some((x) => x.entrada.tipo === "figura")).toBe(true);
  });
  it("exige todos los términos y devuelve ruta y página", () => {
    const r = buscar("glargina U-100");
    expect(r.length).toBeGreaterThan(0);
    for (const x of r) {
      expect(x.entrada.ruta).toMatch(/^#\//);
      expect(x.entrada.pagina).toBeGreaterThan(0);
    }
    expect(buscar("zzzz qqqq")).toHaveLength(0);
  });
  it("el índice cubre todos los párrafos del capítulo", () => {
    const parrafos = APARTADOS.flatMap((a) =>
      a.bloques.filter((b) => b.t === "p" || b.t === "lista" || b.t === "h3"),
    );
    expect(indice().filter((e) => e.tipo === "texto")).toHaveLength(parrafos.length);
  });
});
