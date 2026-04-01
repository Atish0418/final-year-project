import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { managementCategories } from "../data/managementCategories";
import { managementDepartments } from "../data/managementDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import type { Department } from "../types/content";
import { Badge } from "../components/ui/Badge";
import {
  Briefcase,
  TrendingUp,
  Globe2,
  Layers,
  BarChart2,
  Users2,
  Network,
  Package,
  Cpu,
  Map as MapIcon,
  Clock3,
  Zap,
} from "lucide-react";

type Sort = "trending" | "az";

const pathTypeLabels: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  "undergraduate-degree": "UG Degree",
  "postgraduate-degree": "PG Degree",
  "postgraduate-diploma": "PG Diploma",
  "integrated-degree": "Integrated",
  specialization: "Specialization",
  diploma: "Diploma",
  certificate: "Certificate",
  "short-term": "Short Term",
};

const entryLabels: Record<NonNullable<Department["entryLevel"]>, string> = {
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
  "undergraduate-management": <Briefcase size={18} />,
  "postgraduate-management": <TrendingUp size={18} />,
  "finance-management": <BarChart2 size={18} />,
  "marketing-management": <Globe2 size={18} />,
  "hr-management": <Users2 size={18} />,
  "international-business": <Network size={18} />,
  "operations-supply": <Package size={18} />,
  "it-analytics-management": <Cpu size={18} />,
  "specialized-management": <Layers size={18} />,
  "rural-agri-management": <MapIcon size={18} />,
  "diploma-short-management": <Clock3 size={18} />,
};

const catShade: Record<string, string> = {
  "undergraduate-management": "from-emerald-500/20 to-teal-400/10",
  "postgraduate-management": "from-indigo-500/20 to-blue-400/10",
  "finance-management": "from-cyan-500/20 to-sky-400/10",
  "marketing-management": "from-pink-500/20 to-rose-400/10",
  "hr-management": "from-orange-500/20 to-amber-400/10",
  "international-business": "from-purple-500/20 to-violet-400/10",
  "operations-supply": "from-slate-500/20 to-slate-300/10",
  "it-analytics-management": "from-amber-500/20 to-yellow-300/10",
  "specialized-management": "from-lime-500/20 to-emerald-300/10",
  "rural-agri-management": "from-green-500/20 to-lime-300/10",
  "diploma-short-management": "from-slate-400/20 to-slate-200/10",
};

const sortDepartments = (sort: Sort) => (a: Department, b: Department) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const score = (d: Department) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return score(b) - score(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const uniqueOf = <T,>(arr: (T | undefined | null)[]) => {
  const out: T[] = [];
  arr.forEach((item) => {
    if (item && !out.includes(item)) out.push(item);
  });
  return out;
};

const pathTone: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  "undergraduate-degree": "border-emerald-300 bg-emerald-100 text-emerald-800",
  "postgraduate-degree": "border-indigo-300/40 bg-indigo-100 text-indigo-800",
  "postgraduate-diploma": "border-blue-300/40 bg-blue-500/15 text-blue-50",
  "integrated-degree": "border-teal-300/40 bg-teal-500/15 text-teal-50",
  specialization: "border-purple-300/40 bg-purple-500/15 text-purple-50",
  diploma: "border-amber-300/40 bg-amber-100 text-amber-800",
  certificate: "border-slate-300 bg-slate-200/10 text-slate-800",
  "short-term": "border-pink-300/40 bg-pink-500/15 text-pink-50",
};

const entryTone: Record<NonNullable<Department["entryLevel"]>, string> = {
  "after-10th": "border-amber-300 bg-amber-100 text-amber-800",
  "after-10th-or-12th": "border-cyan-300/50 bg-cyan-500/15 text-cyan-50",
  "after-12th": "border-lime-300/50 bg-lime-500/15 text-lime-50",
  "after-graduation": "border-amber-300 bg-amber-100 text-amber-800",
  "after-diploma": "border-teal-300/50 bg-teal-500/15 text-teal-50",
  "after-degree": "border-emerald-300 bg-emerald-100 text-emerald-800",
  "after-postgraduation": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "multiple-entry-levels": "border-slate-300 bg-slate-100 text-slate-800",
  "postgraduate-specialization": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "short-term-upskilling": "border-slate-300 bg-slate-200/10 text-slate-800",
  "working-professional": "border-cyan-300/50 bg-cyan-500/15 text-cyan-50",
  "flexible-entry": "border-purple-300/50 bg-purple-500/15 text-purple-50",
};

const modeTone: Partial<Record<NonNullable<Department["deliveryMode"]>, string>> = {
  executive: "border-orange-300/40 bg-orange-500/15 text-orange-50",
  distance: "border-sky-300/40 bg-sky-500/15 text-sky-50",
  online: "border-fuchsia-300/40 bg-fuchsia-500/15 text-fuchsia-50",
  blended: "border-rose-300/40 bg-rose-500/15 text-rose-50",
  flexible: "border-teal-300/40 bg-teal-500/15 text-teal-50",
};

const ManagementStreamPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");
  const [pathFilter, setPathFilter] = useState<Department["pathType"] | "all">("all");
  const [entryFilter, setEntryFilter] = useState<Department["entryLevel"] | "all">("all");
  const [modeFilter, setModeFilter] = useState<Department["deliveryMode"] | "all">("all");

  const uniqueDepartments: Department[] = useMemo(() => {
    const map: Map<string, Department> = new Map();
    managementDepartments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const activeCategory = categorySlug ?? "";

  const filtered: Department[] = useMemo(() => {
    const q = search.toLowerCase();
    return uniqueDepartments
      .filter((d) =>
        activeCategory ? d.category === activeCategory || d.relatedCategories?.includes(activeCategory) : true,
      )
      .filter((d) => (pathFilter === "all" ? true : d.pathType === pathFilter))
      .filter((d) => (entryFilter === "all" ? true : d.entryLevel === entryFilter))
      .filter((d) => (modeFilter === "all" ? true : d.deliveryMode === modeFilter))
      .filter((d) => (q ? d.name.toLowerCase().includes(q) || d.overview.toLowerCase().includes(q) : true))
      .sort(sortDepartments(sort));
  }, [activeCategory, entryFilter, modeFilter, pathFilter, search, sort, uniqueDepartments]);

  const categoryCount = (id: string) =>
    uniqueDepartments.filter((d) => d.category === id || d.relatedCategories?.includes(id)).length;

  const pathTypes = uniqueOf<NonNullable<Department["pathType"]>>(uniqueDepartments.map((d) => d.pathType));
  const entryLevels = uniqueOf<NonNullable<Department["entryLevel"]>>(uniqueDepartments.map((d) => d.entryLevel));
  const deliveryModes = uniqueOf<NonNullable<Department["deliveryMode"]>>(uniqueDepartments.map((d) => d.deliveryMode));

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Management Courses After 12th | BBA Tracks, Integrated MBA, Business Careers"
        description="Review business, marketing, finance, and HR pathways—eligibility, key skills, internships, and leadership roles after 12th."
        canonicalPath="/stream/management"
      />
      <SectionHeader
        eyebrow="Management Stream"
        title="Find your business & management pathway"
        subtitle="Filter by category, path type, entry level, or delivery mode. Open concise details for every program."
      />

      <div className="glass-panel rounded-2xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-gray-500">Categories</span>
          <Button
            variant={!activeCategory ? "primary" : "ghost"}
            onClick={() => navigate("/stream/management")}
            className="text-xs px-3 rounded-full"
          >
            All
          </Button>
          {managementCategories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={activeCategory === cat.id ? "primary" : "ghost"}
              className={cn("text-xs px-3 rounded-full", activeCategory === cat.id ? "ring-1 ring-black" : "")}
              onClick={() =>
                activeCategory === cat.id
                  ? navigate("/stream/management")
                  : navigate(`/stream/management/category/${cat.id}`)
              }
            >
              {cat.title.split(" ")[0]}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs uppercase tracking-wide text-gray-500">Search & Sort</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search management course"
            className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-10 rounded-full border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="trending">Trending first</option>
            <option value="az">A - Z</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-gray-500">Path type</span>
          <button
            onClick={() => setPathFilter("all")}
            className={cn(
              "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
              pathFilter === "all" ? "border-primary/40 bg-primary/10 text-primary" : "",
            )}
          >
            All
          </button>
          {pathTypes.map((pt) => (
            <button
              key={pt}
              onClick={() => setPathFilter(pt)}
              className={cn(
                "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
                pathFilter === pt ? "border-primary/40 bg-primary/10 text-primary" : "",
              )}
            >
              {pathTypeLabels[pt] ?? pt}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-gray-500">Entry level</span>
          <button
            onClick={() => setEntryFilter("all")}
            className={cn(
              "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
              entryFilter === "all" ? "border-primary/40 bg-primary/10 text-primary" : "",
            )}
          >
            All
          </button>
          {entryLevels.map((el) => (
            <button
              key={el}
              onClick={() => setEntryFilter(el)}
              className={cn(
                "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
                entryFilter === el ? "border-primary/40 bg-primary/10 text-primary" : "",
              )}
            >
              {entryLabels[el] ?? el}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-gray-500">Delivery mode</span>
          <button
            onClick={() => setModeFilter("all")}
            className={cn(
              "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
              modeFilter === "all" ? "border-primary/40 bg-primary/10 text-primary" : "",
            )}
          >
            All
          </button>
          {deliveryModes.map((dm) => (
            <button
              key={dm}
              onClick={() => setModeFilter(dm)}
              className={cn(
                "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
                modeFilter === dm ? "border-primary/40 bg-primary/10 text-primary" : "",
              )}
            >
              {dm}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {managementCategories.map((cat) => (
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
                {catIcon[cat.id] ?? <Briefcase size={18} />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                <div className="text-xs text-gray-600">{categoryCount(cat.id)} courses</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">{cat.description}</div>
            <div className="flex items-center gap-2">
              <Badge className="text-[11px] border-white/30 bg-gray-100 text-gray-900 px-2 py-1">
                {categoryCount(cat.id)} paths
              </Badge>
              <Button
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                onClick={() => navigate(`/stream/management/category/${cat.id}`)}
                className="text-xs px-3 rounded-full"
              >
                {activeCategory === cat.id ? "Selected" : "Explore"}
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
                {dept.pathType ? (
                  <Badge className={cn("px-2 py-1", pathTone[dept.pathType])}>
                    {pathTypeLabels[dept.pathType] ?? dept.pathType}
                  </Badge>
                ) : null}
                {dept.entryLevel ? (
                  <Badge className={cn("px-2 py-1", entryTone[dept.entryLevel])}>
                    {entryLabels[dept.entryLevel] ?? dept.entryLevel}
                  </Badge>
                ) : null}
                {dept.deliveryMode && dept.deliveryMode !== "full-time" ? (
                  <Badge className={cn("px-2 py-1", modeTone[dept.deliveryMode] ?? "border-primary/30 bg-primary/15 text-primary")}>
                    {dept.deliveryMode}
                  </Badge>
                ) : null}
                {dept.trendingLevel === "high" && (
                  <span className="inline-flex items-center gap-1 text-[11px] rounded-full bg-primary/20 text-primary px-2 py-1 border border-primary/30">
                    <Zap size={12} /> Trending
                  </span>
                )}
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
                  {dept.futureScope.split(".")[0] || "Future-ready"}
                </Badge>
              ) : null}
              {dept.trendingLevel === "high" ? (
                <Badge className="border-primary/30 bg-primary/15 text-primary">High demand</Badge>
              ) : null}
              {dept.deliveryMode && dept.deliveryMode !== "full-time" ? (
                <Badge className={cn("border-white/20 bg-gray-50 text-gray-800", modeTone[dept.deliveryMode])}>
                  {dept.deliveryMode}
                </Badge>
              ) : null}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="glass-panel rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
            No management paths match your filters. Try another category, path type, entry level, or delivery mode.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementStreamPage;
