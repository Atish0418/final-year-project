export type GovernmentCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const governmentCategories: GovernmentCategory[] = [
  { id: "civil-services", title: "Civil Services", description: "UPSC Civil Services, IAS, IPS, IFS, State PSC.", order: 1 },
  { id: "police-defence", title: "Police & Defence", description: "Army, Navy, Air Force, Police, CAPF roles.", order: 2 },
  { id: "banking-finance", title: "Banking & Finance", description: "Bank PO/Clerk, RBI, LIC/Insurance roles.", order: 3 },
  { id: "railways", title: "Railway Jobs", description: "RRB NTPC, Group D, Loco Pilot, Technician.", order: 4 },
  { id: "ssc", title: "SSC Jobs", description: "SSC CGL, CHSL, MTS, DEO exams.", order: 5 },
  { id: "teaching-education", title: "Teaching & Education", description: "Govt teacher, lecturer, professor paths.", order: 6 },
  { id: "medical-govt", title: "Medical Government", description: "Government doctor, nurse, pharmacist, MO.", order: 7 },
  { id: "law-judiciary", title: "Law & Judiciary", description: "Judge, prosecutor, government lawyer.", order: 8 },
  { id: "agri-rural-govt", title: "Agriculture & Rural", description: "Agri officer, rural development, food inspector.", order: 9 },
  { id: "research-science", title: "Research & Scientific", description: "ISRO, DRDO, CSIR research roles.", order: 10 },
  { id: "it-technical-govt", title: "IT & Technical Govt", description: "Government software, NIC, cyber security.", order: 11 },
  { id: "other-govt", title: "Other Government", description: "Post office, VAO, municipal and clerical roles.", order: 12 },
];
