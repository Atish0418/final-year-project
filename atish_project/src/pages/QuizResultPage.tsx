import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { calculateScores } from "../quiz/quizEngine";
import { mapResultsToNarrative } from "../quiz/quizResultMapper";
import { quizQuestions } from "../data/quizQuestions";
import { clearQuizState, loadQuizResultLocal, saveQuizResultLocal } from "../utils/quizStorage";
import { predictCareerWithAI, type AIQuizPrediction } from "../services/quizAIPredictionService";
import { Seo } from "../components/Seo";

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData] = useState<any>(location.state ?? loadQuizResultLocal());
  const [aiPrediction, setAiPrediction] = useState<AIQuizPrediction | null>(resultData?.aiPrediction ?? null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (!resultData || !resultData.answers) {
      navigate("/quiz");
      return;
    }

    saveQuizResultLocal({ ...resultData, aiPrediction });

    // Lazy load AI prediction if missing
    if (!aiPrediction && !isAiLoading) {
      setIsAiLoading(true);
      const filterQs = [...quizQuestions].filter((q) => {
        if (!q.dependsOn) return true;
        return (resultData.answers[q.dependsOn.questionId] ?? []).includes(q.dependsOn.optionId);
      });

      predictCareerWithAI(resultData.answers, filterQs).then(pred => {
        setAiPrediction(pred);
        setIsAiLoading(false);
        // Persist with AI result
        saveQuizResultLocal({ ...resultData, aiPrediction: pred });
      }).catch(() => {
        setIsAiLoading(false);
      });
    }
  }, [resultData, navigate, aiPrediction, isAiLoading]);

  const computed = useMemo(() => {
    if (!resultData?.answers) return null;
    if (!resultData?.computed || !resultData?.computed?.breakdown) {
      return calculateScores(resultData.answers, quizQuestions);
    }
    return resultData.computed;
  }, [resultData]);

  const narratives = useMemo(() => (computed ? mapResultsToNarrative(computed) : []), [computed]);

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My FuturePath 3D Quiz result",
        text: `My top match is ${narratives[0]?.title}. Check yours!`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard.");
    }
  };

  const retake = () => {
    clearQuizState();
    navigate("/quiz");
  };

  if (!computed) return null;

  return (
    <div className="page-container py-8 space-y-8 max-w-5xl mx-auto">
      <Seo
        title="Quiz Results | CareerCompass"
        description="See your personalized stream recommendations based on the CareerCompass career quiz."
      />

      {/* AI Deep Insight - Only show if ready, no loader/placeholder */}
      <AnimatePresence>
        {aiPrediction && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 sm:p-10 shadow-sm mb-8"
          >
            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                ✨ AI Counselor Deep Insight
              </div>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl italic">
                "{aiPrediction.insight}"
              </p>
              {aiPrediction.careers?.length > 0 && (
                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  {aiPrediction.careers.map((career: any, i: number) => (
                    <motion.div
                      key={career.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary/10 p-4 space-y-1.5 shadow-sm"
                    >
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                        {i === 0 ? "🥇 Best Fit" : i === 1 ? "🥈 Strong Match" : "🥉 Good Option"}
                      </div>
                      <div className="font-bold text-gray-900 text-sm leading-tight">{career.title}</div>
                      <div className="text-xs text-primary font-semibold bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full inline-block">
                        {career.specialization}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pt-0.5">{career.why}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Technical Breakdown</h2>
        {aiPrediction && (
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-full px-5" onClick={share}>
              Share
            </Button>
            <Button className="rounded-full px-6" onClick={retake}>Retake quiz</Button>
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {narratives.map((item, idx) => (
          <motion.div
            key={item.stream}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.25, ease: "easeOut" }}
          >
            <Card
              title={`${idx === 0 ? "Top match" : idx === 1 ? "Great alternative" : "Also consider"} — ${item.title}`}
              actions={
                <Button as="a" href={item.streamPath} variant={idx === 0 ? "primary" : "ghost"} className="text-xs px-3">
                  Explore this path
                </Button>
              }
            >
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{item.confidence}% fit</span>
                  <span className="text-xs text-gray-500">Score {item.score}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">Rank #{idx + 1}</span>
                  <span className="px-2 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700">Signals {item.signals?.length ?? 0}</span>
                </div>
                <p className="text-gray-700">{item.why}</p>
                {item.signals?.length ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Signals from your answers</div>
                    <ul className="list-disc list-inside space-y-1">
                      {item.signals.map((s: string) => (
                        <li key={s} className="text-xs text-gray-700">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Strengths we detected</div>
                  <div className="flex flex-wrap gap-2">
                    {item.strengths.map((s: string) => (
                      <span key={s} className="text-xs px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Suggested courses</div>
                  <ul className="list-disc list-inside space-y-1">
                    {item.courses.length ? (
                      item.courses.map((c: string) => (
                        <li key={c} className="text-xs text-gray-700">
                          {c}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-gray-500">Explore departments in this stream</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Future jobs</div>
                  <div className="flex flex-wrap gap-2">
                    {item.futureJobs.map((job: string) => (
                      <span key={job} className="text-xs px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary">
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Roadmap</div>
                  <ul className="list-disc list-inside space-y-1">
                    {item.roadmap.map((r: string) => (
                      <li key={r} className="text-xs text-gray-700">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card title="Why not the other fields?">
        <p className="text-sm text-gray-600">
          Fields not listed in your top 3 had lower alignment based on your interests, skills, and preferences. Retake the quiz to tweak your inputs or explore any stream
          directly to learn more.
        </p>
      </Card>
    </div>
  );
};

export default QuizResultPage;
