import type { DatabaseSync as Database } from "node:sqlite";
export type AegisSessionStatus = "active" | "paused" | "closed";
export type AegisScopeType = "org" | "user";
export type PromotionConfig = {
    spacingMinutes: number;
    minTotal: number;
    minSpaced: number;
};
export type DecisionPacket = {
    sessionId: string;
    status: AegisSessionStatus;
    integrityResonance: number;
    pausedBecause?: {
        markerIds: string[];
        threshold: number;
    };
};
export declare class AegisSqliteRepo {
    private readonly db;
    constructor(db: Database);
    ensureSessionRow(params: {
        sessionId: string;
        orgId: string;
        userId: string;
    }): void;
    getSession(sessionId: string): {
        id: string;
        status: AegisSessionStatus;
        integrity_resonance: number;
        peer_state: string;
        org_id: string;
        user_id: string;
    } | null;
    setSessionStatus(sessionId: string, status: AegisSessionStatus): void;
    setIntegrityResonance(sessionId: string, resonance: number): void;
    getPromotionConfig(orgId: string, userId?: string): PromotionConfig;
    getPauseThreshold(orgId: string, userId?: string): number;
    private getTemporalConstraints;
    computeIntegrityResonance(params: {
        roots: Record<string, 0 | 1>;
        compassionReady: boolean;
    }): number;
    maybePauseSession(params: {
        orgId: string;
        userId: string;
        sessionId: string;
        integrityResonance: number;
        violatedRootMarkerIds: string[];
    }): DecisionPacket;
}
