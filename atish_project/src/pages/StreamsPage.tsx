import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { streams } from "../data/streams";
import { departments } from "../data/departments";
import { Seo } from "../components/Seo";

const StreamsPage = () => {
  const streamWithCounts = useMemo(
    () =>
      streams.map((stream) => ({
        ...stream,
        departmentCount: departments.filter((d) => d.streamId === stream.id).length,
      })),
    [],
  );

  return (
    <div className="page-container py-12 space-y-6">
      <Seo title="Streams | FuturePath 3D" description="Browse all higher-education streams and open departments to compare details." />
      <SectionHeader
        eyebrow="Streams"
        title="All higher-education streams after 12th"
        subtitle="Browse every stream and jump into departments for details on eligibility, subjects, and scope."
      />

      <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {streamWithCounts.map((stream) => (
          <Card
            key={stream.id}
            eyebrow={stream.title}
            title={stream.summary}
            actions={
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
                <Button
                  as={Link}
                  to={`/stream/${mapStreamToSlug(stream.id)}`}
                  variant="ghost"
                  className="text-xs px-3 w-full sm:w-auto"
                >
                  {stream.departmentCount} departments
                </Button>
                <Button
                  as={Link}
                  to={`/stream/${mapStreamToSlug(stream.id)}`}
                  variant="primary"
                  className="text-xs px-3 w-full sm:w-auto"
                >
                  Open {stream.title.toLowerCase()} explorer
                </Button>
              </div>
            }
          >
            <div className="flex flex-wrap gap-2">
              {stream.focus.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StreamsPage;

export const mapStreamToSlug = (id: string) => {
  switch (id) {
    case "diploma":
      return "diploma-polytechnic";
    case "vocational":
      return "vocational-skill-based";
    case "government":
      return "government-career-paths";
    default:
      return id;
  }
};
