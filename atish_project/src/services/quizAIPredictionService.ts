const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";
const USE_LOCAL_AI = import.meta.env.VITE_USE_LOCAL_AI === 'true';

export interface CareerOption {
  title: string;       // e.g. "Computer Science Engineering"
  specialization: string; // e.g. "AI & Machine Learning"
  why: string;         // 1-sentence reason
}

export interface AIQuizPrediction {
  insight: string;
  topStreams: string[]; // kept for backward compat
  careers: CareerOption[];
}

export async function predictCareerWithAI(answers: any, questions: any[]): Promise<AIQuizPrediction> {
  const formattedAnswers = questions
    .filter(q => (answers[q.id] || []).length > 0)
    .map(q => {
      const selectedTexts = q.options
        .filter((o: any) => (answers[q.id] || []).includes(o.id))
        .map((o: any) => o.text);
      return `${q.question}: ${selectedTexts.join(", ")}`;
    }).join("\n");

  const prompt = `You are an expert career counselor for Indian students after 12th grade.
Based on the following student profile, provide specific and actionable career recommendations.

Student Profile:
${formattedAnswers}

Respond ONLY with this exact JSON (no extra text):
{
  "insight": "A personalized 2-sentence observation about this student's strengths and career personality.",
  "careers": [
    {
      "title": "Specific degree or field (e.g. B.Tech Computer Science)",
      "specialization": "Specific specialization (e.g. Artificial Intelligence & Data Science)",
      "why": "One sentence: why this fits this specific student."
    },
    {
      "title": "Second specific option",
      "specialization": "Specific specialization",
      "why": "One sentence reason."
    },
    {
      "title": "Third specific option",
      "specialization": "Specific specialization",
      "why": "One sentence reason."
    }
  ],
  "topStreams": ["Stream1", "Stream2", "Stream3"]
}`;

  try {
    if (!USE_LOCAL_AI) {
      return getFallback();
    }

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: "json"
      }),
    });

    if (!response.ok) throw new Error("AI prediction failed");
    const data = await response.json();
    let rawResponse = data.response;

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) rawResponse = jsonMatch[0];

    const parsed = JSON.parse(rawResponse);
    // ensure careers array always exists
    if (!parsed.careers?.length) parsed.careers = getFallback().careers;
    if (!parsed.topStreams?.length) parsed.topStreams = parsed.careers.map((c: CareerOption) => c.title);
    return parsed;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return getFallback();
  }
}

function getFallback(): AIQuizPrediction {
  return {
    insight: "You show a strong aptitude for analytical thinking combined with creative problem solving — a rare and powerful combination for modern careers.",
    careers: [
      {
        title: "B.Tech Computer Science Engineering",
        specialization: "Artificial Intelligence & Data Science",
        why: "Your logical mindset and interest in technology make AI/CS an ideal fit for you."
      },
      {
        title: "Bachelor of Design (B.Des)",
        specialization: "User Experience & Interaction Design",
        why: "Your creative instincts align well with designing intuitive digital experiences."
      },
      {
        title: "BBA / MBA",
        specialization: "Business Analytics & Strategy",
        why: "Your organizational approach and leadership traits are key in business management."
      }
    ],
    topStreams: ["Engineering", "Design", "Management"]
  };
}
