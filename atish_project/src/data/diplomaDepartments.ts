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
  "eng-diploma": {
    pathType: "polytechnic",
    entryLevel: "after-10th-or-12th",
    duration: "3 years",
    eligibility: "10th/12th with math & science",
    keySubjects: ["Applied Math", "Physics", "Engineering Drawing"],
    futureScope: "Steady demand for diploma engineers with lateral entry to B.E/B.Tech.",
    industries: ["Construction", "Manufacturing", "Automotive"],
  },
  "it-diploma": {
    pathType: "diploma",
    entryLevel: "after-12th",
    duration: "1-3 years",
    eligibility: "10th/12th; basic computers",
    keySubjects: ["Programming", "OS", "Networking", "Databases"],
    futureScope: "High demand for software, web, and IT support roles.",
    industries: ["IT Services", "Product", "Startups"],
  },
  "medical-diploma": {
    pathType: "healthcare-diploma",
    entryLevel: "after-12th",
    duration: "2-3 years",
    eligibility: "12th with PCB preferred",
    keySubjects: ["Anatomy basics", "Lab/Imaging", "Clinical procedures"],
    futureScope: "Healthcare facilities need skilled technicians; pathways to higher health studies.",
    industries: ["Hospitals", "Diagnostics", "Pharmacy"],
  },
  "agri-diploma": {
    pathType: "diploma",
    entryLevel: "after-10th-or-12th",
    duration: "2-3 years",
    eligibility: "10th/12th; interest in agriculture",
    keySubjects: ["Crop Science", "Soil", "Irrigation", "Livestock basics"],
    futureScope: "Agri mechanization, food processing, and rural entrepreneurship roles.",
    industries: ["AgriTech", "Dairy", "Fisheries", "Food"],
  },
  "creative-diploma": {
    pathType: "creative-diploma",
    entryLevel: "after-12th",
    duration: "1-2 years",
    eligibility: "10th/12th; portfolio helpful",
    keySubjects: ["Design Fundamentals", "Software Tools", "Projects"],
    futureScope: "Visual media, fashion, interiors, and digital content careers.",
    industries: ["Design Studios", "Media", "Fashion", "Advertising"],
  },
  "commerce-diploma": {
    pathType: "service-diploma",
    entryLevel: "after-10th-or-12th",
    duration: "1-2 years",
    eligibility: "10th/12th; commerce helpful",
    keySubjects: ["Accounts", "GST", "Business Basics"],
    futureScope: "Entry roles in accounting, admin, banking support.",
    industries: ["SMEs", "Banks", "Back-office"],
  },
  "hospitality-diploma": {
    pathType: "service-diploma",
    entryLevel: "after-10th-or-12th",
    duration: "1-2 years",
    eligibility: "10th/12th; good communication",
    keySubjects: ["Food Production", "Service", "Housekeeping"],
    futureScope: "Hotels, airlines, and food service roles with growth via experience.",
    industries: ["Hospitality", "Airlines", "Food Services"],
  },
  "trade-skill-diploma": {
    pathType: "trade-skill",
    entryLevel: "after-10th",
    duration: "1-2 years",
    eligibility: "10th; fitness for hands-on work",
    keySubjects: ["Workshop Practice", "Safety", "Tools & Equipment"],
    futureScope: "Skilled trades with apprenticeship, contracting, or self-employment paths.",
    industries: ["Construction", "Maintenance", "Energy"],
  },
  "transport-marine-diploma": {
    pathType: "technical-diploma",
    entryLevel: "after-10th-or-12th",
    duration: "2-3 years",
    eligibility: "10th/12th with science",
    keySubjects: ["Mechanics", "Transport Systems", "Marine Basics"],
    futureScope: "Ops and maintenance roles in transport, marine, and logistics.",
    industries: ["Shipping", "Railways", "Logistics"],
  },
  "law-social-diploma": {
    pathType: "diploma",
    entryLevel: "after-12th",
    duration: "1 year",
    eligibility: "12th; humanities/commerce helpful",
    keySubjects: ["Law Basics", "Rights", "Society"],
    futureScope: "Support roles in legal, compliance, NGO, and admin.",
    industries: ["Legal Services", "NGOs", "Public Sector"],
  },
};

const baseDefaults = {
  advantages: ["Practical & job-ready", "Shorter duration", "Affordable", "Lateral entry options"],
  disadvantages: ["May need higher study for rapid growth", "Physical/lab work in some trades", "Placement varies by institute"],
  skillsNeeded: ["Hands-on practice", "Safety awareness", "Basic math", "Communication"],
  higherStudies: ["Lateral entry to B.E/B.Tech", "Advanced diplomas", "Certifications"],
  bestFor: "Students who want a practical, skill-focused path after 10th/12th.",
  avoidIf: "You prefer purely theoretical study or dislike labs/workshops.",
  salaryBand: "INR 2-6 LPA (entry) depending on trade and city",
  trendingLevel: "medium" as const,
};

const makeDiploma = (
  data: Partial<Department> & {
    name: string;
    category: string;
  },
): Department => {
  const id = data.id ?? slugify(data.name);
  const cat = catDefaults[data.category] ?? catDefaults["eng-diploma"];
  return {
    id,
    slug: data.slug ?? id,
    streamId: "diploma",
    name: data.name,
    category: data.category,
    relatedCategories: data.relatedCategories ?? [],
    pathType: data.pathType ?? cat.pathType,
    entryLevel: data.entryLevel ?? cat.entryLevel,
    deliveryMode: data.deliveryMode ?? cat.deliveryMode ?? "practical",
    duration: data.duration ?? cat.duration,
    eligibility: data.eligibility ?? cat.eligibility,
    entranceExams: data.entranceExams ?? [],
    courseStructure: data.courseStructure ?? [],
    practicalTraining: data.practicalTraining ?? "Regular labs/workshops each term",
    workshopFocus: data.workshopFocus ?? "Tool handling, safety, and supervised practice",
    internshipFocus: data.internshipFocus ?? "Industrial training or apprenticeship recommended",
    lateralEntryOptions: data.lateralEntryOptions ?? ["Lateral entry to 2nd year B.E/B.Tech where allowed"],
    keySubjects: data.keySubjects ?? cat.keySubjects,
    skillsNeeded: data.skillsNeeded ?? baseDefaults.skillsNeeded,
    advantages: data.advantages ?? baseDefaults.advantages,
    disadvantages: data.disadvantages ?? baseDefaults.disadvantages,
    futureJobs: data.futureJobs ?? ["Technician", "Operator", "Junior Engineer"],
    higherStudies: data.higherStudies ?? baseDefaults.higherStudies,
    certifications: data.certifications ?? [],
    bestFor: data.bestFor ?? baseDefaults.bestFor,
    avoidIf: data.avoidIf ?? baseDefaults.avoidIf,
    futureScope: data.futureScope ?? cat.futureScope,
    salaryBand: data.salaryBand ?? baseDefaults.salaryBand,
    industries: data.industries ?? cat.industries,
    workSettings: data.workSettings ?? ["Workshops", "Factories", "Field Sites", "Labs"],
    trendingLevel: data.trendingLevel ?? baseDefaults.trendingLevel,
    icon: data.icon,
    colorTheme: data.colorTheme,
    featured: data.featured ?? false,
    order: data.order,
    aliases: data.aliases ?? [],
    tamilName: data.tamilName,
    overview:
      data.overview ??
      `${data.name} is a hands-on diploma/polytechnic path with workshops, labs, and internships to make you job-ready.`,
  };
};

export const diplomaDepartments: Department[] = [
  // 1. Engineering Diploma Courses
  makeDiploma({ name: "Diploma in Civil Engineering", category: "eng-diploma" }),
  makeDiploma({ name: "Diploma in Mechanical Engineering", category: "eng-diploma" }),
  makeDiploma({ name: "Diploma in Electrical Engineering", category: "eng-diploma" }),
  makeDiploma({ name: "Diploma in Electronics & Communication Engineering", category: "eng-diploma" }),
  makeDiploma({ name: "Diploma in Computer Engineering", category: "eng-diploma", relatedCategories: ["it-diploma"] }),
  makeDiploma({ name: "Diploma in Information Technology", category: "eng-diploma", relatedCategories: ["it-diploma"] }),
  makeDiploma({ name: "Diploma in Automobile Engineering", category: "eng-diploma" }),
  makeDiploma({ name: "Diploma in Mechatronics Engineering", category: "eng-diploma", relatedCategories: ["trade-skill-diploma"] }),
  makeDiploma({ name: "Diploma in Aeronautical Engineering", category: "eng-diploma", relatedCategories: ["transport-marine-diploma"] }),
  makeDiploma({ name: "Diploma in Robotics Engineering", category: "eng-diploma", pathType: "technical-diploma", trendingLevel: "high" }),
  makeDiploma({ name: "Diploma in Fire & Safety Engineering", category: "eng-diploma", pathType: "service-diploma", futureJobs: ["Safety Officer", "Fire Safety Technician"] }),

  // 2. Computer & IT Diploma Courses
  makeDiploma({
    name: "Diploma in Computer Applications (DCA)",
    category: "it-diploma",
    pathType: "diploma",
    duration: "6-12 months",
    entryLevel: "after-10th-or-12th",
    keySubjects: ["Office Tools", "Basics of IT", "Databases"],
    futureJobs: ["Data Entry Operator", "MIS Assistant"],
  }),
  makeDiploma({ name: "Diploma in Programming", category: "it-diploma", keySubjects: ["C/Java/Python", "DSA Basics"] }),
  makeDiploma({ name: "Diploma in Web Development", category: "it-diploma", keySubjects: ["HTML/CSS/JS", "Front-end Frameworks"] }),
  makeDiploma({ name: "Diploma in Software Engineering", category: "it-diploma", duration: "2-3 years", pathType: "polytechnic" }),
  makeDiploma({ name: "Diploma in Cyber Security", category: "it-diploma", keySubjects: ["Networks", "Security", "Ethical Hacking"], trendingLevel: "high" }),
  makeDiploma({ name: "Diploma in Data Science", category: "it-diploma", keySubjects: ["Python", "Statistics", "ML Basics"] }),
  makeDiploma({ name: "Diploma in Artificial Intelligence", category: "it-diploma", keySubjects: ["AI Basics", "ML", "Projects"], trendingLevel: "high" }),
  makeDiploma({ name: "Diploma in Cloud Computing", category: "it-diploma", keySubjects: ["Cloud Platforms", "DevOps Basics"], futureJobs: ["Cloud Support", "Junior DevOps"] }),

  // 3. Medical & Paramedical Diploma Courses
  makeDiploma({ name: "Diploma in Medical Lab Technology (DMLT)", category: "medical-diploma", futureJobs: ["Lab Technician", "Sample Processing"] }),
  makeDiploma({ name: "Diploma in Radiology", category: "medical-diploma", futureJobs: ["X-Ray Technician", "Imaging Assistant"] }),
  makeDiploma({ name: "Diploma in Nursing", category: "medical-diploma", pathType: "healthcare-diploma", duration: "3 years", futureJobs: ["Nurse", "Ward In-charge"] }),
  makeDiploma({ name: "Diploma in Pharmacy (D.Pharm)", category: "medical-diploma", duration: "2 years", futureJobs: ["Pharmacy Assistant", "Retail Pharmacist"] }),
  makeDiploma({ name: "Diploma in Dialysis Technology", category: "medical-diploma", futureJobs: ["Dialysis Technician"] }),
  makeDiploma({ name: "Diploma in ECG Technology", category: "medical-diploma", futureJobs: ["ECG Technician"] }),
  makeDiploma({ name: "Diploma in Operation Theatre Technology", category: "medical-diploma", futureJobs: ["OT Technician"] }),
  makeDiploma({ name: "Diploma in Physiotherapy Assistant", category: "medical-diploma", futureJobs: ["Physiotherapy Aide"] }),

  // 4. Agriculture Diploma Courses
  makeDiploma({ name: "Diploma in Agriculture", category: "agri-diploma" }),
  makeDiploma({ name: "Diploma in Horticulture", category: "agri-diploma" }),
  makeDiploma({ name: "Diploma in Dairy Technology", category: "agri-diploma" }),
  makeDiploma({ name: "Diploma in Fisheries", category: "agri-diploma" }),
  makeDiploma({ name: "Diploma in Poultry Farming", category: "agri-diploma", pathType: "vocational-diploma", entryLevel: "after-10th" }),

  // 5. Design & Creative Diploma Courses
  makeDiploma({ name: "Diploma in Graphic Design", category: "creative-diploma", pathType: "creative-diploma", keySubjects: ["Design Basics", "Illustration", "Typography"] }),
  makeDiploma({ name: "Diploma in Animation", category: "creative-diploma", pathType: "creative-diploma", keySubjects: ["2D/3D", "Storyboarding"], trendingLevel: "high" }),
  makeDiploma({ name: "Diploma in Fashion Design", category: "creative-diploma", keySubjects: ["Pattern Making", "Textiles", "Styling"] }),
  makeDiploma({ name: "Diploma in Interior Design", category: "creative-diploma", keySubjects: ["Space Planning", "Materials", "Lighting"] }),
  makeDiploma({ name: "Diploma in Multimedia", category: "creative-diploma", keySubjects: ["Video", "Audio", "Motion Graphics"] }),
  makeDiploma({ name: "Diploma in Photography", category: "creative-diploma", keySubjects: ["Cameras", "Lighting", "Editing"] }),
  makeDiploma({ name: "Diploma in UI/UX Design", category: "creative-diploma", keySubjects: ["Design Thinking", "Wireframing", "Prototyping"], trendingLevel: "high" }),

  // 6. Commerce & Management Diploma Courses
  makeDiploma({ name: "Diploma in Accounting (Tally + GST)", category: "commerce-diploma", pathType: "diploma", keySubjects: ["Accounts", "Tally", "GST"], futureJobs: ["Accounts Assistant"] }),
  makeDiploma({ name: "Diploma in Business Management", category: "commerce-diploma", pathType: "diploma", futureJobs: ["Admin Executive", "Operations Assistant"] }),
  makeDiploma({ name: "Diploma in Banking & Finance", category: "commerce-diploma", pathType: "diploma", futureJobs: ["Banking Assistant"] }),
  makeDiploma({ name: "Diploma in Marketing", category: "commerce-diploma", pathType: "diploma", futureJobs: ["Marketing Assistant", "Sales Coordinator"] }),
  makeDiploma({ name: "Diploma in Human Resource (HR)", category: "commerce-diploma", pathType: "diploma", futureJobs: ["HR Assistant"] }),
  makeDiploma({ name: "Diploma in Office Management", category: "commerce-diploma", pathType: "diploma", futureJobs: ["Office Admin", "Front Office"] }),

  // 7. Hotel Management & Hospitality Diplomas
  makeDiploma({ name: "Diploma in Hotel Management", category: "hospitality-diploma", futureJobs: ["Hotel Supervisor", "Front Office"] }),
  makeDiploma({ name: "Diploma in Catering Technology", category: "hospitality-diploma", futureJobs: ["Catering Supervisor", "Kitchen Assistant"] }),
  makeDiploma({ name: "Diploma in Food Production", category: "hospitality-diploma", futureJobs: ["Commis Chef", "Kitchen Exec"] }),
  makeDiploma({ name: "Diploma in Bakery & Confectionery", category: "hospitality-diploma", futureJobs: ["Baker", "Pastry Assistant"] }),
  makeDiploma({ name: "Diploma in Aviation & Hospitality", category: "hospitality-diploma", futureJobs: ["Cabin Crew Support", "Ground Staff"] }),
  makeDiploma({ name: "Diploma in Housekeeping Operations", category: "hospitality-diploma", futureJobs: ["Housekeeping Supervisor", "Room Attendant"] }),

  // 8. Skilled Trade & Technical Diplomas
  makeDiploma({ name: "Diploma in Electrician", category: "trade-skill-diploma", pathType: "trade-skill", entryLevel: "after-10th", futureJobs: ["Electrician", "Maintenance Technician"] }),
  makeDiploma({ name: "Diploma in Plumbing", category: "trade-skill-diploma", pathType: "trade-skill", entryLevel: "after-10th", futureJobs: ["Plumber", "Pipe Fitter"] }),
  makeDiploma({ name: "Diploma in Welding", category: "trade-skill-diploma", pathType: "trade-skill", entryLevel: "after-10th", futureJobs: ["Welder", "Fabricator"] }),
  makeDiploma({ name: "Diploma in Carpentry", category: "trade-skill-diploma", pathType: "trade-skill", entryLevel: "after-10th", futureJobs: ["Carpenter", "Interior Installer"] }),
  makeDiploma({ name: "Diploma in Refrigeration & Air Conditioning", category: "trade-skill-diploma", pathType: "technical-diploma", futureJobs: ["HVAC Technician"] }),
  makeDiploma({ name: "Diploma in Solar Technology", category: "trade-skill-diploma", pathType: "technical-diploma", futureJobs: ["Solar Technician"], trendingLevel: "high" }),
  // extras for 70+ coverage within trade skills
  makeDiploma({ name: "Diploma in Mobile Repairing", category: "trade-skill-diploma", pathType: "trade-skill", duration: "6-12 months", futureJobs: ["Mobile Technician"] }),
  makeDiploma({ name: "Diploma in CCTV Installation", category: "trade-skill-diploma", pathType: "trade-skill", duration: "6-12 months", futureJobs: ["CCTV Technician"] }),
  makeDiploma({ name: "Diploma in Elevator Technology", category: "trade-skill-diploma", pathType: "technical-diploma", duration: "1-2 years", futureJobs: ["Lift Technician"] }),
  makeDiploma({ name: "Diploma in Masonry", category: "trade-skill-diploma", pathType: "trade-skill", entryLevel: "after-10th", futureJobs: ["Mason", "Site Worker"] }),

  // 9. Transportation & Marine Diplomas
  makeDiploma({ name: "Diploma in Marine Engineering", category: "transport-marine-diploma", pathType: "technical-diploma", futureJobs: ["Marine Technician", "Engine Room Assistant"] }),
  makeDiploma({ name: "Diploma in Logistics & Supply Chain", category: "transport-marine-diploma", pathType: "technical-diploma", futureJobs: ["Logistics Coordinator"] }),
  makeDiploma({ name: "Diploma in Automobile Maintenance", category: "transport-marine-diploma", pathType: "technical-diploma", futureJobs: ["Service Technician"] }),
  makeDiploma({ name: "Diploma in Railway Engineering", category: "transport-marine-diploma", pathType: "technical-diploma", futureJobs: ["Rail Technician", "Track Maintenance"] }),
  // extra transport coverage
  makeDiploma({ name: "Diploma in Drone Technology", category: "transport-marine-diploma", pathType: "technical-diploma", duration: "1 year", futureJobs: ["Drone Operator", "UAV Technician"], trendingLevel: "high" }),

  // 10. Law & Social Diploma Courses
  makeDiploma({ name: "Diploma in Cyber Law", category: "law-social-diploma", relatedCategories: ["it-diploma"], futureJobs: ["Compliance Assistant", "Paralegal (Cyber)"] }),
  makeDiploma({ name: "Diploma in Legal Studies", category: "law-social-diploma", futureJobs: ["Legal Assistant", "Paralegal"] }),
  makeDiploma({ name: "Diploma in Social Work", category: "law-social-diploma", futureJobs: ["Field Coordinator", "Program Assistant"] }),
  makeDiploma({ name: "Diploma in Human Rights", category: "law-social-diploma", futureJobs: ["Rights Advocate (Support)", "NGO Associate"] }),
  // extra social/legal for 70+ count
  makeDiploma({ name: "Diploma in Labour Law Basics", category: "law-social-diploma", duration: "6-12 months", futureJobs: ["Compliance Assistant"] }),
];
