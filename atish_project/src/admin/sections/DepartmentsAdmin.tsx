import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AdminField } from "../../components/admin/AdminField";
import { getDepartments, saveDepartment, deleteEntity, getStreams } from "../../services/firebaseService";
import { engineeringCategories } from "../../data/engineeringCategories";
import { artsScienceCategories } from "../../data/artsScienceCategories";
import { commerceCategories } from "../../data/commerceCategories";
import { paramedicalCategories } from "../../data/paramedicalCategories";
import { medicalCategories } from "../../data/medicalCategories";
import { agricultureCategories } from "../../data/agricultureCategories";
import { lawCategories } from "../../data/lawCategories";
import { designMediaCategories } from "../../data/designMediaCategories";
import { managementCategories } from "../../data/managementCategories";
import { diplomaCategories } from "../../data/diplomaCategories";
import { vocationalCategories } from "../../data/vocationalCategories";
import { governmentCategories } from "../../data/governmentCategories";

const splitList = (value: string) => value.split(",").map((s) => s.trim()).filter(Boolean);

export const DepartmentsAdmin = () => {
  const [items, setItems] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: "",
    streamId: "",
    slug: "",
    tamilName: "",
    category: "",
    relatedCategories: "",
    entranceExams: "",
    aliases: "",
    pathType: "",
    degreeType: "",
    deliveryMode: "",
    programType: "",
    examType: "",
    serviceType: "",
    courseStructure: "",
    name: "",
    overview: "",
    duration: "",
    eligibility: "",
    certifications: "",
    salaryBand: "",
    keySubjects: "",
    skillsNeeded: "",
    advantages: "",
    disadvantages: "",
    futureJobs: "",
    higherStudies: "",
    practicalTraining: "",
    clinicalExposure: "",
    fieldExposure: "",
    practicalExposure: "",
    internshipFocus: "",
    workshopFocus: "",
    apprenticeshipOptions: "",
    selfEmploymentPotential: "",
    certificationRecognition: "",
    lateralEntryOptions: "",
    durationToPrepare: "",
    qualificationRequired: "",
    examStages: "",
    selectionProcess: "",
    physicalRequirements: "",
    studyRoutes: "",
    recommendedCourses: "",
    promotionsAndGrowth: "",
    departments: "",
    specializationArea: "",
    creativeFocus: "",
    portfolioRequirement: "",
    softwareTools: "",
    entryLevel: "",
    bestFor: "",
    avoidIf: "",
    futureScope: "",
    industries: "",
    workSettings: "",
    trendingLevel: "medium",
    featured: false,
    order: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [d, s] = await Promise.all([getDepartments(), getStreams()]);
      setItems(d);
      setStreams(s);
    } catch (e: any) {
      setError(e.message ?? "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.name.trim() || !form.streamId) {
      setError("Stream and name are required");
      return;
    }
    setError(null);
    const payload = {
      streamId: form.streamId,
      slug: form.slug || undefined,
      tamilName: form.tamilName || undefined,
      category: form.category || undefined,
      relatedCategories: splitList(form.relatedCategories),
      entranceExams: splitList(form.entranceExams),
      aliases: splitList(form.aliases),
      pathType: form.pathType || undefined,
      degreeType: form.degreeType || undefined,
      deliveryMode: form.deliveryMode || undefined,
      programType: form.programType || undefined,
      examType: form.examType || undefined,
      serviceType: form.serviceType || undefined,
      courseStructure: splitList(form.courseStructure),
      creativeFocus: form.creativeFocus || undefined,
      portfolioRequirement: form.portfolioRequirement || undefined,
      softwareTools: splitList(form.softwareTools),
      practicalTraining: form.practicalTraining || undefined,
      clinicalExposure: form.clinicalExposure || undefined,
      practicalExposure: form.practicalExposure || undefined,
      internshipFocus: form.internshipFocus || undefined,
      workshopFocus: form.workshopFocus || undefined,
      apprenticeshipOptions: splitList(form.apprenticeshipOptions),
      selfEmploymentPotential: form.selfEmploymentPotential || undefined,
      certificationRecognition: form.certificationRecognition || undefined,
      durationToPrepare: form.durationToPrepare || undefined,
      qualificationRequired: form.qualificationRequired || undefined,
      examStages: splitList(form.examStages),
      selectionProcess: form.selectionProcess || undefined,
      physicalRequirements: form.physicalRequirements || undefined,
      studyRoutes: splitList(form.studyRoutes),
      recommendedCourses: splitList(form.recommendedCourses),
      promotionsAndGrowth: form.promotionsAndGrowth || undefined,
      departments: splitList(form.departments),
      lateralEntryOptions: splitList(form.lateralEntryOptions),
      fieldExposure: form.fieldExposure || undefined,
      specializationArea: form.specializationArea || undefined,
      entryLevel: form.entryLevel || undefined,
      name: form.name,
      overview: form.overview,
      duration: form.duration,
      eligibility: form.eligibility,
      certifications: splitList(form.certifications),
      salaryBand: form.salaryBand,
      keySubjects: splitList(form.keySubjects),
      skillsNeeded: splitList(form.skillsNeeded),
      advantages: splitList(form.advantages),
      disadvantages: splitList(form.disadvantages),
      futureJobs: splitList(form.futureJobs),
      higherStudies: splitList(form.higherStudies),
      bestFor: form.bestFor,
      avoidIf: form.avoidIf,
      futureScope: form.futureScope,
      industries: splitList(form.industries),
      workSettings: splitList(form.workSettings),
      trendingLevel: form.trendingLevel,
      featured: form.featured,
      order: form.order ? Number(form.order) : undefined,
    };
    await saveDepartment(payload, form.id || undefined);
    setForm({ ...form, id: "", name: "" });
    load();
  };

  const edit = (item: any) => {
    setForm({
      id: item.id,
      streamId: item.streamId ?? "",
      slug: item.slug ?? "",
      tamilName: item.tamilName ?? "",
      category: item.category ?? "",
      relatedCategories: (item.relatedCategories ?? []).join(", "),
      entranceExams: (item.entranceExams ?? []).join(", "),
      aliases: (item.aliases ?? []).join(", "),
      pathType: item.pathType ?? "",
      degreeType: item.degreeType ?? "",
      deliveryMode: item.deliveryMode ?? "",
      programType: item.programType ?? "",
      examType: item.examType ?? "",
      serviceType: item.serviceType ?? "",
      courseStructure: (item.courseStructure ?? []).join(", "),
      creativeFocus: item.creativeFocus ?? "",
      portfolioRequirement: item.portfolioRequirement ?? "",
      softwareTools: (item.softwareTools ?? []).join(", "),
      practicalTraining: item.practicalTraining ?? "",
      clinicalExposure: item.clinicalExposure ?? "",
      practicalExposure: item.practicalExposure ?? "",
      internshipFocus: item.internshipFocus ?? "",
      workshopFocus: item.workshopFocus ?? "",
      apprenticeshipOptions: (item.apprenticeshipOptions ?? []).join(", "),
      selfEmploymentPotential: item.selfEmploymentPotential ?? "",
      certificationRecognition: item.certificationRecognition ?? "",
      durationToPrepare: item.durationToPrepare ?? "",
      qualificationRequired: item.qualificationRequired ?? "",
      examStages: (item.examStages ?? []).join(", "),
      selectionProcess: item.selectionProcess ?? "",
      physicalRequirements: item.physicalRequirements ?? "",
      studyRoutes: (item.studyRoutes ?? []).join(", "),
      recommendedCourses: (item.recommendedCourses ?? []).join(", "),
      promotionsAndGrowth: item.promotionsAndGrowth ?? "",
      departments: (item.departments ?? []).join(", "),
      lateralEntryOptions: (item.lateralEntryOptions ?? []).join(", "),
      name: item.name ?? "",
      overview: item.overview ?? "",
      duration: item.duration ?? "",
      eligibility: item.eligibility ?? "",
      certifications: (item.certifications ?? []).join(", "),
      salaryBand: item.salaryBand ?? "",
      keySubjects: (item.keySubjects ?? []).join(", "),
      skillsNeeded: (item.skillsNeeded ?? []).join(", "),
      advantages: (item.advantages ?? []).join(", "),
      disadvantages: (item.disadvantages ?? []).join(", "),
      futureJobs: (item.futureJobs ?? []).join(", "),
      higherStudies: (item.higherStudies ?? []).join(", "),
      entryLevel: item.entryLevel ?? "",
      specializationArea: item.specializationArea ?? "",
      fieldExposure: item.fieldExposure ?? "",
      workSettings: (item.workSettings ?? []).join(", "),
      bestFor: item.bestFor ?? "",
      avoidIf: item.avoidIf ?? "",
      futureScope: item.futureScope ?? "",
      industries: (item.industries ?? []).join(", "),
      trendingLevel: item.trendingLevel ?? "medium",
      featured: Boolean(item.featured),
      order: item.order ?? "",
    });
  };

  const remove = async (id: string) => {
    await deleteEntity("departments", id);
    load();
  };

  return (
    <div className="space-y-4">
      <Card title="Departments" actions={<Button onClick={submit}>{form.id ? "Update" : "Create"}</Button>}>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Stream
            <select
              required
              value={form.streamId}
              onChange={(e) => setForm({ ...form, streamId: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select stream</option>
              {streams.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title || s.name}
                </option>
              ))}
            </select>
          </label>
          <AdminField label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <AdminField label="Tamil name" value={form.tamilName} onChange={(e) => setForm({ ...form, tamilName: e.target.value })} />
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">(optional)</option>
              {[
                ...engineeringCategories,
                ...artsScienceCategories,
                ...commerceCategories,
                ...medicalCategories,
                ...paramedicalCategories,
                ...agricultureCategories,
                ...lawCategories,
                ...designMediaCategories,
                ...managementCategories,
                ...diplomaCategories,
                ...vocationalCategories,
                ...governmentCategories,
              ].map((cat, idx) => (
                <option key={`${cat.id}-${idx}`} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </label>
          <AdminField label="Aliases (comma)" value={form.aliases} onChange={(e) => setForm({ ...form, aliases: e.target.value })} />
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Path type
            <select
              value={form.pathType}
              onChange={(e) => setForm({ ...form, pathType: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">(optional)</option>
              <option value="degree">Degree</option>
              <option value="professional">Professional</option>
              <option value="professional-degree">Professional Degree</option>
              <option value="allied-health">Allied Health</option>
              <option value="nursing">Nursing</option>
              <option value="therapy">Therapy & Rehab</option>
              <option value="public-health">Public Health</option>
              <option value="technician">Technician</option>
              <option value="support-care">Support Care</option>
              <option value="management">Management</option>
              <option value="engineering">Engineering</option>
              <option value="applied-farming">Applied Farming</option>
              <option value="animal-science">Animal Science</option>
              <option value="fisheries">Fisheries</option>
              <option value="food-processing">Food Processing</option>
              <option value="integrated-degree">Integrated Degree</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="legal-focus-area">Legal Focus Area</option>
              <option value="diploma">Diploma</option>
              <option value="certificate">Certificate</option>
              <option value="specialization">Specialization</option>
              <option value="integrated-law">Integrated Law</option>
              <option value="design-track">Design Track</option>
              <option value="media-track">Media Track</option>
              <option value="creative-track">Creative Track</option>
              <option value="interactive-media">Interactive Media</option>
              <option value="undergraduate-degree">Undergraduate Degree</option>
              <option value="postgraduate-degree">Postgraduate Degree</option>
              <option value="postgraduate-diploma">PG Diploma</option>
              <option value="short-term">Short Term</option>
              <option value="polytechnic">Polytechnic</option>
              <option value="vocational-diploma">Vocational Diploma</option>
              <option value="technical-diploma">Technical Diploma</option>
              <option value="service-diploma">Service Diploma</option>
              <option value="healthcare-diploma">Healthcare Diploma</option>
              <option value="creative-diploma">Creative Diploma</option>
              <option value="trade-skill">Trade Skill</option>
              <option value="skill-course">Skill Course</option>
              <option value="vocational-course">Vocational Course</option>
              <option value="short-term-course">Short-term Course</option>
              <option value="job-role-training">Job Role Training</option>
              <option value="government-skill-program">Government Skill Program</option>
              <option value="self-employment-track">Self-employment Track</option>
              <option value="exam-pathway">Exam Pathway</option>
              <option value="government-job">Government Job</option>
              <option value="service-path">Service Path</option>
              <option value="teaching-path">Teaching Path</option>
              <option value="defence-path">Defence Path</option>
              <option value="technical-path">Technical Path</option>
              <option value="judicial-path">Judicial Path</option>
              <option value="healthcare-path">Healthcare Path</option>
              <option value="research-path">Research Path</option>
              <option value="administrative-path">Administrative Path</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Degree type
            <select
              value={form.degreeType}
              onChange={(e) => setForm({ ...form, degreeType: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">(optional)</option>
              <option value="be-btech">B.E./B.Tech</option>
              <option value="barch">B.Arch</option>
              <option value="specialized-engineering">Specialized</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Delivery mode
            <select
              value={form.deliveryMode}
              onChange={(e) => setForm({ ...form, deliveryMode: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">(optional)</option>
              <option value="full-time">Full-time</option>
              <option value="executive">Executive</option>
              <option value="distance">Distance</option>
              <option value="online">Online</option>
              <option value="blended">Blended</option>
              <option value="flexible">Flexible</option>
              <option value="practical">Practical</option>
              <option value="workshop-based">Workshop-based</option>
              <option value="skill-based">Skill-based</option>
              <option value="field-based">Field-based</option>
              <option value="apprenticeship-based">Apprenticeship-based</option>
              <option value="short-term">Short-term</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Program type
            <select
              value={form.programType}
              onChange={(e) => setForm({ ...form, programType: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">(optional)</option>
              <option value="private-training">Private Training</option>
              <option value="institute-course">Institute Course</option>
              <option value="government-program">Government Program</option>
              <option value="iti-pathway">ITI Pathway</option>
              <option value="certification-track">Certification Track</option>
              <option value="self-employment-track">Self-employment Track</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Entry level
            <select
              value={form.entryLevel}
              onChange={(e) => setForm({ ...form, entryLevel: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">(optional)</option>
              <option value="after-12th">After 12th</option>
              <option value="after-10th">After 10th</option>
              <option value="after-10th-or-12th">After 10th or 12th</option>
              <option value="after-diploma">After Diploma</option>
              <option value="after-degree">After Degree</option>
              <option value="after-postgraduation">After Postgraduation</option>
              <option value="multiple-entry-levels">Multiple Entry Levels</option>
              <option value="after-graduation">After Graduation</option>
              <option value="postgraduate-specialization">Postgraduate</option>
              <option value="short-term-upskilling">Short-term Upskilling</option>
              <option value="working-professional">Working Professional</option>
              <option value="flexible-entry">Flexible Entry</option>
            </select>
          </label>
          <AdminField
            label="Related categories (comma)"
            value={form.relatedCategories}
            onChange={(e) => setForm({ ...form, relatedCategories: e.target.value })}
          />
          <AdminField
            label="Entrance exams (comma)"
            value={form.entranceExams}
            onChange={(e) => setForm({ ...form, entranceExams: e.target.value })}
          />
          <AdminField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <AdminField label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <AdminField label="Eligibility" value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
          <AdminField
            label="Course structure (comma)"
            value={form.courseStructure}
            onChange={(e) => setForm({ ...form, courseStructure: e.target.value })}
          />
          <AdminField
            label="Practical training"
            value={form.practicalTraining}
            onChange={(e) => setForm({ ...form, practicalTraining: e.target.value })}
          />
          <AdminField
            label="Clinical exposure"
            value={form.clinicalExposure}
            onChange={(e) => setForm({ ...form, clinicalExposure: e.target.value })}
          />
          <AdminField
            label="Practical / field exposure"
            value={form.fieldExposure}
            onChange={(e) => setForm({ ...form, fieldExposure: e.target.value })}
          />
          <AdminField
            label="Internship focus"
            value={form.internshipFocus}
            onChange={(e) => setForm({ ...form, internshipFocus: e.target.value })}
          />
          <AdminField
            label="Workshop focus"
            value={form.workshopFocus}
            onChange={(e) => setForm({ ...form, workshopFocus: e.target.value })}
          />
          <AdminField
            label="Apprenticeship options (comma)"
            value={form.apprenticeshipOptions}
            onChange={(e) => setForm({ ...form, apprenticeshipOptions: e.target.value })}
          />
          <AdminField
            label="Self-employment potential"
            value={form.selfEmploymentPotential}
            onChange={(e) => setForm({ ...form, selfEmploymentPotential: e.target.value })}
          />
          <AdminField
            label="Certification / recognition"
            value={form.certificationRecognition}
            onChange={(e) => setForm({ ...form, certificationRecognition: e.target.value })}
          />
          <AdminField
            label="Lateral entry options (comma)"
            value={form.lateralEntryOptions}
            onChange={(e) => setForm({ ...form, lateralEntryOptions: e.target.value })}
          />
          <AdminField
            label="Specialization area"
            value={form.specializationArea}
            onChange={(e) => setForm({ ...form, specializationArea: e.target.value })}
          />
          <AdminField
            label="Creative focus"
            value={form.creativeFocus}
            onChange={(e) => setForm({ ...form, creativeFocus: e.target.value })}
          />
          <AdminField
            label="Portfolio requirement"
            value={form.portfolioRequirement}
            onChange={(e) => setForm({ ...form, portfolioRequirement: e.target.value })}
          />
          <AdminField
            label="Software / tools (comma)"
            value={form.softwareTools}
            onChange={(e) => setForm({ ...form, softwareTools: e.target.value })}
          />
          <AdminField label="Salary band" value={form.salaryBand} onChange={(e) => setForm({ ...form, salaryBand: e.target.value })} />
          <AdminField label="Key subjects (comma)" value={form.keySubjects} onChange={(e) => setForm({ ...form, keySubjects: e.target.value })} />
          <AdminField label="Skills needed (comma)" value={form.skillsNeeded} onChange={(e) => setForm({ ...form, skillsNeeded: e.target.value })} />
          <AdminField label="Advantages (comma)" value={form.advantages} onChange={(e) => setForm({ ...form, advantages: e.target.value })} />
          <AdminField label="Disadvantages (comma)" value={form.disadvantages} onChange={(e) => setForm({ ...form, disadvantages: e.target.value })} />
          <AdminField label="Future jobs (comma)" value={form.futureJobs} onChange={(e) => setForm({ ...form, futureJobs: e.target.value })} />
          <AdminField label="Higher studies (comma)" value={form.higherStudies} onChange={(e) => setForm({ ...form, higherStudies: e.target.value })} />
          <AdminField
            label="Certifications (comma)"
            value={form.certifications}
            onChange={(e) => setForm({ ...form, certifications: e.target.value })}
          />
          <AdminField label="Best for" value={form.bestFor} onChange={(e) => setForm({ ...form, bestFor: e.target.value })} />
          <AdminField label="Avoid if" value={form.avoidIf} onChange={(e) => setForm({ ...form, avoidIf: e.target.value })} />
          <AdminField label="Future scope" value={form.futureScope} onChange={(e) => setForm({ ...form, futureScope: e.target.value })} />
          <AdminField label="Industries (comma)" value={form.industries} onChange={(e) => setForm({ ...form, industries: e.target.value })} />
          <AdminField label="Work settings (comma)" value={form.workSettings} onChange={(e) => setForm({ ...form, workSettings: e.target.value })} />
          <label className="flex flex-col gap-1 text-sm text-neutral-200">
            Trending level
            <select
              value={form.trendingLevel}
              onChange={(e) => setForm({ ...form, trendingLevel: e.target.value })}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-200">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            Featured
          </label>
          <AdminField
            label="Order (number)"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            type="number"
          />
          <AdminField label="Overview" textarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
        </div>
        {error ? <div className="text-xs text-rose-300">{error}</div> : null}
      </Card>

      {loading ? (
        <div className="text-sm text-neutral-400">Loading departments...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.id}
              title={item.name}
              eyebrow={item.streamId}
              actions={
                <div className="flex gap-2">
                  <Button variant="ghost" className="text-xs px-3" onClick={() => edit(item)}>
                    Edit
                  </Button>
                  <Button variant="outline" className="text-xs px-3" onClick={() => remove(item.id)}>
                    Delete
                  </Button>
                </div>
              }
            >
              <p className="text-sm text-neutral-300 line-clamp-3">{item.overview}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
