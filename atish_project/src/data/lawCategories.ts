export type LawCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const lawCategories: LawCategory[] = [
  { id: "ug-law", title: "Undergraduate Law", description: "Integrated 5-year law degrees and 3-year LLB.", order: 1 },
  { id: "pg-law", title: "Postgraduate Law", description: "LLM degrees with specializations.", order: 2 },
  { id: "corporate-business-law", title: "Corporate & Business Law", description: "Company, commercial, banking, taxation law.", order: 3 },
  { id: "criminal-civil-law", title: "Criminal & Civil Law", description: "Criminal justice, civil practice, criminology.", order: 4 },
  { id: "international-specialized-law", title: "International & Specialized", description: "International, human rights, environmental, cyber, space, maritime.", order: 5 },
  { id: "ipr-tech-law", title: "IPR & Technology Law", description: "Patents, copyright, trademarks, tech and data law.", order: 6 },
  { id: "public-government-law", title: "Public & Government Law", description: "Constitutional, administrative, public and legislative law.", order: 7 },
  { id: "medical-social-law", title: "Medical & Social Law", description: "Family, labour, medical, social welfare, education law.", order: 8 },
  { id: "diploma-certificate-law", title: "Diploma & Certificate", description: "Short law diplomas and certificates for upskilling.", order: 9 },
];
