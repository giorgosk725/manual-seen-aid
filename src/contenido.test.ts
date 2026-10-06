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
import { CIFRAS } from "./contenido/cifras";
import { idDeBloque, posicionDeAncla } from "./contenido";
import { plano } from "./marcado";
import { FRAGMENTOS_EXTENDIDOS, textoDeFragmento } from "./extendida";
import { INFORMACION_PACIENTES, RESUMEN_CAPITULO } from "./pacientes/textos";

const normalizarEspacios = (s: string) => s.replace(/\s+/g, " ").trim();
import { CAMBIOS, NOTAS_AUTOR, PENDIENTES } from "./contenido/cambios";
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
        if ((b.t === "p" || b.t === "lista") && b.p2) expect(b.p2).toBe(b.p + 1);
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
  it("final 1/3 (5-10-2026): Control-IQ+ peso 9–200 kg, DTD 5–200 UI/día", () => {
    const ind = TABLAS.T1.filas.find((f) => f.etiqueta === "Indicación")!;
    expect(ind.celdas[1]).toContain("Control-IQ+: ≥ 2 años, peso 9–200 kg, DTD 5–200 UI/día");
    expect(todo).not.toContain("DTD 9–200 kg");
  });
  it("final 2/3 (5-10-2026): iSGLT2 sin umbral rebajado a 200 mg/dl", () => {
    expect(todo).toContain(
      "En personas tratadas con iSGLT2 —por indicación cardiorrenal o fuera de ficha técnica en la DM1— debe mantenerse una alta sospecha de cetoacidosis y medirse la cetonemia ante síntomas o situaciones de riesgo, con independencia del nivel de glucemia, ya que puede cursar con glucemia normal o solo moderadamente elevada.",
    );
    expect(todo).not.toContain("rebajar este umbral");
    const cifras = Object.values(CIFRAS).flat();
    expect(cifras.some((c) => c.etiqueta.includes("iSGLT2"))).toBe(false);
  });
  it("final 3/3 (5-10-2026): DOI al final de la referencia 6", () => {
    expect(BIBLIOGRAFIA.find((r) => r.n === 6)!.doi).toBe("10.2337/dci26-0122");
  });
  it("paginación de la maquetación del 5-10-2026", () => {
    const a7 = APARTADOS.find((a) => a.n === 7)!;
    const cap = a7.bloques.find((b) => "id" in b && b.id === "capacitacion")!;
    expect(cap.p).toBe(10);
    expect(TABLAS.T3.paginas).toEqual([11, 11]);
    const t3 = APARTADOS.flatMap((a) => a.bloques).find((b) => b.t === "tabla" && b.id === "T3")!;
    expect(t3.p).toBe(11);
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
    // La guía SED (sin DOI) enlaza al PDF de la SED.
    expect(BIBLIOGRAFIA.find((r) => r.n === 2)?.url).toMatch(/^https:\/\/www\.sediabetes\.org\//);
  });
  it("el glosario no repite siglas y todas llevan página", () => {
    expect(new Set(GLOSARIO.map((g) => g.sigla)).size).toBe(GLOSARIO.length);
    for (const g of GLOSARIO) expect(g.pagina).toBeGreaterThan(0);
  });
  it("el test: 10 preguntas del autor, pendientes de su validación, con citas literales del capítulo", () => {
    expect(PREGUNTAS).toHaveLength(10);
    for (const p of PREGUNTAS) {
      expect(p.validada, p.id).toBe(false);
      expect(p.opciones, p.id).toHaveLength(4);
      expect(p.correcta).toBeLessThan(p.opciones.length);
      const a = APARTADOS.find((x) => x.slug === p.apartado)!;
      expect(a, p.id).toBeTruthy();
      if (p.ancla)
        expect(
          a.bloques.some((b, i) => idDeBloque(b, i) === p.ancla),
          p.id,
        ).toBe(true);
      expect(p.citas.length, p.id).toBeGreaterThan(0);
      for (const c of p.citas) {
        const ap = APARTADOS.find((x) => x.slug === c.apartado)!;
        const i = ap.bloques.findIndex((b, k) => idDeBloque(b, k) === c.ancla);
        const b = ap.bloques[i];
        expect(b, `${p.id} ${c.ancla}`).toBeTruthy();
        const texto =
          b.t === "p"
            ? plano((b.lead ? b.lead + " " : "") + b.texto)
            : b.t === "lista"
              ? plano([b.intro, ...b.items].filter(Boolean).join(" "))
              : "";
        for (const trozo of c.texto.split(" […] ")) expect(texto, p.id).toContain(trozo);
        const p2 = "p2" in b && b.p2 ? b.p2 : b.p;
        expect(c.p, p.id).toBeGreaterThanOrEqual(b.p);
        expect(c.p, p.id).toBeLessThanOrEqual(p2);
      }
    }
  });
  it("los cambios llevan fecha ISO y hay pendientes visibles", () => {
    for (const c of CAMBIOS) expect(c.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(PENDIENTES.length).toBeGreaterThanOrEqual(3);
    // Lo del lector, corto y sin jerga interna; el detalle va en las notas para el autor.
    expect(PENDIENTES.length).toBeLessThanOrEqual(5);
    for (const p of PENDIENTES) expect(p).not.toMatch(/asistente-aid|E\d\d|auditoría/);
    expect(NOTAS_AUTOR.length).toBeGreaterThan(0);
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

describe("marcado en línea", () => {
  it("una negrita puede contener un asterisco literal (dosis con asterisco de la Figura 3)", async () => {
    const { trocear } = await import("./marcado");
    expect(trocear("puede considerarse **0,15 UI/kg\\* como dosis total de rescate**, no")).toEqual(
      [
        { t: "puede considerarse " },
        { t: "0,15 UI/kg* como dosis total de rescate", b: true },
        { t: ", no" },
      ],
    );
    expect(trocear("Si no existe plan específico: **0,1 UI/kg\\*** de insulina")).toEqual([
      { t: "Si no existe plan específico: " },
      { t: "0,1 UI/kg*", b: true },
      { t: " de insulina" },
    ]);
  });
});

describe("cifras del apartado y ampliación", () => {
  it("cada cifra apunta a una página del apartado y a un ancla existente", async () => {
    const { CIFRAS } = await import("./contenido/cifras");
    for (const [slug, lista] of Object.entries(CIFRAS)) {
      const a = APARTADOS.find((x) => x.slug === slug)!;
      expect(a, slug).toBeTruthy();
      for (const c of lista) {
        expect(c.p).toBeGreaterThanOrEqual(a.paginas[0]);
        expect(c.p).toBeLessThanOrEqual(a.paginas[1]);
        // Toda cifra lleva a su frase (bloque o subapartado), no al principio del apartado.
        expect(
          a.bloques.some((b, i) => idDeBloque(b, i) === c.ancla),
          `${slug} ${c.valor} → ${c.ancla}`,
        ).toBe(true);
      }
    }
  });
  it("la ampliación tiene los cuatro sistemas en el orden de las tablas y todas sus fuentes registradas", async () => {
    const { SISTEMAS_AMPLIACION, ORDEN_SISTEMAS, FUENTES, CRITERIOS } =
      await import("./ampliacion");
    expect(SISTEMAS_AMPLIACION.map((s) => s.id)).toEqual(ORDEN_SISTEMAS);
    expect(SISTEMAS_AMPLIACION.map((s) => s.name)).toEqual(TABLAS.T1.columnas);
    for (const s of SISTEMAS_AMPLIACION)
      for (const f of s.sources) expect(FUENTES[f], f).toBeTruthy();
    for (const c of CRITERIOS) for (const f of c.src) expect(FUENTES[f], f).toBeTruthy();
    const todo = JSON.stringify(SISTEMAS_AMPLIACION);
    expect(todo).not.toMatch(/\bDT[12]\b|mg\/dL|mmol\/L|\bAIT\b/);
  });
});

describe("cabeceras de sistema: solo texto del capítulo", () => {
  it("el algoritmo de cada sistema sale de la Tabla 1", async () => {
    const { algoritmoDelCapitulo } = await import("./contenido");
    expect([0, 1, 2, 3].map(algoritmoDelCapitulo)).toEqual([
      "SmartGuard: algoritmo de tipo PID + lógica difusa",
      "Control-IQ: algoritmo de tipo MPC",
      "CamAPS FX: algoritmo de tipo MPC adaptativo",
      "SmartAdjust: algoritmo de tipo MPC",
    ]);
  });
});

describe("diagramas a partir del texto", () => {
  it("cada diagrama aparece una vez en su apartado, con página dentro del apartado", async () => {
    const { DIAGRAMAS } = await import("./contenido/diagramas");
    expect(new Set(DIAGRAMAS.map((d) => d.id)).size).toBe(DIAGRAMAS.length);
    for (const d of DIAGRAMAS) {
      const a = APARTADOS.find((x) => x.slug === d.apartado)!;
      const bloques = a.bloques.filter((b) => b.t === "diagrama" && b.id === d.id);
      if (d.ancla) {
        // Posteriores a la 0.3.0: no son bloques; su ancla existe y alguna página es del apartado.
        expect(bloques, d.id).toHaveLength(0);
        expect(posicionDeAncla(a, d.ancla), d.id).toBeGreaterThanOrEqual(0);
        expect(
          d.paginas.some((p) => p >= a.paginas[0] && p <= a.paginas[1]),
          d.id,
        ).toBe(true);
      } else {
        expect(bloques, d.id).toHaveLength(1);
        expect(bloques[0].p).toBeGreaterThanOrEqual(a.paginas[0]);
        expect(bloques[0].p).toBeLessThanOrEqual(a.paginas[1]);
      }
    }
    const enApartados = APARTADOS.flatMap((a) => a.bloques.filter((b) => b.t === "diagrama"));
    expect(enApartados).toHaveLength(DIAGRAMAS.filter((d) => !d.ancla).length);
  });
  it("los diagramas nuevos solo usan frases literales del capítulo", async () => {
    const D = await import("./contenido/diagramas");
    const corpus = normalizarEspacios(
      [
        ...APARTADOS.flatMap((a) =>
          a.bloques.flatMap((b) =>
            b.t === "p"
              ? [plano((b.lead ? b.lead + " " : "") + b.texto)]
              : b.t === "lista"
                ? [plano([b.intro, ...b.items].filter(Boolean).join(" "))]
                : [],
          ),
        ),
        ...LISTA_TABLAS.flatMap((t) => [...t.notas, ...t.filas.flatMap((f) => f.celdas)]),
      ].join(" "),
    );
    const frases = [
      ...D.GESTACION_SISTEMAS.flat().map((x) => x.texto),
      ...D.GESTACION_COMUN.map((x) => x.texto),
      D.HOSPITAL.mantener.texto,
      ...D.HOSPITAL.noApropiada.items,
      D.HOSPITAL.noApropiada.intro,
      D.HOSPITAL.entonces.texto,
      ...D.HOSPITAL.pasos.map((x) => x.texto),
      D.HOSPITAL.mientras.texto,
      D.HOSPITAL.desdeIV.texto,
      ...D.INTERRUPCION_LINEA.tramos.map((x) => x.texto),
      ...D.INTERRUPCION_LINEA.detalles.map((x) => x.texto),
      D.INTERRUPCION_LINEA.formatos.pod,
      D.INTERRUPCION_LINEA.formatos.bomba,
      D.INTERRUPCION_LINEA.nota,
    ].filter((f) => f !== "—");
    for (const f of frases)
      for (const trozo of f.split(/(?<=\.) (?=[A-ZÁÉÍÓÚ])/))
        expect(corpus, trozo).toContain(normalizarEspacios(trozo.replace(/\.$/, "")));
    expect(D.EXPLORACIONES_ESTADO).toHaveLength(TABLAS.T6.filas.length);
  });
  it("la escala de cetonemia coincide con los tramos de la Figura 3", async () => {
    const { ESCALA_CETONEMIA } = await import("./contenido/diagramas");
    expect(ESCALA_CETONEMIA.tramos.map((t) => t.clave)).toEqual(FIGURA3.tramos.map((t) => t.clave));
    expect(ESCALA_CETONEMIA.tramos.map((t) => t.desde)).toEqual([0, 0.6, 1.0, 3.0]);
  });
  it("los algoritmos siguen el orden de columnas de la Tabla 1 y citan sus fragmentos", async () => {
    const { ALGORITMOS } = await import("./contenido/diagramas");
    expect(ALGORITMOS).toHaveLength(4);
    const t1 = JSON.stringify(TABLAS.T1);
    for (const a of ALGORITMOS) {
      expect(t1, a.autocorreccion).toContain(a.autocorreccion);
      if (a.prediccionH) expect(t1, a.prediccion).toContain(a.prediccion);
    }
  });
});

describe("capas fuera del capítulo", () => {
  it("versión extendida: solo fragmentos aprobados, con ancla real, convenciones y fuente", () => {
    expect(FRAGMENTOS_EXTENDIDOS).toHaveLength(33);
    expect(new Set(FRAGMENTOS_EXTENDIDOS.map((f) => f.id)).size).toBe(33);
    const sistemas = ["mm780", "ciq", "camaps", "op5"];
    for (const f of FRAGMENTOS_EXTENDIDOS) {
      const a = APARTADOS.find((x) => x.slug === f.donde.apartado)!;
      expect(a, f.id).toBeTruthy();
      expect(posicionDeAncla(a, f.donde.ancla), f.id).toBeGreaterThanOrEqual(0);
      for (const s of f.sistemas) expect(sistemas, f.id).toContain(s);
      expect(
        f.partes.some((p) => p && p.texto.length > 10),
        f.id,
      ).toBe(true);
      expect(f.relacion, f.id).toMatch(/p\./);
      // Ninguna parte arrastra la siguiente (un corte «hasta el final del párrafo» la duplicaría).
      const partes = f.partes.filter((p) => p !== null).map((p) => p!.texto);
      for (const [i, a] of partes.entries())
        for (const [j, b] of partes.entries())
          if (i !== j)
            expect(a.includes(b.slice(0, 60)), `${f.id} parte ${i} contiene ${j}`).toBe(false);
      const texto = textoDeFragmento(f);
      expect(texto, f.id).not.toMatch(/\bDT[12]\b|mg\/dL|mmol\/L|\bAIT\b|\bU\/día/);
    }
  });
  it("para el paciente: V5 en 13 preguntas y resumen en 6 párrafos, con las convenciones", () => {
    expect(INFORMACION_PACIENTES.secciones).toHaveLength(13);
    expect(INFORMACION_PACIENTES.secciones[0].pregunta).toBe("¿Qué es un sistema de asa cerrada?");
    expect(INFORMACION_PACIENTES.secciones.at(-1)!.pregunta).toBe("Mensaje final");
    expect(RESUMEN_CAPITULO.parrafos).toHaveLength(6);
    const todo = JSON.stringify({ INFORMACION_PACIENTES, RESUMEN_CAPITULO });
    expect(todo).not.toMatch(/\bDT[12]\b|mg\/dL|mmol\/L|\bAIT\b/);
    // Correcciones de la V5 frente a la maquetación del 30-9 (muestra); la del 5-10 ya las trae.
    expect(todo).toContain("una bomba (con tubo o catéter) o un pod (sin tubo externo)");
    expect(todo).toContain("Si la glucosa es >270 mg/dl, medir cetonas y revisar el set o el pod");
  });
  it("la búsqueda pone el capítulo primero y lo de fuera rotulado, detrás", () => {
    const res = buscar("Nightscout");
    expect(res.length).toBeGreaterThan(0);
    expect(
      res.every((r) => r.entrada.tipo === "extendida" || r.entrada.tipo === "ampliacion"),
    ).toBe(true);
    const mezcla = buscar("glargina");
    const primeraFuera = mezcla.findIndex((r) => r.entrada.pagina === 0);
    if (primeraFuera >= 0)
      expect(mezcla.slice(primeraFuera).every((r) => r.entrada.pagina === 0)).toBe(true);
  });
});
