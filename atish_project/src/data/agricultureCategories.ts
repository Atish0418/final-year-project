export type AgricultureCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const agricultureCategories: AgricultureCategory[] = [
  { id: "core-agriculture", title: "Core Agriculture", description: "Foundation courses in crop science and farm systems.", order: 1 },
  { id: "horticulture-plant", title: "Horticulture & Plant Science", description: "Plants, breeding, seeds, floriculture, and pathology.", order: 2 },
  { id: "animal-dairy", title: "Animal Husbandry & Dairy", description: "Livestock, dairy tech, poultry, and vet-linked tracks.", order: 3 },
  { id: "fisheries-aqua", title: "Fisheries & Aquaculture", description: "Fish farming, marine fisheries, and processing.", order: 4 },
  { id: "forestry-environment", title: "Forestry & Environmental", description: "Forestry, agroforestry, wildlife, and environment.", order: 5 },
  { id: "agri-engineering", title: "Agricultural Engineering", description: "Machines, irrigation, soil & water conservation.", order: 6 },
  { id: "agribusiness", title: "Agribusiness & Management", description: "Agribusiness, marketing, and rural management.", order: 7 },
  { id: "food-processing", title: "Food & Processing", description: "Food tech, processing, and post-harvest tracks.", order: 8 },
  { id: "specialized-applied", title: "Specialized Applied", description: "Organic, sericulture, apiculture, precision farming.", order: 9 },
  { id: "diploma-short", title: "Diploma & Short-Term", description: "Applied diplomas and certificates for quick entry.", order: 10 },
];
