import type { Flag } from "./data.js";

export default class CacheManager{
    private TTL : number;
    private FLAGS_KEY: string;
    private TIMESTAMP_KEY: string;

    constructor(ttl: number | null){
        this.TTL = ttl ?? 300000
        this.FLAGS_KEY = "flagbase_flags";
        this.TIMESTAMP_KEY = "flagbase_timestamp";
    }

    get(): Flag[] | null{
        const flags = localStorage.getItem(this.FLAGS_KEY);
        const timestamp = Number(localStorage.getItem(this.TIMESTAMP_KEY));

        if(!flags || !timestamp)
            return null;

        const currentTime = Date.now();
        if(currentTime - timestamp > this.TTL){
            this.clear()
            return null;
        }

        try {
            return JSON.parse(flags);  
        } catch (error) {
            console.log("Local flags are corrupted");
            this.clear();
            return null;
        }
    }

    set(flags : Flag[]) : void {
        localStorage.setItem(this.FLAGS_KEY, JSON.stringify(flags));
        localStorage.setItem(this.TIMESTAMP_KEY, String(Date.now()));
    }

    clear() : void {
        localStorage.removeItem(this.FLAGS_KEY);
        localStorage.removeItem(this.TIMESTAMP_KEY);
    }
}