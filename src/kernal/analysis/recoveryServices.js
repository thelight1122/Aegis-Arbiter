/**
 * The RecoveryService manages the transition from 'Shelved' to 'Integrated'.
 * It fulfills AXIOM_5_AWARENESS by requiring an intentional act of recognition.
 */
export class RecoveryService {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Transitions a shelved state back into the active channel.
     * Provides the parameters for AXIOM_6_CHOICE.
     */
    integrate(shelfId, peerNote) {
        const stmt = this.db.prepare(`
      UPDATE bookcase_items 
      SET status = 'INTEGRATED', 
          unshelved_at = ?, 
          unshelve_condition = ?
      WHERE id = ? AND status = 'SHELVED'
    `);
        const result = stmt.run(new Date().toISOString(), `Acknowledged: ${peerNote}`, shelfId);
        if (result.changes === 0) {
            return { ok: false, message: "Signal not found or already integrated." };
        }
        // AXIOM_12 (Internal reference): Signal acknowledged, energy neutralized.
        return { ok: true, message: "Signal integrated. System operating parameters updated." };
    }
}
