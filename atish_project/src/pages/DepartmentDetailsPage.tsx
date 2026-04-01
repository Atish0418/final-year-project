import { memo, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Button } from "../components/ui/Button";
import { jobs } from "../data/jobs";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";
import { motion } from "framer-motion";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { localizeDepartment, localizeStream } from "../utils/i18n";
import { departments } from "../data/departments";
import { Seo } from "../components/seo/Seo";
import { buildDepartmentSeo } from "../utils/seoHelpers";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";

const pathTypeLabel: Record<string, string> = {
  degree: "Degree",
  diploma: "Diploma",
  certificate: "Certificate",
  technician: "Technician",
  specialization: "Specialization",
  professional: "Professional",
  "professional-degree": "Professional Degree",
  "integrated-law": "Integrated Law",
  "allied-health": "Allied Health",
  nursing: "Nursing",
  therapy: "Therapy",
  "public-health": "Public Health",
  "support-care": "Support Care",
  management: "Management",
  engineering: "Engineering",
  "applied-farming": "Applied Farming",
  "animal-science": "Animal Science",
  fisheries: "Fisheries",
  "food-processing": "Food Processing",
  "integrated-degree": "Integrated Degree",
  postgraduate: "Postgraduate",
  "legal-focus-area": "Legal Focus Area",
  "design-track": "Design Track",
  "media-track": "Media Track",
  "creative-track": "Creative Track",
  "interactive-media": "Interactive Media",
  "undergraduate-degree": "Undergraduate Degree",
  "postgraduate-degree": "Postgraduate Degree",
  "postgraduate-diploma": "PG Diploma",
  "short-term": "Short Term",
  polytechnic: "Polytechnic",
  "vocational-diploma": "Vocational Diploma",
  "technical-diploma": "Technical Diploma",
  "service-diploma": "Service Diploma",
  "healthcare-diploma": "Healthcare Diploma",
  "creative-diploma": "Creative Diploma",
  "trade-skill": "Trade Skill",
  "skill-course": "Skill Course",
  "vocational-course": "Vocational Course",
  "short-term-course": "Short-term Course",
  "job-role-training": "Job Role Training",
  "government-skill-program": "Govt Skill Program",
  "self-employment-track": "Self-employment Track",
  "exam-pathway": "Exam Path",
  "government-job": "Government Job",
  "service-path": "Service Path",
  "teaching-path": "Teaching Path",
  "defence-path": "Defence Path",
  "technical-path": "Technical Path",
  "judicial-path": "Judicial Path",
  "healthcare-path": "Healthcare Path",
  "research-path": "Research Path",
  "administrative-path": "Administrative Path",
};

const entryLevelLabel: Record<string, string> = {
  "after-10th": "After 10th",
  "after-10th-or-12th": "After 10th or 12th",
  "after-12th": "After 12th",
  "after-graduation": "After Graduation",
  "after-diploma": "After Diploma",
  "after-degree": "After Degree",
  "after-postgraduation": "After PG",
  "multiple-entry-levels": "Multiple Entry",
  "postgraduate-specialization": "Postgraduate",
  "short-term-upskilling": "Short-term",
  "working-professional": "Working Professional",
  "flexible-entry": "Flexible Entry",
};

const serviceTypeLabel: Record<string, string> = {
  "central-government": "Central Government",
  "state-government": "State Government",
  defence: "Defence",
  "banking-public-sector": "Banking/PSU",
  judiciary: "Judiciary",
  education: "Education",
  "medical-public-sector": "Medical (Govt)",
  "research-and-science": "Research/Science",
  "technical-government": "Technical",
  "rural-development": "Rural Development",
  "public-administration": "Public Administration",
};

const InfoList = memo(({ title, items }: { title: string; items: string[] }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
));
InfoList.displayName = "InfoList";

const TextBlock = memo(({ title, text }: { title: string; text: string }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
));
TextBlock.displayName = "TextBlock";

const DepartmentDetailsPage = () => {
  const lang = useLanguageStore((s) => s.lang);
  const { id, slug } = useParams();
  const dept = useMemo(() => {
    const key = slug || id;
    return key ? localizeDepartment(key, lang) : null;
  }, [id, slug, lang]);
  const favorites = useFavoritesStore();

  if (!dept) {
    return (
      <div className="page-container py-12 space-y-4">
        <SectionHeader eyebrow="Department" title="Not found" subtitle="This department does not exist." />
        <Button as={Link} to="/departments">
          Back to departments
        </Button>
      </div>
    );
  }

  const stream = localizeStream(dept.streamId, lang);

  const related = useMemo(() => {
    return departments
      .filter((d) => d.id !== dept.id)
      .filter((d) => d.streamId === dept.streamId)
      .filter(
        (d) =>
          d.category === dept.category ||
          d.relatedCategories?.some((c) => c === dept.category) ||
          dept.relatedCategories?.some((c) => c === d.category),
      )
      .slice(0, 6);
  }, [dept]);

  const careerPath = useMemo(
    () =>
      dept.pathType?.includes("exam")
        ? ["10th/12th/Degree", "Preparation", "Exam/Physical", "Training Academy", "Posting", "Promotion"]
        : ["12th", "Degree", "Skills", "Internship", "Job Roles", "Higher Studies / Specialization"],
    [dept.pathType],
  );

  const deptSeo = buildDepartmentSeo(dept);

  return (
    <div className="page-container py-12 space-y-6 overflow-x-hidden">
      <Seo
        title={deptSeo.title}
        description={deptSeo.description}
        canonicalPath={deptSeo.canonicalPath}
        ogType="article"
      />
      <Breadcrumbs
        items={[
          { label: "After 12th", to: "/streams" },
          stream ? { label: stream.title, to: `/departments?stream=${stream.id}` } : { label: "Stream" },
          { label: dept.name },
        ]}
      />
      <SectionHeader
        eyebrow={stream ? stream.title : "Department"}
        title={dept.name}
        subtitle={`${dept.duration} | Eligibility: ${dept.eligibility}`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          className="glass-panel rounded-2xl border border-gray-200 p-5 lg:col-span-2 space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap gap-2">
            {dept.category ? (
              <span className="text-xs rounded-full bg-primary/15 text-primary px-2 py-1 border border-primary/40">
                {dept.category.replace(/-/g, " ")}
              </span>
            ) : null}
            {dept.pathType ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Path: {pathTypeLabel[dept.pathType] ?? dept.pathType}
              </span>
            ) : null}
            {dept.entryLevel ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Entry: {entryLevelLabel[dept.entryLevel] ?? dept.entryLevel}
              </span>
            ) : null}
            {dept.degreeType ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Degree: {dept.degreeType === "be-btech" ? "B.E./B.Tech" : dept.degreeType === "barch" ? "B.Arch" : "Specialized"}
              </span>
            ) : null}
            {dept.deliveryMode ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Mode: {dept.deliveryMode}
              </span>
            ) : null}
            {dept.programType ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Program: {dept.programType}
              </span>
            ) : null}
            {dept.serviceType ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Service: {serviceTypeLabel[dept.serviceType] ?? dept.serviceType}
              </span>
            ) : null}
            {dept.examType ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Exam: {dept.examType.replace(/-/g, " ")}
              </span>
            ) : null}
            {dept.trendingLevel ? (
              <span className="text-[11px] rounded-full bg-amber-200/20 text-amber-200 px-2 py-1 border border-amber-200/30">
                Trending: {dept.trendingLevel}
              </span>
            ) : null}
            {dept.salaryBand ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Salary: {dept.salaryBand}
              </span>
            ) : null}
            {dept.entranceExams?.length ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Entrance: {dept.entranceExams.join(", ")}
              </span>
            ) : null}
            {dept.aliases?.length ? (
              <span className="text-[11px] rounded-full bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">
                Also known as: {dept.aliases.slice(0, 2).join(", ")}
              </span>
            ) : null}
          </div>
          <TextBlock title="Overview" text={dept.overview} />
          {dept.entranceExams?.length ? <InfoList title="Entrance exams" items={dept.entranceExams} /> : null}
          {dept.durationToPrepare ? <TextBlock title="Suggested prep time" text={dept.durationToPrepare} /> : null}
          {dept.qualificationRequired ? <TextBlock title="Qualification required" text={dept.qualificationRequired} /> : null}
          {dept.examStages?.length ? <InfoList title="Exam stages / selection steps" items={dept.examStages} /> : null}
          {dept.selectionProcess ? <TextBlock title="Selection process" text={dept.selectionProcess} /> : null}
          {dept.physicalRequirements ? <TextBlock title="Physical requirements" text={dept.physicalRequirements} /> : null}
          {dept.studyRoutes?.length ? <InfoList title="Recommended study routes" items={dept.studyRoutes} /> : null}
          {dept.recommendedCourses?.length ? <InfoList title="Useful courses to pair" items={dept.recommendedCourses} /> : null}
          <InfoList title="Key subjects" items={dept.keySubjects} />
          {dept.courseStructure?.length ? <InfoList title="Course structure / learning path" items={dept.courseStructure} /> : null}
          {dept.licensingNotes ? <TextBlock title="Licensing / registration" text={dept.licensingNotes} /> : null}
          {dept.clinicalExposure ? <TextBlock title="Clinical exposure" text={dept.clinicalExposure} /> : null}
          {dept.practicalTraining ? <TextBlock title="Practical training" text={dept.practicalTraining} /> : null}
          {dept.fieldExposure ? <TextBlock title="Field exposure" text={dept.fieldExposure} /> : null}
          {dept.practicalExposure ? <TextBlock title="Practical / moot / internship exposure" text={dept.practicalExposure} /> : null}
          {dept.internshipFocus ? <TextBlock title="Internship focus" text={dept.internshipFocus} /> : null}
          {dept.workshopFocus ? <TextBlock title="Workshop focus" text={dept.workshopFocus} /> : null}
          {dept.apprenticeshipOptions?.length ? <InfoList title="Apprenticeship options" items={dept.apprenticeshipOptions} /> : null}
          {dept.selfEmploymentPotential ? <TextBlock title="Self-employment potential" text={dept.selfEmploymentPotential} /> : null}
          {dept.certificationRecognition ? <TextBlock title="Certification / recognition" text={dept.certificationRecognition} /> : null}
          {dept.lateralEntryOptions?.length ? <InfoList title="Lateral entry options" items={dept.lateralEntryOptions} /> : null}
          {dept.specializationArea ? <TextBlock title="Specialization focus" text={dept.specializationArea} /> : null}
          {dept.creativeFocus ? <TextBlock title="Creative focus" text={dept.creativeFocus} /> : null}
          {dept.portfolioRequirement ? <TextBlock title="Portfolio requirement" text={dept.portfolioRequirement} /> : null}
          {dept.softwareTools?.length ? <InfoList title="Software / tools" items={dept.softwareTools} /> : null}
          <InfoList title="Skills needed" items={dept.skillsNeeded} />
          <div className="grid gap-3 md:grid-cols-2">
            <TextBlock title="Who should choose this?" text={dept.bestFor} />
            <TextBlock title="Avoid if" text={dept.avoidIf} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <InfoList title="Advantages" items={dept.advantages} />
            <InfoList title="Disadvantages" items={dept.disadvantages} />
          </div>
          <InfoList title="Future jobs" items={dept.futureJobs} />
          <InfoList title="Higher studies" items={dept.higherStudies} />
          {dept.promotionsAndGrowth ? <TextBlock title="Promotions & growth" text={dept.promotionsAndGrowth} /> : null}
          {dept.certifications?.length ? <InfoList title="Certifications" items={dept.certifications} /> : null}
          <TextBlock title="Future scope" text={dept.futureScope} />
          {dept.departments?.length ? <InfoList title="Departments / cadres" items={dept.departments} /> : null}
          {dept.industries?.length ? <InfoList title="Industries hiring" items={dept.industries} /> : null}
          {dept.workSettings?.length ? <InfoList title="Work settings" items={dept.workSettings} /> : null}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Career path</h3>
            <div className="flex flex-wrap gap-2">
              {careerPath.map((step, idx) => (
                <div key={step} className="flex items-center gap-2 text-xs text-gray-800">
                  <span className="rounded-full bg-gray-50 border border-gray-200 px-3 py-1">{step}</span>
                  {idx < careerPath.length - 1 && <span className="text-neutral-500">&gt;</span>}
                </div>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Related fields</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.id} to={`/department/${r.slug ?? r.id}`} className="block rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:border-primary/50">
                    <div className="text-sm text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.category?.replace(/-/g, " ")}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        <motion.div
          className="glass-panel rounded-2xl border border-gray-200 p-5 space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Quick actions</h3>
          </div>
          <div className="flex flex-col gap-2">
            <Button as={Link} to="/career-quiz" variant="ghost">
              Take career quiz
            </Button>
            <Button as={Link} to="/compare-courses" variant="ghost">
              Compare courses
            </Button>
            <Button
              variant={favorites.isSaved(dept.id) ? "outline" : "primary"}
              onClick={() =>
                favorites.toggle({
                  id: dept.id,
                  type: "department",
                  name: dept.name,
                  description: dept.overview,
                  streamId: dept.streamId,
                })
              }
            >
              {favorites.isSaved(dept.id) ? "Saved" : "Save favorite"}
            </Button>
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">Related future jobs</h4>
            <div className="flex flex-col gap-2">
              {dept.futureJobs.slice(0, 3).map((job) => (
                <div key={job} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-700">
                  {job}
                </div>
              ))}
              {jobs.slice(0, 2).map((job) => (
                <div key={job.title} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600">
                  <span className="text-gray-900">{job.title}</span> - {job.outlook}
                </div>
              ))}
            </div>
            </div>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">At a glance</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 flex items-center gap-2">
                <GraduationCap size={16} className="text-primary" /> <span>{dept.duration}</span>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 flex items-center gap-2">
                <BookOpen size={16} className="text-primary" /> <span>{dept.futureScope.split(".")[0]}</span>
              </div>
              {dept.relatedCategories?.length ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 col-span-2 text-gray-700">
                  Related areas: {dept.relatedCategories.map((c) => c.replace(/-/g, " ")).join(", ")}
                </div>
              ) : null}
              {dept.salaryBand ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 col-span-2 text-gray-700">
                  Salary band: {dept.salaryBand}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;
