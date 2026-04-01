import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { calculateScores } from "../quiz/quizEngine";
import { mapResultsToNarrative } from "../quiz/quizResultMapper";
import { quizQuestions } from "../data/quizQuestions";
import { clearQuizState, loadQuizResultLocal, saveQuizResultLocal } from "../utils/quizStorage";
import { Seo } from "../components/Seo";

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData] = useState<any>(location.state ?? loadQuizResultLocal());

  useEffect(() => {
    if (!resultData || !resultData.answers) {
      navigate("/quiz");
    } else {
      saveQuizResultLocal(resultData);
    }
  }, [resultData, navigate]);

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
    <div className="page-container py-8 space-y-6">
      <Seo
        title="Quiz Results | FuturePath 3D"
        description="See your personalized stream recommendations based on the FuturePath 3D career quiz."
      />
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-primary/15 via-white/5 to-accent/15 p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Your Recommendations</div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Top career matches</h1>
            <p className="text-sm text-gray-700">Based on your answers, here are the best-fit streams.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={share}>
              Share
            </Button>
            <Button onClick={retake}>Retake quiz</Button>
          </div>
        </div>
        <div className="absolute -right-14 -bottom-16 h-36 w-36 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-primary/25 blur-3xl" />
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
