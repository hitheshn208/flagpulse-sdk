export interface Flag {
    readonly flag_id: string;
    readonly key: string;
    readonly name: string;
    type: "string" | "number" | "boolean" | "json"
    is_enabled: boolean;
    rollout_percentage: number | null;
    targeting_return_value: FlagTypes
    targeting_attribute: string | null;
    targeting_value: string | null;
}

export type FlagTypes = string | number | boolean | object;