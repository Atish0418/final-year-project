export type StreamKey =
  | "engineering"
  | "medical"
  | "artsScience"
  | "commerce"
  | "management"
  | "design"
  | "law"
  | "agriculture"
  | "diploma"
  | "vocational"
  | "government"
  | "paramedical";

export type QuizOptionWeight = Partial<Record<StreamKey, number>>;

export type QuizOption = {
  id: string;
  text: string;
  weight: QuizOptionWeight;
  hint?: string;
};

export type QuizQuestion = {
  id: string;
  step: number;
  group: "interest" | "skill" | "personality" | "preference" | "basic";
  question: string;
  type: "single" | "multi" | "scale";
  questionWeight?: number;
  enabled?: boolean;
  options: QuizOption[];
};

export type QuizAnswer = {
  questionId: string;
  optionIds: string[];
};

export type QuizResult = {
  stream: StreamKey;
  score: number;
  confidence: number;
};

export type QuizComputedResult = {
  top: QuizResult[];
  totalScore: number;
  breakdown: Record<
    StreamKey,
    {
      score: number;
      contributions: { questionId: string; optionId: string; delta: number; question?: string; option?: string }[];
    }
  >;
};

export type StoredQuizState = {
  answers: Record<string, string[]>;
  step: number;
  lastUpdated: number;
};
