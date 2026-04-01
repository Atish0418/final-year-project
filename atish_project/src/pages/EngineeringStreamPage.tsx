import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { engineeringCategories } from "../data/engineeringCategories";
import { engineeringDepartments } from "../data/engineeringDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import type { Department } from "../types/content";
import {
  Aperture,
  Cpu,
  Cog,
  Building2,
  Zap,
  FlaskConical,
  HeartPulse,
  Plane,
  PenTool,
  Bus,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";

type Sort = "trending" | "az";

const sortDepartments = (sort: Sort) => (a: any, b: any) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const trendScore = (d: any) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return trendScore(b) - trendScore(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const categoryIcons: Record<string, ReactNode> = {
  "core-engineering": <Cog size={18} />,
  "computer-it": <Cpu size={18} />,
  "mechanical-automation": <Aperture size={18} />,
  "civil-infrastructure": <Building2 size={18} />,
  "electrical-electronics": <Zap size={18} />,
  "chemical-science": <FlaskConical size={18} />,
  "bio-medical": <HeartPulse size={18} />,
  "aero-marine": <Plane size={18} />,
  "architecture-design": <PenTool size={18} />,
  "transport-logistics": <Bus size={18} />,
  "emerging-future": <Sparkles size={18} />,
  "specialized": <Layers size={18} />,
};

const categoryShades: Record<string, string> = {
  "core-engineering": "from-sky-500/25 to-blue-500/15",
  "computer-it": "from-cyan-500/25 to-emerald-400/15",
  "mechanical-automation": "from-amber-500/20 to-orange-500/10",
  "civil-infrastructure": "from-indigo-500/20 to-slate-500/10",
  "electrical-electronics": "from-fuchsia-500/25 to-purple-500/15",
  "chemical-science": "from-teal-500/25 to-emerald-400/15",
  "bio-medical": "from-rose-500/25 to-pink-500/15",
  "aero-marine": "from-blue-500/25 to-cyan-400/15",
  "architecture-design": "from-lime-500/20 to-emerald-400/10",
  "transport-logistics": "from-amber-400/25 to-yellow-300/10",
  "emerging-future": "from-violet-500/25 to-fuchsia-400/15",
  "specialized": "from-slate-500/20 to-slate-300/10",
};

const degreeLabels: Record<NonNullable<Department["degreeType"]>, string> = {
  "be-btech": "B.E./B.Tech",
  barch: "B.Arch",
  "specialized-engineering": "Specialized",
};

const EngineeringStreamPage = () => {
  const { categorySlug } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");
  const [degreeFilter, setDegreeFilter] = useState<Department["degreeType"] | "all">("all");
  const navigate = useNavigate();

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, Department>();
    engineeringDepartments.forEach((d) => {
      if (!map.has(d.id)) {
        map.set(d.id, d);
      }
    });
    return Array.from(map.values());
  }, []);

  const activeCategory = categorySlug ?? "";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return uniqueDepartments
      .filter((d) => (activeCategory ? d.category === activeCategory : true))
      .filter((d) => (degreeFilter === "all" ? true : d.degreeType === degreeFilter))
      .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
      .sort(sortDepartments(sort));
  }, [activeCategory, search, sort, degreeFilter, uniqueDepartments]);

  const categoryCount = (id: string) => uniqueDepartments.filter((d) => d.category === id).length;

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Engineering Courses After 12th | Branch Comparisons, Eligibility & Jobs"
        description="Compare CSE, IT, Mechanical, Civil, ECE, AI, Robotics, Biotechnology and more—eligibility, duration, subjects, and future job scope after 12th."
        canonicalPath="/stream/engineering"
      />
      <SectionHeader
        eyebrow="Engineering Stream"
        title="Explore every engineering branch after 12th"
        subtitle="Search, filter, and compare engineering departments with simple descriptions."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {engineeringCategories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 relative overflow-hidden bg-gradient-to-br",
              categoryShades[cat.id] ?? "bg-white",
              activeCategory === cat.id ? "ring-1 ring-black shadow-sm" : "shadow-sm",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 backdrop-blur-sm flex items-center justify-center text-primary">
                {categoryIcons[cat.id] ?? <Sparkles size={18} />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                <div className="text-xs text-gray-600">{categoryCount(cat.id)} departments</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">{cat.description}</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                onClick={() => navigate(`/stream/engineering/category/${cat.id}`)}
                className="text-xs px-3"
              >
                {activeCategory === cat.id ? "Selected" : "Explore"}
              </Button>
              <Button
                variant="ghost"
                className="text-xs px-3"
                onClick={() => navigate(`/stream/engineering/category/${cat.id}`)}
              >
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
            onClick={() => navigate("/stream/engineering")}
            className="text-xs px-3"
          >
            All categories
          </Button>
          <div className="flex flex-wrap gap-2">
            {engineeringCategories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                className={cn("text-xs px-3", activeCategory === cat.id ? "ring-1 ring-black" : "")}
                onClick={() =>
                  activeCategory === cat.id ? navigate("/stream/engineering") : navigate(`/stream/engineering/category/${cat.id}`)
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
            placeholder="Search department"
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
          <div className="flex flex-wrap gap-2">
            {(["all", "be-btech", "barch", "specialized-engineering"] as const).map((deg) => (
              <Button
                key={deg}
                size="sm"
                variant={degreeFilter === deg ? "primary" : "ghost"}
                className="rounded-full text-xs px-3"
                onClick={() => setDegreeFilter(deg === "all" ? "all" : deg)}
              >
                {deg === "all" ? "All degrees" : degreeLabels[deg as NonNullable<Department["degreeType"]>]}
              </Button>
            ))}
          </div>
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
                  <Badge className="bg-amber-500/20 text-amber-800 border-amber-300 flex items-center gap-1">
                    <Flame size={12} />
                    Trending
                  </Badge>
                )}
                <Button as="a" href={`#/department/${dept.slug ?? dept.id}`} variant="ghost" className="text-xs px-3">
                  View details
                </Button>
              </div>
            }
            className="h-full"
          >
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              {dept.degreeType && (
                <Badge className="border-indigo-300 bg-indigo-100 text-indigo-800">
                  {degreeLabels[dept.degreeType] ?? dept.degreeType}
                </Badge>
              )}
              <Badge className="border-gray-200 bg-gray-50 text-gray-900">Duration: {dept.duration}</Badge>
              <Badge className="border-emerald-300 bg-emerald-100 text-emerald-800">
                Scope: {dept.futureScope.split(".")[0]}
              </Badge>
              {dept.trendingLevel ? (
                <Badge
                  className={cn(
                    "px-2 py-1 text-[11px]",
                    dept.trendingLevel === "high"
                      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                      : dept.trendingLevel === "medium"
                        ? "border-amber-300 bg-amber-100 text-amber-800"
                        : "border-slate-300 bg-slate-100 text-slate-800",
                  )}
                >
                  {dept.trendingLevel === "high" ? "High demand" : dept.trendingLevel === "medium" ? "Steady demand" : "Niche"}
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {dept.keySubjects.slice(0, 4).map((subj) => (
                <span key={subj} className="text-[11px] rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200">
                  {subj}
                </span>
              ))}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="glass-panel rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
            No departments match your search. Try a different keyword.
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineeringStreamPage;
