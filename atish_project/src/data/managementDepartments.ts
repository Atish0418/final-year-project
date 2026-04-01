import type { Department } from "../types/content";

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");

const catDefaults: Record<
  string,
  {
    pathType: Department["pathType"];
    entryLevel: Department["entryLevel"];
    deliveryMode?: Department["deliveryMode"];
    duration: string;
    eligibility: string;
    keySubjects: string[];
    futureScope: string;
    industries: string[];
  }
> = {
  "undergraduate-management": {
    pathType: "undergraduate-degree",
    entryLevel: "after-12th",
    duration: "3 years (UG)",
    eligibility: "12th any stream; math/commerce helpful",
    keySubjects: ["Principles of Management", "Marketing Basics", "Finance", "HR"],
    futureScope: "Great base for MBA, PGDM, or management trainee roles.",
    industries: ["Corporate", "Retail", "Startups"],
  },
  "postgraduate-management": {
    pathType: "postgraduate-degree",
    entryLevel: "after-graduation",
    duration: "2 years (PG)",
    eligibility: "Any degree; entrances like CAT/XAT/GMAT/CMAT",
    keySubjects: ["Strategic Management", "Finance", "Marketing", "HR"],
    futureScope: "Opens mid-level management and leadership tracks.",
    industries: ["Corporate", "Consulting", "Startups"],
  },
  "finance-management": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years (PG/Cert)",
    eligibility: "BBA/B.Com/Any UG; finance aptitude",
    keySubjects: ["Financial Management", "Investment", "Risk", "Markets"],
    futureScope: "Strong demand across banking, investment, FP&A, risk.",
    industries: ["Banking", "Investment", "Fintech"],
  },
  "marketing-management": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; creativity and communication",
    keySubjects: ["Marketing Strategy", "Digital", "Brand", "Sales"],
    futureScope: "High demand in brand, digital, and growth roles.",
    industries: ["FMCG", "E-commerce", "Media", "Startups"],
  },
  "hr-management": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; people skills",
    keySubjects: ["HRM", "Talent", "OB", "Labour Law"],
    futureScope: "Consistent need for HR specialists and business partners.",
    industries: ["IT", "Manufacturing", "Services"],
  },
  "international-business": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; interest in trade/logistics",
    keySubjects: ["IB", "Trade Docs", "Global Marketing", "Logistics"],
    futureScope: "Growing global trade and supply-chain roles.",
    industries: ["Logistics", "Export-Import", "Consulting"],
  },
  "operations-supply": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; quant/ops mindset",
    keySubjects: ["Operations", "SCM", "Lean", "Analytics"],
    futureScope: "Demand in manufacturing, e-commerce, mobility.",
    industries: ["Manufacturing", "E-commerce", "Logistics"],
  },
  "it-analytics-management": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; tech/analytics interest",
    keySubjects: ["IT Strategy", "Systems", "Analytics", "Data-Driven Decisions"],
    futureScope: "High growth in analytics, product, and IT management.",
    industries: ["IT", "Product", "Consulting"],
  },
  "specialized-management": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; sector interest",
    keySubjects: ["Sector Electives", "Operations", "Marketing"],
    futureScope: "Good for sector-specific leadership tracks.",
    industries: ["Hospitality", "Sports", "Retail", "Aviation"],
  },
  "rural-agri-management": {
    pathType: "specialization",
    entryLevel: "after-graduation",
    duration: "1-2 years",
    eligibility: "Any UG; interest in rural/agri",
    keySubjects: ["Rural Markets", "Agri Value Chains", "Development"],
    futureScope: "Increasing focus on agri value chains and rural development.",
    industries: ["Agri", "NGO", "Development", "FMCG Rural"],
  },
  "diploma-short-management": {
    pathType: "short-term",
    entryLevel: "short-term-upskilling",
    duration: "3-12 months",
    eligibility: "12th or graduation (varies)",
    keySubjects: ["Projects", "Leadership", "Domain Basics"],
    futureScope: "Useful for quick upskilling and career switches.",
    industries: ["Corporate", "SMEs", "Startups"],
  },
};

const baseDefaults = {
  advantages: ["Practical business exposure", "Multi-industry relevance", "Good higher-study options"],
  disadvantages: ["Competitive admissions/placements", "Requires internships/projects", "Some roles need prior experience"],
  skillsNeeded: ["Communication", "Problem-solving", "Teamwork", "MS Excel/Sheets"],
  higherStudies: ["MBA", "Executive MBA", "Specialized PG Diplomas", "Certifications"],
  bestFor: "Students who like organizing, leading teams, and solving business problems.",
  avoidIf: "You dislike people-facing roles, presentations, or data-driven decisions.",
  salaryBand: "INR 3-12 LPA (entry) depending on role, institute, and city",
  trendingLevel: "medium" as const,
};

const makeCourse = (
  data: Partial<Department> & {
    name: string;
    category: string;
  },
): Department => {
  const id = data.id ?? slugify(data.name);
  const cat = catDefaults[data.category] ?? catDefaults["undergraduate-management"];
  return {
    id,
    slug: data.slug ?? id,
    streamId: "management",
    name: data.name,
    category: data.category,
    relatedCategories: data.relatedCategories ?? [],
    pathType: data.pathType ?? cat.pathType,
    entryLevel: data.entryLevel ?? cat.entryLevel,
    deliveryMode: data.deliveryMode ?? cat.deliveryMode ?? "full-time",
    duration: data.duration ?? cat.duration,
    eligibility: data.eligibility ?? cat.eligibility,
    entranceExams: data.entranceExams ?? [],
    courseStructure: data.courseStructure ?? [],
    specializationArea: data.specializationArea,
    practicalExposure: data.practicalExposure,
    internshipFocus: data.internshipFocus ?? "Internships/industry projects recommended",
    keySubjects: data.keySubjects ?? cat.keySubjects,
    skillsNeeded: data.skillsNeeded ?? baseDefaults.skillsNeeded,
    advantages: data.advantages ?? baseDefaults.advantages,
    disadvantages: data.disadvantages ?? baseDefaults.disadvantages,
    futureJobs: data.futureJobs ?? ["Management Trainee", "Business Analyst", "Operations Executive"],
    higherStudies: data.higherStudies ?? baseDefaults.higherStudies,
    bestFor: data.bestFor ?? baseDefaults.bestFor,
    avoidIf: data.avoidIf ?? baseDefaults.avoidIf,
    futureScope: data.futureScope ?? cat.futureScope,
    salaryBand: data.salaryBand ?? baseDefaults.salaryBand,
    industries: data.industries ?? cat.industries,
    workSettings: data.workSettings ?? ["Corporate offices", "Startups", "Hybrid/On-site"],
    trendingLevel: data.trendingLevel ?? baseDefaults.trendingLevel,
    icon: data.icon,
    colorTheme: data.colorTheme,
    featured: data.featured ?? false,
    order: data.order,
    aliases: data.aliases ?? [],
    tamilName: data.tamilName,
    overview:
      data.overview ??
      `${data.name} covers management foundations with projects, case studies, and internships to prepare you for business roles.`,
  };
};

export const managementDepartments: Department[] = [
  // 1. Undergraduate Management
  makeCourse({ name: "BBA (Bachelor of Business Administration)", category: "undergraduate-management", pathType: "undergraduate-degree" }),
  makeCourse({ name: "BBM (Bachelor of Business Management)", category: "undergraduate-management", pathType: "undergraduate-degree" }),
  makeCourse({ name: "BMS (Bachelor of Management Studies)", category: "undergraduate-management", pathType: "undergraduate-degree" }),
  makeCourse({ name: "BBA Honours", category: "undergraduate-management", pathType: "undergraduate-degree", featured: true }),
  makeCourse({
    name: "Integrated MBA (5-year)",
    category: "undergraduate-management",
    pathType: "integrated-degree",
    duration: "5 years integrated",
    eligibility: "12th; institute tests/aptitude",
    futureJobs: ["Management Trainee", "Business Analyst"],
  }),

  // 2. Postgraduate Management
  makeCourse({
    name: "MBA (Master of Business Administration)",
    category: "postgraduate-management",
    pathType: "postgraduate-degree",
    duration: "2 years",
    eligibility: "Any degree; CAT/XAT/GMAT/CMAT",
    trendingLevel: "high",
    futureJobs: ["Management Trainee", "Consultant", "Product Manager"],
    deliveryMode: "full-time",
  }),
  makeCourse({
    name: "PGDM (Post Graduate Diploma in Management)",
    category: "postgraduate-management",
    pathType: "postgraduate-diploma",
    duration: "2 years",
    eligibility: "Any degree; CAT/XAT/CMAT",
    futureJobs: ["Management Trainee", "Analyst"],
    deliveryMode: "full-time",
  }),
  makeCourse({
    name: "Executive MBA",
    category: "postgraduate-management",
    pathType: "postgraduate-degree",
    deliveryMode: "executive",
    entryLevel: "working-professional",
    duration: "1-2 years (modular)",
    eligibility: "Graduate + 2-5 years work experience",
    futureJobs: ["Manager", "Senior Manager"],
  }),
  makeCourse({
    name: "Distance MBA",
    category: "postgraduate-management",
    pathType: "postgraduate-degree",
    deliveryMode: "distance",
    duration: "2-3 years",
    eligibility: "Any degree",
    futureJobs: ["Managerial roles", "Team Lead"],
  }),
  makeCourse({
    name: "Online MBA",
    category: "postgraduate-management",
    pathType: "postgraduate-degree",
    deliveryMode: "online",
    duration: "1.5-2 years",
    eligibility: "Any degree",
    futureJobs: ["Remote Manager", "Business Analyst"],
  }),

  // 3. Finance Management
  makeCourse({ name: "MBA Finance", category: "finance-management", specializationArea: "Finance", futureJobs: ["Finance Analyst", "Investment Analyst"] }),
  makeCourse({ name: "BBA Finance", category: "finance-management", pathType: "undergraduate-degree", entryLevel: "after-12th" }),
  makeCourse({
    name: "Financial Management",
    category: "finance-management",
    pathType: "specialization",
    futureJobs: ["Finance Manager", "FP&A Analyst"],
  }),
  makeCourse({
    name: "Investment Management",
    category: "finance-management",
    pathType: "specialization",
    futureJobs: ["Investment Analyst", "Portfolio Associate"],
  }),
  makeCourse({
    name: "Banking & Finance Management",
    category: "finance-management",
    pathType: "specialization",
    futureJobs: ["Banking Analyst", "Credit Analyst"],
  }),
  makeCourse({
    name: "Risk Management",
    category: "finance-management",
    pathType: "specialization",
    futureJobs: ["Risk Analyst", "Credit Risk Associate"],
  }),

  // 4. Marketing Management
  makeCourse({ name: "MBA Marketing", category: "marketing-management", specializationArea: "Marketing", futureJobs: ["Brand Manager", "Growth Manager"], trendingLevel: "high" }),
  makeCourse({ name: "BBA Marketing", category: "marketing-management", pathType: "undergraduate-degree", entryLevel: "after-12th" }),
  makeCourse({
    name: "Digital Marketing",
    category: "marketing-management",
    pathType: "certificate",
    deliveryMode: "online",
    duration: "6-12 months",
    futureJobs: ["Digital Marketer", "Performance Marketer"],
  }),
  makeCourse({
    name: "Brand Management",
    category: "marketing-management",
    pathType: "specialization",
    futureJobs: ["Assistant Brand Manager", "Marketing Executive"],
  }),
  makeCourse({
    name: "Sales Management",
    category: "marketing-management",
    pathType: "specialization",
    futureJobs: ["Sales Manager", "Key Account Exec"],
  }),
  makeCourse({
    name: "Advertising Management",
    category: "marketing-management",
    pathType: "specialization",
    futureJobs: ["Account Executive (Agency)", "Media Planner"],
  }),

  // 5. HR Management
  makeCourse({ name: "MBA HR", category: "hr-management", specializationArea: "HR", futureJobs: ["HRBP", "HR Analyst"] }),
  makeCourse({ name: "BBA HR", category: "hr-management", pathType: "undergraduate-degree", entryLevel: "after-12th" }),
  makeCourse({
    name: "Human Resource Management",
    category: "hr-management",
    pathType: "specialization",
    futureJobs: ["HR Generalist", "Recruiter"],
  }),
  makeCourse({
    name: "Talent Management",
    category: "hr-management",
    pathType: "specialization",
    futureJobs: ["Talent Partner", "L&D Specialist"],
  }),
  makeCourse({
    name: "Organizational Behavior",
    category: "hr-management",
    pathType: "specialization",
    futureJobs: ["HR Analyst", "Change Management Analyst"],
  }),

  // 6. International Business
  makeCourse({ name: "MBA International Business", category: "international-business", futureJobs: ["IB Manager", "Trade Analyst"] }),
  makeCourse({ name: "BBA International Business", category: "international-business", pathType: "undergraduate-degree", entryLevel: "after-12th" }),
  makeCourse({
    name: "Global Business Management",
    category: "international-business",
    pathType: "specialization",
    futureJobs: ["Global Operations Exec", "Country Coordinator"],
  }),
  makeCourse({
    name: "Export-Import Management",
    category: "international-business",
    pathType: "certificate",
    deliveryMode: "online",
    duration: "6-12 months",
    futureJobs: ["Export Exec", "Documentation Exec"],
  }),
  makeCourse({
    name: "Foreign Trade Management",
    category: "international-business",
    pathType: "certificate",
    futureJobs: ["Trade Analyst", "Operations Exec"],
  }),

  // 7. Operations & Supply Chain
  makeCourse({ name: "MBA Operations", category: "operations-supply", futureJobs: ["Operations Manager", "Process Manager"] }),
  makeCourse({
    name: "Supply Chain Management",
    category: "operations-supply",
    pathType: "specialization",
    futureJobs: ["SCM Analyst", "Supply Planner"],
  }),
  makeCourse({
    name: "Logistics Management",
    category: "operations-supply",
    pathType: "specialization",
    futureJobs: ["Logistics Coordinator", "Warehouse Ops"],
  }),
  makeCourse({
    name: "Production & Operations Management",
    category: "operations-supply",
    pathType: "specialization",
    futureJobs: ["Production Planner", "Plant Coordinator"],
  }),
  makeCourse({
    name: "Inventory Management",
    category: "operations-supply",
    pathType: "specialization",
    futureJobs: ["Inventory Analyst", "Store Planner"],
  }),

  // 8. IT & Technology Management
  makeCourse({ name: "MBA IT", category: "it-analytics-management", futureJobs: ["IT Manager", "Product Manager"] }),
  makeCourse({
    name: "Business Analytics",
    category: "it-analytics-management",
    pathType: "specialization",
    futureJobs: ["Business Analyst", "BI Analyst"],
    trendingLevel: "high",
  }),
  makeCourse({
    name: "Data Analytics Management",
    category: "it-analytics-management",
    pathType: "specialization",
    futureJobs: ["Data Analyst", "Analytics Lead"],
  }),
  makeCourse({
    name: "Information Systems Management",
    category: "it-analytics-management",
    pathType: "specialization",
    futureJobs: ["IS Manager", "Systems Analyst"],
  }),
  makeCourse({
    name: "Technology Management",
    category: "it-analytics-management",
    pathType: "specialization",
    futureJobs: ["Tech Program Manager", "IT Consultant"],
  }),

  // 9. Specialized Management
  makeCourse({
    name: "Hospital Management",
    category: "specialized-management",
    futureJobs: ["Hospital Administrator", "Operations Manager"],
    industries: ["Healthcare", "Hospitals"],
  }),
  makeCourse({
    name: "Hotel Management",
    category: "specialized-management",
    futureJobs: ["Hotel Manager", "Food & Beverage Manager"],
    industries: ["Hospitality", "Tourism"],
  }),
  makeCourse({
    name: "Event Management",
    category: "specialized-management",
    futureJobs: ["Event Manager", "Client Servicing"],
  }),
  makeCourse({
    name: "Sports Management",
    category: "specialized-management",
    futureJobs: ["Sports Ops", "Team Manager", "Sports Marketing"],
  }),
  makeCourse({
    name: "Retail Management",
    category: "specialized-management",
    futureJobs: ["Retail Manager", "Category Analyst"],
  }),
  makeCourse({
    name: "Aviation Management",
    category: "specialized-management",
    futureJobs: ["Airport Ops", "Airline Ops"],
    industries: ["Aviation"],
  }),

  // 10. Rural & Agri Management
  makeCourse({
    name: "Rural Management",
    category: "rural-agri-management",
    futureJobs: ["Rural Development Officer", "Program Manager"],
    industries: ["NGO", "Development", "Agri"],
  }),
  makeCourse({
    name: "Agribusiness Management",
    category: "rural-agri-management",
    relatedCategories: ["specialized-management"],
    futureJobs: ["Agri Supply Chain Manager", "Procurement"],
  }),
  makeCourse({
    name: "Development Management",
    category: "rural-agri-management",
    futureJobs: ["Program Manager", "Impact Analyst"],
    industries: ["NGO", "CSR", "Government Programs"],
  }),

  // 11. Diploma & Short-Term Management Courses
  makeCourse({
    name: "Diploma in Business Management",
    category: "diploma-short-management",
    pathType: "diploma",
    entryLevel: "after-12th",
    duration: "1 year",
  }),
  makeCourse({
    name: "Diploma in Marketing",
    category: "diploma-short-management",
    pathType: "diploma",
    entryLevel: "after-12th",
  }),
  makeCourse({
    name: "Diploma in HR",
    category: "diploma-short-management",
    pathType: "diploma",
    entryLevel: "after-12th",
  }),
  makeCourse({
    name: "Project Management Courses",
    category: "diploma-short-management",
    pathType: "certificate",
    deliveryMode: "online",
    duration: "3-6 months",
    futureJobs: ["Project Coordinator", "PMO Analyst"],
  }),
  makeCourse({
    name: "Entrepreneurship Courses",
    category: "diploma-short-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Founder", "Startup Ops"],
  }),
  makeCourse({
    name: "Leadership Training",
    category: "diploma-short-management",
    pathType: "short-term",
    entryLevel: "working-professional",
    duration: "1-3 months",
    futureJobs: ["Team Lead", "Manager"],
  }),

  // Extra pathways to ensure 60+ items and coverage
  makeCourse({
    name: "MBA Analytics & Big Data",
    category: "it-analytics-management",
    pathType: "postgraduate-degree",
    trendingLevel: "high",
    futureJobs: ["Analytics Manager", "Product Analyst"],
  }),
  makeCourse({
    name: "MBA Product Management",
    category: "it-analytics-management",
    pathType: "postgraduate-degree",
    futureJobs: ["Product Manager", "Product Analyst"],
  }),
  makeCourse({
    name: "MBA Strategy & Consulting",
    category: "postgraduate-management",
    pathType: "postgraduate-degree",
    futureJobs: ["Associate Consultant", "Strategy Analyst"],
  }),
  makeCourse({
    name: "Family Business Management",
    category: "undergraduate-management",
    pathType: "undergraduate-degree",
    futureJobs: ["Business Owner", "Operations Lead"],
  }),
  makeCourse({
    name: "Luxury Brand Management",
    category: "marketing-management",
    pathType: "specialization",
    futureJobs: ["Luxury Retail Manager", "Brand Executive"],
  }),
  makeCourse({
    name: "Hospitality & Tourism Management",
    category: "specialized-management",
    pathType: "specialization",
    futureJobs: ["Hospitality Manager", "Tour Ops"],
  }),
  makeCourse({
    name: "Healthcare & Hospital Administration (PG)",
    category: "specialized-management",
    pathType: "postgraduate-degree",
    futureJobs: ["Hospital Admin", "Ops Lead"],
  }),
  makeCourse({
    name: "Retail & E-Commerce Operations",
    category: "specialized-management",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Category Analyst", "Ops Executive"],
  }),
  makeCourse({
    name: "Aviation & Airport Operations",
    category: "specialized-management",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Airport Ops Exec", "Ground Staff Lead"],
  }),
  makeCourse({
    name: "Sports Marketing & Sponsorship",
    category: "specialized-management",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Sports Marketing Exec", "Partnerships Associate"],
  }),
  makeCourse({
    name: "Sustainability & ESG Management",
    category: "operations-supply",
    pathType: "specialization",
    futureJobs: ["ESG Analyst", "Sustainability Coordinator"],
  }),
  makeCourse({
    name: "Customer Experience (CX) Management",
    category: "marketing-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["CX Analyst", "Customer Success Exec"],
  }),
  makeCourse({
    name: "HR Analytics",
    category: "hr-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["HR Analyst", "People Analytics Associate"],
  }),
  makeCourse({
    name: "Compensation & Benefits",
    category: "hr-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["C&B Analyst", "HR Ops"],
  }),
  makeCourse({
    name: "Lean Six Sigma for Operations",
    category: "operations-supply",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Process Improvement Analyst", "Ops Excellence"],
  }),
  makeCourse({
    name: "Warehouse & Fulfillment Management",
    category: "operations-supply",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Warehouse Supervisor", "Fulfillment Lead"],
  }),
  makeCourse({
    name: "Agri Supply Chain & FPO Management",
    category: "rural-agri-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Agri SCM Exec", "Procurement"],
  }),
  makeCourse({
    name: "Social Entrepreneurship",
    category: "rural-agri-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Program Lead", "Founder (Impact)"],
  }),
  makeCourse({
    name: "NGO & Development Project Management",
    category: "rural-agri-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Project Coordinator", "M&E Associate"],
  }),
  makeCourse({
    name: "Corporate Communications & PR",
    category: "marketing-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["PR Executive", "Communications Associate"],
  }),
  makeCourse({
    name: "Data-Driven Marketing (Advanced)",
    category: "marketing-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Performance Marketer", "Growth Analyst"],
  }),
  makeCourse({
    name: "Product Operations",
    category: "it-analytics-management",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Product Ops", "Program Coordinator"],
  }),
];
