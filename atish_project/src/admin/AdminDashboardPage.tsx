import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const nav = useNavigate();
  const tiles = [
    { title: "Streams", desc: "Manage streams and focus areas", action: () => nav("/admin/streams") },
    { title: "Departments", desc: "Create and edit departments", action: () => nav("/admin/departments") },
    { title: "Jobs", desc: "Edit future jobs list", action: () => nav("/admin/jobs") },
    { title: "Quiz", desc: "Maintain quiz questions", action: () => nav("/admin/quiz") },
  ];
  return (
    <div className="space-y-4">
      <Card title="Admin overview">
        <p className="text-sm text-gray-600">Use the sections below to manage site content.</p>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {tiles.map((tile) => (
          <Card
            key={tile.title}
            title={tile.title}
            actions={
              <Button variant="ghost" className="text-xs px-3" onClick={tile.action}>
                Open
              </Button>
            }
          >
            <p className="text-sm text-gray-600">{tile.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
