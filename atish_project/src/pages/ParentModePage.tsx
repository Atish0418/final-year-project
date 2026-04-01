import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { streams } from "../data/streams";
import { departments } from "../data/departments";
import { Seo } from "../components/Seo";

const ParentModePage = () => {
  const highlightStreams = streams.slice(0, 4);
  const highlightDepts = departments.slice(0, 4);

  return (
    <div className="page-container py-12 space-y-8">
      <Seo title="Parent Mode | FuturePath 3D" description="Simple course summaries for parents: value, stability, duration, and fit." />
      <SectionHeader
        eyebrow="Parent mode"
        title="Understand the value of each course in simple language."
        subtitle="See course value, job stability, duration, and whether it suits your child."
      />

      <Card
        title="At a glance"
        actions={<Button as="a" href="#/compare-courses">Compare courses</Button>}
      >
        <p className="text-sm text-gray-600">
          Use this view to quickly gauge course duration, job stability, future scope, and whether the path fits
          your child’s style (creative, hands-on, theory, or fast job entry).
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {highlightDepts.map((dept) => (
          <Card
            key={dept.id}
            eyebrow={dept.streamId.toUpperCase()}
            title={dept.name}
            actions={<Button as="a" href={`#/department/${dept.slug ?? dept.id}`} variant="ghost" className="text-xs px-3">View</Button>}
          >
            <div className="text-sm text-gray-600 space-y-2">
              <div><span className="text-gray-500">Duration:</span> {dept.duration}</div>
              <div><span className="text-gray-500">Job stability:</span> Steady with upskilling</div>
              <div><span className="text-gray-500">Future scope:</span> {dept.futureScope}</div>
              <div><span className="text-gray-500">Best for:</span> {dept.bestFor}</div>
              <div><span className="text-gray-500">Avoid if:</span> {dept.avoidIf}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="glass-panel rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Streams overview</h3>
        <div className="grid gap-3 md:grid-cols-4">
          {highlightStreams.map((stream) => (
            <Card
              key={stream.id}
              eyebrow="Stream"
              title={stream.title}
              actions={<Button as="a" href={`#/departments?stream=${stream.id}`} variant="ghost" className="text-xs px-3">See courses</Button>}
            >
              <p className="text-xs text-gray-600 line-clamp-3">{stream.summary}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentModePage;
