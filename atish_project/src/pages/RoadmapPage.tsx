import { RoadmapDashboard } from "../components/roadmap/RoadmapDashboard";
import { Seo } from "@/components/seo/Seo";

const RoadmapPage = () => {
  return (
    <>
      <Seo 
        title="Career Roadmap | FuturePath 3D" 
        description="Generate a personalized career roadmap using AI to guide your learning and career development."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 sm:text-5xl">
            AI-Powered Career <span className="text-primary italic">Roadmaps</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Bridge the gap between your aspirations and reality with a custom-built, industry-verified learning path.
          </p>
        </div>
        
        <RoadmapDashboard />
      </div>
    </>
  );
};

export default RoadmapPage;
