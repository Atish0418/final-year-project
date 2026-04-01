import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AdminField } from "../../components/admin/AdminField";
import { getStreams, saveStream, deleteEntity } from "../../services/firebaseService";

export const StreamsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ id: "", title: "", summary: "", focus: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getStreams();
      setItems(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load streams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError(null);
    const payload = { title: form.title, summary: form.summary, focus: form.focus.split(",").map((s) => s.trim()) };
    const res = await saveStream(payload, form.id || undefined);
    if (!form.id) {
      setForm({ id: res.id, title: "", summary: "", focus: "" });
    } else {
      setForm({ id: "", title: "", summary: "", focus: "" });
    }
    load();
  };

  const edit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title ?? "",
      summary: item.summary ?? "",
      focus: (item.focus ?? []).join(", "),
    });
  };

  const remove = async (id: string) => {
    await deleteEntity("streams", id);
    load();
  };

  return (
    <div className="space-y-4">
      <Card title="Streams" actions={<Button onClick={submit}>{form.id ? "Update" : "Create"}</Button>}>
        <div className="grid gap-3 md:grid-cols-3">
          <AdminField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminField
            label="Focus (comma separated)"
            value={form.focus}
            onChange={(e) => setForm({ ...form, focus: e.target.value })}
            placeholder="Math, Physics, Coding"
          />
          <AdminField
            label="Summary"
            textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>
        {error ? <div className="text-xs text-rose-300">{error}</div> : null}
      </Card>

      {loading ? (
        <div className="text-sm text-neutral-400">Loading streams...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.id}
              title={item.title}
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
              <p className="text-sm text-neutral-300">{item.summary}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
