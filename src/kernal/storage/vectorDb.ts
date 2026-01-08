
import { getEncoding } from "js-tiktoken";

const tiktoken = getEncoding("cl100k_base");

/**
 * A simple in-memory vector database for demonstration purposes.
 *
 * @class VectorDb
 */
class VectorDb {
    /**
     * Creates a vector from a given text.
     *
     * @param {string} text - The text to be converted into a vector.
     * @returns {Promise<number[]>} - The vector representation of the text.
     */
    async createVector(text: string): Promise<number[]> {
        return tiktoken.encode(text);
    }

    /**
     * Compares two vectors and returns a similarity score.
     *
     * @param {number[]} vectorA - The first vector.
     * @param {number[]} vectorB - The second vector.
     * @returns {Promise<number>} - The similarity score.
     */
    async compareVectors(vectorA: number[], vectorB: number[]): Promise<number> {
        const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
        const magnitudeA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
        const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
}

let vectorDb: VectorDb;

/**
 * Returns a singleton instance of the VectorDb.
 *
 * @returns {Promise<VectorDb>} - The VectorDb instance.
 */
export async function getVectorDb(): Promise<VectorDb> {
    if (!vectorDb) {
        vectorDb = new VectorDb();
    }
    return vectorDb;
}
