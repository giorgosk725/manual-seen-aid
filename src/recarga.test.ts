import { afterEach, describe, expect, it, vi } from "vitest";
import { recargarUnaVez } from "./recarga";

/* 1.0.9 (revisión externa D108-04): la recarga automática solo con una protección que se pueda
   guardar; si no, ninguna (queda la salida manual). */
describe("recargarUnaVez", () => {
  const reload = vi.fn();
  const original = window.location;
  const conReload = () =>
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...original, reload },
    });
  afterEach(() => {
    Object.defineProperty(window, "location", { configurable: true, value: original });
    vi.restoreAllMocks();
    reload.mockReset();
    sessionStorage.clear();
  });

  it("con almacenamiento: recarga una vez y no dos", () => {
    conReload();
    expect(recargarUnaVez()).toBe(true);
    expect(recargarUnaVez()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("con getItem bloqueado: no recarga sola", () => {
    conReload();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    expect(recargarUnaVez()).toBe(false);
    expect(recargarUnaVez()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it("con setItem bloqueado o sin persistir: no recarga sola", () => {
    conReload();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("lleno");
    });
    expect(recargarUnaVez()).toBe(false);
    vi.restoreAllMocks();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => undefined);
    expect(recargarUnaVez()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
