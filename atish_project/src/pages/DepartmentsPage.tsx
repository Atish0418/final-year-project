import { useMemo, useState, useDeferredValue } from "react";
import { useLocation } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { streams } from "../data/streams";
import { departments } from "../data/departments";
import { cn } from "../utils/cn";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useLanguageStore } from "../store/useLanguageStore";
import { localizeDepartment, localizeStream } from "../utils/i18n";
import { Seo } from "../components/Seo";

const useQuery = () => new URLSearchParams(useLocation().search);

const DepartmentsPage = () => {
  const query = useQuery();
  const streamFilter = query.get("stream");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const favorites = useFavoritesStore();
  const lang = useLanguageStore((s) => s.lang);

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, (typeof departments)[number]>();
    departments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const localizedDepartments = useMemo(
    () =>
      uniqueDepartments
        .map((d) => localizeDepartment(d.id, lang))
        .filter((d): d is NonNullable<ReturnType<typeof localizeDepartment>> => Boolean(d)),
    [uniqueDepartments, lang],
  );

  const list = useMemo(() => {
    const base = streamFilter
      ? localizedDepartments.filter((dept) => dept.streamId === streamFilter)
      : localizedDepartments;
    if (!deferredSearch) return base;
    return base.filter(
      (d) =>
        d.name.toLowerCase().includes(deferredSearch) ||
        d.overview.toLowerCase().includes(deferredSearch),
    );
  }, [streamFilter, deferredSearch, localizedDepartments]);

  const currentStream = streamFilter ? localizeStream(streamFilter, lang) : undefined;

  return (
    <div className="page-container py-12 space-y-6 relative">
      <Seo
        title="Colleges & Departments in Tamil Nadu | Search by Stream, Type & Location"
        description="Filter colleges and departments across streams; view overviews, duration, eligibility, subjects, and future scope to plan the right course."
        canonicalPath="/colleges"
      />
      <SectionHeader
        eyebrow="Departments"
        title="Deep-dive into courses within each stream"
        subtitle={
          currentStream
            ? `Showing departments under ${currentStream.title}.`
            : "Filter by stream to narrow down departments."
        }
      />

        <div className="glass-panel rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button as="a" href="#/departments" variant={!streamFilter ? "primary" : "ghost"} className="text-xs px-3">
              All
            </Button>
            {streams.map((s) => {
              const ls = localizeStream(s.id, lang)!;
              return (
                <Button
                  key={s.id}
                  as="a"
                  href={`#/departments?stream=${s.id}`}
                  variant={streamFilter === s.id ? "primary" : "ghost"}
                  className="text-xs px-3"
                >
                  {ls.title}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search department"
              className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

      <div className="grid gap-5 md:grid-cols-2">
        {list.map((dept) => (
          <Card
            key={dept.id}
            eyebrow={(dept.streamId || "").toUpperCase()}
            title={dept.name}
            actions={
              <div className="flex gap-2">
                <Button as="a" href={`#/department/${dept.slug ?? dept.id}`} variant="ghost" className="text-xs px-3">
                  View details
                </Button>
                <Button
                  variant={favorites.isSaved(dept.id) ? "outline" : "ghost"}
                  className="text-xs px-3"
                  onClick={() =>
                    favorites.toggle({
                      id: dept.id,
                      type: "department",
                      name: dept.name,
                      description: dept.overview,
                      streamId: dept.streamId,
                    })
                  }
                >
                  {favorites.isSaved(dept.id) ? "Saved" : "Save"}
                </Button>
              </div>
            }
            className="h-full"
          >
            <div className="text-gray-600 text-sm mb-2">{dept.overview}</div>
            <div className="flex flex-wrap gap-2">
              {dept.keySubjects.slice(0, 4).map((subj, idx) => (
                <span
                  key={`${subj}-${idx}`}
                  className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
                >
                  {subj}
                </span>
              ))}
            </div>
            <div className={cn("text-xs text-gray-500")}>Duration: {dept.duration}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsPage;
