import { useEffect, useRef, useState, type ReactNode } from "react";
import FlagPulseClient from "./FlagPulseClient.js";
import FlagPulseContext from "./FlagPulseContext.js";

interface FlagPulseProviderProps {
    baseUrl: string;
    sdkKey: string;
    ttl?: number | null;
    children: ReactNode;
}

function FlagPulseProvider({ baseUrl, sdkKey, ttl = null, children }: FlagPulseProviderProps) {
    const clientRef = useRef<FlagPulseClient | null>(null);
    if (!clientRef.current) {
        clientRef.current = new FlagPulseClient({ baseUrl, sdkKey, ttl });
    }

    const [fetched, setFetched] = useState(clientRef.current.isHydrated);

    useEffect(() => {
        let cancelled = false;
        clientRef.current!.init().then(() => {
            if (!cancelled) setFetched(true);
        });
        return () => {
            cancelled = true;
            clientRef.current!.destroy();
        };
    }, []);

    return (
        <FlagPulseContext.Provider value={{ client: clientRef.current, fetched }}>
            {children}
        </FlagPulseContext.Provider>
    );
}

export default FlagPulseProvider;