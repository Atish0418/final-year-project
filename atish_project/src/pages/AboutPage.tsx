import { SectionHeader } from "../components/ui/SectionHeader";
import { Seo } from "../components/Seo";
import { departments } from "../data/departments";

const AboutPage = () => {
  const totalCourses = new Set(departments.map((d) => d.id)).size;

  const cards = [
    {
      title: "Clear Career Guidance",
      description: "Understand all courses like Engineering, Medical, Arts, Commerce, and more with simple explanations.",
    },
    {
      title: "Explore All Courses",
      description: `Browse ${totalCourses}+ courses across all streams and discover what suits your interest and future goals.`,
    },
    {
      title: "Compare Departments",
      description: "Compare different courses side by side including duration, eligibility, and future job scope.",
    },
    {
      title: "Find Colleges",
      description: "Search colleges in Tamil Nadu by department, type, and explore top institutions easily.",
    },
    {
      title: "Smart Career Quiz",
      description: "Take a quiz to get personalized course recommendations based on your interests.",
    },
    {
      title: "Future Job Insights",
      description: "See career opportunities, salary trends, and future scope for each course.",
    },
  ];

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="About | FuturePath 3D"
        description="Why FuturePath 3D helps students choose the right course after 12th with clear guidance, comparisons, and college discovery."
      />
      <SectionHeader
        eyebrow="About"
        title="Why FuturePath 3D?"
        subtitle="Helping students choose the right career path after 12th."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="glass-panel rounded-xl border border-white/8 p-5 space-y-2 hover:border-primary/40 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
