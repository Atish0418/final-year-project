import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AdminField } from "../../components/admin/AdminField";
import { getJobs, saveJob, deleteEntity } from "../../services/firebaseService";

export const JobsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: "", title: "", outlook: "", skills: "" });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Title required");
      return;
    }
    setError(null);
    await saveJob({ title: form.title, outlook: form.outlook, skills: form.skills.split(",").map((s) => s.trim()) }, form.id || undefined);
    setForm({ id: "", title: "", outlook: "", skills: "" });
    load();
  };

  const edit = (item: any) => {
    setForm({
      id: item.id,
      title: item.title ?? "",
      outlook: item.outlook ?? "",
      skills: (item.skills ?? []).join(", "),
    });
  };

  const remove = async (id: string) => {
    await deleteEntity("jobs", id);
    load();
  };

  return (
    <div className="space-y-4">
      <Card title="Jobs" actions={<Button onClick={submit}>{form.id ? "Update" : "Create"}</Button>}>
        <div className="grid gap-3 md:grid-cols-3">
          <AdminField label="Title" value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminField label="Outlook" value={form.outlook} onChange={(e) => setForm({ ...form, outlook: e.target.value })} />
          <AdminField label="Skills (comma)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>
        {error ? <div className="text-xs text-rose-300">{error}</div> : null}
      </Card>

      {loading ? (
        <div className="text-sm text-neutral-400">Loading jobs...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item, idx) => (
            <Card
              key={item.id ?? `${item.title ?? "job"}-${idx}`}
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
              <p className="text-sm text-neutral-300">{item.outlook}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
