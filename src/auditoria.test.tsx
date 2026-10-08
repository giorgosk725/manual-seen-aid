/* Regresiones de la auditoría del 3-10-2026 (0.5.0): preferencias que no rompen la app,
   límites de búsqueda por grupo, remisiones internas que llevan a su sitio y marcas
   «Difiere del capítulo» con la frase literal del capítulo. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { FIGURAS } from "./contenido";
import { INFO_F3 } from "./componentes/figura3-imagen";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import { APARTADOS, TABLAS, idDeBloque } from "./contenido";
import { buscar, buscarConTotales, fueraDelCapitulo, tramoDeConsulta } from "./buscador";
import { OBRAS_NOMBRADAS, PATRON_REMISION, destinoDeRemision } from "./remisiones";
import { BIBLIOGRAFIA } from "./contenido";
import { DIFIERE_CAMPO, DIFIERE_PARAM, SISTEMAS_AMPLIACION } from "./ampliacion";
import {
  restablecerPreferencias,
  useFavoritos,
  useFormatoHoja,
  useLeidos,
  useUltimo,
} from "./prefs";

function Lector() {
  const leidos = useLeidos();
  const favoritos = useFavoritos();
  const ultimo = useUltimo();
  return (
    <p>
      {leidos.length}·{favoritos.map((f) => f.ruta).join(",")}·{ultimo?.ruta ?? "nada"}
    </p>
  );
}

describe("preferencias de lectura", () => {
  afterEach(() => localStorage.clear());
  it("un valor con forma inesperada vale el defecto y no rompe la pantalla", () => {
    localStorage.setItem("mseen:leidos", "{}");
    localStorage.setItem("mseen:favoritos", "null");
    localStorage.setItem("mseen:ultimo", '{"ruta":42}');
    render(<Lector />);
    expect(screen.getByText("0··nada")).toBeInTheDocument();
  });
  it("solo se aceptan rutas internas de la app", () => {
    localStorage.setItem(
      "mseen:favoritos",
      JSON.stringify([
        { ruta: "#/capitulo/01-introduccion", titulo: "1" },
        { ruta: "javascript:alert(1)", titulo: "x" },
        "basura",
      ]),
    );
    render(<Lector />);
    expect(screen.getByText("0·#/capitulo/01-introduccion·nada")).toBeInTheDocument();
  });
  it("el formato de las hojas solo acepta sus dos valores", () => {
    function Formato() {
      return <p>{useFormatoHoja()}</p>;
    }
    localStorage.setItem("mseen:hoja", JSON.stringify("gigante"));
    const { unmount } = render(<Formato />);
    expect(screen.getByText("letra-grande")).toBeInTheDocument();
    unmount();
    localStorage.setItem("mseen:hoja", JSON.stringify("una-cara"));
    render(<Formato />);
    expect(screen.getByText("una-cara")).toBeInTheDocument();
  });
  it("restablecer borra solo las claves de la app", () => {
    localStorage.setItem("mseen:night", "1");
    localStorage.setItem("otra-app", "x");
    restablecerPreferencias();
    expect(localStorage.getItem("mseen:night")).toBeNull();
    expect(localStorage.getItem("otra-app")).toBe("x");
  });
});

describe("búsqueda con límite por grupo", () => {
  it("las búsquedas frecuentes también enseñan lo de fuera del capítulo", () => {
    for (const q of ["insulina", "sistema", "hipoglucemia"]) {
      const { resultados, totalCapitulo, totalFuera } = buscarConTotales(q, 60, 20);
      const fuera = resultados.filter((r) => fueraDelCapitulo(r.entrada));
      expect(totalFuera, q).toBeGreaterThan(0);
      expect(fuera.length, q).toBe(Math.min(20, totalFuera));
      expect(resultados.length - fuera.length, q).toBe(Math.min(60, totalCapitulo));
    }
  });
  it("sin coincidencia con todas las palabras, busca con alguna y lo dice", () => {
    const r = buscarConTotales("resonancia 780G zzzz");
    expect(r.parcial).toBe(true);
    expect(r.resultados.length).toBeGreaterThan(0);
    expect(buscarConTotales("resonancia").parcial).toBe(false);
  });
  it("una cifra de β-OHB lleva a su tramo de la Figura 3", () => {
    expect(tramoDeConsulta("β-OHB 1,2")?.clave).toBe("naranja");
    expect(tramoDeConsulta("cetonemia 0,8")?.clave).toBe("amarillo");
    expect(tramoDeConsulta("cetonas 3")?.clave).toBe("rojo");
    expect(tramoDeConsulta("b-OHB 0.4")?.clave).toBe("verde");
    expect(tramoDeConsulta("modo sueño")).toBeNull();
    // Sin falsos positivos: otras cifras de la consulta no son una cetonemia.
    expect(tramoDeConsulta("cetonas y glucemia 250")).toBeNull();
    expect(tramoDeConsulta("cetonas 2 h")).toBeNull();
    expect(tramoDeConsulta("cetonemia 250 mg/dl")).toBeNull();
    expect(tramoDeConsulta("β-OHB de 1,2 mmol/l")?.clave).toBe("naranja");
  });
  it("el capítulo va siempre delante", () => {
    const r = buscar("insulina", 10, 5);
    const primeraFuera = r.findIndex((x) => fueraDelCapitulo(x.entrada));
    expect(primeraFuera).toBe(10);
  });
});

describe("remisiones internas del capítulo", () => {
  it("cada «Tabla N», «Figura N» y «v. «…»» de los párrafos lleva a su sitio", () => {
    let n = 0;
    for (const a of APARTADOS)
      for (const b of a.bloques) {
        const textos = b.t === "p" ? [b.texto] : b.t === "lista" ? [b.intro ?? "", ...b.items] : [];
        for (const t of textos)
          for (const parte of t.split(PATRON_REMISION).filter((_, i) => i % 2 === 1)) {
            n++;
            expect(destinoDeRemision(parte), `${a.slug}: ${parte}`).not.toBeNull();
          }
      }
    expect(n).toBeGreaterThan(10);
  });
  it("las obras nombradas son frases literales del capítulo y su referencia existe", () => {
    const texto = APARTADOS.flatMap((a) =>
      a.bloques.flatMap((b) =>
        b.t === "p" ? [b.texto] : b.t === "lista" ? [b.intro ?? "", ...b.items] : [],
      ),
    ).join(" ");
    for (const o of OBRAS_NOMBRADAS) {
      expect(texto, o.frase).toContain(o.frase);
      expect(
        BIBLIOGRAFIA.some((r) => r.n === o.ref),
        o.frase,
      ).toBe(true);
      expect(destinoDeRemision(o.frase)).toBe(`#/bibliografia/ref-${o.ref}`);
    }
  });
  it("la Figura 3 es el bloque b5 del apartado 7", () => {
    const a = APARTADOS.find((x) => x.slug === "07-educacion")!;
    const i = a.bloques.findIndex((b) => b.t === "figura" && b.id === "F3");
    expect(idDeBloque(a.bloques[i], i)).toBe("b5");
    expect(destinoDeRemision("Figura 3")).toBe("#/capitulo/07-educacion/b5");
  });
});

describe("ampliación: lo que difiere del capítulo", () => {
  const t1 = TABLAS.T1;
  const literalDeT1 = (frase: string) =>
    t1.filas.some((f) => f.celdas.some((c) => c.replace(/\n/g, " ").startsWith(frase))) ||
    t1.filas.some((f) => f.celdas.some((c) => c.includes(frase))) ||
    (t1.notas ?? []).some((n) => n.includes(frase));
  it("cada marca cita una frase literal de la Tabla 1", () => {
    const todas = [
      ...Object.values(DIFIERE_CAMPO).flatMap((m) => Object.values(m ?? {})),
      ...Object.values(DIFIERE_PARAM).flatMap((m) => Object.values(m ?? {})),
    ];
    expect(todas.length).toBeGreaterThan(0);
    for (const d of todas) expect(literalDeT1(d.capitulo), d.capitulo).toBe(true);
  });
  it("las marcas apuntan a campos y parámetros que existen", () => {
    for (const [id, campos] of Object.entries(DIFIERE_CAMPO)) {
      const s = SISTEMAS_AMPLIACION.find((x) => x.id === id)!;
      for (const k of Object.keys(campos ?? {})) expect(s.detail, `${id}.${k}`).toHaveProperty(k);
    }
    for (const [id, params] of Object.entries(DIFIERE_PARAM)) {
      const s = SISTEMAS_AMPLIACION.find((x) => x.id === id)!;
      for (const k of Object.keys(params ?? {}))
        expect(
          s.params.some((p) => p.name === k),
          `${id}: ${k}`,
        ).toBe(true);
    }
  });
});

describe("figuras originales", () => {
  it("son WebP y existen en public/", () => {
    const imagenes = [...Object.values(FIGURAS), INFO_F3].map((f) => f!.imagen!.src);
    expect(imagenes).toHaveLength(4);
    // Los ficheros que hay de verdad en public/figuras (Vite los lista sin cargarlos).
    const enPublic = Object.keys(import.meta.glob("/public/figuras/*"));
    for (const src of imagenes) {
      expect(src, src).toMatch(/\.webp$/);
      expect(enPublic, src).toContain(`/public/${src}`);
    }
    expect(
      enPublic.filter((f) => f.endsWith(".png")),
      "PNG sobrantes",
    ).toEqual([]);
  });
});

describe("pantallas perezosas", () => {
  const fuentes = import.meta.glob(
    ["./App.tsx", "./componentes/Shell.tsx", "./pantallas/Portada.tsx", "./pantallas/Apartado.tsx"],
    { query: "?raw", import: "default", eager: true },
  ) as Record<string, string>;
  it("App solo carga al entrar la portada, el índice y los apartados", () => {
    const app = fuentes["./App.tsx"];
    for (const m of ["Consultar", "Otras", "Sistemas", "Visual", "Recorridos", "Pacientes"]) {
      expect(app, m).not.toContain(`from "./pantallas/${m}"`);
      expect(app, m).toContain(`import("./pantallas/${m}")`);
    }
  });
  it("las pantallas de entrada no arrastran el índice de búsqueda ni los datos de la ampliación", () => {
    for (const [f, src] of Object.entries(fuentes)) {
      expect(src, f).not.toMatch(/from "\.\.?\/buscador"/);
      expect(src, f).not.toMatch(/from "\.\.?\/ampliacion"/);
    }
  });
});

describe("dirección pública y modo nocturno (auditoría 0.6.0)", () => {
  it("las copias de trabajo usan la dirección pública en QR y citas", async () => {
    const { esCopiaDeTrabajo } = await import("./compartir");
    for (const h of ["localhost", "127.0.0.1", "[::1]", "ede24dc8.manual-seen-aid.pages.dev"])
      expect(esCopiaDeTrabajo(h), h).toBe(true);
    for (const h of ["manual-seen-aid.pages.dev", "www.seen.es"])
      expect(esCopiaDeTrabajo(h), h).toBe(false);
  });
  it("el modo nocturno es uno solo para toda la app y no se guarda sin elegirlo", async () => {
    const { useNocturno } = await import("./prefs");
    localStorage.removeItem("mseen:night");
    function Interruptor({ n }: { n: string }) {
      const [noche, alternar] = useNocturno();
      return (
        <button type="button" onClick={alternar}>
          {n}:{noche ? "noche" : "dia"}
        </button>
      );
    }
    render(
      <>
        <Interruptor n="cabecera" />
        <Interruptor n="mas" />
      </>,
    );
    expect(localStorage.getItem("mseen:night")).toBeNull();
    act(() => screen.getByText("cabecera:dia").click());
    expect(screen.getByText("mas:noche")).toBeInTheDocument();
    expect(localStorage.getItem("mseen:night")).toBe("1");
  });
});

describe("modo nocturno antes de pintar (0.6.2)", () => {
  const f = import.meta.glob(["/index.html", "/public/_headers", "/src/tema-inicial.js"], {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;
  it("el script va en línea (el build lo pone en el hueco de index.html), no como archivo aparte", () => {
    expect(f["/index.html"]).toContain('<script src="./tema.js"></script>');
    expect(Object.keys(import.meta.glob("/public/tema.js"))).toEqual([]);
    expect(f["/src/tema-inicial.js"]).toContain('localStorage.getItem("mseen:night")');
  });
  it("la CSP admite solo ese script por su hash (el build lo añade y falla si no puede)", () => {
    const cabeceras = f["/public/_headers"];
    expect(cabeceras.match(/script-src 'self';/g)).toHaveLength(1);
    expect(cabeceras).not.toMatch(/script-src[^;]*unsafe-inline/);
  });
});

describe("seguir leyendo, leídos y favoritos (cobertura pedida en la auditoría técnica)", () => {
  afterEach(() => localStorage.clear());
  it("se actualizan en vivo: el favorito se pone y se quita, el leído no se duplica", async () => {
    const { alternarFavorito, guardarUltimo, marcarLeido } = await import("./prefs");
    render(<Lector />);
    expect(screen.getByText("0··nada")).toBeInTheDocument();
    const fav = { ruta: "#/consultar/figura-3", titulo: "Figura 3" };
    act(() => {
      alternarFavorito(fav);
      marcarLeido("07-educacion");
      marcarLeido("07-educacion");
      guardarUltimo({ ruta: "#/capitulo/10-situaciones/b4", titulo: "10", slug: "10-situaciones" });
    });
    expect(
      screen.getByText("1·#/consultar/figura-3·#/capitulo/10-situaciones/b4"),
    ).toBeInTheDocument();
    act(() => alternarFavorito(fav));
    expect(screen.getByText("1··#/capitulo/10-situaciones/b4")).toBeInTheDocument();
  });
});

describe("índice de búsqueda que no llega (auditoría técnica, M1)", () => {
  afterEach(() => {
    vi.doUnmock("./buscador");
    vi.resetModules();
  });
  it("avisa con «error» y «Reintentar» lo vuelve a pedir (el fallo no se queda guardado)", async () => {
    vi.resetModules();
    let intentos = 0;
    vi.doMock("./buscador", async () => {
      intentos++;
      if (intentos === 1) throw new Error("sin red");
      return await vi.importActual<typeof import("./buscador")>("./buscador");
    });
    const { useBuscador } = await import("./useBuscador");
    const { result } = renderHook(() => useBuscador(true));
    expect(result.current.estado).toBe("cargando");
    await waitFor(() => expect(result.current.estado).toBe("error"));
    act(() => result.current.reintentar());
    await waitFor(() => expect(result.current.estado).toBe("listo"));
    expect(intentos).toBe(2);
    expect(result.current.motor?.buscar("glargina").length).toBeGreaterThan(0);
  });
  it("con el buscador inactivo no pide nada", async () => {
    vi.resetModules();
    let intentos = 0;
    vi.doMock("./buscador", async () => {
      intentos++;
      return await vi.importActual<typeof import("./buscador")>("./buscador");
    });
    const { useBuscador } = await import("./useBuscador");
    const { result } = renderHook(() => useBuscador(false));
    expect(result.current.estado).toBe("inactivo");
    await new Promise((r) => setTimeout(r, 50));
    expect(intentos).toBe(0);
  });
});
