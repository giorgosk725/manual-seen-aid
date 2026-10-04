/* Tarjetas de repaso (0.7.0): que salgan del capítulo tal cual, el repaso espaciado y la
   pantalla. */
import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { CIFRAS } from "./contenido/cifras";
import { GLOSARIO } from "./contenido";
import { APRENDIDA, TARJETAS, calificar, mazo, resumen, ronda, sumarDias } from "./repaso";
import { useRepaso } from "./prefs";
import { Repaso } from "./pantallas/Repaso";

const HOY = "2026-10-04";

describe("tarjetas: el texto del capítulo, tal cual", () => {
  it("una por pregunta de cifra y una por sigla desarrollada, sin repetir identificador", () => {
    const preguntas = new Set(
      Object.entries(CIFRAS).flatMap(([slug, l]) => l.map((c) => `${slug}/${c.etiqueta}`)),
    );
    const desarrolladas = GLOSARIO.filter((g) => !/no desarrollada/.test(g.desarrollo));
    expect(mazo("cifras")).toHaveLength(preguntas.size);
    expect(mazo("siglas")).toHaveLength(desarrolladas.length);
    expect(new Set(TARJETAS.map((t) => t.id)).size).toBe(TARJETAS.length);
  });
  it("pregunta y respuesta son la etiqueta y el valor (o la sigla y su desarrollo), con su página", () => {
    for (const [slug, lista] of Object.entries(CIFRAS))
      for (const c of lista) {
        const t = TARJETAS.find((x) => x.id === `c/${slug}/${c.etiqueta}`)!;
        expect(t.pregunta).toBe(c.etiqueta);
        expect(t.respuesta).toContain(c.valor);
        expect(t.pagina).toBe(c.p);
      }
    // Las tres de «necesidad clínica no cubierta» (p. 5) van en una sola tarjeta.
    const nc = TARJETAS.find((x) => x.id === "c/06-indicaciones/necesidad clínica no cubierta");
    expect(nc?.respuesta).toBe("TIR < 70 % · TBR ≥ 4 % · TAR > 250 ≥ 5 %");
    for (const g of GLOSARIO.filter((x) => !/no desarrollada/.test(x.desarrollo))) {
      const t = TARJETAS.find((x) => x.id === `s/${g.sigla}`)!;
      expect([t.pregunta, t.respuesta, t.pagina]).toEqual([g.sigla, g.desarrollo, g.pagina]);
    }
  });
  it("las dosis con asterisco de la Figura 3 se marcan (la respuesta lleva su nota)", () => {
    const conAsterisco = TARJETAS.filter((t) => t.asterisco);
    expect(conAsterisco.length).toBeGreaterThan(0);
    for (const t of conAsterisco) expect(t.respuesta).toContain("*");
  });
  it("el mazo de un apartado son sus cifras", () => {
    const etiquetas = new Set(CIFRAS["07-educacion"].map((c) => c.etiqueta));
    expect(mazo("07-educacion").map((t) => t.pregunta)).toEqual([...etiquetas]);
    expect(mazo("no-existe")).toEqual([]);
  });
});

describe("repaso espaciado", () => {
  it("lo recordado sube de caja y vuelve a 1, 3, 7, 16 y 35 días", () => {
    let p = {};
    const fechas: string[] = [];
    for (let i = 0; i < 6; i++) {
      p = calificar(p, "x", true, HOY);
      fechas.push((p as Record<string, { proxima: string }>).x.proxima);
    }
    expect(fechas).toEqual([
      "2026-10-05",
      "2026-10-07",
      "2026-10-11",
      "2026-10-20",
      "2026-11-08",
      "2026-11-08",
    ]);
  });
  it("lo olvidado vuelve a la caja 1 y toca hoy; acertarlo en la misma ronda no lo sube", () => {
    const p = { x: { caja: 4, proxima: HOY } };
    const fallo = calificar(p, "x", false, HOY);
    expect(fallo.x).toEqual({ caja: 1, proxima: HOY });
    expect(calificar(fallo, "x", true, HOY, { repetida: true }).x).toEqual({
      caja: 1,
      proxima: "2026-10-05",
    });
  });
  it("las fechas cruzan meses y años", () => {
    expect(sumarDias("2026-12-30", 3)).toBe("2027-01-02");
  });
  it("la ronda pone primero lo atrasado y luego nuevas, con sus límites", () => {
    const lista = mazo("siglas");
    const [a, b, c] = lista;
    const p = {
      [a.id]: { caja: 2, proxima: "2026-10-03" },
      [b.id]: { caja: 1, proxima: "2026-10-01" },
      [c.id]: { caja: 3, proxima: "2026-10-09" },
    };
    const r = ronda(lista, p, HOY, { nuevas: 3, max: 20 });
    expect(r.map((t) => t.id).slice(0, 2)).toEqual([b.id, a.id]);
    expect(r).toHaveLength(5);
    expect(r.some((t) => t.id === c.id)).toBe(false);
    expect(ronda(lista, {}, HOY, { nuevas: 50, max: 7 })).toHaveLength(7);
  });
  it("el resumen cuenta lo de hoy, lo nuevo y lo aprendido", () => {
    const lista = mazo("siglas");
    const p = {
      [lista[0].id]: { caja: APRENDIDA, proxima: "2026-10-20" },
      [lista[1].id]: { caja: 1, proxima: HOY },
    };
    expect(resumen(lista, p, HOY)).toEqual({
      total: lista.length,
      paraHoy: 1,
      sinVer: lista.length - 2,
      aprendidas: 1,
    });
  });
});

describe("pantalla de tarjetas", () => {
  afterEach(() => localStorage.clear());
  it("el progreso guardado se valida (lo que no tiene forma se ignora)", () => {
    function Ver() {
      return <p>{Object.keys(useRepaso()).join(",")}</p>;
    }
    localStorage.setItem(
      "mseen:repaso",
      JSON.stringify({
        "s/AID": { caja: 2, proxima: HOY },
        "s/MCG": { caja: 9, proxima: HOY },
        "s/TIR": { caja: 1, proxima: "mañana" },
        "s/TBR": "basura",
      }),
    );
    render(<Ver />);
    expect(screen.getByText("s/AID")).toBeInTheDocument();
  });
  it("muestra la respuesta con su página, guarda la respuesta y pasa a la siguiente", async () => {
    const { container } = render(<Repaso filtro="siglas" />);
    expect(screen.getByText("1 de 10")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar la respuesta" }));
    const primera = mazo("siglas")[0];
    expect(screen.getByText(primera.respuesta)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Verla en el glosario \(p\. \d+\)/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Sí/ }));
    expect(screen.getByText("2 de 10")).toBeInTheDocument();
    const guardado = JSON.parse(localStorage.getItem("mseen:repaso")!);
    expect(guardado[primera.id].caja).toBe(1);
    // «No» la pone al final de la ronda.
    fireEvent.click(screen.getByRole("button", { name: "Mostrar la respuesta" }));
    fireEvent.click(screen.getByRole("button", { name: /^No/ }));
    expect(screen.getByText("3 de 11")).toBeInTheDocument();
  });
  it("una cifra con asterisco enseña la nota de la Figura 3", () => {
    const t = TARJETAS.find((x) => x.asterisco)!;
    // Solo esa tarjeta pendiente: las demás del apartado, ya vistas y para dentro de un mes.
    const p = Object.fromEntries(
      mazo(t.apartado)
        .filter((x) => x.id !== t.id)
        .map((x) => [x.id, { caja: 5, proxima: "2026-12-31" }]),
    );
    localStorage.setItem("mseen:repaso", JSON.stringify(p));
    render(<Repaso filtro={t.apartado} />);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar la respuesta" }));
    expect(screen.getByText(/Dosis orientativas/)).toBeInTheDocument();
  });
});
