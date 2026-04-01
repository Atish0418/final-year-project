export type ManagementCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const managementCategories: ManagementCategory[] = [
  { id: "undergraduate-management", title: "Undergraduate Management", description: "BBA, BBM, BMS, and integrated management foundations after 12th.", order: 1 },
  { id: "postgraduate-management", title: "Postgraduate Management", description: "MBA, PGDM, and advanced management pathways.", order: 2 },
  { id: "finance-management", title: "Finance Management", description: "Finance, banking, risk, investment management tracks.", order: 3 },
  { id: "marketing-management", title: "Marketing Management", description: "Marketing, brand, sales, digital and advertising specializations.", order: 4 },
  { id: "hr-management", title: "HR Management", description: "Human resources, talent and people strategy careers.", order: 5 },
  { id: "international-business", title: "International Business", description: "Global business, export-import, and foreign trade.", order: 6 },
  { id: "operations-supply", title: "Operations & Supply Chain", description: "Operations, logistics, supply chain, production excellence.", order: 7 },
  { id: "it-analytics-management", title: "IT & Analytics Management", description: "IT, information systems, business & data analytics.", order: 8 },
  { id: "specialized-management", title: "Specialized Management", description: "Sector-focused management: hospital, hotel, sports, retail, aviation.", order: 9 },
  { id: "rural-agri-management", title: "Rural & Agri Management", description: "Rural development, agribusiness, and allied sectors.", order: 10 },
  { id: "diploma-short-management", title: "Diploma & Short Courses", description: "Quick diplomas, certificates, project and leadership programs.", order: 11 },
];
