/* Regresiones de la auditoría del 3-10-2026 (0.5.0): preferencias que no rompen la app,
   límites de búsqueda por grupo, remisiones internas que llevan a su sitio y marcas
   «Difiere del capítulo» con la frase literal del capítulo. */
import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { APARTADOS, TABLAS, idDeBloque } from "./contenido";
import { buscar, buscarConTotales, fueraDelCapitulo, tramoDeConsulta } from "./buscador";
import { PATRON_REMISION, destinoDeRemision } from "./remisiones";
import { DIFIERE_CAMPO, DIFIERE_PARAM, SISTEMAS_AMPLIACION } from "./ampliacion";
import { useFavoritos, useLeidos, useUltimo, restablecerPreferencias } from "./prefs";

function Lector() {
  const leidos = useLeidos();
  const favoritos = useFavoritos();
  const ultimo = useUltimo();
  return (
    <p>
      {leidos.length}·{favoritos.map((f) => f.ruta).join(",")}·{ultimo?.ruta ?? "nada"}
    </p>
  );
}

describe("preferencias de lectura", () => {
  afterEach(() => localStorage.clear());
  it("un valor con forma inesperada vale el defecto y no rompe la pantalla", () => {
    localStorage.setItem("mseen:leidos", "{}");
    localStorage.setItem("mseen:favoritos", "null");
    localStorage.setItem("mseen:ultimo", '{"ruta":42}');
    render(<Lector />);
    expect(screen.getByText("0··nada")).toBeInTheDocument();
  });
  it("solo se aceptan rutas internas de la app", () => {
    localStorage.setItem(
      "mseen:favoritos",
      JSON.stringify([
        { ruta: "#/capitulo/01-introduccion", titulo: "1" },
        { ruta: "javascript:alert(1)", titulo: "x" },
        "basura",
      ]),
    );
    render(<Lector />);
    expect(screen.getByText("0·#/capitulo/01-introduccion·nada")).toBeInTheDocument();
  });
  it("restablecer borra solo las claves de la app", () => {
    localStorage.setItem("mseen:night", "1");
    localStorage.setItem("otra-app", "x");
    restablecerPreferencias();
    expect(localStorage.getItem("mseen:night")).toBeNull();
    expect(localStorage.getItem("otra-app")).toBe("x");
  });
});

describe("búsqueda con límite por grupo", () => {
  it("las búsquedas frecuentes también enseñan lo de fuera del capítulo", () => {
    for (const q of ["insulina", "sistema", "hipoglucemia"]) {
      const { resultados, totalCapitulo, totalFuera } = buscarConTotales(q, 60, 20);
      const fuera = resultados.filter((r) => fueraDelCapitulo(r.entrada));
      expect(totalFuera, q).toBeGreaterThan(0);
      expect(fuera.length, q).toBe(Math.min(20, totalFuera));
      expect(resultados.length - fuera.length, q).toBe(Math.min(60, totalCapitulo));
    }
  });
  it("sin coincidencia con todas las palabras, busca con alguna y lo dice", () => {
    const r = buscarConTotales("resonancia 780G zzzz");
    expect(r.parcial).toBe(true);
    expect(r.resultados.length).toBeGreaterThan(0);
    expect(buscarConTotales("resonancia").parcial).toBe(false);
  });
  it("una cifra de β-OHB lleva a su tramo de la Figura 3", () => {
    expect(tramoDeConsulta("β-OHB 1,2")?.clave).toBe("naranja");
    expect(tramoDeConsulta("cetonemia 0,8")?.clave).toBe("amarillo");
    expect(tramoDeConsulta("cetonas 3")?.clave).toBe("rojo");
    expect(tramoDeConsulta("b-OHB 0.4")?.clave).toBe("verde");
    expect(tramoDeConsulta("modo sueño")).toBeNull();
  });
  it("el capítulo va siempre delante", () => {
    const r = buscar("insulina", 10, 5);
    const primeraFuera = r.findIndex((x) => fueraDelCapitulo(x.entrada));
    expect(primeraFuera).toBe(10);
  });
});

describe("remisiones internas del capítulo", () => {
  it("cada «Tabla N», «Figura N» y «v. «…»» de los párrafos lleva a su sitio", () => {
    let n = 0;
    for (const a of APARTADOS)
      for (const b of a.bloques) {
        const textos = b.t === "p" ? [b.texto] : b.t === "lista" ? [b.intro ?? "", ...b.items] : [];
        for (const t of textos)
          for (const parte of t.split(PATRON_REMISION).filter((_, i) => i % 2 === 1)) {
            n++;
            expect(destinoDeRemision(parte), `${a.slug}: ${parte}`).not.toBeNull();
          }
      }
    expect(n).toBeGreaterThan(10);
  });
  it("la Figura 3 es el bloque b5 del apartado 7", () => {
    const a = APARTADOS.find((x) => x.slug === "07-educacion")!;
    const i = a.bloques.findIndex((b) => b.t === "figura" && b.id === "F3");
    expect(idDeBloque(a.bloques[i], i)).toBe("b5");
    expect(destinoDeRemision("Figura 3")).toBe("#/capitulo/07-educacion/b5");
  });
});

describe("ampliación: lo que difiere del capítulo", () => {
  const t1 = TABLAS.T1;
  const literalDeT1 = (frase: string) =>
    t1.filas.some((f) => f.celdas.some((c) => c.replace(/\n/g, " ").startsWith(frase))) ||
    t1.filas.some((f) => f.celdas.some((c) => c.includes(frase))) ||
    (t1.notas ?? []).some((n) => n.includes(frase));
  it("cada marca cita una frase literal de la Tabla 1", () => {
    const todas = [
      ...Object.values(DIFIERE_CAMPO).flatMap((m) => Object.values(m ?? {})),
      ...Object.values(DIFIERE_PARAM).flatMap((m) => Object.values(m ?? {})),
    ];
    expect(todas.length).toBeGreaterThan(0);
    for (const d of todas) expect(literalDeT1(d.capitulo), d.capitulo).toBe(true);
  });
  it("las marcas apuntan a campos y parámetros que existen", () => {
    for (const [id, campos] of Object.entries(DIFIERE_CAMPO)) {
      const s = SISTEMAS_AMPLIACION.find((x) => x.id === id)!;
      for (const k of Object.keys(campos ?? {})) expect(s.detail, `${id}.${k}`).toHaveProperty(k);
    }
    for (const [id, params] of Object.entries(DIFIERE_PARAM)) {
      const s = SISTEMAS_AMPLIACION.find((x) => x.id === id)!;
      for (const k of Object.keys(params ?? {}))
        expect(
          s.params.some((p) => p.name === k),
          `${id}: ${k}`,
        ).toBe(true);
    }
  });
});
