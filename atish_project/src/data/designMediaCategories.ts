export type DesignMediaCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export const designMediaCategories: DesignMediaCategory[] = [
  { id: "graphic-visual", title: "Graphic & Visual Design", description: "Branding, communication, UI/UX, and visual systems.", order: 1 },
  { id: "fashion-textile", title: "Fashion & Textile", description: "Fashion, textiles, apparel, and garment technology.", order: 2 },
  { id: "interior-product", title: "Interior & Product", description: "Interior, product, furniture, industrial, exhibition design.", order: 3 },
  { id: "animation-vfx", title: "Animation, VFX & Multimedia", description: "2D/3D animation, VFX, motion, multimedia, games.", order: 4 },
  { id: "film-media", title: "Film, Media & Production", description: "Film making, cinematography, editing, media production.", order: 5 },
  { id: "photo-digital", title: "Photography & Digital Media", description: "Photography, digital media, visual storytelling.", order: 6 },
  { id: "advertising-communication", title: "Advertising & Communication", description: "Advertising, brand, PR, copy, media communication.", order: 7 },
  { id: "journalism-masscom", title: "Journalism & Mass Communication", description: "Journalism, mass communication, broadcast, digital news.", order: 8 },
  { id: "game-interactive", title: "Game & Interactive Media", description: "Game design, dev, AR/VR, interactive media.", order: 9 },
  { id: "fine-performing", title: "Fine & Performing Arts", description: "BFA, painting, sculpture, theatre, dance, music.", order: 10 },
  { id: "diploma-short-design", title: "Diploma & Short Courses", description: "Applied diplomas and certificates for quick entry.", order: 11 },
];
