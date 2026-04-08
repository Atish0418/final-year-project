const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";
const USE_LOCAL_AI = import.meta.env.VITE_USE_LOCAL_AI === 'true';

export interface AIQuizPrediction {
  insight: string;
  topStreams: string[];
}

export async function predictCareerWithAI(answers: any, questions: any[]): Promise<AIQuizPrediction> {
  const formattedAnswers = questions.map(q => {
    const selectedIds = answers[q.id] || [];
    const selectedTexts = q.options
      .filter((o: any) => selectedIds.includes(o.id))
      .map((o: any) => o.text);
    return `Q: ${q.question} | A: ${selectedTexts.join(", ")}`;
  }).join("\n");

  const prompt = `
You are an expert career counselor for Indian students. Based on the following student quiz answers, provide:
1. A deep insight (2-3 sentences) about their personality type and potential career trajectory.
2. Top 3 career streams they should explore.

Answers:
${formattedAnswers}

Format your response strictly as JSON:
{
  "insight": "Your deep insight here...",
  "topStreams": ["Stream 1", "Stream 2", "Stream 3"]
}
`;

  try {
    if (!USE_LOCAL_AI) {
        // Fallback or ignore if not enabled
        return { insight: "", topStreams: [] };
    }

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: "json"
      }),
    });

    if (!response.ok) throw new Error("AI prediction failed");
    const data = await response.json();
    let rawResponse = data.response;

    // Robust JSON extraction
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawResponse = jsonMatch[0];
    }

    return JSON.parse(rawResponse);
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return {
      insight: "Based on your answers, you show a strong aptitude for structured work and creative problem solving.",
      topStreams: ["Engineering", "Design", "Management"]
    };
  }
}
