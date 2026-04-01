export type CommerceCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const commerceCategories: CommerceCategory[] = [
  { id: "core-commerce-degree", title: "Core Commerce Degrees", description: "Traditional BCom pathways with focused majors.", order: 1 },
  { id: "management-business", title: "Management & Business", description: "BBA/BBM options for leadership and business roles.", order: 2 },
  { id: "finance-professional", title: "Finance & Professional", description: "CA, CS, CMA, CFA and finance-special courses.", order: 3 },
  { id: "banking-insurance", title: "Banking & Insurance", description: "Banking operations, insurance, and risk pathways.", order: 4 },
  { id: "commerce-technology", title: "Commerce + Technology", description: "Analytics, e-commerce, digital, and tech-enabled business.", order: 5 },
  { id: "international-specialized", title: "International & Specialized", description: "Global trade, logistics, supply chain, and IB majors.", order: 6 },
  { id: "law-commerce", title: "Law + Commerce", description: "Integrated law programs with commerce focus.", order: 7 },
  { id: "diploma-short", title: "Diploma & Short-Term", description: "Diplomas, certificates, and quick upskilling tracks.", order: 8 },
];
