export default class SSEManager{
    private baseUrl:string;
    private es: EventSource | null;
    private retryDelay: number;
    private maxDelay: number;
    private timeout: number | undefined
    private shouldReconnect = true;

    private onFlagUpdate: (data: any)=> void;
    private onFlagDeleted: (flagId: string) => void;

    constructor(baseUrl: string, onFlagUpdate: (data: any)=> void, onFlagDeleted: (flagId: string) => void){
        this.baseUrl = baseUrl;
        this.es = null;
        this.retryDelay = 1000;
        this.maxDelay = 30000;
        this.onFlagUpdate = onFlagUpdate;
        this.onFlagDeleted = onFlagDeleted;
    }

    connect(sdkKey: string){
        if(this.es)
            this.es.close()

        this.es = new EventSource(`${this.baseUrl}/api/v1/stream?sdkKey=${sdkKey}`)

        this.es.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch (err) {
                console.error("Failed to parse SSE message", err);
                return;
            }
            switch (data.type) {
                case "flag_updated": {
                    const { type, ...flagData } = data;
                    this.onFlagUpdate(flagData);
                    break;
                }
                case "flag_deleted": {
                    const { type, flag_id } = data;
                    this.onFlagDeleted(flag_id);
                    break;
                }
                case "sdkKeyChanged":
                    this.shouldReconnect = false;
                    this.es?.close();
                    break;
                default:
                    console.warn("Unknown SSE event type", data.type);
            }
        }

        this.es.onerror =(err)=>{
            console.log(err);

            this.es?.close();

            if (!this.shouldReconnect)
                return; //Prevent reconnect if sdk key changed midway
            
            this.timeout = setTimeout(()=>{
                this.connect(sdkKey)
            }, this.retryDelay);
            this.retryDelay = Math.min(this.retryDelay * 2, this.maxDelay);
        }

        this.es.onopen = ()=>{
            this.retryDelay = 1000;
        }
    }

    disconnect(){
        if(this.es){
            this.es.close();
            this.es = null;
        }
        clearTimeout(this.timeout);
        this.timeout = undefined
    }
}