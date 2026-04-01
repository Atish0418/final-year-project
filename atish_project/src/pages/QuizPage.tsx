import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { quizQuestions } from "../data/quizQuestions";
import { calculateScores } from "../quiz/quizEngine";
import { mapResultsToNarrative } from "../quiz/quizResultMapper";
import { saveQuizResult } from "../services/firebaseService";
import { clearQuizState, loadQuizResultLocal, loadQuizState, saveQuizResultLocal, saveQuizState } from "../utils/quizStorage";
import type { QuizQuestion } from "../types/quiz";
import { Seo } from "../components/Seo";

const orderedQuestions = [...quizQuestions].filter((q) => q.enabled !== false).sort((a, b) => a.step - b.step);

const QuizPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [resumable, setResumable] = useState(false);

  useEffect(() => {
    const stored = loadQuizState();
    if (stored) {
      setAnswers(stored.answers ?? {});
      setCurrent(Math.min(orderedQuestions.length - 1, stored.step ?? 0));
      setResumable(true);
    }
  }, []);

  const progress = useMemo(() => {
    const answered = orderedQuestions.filter((q) => (answers[q.id] ?? []).length > 0).length;
    return Math.round((answered / orderedQuestions.length) * 100);
  }, [answers]);

  const currentQuestion: QuizQuestion = orderedQuestions[current];

  const selectOption = (question: QuizQuestion, optionId: string) => {
    setError(null);
    setResumable(false);
    setAnswers((prev) => {
      const existing = prev[question.id] ?? [];
      let next: string[] = [];
      if (question.type === "multi") {
        next = existing.includes(optionId) ? existing.filter((id) => id !== optionId) : [...existing, optionId];
      } else {
        next = [optionId];
      }
      const updated = { ...prev, [question.id]: next };
      saveQuizState({ answers: updated, step: current, lastUpdated: Date.now() });
      return updated;
    });
  };

  const goNext = async () => {
    if (!currentQuestion) return;
    if (!(answers[currentQuestion.id]?.length)) {
      setError("Please choose an option to continue.");
      return;
    }
    const isLast = current >= orderedQuestions.length - 1;
    if (!isLast) {
      setCurrent((c) => Math.min(c + 1, orderedQuestions.length - 1));
      return;
    }

    const computed = calculateScores(answers, orderedQuestions);
    const narrative = mapResultsToNarrative(computed);
    const payload = { answers, computed, narrative, completedAt: Date.now() };
    saveQuizResultLocal(payload);
    clearQuizState();
    try {
      await saveQuizResult(payload);
    } catch {
      // ignore if offline / firebase disabled
    }
    navigate("/quiz/result", { state: payload });
  };

  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const resumePrevious = () => setResumable(false);

  const retake = () => {
    clearQuizState();
    setAnswers({});
    setCurrent(0);
    setResumable(false);
  };

  const existingResult = loadQuizResultLocal();

  const totalSteps = Math.max(...orderedQuestions.map((q) => q.step));

  return (
    <div className="page-container py-8 space-y-6">
      <Seo
        title="Career Quiz After 12th | Get Personalized Course & Stream Matches"
        description="Answer quick questions to receive best-fit stream and course matches with reasons, jobs, and next steps tailored to your interests."
        canonicalPath="/quiz"
      />
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-white/5 via-primary/10 to-accent/10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 flex-wrap"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Career Guidance AI Quiz</div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Find your future path</h1>
            <p className="text-sm text-gray-700">
              Answer a few focused questions. We’ll score, explain signals, and recommend your top 3 streams.
            </p>
          </div>
          {existingResult ? (
            <Button variant="outline" onClick={() => navigate("/quiz/result")}>
              View last result
            </Button>
          ) : null}
        </motion.div>
        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Step {currentQuestion?.step} of {totalSteps}
          </span>
          <span>{progress}% complete</span>
        </div>
        <div className="relative h-3 w-full rounded-full bg-gray-50 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
          <div className="absolute inset-0 flex justify-between px-1">
            {[...Array(totalSteps)].map((_, i) => (
              <span
                key={i}
                className={`h-3 w-px ${currentQuestion?.step > i ? "bg-white/70" : "bg-gray-100"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {resumable ? (
        <Card title="Resume quiz">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>We found your previous answers. Continue where you left off?</span>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={retake}>
                Start over
              </Button>
              <Button onClick={resumePrevious}>Resume</Button>
            </div>
          </div>
        </Card>
      ) : null}

      <AnimatePresence mode="wait">
        {currentQuestion ? (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Card
              title={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
                    {current + 1}
                  </span>
                  <div>
                    <div className="text-xs uppercase text-gray-500">{currentQuestion.group}</div>
                    <div className="text-gray-900">{currentQuestion.question}</div>
                  </div>
                </div>
              }
            >
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const selected = (answers[currentQuestion.id] ?? []).includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => selectOption(currentQuestion, opt.id)}
                      className={`w-full text-left border rounded-xl px-4 py-3 transition backdrop-blur ${
                        selected
                          ? "border-primary/60 bg-primary/10 text-gray-900 shadow-[0_10px_40px_-20px_rgba(79,70,229,0.7)]"
                          : "border-gray-200 bg-gray-50 hover:border-white/25 text-gray-800"
                      }`}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{opt.text}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="h-2 w-2 rounded-full bg-primary/70" />
                          {selected ? "Chosen" : `Option ${idx + 1}`}
                        </div>
                      </div>
                      {opt.hint ? <div className="text-xs text-gray-500 mt-1">{opt.hint}</div> : null}
                    </motion.button>
                  );
                })}
              </div>
              {error ? <div className="text-xs text-rose-300 mt-3">{error}</div> : null}
              <div className="flex items-center justify-between mt-5">
                <Button variant="ghost" onClick={goPrev} disabled={current === 0}>
                  Previous
                </Button>
                <Button onClick={goNext}>{current === orderedQuestions.length - 1 ? "See my results" : "Next"}</Button>
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
