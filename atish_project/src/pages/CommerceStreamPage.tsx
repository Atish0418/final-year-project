import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { commerceCategories } from "../data/commerceCategories";
import { commerceDepartments } from "../data/commerceDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import { Briefcase, TrendingUp, Shield, Globe2, Laptop, Scale, Clock, Layers, Flame } from "lucide-react";
import type { Department } from "../types/content";
import { Badge } from "../components/ui/Badge";

type Sort = "trending" | "az";

const pathTypeLabels: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  degree: "Degree",
  professional: "Professional",
  diploma: "Diploma",
  certificate: "Certificate",
  specialization: "Specialization",
  "integrated-law": "Integrated Law",
};

const pathTone: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  degree: "border-indigo-300 bg-indigo-100 text-indigo-800",
  professional: "border-emerald-300 bg-emerald-100 text-emerald-800",
  diploma: "border-cyan-300/50 bg-cyan-500/15 text-cyan-50",
  certificate: "border-amber-300 bg-amber-100 text-amber-800",
  specialization: "border-violet-300/50 bg-violet-500/15 text-violet-50",
  "integrated-law": "border-slate-300 bg-slate-100 text-slate-800",
};

const catIcon: Record<string, ReactNode> = {
  "core-commerce-degree": <Briefcase size={18} />,
  "management-business": <TrendingUp size={18} />,
  "finance-professional": <Shield size={18} />,
  "banking-insurance": <Globe2 size={18} />,
  "commerce-technology": <Laptop size={18} />,
  "international-specialized": <Globe2 size={18} />,
  "law-commerce": <Scale size={18} />,
  "diploma-short": <Clock size={18} />,
};

const catShade: Record<string, string> = {
  "core-commerce-degree": "from-amber-500/20 to-orange-400/10",
  "management-business": "from-blue-500/20 to-indigo-400/10",
  "finance-professional": "from-emerald-500/20 to-teal-400/10",
  "banking-insurance": "from-cyan-500/20 to-sky-400/10",
  "commerce-technology": "from-violet-500/20 to-purple-400/10",
  "international-specialized": "from-lime-500/20 to-emerald-400/10",
  "law-commerce": "from-slate-500/25 to-slate-300/10",
  "diploma-short": "from-rose-400/20 to-pink-300/10",
};

const sortDepartments = (sort: Sort) => (a: Department, b: Department) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const score = (d: Department) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return score(b) - score(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const CommerceStreamPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");
  const [pathFilter, setPathFilter] = useState<Department["pathType"] | "all">("all");

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, Department>();
    commerceDepartments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const activeCategory = categorySlug ?? "";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return uniqueDepartments
      .filter((d) => (activeCategory ? d.category === activeCategory : true))
      .filter((d) => (pathFilter === "all" ? true : d.pathType === pathFilter))
      .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
      .sort(sortDepartments(sort));
  }, [activeCategory, pathFilter, search, sort, uniqueDepartments]);

  const categoryCount = (id: string) => uniqueDepartments.filter((d) => d.category === id).length;

  const pathTypes = Array.from(
    new Set(uniqueDepartments.map((d) => d.pathType).filter(Boolean) as NonNullable<Department["pathType"]>[]),
  );

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Commerce Courses After 12th | BCom, BBA, CA/CS, Banking Paths"
        description="See requirements, subjects, and careers for BCom, BBA, CA, CMA, CS, finance, taxation, and banking roles after 12th."
        canonicalPath="/stream/commerce"
      />
      <SectionHeader
        eyebrow="Commerce Stream"
        title="Explore every commerce course and professional pathway"
        subtitle="Filter by category or path type, spot trending options, and read concise course details."
      />

      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3">
        {commerceCategories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 relative overflow-hidden bg-gradient-to-br shadow-lg shadow-primary/5",
              catShade[cat.id] ?? "bg-white",
              activeCategory === cat.id ? "ring-1 ring-black shadow-sm" : "shadow-sm",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 backdrop-blur-sm flex items-center justify-center text-primary">
                {catIcon[cat.id] ?? <Layers size={18} />}
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
                onClick={() => navigate(`/stream/commerce/category/${cat.id}`)}
                className="text-xs px-3"
              >
                {activeCategory === cat.id ? "Selected" : "Explore"}
              </Button>
              <Button variant="ghost" className="text-xs px-3" onClick={() => navigate(`/stream/commerce/category/${cat.id}`)}>
                View {categoryCount(cat.id)} paths
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!activeCategory ? "primary" : "ghost"}
            onClick={() => navigate("/stream/commerce")}
            className="text-xs px-3"
          >
            All categories
          </Button>
          <div className="flex flex-wrap gap-2">
            {commerceCategories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                className={cn("text-xs px-3", activeCategory === cat.id ? "ring-1 ring-black" : "")}
                onClick={() =>
                  activeCategory === cat.id ? navigate("/stream/commerce") : navigate(`/stream/commerce/category/${cat.id}`)
                }
              >
                {cat.title.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={pathFilter === "all" ? "primary" : "ghost"}
              className="text-xs px-3"
              onClick={() => setPathFilter("all")}
            >
              All types
            </Button>
            {pathTypes.map((pt) => (
              <Button
                key={pt}
                size="sm"
                variant={pathFilter === pt ? "primary" : "ghost"}
                className="text-xs px-3 rounded-full"
                onClick={() => setPathFilter(pt)}
              >
                {pathTypeLabels[pt]}
              </Button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course"
            className="h-10 w-52 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="trending">Trending first</option>
            <option value="az">A - Z</option>
          </select>
        </div>
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
                  <Badge className="text-[11px] bg-amber-500/20 text-amber-800 border-amber-300 flex items-center gap-1">
                    <Flame size={12} /> Trending
                  </Badge>
                )}
                {dept.featured && (
                  <span className="text-[11px] rounded-full bg-amber-400/20 text-amber-800 px-2 py-1 border border-amber-300/40">
                    Featured
                  </span>
                )}
                {dept.pathType ? (
                  <Badge className="text-[11px] bg-gray-100 border border-white/15 text-gray-900">
                    {pathTypeLabels[dept.pathType]}
                  </Badge>
                ) : null}
                <Button as="a" href={`#/department/${dept.slug ?? dept.id}`} variant="ghost" className="text-xs px-3">
                  View details
                </Button>
              </div>
            }
            className="h-full"
          >
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              {dept.pathType ? (
                <Badge className={cn("px-2 py-1 text-[11px]", pathTone[dept.pathType] ?? "border-gray-200 bg-gray-50 text-gray-900")}>
                  {pathTypeLabels[dept.pathType]}
                </Badge>
              ) : null}
              <Badge className="border-gray-200 bg-gray-50 text-gray-900">Duration: {dept.duration}</Badge>
              <Badge className="border-emerald-300 bg-emerald-100 text-emerald-800">
                Scope: {dept.futureScope.split(".")[0]}
              </Badge>
              {dept.trendingLevel === "medium" && <Badge className="border-amber-300/40 bg-amber-100 text-amber-800">Steady demand</Badge>}
              {dept.trendingLevel === "low" && <Badge className="border-slate-300/40 bg-slate-100 text-slate-800">Niche</Badge>}
            </div>
            <div className="flex flex-wrap gap-2">
              {dept.keySubjects.slice(0, 4).map((subj, idx) => (
                <span key={`${subj}-${idx}`} className="text-[11px] rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200">
                  {subj}
                </span>
              ))}
            </div>
            <div className="mt-3 text-[12px] text-gray-700">
              <span className="font-semibold text-gray-900">Best for:</span> {dept.bestFor}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="glass-panel rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
            No courses match your search. Try another keyword or path type.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommerceStreamPage;
