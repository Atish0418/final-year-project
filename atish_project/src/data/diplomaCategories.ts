export type DiplomaCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const diplomaCategories: DiplomaCategory[] = [
  { id: "eng-diploma", title: "Engineering Diplomas", description: "Polytechnic pathways for core engineering trades.", order: 1 },
  { id: "it-diploma", title: "Computer & IT Diplomas", description: "Programming, software, cyber security, and data diplomas.", order: 2 },
  { id: "medical-diploma", title: "Medical & Paramedical Diplomas", description: "Health, lab, imaging, pharmacy, and OT tech diplomas.", order: 3 },
  { id: "agri-diploma", title: "Agriculture Diplomas", description: "Applied agri, dairy, horticulture, fisheries diplomas.", order: 4 },
  { id: "creative-diploma", title: "Design & Creative Diplomas", description: "Graphic, fashion, animation, interior, multimedia diplomas.", order: 5 },
  { id: "commerce-diploma", title: "Commerce & Management Diplomas", description: "Accounting, business, banking, marketing, HR diplomas.", order: 6 },
  { id: "hospitality-diploma", title: "Hotel & Hospitality Diplomas", description: "Hotel, catering, food production, bakery, aviation hospitality.", order: 7 },
  { id: "trade-skill-diploma", title: "Trade & Technical Diplomas", description: "Electrician, plumbing, welding, RAC, solar skill tracks.", order: 8 },
  { id: "transport-marine-diploma", title: "Transport & Marine Diplomas", description: "Marine, logistics, railway, automobile maintenance.", order: 9 },
  { id: "law-social-diploma", title: "Law & Social Diplomas", description: "Cyber law, legal studies, social work, human rights diplomas.", order: 10 },
];
