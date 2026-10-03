/* Contexto del nivel de encabezado de los bloques visuales (ver nivel.tsx). */
import { createContext, useContext } from "react";

export type Nivel = 2 | 3 | 4;
export const NivelTitulo = createContext<Nivel>(3);
export const useNivelTitulo = () => useContext(NivelTitulo);
