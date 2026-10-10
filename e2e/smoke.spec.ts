import { test, expect } from "@playwright/test";

test.describe("Recorrido básico (escritorio)", () => {
  test("portada → índice → apartado → anterior/siguiente, sin errores de página", async ({
    page,
  }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(String(e)));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /automatización de la insulinoterapia/i,
    );
    await page.getByRole("link", { name: "Leer capítulo", exact: true }).click();
    await expect(page).toHaveURL(/#\/capitulo$/);
    await page.getByRole("link", { name: /Educación terapéutica y plan de seguridad/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Educación terapéutica");
    await expect(
      page.getByText("Interrupción del sistema y pauta alternativa").first(),
    ).toBeVisible();
    await page.getByRole("link", { name: /Siguiente/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Iniciación, seguimiento");
    expect(errores).toEqual([]);
  });

  test("la barra lateral lista los 13 apartados al entrar en el capítulo", async ({ page }) => {
    await page.goto("/#/capitulo/01-introduccion");
    const nav = page.getByRole("navigation", { name: /Navegación principal/ });
    await expect(nav.getByRole("link", { name: /^13/ })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Situaciones especiales/ })).toBeVisible();
  });

  test("enlace profundo a un subapartado lo deja a la vista", async ({ page }) => {
    await page.goto("/#/capitulo/10-situaciones/gestacion");
    const h = page.getByRole("heading", { level: 2, name: "Gestación" });
    await expect(h).toBeInViewport();
  });

  test("Tabla 4: elegir dos sistemas deja solo sus columnas", async ({ page }) => {
    await page.goto("/#/consultar/tablas/T4");
    const grupo = page.getByRole("group", { name: "Filtrar por sistema" });
    await grupo.getByRole("button", { name: "MiniMed 780G" }).click();
    await grupo.getByRole("button", { name: "myLoop CamAPS" }).click();
    const cabeceras = page.getByRole("table").locator("thead th");
    await expect(cabeceras).toHaveCount(3);
    await expect(cabeceras.nth(1)).toHaveText("MiniMed 780G");
    await expect(cabeceras.nth(2)).toHaveText("myLoop CamAPS");
    // La fila unida (ejercicio anaeróbico) sigue entera.
    await expect(page.getByRole("table").getByText(/no usar Boost de rutina/)).toBeVisible();
  });

  test("Figura 3: la rama roja se abre por URL y muestra la nota del asterisco", async ({
    page,
  }) => {
    await page.goto("/#/consultar/figura-3/rojo");
    await expect(page.getByText("URGENCIAS / VALORACIÓN HOSPITALARIA INMEDIATA.")).toBeVisible();
    await expect(page.getByText(/Dosis orientativas para personas adultas/).first()).toBeVisible();
    await expect(page.getByText(/0,1 UI\/kg/)).toHaveCount(0);
  });

  test("Ctrl K abre la paleta y un resultado lleva al bloque", async ({ page }) => {
    await page.goto("/");
    // El atajo lo registra React tras montar: se espera a la portada antes de pulsarlo.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.keyboard.press("Control+k");
    await page
      .getByRole("textbox", { name: "Buscar en el capítulo" })
      .fill("ante la duda, cambia el set");
    const lista = page.getByRole("list", { name: "Resultados" });
    await lista.getByRole("link").first().click();
    await expect(page).toHaveURL(/#\/capitulo\/09-descarga\//);
    await expect(page.getByText(/ante la duda, cambia el set/)).toBeInViewport();
  });

  test("la bibliografía enlaza los DOI", async ({ page }) => {
    await page.goto("/#/bibliografia");
    const doi = page.getByRole("link", { name: /doi\.org\/10\.2337\/dci26-0122/ });
    await expect(doi).toHaveAttribute("href", "https://doi.org/10.2337/dci26-0122");
  });

  test("Sistemas: la ficha muestra la foto, el capítulo y la ampliación; Situación filtra por sistema", async ({
    page,
  }) => {
    await page.goto("/#/sistemas");
    await page
      .getByRole("link", { name: /myLoop CamAPS/ })
      .first()
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("myLoop CamAPS");
    await expect(page.getByRole("img", { name: /Foto oficial de myLoop CamAPS/ })).toBeVisible();
    await page.getByRole("link", { name: "Ampliación técnica", exact: true }).click();
    await expect(page).toHaveURL(/#\/sistemas\/camaps\/ampliacion$/);
    await expect(page.getByText("Ampliación técnica · fuera del capítulo")).toBeVisible();
    await page.goto("/#/consultar/situacion");
    await page.getByRole("button", { name: /Resonancia magnética/ }).click();
    await expect(page.getByText(/retirar también el set si la cánula es metálica/)).toBeVisible();
    await page.getByRole("button", { name: /Ejercicio aeróbico planificado/ }).click();
    await page
      .getByRole("group", { name: "Sistema" })
      .getByRole("button", { name: /Omnipod 5/ })
      .click();
    await expect(page).toHaveURL(/situacion\/ejercicio-aerobico:omnipod-5/);
    await expect(page.getByText(/Función Actividad, objetivo 150 mg\/dl/)).toBeVisible();
    await expect(page.getByText(/Modo Ease-off/)).toHaveCount(0);
  });
});
