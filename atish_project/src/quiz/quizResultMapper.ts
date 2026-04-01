import { departments } from "../data/departments";
import { streams } from "../data/streams";
import type { QuizComputedResult, StreamKey } from "../types/quiz";

const streamIdMap: Record<StreamKey, string> = {
  engineering: "engineering",
  medical: "medical",
  artsScience: "arts-science",
  commerce: "commerce",
  management: "management",
  design: "design-media",
  law: "law",
  agriculture: "agriculture",
  diploma: "diploma",
  vocational: "vocational",
  government: "government",
  paramedical: "paramedical",
};

const streamNarratives: Record<
  StreamKey,
  {
    why: string;
    strengths: string[];
    roadmap: string[];
    skills: string[];
    futureJobs: string[];
  }
> = {
  engineering: {
    why: "You show strong tech, math, and problem-solving signals.",
    strengths: ["Analytical thinking", "Building solutions", "Logical reasoning"],
    roadmap: ["Choose a specialization (CSE, ECE, Mechanical)", "Build projects and internships", "Learn one systems and one cloud skill", "Participate in hackathons"],
    skills: ["Programming", "Data structures", "Systems thinking", "Math foundations"],
    futureJobs: ["Software Engineer", "Product Engineer", "Data Engineer", "Robotics Engineer"],
  },
  medical: {
    why: "You lean toward biology, patience, and long-term study commitment.",
    strengths: ["Empathy", "Detail orientation", "Scientific approach"],
    roadmap: ["Prepare for NEET/entrance", "Focus on biology and chemistry", "Shadow healthcare professionals", "Explore specializations early"],
    skills: ["Biology", "Chemistry", "Clinical ethics", "Communication"],
    futureJobs: ["Doctor", "Surgeon", "Medical Researcher", "Public Health Specialist"],
  },
  artsScience: {
    why: "You value research, creativity, and balanced academic depth.",
    strengths: ["Writing", "Critical thinking", "Interdisciplinary curiosity"],
    roadmap: ["Pick a core major (Physics, Economics, Psychology)", "Join labs or clubs", "Publish/participate in fests", "Consider minors for breadth"],
    skills: ["Research methods", "Data literacy", "Writing", "Presentation"],
    futureJobs: ["Research Associate", "Content Strategist", "Data Analyst", "Policy Analyst"],
  },
  commerce: {
    why: "You show interest in business, finance, and structured growth.",
    strengths: ["Numeracy", "Business sense", "Analytical thinking"],
    roadmap: ["Learn accounting + spreadsheets", "Take finance/marketing electives", "Do internships in startups/SMEs", "Prep for CA/CPA/CFA if relevant"],
    skills: ["Financial literacy", "Excel/Sheets", "Market analysis", "Business communication"],
    futureJobs: ["Financial Analyst", "Accountant", "Business Analyst", "Investment Associate"],
  },
  management: {
    why: "You enjoy leadership, communication, and organizing teams.",
    strengths: ["Leadership", "Planning", "Stakeholder management"],
    roadmap: ["Lead college clubs", "Intern in operations/marketing/product", "Learn analytics tools", "Build a portfolio of initiatives"],
    skills: ["Presentation", "Data storytelling", "People management", "Strategic thinking"],
    futureJobs: ["Product Manager", "Operations Lead", "Marketing Manager", "Business Consultant"],
  },
  design: {
    why: "You prefer creativity, visuals, and crafting experiences.",
    strengths: ["Visual sense", "Empathy for users", "Storytelling"],
    roadmap: ["Learn UI/UX fundamentals", "Practice with Figma/Adobe", "Ship small redesigns", "Build a portfolio site"],
    skills: ["UI/UX", "Motion/visual design", "User research", "Prototyping"],
    futureJobs: ["UI/UX Designer", "Motion Designer", "Game Artist", "Product Designer"],
  },
  law: {
    why: "You lean toward argumentation, social awareness, and structure.",
    strengths: ["Reasoning", "Reading depth", "Advocacy"],
    roadmap: ["Prepare for law entrances (CLAT, etc.)", "Join debate/MUN", "Intern with legal clinics", "Learn legal research tools"],
    skills: ["Public speaking", "Research", "Writing briefs", "Logic"],
    futureJobs: ["Lawyer", "Legal Analyst", "Compliance Officer", "Policy Associate"],
  },
  agriculture: {
    why: "You show interest in nature, sustainability, and field work.",
    strengths: ["Observation", "Systems thinking", "Hands-on mindset"],
    roadmap: ["Study agronomy basics", "Learn precision agri tools", "Participate in field projects", "Network with agri-tech startups"],
    skills: ["Soil science", "Crop management", "Drones/IoT basics", "Data logging"],
    futureJobs: ["Agri Scientist", "Farm Manager", "Agri-Tech Specialist", "Food Technologist"],
  },
  diploma: {
    why: "You prefer faster, hands-on entry into technical roles.",
    strengths: ["Practical learning", "Tool usage", "Execution focus"],
    roadmap: ["Pick a diploma branch (Electrical/Mechanical/CS)", "Earn one industry certification", "Apprenticeship or on-site internship", "Build a project portfolio"],
    skills: ["Technical drawing", "Tools and safety", "Basic electronics/mechanics", "Troubleshooting"],
    futureJobs: ["Technician", "Junior Engineer", "Lab Technologist", "Maintenance Specialist"],
  },
  vocational: {
    why: "You want skill-based, job-ready training with quick outcomes.",
    strengths: ["Hands-on", "Speed", "Service orientation"],
    roadmap: ["Choose a skill track (IT support, hospitality, design tools)", "Complete short certifications", "Do an apprenticeship", "Collect references and reviews"],
    skills: ["Customer service", "Tool proficiency", "Time management", "Adaptability"],
    futureJobs: ["IT Support", "Technician", "Service Associate", "Craftsperson"],
  },
  government: {
    why: "You prioritise stability, public service, and structured progression.",
    strengths: ["Discipline", "General awareness", "Persistence"],
    roadmap: ["Pick target exams (UPSC/State/Banking/Defence)", "Structured syllabus plan", "Mock tests regularly", "Stay fit and updated"],
    skills: ["GK/Current affairs", "Quant/Reasoning", "Writing", "Interview skills"],
    futureJobs: ["Civil Services", "PSU Roles", "Defense Services", "Judicial Services"],
  },
  paramedical: {
    why: "You like healthcare support roles and practical patient care.",
    strengths: ["Attention to detail", "Calm under pressure", "Technical handling"],
    roadmap: ["Pick a focus (Nursing, Radiology, OT, Lab)", "Train on equipment", "Hospital internships", "Certification as required"],
    skills: ["Patient care", "Lab/OT protocols", "Equipment handling", "Documentation"],
    futureJobs: ["Nurse", "Radiology Tech", "Lab Technologist", "OT Technician"],
  },
};

const deriveCourses = (stream: StreamKey) => {
  const streamId = streamIdMap[stream];
  const list = departments.filter((d) => d.streamId === streamId).slice(0, 5);
  return list.map((d) => d.name);
};

export const mapResultsToNarrative = (result: QuizComputedResult) => {
  return result.top.map((item) => {
    const narrative = streamNarratives[item.stream];
    const streamMeta = streams.find((s) => s.id === streamIdMap[item.stream]);
    const evidence = result.breakdown?.[item.stream]?.contributions ?? [];
    const topSignals = [...evidence].sort((a, b) => b.delta - a.delta).slice(0, 3).map((c) => `${c.option ?? "Your answer"} (+${c.delta})`);
    return {
      stream: item.stream,
      title: streamMeta?.title ?? item.stream,
      score: item.score,
      confidence: item.confidence,
      why: narrative?.why ?? "",
      strengths: narrative?.strengths ?? [],
      roadmap: narrative?.roadmap ?? [],
      skills: narrative?.skills ?? [],
      futureJobs: narrative?.futureJobs ?? [],
      courses: deriveCourses(item.stream),
      streamPath: `/stream/${streamIdMap[item.stream]}`,
      signals: topSignals,
    };
  });
};
