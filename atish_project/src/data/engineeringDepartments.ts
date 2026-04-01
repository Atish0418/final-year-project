import type { Department } from "../types/content";

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "");

const catDefaults: Record<
  string,
  {
    keySubjects: string[];
    futureJobs: string[];
    industries: string[];
    futureScope: string;
  }
> = {
  "core-engineering": {
    keySubjects: ["Maths", "Physics", "Mechanics", "Materials"],
    futureJobs: ["Design Engineer", "Project Engineer", "Plant Engineer"],
    industries: ["Infrastructure", "Manufacturing", "Energy"],
    futureScope: "Steady demand for engineers to build and maintain physical assets.",
  },
  "computer-it": {
    keySubjects: ["Programming", "DSA", "Networks", "Databases"],
    futureJobs: ["Software Engineer", "Data Engineer", "AI Engineer"],
    industries: ["IT", "Product", "Fintech", "Startups"],
    futureScope: "High growth with continuous upskilling in software and data.",
  },
  "mechanical-automation": {
    keySubjects: ["Mechanics", "Thermo", "CAD/CAM", "Robotics"],
    futureJobs: ["Mechanical Engineer", "Automation Engineer", "Robotics Engineer"],
    industries: ["Automotive", "Robotics", "Manufacturing"],
    futureScope: "Automation and EVs keep mechanical specializations relevant.",
  },
  "civil-infrastructure": {
    keySubjects: ["Structures", "Surveying", "Geo-tech", "Transportation"],
    futureJobs: ["Site Engineer", "Structural Designer", "Project Planner"],
    industries: ["Construction", "Transport", "Urban Development"],
    futureScope: "Urbanization and smart cities sustain long-term demand.",
  },
  "electrical-electronics": {
    keySubjects: ["Circuits", "Signals", "Power Systems", "Control"],
    futureJobs: ["Power Engineer", "Embedded Engineer", "Control Engineer"],
    industries: ["Energy", "Electronics", "Automation"],
    futureScope: "Renewables, EVs, and devices keep the field growing.",
  },
  "chemical-science": {
    keySubjects: ["Chemistry", "Thermo", "Process Design", "Materials"],
    futureJobs: ["Process Engineer", "Quality Engineer", "R&D Engineer"],
    industries: ["Oil & Gas", "Pharma", "Materials", "FMCG"],
    futureScope: "Process optimization and sustainability drive steady need.",
  },
  "bio-medical": {
    keySubjects: ["Biology", "Sensors", "Medical Devices", "Regulations"],
    futureJobs: ["Biomedical Engineer", "Clinical Engineer", "Product Specialist"],
    industries: ["MedTech", "Hospitals", "Diagnostics"],
    futureScope: "Healthcare innovation and devices are expanding quickly.",
  },
  "aero-marine": {
    keySubjects: ["Aerodynamics", "Structures", "Propulsion", "Fluids"],
    futureJobs: ["Aerospace Engineer", "Flight Testing", "Marine Engineer"],
    industries: ["Aviation", "Space", "Shipping", "Defence"],
    futureScope: "Space, drones, and greener transport create new roles.",
  },
  "architecture-design": {
    keySubjects: ["Design Studio", "Building Codes", "Sustainability"],
    futureJobs: ["Architect", "Interior Engineer", "Urban Planner"],
    industries: ["Architecture", "Real Estate", "Urban Planning"],
    futureScope: "Demand for sustainable and livable spaces keeps rising.",
  },
  "transport-logistics": {
    keySubjects: ["Transport Planning", "Logistics", "Operations"],
    futureJobs: ["Railway Engineer", "Logistics Engineer", "Transport Planner"],
    industries: ["Railways", "Supply Chain", "Urban Transport"],
    futureScope: "Mobility, metro, and freight growth support careers.",
  },
  "emerging-future": {
    keySubjects: ["Data", "AI/ML", "IoT", "Cloud", "Security"],
    futureJobs: ["AI Engineer", "IoT Engineer", "Blockchain Engineer"],
    industries: ["Tech", "Energy", "Industry 4.0"],
    futureScope: "Fast-growing fields with strong future demand.",
  },
  specialized: {
    keySubjects: ["Materials", "Safety", "Domain Electives"],
    futureJobs: ["Domain Engineer", "Consultant", "Operations Engineer"],
    industries: ["Mining", "AgriTech", "Safety", "Print"],
    futureScope: "Niche roles with steady demand in specialized sectors.",
  },
};

const baseDefaults = {
  duration: "4 years (B.E./B.Tech)",
  eligibility: "12th with PCM; entrance exams like JEE/State CET",
  entranceExams: ["JEE Main/Advanced", "State CET"],
  skillsNeeded: ["Problem-solving", "Maths comfort", "Logical thinking", "Team projects"],
  advantages: ["Strong technical base", "Diverse career options", "Good higher study pathways", "Opportunities in India & abroad"],
  disadvantages: ["Entrance exam competition", "Heavy project workload", "Requires math consistency"],
  higherStudies: ["M.Tech", "MS", "MBA Tech", "Specialized Masters"],
  bestFor: "Students who enjoy solving real-world problems with math and technology.",
  avoidIf: "You dislike math, labs, or long-term technical learning.",
  salaryBand: "INR 4-12 LPA (entry) depending on college, role, and city",
  trendingLevel: "medium" as const,
  degreeType: "be-btech" as const,
};

const makeBranch = (
  data: Partial<Department> & {
    id?: string;
    name: string;
    category: string;
  },
): Department => {
  const id = data.id ?? slugify(data.name);
  const cat = catDefaults[data.category] ?? catDefaults["core-engineering"];
  return {
    id,
    slug: data.slug ?? id,
    streamId: "engineering",
    name: data.name,
    category: data.category,
    relatedCategories: data.relatedCategories ?? [],
    degreeType: data.degreeType ?? baseDefaults.degreeType,
    overview:
      data.overview ??
      `${data.name} focuses on modern engineering concepts with projects and internships to prepare for industry roles.`,
    duration: data.duration ?? baseDefaults.duration,
    eligibility: data.eligibility ?? baseDefaults.eligibility,
    entranceExams: data.entranceExams ?? baseDefaults.entranceExams,
    keySubjects: data.keySubjects ?? cat.keySubjects,
    skillsNeeded: data.skillsNeeded ?? baseDefaults.skillsNeeded,
    advantages: data.advantages ?? baseDefaults.advantages,
    disadvantages: data.disadvantages ?? baseDefaults.disadvantages,
    futureJobs: data.futureJobs ?? cat.futureJobs,
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
    pathType: data.pathType ?? "degree",
  };
};

export const engineeringDepartments: Department[] = [
  // 1. Core Engineering
  makeBranch({
    id: "civil-engineering",
    name: "Civil Engineering",
    category: "core-engineering",
    relatedCategories: ["civil-infrastructure"],
    overview: "Plan, design, and build roads, bridges, buildings, dams, and public infrastructure.",
    keySubjects: ["Structural Analysis", "Surveying", "Concrete Technology", "Transportation"],
    futureJobs: ["Site Engineer", "Structural Engineer", "Project Planning Engineer", "Quantity Surveyor"],
  }),
  makeBranch({
    id: "mechanical-engineering",
    name: "Mechanical Engineering",
    category: "core-engineering",
    relatedCategories: ["mechanical-automation"],
    overview: "Design machines, engines, and systems; learn how things move, heat, and operate.",
    keySubjects: ["Mechanics", "Thermodynamics", "Manufacturing", "Machine Design"],
    futureJobs: ["Design Engineer", "Maintenance Engineer", "Production Engineer", "R&D Engineer"],
  }),
  makeBranch({
    id: "electrical-engineering",
    name: "Electrical Engineering",
    category: "core-engineering",
    relatedCategories: ["electrical-electronics"],
    overview: "Work with power generation, grids, motors, and electrical systems that run industries and homes.",
    keySubjects: ["Power Systems", "Machines", "Control Systems", "Power Electronics"],
    futureJobs: ["Power Engineer", "Substation Engineer", "Energy Consultant"],
  }),
  makeBranch({
    id: "ece",
    name: "Electronics & Communication Engineering (ECE)",
    category: "core-engineering",
    relatedCategories: ["electrical-electronics"],
    keySubjects: ["Analog/Digital Electronics", "Signals", "VLSI Basics", "Communication Systems"],
    futureJobs: ["Embedded Engineer", "RF Engineer", "Telecom Engineer", "VLSI Engineer"],
  }),
  makeBranch({
    id: "eee",
    name: "Electronics & Electrical Engineering (EEE)",
    category: "core-engineering",
    relatedCategories: ["electrical-electronics"],
    keySubjects: ["Circuits", "Machines", "Power Electronics", "Control"],
    futureJobs: ["Electrical Design Engineer", "Drives Engineer", "Automation Engineer"],
  }),

  // 2. Computer & IT
  makeBranch({
    name: "Computer Science Engineering (CSE)",
    category: "computer-it",
    keySubjects: ["Programming", "DSA", "OS", "DBMS", "Networks"],
    futureJobs: ["Software Engineer", "Backend Developer", "SDE"],
  }),
  makeBranch({
    name: "Information Technology (IT)",
    category: "computer-it",
    relatedCategories: ["emerging-future"],
    keySubjects: ["Web Tech", "Networks", "DBMS", "Cloud Basics"],
    futureJobs: ["Full Stack Developer", "IT Consultant", "Cloud Associate"],
  }),
  makeBranch({
    name: "Software Engineering",
    category: "computer-it",
    keySubjects: ["Software Design", "Testing", "DevOps", "Architecture"],
    futureJobs: ["Software Engineer", "QA Engineer", "DevOps Engineer"],
  }),
  makeBranch({
    name: "Artificial Intelligence Engineering",
    category: "computer-it",
    relatedCategories: ["emerging-future"],
    keySubjects: ["AI Fundamentals", "ML", "Neural Networks", "MLOps"],
    futureJobs: ["AI Engineer", "ML Engineer", "Data Scientist"],
    trendingLevel: "high",
  }),
  makeBranch({
    name: "Machine Learning Engineering",
    category: "computer-it",
    relatedCategories: ["emerging-future"],
    keySubjects: ["Statistics", "ML Algorithms", "Model Deployment"],
    futureJobs: ["ML Engineer", "Data Scientist"],
  }),
  makeBranch({
    name: "Data Science Engineering",
    category: "computer-it",
    relatedCategories: ["emerging-future"],
    keySubjects: ["Data Wrangling", "Analytics", "ML", "Visualization"],
    futureJobs: ["Data Scientist", "Data Engineer", "Analytics Engineer"],
  }),
  makeBranch({
    name: "Cyber Security Engineering",
    category: "computer-it",
    keySubjects: ["Networks", "Security", "Cryptography", "Ethical Hacking"],
    futureJobs: ["Security Analyst", "SOC Engineer", "Pen Tester"],
  }),
  makeBranch({
    name: "Cloud Computing Engineering",
    category: "computer-it",
    relatedCategories: ["emerging-future"],
    keySubjects: ["Cloud Platforms", "DevOps", "Microservices"],
    futureJobs: ["Cloud Engineer", "SRE", "DevOps Engineer"],
  }),
  makeBranch({
    name: "Big Data Engineering",
    category: "computer-it",
    keySubjects: ["Distributed Systems", "Data Pipelines", "NoSQL"],
    futureJobs: ["Data Engineer", "Big Data Engineer"],
  }),
  makeBranch({
    name: "Computer Engineering",
    category: "computer-it",
    relatedCategories: ["electrical-electronics"],
    keySubjects: ["Computer Architecture", "Microprocessors", "OS", "Embedded"],
    futureJobs: ["Firmware Engineer", "Systems Engineer", "Embedded Developer"],
  }),

  // 3. Mechanical & Automation Fields
  makeBranch({
    name: "Mechatronics Engineering",
    category: "mechanical-automation",
    relatedCategories: ["electrical-electronics"],
    keySubjects: ["Robotics", "Control", "Sensors", "Embedded"],
    futureJobs: ["Automation Engineer", "Robotics Engineer", "Mechatronics Engineer"],
  }),
  makeBranch({
    name: "Robotics Engineering",
    category: "mechanical-automation",
    relatedCategories: ["emerging-future"],
    keySubjects: ["Kinematics", "AI for Robotics", "Control", "Embedded"],
    futureJobs: ["Robotics Engineer", "Automation Engineer", "R&D Engineer"],
    trendingLevel: "high",
  }),
  makeBranch({
    name: "Automobile Engineering",
    category: "mechanical-automation",
    keySubjects: ["Vehicle Dynamics", "IC Engines", "EV Systems"],
    futureJobs: ["Automotive Engineer", "EV Engineer", "Service Engineer"],
  }),
  makeBranch({
    name: "Production Engineering",
    category: "mechanical-automation",
    keySubjects: ["Manufacturing", "Operations", "Quality"],
    futureJobs: ["Production Engineer", "Quality Engineer", "Process Engineer"],
  }),
  makeBranch({
    name: "Industrial Engineering",
    category: "mechanical-automation",
    keySubjects: ["Operations Research", "Lean", "Systems Design"],
    futureJobs: ["Industrial Engineer", "Operations Analyst", "Process Engineer"],
  }),
  makeBranch({
    name: "Manufacturing Engineering",
    category: "mechanical-automation",
    keySubjects: ["Advanced Manufacturing", "CNC/CAM", "Materials"],
    futureJobs: ["Manufacturing Engineer", "Tooling Engineer"],
  }),

  // 4. Civil & Infrastructure
  makeBranch({
    name: "Structural Engineering",
    category: "civil-infrastructure",
    relatedCategories: ["core-engineering"],
    keySubjects: ["Steel/Concrete Design", "Earthquake Engg.", "Finite Elements"],
    futureJobs: ["Structural Designer", "Bridge Engineer"],
  }),
  makeBranch({
    name: "Construction Engineering",
    category: "civil-infrastructure",
    keySubjects: ["Construction Planning", "Contracts", "Safety"],
    futureJobs: ["Construction Manager", "Planning Engineer"],
  }),
  makeBranch({
    name: "Transportation Engineering",
    category: "civil-infrastructure",
    relatedCategories: ["transport-logistics"],
    keySubjects: ["Traffic Engineering", "Pavement Design", "Rail/Metro Systems"],
    futureJobs: ["Transport Planner", "Highway Engineer", "Rail Engineer"],
  }),
  makeBranch({
    name: "Environmental Engineering",
    category: "civil-infrastructure",
    relatedCategories: ["specialized"],
    keySubjects: ["Water/Waste Management", "Air Pollution", "Sustainability"],
    futureJobs: ["Environmental Engineer", "EHS Consultant"],
  }),
  makeBranch({
    name: "Geotechnical Engineering",
    category: "civil-infrastructure",
    keySubjects: ["Soil Mechanics", "Foundation Design", "Earth Retaining"],
    futureJobs: ["Geotech Engineer", "Foundation Specialist"],
  }),
  makeBranch({
    name: "Surveying Engineering",
    category: "civil-infrastructure",
    keySubjects: ["Geomatics", "Remote Sensing", "GIS"],
    futureJobs: ["Survey Engineer", "GIS Engineer"],
  }),

  // 5. Electrical & Electronics Fields
  makeBranch({
    name: "Electronics Engineering",
    category: "electrical-electronics",
    keySubjects: ["Analog/Digital Circuits", "Microcontrollers", "PCB Design"],
    futureJobs: ["Electronics Design Engineer", "Embedded Engineer"],
  }),
  makeBranch({
    name: "Instrumentation Engineering",
    category: "electrical-electronics",
    keySubjects: ["Sensors", "Process Control", "Industrial Automation"],
    futureJobs: ["Instrumentation Engineer", "Control Engineer"],
  }),
  makeBranch({
    name: "Power Engineering",
    category: "electrical-electronics",
    keySubjects: ["Power Systems", "High Voltage", "Renewables"],
    futureJobs: ["Power Engineer", "Grid Engineer", "Renewable Engineer"],
    relatedCategories: ["emerging-future"],
  }),
  makeBranch({
    name: "Control Engineering",
    category: "electrical-electronics",
    keySubjects: ["Control Theory", "Signals", "Automation"],
    futureJobs: ["Control Engineer", "Automation Engineer"],
  }),

  // 6. Chemical & Science-Based
  makeBranch({
    name: "Chemical Engineering",
    category: "chemical-science",
    keySubjects: ["Thermo", "Reaction Engineering", "Process Control"],
    futureJobs: ["Process Engineer", "Plant Engineer", "Process Safety Engineer"],
  }),
  makeBranch({
    name: "Petroleum Engineering",
    category: "chemical-science",
    keySubjects: ["Reservoir Engineering", "Drilling", "Production"],
    futureJobs: ["Reservoir Engineer", "Drilling Engineer"],
    industries: ["Oil & Gas", "Energy"],
  }),
  makeBranch({
    name: "Petrochemical Engineering",
    category: "chemical-science",
    keySubjects: ["Polymer Chemistry", "Refining", "Process Design"],
    futureJobs: ["Process Engineer", "Quality Engineer"],
  }),
  makeBranch({
    name: "Biotechnology Engineering",
    category: "chemical-science",
    relatedCategories: ["bio-medical"],
    keySubjects: ["Genetics", "Bioprocess", "Molecular Biology"],
    futureJobs: ["Bioprocess Engineer", "Research Associate"],
  }),
  makeBranch({
    name: "Biochemical Engineering",
    category: "chemical-science",
    keySubjects: ["Bioreactors", "Enzyme Tech", "Process Control"],
    futureJobs: ["Biochemical Engineer", "Process Scientist"],
  }),
  makeBranch({
    name: "Food Technology Engineering",
    category: "chemical-science",
    keySubjects: ["Food Chemistry", "Processing", "Quality"],
    futureJobs: ["Food Technologist", "QA Engineer"],
    industries: ["FMCG", "AgriTech", "Food Processing"],
  }),
  makeBranch({
    name: "Textile Engineering",
    category: "chemical-science",
    keySubjects: ["Textile Materials", "Fabric Manufacturing", "Dyeing"],
    futureJobs: ["Textile Engineer", "Production Manager"],
    industries: ["Textile", "Fashion Supply Chain"],
  }),

  // 7. Bio & Medical
  makeBranch({
    name: "Biomedical Engineering",
    category: "bio-medical",
    degreeType: "specialized-engineering",
    keySubjects: ["Medical Devices", "Signals", "Biomaterials"],
    futureJobs: ["Biomedical Engineer", "Clinical Engineer", "Product Specialist"],
  }),
  makeBranch({
    name: "Genetic Engineering",
    category: "bio-medical",
    keySubjects: ["Genomics", "Molecular Biology", "Bioinformatics"],
    futureJobs: ["Research Scientist", "Biotech Engineer"],
  }),
  makeBranch({
    name: "Pharmaceutical Engineering",
    category: "bio-medical",
    keySubjects: ["Drug Design", "Process Validation", "Regulatory"],
    futureJobs: ["Process Engineer", "Validation Engineer"],
  }),
  makeBranch({
    name: "Clinical Engineering",
    category: "bio-medical",
    keySubjects: ["Hospital Systems", "Device Maintenance", "Safety Standards"],
    futureJobs: ["Clinical Engineer", "Service Engineer"],
  }),

  // 8. Aerospace & Marine
  makeBranch({
    name: "Aerospace Engineering",
    category: "aero-marine",
    keySubjects: ["Aerodynamics", "Structures", "Propulsion"],
    futureJobs: ["Aerospace Engineer", "Flight Test Engineer"],
    industries: ["Aviation", "Space", "Defence"],
  }),
  makeBranch({
    name: "Aeronautical Engineering",
    category: "aero-marine",
    keySubjects: ["Aircraft Structures", "Stability", "Avionics Basics"],
    futureJobs: ["Aircraft Design Engineer", "MRO Engineer"],
  }),
  makeBranch({
    name: "Marine Engineering",
    category: "aero-marine",
    keySubjects: ["Ship Systems", "Marine Engines", "Navigation"],
    futureJobs: ["Marine Engineer", "Offshore Engineer"],
    industries: ["Shipping", "Offshore", "Defence"],
  }),
  makeBranch({
    name: "Naval Architecture",
    category: "aero-marine",
    keySubjects: ["Ship Design", "Hydrodynamics", "Structures"],
    futureJobs: ["Naval Architect", "Shipyard Engineer"],
  }),

  // 9. Architecture & Design Engineering
  makeBranch({
    name: "Architecture (B.Arch)",
    category: "architecture-design",
    degreeType: "barch",
    duration: "5 years (B.Arch)",
    eligibility: "12th with PCM; NATA/JEE Paper 2 scores",
    entranceExams: ["NATA", "JEE Paper 2"],
    keySubjects: ["Design Studio", "Building Materials", "Climatology", "Structures Basics"],
    futureJobs: ["Architect", "Urban Designer", "Interior Consultant"],
  }),
  makeBranch({
    name: "Interior Design Engineering",
    category: "architecture-design",
    keySubjects: ["Interior Materials", "Lighting", "Space Planning"],
    futureJobs: ["Interior Designer", "Visualizer"],
  }),
  makeBranch({
    name: "Urban Planning",
    category: "architecture-design",
    relatedCategories: ["civil-infrastructure"],
    keySubjects: ["Planning Theory", "Transport Planning", "GIS"],
    futureJobs: ["Urban Planner", "Transport Planner"],
  }),
  makeBranch({
    name: "Landscape Engineering",
    category: "architecture-design",
    keySubjects: ["Landscape Design", "Sustainability", "Horticulture Basics"],
    futureJobs: ["Landscape Designer", "Site Planner"],
  }),

  // 10. Transportation & Logistics
  makeBranch({
    name: "Railway Engineering",
    category: "transport-logistics",
    keySubjects: ["Rail Systems", "Track Design", "Signalling Basics"],
    futureJobs: ["Railway Engineer", "Rolling Stock Engineer"],
  }),
  makeBranch({
    name: "Logistics Engineering",
    category: "transport-logistics",
    keySubjects: ["Supply Chain", "Operations", "Analytics"],
    futureJobs: ["Logistics Engineer", "Supply Chain Analyst"],
  }),

  // 11. Emerging & Future Engineering Fields
  makeBranch({
    name: "Artificial Intelligence & Data Engineering",
    category: "emerging-future",
    degreeType: "specialized-engineering",
    keySubjects: ["AI", "Data Pipelines", "Cloud ML"],
    futureJobs: ["AI Engineer", "Data Engineer"],
    trendingLevel: "high",
  }),
  makeBranch({
    name: "Internet of Things (IoT)",
    category: "emerging-future",
    keySubjects: ["Sensors", "Embedded", "Cloud", "Networking"],
    futureJobs: ["IoT Engineer", "Embedded IoT Developer"],
  }),
  makeBranch({
    name: "Blockchain Engineering",
    category: "emerging-future",
    keySubjects: ["Distributed Ledgers", "Smart Contracts", "Security"],
    futureJobs: ["Blockchain Engineer", "Web3 Developer"],
  }),
  makeBranch({
    name: "Renewable Energy Engineering",
    category: "emerging-future",
    relatedCategories: ["electrical-electronics"],
    keySubjects: ["Solar/Wind Systems", "Power Electronics", "Grid Integration"],
    futureJobs: ["Renewable Engineer", "Energy Analyst"],
  }),
  makeBranch({
    name: "Energy Engineering",
    category: "emerging-future",
    keySubjects: ["Thermal Systems", "Energy Management", "Sustainability"],
    futureJobs: ["Energy Auditor", "Energy Engineer"],
  }),
  makeBranch({
    name: "Nanotechnology Engineering",
    category: "emerging-future",
    keySubjects: ["Nano Materials", "Fabrication", "Characterization"],
    futureJobs: ["Nanotech Engineer", "Materials Scientist"],
    industries: ["Electronics", "Materials", "Healthcare"],
  }),
  makeBranch({
    name: "Quantum Computing Engineering",
    category: "emerging-future",
    degreeType: "specialized-engineering",
    keySubjects: ["Quantum Mechanics Basics", "Quantum Algorithms", "Cryo/Hardware Basics"],
    futureJobs: ["Quantum Research Engineer", "Quantum Software Developer"],
    industries: ["Research", "Advanced Computing"],
  }),

  // 12. Other Specialized Engineering Fields
  makeBranch({
    name: "Mining Engineering",
    category: "specialized",
    keySubjects: ["Mining Methods", "Rock Mechanics", "Mine Safety"],
    futureJobs: ["Mining Engineer", "Safety Engineer"],
    industries: ["Mining", "Resources"],
  }),
  makeBranch({
    name: "Metallurgical Engineering",
    category: "specialized",
    keySubjects: ["Metallurgy", "Materials Science", "Heat Treatment"],
    futureJobs: ["Metallurgist", "Materials Engineer"],
    industries: ["Steel", "Manufacturing"],
  }),
  makeBranch({
    name: "Ceramic Engineering",
    category: "specialized",
    keySubjects: ["Ceramic Materials", "Processing", "Kiln Tech"],
    futureJobs: ["Ceramic Engineer", "Quality Engineer"],
    industries: ["Materials", "Aerospace", "Electronics"],
  }),
  makeBranch({
    name: "Agricultural Engineering",
    category: "specialized",
    relatedCategories: ["civil-infrastructure"],
    keySubjects: ["Farm Machinery", "Irrigation", "Post-Harvest"],
    futureJobs: ["Agri Engineer", "Irrigation Engineer"],
    industries: ["AgriTech", "Food Processing"],
  }),
  makeBranch({
    name: "Forestry Engineering",
    category: "specialized",
    keySubjects: ["Forest Management", "GIS", "Conservation"],
    futureJobs: ["Forest Engineer", "Conservation Planner"],
    industries: ["Environment", "Government"],
  }),
  makeBranch({
    name: "Fire & Safety Engineering",
    category: "specialized",
    keySubjects: ["Fire Dynamics", "Safety Codes", "Risk Assessment"],
    futureJobs: ["Safety Engineer", "EHS Officer"],
    industries: ["Oil & Gas", "Manufacturing", "Construction"],
  }),
  makeBranch({
    name: "Printing Engineering",
    category: "specialized",
    keySubjects: ["Print Technology", "Color Science", "Packaging"],
    futureJobs: ["Print Engineer", "Packaging Engineer"],
    industries: ["Printing", "Packaging", "Media"],
  }),
  makeBranch({
    name: "Polymer Engineering",
    category: "specialized",
    keySubjects: ["Polymer Chemistry", "Processing", "Composites"],
    futureJobs: ["Polymer Engineer", "Materials Engineer"],
    industries: ["Automotive", "Aerospace", "Plastics"],
  }),
];
