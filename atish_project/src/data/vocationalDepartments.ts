import type { Department } from "../types/content";

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");

const catDefaults: Record<
  string,
  {
    pathType: Department["pathType"];
    entryLevel: Department["entryLevel"];
    deliveryMode?: Department["deliveryMode"];
    programType?: Department["programType"];
    duration: string;
    eligibility: string;
    keySubjects: string[];
    futureScope: string;
    industries: string[];
    workSettings: string[];
  }
> = {
  "tech-mech": {
    pathType: "trade-skill",
    entryLevel: "after-10th",
    deliveryMode: "workshop-based",
    duration: "6-18 months",
    eligibility: "After 10th (12th preferred for some)",
    keySubjects: ["Tools & Safety", "Mechanics Basics", "Workshop Practice"],
    futureScope: "Consistent demand for skilled technicians and mechanics.",
    industries: ["Manufacturing", "Maintenance", "Automotive"],
    workSettings: ["Workshops", "Factories", "Field service"],
  },
  "it-digital": {
    pathType: "skill-course",
    entryLevel: "after-10th-or-12th",
    deliveryMode: "practical",
    duration: "3-12 months",
    eligibility: "After 10th/12th; basic computer use",
    keySubjects: ["Computers", "Programming", "Web/Apps", "Digital Tools"],
    futureScope: "High demand for digital, web, and IT support skills.",
    industries: ["IT Services", "Startups", "Digital Agencies"],
    workSettings: ["Offices", "Remote/Freelance"],
  },
  "creative-design-skills": {
    pathType: "creative-diploma",
    entryLevel: "after-10th-or-12th",
    deliveryMode: "practical",
    duration: "3-12 months",
    eligibility: "After 10th/12th; creative interest",
    keySubjects: ["Design Basics", "Software", "Portfolio Projects"],
    futureScope: "Visual content and design skills are in steady demand.",
    industries: ["Design", "Media", "Fashion"],
    workSettings: ["Studios", "Agencies", "Freelance"],
  },
  "hospitality-service": {
    pathType: "service-diploma",
    entryLevel: "after-10th-or-12th",
    deliveryMode: "practical",
    duration: "3-12 months",
    eligibility: "After 10th/12th; customer service skills",
    keySubjects: ["Food Production/Service", "Housekeeping", "Front Office"],
    futureScope: "Hotels, restaurants, and travel services need trained staff.",
    industries: ["Hospitality", "Travel", "Food Services"],
    workSettings: ["Hotels", "Kitchens", "Airports"],
  },
  "healthcare-skill": {
    pathType: "job-role-training",
    entryLevel: "after-12th",
    deliveryMode: "practical",
    duration: "6-18 months",
    eligibility: "After 12th (science helpful)",
    keySubjects: ["Basic Anatomy", "Patient Care", "Lab/Clinical Skills"],
    futureScope: "Growing demand for allied health assistants and technicians.",
    industries: ["Hospitals", "Clinics", "Home Care"],
    workSettings: ["Hospitals", "Labs", "Homes"],
  },
  "agri-rural": {
    pathType: "self-employment-track",
    entryLevel: "after-10th-or-12th",
    deliveryMode: "field-based",
    duration: "3-12 months",
    eligibility: "After 10th/12th; interest in farming",
    keySubjects: ["Farming Practices", "Soil & Water", "Allied Activities"],
    futureScope: "Good for self-employment and agri-entrepreneurship.",
    industries: ["Agriculture", "Agri Services"],
    workSettings: ["Farms", "Rural Field"],
  },
  "business-retail": {
    pathType: "vocational-course",
    entryLevel: "after-10th-or-12th",
    deliveryMode: "practical",
    duration: "3-9 months",
    eligibility: "After 10th/12th; commerce helpful",
    keySubjects: ["Sales", "CRM", "Billing/GST", "E-Commerce"],
    futureScope: "Retail and MSME hiring remains steady; good for self-start.",
    industries: ["Retail", "SMEs", "E-commerce"],
    workSettings: ["Stores", "Offices", "Online"],
  },
  "transport-driving": {
    pathType: "trade-skill",
    entryLevel: "after-10th",
    deliveryMode: "practical",
    duration: "1-6 months",
    eligibility: "After 10th; license requirements apply",
    keySubjects: ["Driving Skills", "Road Safety", "Basic Maintenance"],
    futureScope: "Logistics and last-mile delivery growth keeps demand high.",
    industries: ["Logistics", "Transport", "Delivery"],
    workSettings: ["On-road", "Warehouses"],
  },
  "construction-infra": {
    pathType: "trade-skill",
    entryLevel: "after-10th",
    deliveryMode: "workshop-based",
    duration: "6-12 months",
    eligibility: "After 10th; fitness for field work",
    keySubjects: ["Masonry", "Finishing", "Tools & Safety"],
    futureScope: "Urban projects keep demand for site skills steady.",
    industries: ["Construction", "Infrastructure"],
    workSettings: ["Sites", "Workshops"],
  },
  "electrical-electronics": {
    pathType: "trade-skill",
    entryLevel: "after-10th",
    deliveryMode: "workshop-based",
    duration: "6-12 months",
    eligibility: "After 10th/12th; math basics",
    keySubjects: ["Circuits", "Repair", "Installation", "Safety"],
    futureScope: "Homes, offices, and industry need maintenance techs.",
    industries: ["Maintenance", "Energy", "Electronics Service"],
    workSettings: ["Sites", "Service Centers"],
  },
  "media-communication": {
    pathType: "short-term-course",
    entryLevel: "after-10th-or-12th",
    deliveryMode: "practical",
    duration: "3-9 months",
    eligibility: "After 10th/12th; language/communication skills",
    keySubjects: ["Content", "Voice/Presentation", "Social Media"],
    futureScope: "Growing creator economy and digital comms roles.",
    industries: ["Media", "Agencies", "Creator economy"],
    workSettings: ["Studios", "Remote"],
  },
  "govt-skilling": {
    pathType: "government-skill-program",
    entryLevel: "flexible-entry",
    deliveryMode: "practical",
    duration: "3-12 months",
    eligibility: "As per scheme",
    keySubjects: ["Trade Modules", "Safety", "Employability Skills"],
    futureScope: "Government-recognized certification aids placements/apprenticeships.",
    industries: ["Varies by trade"],
    workSettings: ["Centers", "Workshops"],
  },
};

const baseDefaults = {
  advantages: ["Job-oriented", "Affordable", "Hands-on training", "Short duration"],
  disadvantages: ["May need upskilling for growth", "Physical work in some trades", "Quality varies by provider"],
  skillsNeeded: ["Practical skills", "Safety awareness", "Basic communication", "Learning by doing"],
  higherStudies: ["Advanced certificates", "Diplomas", "Apprenticeships"],
  bestFor: "Students who want quick, practical skills for jobs or self-employment.",
  avoidIf: "You prefer only theoretical study or dislike hands-on practice.",
  salaryBand: "INR 1.8-5 LPA (entry) depending on trade, city, employer",
  trendingLevel: "medium" as const,
  programType: "institute-course" as const,
};

const makeSkill = (
  data: Partial<Department> & {
    name: string;
    category: string;
  },
): Department => {
  const id = data.id ?? slugify(data.name);
  const cat = catDefaults[data.category] ?? catDefaults["tech-mech"];
  return {
    id,
    slug: data.slug ?? id,
    streamId: "vocational",
    name: data.name,
    category: data.category,
    relatedCategories: data.relatedCategories ?? [],
    aliases: data.aliases ?? [],
    pathType: data.pathType ?? cat.pathType,
    entryLevel: data.entryLevel ?? cat.entryLevel,
    deliveryMode: data.deliveryMode ?? cat.deliveryMode ?? "practical",
    programType: data.programType ?? cat.programType ?? baseDefaults.programType,
    duration: data.duration ?? cat.duration,
    eligibility: data.eligibility ?? cat.eligibility,
    entranceExams: data.entranceExams ?? [],
    courseStructure: data.courseStructure ?? [],
    practicalTraining: data.practicalTraining ?? "Regular hands-on sessions",
    workshopFocus: data.workshopFocus ?? "Tool handling and safety drills",
    apprenticeshipOptions: data.apprenticeshipOptions ?? ["Apprenticeship / on-the-job training recommended"],
    selfEmploymentPotential: data.selfEmploymentPotential ?? "Can start small services or freelance after experience",
    certificationRecognition: data.certificationRecognition ?? "Institute or govt-recognized certificate",
    keySubjects: data.keySubjects ?? cat.keySubjects,
    skillsNeeded: data.skillsNeeded ?? baseDefaults.skillsNeeded,
    advantages: data.advantages ?? baseDefaults.advantages,
    disadvantages: data.disadvantages ?? baseDefaults.disadvantages,
    futureJobs: data.futureJobs ?? ["Technician", "Operator", "Assistant"],
    higherStudies: data.higherStudies ?? baseDefaults.higherStudies,
    bestFor: data.bestFor ?? baseDefaults.bestFor,
    avoidIf: data.avoidIf ?? baseDefaults.avoidIf,
    futureScope: data.futureScope ?? cat.futureScope,
    salaryBand: data.salaryBand ?? baseDefaults.salaryBand,
    industries: data.industries ?? cat.industries,
    workSettings: data.workSettings ?? cat.workSettings,
    trendingLevel: data.trendingLevel ?? baseDefaults.trendingLevel,
    icon: data.icon,
    colorTheme: data.colorTheme,
    featured: data.featured ?? false,
    order: data.order,
    tamilName: data.tamilName,
    overview:
      data.overview ??
      `${data.name} is a hands-on skill course with workshops and practice to get you job-ready or start freelancing.`,
  };
};

export const vocationalDepartments: Department[] = [
  // 1. Technical & Mechanical Skills
  makeSkill({ name: "Electrician", category: "tech-mech", futureJobs: ["Electrician", "Maintenance Tech"] }),
  makeSkill({ name: "Fitter", category: "tech-mech", futureJobs: ["Fitter", "Assembly Technician"] }),
  makeSkill({ name: "Welder", category: "tech-mech", futureJobs: ["Welder", "Fabricator"] }),
  makeSkill({ name: "Mechanic (Motor Vehicle)", category: "tech-mech", futureJobs: ["Motor Mechanic"] }),
  makeSkill({ name: "Diesel Mechanic", category: "tech-mech", futureJobs: ["Diesel Mechanic"] }),
  makeSkill({ name: "AC & Refrigeration Technician", category: "tech-mech", pathType: "technical-diploma", futureJobs: ["HVAC Technician"] }),
  makeSkill({ name: "CNC Machine Operator", category: "tech-mech", futureJobs: ["CNC Operator"] }),
  makeSkill({ name: "Machinist", category: "tech-mech", futureJobs: ["Machinist", "Tool Room Assistant"] }),

  // 2. Computer & IT Skills
  makeSkill({ name: "Data Entry Operator", category: "it-digital", pathType: "job-role-training", duration: "3-6 months", futureJobs: ["Data Entry"] }),
  makeSkill({ name: "Computer Operator", category: "it-digital", duration: "3-6 months", futureJobs: ["Computer Operator", "Office IT Support"] }),
  makeSkill({ name: "Web Development", category: "it-digital", pathType: "short-term-course", keySubjects: ["HTML/CSS/JS", "Front-end"], futureJobs: ["Web Developer"] }),
  makeSkill({ name: "App Development", category: "it-digital", pathType: "short-term-course", keySubjects: ["Mobile Dev", "UI"], futureJobs: ["App Developer"] }),
  makeSkill({ name: "Graphic Design", category: "it-digital", pathType: "certificate", relatedCategories: ["creative-design-skills"], futureJobs: ["Graphic Designer"] }),
  makeSkill({ name: "Digital Marketing", category: "it-digital", pathType: "certificate", futureJobs: ["Digital Marketer"] }),
  makeSkill({ name: "Cyber Security Basics", category: "it-digital", pathType: "short-term-course", futureJobs: ["Security Support"], trendingLevel: "high" }),
  makeSkill({ name: "Software Testing", category: "it-digital", pathType: "short-term-course", futureJobs: ["Test Engineer (Junior)"] }),

  // 3. Creative & Design Skills
  makeSkill({ name: "Fashion Designing", category: "creative-design-skills", pathType: "creative-diploma", futureJobs: ["Fashion Assistant", "Tailor/Designer"] }),
  makeSkill({ name: "Tailoring", category: "creative-design-skills", pathType: "skill-course", futureJobs: ["Tailor", "Boutique Owner"], selfEmploymentPotential: "High" }),
  makeSkill({ name: "Beautician / Makeup Artist", category: "creative-design-skills", futureJobs: ["Beautician", "Makeup Artist"], selfEmploymentPotential: "High" }),
  makeSkill({ name: "Photography", category: "creative-design-skills", futureJobs: ["Photographer"], selfEmploymentPotential: "High" }),
  makeSkill({ name: "Video Editing", category: "creative-design-skills", futureJobs: ["Video Editor"], programType: "private-training" }),
  makeSkill({ name: "Animation", category: "creative-design-skills", futureJobs: ["Animator"], trendingLevel: "high" }),
  makeSkill({ name: "Interior Decoration", category: "creative-design-skills", futureJobs: ["Interior Assistant"], programType: "institute-course" }),

  // 4. Hospitality & Service Skills
  makeSkill({ name: "Cooking / Chef Course", category: "hospitality-service", futureJobs: ["Commis", "Kitchen Assistant"] }),
  makeSkill({ name: "Bakery & Confectionery", category: "hospitality-service", futureJobs: ["Baker", "Pastry Assistant"], selfEmploymentPotential: "Good for cloud bakery/home bakery" }),
  makeSkill({ name: "Hotel Management (Short-Term)", category: "hospitality-service", pathType: "service-diploma", duration: "6-12 months", futureJobs: ["Hotel Operations Trainee"] }),
  makeSkill({ name: "Housekeeping", category: "hospitality-service", futureJobs: ["Housekeeping Associate"] }),
  makeSkill({ name: "Front Office Executive", category: "hospitality-service", futureJobs: ["Front Office Associate"] }),
  makeSkill({ name: "Bartending", category: "hospitality-service", futureJobs: ["Bartender", "Beverage Steward"] }),

  // 5. Healthcare & Paramedical Skills
  makeSkill({ name: "Nursing Assistant", category: "healthcare-skill", futureJobs: ["Nursing Assistant"] }),
  makeSkill({ name: "Patient Care Assistant", category: "healthcare-skill", futureJobs: ["Patient Care Assistant"] }),
  makeSkill({ name: "Phlebotomy Technician", category: "healthcare-skill", futureJobs: ["Phlebotomist"] }),
  makeSkill({ name: "Lab Assistant", category: "healthcare-skill", futureJobs: ["Lab Assistant"] }),
  makeSkill({ name: "Home Health Aide", category: "healthcare-skill", futureJobs: ["Home Health Aide"] }),
  makeSkill({ name: "Medical Attendant", category: "healthcare-skill", futureJobs: ["Ward Attendant"] }),

  // 6. Agriculture & Rural Skills
  makeSkill({ name: "Organic Farming", category: "agri-rural", programType: "self-employment-track", futureJobs: ["Organic Farmer"], selfEmploymentPotential: "High" }),
  makeSkill({ name: "Dairy Farming", category: "agri-rural", futureJobs: ["Dairy Entrepreneur"], selfEmploymentPotential: "High" }),
  makeSkill({ name: "Poultry Farming", category: "agri-rural", futureJobs: ["Poultry Farmer"] }),
  makeSkill({ name: "Fish Farming", category: "agri-rural", futureJobs: ["Aquaculture Farmer"] }),
  makeSkill({ name: "Beekeeping (Apiculture)", category: "agri-rural", futureJobs: ["Beekeeper"], selfEmploymentPotential: "High" }),
  makeSkill({ name: "Mushroom Cultivation", category: "agri-rural", futureJobs: ["Mushroom Grower"], selfEmploymentPotential: "High" }),

  // 7. Business & Retail Skills
  makeSkill({ name: "Retail Sales Executive", category: "business-retail", futureJobs: ["Sales Associate"] }),
  makeSkill({ name: "Entrepreneurship", category: "business-retail", programType: "self-employment-track", futureJobs: ["Founder", "Small Business Owner"] }),
  makeSkill({ name: "Tally with GST", category: "business-retail", pathType: "certificate", futureJobs: ["Accounts Assistant"] }),
  makeSkill({ name: "Business Management Basics", category: "business-retail", futureJobs: ["Admin Assistant", "Ops Assistant"] }),
  makeSkill({ name: "Customer Relationship Management", category: "business-retail", futureJobs: ["CRM Executive"] }),
  makeSkill({ name: "E-Commerce Management", category: "business-retail", futureJobs: ["E-commerce Ops", "Marketplace Exec"] }),

  // 8. Transportation & Driving Skills
  makeSkill({ name: "Driving (LMV / HMV)", category: "transport-driving", futureJobs: ["Driver"], certificationRecognition: "License-based" }),
  makeSkill({ name: "Transport & Logistics", category: "transport-driving", futureJobs: ["Logistics Coordinator"] }),
  makeSkill({ name: "Delivery & Supply Chain", category: "transport-driving", futureJobs: ["Delivery Executive"] }),
  makeSkill({ name: "Warehouse Management", category: "transport-driving", futureJobs: ["Warehouse Associate"] }),

  // 9. Construction & Infrastructure Skills
  makeSkill({ name: "Mason (Construction Worker)", category: "construction-infra", futureJobs: ["Mason"] }),
  makeSkill({ name: "Plumber", category: "construction-infra", futureJobs: ["Plumber"] }),
  makeSkill({ name: "Carpenter", category: "construction-infra", futureJobs: ["Carpenter"] }),
  makeSkill({ name: "Painter", category: "construction-infra", futureJobs: ["Painter"] }),
  makeSkill({ name: "Tile Worker", category: "construction-infra", futureJobs: ["Tiler"] }),
  makeSkill({ name: "Steel Fixer", category: "construction-infra", futureJobs: ["Steel Fixer"] }),

  // 10. Electrical & Electronics Skills
  makeSkill({ name: "Electrical Technician", category: "electrical-electronics", futureJobs: ["Electrical Technician"] }),
  makeSkill({ name: "Electronics Repair Technician", category: "electrical-electronics", futureJobs: ["Electronics Technician"] }),
  makeSkill({ name: "Mobile Repairing", category: "electrical-electronics", futureJobs: ["Mobile Technician"] }),
  makeSkill({ name: "Solar Panel Technician", category: "electrical-electronics", trendingLevel: "high", futureJobs: ["Solar Technician"] }),
  makeSkill({ name: "CCTV Installation", category: "electrical-electronics", futureJobs: ["CCTV Technician"] }),

  // 11. Media & Communication Skills
  makeSkill({ name: "Content Creation", category: "media-communication", futureJobs: ["Content Creator", "Social Media Exec"] }),
  makeSkill({ name: "Public Speaking", category: "media-communication", futureJobs: ["Presenter", "Trainer"] }),
  makeSkill({ name: "Radio Jockey (RJ)", category: "media-communication", futureJobs: ["RJ", "Voice Talent"] }),
  makeSkill({ name: "Anchoring", category: "media-communication", futureJobs: ["Anchor/Host"] }),
  makeSkill({ name: "Social Media Management", category: "media-communication", futureJobs: ["Social Media Exec"] }),

  // 12. Government Skill Programs
  makeSkill({
    name: "ITI Courses",
    category: "govt-skilling",
    pathType: "government-skill-program",
    programType: "iti-pathway",
    overview: "Government ITI trades like electrician, fitter, welder, mech streams with national certification.",
    duration: "1-2 years (trade-specific)",
    eligibility: "After 10th/12th depending on trade",
    futureJobs: ["ITI-certified Technician", "Apprentice"],
  }),
  makeSkill({
    name: "Skill India Programs",
    category: "govt-skilling",
    pathType: "government-skill-program",
    programType: "government-program",
    overview: "Short-term NSQF-aligned programs in multiple trades with placement support.",
    duration: "2-6 months",
    futureJobs: ["Certified Trainee", "Apprentice"],
  }),
  makeSkill({
    name: "PMKVY (Pradhan Mantri Kaushal Vikas Yojana)",
    category: "govt-skilling",
    pathType: "government-skill-program",
    programType: "government-program",
    overview: "Flagship PMKVY skilling with assessment and certification in many trades.",
    duration: "2-6 months",
    futureJobs: ["Certified Trainee"],
  }),
  makeSkill({
    name: "NSDC Skill Courses",
    category: "govt-skilling",
    pathType: "government-skill-program",
    programType: "government-program",
    overview: "NSDC-affiliated sector skill courses with SSC certifications.",
    duration: "2-6 months",
    futureJobs: ["Certified Trainee"],
  }),
];
