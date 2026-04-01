import { GoogleGenerativeAI } from "@google/generative-ai";

const USE_LOCAL_AI = import.meta.env.VITE_USE_LOCAL_AI === 'true';
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";

export async function chatWithAI(message: string, history: any[] = []) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const systemPrompt = "You are PathShala AI, a helpful career advisor for FuturePath 3D. Your goal is to help students explore career paths, understand stream choices (Engineering, Medical, Commerce, etc.), and provide guidance on college selections and career roadmap building. Keep your answers concise, professional, and friendly.";

  try {
    if (USE_LOCAL_AI) {
      const fullPrompt = `${systemPrompt}\n\n${history.map(h => `${h.role}: ${h.parts[0].text}`).join("\n")}\nuser: ${message}`;
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: fullPrompt,
          stream: false,
        }),
      });
      if (!response.ok) throw new Error("Ollama connection failed");
      const data = await response.json();
      return data.response;
    }

    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured.");
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.parts[0].text }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(message);
    const res = await result.response;
    return res.text();
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw error;
  }
}
