import "@testing-library/jest-dom";
import { afterEach, beforeEach, expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const limpiarHash = () => {
  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch {
    /* jsdom sin history */
  }
};

beforeEach(() => {
  limpiarHash();
  // jsdom no implementa IntersectionObserver: Revelar lo detecta y se muestra sin animar.
  try {
    window.localStorage.clear();
  } catch {
    /* almacenamiento bloqueado */
  }
});

afterEach(() => {
  limpiarHash();
  document.documentElement.className = "";
});
