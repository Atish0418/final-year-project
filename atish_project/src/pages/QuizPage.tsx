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
import { QuizOption } from "../components/quiz/QuizOption";

const allQuestions = [...quizQuestions].filter((q) => q.enabled !== false).sort((a, b) => a.step - b.step);

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
      setResumable(true);
      // We don't restore 'current' directly because the path might have changed
    }
  }, []);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (!q.dependsOn) return true;
      const { questionId, optionId } = q.dependsOn;
      const answered = answers[questionId] ?? [];
      return answered.includes(optionId);
    });
  }, [answers]);

  const progress = useMemo(() => {
    const answered = filteredQuestions.filter((q) => (answers[q.id] ?? []).length > 0).length;
    return Math.round((answered / filteredQuestions.length) * 100);
  }, [answers, filteredQuestions]);

  const currentQuestion: QuizQuestion = filteredQuestions[current] || filteredQuestions[filteredQuestions.length - 1];

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
    const isLast = current >= filteredQuestions.length - 1;
    if (!isLast) {
      setCurrent((c) => Math.min(c + 1, filteredQuestions.length - 1));
      return;
    }

    // Always compute and navigate — don't block on Firebase
    const computed = calculateScores(answers, filteredQuestions);
    const narrative = mapResultsToNarrative(computed);
    const payload = { answers, computed, narrative, completedAt: Date.now() };

    saveQuizResultLocal(payload);
    clearQuizState();

    // Fire-and-forget Firebase, don't await
    saveQuizResult(payload).catch(() => {});

    navigate("/quiz/result", { state: payload });
  };

  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const resumePrevious = () => {
     setResumable(false);
     // Find the first unanswered question in the current filtered set
     const firstUnanswered = filteredQuestions.findIndex(q => !(answers[q.id]?.length));
     setCurrent(firstUnanswered === -1 ? filteredQuestions.length - 1 : firstUnanswered);
  };

  const retake = () => {
    clearQuizState();
    setAnswers({});
    setCurrent(0);
    setResumable(false);
  };

  const existingResult = loadQuizResultLocal();



  return (
    <div className="page-container py-4 space-y-4">
      <Seo
        title="Career Quiz After 12th | Get Personalized Course & Stream Matches"
        description="Answer quick questions to receive best-fit stream and course matches with reasons, jobs, and next steps tailored to your interests."
        canonicalPath="/quiz"
      />
      
      <div className="relative overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 flex-wrap relative z-10"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest mb-1.5">
              <span className="flex h-1 w-1 rounded-full bg-primary animate-pulse" /> AI Enhanced Guidance
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-none">Find your future path</h1>
          </div>
          {existingResult ? (
            <Button variant="outline" className="rounded-full px-4 h-8 text-xs" onClick={() => navigate("/quiz/result")}>
              View last result
            </Button>
          ) : null}
        </motion.div>
        
        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400">
            <span>
              Question {current + 1} / {filteredQuestions.length}
            </span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.6 }}
            />
          </div>
        </div>

        {resumable ? (
          <Card className="rounded-2xl border-primary/20 bg-primary/5 p-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Resume previous progress?</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="rounded-full px-4 h-8 text-xs font-semibold" onClick={retake}>
                  Start over
                </Button>
                <Button className="rounded-full px-5 h-8 text-xs font-bold" onClick={resumePrevious}>Resume</Button>
              </div>
            </div>
          </Card>
        ) : null}

        <AnimatePresence mode="wait">
          {currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/80">{currentQuestion.group} assessment</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const selected = (answers[currentQuestion.id] ?? []).includes(opt.id);
                  return (
                    <QuizOption
                      key={opt.id}
                      id={opt.id}
                      text={opt.text}
                      hint={opt.hint}
                      index={idx}
                      isSelected={selected}
                      onSelect={() => selectOption(currentQuestion, opt.id)}
                    />
                  );
                })}
              </div>

              {error ? (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[10px] font-medium text-center"
                >
                  {error}
                </motion.div>
              ) : null}

              <div className="flex items-center justify-between pt-2">
                <Button 
                  variant="ghost" 
                  className="rounded-full px-6 h-10 text-xs text-gray-500 hover:text-gray-900" 
                  onClick={goPrev} 
                  disabled={current === 0}
                >
                  Back
                </Button>
                <Button 
                  className="rounded-full px-8 h-10 text-sm font-bold shadow-md shadow-primary/20" 
                  onClick={goNext}
                >
                  {current === filteredQuestions.length - 1 ? "Analyze my path" : "Next Question"}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;
