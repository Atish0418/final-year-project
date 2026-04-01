import type { Department } from "../types/content";
import { engineeringDepartments } from "./engineeringDepartments";
import { artsScienceDepartments } from "./artsScienceDepartments";
import { commerceDepartments } from "./commerceDepartments";
import { medicalDepartments } from "./medicalDepartments";
import { paramedicalDepartments } from "./paramedicalDepartments";
import { agricultureDepartments } from "./agricultureDepartments";
import { lawDepartments } from "./lawDepartments";
import { designMediaDepartments } from "./designMediaDepartments";
import { managementDepartments } from "./managementDepartments";
import { diplomaDepartments } from "./diplomaDepartments";
import { vocationalDepartments } from "./vocationalDepartments";
import { governmentDepartments } from "./governmentDepartments";

const nonEngineering: Department[] = [
  // Arts & Science
  {
    id: "arts-psychology",
    slug: "arts-psychology",
    name: "Psychology",
    streamId: "arts-science",
    overview: "Human behavior, cognition, and counseling with research exposure.",
    duration: "3 years (B.A/B.Sc)",
    eligibility: "12th any stream; basics in English/Science helpful",
    keySubjects: ["Cognitive Psych", "Counseling", "Statistics", "Research Methods"],
    skillsNeeded: ["Empathy", "Listening", "Analytics"],
    advantages: ["Growing mental health focus", "Diverse higher study options"],
    disadvantages: ["Requires post-grad for practice", "Emotional load"],
    futureJobs: ["Counselor", "UX Researcher", "HR Specialist"],
    higherStudies: ["M.A Psychology", "Clinical/Counseling specializations"],
    bestFor: "Students who like people science and research.",
    avoidIf: "You prefer purely technical roles.",
    futureScope: "High demand in wellbeing, UX, and org behavior.",
  },
  {
    id: "arts-bsc-physics",
    slug: "arts-bsc-physics",
    name: "B.Sc Physics",
    streamId: "arts-science",
    overview: "Foundational physics with math and lab work, gateway to research and tech.",
    duration: "3 years (B.Sc)",
    eligibility: "12th with PCM",
    keySubjects: ["Mechanics", "Electromagnetism", "Quantum", "Math Methods"],
    skillsNeeded: ["Math", "Observation", "Problem-solving"],
    advantages: ["Strong analytical base", "Research pathways"],
    disadvantages: ["Theory-heavy", "Needs higher studies for specialization"],
    futureJobs: ["Research Assistant", "Data Analyst", "Lab Tech"],
    higherStudies: ["M.Sc Physics", "Astro/Materials", "Data Science"],
    bestFor: "Students who enjoy theory and experimentation.",
    avoidIf: "You dislike abstract math.",
    futureScope: "Data, materials, and space tech opportunities.",
  },

  // Commerce
  {
    id: "commerce-bcom",
    slug: "commerce-bcom",
    name: "B.Com (General)",
    streamId: "commerce",
    overview: "Commerce fundamentals covering accounting, economics, and business law.",
    duration: "3 years",
    eligibility: "12th (Commerce preferred)",
    keySubjects: ["Accounting", "Economics", "Business Law", "Taxation"],
    skillsNeeded: ["Numeracy", "Analysis", "Diligence"],
    advantages: ["Wide acceptance", "Pairs with CA/CS/CMA"],
    disadvantages: ["Needs specialization for edge", "Competitive exams"],
    futureJobs: ["Accountant", "Analyst", "Banking Associate"],
    higherStudies: ["M.Com", "CA/CS/CMA", "MBA"],
    bestFor: "Students wanting finance/business breadth.",
    avoidIf: "You dislike numbers or compliance.",
    futureScope: "Fintech, analytics, and compliance demand rising.",
  },

  // Medical
  {
    id: "medical-mbbs",
    slug: "medical-mbbs",
    name: "MBBS",
    streamId: "medical",
    overview: "Core medical degree leading to clinical practice.",
    duration: "5.5 years (including internship)",
    eligibility: "12th with PCB; NEET",
    keySubjects: ["Anatomy", "Physiology", "Pathology", "Medicine", "Surgery"],
    skillsNeeded: ["Empathy", "Endurance", "Attention to detail"],
    advantages: ["Respected profession", "Clear progression"],
    disadvantages: ["Long duration", "High workload"],
    futureJobs: ["Doctor", "Resident", "Medical Officer"],
    higherStudies: ["MD/MS specializations"],
    bestFor: "Students committed to healthcare service.",
    avoidIf: "You dislike long study hours or clinical settings.",
    futureScope: "Healthcare demand steady; telemedicine expanding.",
  },

  // Paramedical
  {
    id: "paramedical-physio",
    slug: "paramedical-physio",
    name: "Physiotherapy (BPT)",
    streamId: "paramedical",
    overview: "Rehabilitation science focusing on movement and recovery.",
    duration: "4.5 years",
    eligibility: "12th with PCB",
    keySubjects: ["Anatomy", "Physiology", "Exercise Therapy", "Neuro Rehab"],
    skillsNeeded: ["Empathy", "Physical stamina", "Communication"],
    advantages: ["Growing sports/rehab demand", "Clinic or hospital roles"],
    disadvantages: ["Physical work", "Initial pay can be modest"],
    futureJobs: ["Physiotherapist", "Sports Rehab Specialist"],
    higherStudies: ["MPT specializations"],
    bestFor: "Students who like patient interaction and mobility science.",
    avoidIf: "You dislike hands-on patient care.",
    futureScope: "Aging population and sports drive demand.",
  },

  // Agriculture
  {
    id: "agri-bsc",
    slug: "agri-bsc",
    name: "B.Sc Agriculture",
    streamId: "agriculture",
    overview: "Modern farming, agri-tech, and food systems.",
    duration: "4 years",
    eligibility: "12th with PCB/PCM/PCMB",
    keySubjects: ["Crop Science", "Soil", "Agri Economics", "Irrigation"],
    skillsNeeded: ["Field interest", "Data use", "Problem-solving"],
    advantages: ["Govt schemes", "Agri-tech startups growth"],
    disadvantages: ["Rural postings common", "Seasonal work"],
    futureJobs: ["Agri Officer", "Food Technologist", "Agri Analyst"],
    higherStudies: ["M.Sc Agri", "Food Tech masters"],
    bestFor: "Students who like sustainability and field work.",
    avoidIf: "You dislike outdoor/rural settings.",
    futureScope: "Precision farming, drones, agri-fintech expanding.",
  },

  // Law
  {
    id: "law-ballb",
    slug: "law-ballb",
    name: "BA LL.B (Integrated)",
    streamId: "law",
    overview: "Five-year integrated law program with humanities base.",
    duration: "5 years",
    eligibility: "12th any stream; CLAT/State law entrance",
    keySubjects: ["Constitution", "Contracts", "Criminal Law", "Mooting"],
    skillsNeeded: ["Reading", "Writing", "Argumentation"],
    advantages: ["Litigation or corporate routes", "Scholarships available"],
    disadvantages: ["Heavy reading", "Internship intensive"],
    futureJobs: ["Litigator", "Corporate Lawyer", "Policy Analyst"],
    higherStudies: ["LL.M", "Specialized diplomas"],
    bestFor: "Students who enjoy debate and policy.",
    avoidIf: "You dislike dense reading or public speaking.",
    futureScope: "Tech policy, IP, and compliance growing.",
  },

  // Design & Media
  {
    id: "design-ux",
    slug: "design-ux",
    name: "UX / Interaction Design",
    streamId: "design-media",
    overview: "Human-centered product design for digital experiences.",
    duration: "3-4 years",
    eligibility: "12th any stream; design aptitude tests",
    keySubjects: ["Design Thinking", "Prototyping", "Visual Design", "Research"],
    skillsNeeded: ["Creativity", "Empathy", "Tooling"],
    advantages: ["High product demand", "Portfolio-driven"],
    disadvantages: ["Subjective feedback", "Tool churn"],
    futureJobs: ["Product Designer", "UX Researcher", "Interaction Designer"],
    higherStudies: ["M.Des", "HCI masters"],
    bestFor: "Students who enjoy creativity + problem solving.",
    avoidIf: "You dislike iterative critique.",
    futureScope: "Spatial/UI for XR and AI-powered tooling rising.",
  },

  // Management
  {
    id: "management-bba",
    slug: "management-bba",
    name: "BBA",
    streamId: "management",
    overview: "Foundational business program with leadership exposure.",
    duration: "3 years",
    eligibility: "12th any stream; aptitude tests/interviews",
    keySubjects: ["Management", "Marketing", "Finance", "Analytics"],
    skillsNeeded: ["Communication", "Teamwork", "Numeracy"],
    advantages: ["Early business exposure", "Pairs with MBA"],
    disadvantages: ["Needs strong internships", "Generalist without depth"],
    futureJobs: ["Business Analyst", "Marketing Associate", "Ops Coordinator"],
    higherStudies: ["MBA", "Specialized PG diplomas"],
    bestFor: "Students who like leading teams and business thinking.",
    avoidIf: "You prefer deep technical roles.",
    futureScope: "Digital business, product ops, and analytics expand options.",
  },

  // Diploma / Polytechnic
  {
    id: "diploma-mech",
    slug: "diploma-mech",
    name: "Diploma in Mechanical Engineering",
    streamId: "diploma",
    overview: "Hands-on mechanical skills with workshops and labs.",
    duration: "3 years",
    eligibility: "10th pass; some states allow 12th entry",
    keySubjects: ["Workshop", "Mechanics", "CAD Basics"],
    skillsNeeded: ["Hands-on", "Math basics", "Drawing"],
    advantages: ["Quick job entry", "Lateral entry to B.E/B.Tech"],
    disadvantages: ["Requires upskilling for growth"],
    futureJobs: ["Technician", "Junior Engineer", "CNC Operator"],
    higherStudies: ["Lateral entry B.Tech"],
    bestFor: "Students wanting faster employment and practical work.",
    avoidIf: "You want research-heavy paths.",
    futureScope: "Manufacturing automation keeps demand steady.",
  },

  // Vocational
  {
    id: "vocational-ui",
    slug: "vocational-ui",
    name: "Certificate in UI Development",
    streamId: "vocational",
    overview: "Short skilling program in front-end engineering.",
    duration: "6-9 months",
    eligibility: "12th any stream; basic computer skills",
    keySubjects: ["HTML/CSS/JS", "React basics", "Version control"],
    skillsNeeded: ["Design sense", "Problem-solving", "Consistency"],
    advantages: ["Quick transition to jobs", "Portfolio focus"],
    disadvantages: ["Needs self-driven practice", "Competitive entry-level"],
    futureJobs: ["Front-end Dev", "Web Designer"],
    higherStudies: ["Advanced React/Full-stack bootcamps"],
    bestFor: "Students wanting faster digital careers.",
    avoidIf: "You dislike coding/design.",
    futureScope: "Frontend talent demand steady; AI tooling assists.",
  },

  // Government
  {
    id: "government-civil-services",
    slug: "government-civil-services",
    name: "Civil Services Prep",
    streamId: "government",
    overview: "Structured prep for UPSC/State PSC with GS and aptitude.",
    duration: "1-2 years (coaching/degree-integrated)",
    eligibility: "Any bachelor's in progress/complete",
    keySubjects: ["GS", "Current Affairs", "CSAT", "Essay"],
    skillsNeeded: ["Reading", "Discipline", "Writing"],
    advantages: ["Prestige, public impact"],
    disadvantages: ["High competition", "Long prep cycle"],
    futureJobs: ["IAS/IPS/IFS roles", "State civil services"],
    higherStudies: ["Public Policy", "Governance diplomas"],
    bestFor: "Students committed to public service.",
    avoidIf: "You dislike long-term exam prep.",
    futureScope: "Consistent need for governance roles.",
  },
];

const dedupeDepartments = (lists: Department[][]) => {
  const byId = new Map<string, Department>();

  lists.flat().forEach((dept) => {
    const keys = [dept.id, dept.slug].filter(Boolean) as string[];
    if (keys.some((k) => byId.has(k))) return;
    byId.set(dept.id, dept);
  });

  return Array.from(byId.values());
};

export const departments: Department[] = dedupeDepartments([
  engineeringDepartments,
  artsScienceDepartments,
  commerceDepartments,
  medicalDepartments,
  paramedicalDepartments,
  agricultureDepartments,
  lawDepartments,
  designMediaDepartments,
  managementDepartments,
  diplomaDepartments,
  vocationalDepartments,
  governmentDepartments,
  nonEngineering,
]);
