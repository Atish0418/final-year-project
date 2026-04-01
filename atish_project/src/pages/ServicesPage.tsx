import { SectionHeader } from "../components/ui/SectionHeader";
import { Seo } from "../components/Seo";

const ServicesPage = () => {
  const services = [
    { name: "3D Future Labs", desc: "Interactive visualizations of future jobs and workflows." },
    { name: "Career Counseling", desc: "Expert guidance for stream selection and degree matching." },
    { name: "College Finder", desc: "Filter through verified universities and their exact fees structure." }
  ];

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Our Services | FuturePath 3D"
        description="Explore the premium services FuturePath 3D offers."
      />
      <SectionHeader
        eyebrow="What We Do"
        title="Our Services"
        subtitle="Discover how we streamline the education-to-career pipeline."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((s, i) => (
          <div key={i} className="glass-panel rounded-xl border border-gray-200 bg-white p-6 space-y-2">
             <h3 className="text-lg font-bold text-gray-900">{s.name}</h3>
             <p className="text-sm text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
