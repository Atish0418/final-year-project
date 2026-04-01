import { Box } from "lucide-react";

type ScenePlaceholderProps = {
  title?: string;
  description?: string;
};

const ScenePlaceholder = ({
  title = "React Three Fiber scene",
    description = "Drop your Canvas + R3F components here.",
}: ScenePlaceholderProps) => {
  return (
    <div className="glass-panel rounded-2xl border border-dashed border-primary/40 p-6 text-center text-neutral-200">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Box size={24} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
};

export default ScenePlaceholder;
