import { jobs } from "../data/jobs";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Seo } from "../components/Seo";

const FutureJobsPage = () => {
  return (
    <div className="page-container py-12 space-y-6">
      <Seo
        title="Future Jobs | FuturePath 3D"
        description="Explore future-facing careers, growth outlook, and required skills to help learners plan their path."
      />
      <SectionHeader
        eyebrow="Future jobs"
        title="Careers your learners can grow into."
        subtitle="Attach hiring partner data or labor insights to these cards."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.title} className="glass-panel rounded-xl border border-gray-200 p-5 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.outlook}</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutureJobsPage;
