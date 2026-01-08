export type SovereignCommand = {
    kind: "HELP";
} | {
    kind: "AEGIS_STATUS";
} | {
    kind: "AUDIT";
    limit: number;
    since?: string;
} | {
    kind: "BOOKCASE_LIST";
} | {
    kind: "BOOKCASE_SHELVE";
    label: string;
    content: string;
    unshelve?: string;
} | {
    kind: "BOOKCASE_UNSHELVE";
    itemId: string;
} | {
    kind: "EXPORT";
} | {
    kind: "PURGE";
    scope: "session" | "all";
    confirm: boolean;
} | {
    kind: "STORAGE_STATUS";
} | {
    kind: "STORAGE_SET";
    mode: "minimal" | "standard" | "verbose";
} | {
    kind: "DEBUG_UNLOCK";
    confirm: boolean;
} | {
    kind: "DEBUG_LOCK";
};
export declare function parseSovereignCommand(input: string): SovereignCommand | null;
