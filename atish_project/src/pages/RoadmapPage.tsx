import { RoadmapDashboard } from "../components/roadmap/roadmap-dashboard";
import { Seo } from "@/components/seo/Seo";

const RoadmapPage = () => {
  return (
    <>
      <Seo 
        title="Career Roadmap | FuturePath 3D" 
        description="Generate a personalized career roadmap using AI to guide your learning and career development."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            Career <span className="text-primary">Roadmap</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI-powered guide from where you are to where you want to be.
          </p>
        </div>
        
        <RoadmapDashboard />
      </div>
    </>
  );
};

export default RoadmapPage;
