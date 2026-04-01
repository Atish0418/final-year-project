export type Stream = {
  id: string;
  title: string;
  summary: string;
  focus: string[];
};

export type Lab = {
  id: string;
  title: string;
  description: string;
  readiness: "beta" | "stable" | "planned";
};

export type FutureJob = {
  title: string;
  outlook: string;
  skills: string[];
};

export type CourseComparison = {
  provider: string;
  duration: string;
  cost: string;
  outcome: string;
};

export type Department = {
  id: string;
  slug?: string;
  name: string;
  tamilName?: string;
  streamId: string;
  category?: string;
  relatedCategories?: string[];
  aliases?: string[];
  pathType?:
    | "degree"
    | "integrated-degree"
    | "professional"
    | "professional-degree"
    | "postgraduate"
    | "diploma"
    | "certificate"
    | "technician"
    | "specialization"
    | "integrated-law"
    | "allied-health"
    | "nursing"
    | "therapy"
    | "public-health"
    | "support-care"
    | "management"
    | "engineering"
    | "applied-farming"
    | "animal-science"
    | "fisheries"
    | "food-processing"
    | "legal-focus-area"
    | "design-track"
    | "media-track"
    | "creative-track"
    | "interactive-media"
    | "undergraduate-degree"
    | "postgraduate-degree"
    | "postgraduate-diploma"
    | "short-term"
    | "polytechnic"
    | "vocational-diploma"
    | "technical-diploma"
    | "service-diploma"
    | "healthcare-diploma"
    | "creative-diploma"
    | "trade-skill"
    | "skill-course"
    | "vocational-course"
    | "short-term-course"
    | "job-role-training"
    | "government-skill-program"
    | "self-employment-track"
    | "exam-pathway"
    | "government-job"
    | "service-path"
    | "teaching-path"
    | "defence-path"
    | "technical-path"
    | "judicial-path"
    | "healthcare-path"
    | "research-path"
    | "administrative-path";
  entryLevel?:
    | "after-10th"
    | "after-12th"
    | "after-10th-or-12th"
    | "after-graduation"
    | "postgraduate-specialization"
    | "short-term-upskilling"
    | "working-professional"
    | "flexible-entry"
    | "after-diploma"
    | "after-degree"
    | "after-postgraduation"
    | "multiple-entry-levels";
  deliveryMode?:
    | "full-time"
    | "executive"
    | "distance"
    | "online"
    | "blended"
    | "flexible"
    | "practical"
    | "workshop-based"
    | "skill-based"
    | "field-based"
    | "apprenticeship-based"
    | "short-term";
  programType?: "private-training" | "institute-course" | "government-program" | "iti-pathway" | "certification-track" | "self-employment-track";
  examType?:
    | "competitive-exam"
    | "recruitment-exam"
    | "service-exam"
    | "physical-selection"
    | "academic-qualification-path"
    | "mixed-pathway";
  serviceType?:
    | "central-government"
    | "state-government"
    | "defence"
    | "banking-public-sector"
    | "judiciary"
    | "education"
    | "medical-public-sector"
    | "research-and-science"
    | "technical-government"
    | "rural-development"
    | "public-administration";
  overview: string;
  duration: string;
  eligibility: string;
  entranceExams?: string[];
  courseStructure?: string[];
  practicalTraining?: string;
  licensingNotes?: string;
  clinicalExposure?: string;
  practicalExposure?: string;
  fieldExposure?: string;
  specializationArea?: string;
  creativeFocus?: string;
  portfolioRequirement?: string;
  softwareTools?: string[];
  internshipFocus?: string;
  workshopFocus?: string;
  apprenticeshipOptions?: string[];
  selfEmploymentPotential?: string;
  certificationRecognition?: string;
  lateralEntryOptions?: string[];
  durationToPrepare?: string;
  qualificationRequired?: string;
  examStages?: string[];
  selectionProcess?: string;
  physicalRequirements?: string;
  studyRoutes?: string[];
  recommendedCourses?: string[];
  promotionsAndGrowth?: string;
  departments?: string[];
  keySubjects: string[];
  skillsNeeded: string[];
  advantages: string[];
  disadvantages: string[];
  futureJobs: string[];
  higherStudies: string[];
  certifications?: string[];
  bestFor: string;
  avoidIf: string;
  futureScope: string;
  salaryBand?: string;
  industries?: string[];
  workSettings?: string[];
  trendingLevel?: "high" | "medium" | "low";
  icon?: string;
  colorTheme?: string;
  featured?: boolean;
  order?: number;
  degreeType?: "be-btech" | "barch" | "specialized-engineering";
};

export type QuizOption = {
  id: string;
  text: string;
  tags: string[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};
