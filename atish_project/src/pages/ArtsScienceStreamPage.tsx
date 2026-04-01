import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { artsScienceCategories } from "../data/artsScienceCategories";
import { artsScienceDepartments } from "../data/artsScienceDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import type { Department } from "../types/content";
import { BookOpen, Globe, Layers, Sparkles, Palette, Laptop, FlaskConical, Briefcase, Landmark } from "lucide-react";

type Sort = "trending" | "az";

const sortDepartments = (sort: Sort) => (a: Department, b: Department) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const score = (d: Department) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return score(b) - score(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const catIcon: Record<string, ReactNode> = {
  "arts-humanities": <BookOpen size={18} />,
  "pure-science": <FlaskConical size={18} />,
  "computer-it": <Laptop size={18} />,
  "life-science-medical": <Globe size={18} />,
  "commerce-management": <Briefcase size={18} />,
  "creative-design": <Palette size={18} />,
  "hotel-service": <Layers size={18} />,
  "law-legal": <Landmark size={18} />,
  "social-development": <Sparkles size={18} />,
};

const catShade: Record<string, string> = {
  "arts-humanities": "from-amber-500/20 to-orange-500/10",
  "pure-science": "from-cyan-500/25 to-blue-500/15",
  "computer-it": "from-indigo-500/25 to-slate-500/10",
  "life-science-medical": "from-emerald-500/20 to-teal-400/10",
  "commerce-management": "from-violet-500/20 to-purple-400/10",
  "creative-design": "from-pink-500/20 to-rose-400/10",
  "hotel-service": "from-yellow-400/20 to-amber-300/10",
  "law-legal": "from-slate-500/25 to-slate-300/10",
  "social-development": "from-lime-400/20 to-emerald-300/10",
};

const ArtsScienceStreamPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, Department>();
    artsScienceDepartments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const activeCategory = categorySlug ?? "";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return uniqueDepartments
      .filter((d) => (activeCategory ? d.category === activeCategory : true))
      .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
      .sort(sortDepartments(sort));
  }, [activeCategory, search, sort, uniqueDepartments]);

  const categoryCount = (id: string) => uniqueDepartments.filter((d) => d.category === id).length;

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Arts & Science Courses After 12th | BA, BSc, BCA, Psychology & More"
        description="Browse arts and science programs with eligibility, key subjects, career options, and higher studies guidance after 12th."
        canonicalPath="/stream/arts-science"
      />
      <SectionHeader
        eyebrow="Arts & Science Stream"
        title="Discover Arts & Science courses after 12th"
        subtitle="Filter by category, search by course name, and spot trending options quickly."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {artsScienceCategories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 relative overflow-hidden bg-gradient-to-br",
              catShade[cat.id] ?? "bg-white",
              activeCategory === cat.id ? "ring-1 ring-black shadow-sm" : "shadow-sm",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 backdrop-blur-sm flex items-center justify-center text-primary">
                {catIcon[cat.id] ?? <Sparkles size={18} />}
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
                onClick={() => navigate(`/stream/arts-science/category/${cat.id}`)}
                className="text-xs px-3"
              >
                {activeCategory === cat.id ? "Selected" : "Explore"}
              </Button>
              <Button variant="ghost" className="text-xs px-3" onClick={() => navigate(`/stream/arts-science/category/${cat.id}`)}>
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
            onClick={() => navigate("/stream/arts-science")}
            className="text-xs px-3"
          >
            All categories
          </Button>
          <div className="flex flex-wrap gap-2">
            {artsScienceCategories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                className={cn("text-xs px-3", activeCategory === cat.id ? "ring-1 ring-black" : "")}
                onClick={() =>
                  activeCategory === cat.id ? navigate("/stream/arts-science") : navigate(`/stream/arts-science/category/${cat.id}`)
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
                  <span className="text-[11px] rounded-full bg-primary/20 text-primary px-2 py-1 border border-primary/30">Trending</span>
                )}
                {dept.featured && (
                  <span className="text-[11px] rounded-full bg-amber-400/20 text-amber-800 px-2 py-1 border border-amber-300/40">
                    Featured
                  </span>
                )}
                <Button as="a" href={`#/department/${dept.slug ?? dept.id}`} variant="ghost" className="text-xs px-3">
                  View details
                </Button>
              </div>
            }
            className="h-full"
          >
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              <span className="rounded-full bg-gray-50 px-2 py-1 border border-gray-200">Duration: {dept.duration}</span>
              <span className="rounded-full bg-gray-50 px-2 py-1 border border-gray-200">Scope: {dept.futureScope.split(".")[0]}</span>
              {dept.trendingLevel ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 border text-[11px]",
                    dept.trendingLevel === "high"
                      ? "bg-emerald-100 border-emerald-400/40 text-emerald-200"
                      : dept.trendingLevel === "medium"
                        ? "bg-amber-100 border-amber-300 text-amber-200"
                        : "bg-slate-100 border-slate-400/40 text-slate-200",
                  )}
                >
                  {dept.trendingLevel === "high" ? "High demand" : dept.trendingLevel === "medium" ? "Steady demand" : "Niche"}
                </span>
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
            No courses match your search. Try another keyword.
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtsScienceStreamPage;
