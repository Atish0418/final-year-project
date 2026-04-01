import { useMemo, useState } from "react";
import { SectionHeader } from "../components/ui/SectionHeader";
import { departments } from "../data/departments";
import { motion, AnimatePresence } from "framer-motion";
import { Seo } from "../components/Seo";
import Select, { components, type StylesConfig } from "react-select";

const fields = [
  { key: "duration", label: "Duration" },
  { key: "eligibility", label: "Eligibility" },
  { key: "keySubjects", label: "Key subjects" },
  { key: "skillsNeeded", label: "Skills needed" },
  { key: "advantages", label: "Advantages" },
  { key: "disadvantages", label: "Disadvantages" },
  { key: "futureJobs", label: "Future jobs" },
  { key: "higherStudies", label: "Higher studies" },
  { key: "bestFor", label: "Best for" },
  { key: "futureScope", label: "Future scope" },
];

const CompareCoursesPage = () => {
  const uniqueDepartments = useMemo(() => {
    const map = new Map<string, (typeof departments)[number]>();
    departments.forEach((d) => {
      if (!map.has(d.id)) map.set(d.id, d);
    });
    return Array.from(map.values());
  }, []);
  const [selectedIds, setSelectedIds] = useState<string[]>(["", "", ""]);

  const options = useMemo(
    () =>
      uniqueDepartments.map((d) => ({
        value: d.id,
        label: d.name,
        category: d.category?.replace(/-/g, " "),
      })),
    [uniqueDepartments],
  );

  const menuPortalTarget = typeof document !== "undefined" ? document.body : undefined;

  const selectStyles: StylesConfig<(typeof options)[number], false> = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--surface-card,rgba(115, 243, 255, 0.6))",
      borderColor: state.isFocused ? "rgba(115, 243, 255, 0.6)" : "rgba(255,255,255,0.08)",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(115, 243, 255, 0.25)" : "none",
      minHeight: 40,
      borderRadius: 12,
      ":hover": { borderColor: "rgba(115, 243, 255, 0.6)" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--surface-card, rgba(65, 81, 82, 1))",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 30,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: 260,
      padding: 6,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "rgba(115, 243, 255, 0.18)"
        : state.isFocused
          ? "rgba(115, 243, 255, 0.10)"
          : "transparent",
      color: "#000",
      borderRadius: 8,
      padding: "10px 12px",
      cursor: "pointer",
    }),
    placeholder: (base) => ({ ...base, color: "#000" }),
    singleValue: (base) => ({ ...base, color: "white" }),
    input: (base) => ({ ...base, color: "white" }),
    dropdownIndicator: (base) => ({ ...base, color: "#000" }),
    indicatorSeparator: () => ({ display: "none" }),
    clearIndicator: (base) => ({ ...base, color: "#000" }),
  };

  const Option = (props: any) => (
    <components.Option {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate">{props.label}</span>
        {props.data.category ? (
          <span className="text-[11px] uppercase tracking-wide text-primary">{props.data.category}</span>
        ) : null}
      </div>
    </components.Option>
  );

  const NoOptionsMessage = (props: any) => (
    <components.NoOptionsMessage {...props}>
      <span className="text-sm text-gray-600">No results found</span>
    </components.NoOptionsMessage>
  );

  const selectedDeptsBySlot = selectedIds.map((id) => uniqueDepartments.find((d) => d.id === id) ?? null);
  const anySelected = selectedDeptsBySlot.some(Boolean);

  const handleSelect = (slot: number, value: string) => {
    const next = [...selectedIds];
    next[slot] = value;
    setSelectedIds(next);
  };

  return (
    <div className="page-container py-12 space-y-8 overflow-x-hidden">
      <Seo title="Compare Courses | FuturePath 3D" description="Compare departments side by side on duration, eligibility, subjects, skills, and future scope." />
      <SectionHeader
        eyebrow="Compare courses"
        title="Compare two or three departments side by side."
        subtitle="Pick departments to see duration, eligibility, subjects, skills, jobs, and future scope."
      />

      <div className="glass-panel rounded-2xl border border-gray-200 p-4 md:p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 min-w-0">
          {[0, 1, 2].map((idx) => (
            <label key={idx} className="flex min-w-0 flex-col gap-2 text-xs text-gray-600">
              Department {idx + 1}
              <Select
                instanceId={`dept-select-${idx}`}
                options={options}
                value={options.find((o) => o.value === selectedIds[idx]) ?? null}
                onChange={(opt) => handleSelect(idx, (opt as (typeof options)[number] | null)?.value ?? "")}
                isClearable
                placeholder="Select a department"
                styles={selectStyles}
                components={{ Option, NoOptionsMessage }}
                menuPlacement="auto"
                menuPortalTarget={menuPortalTarget}
                menuPosition="fixed"
                classNamePrefix="fp-select"
              />
            </label>
          ))}
        </div>
        {!anySelected ? (
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white/5 via-white/3 to-transparent p-5 text-gray-700 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold">
                1
              </div>
              <div className="space-y-1">
                <div className="text-gray-900 font-semibold text-base">Start comparing departments</div>
                <p className="text-sm text-gray-600">
                  Choose two or three departments to compare duration, eligibility, subjects, skills, jobs, and future scope.
                </p>
                <div className="text-xs text-gray-500">
                  Tip: start typing to search all departments, then add another to see side‑by‑side cards appear below.
                </div>
              </div>
            </div>
          </div>
        ) : selectedDeptsBySlot.filter(Boolean).length === 1 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            Select another department to compare side by side.
          </div>
        ) : null}
      </div>

      {anySelected && (
        <div className="grid gap-4">
          {fields.map((field) => (
            <div key={field.key} className="glass-panel rounded-xl border border-gray-200 p-4 overflow-x-auto">
              <div className="text-sm font-semibold text-gray-900 mb-3">{field.label}</div>
              <div className="grid gap-3 md:grid-cols-3 min-w-full">
                <AnimatePresence>
                  {selectedDeptsBySlot.map((dept, idx) => {
                    if (!dept) {
                      return (
                        <motion.div
                          key={`empty-${idx}-${field.key}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="min-w-0 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-500 text-center flex flex-col items-center justify-center h-full"
                        >
                          <div className="text-gray-900/80 font-semibold">No department selected</div>
                          <div className="text-[12px] text-neutral-500 mt-1">Choose a department to fill this column.</div>
                        </motion.div>
                      );
                    }

                    const value = (dept as any)[field.key];
                    const isArray = Array.isArray(value);
                    return (
                      <motion.div
                        key={`${dept.id}-${idx}-${field.key}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="min-w-0 rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700"
                      >
                        <div className="text-xs uppercase tracking-[0.12em] text-primary mb-1">{dept.name}</div>
                        {isArray ? (
                          <div className="flex flex-wrap gap-2">
                            {(value as string[]).map((item: string) => (
                              <span
                                key={item}
                                className="text-xs rounded-full bg-gray-50 px-2 py-1 text-gray-700 border border-gray-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-700 text-sm break-words">{value}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompareCoursesPage;
