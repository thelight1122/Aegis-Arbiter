/**
 * POC entry function:
 * - ensures DB + schema
 * - ensures session
 * - routes /aegis commands
 *
 * You will wire this into your chat loop and Ghost-Layer UI.
 */
export declare function localAegisBootstrap(): Promise<(input: string) => Promise<import("./sovereign/commands/handleSovereignCommand.js").SovereignResponse>>;
