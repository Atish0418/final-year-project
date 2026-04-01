import type { Department } from "../types/content";

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");

const catDefaults: Record<
  string,
  { pathType: Department["pathType"]; duration: string; eligibility: string; keySubjects: string[]; futureScope: string; industries: string[] }
> = {
  "core-commerce-degree": {
    pathType: "degree",
    duration: "3 years (B.Com)",
    eligibility: "12th (Commerce preferred); colleges may require accountancy & math",
    keySubjects: ["Accounting", "Finance", "Economics", "Business Law"],
    futureScope: "Good base for finance, accounting, analytics, and higher studies like CA/CS/CMA/MBA.",
    industries: ["Banking", "Finance", "Consulting", "Accounting"],
  },
  "management-business": {
    pathType: "degree",
    duration: "3 years (BBA/BBM)",
    eligibility: "12th any stream; aptitude for business and communication",
    keySubjects: ["Management", "Marketing", "HR", "Operations"],
    futureScope: "Opens roles in management trainee tracks and as a bridge to MBA.",
    industries: ["Corporate", "Startups", "Retail", "Consulting"],
  },
  "finance-professional": {
    pathType: "professional",
    duration: "2-4 years (varies by exam/level)",
    eligibility: "12th (Commerce helpful); specific bodies have their own rules",
    keySubjects: ["Financial Reporting", "Tax", "Audit", "Financial Management"],
    futureScope: "High-value roles in finance, audit, and investment after clearing stages.",
    industries: ["Audit", "Banking", "Investment", "Corporate Finance"],
  },
  "banking-insurance": {
    pathType: "degree",
    duration: "3 years",
    eligibility: "12th with math/accountancy preferred",
    keySubjects: ["Banking Ops", "Insurance", "Risk", "Regulations"],
    futureScope: "Stable demand in banks, insurance firms, and risk teams.",
    industries: ["Banking", "Insurance", "NBFC"],
  },
  "commerce-technology": {
    pathType: "specialization",
    duration: "3 years",
    eligibility: "12th; math/CS helpful",
    keySubjects: ["Analytics", "Digital Business", "E-Commerce", "Data Tools"],
    futureScope: "High growth in digital business, analytics, and marketing tech.",
    industries: ["E-commerce", "IT Services", "Digital Marketing"],
  },
  "international-specialized": {
    pathType: "specialization",
    duration: "3 years",
    eligibility: "12th; interest in trade/logistics",
    keySubjects: ["International Business", "Logistics", "Trade Docs"],
    futureScope: "Careers in export-import, logistics, and global business roles.",
    industries: ["Logistics", "Trade", "Shipping", "Global Retail"],
  },
  "law-commerce": {
    pathType: "integrated-law",
    duration: "5 years (integrated)",
    eligibility: "12th; entrance tests like CLAT/SLAT",
    keySubjects: ["Contracts", "Corporate Law", "Economics"],
    futureScope: "Corporate legal roles, compliance, and higher legal studies.",
    industries: ["Legal", "Corporate", "Compliance"],
  },
  "diploma-short": {
    pathType: "diploma",
    duration: "6-18 months",
    eligibility: "12th (sometimes 10th) depending on program",
    keySubjects: ["Accounts", "GST", "Banking Ops", "Office Tools"],
    futureScope: "Quick entry into junior roles; good for upskilling or side credentials.",
    industries: ["SMEs", "Accounting", "Admin", "Banking"],
  },
};

const baseDefaults = {
  skillsNeeded: ["Numerical ability", "Analysis", "Communication", "MS Excel"],
  advantages: ["Practical business knowledge", "Multiple career tracks", "Good for higher studies"],
  disadvantages: ["Needs consistency with numbers", "Competitive internships", "Some roles have exam hurdles"],
  higherStudies: ["MBA", "M.Com", "CA/CS/CMA stages", "Specialized PG diplomas"],
  bestFor: "Students who enjoy business, finance, and applied problem-solving.",
  avoidIf: "You dislike numbers, regulations, or structured study for exams.",
  salaryBand: "INR 3-10 LPA (entry) depending on role and credentials",
  trendingLevel: "medium" as const,
};

const makeCourse = (
  data: Partial<Department> & {
    name: string;
    category: string;
  },
): Department => {
  const id = data.id ?? slugify(data.name);
  const cat = catDefaults[data.category] ?? catDefaults["core-commerce-degree"];
  return {
    id,
    slug: data.slug ?? id,
    streamId: "commerce",
    name: data.name,
    category: data.category,
    relatedCategories: data.relatedCategories ?? [],
    pathType: data.pathType ?? cat.pathType,
    duration: data.duration ?? cat.duration,
    eligibility: data.eligibility ?? cat.eligibility,
    entranceExams: data.entranceExams ?? [],
    courseStructure: data.courseStructure ?? [],
    keySubjects: data.keySubjects ?? cat.keySubjects,
    skillsNeeded: data.skillsNeeded ?? baseDefaults.skillsNeeded,
    advantages: data.advantages ?? baseDefaults.advantages,
    disadvantages: data.disadvantages ?? baseDefaults.disadvantages,
    futureJobs: data.futureJobs ?? ["Business Analyst", "Finance Exec", "Operations Exec"],
    higherStudies: data.higherStudies ?? baseDefaults.higherStudies,
    bestFor: data.bestFor ?? baseDefaults.bestFor,
    avoidIf: data.avoidIf ?? baseDefaults.avoidIf,
    futureScope: data.futureScope ?? cat.futureScope,
    salaryBand: data.salaryBand ?? baseDefaults.salaryBand,
    industries: data.industries ?? cat.industries,
    trendingLevel: data.trendingLevel ?? baseDefaults.trendingLevel,
    icon: data.icon,
    colorTheme: data.colorTheme,
    featured: data.featured ?? false,
    order: data.order,
    aliases: data.aliases ?? [],
    tamilName: data.tamilName,
    overview:
      data.overview ??
      `${data.name} covers commerce fundamentals with projects and internships so you can apply concepts in real business roles.`,
  };
};

export const commerceDepartments: Department[] = [
  // 1. Core Commerce Degree Courses
  makeCourse({ name: "BCom (General)", category: "core-commerce-degree" }),
  makeCourse({
    name: "BCom Accounting & Finance",
    category: "core-commerce-degree",
    keySubjects: ["Financial Accounting", "Cost Accounting", "Taxation", "Auditing"],
    futureJobs: ["Accountant", "Audit Assistant", "Finance Analyst"],
  }),
  makeCourse({
    name: "BCom Corporate Secretaryship",
    category: "core-commerce-degree",
    keySubjects: ["Company Law", "Secretarial Practice", "Corporate Governance"],
    futureJobs: ["Secretarial Assistant", "Compliance Executive"],
  }),
  makeCourse({
    name: "BCom Banking & Insurance",
    category: "core-commerce-degree",
    relatedCategories: ["banking-insurance"],
    keySubjects: ["Banking Operations", "Insurance Products", "Risk Basics"],
    futureJobs: ["Bank Ops Executive", "Insurance Advisor"],
  }),
  makeCourse({
    name: "BCom Computer Applications",
    category: "core-commerce-degree",
    relatedCategories: ["commerce-technology"],
    keySubjects: ["Accounting Software", "MIS", "Databases", "E-Business"],
    futureJobs: ["MIS Executive", "Accounting Tech Associate"],
  }),
  makeCourse({
    name: "BCom Marketing Management",
    category: "core-commerce-degree",
    keySubjects: ["Marketing Principles", "Consumer Behaviour", "Digital Marketing"],
    futureJobs: ["Marketing Executive", "Brand Assistant"],
  }),
  makeCourse({
    name: "BCom Taxation",
    category: "core-commerce-degree",
    keySubjects: ["Direct Tax", "Indirect Tax", "GST"],
    futureJobs: ["Tax Associate", "GST Analyst"],
  }),
  makeCourse({
    name: "BCom Finance",
    category: "core-commerce-degree",
    keySubjects: ["Financial Markets", "Investment", "Risk Management"],
    futureJobs: ["Finance Analyst", "Credit Analyst"],
  }),
  makeCourse({
    name: "BCom International Business",
    category: "core-commerce-degree",
    relatedCategories: ["international-specialized"],
    keySubjects: ["Export-Import", "Trade Finance", "Logistics"],
    futureJobs: ["Trade Analyst", "Logistics Coordinator"],
  }),
  makeCourse({
    name: "BCom Business Analytics",
    category: "core-commerce-degree",
    relatedCategories: ["commerce-technology"],
    keySubjects: ["Data Analytics", "Statistics", "BI Tools"],
    futureJobs: ["Business Analyst", "Data Analyst (Business)"],
    trendingLevel: "high",
  }),

  // 2. Management & Business Courses
  makeCourse({ name: "BBA (Bachelor of Business Administration)", category: "management-business", duration: "3 years (BBA)" }),
  makeCourse({ name: "BBA Finance", category: "management-business" }),
  makeCourse({ name: "BBA Marketing", category: "management-business" }),
  makeCourse({ name: "BBA Human Resource Management (HR)", category: "management-business" }),
  makeCourse({
    name: "BBA International Business",
    category: "management-business",
    relatedCategories: ["international-specialized"],
  }),
  makeCourse({ name: "BBA Entrepreneurship", category: "management-business", futureJobs: ["Entrepreneur", "Startup Ops", "Business Development"] }),
  makeCourse({ name: "BBM (Bachelor of Business Management)", category: "management-business" }),

  // 3. Finance & Professional Courses
  makeCourse({
    name: "Chartered Accountant (CA)",
    category: "finance-professional",
    pathType: "professional",
    duration: "4-5 years incl. articleship",
    eligibility: "12th + CA Foundation",
    courseStructure: ["Foundation", "Intermediate", "Articleship", "Final"],
    futureJobs: ["Chartered Accountant", "Audit Associate", "Tax Consultant"],
    trendingLevel: "high",
  }),
  makeCourse({
    name: "Company Secretary (CS)",
    category: "finance-professional",
    pathType: "professional",
    courseStructure: ["CSEET/Executive", "Professional", "Practical Training"],
    futureJobs: ["Company Secretary", "Compliance Officer"],
  }),
  makeCourse({
    name: "Cost and Management Accountant (CMA)",
    category: "finance-professional",
    pathType: "professional",
    courseStructure: ["Foundation", "Intermediate", "Final", "Training"],
    futureJobs: ["Cost Accountant", "Management Accountant"],
  }),
  makeCourse({
    name: "CFA (Chartered Financial Analyst)",
    category: "finance-professional",
    pathType: "professional",
    duration: "2-3 years (Level I-III)",
    eligibility: "Final year undergrad or graduate",
    futureJobs: ["Investment Analyst", "Portfolio Analyst", "Equity Research Associate"],
  }),
  makeCourse({
    name: "Financial Modeling Courses",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Financial Analyst", "Valuation Analyst"],
  }),
  makeCourse({
    name: "Investment Banking Courses",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["IB Analyst", "Deal Support Analyst"],
  }),

  // 4. Banking & Insurance Courses (unique)
  makeCourse({
    name: "Banking & Finance Courses",
    category: "banking-insurance",
    pathType: "specialization",
    duration: "6-12 months",
    futureJobs: ["Bank Ops", "Credit Ops", "Sales Officer"],
  }),
  makeCourse({
    name: "Diploma in Banking",
    category: "banking-insurance",
    pathType: "diploma",
    duration: "1 year",
    futureJobs: ["Banking Assistant", "Customer Service Rep"],
  }),
  makeCourse({
    name: "Insurance Management Courses",
    category: "banking-insurance",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Insurance Advisor", "Claims Executive"],
  }),
  makeCourse({
    name: "Risk Management Courses",
    category: "banking-insurance",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Risk Analyst", "Credit Risk Associate"],
  }),

  // 5. Commerce + Technology Courses
  makeCourse({
    name: "BBA Business Analytics",
    category: "commerce-technology",
    pathType: "degree",
    relatedCategories: ["management-business"],
    keySubjects: ["Analytics", "Statistics", "Visualization", "SQL"],
    futureJobs: ["Business Analyst", "Data Analyst"],
    trendingLevel: "high",
  }),
  makeCourse({
    name: "E-Commerce Courses",
    category: "commerce-technology",
    pathType: "specialization",
    duration: "6-12 months",
    futureJobs: ["E-Commerce Exec", "Marketplace Manager"],
  }),
  makeCourse({
    name: "Digital Marketing Courses",
    category: "commerce-technology",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Digital Marketer", "SEO/SEM Executive"],
    trendingLevel: "high",
  }),
  makeCourse({
    name: "Data Analytics for Business",
    category: "commerce-technology",
    pathType: "certificate",
    duration: "4-8 months",
    futureJobs: ["Data Analyst", "Reporting Analyst"],
  }),

  // 6. International & Specialized
  makeCourse({
    name: "Logistics & Supply Chain Management",
    category: "international-specialized",
    pathType: "specialization",
    duration: "1-2 years (diploma/pg)",
    futureJobs: ["Supply Chain Analyst", "Logistics Coordinator"],
  }),
  makeCourse({
    name: "Export-Import Management",
    category: "international-specialized",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Export Exec", "Documentation Exec"],
  }),
  makeCourse({
    name: "Foreign Trade Courses",
    category: "international-specialized",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Trade Analyst", "Operations Exec"],
  }),

  // 7. Law + Commerce
  makeCourse({
    name: "BCom LLB",
    category: "law-commerce",
    pathType: "integrated-law",
    duration: "5 years",
    eligibility: "12th with CLAT/SLAT/college tests",
    keySubjects: ["Contracts", "Corporate Law", "Accounting"],
    futureJobs: ["Corporate Lawyer", "Compliance Associate"],
  }),
  makeCourse({
    name: "BBA LLB",
    category: "law-commerce",
    pathType: "integrated-law",
    duration: "5 years",
    futureJobs: ["Corporate Lawyer", "Legal Associate"],
  }),
  makeCourse({
    name: "Corporate Law Courses",
    category: "law-commerce",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Legal Executive", "Compliance Analyst"],
  }),

  // 8. Diploma & Short-Term Commerce Courses
  makeCourse({
    name: "Diploma in Accounting",
    category: "diploma-short",
    pathType: "diploma",
    keySubjects: ["Accounts", "Tally", "GST"],
  }),
  makeCourse({
    name: "Tally with GST",
    category: "diploma-short",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Accounts Assistant", "GST Executive"],
  }),
  makeCourse({
    name: "Diploma in Banking & Finance",
    category: "diploma-short",
    pathType: "diploma",
    futureJobs: ["Bank Assistant", "Finance Ops"],
  }),
  makeCourse({
    name: "Diploma in Taxation",
    category: "diploma-short",
    pathType: "diploma",
    futureJobs: ["Tax Assistant", "GST Analyst"],
  }),
  makeCourse({
    name: "Business Communication Courses",
    category: "diploma-short",
    pathType: "certificate",
    futureJobs: ["Client Service Exec", "Coordinator"],
  }),
  makeCourse({
    name: "Office Management Courses",
    category: "diploma-short",
    pathType: "certificate",
    futureJobs: ["Office Administrator", "Operations Assistant"],
  }),

  // Additional pathways to reach 50+ options (still commerce-relevant)
  makeCourse({
    name: "Actuarial Science (Foundation + Exams)",
    category: "finance-professional",
    pathType: "professional",
    duration: "3-5 years (exam based)",
    keySubjects: ["Probability", "Statistics", "Risk Models"],
    futureJobs: ["Actuary Analyst", "Risk Modeler"],
  }),
  makeCourse({
    name: "FinTech & Payments",
    category: "commerce-technology",
    pathType: "specialization",
    duration: "6-12 months",
    futureJobs: ["Product Analyst", "Payments Ops"],
  }),
  makeCourse({
    name: "Treasury & Investment Operations",
    category: "finance-professional",
    pathType: "certificate",
    duration: "4-6 months",
    futureJobs: ["Treasury Analyst", "Operations Analyst"],
  }),
  makeCourse({
    name: "Audit & Assurance Courses",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Audit Assistant", "Internal Audit Trainee"],
  }),
  makeCourse({
    name: "Forensic Accounting & Fraud Detection",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Forensic Analyst", "Fraud Investigator"],
  }),
  makeCourse({
    name: "Wealth Management & Financial Planning",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Wealth Advisor", "Financial Planner"],
  }),
  makeCourse({
    name: "Equity Research & Stock Market Courses",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Equity Research Associate", "Trader Assistant"],
  }),
  makeCourse({
    name: "Retail Management",
    category: "management-business",
    pathType: "specialization",
    duration: "1 year (diploma/pg)",
    futureJobs: ["Store Manager Trainee", "Category Analyst"],
  }),
  makeCourse({
    name: "Supply Chain Finance",
    category: "international-specialized",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["SCF Analyst", "Operations Analyst"],
  }),
  makeCourse({
    name: "GST Practitioner Course",
    category: "diploma-short",
    pathType: "certificate",
    duration: "2-4 months",
    futureJobs: ["GST Practitioner", "Tax Consultant"],
  }),
  makeCourse({
    name: "Corporate Financial Reporting",
    category: "finance-professional",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Reporting Analyst", "Financial Analyst"],
  }),
  makeCourse({
    name: "Business Analytics (PG/Certificate)",
    category: "commerce-technology",
    pathType: "certificate",
    duration: "6-12 months",
    futureJobs: ["Business Analyst", "BI Analyst"],
  }),
  makeCourse({
    name: "Entrepreneurship & Startup Management",
    category: "management-business",
    pathType: "certificate",
    duration: "3-6 months",
    futureJobs: ["Founder", "Startup Ops", "BD Associate"],
  }),
];
