import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { governmentCategories } from "../data/governmentCategories";
import { governmentDepartments } from "../data/governmentDepartments";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Seo } from "../components/Seo";
import { cn } from "../utils/cn";
import type { Department } from "../types/content";
import {
  Shield,
  Landmark,
  Gavel,
  GraduationCap,
  BadgeCheck,
  Building2,
  Banknote,
  Network,
  Globe2,
  ClipboardList,
  Leaf,
  Cpu,
  HeartPulse,
  Clock3,
  Flame,
  Filter,
  Undo2,
} from "lucide-react";

type Sort = "trending" | "az";

const pathTypeLabels: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  "exam-pathway": "Exam Path",
  "government-job": "Govt Job",
  "service-path": "Service",
  "administrative-path": "Admin",
  "defence-path": "Defence",
  "teaching-path": "Teaching",
  "judicial-path": "Judicial",
  "healthcare-path": "Healthcare",
  "technical-path": "Technical",
  "research-path": "Research",
};

const pathTone: Partial<Record<NonNullable<Department["pathType"]>, string>> = {
  "exam-pathway": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "government-job": "border-emerald-300 bg-emerald-100 text-emerald-800",
  "service-path": "border-sky-300/50 bg-sky-500/15 text-sky-50",
  "administrative-path": "border-violet-300/50 bg-violet-500/15 text-violet-50",
  "defence-path": "border-red-300/50 bg-red-500/15 text-red-50",
  "technical-path": "border-cyan-300/50 bg-cyan-500/15 text-cyan-50",
  "judicial-path": "border-amber-300 bg-amber-100 text-amber-800",
  "healthcare-path": "border-rose-300/50 bg-rose-500/15 text-rose-50",
  "research-path": "border-blue-300/50 bg-blue-500/15 text-blue-50",
};

const entryLabels: Record<NonNullable<Department["entryLevel"]>, string> = {
  "after-10th": "After 10th",
  "after-12th": "After 12th",
  "after-10th-or-12th": "After 10th/12th",
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

const entryTone: Record<NonNullable<Department["entryLevel"]>, string> = {
  "after-10th": "border-amber-300 bg-amber-100 text-amber-800",
  "after-12th": "border-emerald-300 bg-emerald-100 text-emerald-800",
  "after-10th-or-12th": "border-cyan-300/50 bg-cyan-500/15 text-cyan-50",
  "after-graduation": "border-slate-300 bg-slate-200/10 text-slate-800",
  "after-diploma": "border-teal-300/50 bg-teal-500/15 text-teal-50",
  "after-degree": "border-green-300/50 bg-green-500/15 text-green-50",
  "after-postgraduation": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "multiple-entry-levels": "border-slate-300 bg-slate-100 text-slate-800",
  "postgraduate-specialization": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "short-term-upskilling": "border-slate-300 bg-slate-200/10 text-slate-800",
  "working-professional": "border-fuchsia-300/50 bg-fuchsia-500/15 text-fuchsia-50",
  "flexible-entry": "border-purple-300/50 bg-purple-500/15 text-purple-50",
};

const serviceLabels: Record<NonNullable<Department["serviceType"]>, string> = {
  "central-government": "Central",
  "state-government": "State",
  defence: "Defence",
  "banking-public-sector": "Banking/PSU",
  judiciary: "Judiciary",
  education: "Education",
  "medical-public-sector": "Medical",
  "research-and-science": "Research",
  "technical-government": "Technical",
  "rural-development": "Rural Dev",
  "public-administration": "Administration",
};

const serviceTone: Partial<Record<NonNullable<Department["serviceType"]>, string>> = {
  "central-government": "border-indigo-300 bg-indigo-100 text-indigo-800",
  "state-government": "border-emerald-300 bg-emerald-100 text-emerald-800",
  defence: "border-red-300/50 bg-red-500/15 text-red-50",
  "banking-public-sector": "border-amber-300 bg-amber-100 text-amber-800",
  judiciary: "border-slate-300 bg-slate-100 text-slate-800",
  education: "border-amber-300 bg-amber-400/15 text-amber-800",
  "medical-public-sector": "border-rose-300/50 bg-rose-500/15 text-rose-50",
  "research-and-science": "border-blue-300/50 bg-blue-500/15 text-blue-50",
  "technical-government": "border-cyan-300/50 bg-cyan-500/15 text-cyan-50",
  "rural-development": "border-lime-300/50 bg-lime-500/15 text-lime-50",
  "public-administration": "border-violet-300/50 bg-violet-500/15 text-violet-50",
};

const catIcon: Record<string, ReactNode> = {
  "civil-services": <Shield size={18} />,
  "police-defence": <BadgeCheck size={18} />,
  "banking-finance": <Banknote size={18} />,
  railways: <Network size={18} />,
  ssc: <ClipboardList size={18} />,
  "teaching-education": <GraduationCap size={18} />,
  "medical-govt": <HeartPulse size={18} />,
  "law-judiciary": <Gavel size={18} />,
  "agri-rural-govt": <Leaf size={18} />,
  "research-science": <Globe2 size={18} />,
  "it-technical-govt": <Cpu size={18} />,
  "other-govt": <Building2 size={18} />,
};

const catShade: Record<string, string> = {
  "civil-services": "from-indigo-500/25 to-violet-500/10",
  "police-defence": "from-sky-500/25 to-blue-500/10",
  "banking-finance": "from-emerald-500/25 to-teal-500/10",
  railways: "from-cyan-500/25 to-blue-500/10",
  ssc: "from-purple-500/25 to-fuchsia-500/10",
  "teaching-education": "from-amber-400/25 to-orange-400/10",
  "medical-govt": "from-rose-500/25 to-pink-500/10",
  "law-judiciary": "from-slate-500/25 to-slate-500/10",
  "agri-rural-govt": "from-green-500/25 to-lime-500/10",
  "research-science": "from-blue-400/25 to-indigo-500/10",
  "it-technical-govt": "from-cyan-500/25 to-emerald-500/10",
  "other-govt": "from-slate-500/25 to-slate-400/10",
};

const sortDepartments = (sort: Sort) => (a: Department, b: Department) => {
  if (sort === "az") return a.name.localeCompare(b.name);
  const score = (d: Department) => (d.trendingLevel === "high" ? 2 : d.trendingLevel === "medium" ? 1 : 0);
  return score(b) - score(a) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
};

const GovernmentStreamPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("trending");
  const [pathFilter, setPathFilter] = useState<Department["pathType"] | "all">("all");
  const [entryFilter, setEntryFilter] = useState<Department["entryLevel"] | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<Department["serviceType"] | "all">("all");

  const uniqueDepartments: Department[] = useMemo(() => {
    const map = new Map<string, Department>();
    governmentDepartments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const countsByCategory = useMemo(() => {
    const out: Record<string, number> = {};
    uniqueDepartments.forEach((d) => {
      out[d.category ?? ""] = (out[d.category ?? ""] ?? 0) + 1;
    });
    return out;
  }, [uniqueDepartments]);

  const filtered = useMemo(() => {
    return uniqueDepartments
      .filter((dept) => !categorySlug || dept.category === categorySlug)
      .filter((dept) => (pathFilter === "all" ? true : dept.pathType === pathFilter))
      .filter((dept) => (entryFilter === "all" ? true : dept.entryLevel === entryFilter))
      .filter((dept) => (serviceFilter === "all" ? true : dept.serviceType === serviceFilter))
      .filter((dept) => {
        const q = search.toLowerCase();
        return (
          dept.name.toLowerCase().includes(q) ||
          dept.overview.toLowerCase().includes(q) ||
          (dept.category ?? "").toLowerCase().includes(q)
        );
      })
      .sort(sortDepartments(sort));
  }, [uniqueDepartments, categorySlug, pathFilter, entryFilter, serviceFilter, search, sort]);

  return (
    <>
      <Seo
        title="Government Career Paths in India | Exams, Eligibility, Roles & Preparation"
        description="See UPSC, TNPSC, SSC, Railways, Banking, Defence, Teaching, Judiciary, and technical routes with exams, eligibility, preparation, and growth."
        canonicalPath="/stream/government-career-paths"
      />
      <div className="page-container space-y-10 overflow-x-hidden">
        <SectionHeader
          eyebrow="Government Careers"
          title="Government Career Paths & Exams"
            subtitle="Browse civil services, defence, banking, railways, SSC, teaching, medical and more. Filter by entry level, path type, or service."
          />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {governmentCategories.map((cat) => (
            <div key={cat.id} role="button" onClick={() => navigate(`/stream/government-career-paths/category/${cat.id}`)} className="outline-none">
              <Card
                className={cn(
                  "border border-white/8 bg-gradient-to-br text-slate-800 transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/15",
                  catShade[cat.id] ?? "from-slate-600/20 to-slate-700/10",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-indigo-100 shadow-inner">
                    {catIcon[cat.id] ?? <Landmark size={18} />}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-indigo-200/80">Category</p>
                    <h3 className="text-lg font-semibold">{cat.title}</h3>
                    <p className="mt-1 text-sm text-slate-200/80 line-clamp-2">{cat.description}</p>
                    <p className="mt-2 text-[11px] text-indigo-100/80">
                      {countsByCategory[cat.id] ?? 0} paths
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <input
            className="w-full sm:max-w-sm rounded-xl border border-gray-200 bg-slate-900/60 px-4 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            placeholder="Search exam, service or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSort(sort === "trending" ? "az" : "trending")}>
              Sort: {sort === "trending" ? "Trending" : "A-Z"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/stream/government-career-paths")}>
              <Undo2 size={14} className="mr-1" />
              Reset category
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPathFilter("all");
                setEntryFilter("all");
                setServiceFilter("all");
              }}
            >
              <Filter size={14} className="mr-1" />
              Clear filters
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "exam-pathway", "government-job", "service-path", "defence-path", "technical-path", "judicial-path", "teaching-path", "healthcare-path", "research-path", "administrative-path"].map((p) => (
            <Button
              key={p}
              size="sm"
              variant={pathFilter === p ? "primary" : "ghost"}
              onClick={() => setPathFilter(p as Department["pathType"] | "all")}
              className="rounded-full"
            >
              {p === "all" ? "All paths" : pathTypeLabels[p as NonNullable<Department["pathType"]>] ?? p}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "after-10th", "after-12th", "after-10th-or-12th", "after-diploma", "after-degree", "after-graduation", "after-postgraduation", "multiple-entry-levels", "postgraduate-specialization", "working-professional", "short-term-upskilling", "flexible-entry"] as const).map((el) => (
            <Button
              key={el}
              size="xs"
              variant={entryFilter === el ? "primary" : "ghost"}
              className="rounded-full"
              onClick={() => setEntryFilter(el === "all" ? "all" : (el as Department["entryLevel"]))}
            >
              {el === "all" ? "All entry levels" : entryLabels[el as NonNullable<Department["entryLevel"]>]}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "central-government", "state-government", "defence", "banking-public-sector", "judiciary", "education", "medical-public-sector", "research-and-science", "technical-government", "rural-development", "public-administration"] as const).map((sv) => (
            <Button
              key={sv}
              size="xs"
              variant={serviceFilter === sv ? "primary" : "ghost"}
              onClick={() => setServiceFilter(sv === "all" ? "all" : (sv as Department["serviceType"]))}
              className="rounded-full"
            >
              {sv === "all" ? "All services" : serviceLabels[sv as NonNullable<Department["serviceType"]>]}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept) => (
            <Card key={dept.id} className="border border-gray-200 bg-slate-900/60 shadow-lg shadow-primary/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-indigo-200/80">{dept.category?.replace(/-/g, " ")}</p>
                  <h3 className="text-xl font-semibold text-slate-800">{dept.name}</h3>
                  <p className="mt-1 text-sm text-slate-200/80 line-clamp-3">{dept.overview}</p>
                </div>
                {dept.trendingLevel === "high" && (
                  <Badge className="bg-amber-500/20 text-amber-800 border-amber-300 flex items-center gap-1">
                    <Flame size={12} /> Trending
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {dept.pathType && (
                  <Badge className={cn("px-2 py-1 text-[11px]", pathTone[dept.pathType] ?? "border-indigo-300/40 bg-indigo-100 text-indigo-100")}>
                    {pathTypeLabels[dept.pathType] ?? dept.pathType}
                  </Badge>
                )}
                {dept.entryLevel && (
                  <Badge className={cn("px-2 py-1 text-[11px]", entryTone[dept.entryLevel])}>{entryLabels[dept.entryLevel]}</Badge>
                )}
                {dept.serviceType && (
                  <Badge className={cn("px-2 py-1 text-[11px]", serviceTone[dept.serviceType] ?? "border-cyan-300/40 bg-cyan-500/10 text-cyan-50")}>
                    {serviceLabels[dept.serviceType]}
                  </Badge>
                )}
                {dept.qualificationRequired && (
                  <Badge className="border-slate-300/30 bg-slate-700/40 text-slate-100 px-2 py-1 text-[11px]">
                    {dept.qualificationRequired}
                  </Badge>
                )}
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-200/90">
                {dept.durationToPrepare && <div className="flex items-center gap-2 text-amber-800"><Clock3 size={14} /> {dept.durationToPrepare}</div>}
                {dept.entranceExams && dept.entranceExams.length > 0 && <div className="text-xs text-slate-300">Exams: {dept.entranceExams.join(", ")}</div>}
                {dept.studyRoutes && dept.studyRoutes.length > 0 && <div className="text-xs text-slate-300">Study routes: {dept.studyRoutes.join(", ")}</div>}
              </div>

              <div className="mt-4 flex justify-between">
                <Button size="sm" onClick={() => navigate(`/department/${dept.slug ?? dept.id}`)}>
                  View details
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate(`/department/${dept.slug ?? dept.id}`)}>
                  Prepare
                </Button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <Card className="border border-gray-200 bg-slate-900/70 p-4 text-sm text-slate-200/80">No government paths match your filters.</Card>}
        </div>
      </div>
    </>
  );
};

export default GovernmentStreamPage;
