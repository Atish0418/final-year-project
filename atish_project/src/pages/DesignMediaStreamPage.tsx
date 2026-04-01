import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { designMediaCategories } from "../data/designMediaCategories";
import { designMediaDepartments } from "../data/designMediaDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import type { Department } from "../types/content";
import { Badge } from "../components/ui/Badge";
import {
  Palette,
  PenTool,
  Scissors,
  LayoutTemplate,
  Clapperboard,
  Camera,
  Megaphone,
  Radio,
  Gamepad2,
  Music,
  Zap,
  Clock3,
} from "lucide-react";

type Sort = "trending" | "az";

const pathTypeLabels: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  degree: "Degree",
  diploma: "Diploma",
  certificate: "Certificate",
  specialization: "Specialization",
  "creative-track": "Creative Track",
  "design-track": "Design Track",
  "media-track": "Media Track",
  "interactive-media": "Interactive Media",
};

const catIcon: Record<string, ReactNode> = {
  "graphic-visual": <Palette size={18} />,
  "fashion-textile": <Scissors size={18} />,
  "interior-product": <LayoutTemplate size={18} />,
  "animation-vfx": <PenTool size={18} />,
  "film-media": <Clapperboard size={18} />,
  "photo-digital": <Camera size={18} />,
  "advertising-communication": <Megaphone size={18} />,
  "journalism-masscom": <Radio size={18} />,
  "game-interactive": <Gamepad2 size={18} />,
  "fine-performing": <Music size={18} />,
  "diploma-short-design": <PenTool size={18} />,
};

const catShade: Record<string, string> = {
  "graphic-visual": "from-purple-500/20 to-indigo-400/10",
  "fashion-textile": "from-pink-500/20 to-rose-400/10",
  "interior-product": "from-amber-500/20 to-orange-400/10",
  "animation-vfx": "from-blue-500/20 to-cyan-400/10",
  "film-media": "from-slate-500/20 to-slate-300/10",
  "photo-digital": "from-emerald-500/20 to-teal-400/10",
  "advertising-communication": "from-lime-500/20 to-emerald-400/10",
  "journalism-masscom": "from-cyan-500/20 to-sky-400/10",
  "game-interactive": "from-violet-500/20 to-fuchsia-400/10",
  "fine-performing": "from-orange-400/20 to-amber-300/10",
  "diploma-short-design": "from-slate-500/20 to-slate-300/10",
};

const pathTypeTone: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  degree: "border-emerald-300 bg-emerald-400/15 text-emerald-800",
  diploma: "border-amber-300 bg-amber-400/15 text-amber-800",
  certificate: "border-slate-300/60 bg-slate-200/10 text-slate-800",
  specialization: "border-indigo-300 bg-indigo-400/15 text-indigo-800",
  "design-track": "border-blue-300/50 bg-blue-400/15 text-blue-50",
  "media-track": "border-cyan-300/50 bg-cyan-400/15 text-cyan-50",
  "creative-track": "border-pink-300/50 bg-pink-400/15 text-pink-50",
  "interactive-media": "border-violet-300/50 bg-violet-400/15 text-violet-50",
};

const sortDepartments = (sort: Sort) => (a: Department, b: Department) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const score = (d: Department) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return score(b) - score(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const DesignMediaStreamPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");
  const [pathFilter, setPathFilter] = useState<Department["pathType"] | "all">("all");

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, Department>();
    designMediaDepartments.forEach((d) => {
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
      .filter((d) => (q ? d.name.toLowerCase().includes(q) || d.overview.toLowerCase().includes(q) : true))
      .sort(sortDepartments(sort));
  }, [activeCategory, pathFilter, search, sort, uniqueDepartments]);

  const categoryCount = (id: string) =>
    uniqueDepartments.filter((d) => d.category === id || d.relatedCategories?.includes(id)).length;

  const pathTypes = Array.from(
    new Set(uniqueDepartments.map((d) => d.pathType).filter(Boolean) as NonNullable<Department["pathType"]>[]),
  );

  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Design & Media Courses After 12th | UI/UX, Animation, Fashion, Film & VFX"
        description="Compare creative programs with portfolio tips, software tools, subjects, and career tracks in product design, media, fashion, film, and VFX."
        canonicalPath="/stream/design-media"
      />
      <SectionHeader
        eyebrow="Design & Media Stream"
        title="Discover design, media, animation, film, and game careers"
        subtitle="Filter by category or path type, search quickly, and open concise course details."
      />

      <div className="glass-panel rounded-2xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-wide text-gray-500">Categories</span>
          <Button
            variant={!activeCategory ? "primary" : "ghost"}
            onClick={() => navigate("/stream/design-media")}
            className="text-xs px-3 rounded-full"
          >
            All
          </Button>
          {designMediaCategories.map((cat) => (
            <Button
              key={cat.id}
              size="sm"
              variant={activeCategory === cat.id ? "primary" : "ghost"}
              className={cn("text-xs px-3 rounded-full", activeCategory === cat.id ? "ring-1 ring-black" : "")}
              onClick={() =>
                activeCategory === cat.id
                  ? navigate("/stream/design-media")
                  : navigate(`/stream/design-media/category/${cat.id}`)
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
            placeholder="Search design / media course"
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
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPathFilter("all")}
              className={cn(
                "px-3 py-2 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-800 transition hover:border-primary/40",
                pathFilter === "all" ? "border-primary/40 bg-primary/10 text-primary" : "",
              )}
            >
              All paths
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
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {designMediaCategories.map((cat) => (
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
                {catIcon[cat.id] ?? <Palette size={18} />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{cat.title}</div>
                <div className="text-xs text-gray-600">{categoryCount(cat.id)} courses</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">{cat.description}</div>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="text-[11px] border-white/30 bg-gray-100 text-gray-900 px-2 py-1">
                {categoryCount(cat.id)} paths
              </Badge>
              <Button
                variant={activeCategory === cat.id ? "primary" : "ghost"}
                onClick={() => navigate(`/stream/design-media/category/${cat.id}`)}
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
                  <Badge className={cn("px-2 py-1", pathTypeTone[dept.pathType])}>{pathTypeLabels[dept.pathType]}</Badge>
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
            No design/media paths match your filters. Try a different category or path type.
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignMediaStreamPage;
