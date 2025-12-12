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
 * Uses gemini-2.0-flash-exp for optimal speed/cost balance
 */
export function getVisionModel() {
  if (!gemini) {
    throw new Error("Gemini API key is not configured");
  }

  return gemini.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
}
