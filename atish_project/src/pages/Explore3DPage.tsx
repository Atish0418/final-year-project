import { useMemo, useState } from "react";
import { labs } from "../data/labs";
import { departments } from "../data/departments";
import { SectionHeader } from "../components/ui/SectionHeader";
import CareerTreeScene from "../3d/CareerTreeScene";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useLanguageStore } from "../store/useLanguageStore";
import { localizeStream, localizeDepartment } from "../utils/i18n";
import { Seo } from "../components/Seo";

const Explore3DPage = () => {
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const [simpleMode, setSimpleMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const lang = useLanguageStore((s) => s.lang);

  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, (typeof departments)[number]>();
    departments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);

  const selectedStream = useMemo(
    () => (selectedStreamId ? localizeStream(selectedStreamId, lang) : null),
    [selectedStreamId, lang],
  );

  return (
    <div className="page-container py-12 space-y-8">
      <Seo title="Explore 3D | FuturePath 3D" description="Navigate the 3D career tree and explore streams and departments visually." />
      <SectionHeader
        eyebrow="Explore 3D"
        title="Prototype, preview, and ship immersive learning spaces."
        subtitle="Swap this placeholder with React Three Fiber canvases and Firebase-backed collaboration."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="text-xs" onClick={() => setSelectedStreamId(null)}>
              Reset selection
            </Button>
            <Button variant="ghost" className="text-xs" onClick={() => setSimpleMode((s) => !s)}>
              {simpleMode ? "Switch to Full Mode" : "Simple Mode"}
            </Button>
            <Button variant="ghost" className="text-xs" onClick={() => setAutoRotate((s) => !s)}>
              {autoRotate ? "Stop rotate" : "Auto rotate"}
            </Button>
          </div>
          <CareerTreeScene
            onSelect={(id) => setSelectedStreamId(id)}
            selected={selectedStreamId}
            simpleMode={simpleMode}
            autoRotate={autoRotate}
          />
        </div>

        <motion.div
          className="glass-panel rounded-2xl border border-gray-200 p-5 space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="text-lg font-semibold text-gray-900">Stream info</h3>
          {selectedStream ? (
            <>
              <div className="text-sm text-gray-600">{selectedStream.summary}</div>
              <div className="flex flex-wrap gap-2">
                {selectedStream.focus.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button as="a" href={`#/departments?stream=${selectedStream.id}`} className="text-sm w-fit">
                View all departments
              </Button>
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Departments in this stream</h4>
                <div className="flex flex-col gap-2">
                  {uniqueDepartments
                    .filter((d) => d.streamId === selectedStream.id)
                    .map((d) => localizeDepartment(d.id, lang))
                    .filter((d) => d !== null)
                    .slice(0, 5)
                    .map((dept) => (
                      <Button
                        key={dept.id}
                        as="a"
                        href={`#/department/${dept.slug ?? dept.id}`}
                        variant="ghost"
                        className="justify-between text-xs"
                      >
                        <span>{dept.name}</span>
                        <span className="text-gray-500">→</span>
                      </Button>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              Click a node in the 3D tree to see stream details. Use Simple Mode if your device struggles.
            </div>
          )}
          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Labs snapshot</h4>
            <div className="grid gap-3">
              {labs.slice(0, 3).map((lab) => (
                <div key={lab.id} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                  <div className="text-sm text-gray-900">{lab.title}</div>
                  <div className="text-xs text-gray-500">{lab.description}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {labs.map((lab) => (
          <div key={lab.id} className="glass-panel rounded-xl border border-gray-200 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-primary">{lab.readiness}</div>
            <h3 className="text-lg font-semibold text-gray-900">{lab.title}</h3>
            <p className="text-sm text-gray-600">{lab.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore3DPage;

