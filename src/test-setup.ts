import "@testing-library/jest-dom";
import { afterEach, beforeEach, expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom no implementa el desplazamiento (V54-04): un método vacío y espiable, para que las
// pantallas que desplazan (Figura 3, recorridos) no lancen errores asíncronos sin manejar. El
// desplazamiento real lo prueban los e2e (figura3-enlaces).
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};

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
