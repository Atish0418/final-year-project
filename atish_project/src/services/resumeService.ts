import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export async function improveTextWithAI(textToImprove: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are an expert career coach and resume writer. Rewrite the following resume text to be more impactful, professional, and achievement-oriented. Use strong action verbs and quantify results where possible. Keep the tone professional. Here is the text to improve: ${textToImprove}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error improving text with AI:", error);
    return textToImprove; // Fallback to original text
  }
}
