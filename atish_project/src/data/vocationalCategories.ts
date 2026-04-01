export type VocationalCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const vocationalCategories: VocationalCategory[] = [
  { id: "tech-mech", title: "Technical & Mechanical Skills", description: "Electrician, fitter, welding, mechanics, CNC and machining.", order: 1 },
  { id: "it-digital", title: "Computer & IT Skills", description: "Data entry, web/app, graphics, digital marketing, testing.", order: 2 },
  { id: "creative-design-skills", title: "Creative & Design Skills", description: "Fashion, tailoring, makeup, photo/video, animation, decor.", order: 3 },
  { id: "hospitality-service", title: "Hospitality & Service Skills", description: "Cooking, bakery, hotel ops, housekeeping, front office, bar.", order: 4 },
  { id: "healthcare-skill", title: "Healthcare & Paramedical Skills", description: "Nursing and patient care assistants, lab, phlebotomy, health aides.", order: 5 },
  { id: "agri-rural", title: "Agriculture & Rural Skills", description: "Organic farming, dairy, poultry, fish, beekeeping, mushrooms.", order: 6 },
  { id: "business-retail", title: "Business & Retail Skills", description: "Retail sales, Tally, CRM, e-commerce, entrepreneurship basics.", order: 7 },
  { id: "transport-driving", title: "Transportation & Driving Skills", description: "Driving, logistics, delivery and warehouse operations.", order: 8 },
  { id: "construction-infra", title: "Construction & Infrastructure", description: "Mason, plumber, carpenter, painter, tiles, steel fixer.", order: 9 },
  { id: "electrical-electronics", title: "Electrical & Electronics", description: "Electrical tech, electronics repair, mobile, solar, CCTV.", order: 10 },
  { id: "media-communication", title: "Media & Communication", description: "Content, public speaking, RJ, anchoring, social media.", order: 11 },
  { id: "govt-skilling", title: "Government Skill Programs", description: "ITI, Skill India, PMKVY, NSDC-supported skilling tracks.", order: 12 },
];
