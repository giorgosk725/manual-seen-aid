/* Amplía las aserciones de Vitest con el matcher de jest-axe (registrado en test-setup.ts). */
import "vitest";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}
