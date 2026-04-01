import type { StoredQuizState } from "../types/quiz";

const STATE_KEY = "fp3d-quiz-state";
const RESULT_KEY = "fp3d-quiz-result";

export const saveQuizState = (state: StoredQuizState) => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
};

export const loadQuizState = (): StoredQuizState | null => {
  const raw = localStorage.getItem(STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearQuizState = () => localStorage.removeItem(STATE_KEY);

export const saveQuizResultLocal = (data: any) => localStorage.setItem(RESULT_KEY, JSON.stringify(data));
export const loadQuizResultLocal = () => {
  const raw = localStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

