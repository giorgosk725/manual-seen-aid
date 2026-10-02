/* jest-axe no trae tipos: lo mínimo para usar axe() y toHaveNoViolations(). Ambiente (sin
   imports) para que sea una declaración del módulo y no una ampliación. */
declare module "jest-axe" {
  export function axe(html: Element | string, options?: unknown): Promise<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const toHaveNoViolations: any;
}
