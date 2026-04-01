export type ParamedicalCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const paramedicalCategories: ParamedicalCategory[] = [
  { id: "lab-diagnostics", title: "Laboratory & Diagnostics", description: "Lab testing, pathology, and clinical diagnostics.", order: 1 },
  { id: "radiology-imaging", title: "Radiology & Imaging", description: "Imaging technology roles across X-ray, CT, MRI.", order: 2 },
  { id: "cardiology-care", title: "Cardiology & Heart Care", description: "Cardiac diagnostics and cath lab support.", order: 3 },
  { id: "ot-critical-care", title: "OT & Critical Care", description: "Operation theatre and critical care support roles.", order: 4 },
  { id: "dialysis-renal", title: "Dialysis & Renal Care", description: "Kidney care, dialysis operation and monitoring.", order: 5 },
  { id: "neurology-brain", title: "Neurology & Brain", description: "Neuro diagnostics like EEG and neuro tech.", order: 6 },
  { id: "speech-hearing", title: "Speech & Hearing", description: "Audiology, speech therapy, and hearing tech.", order: 7 },
  { id: "dental-paramedical", title: "Dental Paramedical", description: "Chairside and lab support for dentistry.", order: 8 },
  { id: "patient-care", title: "Nursing Assistant & Patient Care", description: "Bedside care, home health, geriatric support.", order: 9 },
  { id: "nutrition-support", title: "Nutrition & Health Support", description: "Applied nutrition, food safety, health support.", order: 10 },
  { id: "specialized-paramedical", title: "Other Specialized", description: "Eye care, records, blood bank, phlebotomy.", order: 11 },
];
