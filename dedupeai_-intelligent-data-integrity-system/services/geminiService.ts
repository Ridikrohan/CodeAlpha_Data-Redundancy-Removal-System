
import { GoogleGenAI, Type } from "@google/genai";
import { DataEntry, ClassificationResult, EntryStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const classificationSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description: "Classification of the new data entry: VERIFIED (unique/good), REDUNDANT (duplicate or semantically identical), or FALSE_POSITIVE (logically incorrect, gibberish, or noisy data).",
    },
    reason: {
      type: Type.STRING,
      description: "A brief explanation of why this classification was chosen.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score from 0 to 1.",
    }
  },
  required: ["status", "reason", "confidence"],
};

export const classifyData = async (
  newData: string,
  existingData: DataEntry[]
): Promise<ClassificationResult> => {
  // We only send a sample of existing data to avoid token limits, prioritizing recent or similar items would be better but here we just take the last 20.
  const context = existingData
    .slice(-20)
    .map(e => `[${e.status}] ${e.content}`)
    .join("\n");

  const prompt = `
    Analyze the following NEW DATA entry and determine if it should be added to our database.
    
    EXISTING DATA CONTEXT (Last 20 records):
    ${context || "No existing records."}

    NEW DATA TO VALIDATE:
    "${newData}"

    CRITERIA:
    1. REDUNDANT: If the content is exactly the same OR conveys the same information as an existing record.
    2. FALSE_POSITIVE: If the content is logically incorrect, contains obvious errors, is complete gibberish, or is purely noise/spam.
    3. VERIFIED: If the content is unique, accurate, and provides new information.

    Return the classification as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: classificationSchema,
      },
    });

    const result = JSON.parse(response.text);
    
    // Safety check for enum values
    let status = EntryStatus.VERIFIED;
    if (result.status === "REDUNDANT") status = EntryStatus.REDUNDANT;
    if (result.status === "FALSE_POSITIVE") status = EntryStatus.FALSE_POSITIVE;

    return {
      status,
      reason: result.reason,
      confidence: result.confidence
    };
  } catch (error) {
    console.error("Gemini Classification Error:", error);
    return {
      status: EntryStatus.VERIFIED, // Fail open or closed? Here we default to verified but in prod we'd handle errors better.
      reason: "Error during automated validation. Proceeding with caution.",
      confidence: 0.5
    };
  }
};
