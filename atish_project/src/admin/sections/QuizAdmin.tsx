import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AdminField } from "../../components/admin/AdminField";
import { getQuizQuestions, saveQuizQuestion, deleteEntity } from "../../services/firebaseService";
import type { QuizQuestion } from "../../types/quiz";

const blankQuestion = (): QuizQuestion => ({
  id: "",
  step: 1,
  group: "interest",
  question: "",
  type: "single",
  enabled: true,
  options: [
    { id: "opt-1", text: "", weight: {} },
    { id: "opt-2", text: "", weight: {} },
  ],
});

export const QuizAdmin = () => {
  const [items, setItems] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<QuizQuestion>(blankQuestion());
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getQuizQuestions();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.question.trim()) {
      setError("Question required");
      return;
    }
    if (form.options.some((o) => !o.text.trim())) {
      setError("All options need text");
      return;
    }
    setError(null);
    const cleaned: QuizQuestion = {
      ...form,
      id: form.id || `quiz-${Date.now()}`,
      enabled: form.enabled !== false,
      options: form.options.map((o, idx) => ({
        ...o,
        id: o.id || `opt-${idx}`,
        weight: o.weight || {},
      })),
    };
    await saveQuizQuestion(cleaned, form.id || undefined);
    setForm(blankQuestion());
    load();
  };

  const edit = (item: any) => {
    setForm({
      id: item.id,
      step: item.step ?? 1,
      group: item.group ?? "interest",
      question: item.question ?? item.prompt ?? "",
      type: item.type ?? "single",
      enabled: item.enabled !== false,
      options: (item.options ?? []).map((o: any, idx: number) => ({
        id: o.id ?? `opt-${idx}`,
        text: o.text ?? "",
        weight: o.weight ?? {},
      })),
    });
  };

  const remove = async (id: string) => {
    await deleteEntity("quizQuestions", id);
    load();
  };

  return (
    <div className="space-y-4">
      <Card title="Quiz questions" actions={<Button onClick={submit}>{form.id ? "Update" : "Create"}</Button>}>
        <div className="grid gap-3 md:grid-cols-2">
          <AdminField label="Question" value={form.question} required onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <div className="grid grid-cols-3 gap-2 text-xs text-neutral-200">
            <AdminField label="Step" value={String(form.step)} required onChange={(e) => setForm({ ...form, step: Number(e.target.value) })} />
            <label className="flex flex-col gap-1 text-neutral-200">
              Group
              <select
                className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white"
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value as any })}
              >
                <option value="basic">Basic</option>
                <option value="interest">Interest</option>
                <option value="skill">Skill</option>
                <option value="personality">Personality</option>
                <option value="preference">Preference</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-neutral-200">
              Type
              <select
                className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              >
                <option value="single">Single</option>
                <option value="multi">Multi</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-200">
            <input type="checkbox" checked={form.enabled !== false} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Enabled
          </label>
        </div>

        <div className="mt-3 space-y-2">
          <div className="text-xs text-neutral-400">Options & weights (use numbers; keys like engineering, medical, commerce...)</div>
          {form.options.map((opt, idx) => (
            <div key={opt.id} className="grid md:grid-cols-2 gap-2 items-start">
              <AdminField
                label={`Option ${idx + 1}`}
                value={opt.text}
                onChange={(e) => {
                  const next = [...form.options];
                  next[idx] = { ...next[idx], text: e.target.value };
                  setForm({ ...form, options: next });
                }}
              />
              <AdminField
                label='Weights (JSON e.g. {"engineering":3,"medical":1})'
                value={JSON.stringify(opt.weight ?? {})}
                onChange={(e) => {
                  const next = [...form.options];
                  try {
                    const parsed = JSON.parse(e.target.value || "{}");
                    next[idx] = { ...next[idx], weight: parsed };
                    setError(null);
                  } catch {
                    setError("Invalid JSON in weights");
                  }
                  setForm({ ...form, options: next });
                }}
              />
            </div>
          ))}
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => setForm({ ...form, options: [...form.options, { id: `opt-${form.options.length + 1}`, text: "", weight: {} }] })}
          >
            + Add option
          </Button>
        </div>
        {error ? <div className="text-xs text-rose-300 mt-2">{error}</div> : null}
      </Card>

      {loading ? (
        <div className="text-sm text-neutral-400">Loading quiz questions...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.id}
              title={item.question ?? ""}
              actions={
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-xs px-3" onClick={() => edit(item)}>
                    Edit
                  </Button>
                  <Button variant="outline" className="text-xs px-3" onClick={() => remove(item.id)}>
                    Delete
                  </Button>
                </div>
              }
            >
              <p className="text-xs text-neutral-300">
                Step {item.step} · {item.group} · Options: {(item.options ?? []).length} · {item.enabled === false ? "Disabled" : "Enabled"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
