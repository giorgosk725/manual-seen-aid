/* Pantallas: la portada, un apartado con tabla, el recorrido de la Figura 3, el filtro por
   sistema, la paleta de búsqueda y el test. Más una auditoría axe (sin contraste: jsdom). */
import { describe, expect, it, vi } from "vitest";
import { render, screen, within, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import App from "./App";
import { BIBLIOGRAFIA } from "./contenido";

/* Navega y espera a que la pantalla (perezosa, React.lazy) haya llegado. */
/* 0.72.0: las cifras con unidad van en <b className="cifra">: el texto literal queda repartido
   entre nodos. Busca el elemento más interno cuyo texto completo cumple la expresión. */
const enTexto = (re: RegExp) => (_: string, el: Element | null) =>
  !!el &&
  re.test(el.textContent ?? "") &&
  ![...el.children].some((c) => re.test(c.textContent ?? ""));

const ir = async (hash: string) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  await waitFor(() => expect(document.querySelector("[data-cargando]")).toBeNull());
};

const AXE = {
  rules: {
    region: { enabled: false },
    "page-has-heading-one": { enabled: false },
    "landmark-one-main": { enabled: false },
    "landmark-unique": { enabled: false },
    "heading-order": { enabled: false },
    "color-contrast": { enabled: false },
  },
};

describe("App", () => {
  it("la portada: título del capítulo tal cual y el autor, sin subtítulo ni la Sociedad", () => {
    render(<App />);
    // El título del capítulo tal cual (0.72.2: sin subtítulo; la cabecera ya dice qué es).
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Tratamiento insulínico del paciente con diabetes mellitus tipo 1: automatización de la insulinoterapia/i,
    );
    expect(screen.queryByText(/Facilita su lectura, comprensión y consulta/)).toBeNull();
    expect(screen.queryByText(/evaluación editorial/)).toBeNull();
    // Sin las dos puertas (decisión del 13-10-2026).
    expect(screen.queryByRole("navigation", { name: "Dos formas de uso" })).toBeNull();
    expect(screen.getAllByText(/Georgios Kyriakos/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sociedad Española de Endocrinología y Nutrición/)).toBeNull();
  });

  it("un apartado muestra su texto íntegro, la página de origen y la tabla", async () => {
    render(<App />);
    await ir("#/capitulo/04-sistemas");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Sistemas AID comercializados en España",
    );
    // «del capítulo» va en su propio elemento (en el móvil solo se ven las páginas).
    expect(
      screen.getAllByText(/^pp\. 3–4$/).some((el) => el.textContent === "pp. 3–4 del capítulo"),
    ).toBe(true);
    expect(screen.getByRole("table", { name: /Tabla 1/ })).toBeInTheDocument();
    expect(screen.getAllByText(/peso 9–200 kg, DTD 5–200 UI\/día/).length).toBeGreaterThan(0);
  });

  it("la Figura 3 como recorrido muestra solo la rama elegida", async () => {
    render(<App />);
    await ir("#/consultar/figura-3");
    // 0.70.0: sin rama elegida no hay recuadro vacío; sí los cuatro tramos.
    expect(screen.getByRole("group", { name: "Tramo de cetonemia" })).toBeInTheDocument();
    const desplazar = vi.spyOn(Element.prototype, "scrollIntoView");
    await userEvent.click(screen.getByRole("button", { name: /^β-OHB 1,0-2,9 mmol\/l/ }));
    expect(screen.getByText(/0,1 UI\/kg/)).toBeInTheDocument();
    // Al elegir, va a la rama (en el siguiente fotograma): se espera, no queda suelto (V54-04).
    await waitFor(() => expect(desplazar).toHaveBeenCalledWith({ block: "start" }));
    desplazar.mockRestore();
    // La rama roja no se abre. 0.72.1 (decisión del responsable, A01 revisada): sin el recuadro
    // de urgencia junto a la rama abierta; la rama roja, a un toque en el selector.
    expect(screen.queryByText("Hidratación según glucemia, si la tolera.")).not.toBeInTheDocument();
    expect(
      screen.queryAllByRole("region", { name: /^Urgencia y signos de gravedad \(Figura 3\)/ }),
    ).toHaveLength(0);
    expect(screen.getByRole("button", { name: /^β-OHB ≥3,0 mmol\/l/ })).toBeInTheDocument();
    expect(window.location.hash).toBe("#/consultar/figura-3/naranja");
  });

  it("la Tabla 1 se filtra por sistema (un sistema = ficha)", async () => {
    render(<App />);
    await ir("#/consultar/tablas/T1");
    const grupo = screen.getByRole("group", { name: /Filtrar por sistema/ });
    await userEvent.click(within(grupo).getByRole("button", { name: /Omnipod 5/ }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText(enTexto(/sin peso mínimo; DTD ≥ 5 UI\/día/))).toBeInTheDocument();
    expect(screen.queryByText(/Guardian 4/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Los cuatro/ }));
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("la paleta de búsqueda (Ctrl K) encuentra texto literal con su página", async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const caja = within(await screen.findByRole("dialog")).getByLabelText("Buscar en el capítulo");
    await userEvent.type(caja, "regla del 450");
    const lista = await screen.findByRole("list", { name: "Resultados" });
    expect(
      (await within(lista).findAllByText(/p\. 10/, {}, { timeout: 5000 })).length,
    ).toBeGreaterThan(0);
  });

  it("el test razona la respuesta con la explicación del autor y el capítulo", async () => {
    render(<App />);
    await ir("#/test");
    expect(screen.queryByText(/Pendiente de validación/)).toBeNull();
    expect(screen.queryByText(/Provisional · ejemplo/)).toBeNull();
    // q02 y q03, de vuelta con las correcciones decididas por el autor (13-10-2026).
    expect(screen.getByText(/TAR 26,7 %/)).toBeInTheDocument();
    expect(screen.queryByText(/deben ofrecerse como modalidad preferente/)).toBeNull();
    await userEvent.click(
      screen.getByRole("button", {
        name: /Persisten retos como el predominio de sistemas híbridos/,
      }),
    );
    expect(screen.getByText(/^Correcto\./)).toBeInTheDocument();
    expect(screen.getByText(/Lo que dice el capítulo/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Leer en el apartado 12/ })).toHaveAttribute(
      "href",
      "#/capitulo/12-horizonte/b2",
    );
  });

  it("para el paciente: el PDF, el plan de seguridad sin campos y la hoja de pruebas", async () => {
    render(<App />);
    // 0.70.0: sin la información en pantalla (el PDF la tiene); la ruta antigua lleva a la pantalla.
    await ir("#/pacientes/informacion");
    expect(screen.queryByText("¿Qué es un sistema de asa cerrada?")).toBeNull();
    expect(screen.getByRole("link", { name: /Información para pacientes/ })).toHaveAttribute(
      "href",
      expect.stringMatching(/pdf\/manual-seen-aid-pacientes\.pdf$/),
    );
    await ir("#/pacientes/plan/op5");
    // Que no es una publicación del Manual SEEN, en el pie.
    expect(screen.getByText(/no es una publicación del Manual/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Plan de seguridad · Omnipod 5" }),
    ).toBeInTheDocument();
    // La hoja se rellena a mano: no hay ni un campo de texto.
    expect(document.querySelectorAll("main input, main textarea")).toHaveLength(0);
    expect(screen.getAllByText(/Función Actividad/).length).toBeGreaterThan(0);
    // La segunda cara: la hoja de cetonas.
    expect(
      screen.getByRole("heading", { level: 2, name: "Cetonas: qué hacer según el resultado" }),
    ).toBeInTheDocument();
  });

  it("las hojas breves (extractos del PDF) ya no están: la ruta lleva a la pantalla", async () => {
    render(<App />);
    await ir("#/pacientes/hoja/glucosa");
    expect(
      screen.getByRole("heading", { level: 1, name: "Material para el paciente" }),
    ).toBeInTheDocument();
  });

  it("la versión extendida no se muestra (ni en la lectura ni en las fichas)", async () => {
    render(<App />);
    await ir("#/capitulo/12-horizonte");
    expect(screen.queryByText("Versión extendida · no publicada en el Manual")).toBeNull();
    await ir("#/sistemas/op5");
    expect(screen.queryByText("Versión extendida · no publicada en el Manual")).toBeNull();
  });

  it("los diagramas nuevos se muestran en su apartado sin mover las anclas", async () => {
    render(<App />);
    await ir("#/capitulo/10-situaciones");
    expect(document.getElementById("d-gestacion-sistemas")).not.toBeNull();
    expect(document.getElementById("d-hospital")).not.toBeNull();
    expect(document.getElementById("d-exploraciones")).not.toBeNull();
    expect(document.getElementById("b36")).not.toBeNull();
  });

  it("la ficha completa es solo del capítulo: sin la ampliación técnica (A06)", async () => {
    render(<App />);
    await ir("#/sistemas/op5/completa");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Omnipod 5");
    expect(
      screen.getByRole("heading", { name: /^Indicación y material · Omnipod 5/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Parámetros · Omnipod 5/ })).toBeInTheDocument();
    expect(screen.queryByText(/Ampliación técnica · fuera del capítulo/)).toBeNull();
    expect(screen.queryByText(/Insulinas rápidas compatibles/)).toBeNull();
    expect(screen.getAllByText(enTexto(/sin peso mínimo; DTD ≥ 5 UI\/día/)).length).toBeGreaterThan(
      0,
    );
  });

  it("Situación y sistema muestra la celda literal de la Tabla 4", async () => {
    render(<App />);
    await ir("#/consultar/situacion/comida-grasa:control-iq");
    expect(
      screen.getByText(enTexto(/bolo extendido \(hasta 2 h; Control-IQ\+: de 15 min a 8 h\)/)),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Función comida de absorción lenta/)).not.toBeInTheDocument();
  });

  it("Interpretación de la descarga abre el paso 8 y enlaza a la Figura 3", async () => {
    render(<App />);
    await ir("#/consultar/descarga/8");
    expect(screen.getByRole("heading", { level: 2, name: /Bandera roja/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Aplicar la Figura 3/ })).toHaveAttribute(
      "href",
      "#/consultar/figura-3",
    );
  });

  it("Figuras y diagramas, en una pantalla, sin tablas ni sistemas ni los retirados", async () => {
    render(<App />);
    await ir("#/visual");
    expect(
      screen.getByRole("heading", { level: 1, name: "Figuras y diagramas" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Ampliar/ }).length).toBe(4);
    expect(screen.getByRole("link", { name: /Glucemia y ejercicio/ })).toHaveAttribute(
      "href",
      "#/visual/ejercicio",
    );
    for (const fuera of [
      /Elección compartida/,
      /Transición desde MDI/,
      /Exploraciones/,
      /Escala de cetonemia/,
      /Algoritmos de control/,
      /criterios para no continuar/,
    ])
      expect(screen.queryByRole("link", { name: fuera })).toBeNull();
    expect(screen.queryByRole("region", { name: "Tablas" })).toBeNull();
    expect(screen.queryByRole("region", { name: "Sistemas" })).toBeNull();
    expect(screen.queryByText(/Fotos oficiales de producto/)).toBeNull();
  });

  it("un diagrama a pantalla completa enlaza a su lugar en el capítulo", async () => {
    render(<App />);
    await ir("#/visual/ejercicio");
    expect(
      screen.getByRole("heading", { level: 2, name: "Glucemia y ejercicio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/se recomienda iniciar el ejercicio con una glucemia de 126–180 mg\/dl/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Leer en el capítulo: 10\./ }).getAttribute("href"),
    ).toMatch(/^#\/capitulo\/10-situaciones\/b\d+$/);
  });

  it("el apartado lista sus tablas, figuras y diagramas", async () => {
    render(<App />);
    await ir("#/capitulo/08-iniciacion");
    const nav = screen.getByRole("navigation", { name: "Recursos visuales del apartado" });
    for (const t of ["Tabla 2", "Tabla 3", "Tabla 4", "Calendario de seguimiento"])
      expect(within(nav).getByText(t)).toBeInTheDocument();
  });

  it("el modo nocturno se activa y se guarda", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Modo nocturno" }));
    expect(document.documentElement).toHaveClass("night");
    expect(window.localStorage.getItem("mseen:night")).toBe("1");
  });

  it("portada y un apartado sin violaciones axe", async () => {
    const { container } = render(<App />);
    expect(await axe(container, AXE)).toHaveNoViolations();
    await ir("#/capitulo/07-educacion");
    expect(await axe(container, AXE)).toHaveNoViolations();
  }, 30000);

  it("«Capítulo entero» lleva también la bibliografía (V50-03)", async () => {
    render(<App />);
    await ir("#/capitulo/todo");
    const bib = await waitFor(() => {
      const a = document.getElementById("todo-bibliografia");
      expect(a).not.toBeNull();
      return a!;
    });
    expect(within(bib).getAllByRole("listitem")).toHaveLength(BIBLIOGRAFIA.length);
  }, 30000);
});
