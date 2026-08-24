import CacheManager from "./cache.js";
import type { Flag, FlagTypes } from "./data.js";
import SSEManager from "./sse.js";

type FlagUpdateListener = (flags: Flag[]) => any;

export default class FlagPulseClient {
    private sdkKey: string;
    private baseUrl: string;

    private cache: CacheManager;
    private sse: SSEManager;

    private context: unknown;
    private listeners: Set<FlagUpdateListener>;

    private flags: Flag[];
    private _hydrated: boolean;

    constructor({ sdkKey, baseUrl, ttl }: { sdkKey: string; baseUrl: string; ttl: number | null }) {
        if (!sdkKey) throw new Error("sdkKey is required");
        if (!baseUrl) throw new Error("baseUrl is required");

        this.sdkKey = sdkKey;
        this.baseUrl = baseUrl;

        this.cache = new CacheManager(ttl);
        this.sse = new SSEManager(
            baseUrl,
            this._onFlagUpdate.bind(this),
            this._onFlagDelete.bind(this),
        );

        this.context = null;
        this.listeners = new Set();

        const cached = this.cache.get();
        this.flags = cached ?? [];
        this._hydrated = cached !== null && cached !== undefined;
    }

    get isHydrated(): boolean {
        return this._hydrated;
    }

    async init() {
        if (!this._hydrated) {
            this.flags = await this._fetchFlags();
            this.cache.set(this.flags);
            this._hydrated = true;
        }
        this.sse.connect(this.sdkKey);
    }

    private async _fetchFlags(): Promise<Flag[]> {
        const response = await fetch(`${this.baseUrl}/api/v1/flags`, {
            headers: {
                "x-sdk-key": this.sdkKey
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch flags");
        }

        return response.json();
    }

    get(flagKey: string, fallback: FlagTypes): FlagTypes {
        const flag = this.flags.find(f => f.key === flagKey);

        if (!flag) return fallback;
        if (flag.is_enabled) return flag.targeting_return_value;
        return fallback;
    }

    identify(context: unknown) {
        this.context = context;
    }

    private async _onFlagUpdate(data: Flag) {
        try {
            let updatedFlags: Flag[];

            if (this.flags.length) {
                updatedFlags = this.flags.map(flag =>
                    flag.flag_id === data.flag_id ? { ...flag, ...data } : flag
                );
            } else {
                updatedFlags = await this._fetchFlags();
            }

            this.flags = updatedFlags;
            this.cache.set(updatedFlags);
            this._hydrated = true;
            this._notify();
        } catch (err) {
            console.error("Failed to refresh flags", err);
        }
    }

    private _onFlagDelete(flagId: string) {
        this.flags = this.flags.filter(flag => flag.flag_id !== flagId);
        this.cache.set(this.flags);
        this._notify();
    }

    onUpdate(callback: FlagUpdateListener) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    private _notify() {
        this.listeners.forEach(cb => cb(this.flags));
    }

    destroy() {
        this.sse.disconnect();
        this.listeners.clear();
    }

    reset() {
        this.cache.clear();
        this.flags = [];
        this.context = null;
        this._hydrated = false;
        this._notify();
    }
}

export { FlagPulseClient };