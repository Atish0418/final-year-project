import type { QuizComputedResult, QuizQuestion, QuizResult, StreamKey } from "../types/quiz";

const streamKeys: StreamKey[] = [
  "engineering",
  "medical",
  "artsScience",
  "commerce",
  "management",
  "design",
  "law",
  "agriculture",
  "diploma",
  "vocational",
  "government",
  "paramedical",
];

export type AnswerMap = Record<string, string[]>;

export const calculateScores = (answers: AnswerMap, questions: QuizQuestion[]): QuizComputedResult => {
  const totals: Record<StreamKey, number> = Object.fromEntries(streamKeys.map((k) => [k, 0])) as Record<StreamKey, number>;
  const breakdown = streamKeys.reduce(
    (acc, key) => {
      acc[key] = { score: 0, contributions: [] };
      return acc;
    },
    {} as Record<StreamKey, { score: number; contributions: { questionId: string; optionId: string; delta: number; question?: string; option?: string }[] }>,
  );

  questions
    .filter((q) => q.enabled !== false)
    .forEach((q) => {
      const selected = answers[q.id] ?? [];
      const qWeight = q.questionWeight ?? 1;
      selected.forEach((optId) => {
        const opt = q.options.find((o) => o.id === optId);
        if (!opt) return;
        Object.entries(opt.weight).forEach(([key, value]) => {
          const k = key as StreamKey;
          const delta = (value ?? 0) * qWeight;
          totals[k] = (totals[k] ?? 0) + delta;
          breakdown[k].score += delta;
          breakdown[k].contributions.push({ questionId: q.id, optionId: opt.id, delta, question: q.question, option: opt.text });
        });
      });
    });

  const totalScore = Object.values(totals).reduce((a, b) => a + b, 0);

  const top: QuizResult[] = streamKeys
    .map((stream) => {
      const score = totals[stream] ?? 0;
      const confidence = totalScore > 0 ? Math.round((score / Math.max(totalScore, score + 1)) * 100) : 0;
      return { stream, score, confidence };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { top, totalScore, breakdown };
};

export const progressByStep = (answers: AnswerMap, questions: QuizQuestion[]) => {
  const enabled = questions.filter((q) => q.enabled !== false);
  const steps = Math.max(...enabled.map((q) => q.step));
  const answered = enabled.filter((q) => (answers[q.id] ?? []).length > 0).length;
  return { steps, answered, completion: enabled.length ? Math.round((answered / enabled.length) * 100) : 0 };
};

export const nextUnansweredStep = (answers: AnswerMap, questions: QuizQuestion[], currentStep: number) => {
  const enabled = questions.filter((q) => q.enabled !== false);
  const byStep = enabled.reduce<Record<number, QuizQuestion[]>>((acc, q) => {
    acc[q.step] = acc[q.step] ? [...acc[q.step], q] : [q];
    return acc;
  }, {});
  for (let s = currentStep; s <= Math.max(...enabled.map((q) => q.step)); s++) {
    const list = byStep[s] ?? [];
    const allAnswered = list.every((q) => (answers[q.id] ?? []).length > 0);
    if (!allAnswered) return s;
  }
  return currentStep;
};
