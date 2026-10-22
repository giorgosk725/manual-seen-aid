import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ui";

/* 0.96.1 (revisión de Codex, V95-04): una pantalla que falla se vuelve a intentar al cambiar de
   ruta; sin cambio de ruta, la barrera sigue (y las pantallas sanas no se remontan). */
const Pantalla = ({ falla }: { falla: boolean }) => {
  if (falla) throw new Error("ruta inválida");
  return <p>Pantalla sana</p>;
};

describe("ErrorBoundary con clave de ruta", () => {
  it("se recupera al pasar a otra ruta, no antes", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      const { rerender } = render(
        <ErrorBoundary clave="#/consultar/descarga/4.5">
          <Pantalla falla />
        </ErrorBoundary>,
      );
      expect(screen.getByText("Algo ha fallado en esta pantalla.")).toBeTruthy();
      rerender(
        <ErrorBoundary clave="#/consultar/descarga/4.5">
          <Pantalla falla={false} />
        </ErrorBoundary>,
      );
      expect(screen.getByText("Algo ha fallado en esta pantalla.")).toBeTruthy();
      rerender(
        <ErrorBoundary clave="#/consultar/descarga/1">
          <Pantalla falla={false} />
        </ErrorBoundary>,
      );
      expect(screen.getByText("Pantalla sana")).toBeTruthy();
      expect(screen.queryByText("Algo ha fallado en esta pantalla.")).toBeNull();
    } finally {
      error.mockRestore();
    }
  });
  it("sin fallo, cambiar de ruta no remonta la pantalla", () => {
    let montajes = 0;
    const Contador = () => {
      const [id] = useState(() => ++montajes);
      return <p>montaje {id}</p>;
    };
    const { rerender } = render(
      <ErrorBoundary clave="#/a">
        <Contador />
      </ErrorBoundary>,
    );
    rerender(
      <ErrorBoundary clave="#/b">
        <Contador />
      </ErrorBoundary>,
    );
    // La clave no es la `key` de React: la pantalla conserva su estado.
    expect(screen.getByText("montaje 1")).toBeTruthy();
    expect(montajes).toBe(1);
  });
});
