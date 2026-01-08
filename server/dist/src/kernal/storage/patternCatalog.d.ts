import type { Database } from "better-sqlite3";
export interface PatternMatch {
    pattern_id: string;
    axiom_tag: string;
    occurrence_count: number;
    last_resolution: string;
}
/**
 * The PatternCatalogService (PIM/QRC) identifies recurring drift.
 * It fulfills the requirement for a 'Quick Reference Catalog' (MAP v1.7).
 */
export declare class PatternCatalogService {
    private db;
    constructor(db: Database);
    /**
     * Generates a fingerprint and checks for a known friction pattern.
     * Fulfills AXIOM_5_AWARENESS.
     */
    check(findingText: string): PatternMatch | null;
}
