import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.warn(
    "[Gemini] GEMINI_API_KEY is not configured. Vision scan will not work.",
  );
}

export const gemini = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Get the Gemini Vision model for image analysis
 * Defaults to gemini-2.0-flash-exp (speed/cost balance)
 * Override with GEMINI_VISION_MODEL if needed (e.g. gemini-2.0-pro).
 */
export function getVisionModel() {
  if (!gemini) {
    throw new Error("Gemini API key is not configured");
  }

  const model = process.env.GEMINI_VISION_MODEL ?? "gemini-2.0-flash-exp";

  return gemini.getGenerativeModel({
    model,
    generationConfig: {
      // We want deterministic extraction, not creativity.
      temperature: 0,
    },
  });
}
