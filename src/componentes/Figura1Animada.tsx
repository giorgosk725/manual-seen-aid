/* Figura 1 del capítulo dibujada en SVG propio: los cuatro componentes (sensor, algoritmo,
   bomba o pod, plataforma) alrededor de la persona con DM1, con el asa de realimentación
   recorrida por una señal que gira (solo con movimiento permitido). Los rótulos son los de la
   figura; la geometría es nuestra. */
import { Activity, Cpu, Database, Syringe, User } from "lucide-react";

const NODOS = [
  { id: "sensor", x: 60, y: 50, titulo: "1) Sensor de MCG", icono: Activity, hex: "#0E8C77" },
  { id: "algoritmo", x: 260, y: 50, titulo: "2) Algoritmo de control", icono: Cpu, hex: "#514dbf" },
  {
    id: "bomba",
    x: 260,
    y: 210,
    titulo: "3) Bomba de insulina o pod",
    icono: Syringe,
    hex: "#E05300",
  },
  {
    id: "plataforma",
    x: 60,
    y: 210,
    titulo: "4) Plataforma de descarga y análisis de datos",
    icono: Database,
    hex: "#1f4e79",
  },
];

export function Figura1Animada() {
  return (
    <figure
      className="rounded-2xl border bg-white p-4 shadow-soft"
      style={{ borderColor: "#e5ebf1" }}
      aria-label="Figura 1 como diagrama animado"
    >
      <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "#15324f" }}>
        Figura 1 · diagrama
      </div>
      <div className="relative mx-auto max-w-md">
        <svg
          viewBox="0 0 320 260"
          className="h-auto w-full"
          role="img"
          aria-label="Sensor, algoritmo y bomba o pod forman un circuito de retroalimentación continua alrededor de la persona con diabetes tipo 1; la plataforma de datos conecta con el equipo sanitario."
        >
          <defs>
            <marker
              id="f1-flecha"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10z" fill="#94a3b8" />
            </marker>
          </defs>
          {/* Asa de realimentación: sensor → algoritmo → bomba → persona → sensor */}
          <path
            id="f1-asa"
            d="M60 50 L260 50 L260 210 L160 130 L60 50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M60 50 L250 50"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#f1-flecha)"
          />
          <path
            d="M260 50 L260 200"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#f1-flecha)"
          />
          {/* Plataforma: líneas discontinuas con el resto */}
          <path
            d="M60 210 L160 130"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M60 210 L260 210"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Señal que recorre el asa */}
          <circle r="5" fill="#38bdf8" className="f1-senal">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M60 50 L260 50 L260 210 L160 130 L60 50"
            />
          </circle>
          {/* Persona en el centro */}
          <circle cx="160" cy="130" r="26" fill="#eef3f8" stroke="#1f4e79" strokeWidth="2" />
          <foreignObject x="146" y="116" width="28" height="28">
            <User size={28} color="#1f4e79" aria-hidden="true" />
          </foreignObject>
          <text x="160" y="172" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15324f">
            Persona con diabetes tipo 1
          </text>
          {NODOS.map((n) => {
            const I = n.icono;
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r="22" fill="#ffffff" stroke={n.hex} strokeWidth="3" />
                <foreignObject x={n.x - 11} y={n.y - 11} width="22" height="22">
                  <I size={22} color={n.hex} aria-hidden="true" />
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
          {NODOS.map((n) => (
            <li key={n.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: n.hex }}
              />
              {n.titulo}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-xs text-slate-500">
        Diagrama propio a partir de la Figura 1 (p. 2): sensor, algoritmo y bomba o pod forman un
        circuito de retroalimentación continua; la plataforma de datos permite seguimiento,
        interpretación, optimización y telemedicina.
      </figcaption>
    </figure>
  );
}
