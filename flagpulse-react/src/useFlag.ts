import { useContext, useEffect, useState } from "react";
import type { FlagTypes } from "./data.js";
import FlagPulseContext from "./FlagPulseContext.js";

export default function useFlag<T extends FlagTypes>(key: string, fallback: T): T {
    const context = useContext(FlagPulseContext);
    if (!context)
        throw new Error("useFlag must be used within a FlagPulseProvider");

    const { client, fetched } = context;
    const [node, setNode] = useState<T>(() =>
        client.isHydrated ? (client.get(key, fallback) as T) : fallback
    );

    useEffect(() => {
        if (!fetched) return;

        setNode(client.get(key, fallback) as T);

        const unsubscribe = client.onUpdate(() => {
            setNode(client.get(key, fallback) as T);
        });

        return () => {
            unsubscribe?.();
        };
    }, [client, key, fetched]);

    return node;
}