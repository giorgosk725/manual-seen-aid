/* Enrutador: una pantalla por ruta hash. Portada, índice y apartados se cargan al entrar
   (son la puerta y la lectura); el resto de pantallas, cada grupo en su trozo, con React.lazy
   la primera vez que se visitan (el service worker ya las tiene para usar sin conexión). */
import { AvisoDireccion } from "./ui";
import { isValidElement, lazy, useEffect } from "react";
import { apartadoPorSlug, DIAGRAMAS, TABLAS } from "./contenido";
import { href, useRuta } from "./rutas";
import { Shell } from "./componentes/Shell";
import { Portada } from "./pantallas/Portada";
import { CapituloEntero, IndiceCapitulo } from "./pantallas/Capitulo";
import { Apartado } from "./pantallas/Apartado";
import { CORTO_SISTEMA, ORDEN_SISTEMAS } from "./ampliacion/ids";
import type { SistemaId } from "./ampliacion/tipos";
import { CON_CASOS, CON_CONSULTAS_ADMIN, CON_REPASO } from "./edicion";

/* Dirección de un módulo que no va en esta edición (src/edicion.ts). */
function Retirado() {
  return (
    <div
      className="rounded-xl border bg-white p-4 text-sm text-slate-700"
      style={{ borderColor: "#e6e6e6" }}
    >
      <h1 className="text-lg font-extrabold text-slate-900">
        Esta sección no está en esta edición
      </h1>
      <p className="mt-1">
        Las preguntas frecuentes y la autoevaluación siguen en el menú, en «Leer y comprender».
      </p>
      <a
        href="#/preguntas"
        className="mt-2 inline-flex min-h-11 items-center font-semibold underline"
      >
        Ir a las preguntas frecuentes
      </a>
    </div>
  );
}

const consultar = () => import("./pantallas/Consultar");
const Tablas = lazy(() => consultar().then((m) => ({ default: m.Tablas })));
const Figura3Pantalla = lazy(() => consultar().then((m) => ({ default: m.Figura3Pantalla })));
const Infografia = lazy(() => consultar().then((m) => ({ default: m.Infografia })));

const inicio = () => import("./pantallas/Inicio");
const IniciarSistema = lazy(() => inicio().then((m) => ({ default: m.IniciarSistema })));

const recorridos = () => import("./pantallas/Recorridos");
const SituacionSistema = lazy(() => recorridos().then((m) => ({ default: m.SituacionSistema })));
const RevisarDescarga = lazy(() => recorridos().then((m) => ({ default: m.RevisarDescarga })));
const Interrupcion = lazy(() => recorridos().then((m) => ({ default: m.Interrupcion })));

const otras = () => import("./pantallas/Otras");
const Bibliografia = lazy(() => otras().then((m) => ({ default: m.Bibliografia })));
const Buscar = lazy(() => otras().then((m) => ({ default: m.Buscar })));
const Sobre = lazy(() => otras().then((m) => ({ default: m.Sobre })));
/* Administración de las consultas sin respuesta: fuera de la edición pública (V54-12). */
const ConsultasSinRespuesta = /* @__PURE__ */ lazy(() =>
  import("./pantallas/ConsultasAdmin").then((m) => ({ default: m.ConsultasSinRespuesta })),
);
const Test = lazy(() => otras().then((m) => ({ default: m.Test })));
const Preguntas = lazy(() => otras().then((m) => ({ default: m.Preguntas })));

/* Retirados en esta edición (src/edicion.ts): sin uso, el build los descarta. */
const Casos = /* @__PURE__ */ lazy(() =>
  import("./pantallas/Casos").then((m) => ({ default: m.Casos })),
);
const Repaso = /* @__PURE__ */ lazy(() =>
  import("./pantallas/Repaso").then((m) => ({ default: m.Repaso })),
);

const sistemas = () => import("./pantallas/Sistemas");
const Sistemas = lazy(() => sistemas().then((m) => ({ default: m.Sistemas })));

const visual = () => import("./pantallas/Visual");
const DiagramaPantalla = lazy(() => visual().then((m) => ({ default: m.DiagramaPantalla })));
const Visual = lazy(() => visual().then((m) => ({ default: m.Visual })));

const pacientes = () => import("./pantallas/Pacientes");
const HubPacientes = lazy(() => pacientes().then((m) => ({ default: m.HubPacientes })));
const PlanSeguridad = lazy(() => pacientes().then((m) => ({ default: m.PlanSeguridad })));
const HojaPacientes = lazy(() => pacientes().then((m) => ({ default: m.HojaPacientes })));
const ResumenPacientes = lazy(() => pacientes().then((m) => ({ default: m.ResumenPacientes })));

/* Precarga en un momento libre (sin ahorro de datos): al navegar ya no hay espera. Empieza
   cuando la página ha terminado de cargar y tras un respiro, para no competir con el primer
   pintado ni con las fuentes en un móvil lento. */
const precargarPantallas = () => {
  const ahorro = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData;
  if (ahorro) return;
  const cargar = () => {
    for (const f of [consultar, recorridos, inicio, sistemas, visual, pacientes, otras])
      f().catch(() => {});
  };
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  };
  const enReposo = () =>
    w.requestIdleCallback ? w.requestIdleCallback(cargar, { timeout: 5000 }) : cargar();
  const tras = () => setTimeout(enReposo, 2000);
  if (document.readyState === "complete") tras();
  else window.addEventListener("load", tras, { once: true });
};

/* Nombre de un sistema para el título de la pestaña: el de la Tabla 1 del capítulo. */
const nombreDeSistema = (id: string | undefined) => {
  const c = ORDEN_SISTEMAS.indexOf(id as SistemaId);
  // 1.0.13 (25.ª ronda, R3 y adjunto): el nombre de la app («Control-IQ / Control-IQ+»), también
  // en «Volver a la consulta · …» (antes, «Tandem Control-IQ», el de la Tabla 1).
  return c >= 0 ? CORTO_SISTEMA[c] : undefined;
};

/* Rutas antiguas que siguen en enlaces y favoritos: se sustituyen sin apilar historial. */
function Redireccion({ a }: { a: string }) {
  useEffect(() => {
    window.location.replace(a);
  }, [a]);
  return null;
}
const ID_DE_SLUG: Record<string, string> = {
  "minimed-780g": "mm780",
  "control-iq": "ciq",
  camaps: "camaps",
  "omnipod-5": "op5",
};
const idsDeSlugs = (s?: string) =>
  s
    ?.split("+")
    .map((x) => ID_DE_SLUG[x])
    .filter(Boolean)
    .join("+") || "todos";

/* Secciones cuya dirección acaba en el segundo nivel (#/preguntas/f32): lo que siga sobra. */
const SOLO_DOS_NIVELES = new Set(["preguntas", "bibliografia", "test", "sobre", "mas", "cambios"]);

/* 1.0.39 (Fable, 1.0.38): «Sobre» con una sección que no existe lo dice (antes, la pantalla sin
   aviso). «consultas» solo existe en la edición de administración. */
function SobreConAviso({ pedido }: { pedido?: string }) {
  return (
    <>
      {pedido && (
        <AvisoDireccion pedido={pedido}>
          no hay ninguna sección con ese nombre. Esta es la pantalla «Sobre este complemento».
        </AvisoDireccion>
      )}
      <Sobre />
    </>
  );
}

function NoEncontrada() {
  return (
    <div
      className="rounded-2xl border border-dashed bg-white p-6 text-center"
      style={{ borderColor: "#d4d4d4" }}
    >
      {/* 1.0.34 (Fable, 1.0.32): con su título principal, como cualquier otra pantalla. */}
      <h1 className="text-base font-semibold text-slate-800">Esa pantalla no existe</h1>
      {/* 1.0.39 (Fable, 1.0.38): 44 px de alto para el dedo (medía 20). */}
      <a
        href="#/"
        className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline"
      >
        Volver a la portada
      </a>
    </div>
  );
}

export default function App() {
  const ruta = useRuta();
  useEffect(() => {
    // Solo en el build publicado. En pruebas (jsdom) no hace falta: cada pantalla se carga al
    // visitarla. En desarrollo, Vite compila cada módulo al pedirlo y siete pantallas a la vez
    // retrasan lo que el lector sí ha pedido (lo cubre el proyecto e2e «produccion»).
    if (import.meta.env.PROD) precargarPantallas();
  }, []);
  let pantalla: React.ReactNode;
  let titulo: string | undefined;

  switch (ruta.seccion) {
    case "":
      pantalla = <Portada />;
      break;
    case "capitulo": {
      if (!ruta.sub) {
        pantalla = <IndiceCapitulo />;
        // 1.0.27 (auditoría de navegación, P7): el título de la pestaña, el mismo que el h1.
        titulo = "Índice del capítulo";
      } else if (ruta.sub === "resumen") {
        pantalla = <ResumenPacientes />;
        titulo = "Resumen del capítulo";
      } else if (ruta.sub === "todo") {
        pantalla = <CapituloEntero />;
        titulo = "Capítulo entero";
      } else {
        const a = apartadoPorSlug(ruta.sub);
        if (a) {
          pantalla = <Apartado apartado={a} destacado={ruta.detalle} />;
          titulo = `${a.n}. ${a.titulo}`;
        } else pantalla = <NoEncontrada />;
      }
      break;
    }
    case "consultar": {
      switch (ruta.sub) {
        case undefined:
          pantalla = <Redireccion a="#/" />;
          break;
        case "tablas": {
          pantalla = (
            <Tablas
              id={ruta.detalle?.split(":")[0]}
              seleccion={ruta.detalle?.split(":")[1]}
              fila={ruta.detalle?.split(":")[2]}
            />
          );
          const t = ruta.detalle && TABLAS[ruta.detalle.split(":")[0] as keyof typeof TABLAS];
          titulo = t ? `Tabla ${t.numero}` : "Tablas";
          break;
        }
        case "parametros":
          pantalla = <Redireccion a={href("sistemas", idsDeSlugs(ruta.detalle), "parametros")} />;
          break;
        case "comparar":
          pantalla = <Redireccion a={href("sistemas", idsDeSlugs(ruta.detalle), "esencial")} />;
          break;
        case "situacion":
          pantalla = (
            <SituacionSistema
              situacion={ruta.detalle?.split(":")[0]}
              sistema={ruta.detalle?.split(":")[1]}
              momento={ruta.detalle?.split(":")[2]}
            />
          );
          titulo = "Situaciones";
          break;
        case "inicio":
          pantalla = <IniciarSistema detalle={ruta.detalle} />;
          titulo = "Iniciación del sistema";
          break;
        case "descarga":
          pantalla = <RevisarDescarga paso={ruta.detalle} />;
          titulo = "Interpretación de la descarga";
          break;
        case "interrupcion":
          pantalla = <Interrupcion tramo={ruta.detalle} />;
          titulo = "Interrupción del sistema";
          break;
        case "figura-3":
          pantalla = <Figura3Pantalla tramo={ruta.detalle} />;
          titulo = "Hiperglucemia y cetonemia";
          break;
        case "infografia":
          pantalla = <Infografia />;
          titulo = "Infografía";
          break;
        default:
          pantalla = <NoEncontrada />;
      }
      break;
    }
    case "visual":
      pantalla =
        ruta.sub === "figuras" ? (
          <Visual vista="figuras" />
        ) : ruta.sub ? (
          <DiagramaPantalla id={ruta.sub} opcion={ruta.detalle} />
        ) : (
          <Visual />
        );
      titulo =
        ruta.sub === "figuras"
          ? "Figuras del capítulo"
          : (DIAGRAMAS.find((d) => d.id === ruta.sub)?.titulo ?? "Figuras y diagramas");
      break;
    case "sistemas":
      pantalla = <Sistemas sel={ruta.sub} seccion={ruta.detalle} />;
      titulo =
        ruta.sub === "elegir"
          ? "Elección del sistema"
          : (nombreDeSistema(ruta.sub) ?? "Sistemas AID");
      break;
    case "buscar":
      pantalla = <Buscar inicial={ruta.sub} />;
      titulo = "Buscar";
      break;
    // 0.77.1: «#/tablas[/T1]» como atajo de «#/consultar/tablas[/T1]».
    case "tablas":
      pantalla = <Redireccion a={href("consultar", "tablas", ruta.sub)} />;
      break;
    case "bibliografia":
      pantalla = <Bibliografia destacada={ruta.sub} />;
      titulo = "Bibliografía";
      break;
    case "cambios":
      pantalla = <SobreConAviso pedido={ruta.sub} />;
      titulo = "Sobre este complemento";
      break;
    case "sobre":
      if (ruta.sub === "consultas" && CON_CONSULTAS_ADMIN) {
        pantalla = <ConsultasSinRespuesta />;
        titulo = "Consultas sin respuesta";
      } else {
        pantalla = <SobreConAviso pedido={ruta.sub} />;
        titulo = "Sobre este complemento";
      }
      break;
    case "test":
      pantalla = (
        <>
          {ruta.sub && (
            <AvisoDireccion pedido={ruta.sub}>
              la autoevaluación no tiene nada con ese nombre. Esta es la autoevaluación.
            </AvisoDireccion>
          )}
          <Test />
        </>
      );
      titulo = "Autoevaluación complementaria";
      break;
    case "repaso":
      pantalla = CON_REPASO ? <Repaso filtro={ruta.sub} /> : <Retirado />;
      titulo = "Tarjetas de repaso";
      break;
    case "pacientes":
      // 0.70.0: sin información en pantalla ni resumen aquí (rutas antiguas, a la pantalla).
      if (ruta.sub === "plan") {
        pantalla = <PlanSeguridad sistema={ruta.detalle} />;
        const c = ORDEN_SISTEMAS.indexOf(ruta.detalle as SistemaId);
        titulo = c >= 0 ? `Plan de seguridad · ${CORTO_SISTEMA[c]}` : "Material para el paciente";
      } else if (ruta.sub === "hoja") {
        pantalla = <HojaPacientes id={ruta.detalle} />;
        // 1.0.39 (Fable, 1.0.38): sin hoja en la dirección se ve la lista del material, y así se
        // llama la pestaña (antes, «Hoja para el paciente»). Con hoja, su título (HojaPacientes).
        titulo = ruta.detalle ? "Hoja para el paciente" : "Material para el paciente";
      } else {
        // 1.0.38 (Fable, 1.0.38): una sección que no existe lo dice («informacion» y «resumen» son
        // direcciones antiguas que abren esta pantalla sin aviso).
        pantalla = (
          <>
            {ruta.sub && !["informacion", "resumen"].includes(ruta.sub) && (
              <AvisoDireccion pedido={ruta.sub}>
                no hay nada con ese nombre en el material para el paciente.
              </AvisoDireccion>
            )}
            <HubPacientes />
          </>
        );
        titulo = "Material para el paciente";
      }
      break;
    case "mas":
      pantalla = <SobreConAviso pedido={ruta.sub} />;
      titulo = "Sobre este complemento";
      break;
    case "casos":
      pantalla = CON_CASOS ? <Casos id={ruta.sub} paso={ruta.detalle} /> : <Retirado />;
      titulo = "Casos guiados";
      break;
    case "preguntas":
      pantalla = <Preguntas id={ruta.sub} />;
      titulo = "Preguntas frecuentes";
      break;
    default:
      pantalla = <NoEncontrada />;
  }
  // 1.0.39 (Fable, 1.0.38): «Esa pantalla no existe», también en la pestaña del navegador (antes,
  // el nombre de la sección o solo el de la app).
  const noEncontrada = isValidElement(pantalla) && pantalla.type === NoEncontrada;
  // 1.0.39 (Fable, 1.0.39): en las secciones que solo usan dos niveles, también el tercero
  // («#/preguntas/f32/xyz» mostraba la pregunta sin aviso).
  const sobra =
    ruta.seccion === "buscar"
      ? undefined
      : SOLO_DOS_NIVELES.has(ruta.seccion) && ruta.detalle
        ? [ruta.detalle, ruta.resto].filter(Boolean).join("/")
        : ruta.resto;
  if (noEncontrada) titulo = "Pantalla no encontrada";
  // Lo que sigue al tercer nivel de la dirección no lleva a nada: se dice (antes, en silencio).
  // En Buscar no: la consulta puede llevar una barra («UI/kg»).
  else if (sobra)
    pantalla = (
      <>
        <AvisoDireccion pedido={sobra}>
          esa parte final de la dirección no lleva a nada. Esta es la pantalla de antes de ella.
        </AvisoDireccion>
        {pantalla}
      </>
    );

  return (
    <Shell titulo={titulo} ruta={ruta}>
      {pantalla}
    </Shell>
  );
}
