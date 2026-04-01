export type EngineeringCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const engineeringCategories: EngineeringCategory[] = [
  { id: "core-engineering", title: "Core Engineering Branches", description: "Classical branches that build infrastructure and machines.", order: 1 },
  { id: "computer-it", title: "Computer & IT Engineering", description: "Software, data, AI, and modern computing.", order: 2 },
  { id: "mechanical-automation", title: "Mechanical & Automation Fields", description: "Machines, robots, vehicles, and automation.", order: 3 },
  { id: "civil-infrastructure", title: "Civil & Infrastructure Fields", description: "Planning and building cities, transport, and structures.", order: 4 },
  { id: "electrical-electronics", title: "Electrical & Electronics Fields", description: "Power, circuits, control, and communications.", order: 5 },
  { id: "chemical-science", title: "Chemical & Science-Based Engineering", description: "Chemistry-driven processes, energy, and materials.", order: 6 },
  { id: "bio-medical", title: "Bio & Medical Engineering", description: "Healthcare technology, biology, and medical devices.", order: 7 },
  { id: "aero-marine", title: "Aerospace & Marine Engineering", description: "Air, space, and marine vehicles and systems.", order: 8 },
  { id: "architecture-design", title: "Architecture & Design Engineering", description: "Built environments, interiors, and urban spaces.", order: 9 },
  { id: "transport-logistics", title: "Transportation & Logistics Engineering", description: "Moving people and goods efficiently.", order: 10 },
  { id: "emerging-future", title: "Emerging & Future Fields", description: "Cutting-edge tech shaping the next decade.", order: 11 },
  { id: "specialized", title: "Other Specialized Fields", description: "Niche branches for specific industries.", order: 12 },
];
