// aegis-kernel.ts
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { IDS_SuggestionEngine, LensMonitor } from "./mirror-utils";

export async function runKernelAnalysis(input: string) {
  const ai = new GoogleGenerativeAI(process.env.API_KEY!);


  const systemInstruction = `
    ACT AS: AEGIS Kernel Mirror Substrate.
    TASK: Translate user "inhale" into deterministic tensor telemetry.
    OPERATING PARAMETERS: NON-FORCE, DETERMINISTIC, NEUTRAL.

    LENS BODIES:
      1. Mental: logic clarity
      2. Physical: somatic pressure
      3. Emotional: resonance
      4. Spiritual: teleological vector

    MAPPING:
      ptScores: raw high-entropy
      stScores: low-entropy stable state
      ids: identify / define / suggest
  `;

  const defaultScores = { mental: 0.5, physical: 0.5, emotional: 0.5, spiritual: 0.5 };

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nSIGNAL_INPUT: "${input}"` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            ptScores: {
              type: SchemaType.OBJECT,
              properties: {
                mental: { type: SchemaType.NUMBER },
                physical: { type: SchemaType.NUMBER },
                emotional: { type: SchemaType.NUMBER },
                spiritual: { type: SchemaType.NUMBER },
              },
            },
            stScores: {
              type: SchemaType.OBJECT,
              properties: {
                mental: { type: SchemaType.NUMBER },
                physical: { type: SchemaType.NUMBER },
                emotional: { type: SchemaType.NUMBER },
                spiritual: { type: SchemaType.NUMBER },
              },
            },
            ids: {
              type: SchemaType.OBJECT,
              properties: {
                identify: { type: SchemaType.STRING },
                define: { type: SchemaType.STRING },
                suggest: { type: SchemaType.STRING },
              },
            },
          },
        },
      },
    });

    if (!response.response.text()) throw new Error("Empty substrate response.");

    const parsed = JSON.parse(response.response.text());

    // normalize IDS
    const ids = IDS_SuggestionEngine.processEntry(parsed.ids);

    return {
      ptScores: parsed.ptScores || defaultScores,
      stScores: parsed.stScores || defaultScores,
      ids,
    };
  } catch (err: any) {
    console.error("Kernel error:", err.message || err);
    return {
      ptScores: defaultScores,
      stScores: defaultScores,
      ids: {
        identify: "KERNEL_ERROR",
        define: err.message,
        suggest: "Refer to logs.",
      },
    };
  }
}
