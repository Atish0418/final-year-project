export type ArtsScienceCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const artsScienceCategories: ArtsScienceCategory[] = [
  { id: "arts-humanities", title: "Arts / Humanities", description: "Society, culture, languages, and human behaviour.", order: 1 },
  { id: "pure-science", title: "Pure Science", description: "Fundamental science degrees with lab and theory depth.", order: 2 },
  { id: "computer-it", title: "Computer & IT", description: "Coding, software, data, and digital systems.", order: 3 },
  { id: "life-science-medical", title: "Life Science & Medical", description: "Biology-focused degrees with applied healthcare links.", order: 4 },
  { id: "commerce-management", title: "Commerce & Management", description: "Business, finance, and management-focused programs.", order: 5 },
  { id: "creative-design", title: "Creative & Design", description: "Design, media, animation, and visual storytelling.", order: 6 },
  { id: "hotel-service", title: "Hotel & Service", description: "Hospitality, tourism, catering, and service operations.", order: 7 },
  { id: "law-legal", title: "Law & Legal Studies", description: "Integrated law pathways with domain pairings.", order: 8 },
  { id: "social-development", title: "Social & Development", description: "Social impact, policy, and development studies.", order: 9 },
];
