import { useParams, Link } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Button } from "../components/ui/Button";
import { Seo } from "../components/seo/Seo";
import { buildCollegeSeo } from "../utils/seoHelpers";

// Placeholder type for future college data integration.
// Replace this lookup with actual data source when available.
const mockCollegeFromSlug = (slug: string) => {
  const prettyName = slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  return {
    slug,
    name: prettyName,
    city: undefined,
    type: undefined,
    departments: undefined,
    summary: "College profile coming soon. This page will show courses, admissions, placements, and facilities.",
  };
};

const CollegeDetailsPage = () => {
  const { slug = "" } = useParams();
  const college = mockCollegeFromSlug(slug);
  const seo = buildCollegeSeo(college);

  return (
    <div className="page-container py-12 space-y-6">
      <Seo
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        ogType="article"
      />
      <SectionHeader
        eyebrow="College"
        title={college.name}
        subtitle="Detailed college profile will include courses, eligibility, fees, placements, and facilities."
      />
      <div className="glass-panel rounded-2xl border border-gray-200 p-6 space-y-3">
        <p className="text-sm text-gray-600">{college.summary}</p>
        <Button as={Link} to="/colleges" variant="ghost">
          Back to colleges
        </Button>
      </div>
    </div>
  );
};

export default CollegeDetailsPage;
