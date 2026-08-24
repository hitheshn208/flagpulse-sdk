import { createContext } from "react";
import type { FlagPulseClient } from "./index.js";

export interface FlagPulseContextValue {
    client: FlagPulseClient;
    fetched: boolean;
}

const FlagPulseContext = createContext<FlagPulseContextValue | undefined>(undefined);

export default FlagPulseContext;