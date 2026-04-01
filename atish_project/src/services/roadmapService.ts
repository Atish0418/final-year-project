import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc,
  updateDoc 
} from "firebase/firestore";
import { initFirebase, firebaseEnabled } from "../lib/firebase";
import type { FullRoadmapData, RoadmapNode, RoadmapMetadata, RoadmapNodeStatus, JobProfile } from "../types/roadmap";

const getGeminiKey = () => import.meta.env.VITE_GEMINI_API_KEY || "";
const USE_LOCAL_AI = import.meta.env.VITE_USE_LOCAL_AI === 'true';
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "llama3.2";

async function ollamaGenerate(prompt: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: "json",
      }),
    });
    
    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Local AI Error:", error);
    throw new Error("Local AI (Ollama) is not responding. Please make sure Ollama is running or check your CORS settings.");
  }
}

export const generateRoadmap = async (targetRole: string, userProfile: any): Promise<FullRoadmapData> => {
  const GEMINI_API_KEY = getGeminiKey();

  const prompt = `
    You are an expert career coach and learning strategist. Based on the target job role: "${targetRole}", generate a detailed, personalized learning roadmap.
    
    Target Role: ${targetRole}
    User Bio: ${userProfile?.bio || "Student exploring career options"}
    User Skills: ${userProfile?.skills?.join(", ") || "Beginner"}

    Generate a roadmap as a JSON object with two main keys: "nodes" and "dependencies".

    - "nodes": An array of learning modules. Each node should be an object with:
        - "id": A unique string identifier for the node (e.g., "1", "2").
        - "title": A concise name for the learning module.
        - "details": A detailed, 2-3 sentence description of what the user will learn and why it's important.
        - "resources": An array of 2-3 high-quality, real-world learning resources (articles, tutorials, documentation). Each resource should be an object with "title" and "url".

    - "dependencies": An array of objects representing the relationships between nodes. Each object should have:
        - "source": The "id" of the node that must be completed first.
        - "target": The "id" of the node that depends on the source.

    Ensure the roadmap is comprehensive (exactly 10-12 nodes) and logical. The JSON MUST be valid.
  `;

  try {
    const response = await (USE_LOCAL_AI 
        ? ollamaGenerate(prompt)
        : (async () => {
            if (!GEMINI_API_KEY) throw new Error("Gemini API key is not configured.");
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent(prompt);
            const res = await result.response;
            return res.text();
          })()
    );
    
    const text = response;
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    const nodes: RoadmapNode[] = data.nodes.map((n: any) => ({
      ...n,
      id: String(n.id),
      progress: "not_started" as RoadmapNodeStatus
    }));

    const dependencies = data.dependencies.map((d: any) => ({
      source: String(d.source),
      target: String(d.target)
    }));

    const roadmapMetadata: RoadmapMetadata = {
      id: "", // Temporary
      userId: userProfile?.uid || "anonymous",
      targetRole,
      generatedAt: new Date().toISOString(),
      version: 1
    };

    return { roadmap: roadmapMetadata, nodes, dependencies };
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
};

export const saveRoadmap = async (data: FullRoadmapData): Promise<string> => {
  if (!firebaseEnabled) throw new Error("Firebase not enabled");
  const { db } = initFirebase();
  if (!db) throw new Error("Firebase DB not initialized");

  const roadmapPayload = {
    ...data.roadmap,
    nodes: data.nodes,
    dependencies: data.dependencies,
    createdAt: new Date().toISOString()
  };

  const roadmapRef = await addDoc(collection(db, "roadmaps"), roadmapPayload);
  return roadmapRef.id;
};

export const getUserRoadmaps = async (userId: string): Promise<FullRoadmapData[]> => {
  if (!firebaseEnabled) return [];
  const { db } = initFirebase();
  if (!db) return [];

  const q = query(collection(db, "roadmaps"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      roadmap: { ...data, id: doc.id } as RoadmapMetadata,
      nodes: data.nodes,
      dependencies: data.dependencies
    };
  });
};

export const getRoadmapById = async (roadmapId: string): Promise<FullRoadmapData | null> => {
    if (!firebaseEnabled) return null;
    const { db } = initFirebase();
    if (!db) return null;
  
    const docRef = doc(db, "roadmaps", roadmapId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        roadmap: { ...data, id: docSnap.id } as RoadmapMetadata,
        nodes: data.nodes,
        dependencies: data.dependencies
      };
    }
    return null;
  };

export const updateNodeProgress = async (roadmapId: string, nodeId: string, status: RoadmapNodeStatus) => {
  if (!firebaseEnabled) return;
  const { db } = initFirebase();
  if (!db) return;

  const roadmapRef = doc(db, "roadmaps", roadmapId);
  const roadmapSnap = await getDoc(roadmapRef);

  if (roadmapSnap.exists()) {
    const data = roadmapSnap.data();
    const updatedNodes = data.nodes.map((node: RoadmapNode) => {
      if (node.id === nodeId) {
        return { ...node, progress: status };
      }
      return node;
    });

    await updateDoc(roadmapRef, { nodes: updatedNodes });
  }
};

export const getJobSuggestions = async (userProfile: any): Promise<JobProfile[]> => {
  const GEMINI_API_KEY = getGeminiKey();
  
  const prompt = `
    Based on the following user profile, suggest 5 relevant and diverse job profiles. For each job profile, provide a title and a short description (1-2 sentences).

    User Profile:
    - Bio: ${userProfile?.bio || "Student"}
    - Skills: ${userProfile?.skills?.join(", ") || "Beginner"}
    - Interests: ${userProfile?.interests?.join(", ") || "General Career Exploration"}

    Return the suggestions as a JSON array of objects, where each object has a "title" and a "description" property.
    Example: [{"title": "Software Engineer", "description": "Build applications..."}, ...]
  `;

  try {
    const response = await (USE_LOCAL_AI 
        ? ollamaGenerate(prompt)
        : (async () => {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent(prompt);
            const res = await result.response;
            return res.text();
          })()
    );
    
    const text = response;
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error getting job suggestions:", error);
    // Return some defaults if AI fails
    return [
      { title: "Frontend Developer", description: "Design and implement user-facing features using modern web technologies." },
      { title: "Data Analyst", description: "Interpret data and turn it into information which can offer ways to improve a business." },
      { title: "UI/UX Designer", description: "Enhance user satisfaction by improving the usability and accessibility of products." }
    ];
  }
};
