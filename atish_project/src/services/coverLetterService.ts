import { GoogleGenerativeAI } from "@google/generative-ai";

const USE_LOCAL_AI = import.meta.env.VITE_USE_LOCAL_AI === 'true';
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";

export async function generateCoverLetterWithAI(jobDescription: string, userProfile?: any) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  const prompt = `You are an expert career coach and professional writer. Generate a highly personalized and compelling cover letter based on the following job description.
    
    Target Job Description:
    ${jobDescription}
    
    ${userProfile ? `User Profile Info:
    ${JSON.stringify(userProfile)}` : "Generate a professional template where the user can fill in their details."}
    
    The letter should be professional, enthusiastic, and highlight how the candidate's skills (or the placeholder skills if no profile provided) match the job requirements. Use a standard business letter format.`;

  try {
    if (USE_LOCAL_AI) {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: prompt,
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
    const result = await model.generateContent(prompt);
    const res = await result.response;
    return res.text();
  } catch (error) {
    console.error("Error generating cover letter with AI:", error);
    throw error;
  }
}
