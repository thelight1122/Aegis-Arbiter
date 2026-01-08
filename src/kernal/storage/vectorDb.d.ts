/**
 * A simple in-memory vector database for demonstration purposes.
 *
 * @class VectorDb
 */
declare class VectorDb {
    /**
     * Creates a vector from a given text.
     *
     * @param {string} text - The text to be converted into a vector.
     * @returns {Promise<number[]>} - The vector representation of the text.
     */
    createVector(text: string): Promise<number[]>;
    /**
     * Compares two vectors and returns a similarity score.
     *
     * @param {number[]} vectorA - The first vector.
     * @param {number[]} vectorB - The second vector.
     * @returns {Promise<number>} - The similarity score.
     */
    compareVectors(vectorA: number[], vectorB: number[]): Promise<number>;
}
/**
 * Returns a singleton instance of the VectorDb.
 *
 * @returns {Promise<VectorDb>} - The VectorDb instance.
 */
export declare function getVectorDb(): Promise<VectorDb>;
export {};
