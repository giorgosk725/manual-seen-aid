/* Enrutador: una pantalla por ruta hash. */
import { apartadoPorSlug } from "./contenido";
import { useRuta } from "./rutas";
import { Shell } from "./componentes/Shell";
import { Portada } from "./pantallas/Portada";
import { CapituloEntero, IndiceCapitulo } from "./pantallas/Capitulo";
import { Apartado } from "./pantallas/Apartado";
import { Figura3Pantalla, Glosario, HubConsultar, Infografia, Tablas } from "./pantallas/Consultar";
import { Bibliografia, Buscar, Cambios, Mas, Sobre, Test } from "./pantallas/Otras";
import { FichaSistema, HubSistemas } from "./pantallas/Sistemas";
import { sistemaPorId } from "./ampliacion";
import { DiagramaPantalla, Visual } from "./pantallas/Visual";
import { DIAGRAMAS } from "./contenido";
import { Interrupcion, RevisarDescarga, SituacionSistema } from "./pantallas/Recorridos";
import { TABLAS } from "./contenido";

function NoEncontrada() {
  return (
    <div
      className="rounded-2xl border border-dashed bg-white p-6 text-center"
      style={{ borderColor: "#cbd5e1" }}
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
      pantalla = ruta.sub ? <DiagramaPantalla id={ruta.sub} /> : <Visual />;
      titulo = DIAGRAMAS.find((d) => d.id === ruta.sub)?.titulo ?? "Figuras y diagramas";
      break;
    case "sistemas":
      pantalla = ruta.sub ? <FichaSistema id={ruta.sub} /> : <HubSistemas />;
      titulo = sistemaPorId(ruta.sub)?.name ?? "Sistemas";
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
    case "mas":
      pantalla = <Mas />;
      titulo = "Más";
      break;
    default:
      pantalla = <NoEncontrada />;
  }

  return <Shell titulo={titulo}>{pantalla}</Shell>;
}
