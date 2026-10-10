/* Pantallas: la portada, un apartado con tabla, el recorrido de la Figura 3, el filtro por
   sistema, la paleta de búsqueda y el test. Más una auditoría axe (sin contraste: jsdom). */
import { describe, expect, it } from "vitest";
import { render, screen, within, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import App from "./App";

/* Navega y espera a que la pantalla (perezosa, React.lazy) haya llegado. */
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
  it("la portada muestra el título completo del capítulo y el autor, sin la Sociedad", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Tratamiento insulínico del paciente con diabetes mellitus tipo 1: automatización de la insulinoterapia/i,
    );
    expect(screen.getAllByText(/Georgios Kyriakos/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sociedad Española de Endocrinología y Nutrición/)).toBeNull();
  });

  it("un apartado muestra su texto íntegro, la página de origen y la tabla", async () => {
    render(<App />);
    await ir("#/capitulo/04-sistemas");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Sistemas AID comercializados en España",
    );
    expect(screen.getByText(/pp\. 3–4 del capítulo/)).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /Tabla 1/ })).toBeInTheDocument();
    expect(screen.getAllByText(/peso 9–200 kg, DTD 5–200 UI\/día/).length).toBeGreaterThan(0);
  });

  it("la Figura 3 como recorrido muestra solo la rama elegida", async () => {
    render(<App />);
    await ir("#/consultar/figura-3");
    expect(screen.getByText(/Elige un tramo de β-OHB/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /^β-OHB 1,0-2,9 mmol\/l/ }));
    expect(screen.getByText(/0,1 UI\/kg/)).toBeInTheDocument();
    expect(
      screen.queryByText(/URGENCIAS \/ VALORACIÓN HOSPITALARIA INMEDIATA/),
    ).not.toBeInTheDocument();
    expect(window.location.hash).toBe("#/consultar/figura-3/naranja");
  });

  it("la Tabla 1 se filtra por sistema (un sistema = ficha)", async () => {
    render(<App />);
    await ir("#/consultar/tablas/T1");
    const grupo = screen.getByRole("group", { name: /Filtrar por sistema/ });
    await userEvent.click(within(grupo).getByRole("button", { name: /Omnipod 5/ }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText(/sin peso mínimo; DTD ≥ 5 UI\/día/)).toBeInTheDocument();
    expect(screen.queryByText(/Guardian 4/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Los cuatro/ }));
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("la paleta de búsqueda (Ctrl K) encuentra texto literal con su página", async () => {
    render(<App />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const caja = await screen.findByLabelText("Buscar en el capítulo");
    await userEvent.type(caja, "regla del 450");
    const lista = await screen.findByRole("list", { name: "Resultados" });
    expect(within(lista).getAllByText(/p\. 10/).length).toBeGreaterThan(0);
  });

  it("el test razona la respuesta con la explicación del autor y el capítulo", async () => {
    render(<App />);
    await ir("#/test");
    expect(screen.queryByText(/Pendiente de validación/)).toBeNull();
    expect(screen.queryByText(/Provisional · ejemplo/)).toBeNull();
    await userEvent.click(
      screen.getByRole("button", {
        name: /Revisar hipoglucemias y sobretratamiento, y reducir el TBR/,
      }),
    );
    expect(screen.getByText(/^Correcto\./)).toBeInTheDocument();
    expect(screen.getByText(/Lo que dice el capítulo/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Leer en el apartado 5/ })).toHaveAttribute(
      "href",
      "#/capitulo/05-resultados/b2",
    );
  });

  it("para el paciente: información V5, resumen y plan de seguridad sin campos", async () => {
    render(<App />);
    await ir("#/pacientes/informacion");
    expect(screen.getByText("¿Qué es un sistema de asa cerrada?")).toBeInTheDocument();
    await ir("#/pacientes/plan/op5");
    expect(screen.getByText(/Plan de seguridad · Omnipod 5/)).toBeInTheDocument();
    // La hoja se rellena a mano: no hay ni un campo de texto.
    expect(document.querySelectorAll("main input, main textarea")).toHaveLength(0);
    expect(screen.getAllByText(/Función Actividad/).length).toBeGreaterThan(0);
  });

  it("las hojas breves para el paciente son extractos literales de la Información", async () => {
    render(<App />);
    await ir("#/pacientes/hoja/glucosa");
    expect(
      screen.getByRole("heading", { level: 1, name: "Si la glucosa baja, o sube y no baja" }),
    ).toBeInTheDocument();
    for (const q of [
      "¿Qué hacer si se tiene hipoglucemia?",
      "¿Qué hacer si la glucosa está alta y no baja?",
      "¿Cuándo se debe acudir a urgencias?",
    ])
      expect(screen.getByRole("heading", { level: 2, name: q })).toBeInTheDocument();
    expect(
      screen.getAllByText(/sospechar fallo de infusión hasta demostrar lo contrario/).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("¿Qué es un sistema de asa cerrada?")).toBeNull();
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

  it("la ficha de un sistema separa el capítulo de la ampliación del autor", async () => {
    render(<App />);
    await ir("#/sistemas/op5/completa");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Omnipod 5");
    expect(screen.getByRole("heading", { name: /^Lo esencial · Omnipod 5/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Parámetros · Omnipod 5/ })).toBeInTheDocument();
    expect(screen.getByText(/Ampliación técnica · fuera del capítulo/)).toBeInTheDocument();
    expect(screen.getAllByText(/sin peso mínimo; DTD ≥ 5 UI\/día/).length).toBeGreaterThan(0);
  });

  it("Situación y sistema muestra la celda literal de la Tabla 4", async () => {
    render(<App />);
    await ir("#/consultar/situacion/comida-grasa:control-iq");
    expect(
      screen.getByText(/bolo extendido \(hasta 2 h; Control-IQ\+: de 15 min a 8 h\)/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Función comida de absorción lenta/)).not.toBeInTheDocument();
  });

  it("Revisar la descarga abre el paso 8 y enlaza a la Figura 3", async () => {
    render(<App />);
    await ir("#/consultar/descarga/8");
    expect(screen.getByRole("heading", { level: 2, name: /Bandera roja/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Aplicar la Figura 3/ })).toHaveAttribute(
      "href",
      "#/consultar/figura-3",
    );
  });

  it("Figuras y diagramas reúne diagramas, figuras, tablas y sistemas, y filtra", async () => {
    render(<App />);
    await ir("#/visual");
    expect(
      screen.getByRole("heading", { level: 1, name: "Figuras y diagramas" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Escala de cetonemia/ })).toHaveAttribute(
      "href",
      "#/visual/cetonemia",
    );
    expect(screen.getAllByRole("button", { name: /^Ampliar/ }).length).toBeGreaterThanOrEqual(8);
    await userEvent.click(screen.getByRole("button", { name: /^Tablas \(6\)/ }));
    expect(screen.queryByRole("link", { name: /Escala de cetonemia/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tabla 6/ })).toBeInTheDocument();
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
    for (const t of [
      "Tabla 2",
      "Transición desde MDI",
      "Tabla 3",
      "Tabla 4",
      "Calendario de seguimiento",
    ])
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
});
