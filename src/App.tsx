/* Enrutador: una pantalla por ruta hash. Portada, índice y apartados se cargan al entrar
   (son la puerta y la lectura); el resto de pantallas, cada grupo en su trozo, con React.lazy
   la primera vez que se visitan (el service worker ya las tiene para usar sin conexión). */
import { lazy, useEffect } from "react";
import { apartadoPorSlug, DIAGRAMAS, TABLAS } from "./contenido";
import { useRuta } from "./rutas";
import { Shell } from "./componentes/Shell";
import { Portada } from "./pantallas/Portada";
import { CapituloEntero, IndiceCapitulo } from "./pantallas/Capitulo";
import { Apartado } from "./pantallas/Apartado";
import { ORDEN_SISTEMAS } from "./ampliacion/ids";
import type { SistemaId } from "./ampliacion/tipos";

const consultar = () => import("./pantallas/Consultar");
const HubConsultar = lazy(() => consultar().then((m) => ({ default: m.HubConsultar })));
const Tablas = lazy(() => consultar().then((m) => ({ default: m.Tablas })));
const Figura3Pantalla = lazy(() => consultar().then((m) => ({ default: m.Figura3Pantalla })));
const Infografia = lazy(() => consultar().then((m) => ({ default: m.Infografia })));
const Glosario = lazy(() => consultar().then((m) => ({ default: m.Glosario })));

const recorridos = () => import("./pantallas/Recorridos");
const SituacionSistema = lazy(() => recorridos().then((m) => ({ default: m.SituacionSistema })));
const RevisarDescarga = lazy(() => recorridos().then((m) => ({ default: m.RevisarDescarga })));
const Interrupcion = lazy(() => recorridos().then((m) => ({ default: m.Interrupcion })));

const otras = () => import("./pantallas/Otras");
const Bibliografia = lazy(() => otras().then((m) => ({ default: m.Bibliografia })));
const Buscar = lazy(() => otras().then((m) => ({ default: m.Buscar })));
const Cambios = lazy(() => otras().then((m) => ({ default: m.Cambios })));
const Mas = lazy(() => otras().then((m) => ({ default: m.Mas })));
const Sobre = lazy(() => otras().then((m) => ({ default: m.Sobre })));
const Test = lazy(() => otras().then((m) => ({ default: m.Test })));

const repaso = () => import("./pantallas/Repaso");
const Repaso = lazy(() => repaso().then((m) => ({ default: m.Repaso })));

const sistemas = () => import("./pantallas/Sistemas");
const FichaSistema = lazy(() => sistemas().then((m) => ({ default: m.FichaSistema })));
const HubSistemas = lazy(() => sistemas().then((m) => ({ default: m.HubSistemas })));

const visual = () => import("./pantallas/Visual");
const DiagramaPantalla = lazy(() => visual().then((m) => ({ default: m.DiagramaPantalla })));
const Visual = lazy(() => visual().then((m) => ({ default: m.Visual })));

const pacientes = () => import("./pantallas/Pacientes");
const HubPacientes = lazy(() => pacientes().then((m) => ({ default: m.HubPacientes })));
const InformacionPacientes = lazy(() =>
  pacientes().then((m) => ({ default: m.InformacionPacientes })),
);
const PlanSeguridad = lazy(() => pacientes().then((m) => ({ default: m.PlanSeguridad })));
const ResumenPacientes = lazy(() => pacientes().then((m) => ({ default: m.ResumenPacientes })));

/* Precarga en un momento libre (sin ahorro de datos): al navegar ya no hay espera. Empieza
   cuando la página ha terminado de cargar y tras un respiro, para no competir con el primer
   pintado ni con las fuentes en un móvil lento. */
const precargarPantallas = () => {
  const ahorro = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData;
  if (ahorro) return;
  const cargar = () => {
    for (const f of [consultar, recorridos, sistemas, visual, pacientes, otras, repaso])
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
  return c >= 0 ? TABLAS.T1.columnas[c] : undefined;
};

function NoEncontrada() {
  return (
    <div
      className="rounded-2xl border border-dashed bg-white p-6 text-center"
      style={{ borderColor: "#d4d4d4" }}
    >
      <p className="text-sm font-semibold text-slate-800">Esa pantalla no existe.</p>
      <a href="#/" className="mt-2 inline-block text-sm font-semibold text-slate-700 underline">
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
        titulo = "Índice del capítulo";
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
          pantalla = <HubConsultar />;
          titulo = "Consultar";
          break;
        case "tablas": {
          pantalla = (
            <Tablas id={ruta.detalle?.split(":")[0]} seleccion={ruta.detalle?.split(":")[1]} />
          );
          const t = ruta.detalle && TABLAS[ruta.detalle.split(":")[0] as keyof typeof TABLAS];
          titulo = t ? `Tabla ${t.numero}` : "Tablas";
          break;
        }
        case "situacion":
          pantalla = (
            <SituacionSistema
              situacion={ruta.detalle?.split(":")[0]}
              sistema={ruta.detalle?.split(":")[1]}
            />
          );
          titulo = "Situación y sistema";
          break;
        case "descarga":
          pantalla = <RevisarDescarga paso={ruta.detalle} />;
          titulo = "Revisar la descarga";
          break;
        case "interrupcion":
          pantalla = <Interrupcion tramo={ruta.detalle} />;
          titulo = "Interrupción del sistema";
          break;
        case "figura-3":
          pantalla = <Figura3Pantalla tramo={ruta.detalle} />;
          titulo = "Cetonemia paso a paso";
          break;
        case "infografia":
          pantalla = <Infografia />;
          titulo = "Infografía";
          break;
        case "glosario":
          pantalla = <Glosario sigla={ruta.detalle} />;
          titulo = "Glosario de siglas";
          break;
        default:
          pantalla = <NoEncontrada />;
      }
      break;
    }
    case "visual":
      pantalla = ruta.sub ? <DiagramaPantalla id={ruta.sub} opcion={ruta.detalle} /> : <Visual />;
      titulo = DIAGRAMAS.find((d) => d.id === ruta.sub)?.titulo ?? "Figuras y diagramas";
      break;
    case "sistemas":
      pantalla = ruta.sub ? <FichaSistema id={ruta.sub} /> : <HubSistemas />;
      titulo = nombreDeSistema(ruta.sub) ?? "Sistemas";
      break;
    case "buscar":
      pantalla = <Buscar inicial={ruta.sub} />;
      titulo = "Buscar";
      break;
    case "bibliografia":
      pantalla = <Bibliografia destacada={ruta.sub} />;
      titulo = "Bibliografía";
      break;
    case "cambios":
      pantalla = <Cambios />;
      titulo = "Qué ha cambiado";
      break;
    case "sobre":
      pantalla = <Sobre />;
      titulo = "Sobre esta versión";
      break;
    case "test":
      pantalla = <Test />;
      titulo = "Autoevaluación";
      break;
    case "repaso":
      pantalla = <Repaso filtro={ruta.sub} />;
      titulo = "Tarjetas de repaso";
      break;
    case "pacientes":
      if (ruta.sub === "informacion") {
        pantalla = <InformacionPacientes />;
        titulo = "Información para pacientes";
      } else if (ruta.sub === "resumen") {
        pantalla = <ResumenPacientes />;
        titulo = "Resumen del capítulo";
      } else if (ruta.sub === "plan") {
        pantalla = <PlanSeguridad sistema={ruta.detalle} />;
        titulo = "Plan de seguridad";
      } else if (!ruta.sub) {
        pantalla = <HubPacientes />;
        titulo = "Para el paciente";
      } else pantalla = <NoEncontrada />;
      break;
    case "mas":
      pantalla = <Mas />;
      titulo = "Más";
      break;
    default:
      pantalla = <NoEncontrada />;
  }

  return (
    <Shell titulo={titulo} ruta={ruta}>
      {pantalla}
    </Shell>
  );
}
