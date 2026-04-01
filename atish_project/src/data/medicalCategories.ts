export type MedicalCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const medicalCategories: MedicalCategory[] = [
  { id: "doctor", title: "Doctor (MBBS & Equivalents)", description: "Core medical doctor degrees across systems.", order: 1 },
  { id: "allied-health", title: "Allied Health Sciences", description: "Diagnostics and clinical support technologies.", order: 2 },
  { id: "dental", title: "Dental & Oral Health", description: "Dentistry and dental care pathways.", order: 3 },
  { id: "pharmacy", title: "Pharmacy", description: "Medicines, dispensing, and clinical pharmacy.", order: 4 },
  { id: "life-science-research", title: "Life Science & Research", description: "Bio sciences for labs and research.", order: 5 },
  { id: "nursing", title: "Nursing", description: "Patient care, nursing practice, and midwifery.", order: 6 },
  { id: "therapy-rehab", title: "Therapy & Rehabilitation", description: "Physio, occupational, speech, and rehab.", order: 7 },
  { id: "nutrition-health", title: "Nutrition & Health", description: "Nutrition, dietetics, and food science.", order: 8 },
  { id: "public-health", title: "Public Health & Management", description: "Health systems, administration, epidemiology.", order: 9 },
  { id: "medical-diploma", title: "Diploma & Short-Term", description: "Short medical diplomas and emergency care.", order: 10 },
];
