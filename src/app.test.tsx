/* Pantallas: la portada, un apartado con tabla, el recorrido de la Figura 3, el filtro por
   sistema, la paleta de búsqueda y el test. Más una auditoría axe (sin contraste: jsdom). */
import { describe, expect, it } from "vitest";
import { render, screen, within, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import App from "./App";

const ir = async (hash: string) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
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
  it("la portada muestra el título del capítulo, el autor y la SEEN", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /automatización de la insulinoterapia/i,
    );
    expect(screen.getAllByText(/Georgios Kyriakos/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Sociedad Española de Endocrinología y Nutrición/).length,
    ).toBeGreaterThan(0);
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
    await userEvent.click(screen.getByRole("button", { name: /β-OHB 1,0-2,9 mmol\/l/ }));
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
    await userEvent.click(screen.getByRole("button", { name: /Ver todos/ }));
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

  it("el test razona la respuesta con el capítulo y enlaza al apartado", async () => {
    render(<App />);
    await ir("#/test");
    expect(screen.getAllByText(/Provisional/).length).toBeGreaterThan(0);
    await userEvent.click(
      screen.getByRole("button", { name: /tiempo por debajo del rango \(TBR\)/ }),
    );
    expect(screen.getByText(/^Correcto\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Leer en el apartado 5/ })).toHaveAttribute(
      "href",
      "#/capitulo/05-resultados",
    );
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
