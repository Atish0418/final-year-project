import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lawCategories } from "../data/lawCategories";
import { lawDepartments } from "../data/lawDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import type { Department } from "../types/content";
import { Badge } from "../components/ui/Badge";
import {
  Scale,
  Briefcase,
  Gavel,
  Globe2,
  ShieldCheck,
  Landmark,
  HeartPulse,
  Book,
  FileCheck2,
  GraduationCap,
  Clock3,
  Zap,
} from "lucide-react";

type Sort = "trending" | "az";

const pathTypeLabels: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  "integrated-degree": "Integrated",
  degree: "Degree",
  postgraduate: "Postgraduate",
  specialization: "Specialization",
  diploma: "Diploma",
  certificate: "Certificate",
  "legal-focus-area": "Focus Area",
};

const entryLevelLabels: Record<NonNullable<Department["entryLevel"]>, string> = {
  "after-10th": "After 10th",
  "after-10th-or-12th": "After 10th/12th",
  "after-12th": "After 12th",
  "after-graduation": "After Graduation",
  "after-diploma": "After Diploma",
  "after-degree": "After Degree",
  "after-postgraduation": "After PG",
  "multiple-entry-levels": "Multiple Entry",
  "postgraduate-specialization": "Postgraduate",
  "short-term-upskilling": "Short-term",
  "working-professional": "Working Pro",
  "flexible-entry": "Flexible Entry",
};

const catIcon: Record<string, ReactNode> = {
  "ug-law": <GraduationCap size={18} />,
  "pg-law": <Scale size={18} />,
  "corporate-business-law": <Briefcase size={18} />,
  "criminal-civil-law": <Gavel size={18} />,
  "international-specialized-law": <Globe2 size={18} />,
  "ipr-tech-law": <ShieldCheck size={18} />,
  "public-government-law": <Landmark size={18} />,
  "medical-social-law": <HeartPulse size={18} />,
  "diploma-certificate-law": <FileCheck2 size={18} />,
};

const catShade: Record<string, string> = {
  "ug-law": "from-sky-500/20 to-blue-500/10",
  "pg-law": "from-indigo-500/20 to-slate-500/10",
  "corporate-business-law": "from-emerald-500/20 to-teal-400/10",
  "criminal-civil-law": "from-rose-500/20 to-pink-400/10",
  "international-specialized-law": "from-purple-500/20 to-violet-400/10",
  "ipr-tech-law": "from-amber-500/20 to-orange-400/10",
  "public-government-law": "from-cyan-500/20 to-blue-400/10",
  "medical-social-law": "from-teal-500/20 to-emerald-400/10",
  "diploma-certificate-law": "from-slate-500/20 to-slate-300/10",
};

const pathTypeTone: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  "integrated-degree": "border-sky-300/50 bg-sky-400/15 text-sky-50",
  degree: "border-emerald-300 bg-emerald-400/15 text-emerald-800",
  postgraduate: "border-indigo-300 bg-indigo-400/15 text-indigo-800",
  specialization: "border-purple-300/50 bg-purple-400/15 text-purple-50",
  diploma: "border-amber-300 bg-amber-400/15 text-amber-800",
  certificate: "border-slate-300/60 bg-slate-200/10 text-slate-800",
  "legal-focus-area": "border-blue-300/50 bg-blue-400/15 text-blue-50",
};

const entryTone: Record<NonNullable<Department["entryLevel"]>, string> = {
  "after-10th": "border-amber-300 bg-amber-400/15 text-amber-800",
  "after-10th-or-12th": "border-teal-300/50 bg-teal-400/15 text-teal-50",
  "after-12th": "border-lime-300/50 bg-lime-400/15 text-lime-50",
  "after-graduation": "border-amber-300 bg-amber-400/15 text-amber-800",
  "after-diploma": "border-teal-300/50 bg-teal-500/15 text-teal-50",
  "after-degree": "border-green-300/50 bg-green-500/15 text-green-50",
  "after-postgraduation": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "multiple-entry-levels": "border-slate-300 bg-slate-100 text-slate-800",
  "postgraduate-specialization": "border-indigo-300 bg-indigo-400/15 text-indigo-800",
  "short-term-upskilling": "border-slate-300 bg-slate-200/10 text-slate-800",
  "working-professional": "border-cyan-300/50 bg-cyan-400/15 text-cyan-50",
  "flexible-entry": "border-purple-300/50 bg-purple-400/15 text-purple-50",
};

const sortDepartments = (sort: Sort) => (a: Department, b: Department) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const score = (d: Department) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return score(b) - score(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const LawStreamPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");
  const [pathFilter, setPathFilter] = useState<Department["pathType"] | "all">("all");
  const [entryFilter, setEntryFilter] = useState<Department["entryLevel"] | "all">("all");

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, Department>();
    lawDepartments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const activeCategory = categorySlug ?? "";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return uniqueDepartments
      .filter((d) =>
        activeCategory ? d.category === activeCategory || d.relatedCategories?.includes(activeCategory) : true,
      )
      .filter((d) => (pathFilter === "all" ? true : d.pathType === pathFilter))
      .filter((d) => (entryFilter === "all" ? true : d.entryLevel === entryFilter))
      .filter((d) => (q ? d.name.toLowerCase().includes(q) || d.overview.toLowerCase().includes(q) : true))
      .sort(sortDepartments(sort));
  }, [activeCategory, pathFilter, entryFilter, search, sort, uniqueDepartments]);

  const categoryCount = (id: string) =>
    uniqueDepartments.filter((d) => d.category === id || d.relatedCategories?.includes(id)).length;

  const pathTypes = Array.from(
    new Set(uniqueDepartments.map((d) => d.pathType).filter(Boolean) as NonNullable<Department["pathType"]>[]),
  );
  const entryLevels = Array.from(
    new Set(uniqueDepartments.map((d) => d.entryLevel).filter(Boolean) as NonNullable<Department["entryLevel"]>[]),
  );

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Law Courses After 12th | BA LL.B, BBA LL.B, Legal Specializations & Judiciary"
        description="Understand integrated law pathways, entrance exams, specializations, and careers in courts, corporate law, compliance, and public service."
        canonicalPath="/stream/law"
      />
      <SectionHeader
        eyebrow="Law Stream"
        title="Explore law degrees, specializations, and practice areas"
        subtitle="Filter by category, path type, or entry level. Spot trending options and open concise details fast."
      />

      <div className="glass-panel rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!activeCategory ? "primary" : "ghost"}
            onClick={() => navigate("/stream/law")}
            className="text-xs px-3 rounded-full"
          >
            All categories
          </Button>
          <div className="flex flex-wrap gap-2">
            {lawCategories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                className={cn("text-xs px-3 rounded-full", activeCategory === cat.id ? "ring-1 ring-black" : "")}
                onClick={() =>
                  activeCategory === cat.id ? navigate("/stream/law") : navigate(`/stream/law/category/${cat.id}`)
                }
              >
                {cat.title.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search law course"
            className="h-10 w-60 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={pathFilter === "all" ? "primary" : "ghost"}
              className="text-xs px-3 rounded-full"
              onClick={() => setPathFilter("all")}
            >
              All paths
            </Button>
            {pathTypes.map((pt) => (
              <Button
                key={pt}
                size="sm"
                variant={pathFilter === pt ? "primary" : "ghost"}
                className="text-xs px-3 rounded-full"
                onClick={() => setPathFilter(pt)}
              >
                {pathTypeLabels[pt] ?? pt}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={entryFilter === "all" ? "primary" : "ghost"}
              className="text-xs px-3 rounded-full"
              onClick={() => setEntryFilter("all")}
            >
              All entry levels
            </Button>
            {entryLevels.map((el) => (
              <Button
                key={el}
                size="sm"
                variant={entryFilter === el ? "primary" : "ghost"}
                className="text-xs px-3 rounded-full"
                onClick={() => setEntryFilter(el)}
              >
                {entryLevelLabels[el]}
              </Button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-10 rounded-full border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="trending">Trending first</option>
            <option value="az">A - Z</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {lawCategories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 relative overflow-hidden bg-gradient-to-br transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
              catShade[cat.id] ?? "bg-white",
              activeCategory === cat.id ? "ring-1 ring-black shadow-sm" : "shadow-sm",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 backdrop-blur-sm flex items-center justify-center text-primary">
                {catIcon[cat.id] ?? <Book size={18} />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                <div className="text-xs text-gray-600">{categoryCount(cat.id)} courses</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">{cat.description}</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                onClick={() => navigate(`/stream/law/category/${cat.id}`)}
                className="text-xs px-3"
              >
                {activeCategory === cat.id ? "Selected" : "Explore"}
              </Button>
              <Button variant="ghost" className="text-xs px-3" onClick={() => navigate(`/stream/law/category/${cat.id}`)}>
                View {categoryCount(cat.id)} paths
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((dept) => (
          <Card
            key={dept.id}
            eyebrow={dept.category?.replace(/-/g, " ").toUpperCase()}
            title={dept.name}
            subtitle={dept.overview}
            actions={
              <div className="flex items-center gap-2">
                {dept.trendingLevel === "high" && (
                  <span className="inline-flex items-center gap-1 text-[11px] rounded-full bg-primary/20 text-primary px-2 py-1 border border-primary/30">
                    <Zap size={12} /> Trending
                  </span>
                )}
                {dept.pathType ? (
                  <Badge className={cn("px-2 py-1", pathTypeTone[dept.pathType])}>{pathTypeLabels[dept.pathType]}</Badge>
                ) : null}
                {dept.entryLevel ? (
                  <Badge className={cn("px-2 py-1", entryTone[dept.entryLevel])}>{entryLevelLabels[dept.entryLevel]}</Badge>
                ) : null}
                <Button as="a" href={`#/department/${dept.slug ?? dept.id}`} variant="ghost" className="text-xs px-3">
                  View details
                </Button>
              </div>
            }
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {dept.keySubjects.slice(0, 4).map((subj) => (
                  <span
                    key={subj}
                  className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
                >
                  {subj}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Clock3 size={12} />
              <span>Duration: {dept.duration}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dept.futureScope ? (
                <Badge className="border-white/20 bg-gray-50 text-gray-800">
                  {dept.futureScope.split(".")[0]}
                </Badge>
              ) : null}
              {dept.trendingLevel === "high" ? (
                <Badge className="border-primary/30 bg-primary/15 text-primary">High demand</Badge>
              ) : null}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="glass-panel rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
            No law paths match your filters. Try a different category, path type, or entry level.
          </div>
        )}
      </div>
    </div>
  );
};

export default LawStreamPage;
