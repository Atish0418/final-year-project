import { streams } from "../../data/streams";
import { departments } from "../../data/departments";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const StreamGrid = () => {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {streams.slice(0, 6).map((stream) => {
        const count = departments.filter((d) => d.streamId === stream.id).length;
        return (
          <Card
            key={stream.id}
            eyebrow={stream.title}
            title={stream.summary}
            actions={
              <Button as="a" href={`#/departments?stream=${stream.id}`} variant="ghost" className="text-xs px-3">
                {count} departments
              </Button>
            }
          >
            <div className="flex flex-wrap gap-2">
              {stream.focus.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full bg-white/5 px-2 py-1 text-neutral-200 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StreamGrid;
