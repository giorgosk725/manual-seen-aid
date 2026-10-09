/* Casos guiados: la pantalla (con un caso de prueba, sin contenido clínico) y, si en esta copia
   hay casos (src/casos-borrador, fuera del repositorio), que cada cita sea literal del
   capítulo y esté en la página que dice. */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { APARTADOS, FIGURA3, TABLAS } from "./contenido";
import { plano } from "./marcado";
import { CASOS, type Caso } from "./casos";
import { CasoVista } from "./pantallas/Casos";

const AXE = {
  rules: {
    region: { enabled: false },
    "page-has-heading-one": { enabled: false },
    "landmark-one-main": { enabled: false },
    "color-contrast": { enabled: false },
  },
};

const PRUEBA: Caso = {
  id: "prueba",
  titulo: "Caso de prueba",
  sistema: "Omnipod 5",
  temas: "prueba",
  paginas: "p. 8",
  escenario: "Escenario de prueba.",
  pasos: [
    {
      situacion: "",
      pregunta: "¿Primera pregunta?",
      opciones: [
        {
          texto: "Opción equivocada",
          tipo: "no",
          comentario: "No es lo que pide.",
          citas: [{ t: "Glucosa del sensor ≥250 mg/dl persistente ≥2 h.", p: 8, f: "Figura 3" }],
        },
        { texto: "Opción buena", tipo: "si", comentario: "Es lo que pide.", citas: [] },
      ],
    },
    {
      situacion: "Sigue así.",
      pregunta: "¿Segunda pregunta?",
      opciones: [{ texto: "La buena", tipo: "si", comentario: "Sí.", citas: [] }],
    },
  ],
  cierre: { texto: "Para recordar.", citas: [] },
};

describe("Casos guiados: la pantalla", () => {
  it("paso a paso: elegir enseña la respuesta con sus citas; al final, el marcador", async () => {
    const user = userEvent.setup();
    const { container } = render(<CasoVista caso={PRUEBA} />);
    expect(screen.getByText("Paso 1 de 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Opción equivocada/ }));
    expect(screen.getByText("No es lo que indica el capítulo.")).toBeInTheDocument();
    expect(
      screen.getByText(/Glucosa del sensor ≥250 mg\/dl persistente ≥2 h\./),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Ver/ })).toHaveAttribute(
      "href",
      "#/consultar/figura-3",
    );
    await user.click(screen.getByRole("button", { name: /Siguiente paso/ }));
    expect(screen.getByText("Paso 2 de 2")).toBeInTheDocument();
    expect(screen.getByText("Sigue así.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /La buena/ }));
    await user.click(screen.getByRole("button", { name: /Terminar el caso/ }));
    expect(screen.getByText("1 de 2 pasos a la primera.")).toBeInTheDocument();
    expect(screen.getByText("Para recordar.")).toBeInTheDocument();
    expect(await axe(container, AXE)).toHaveNoViolations();
  });

  it("«Ver todo» enseña todos los pasos con todas las respuestas", async () => {
    const user = userEvent.setup();
    render(<CasoVista caso={PRUEBA} />);
    await user.click(screen.getByRole("button", { name: "Ver todo" }));
    expect(screen.getByText("¿Segunda pregunta?")).toBeInTheDocument();
    expect(screen.getAllByText(/Es lo que indica el capítulo\./)).toHaveLength(2);
  });
});

describe("Casos guiados: las citas son literales (solo si hay casos en esta copia)", () => {
  it("cada cita está, tal cual, en la página que dice", () => {
    if (!CASOS.length) return;
    const corpus = new Map<number, string>();
    const limpio = (s: string) => s.replace(/\s+/g, " ").trim();
    const add = (p: number, t: string) => corpus.set(p, `${corpus.get(p) ?? ""} ${limpio(t)}`);
    const rango = (p: number, p2: number | undefined, t: string) => {
      for (let k = p; k <= (p2 ?? p); k++) add(k, t);
    };
    for (const a of APARTADOS)
      for (const b of a.bloques) {
        if (b.t === "p") rango(b.p, b.p2, plano((b.lead ? b.lead + " " : "") + b.texto));
        else if (b.t === "lista")
          rango(b.p, b.p2, plano([b.intro, ...b.items].filter(Boolean).join(" ")));
        else if (b.t === "h3") rango(b.p, undefined, b.texto);
      }
    for (const t of Object.values(TABLAS))
      rango(
        t.paginas[0],
        t.paginas[1],
        [t.titulo, ...t.filas.flatMap((f) => [f.etiqueta, ...f.celdas]), ...t.notas]
          .map(plano)
          .join(" "),
      );
    // Figura 3 (p. 8): todas sus cadenas.
    const cadenas: string[] = [];
    const recoger = (v: unknown) => {
      if (typeof v === "string") cadenas.push(plano(v));
      else if (Array.isArray(v)) v.forEach(recoger);
      else if (v && typeof v === "object") Object.values(v).forEach(recoger);
    };
    recoger(FIGURA3);
    add(8, cadenas.join(" "));
    const fallos: string[] = [];
    for (const c of CASOS) {
      const citas = [
        ...c.pasos.flatMap((pa) => pa.opciones.flatMap((o) => o.citas)),
        ...c.cierre.citas,
      ];
      for (const ci of citas)
        if (!(corpus.get(ci.p) ?? "").includes(limpio(ci.t)))
          fallos.push(`${c.id} · p. ${ci.p} · ${limpio(ci.t).slice(0, 80)}`);
    }
    expect(fallos).toEqual([]);
  });
});
