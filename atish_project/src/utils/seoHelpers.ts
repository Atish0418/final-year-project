import type { Department } from "../types/content";

const SITE_BASE = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://portfoliojayesh.netlify.app";

const truncate = (text: string | undefined, max = 180) => {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max)}…`;
};

export const buildDepartmentSeo = (dept: Department) => {
  const title = `${dept.name} Course Details | Eligibility, Subjects & Scope | FuturePath 3D`;
  const description = truncate(dept.futureScope || dept.overview, 180);
  const canonicalPath = `/department/${dept.slug ?? dept.id}`;
  const canonical = `${SITE_BASE.replace(/\/$/, "")}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;
  return { title, description, canonicalPath, canonical };
};

export type CollegeLike = {
  slug: string;
  name: string;
  city?: string;
  type?: string;
  departments?: string[];
  summary?: string;
};

export const buildCollegeSeo = (college: CollegeLike) => {
  const title = `${college.name} College Details${college.city ? ` in ${college.city}` : ""} | Courses & Admissions`;
  const parts = [
    college.summary,
    college.type ? `Type: ${college.type}` : null,
    college.city ? `Located in ${college.city}` : null,
    college.departments?.length ? `Departments: ${college.departments.slice(0, 6).join(", ")}` : null,
  ].filter(Boolean);
  const description = truncate(parts.join(" • "), 180);
  const canonicalPath = `/colleges/${college.slug}`;
  const canonical = `${SITE_BASE.replace(/\/$/, "")}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;
  return { title, description, canonicalPath, canonical };
};
