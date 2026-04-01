import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type DepartmentOption = {
  id: string;
  name: string;
  category?: string;
};

type DepartmentSearchSelectProps = {
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  options: DepartmentOption[];
};

const DepartmentSearchSelect = ({ value, onChange, placeholder = "Select a department", options }: DepartmentSearchSelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const selectedOption = useMemo(() => options.find((o) => o.id === value), [options, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.name.toLowerCase().includes(q) || o.category?.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (highlight >= filtered.length) {
      setHighlight(filtered.length ? 0 : 0);
    }
  }, [filtered.length, highlight]);

  useEffect(() => {
    setQuery(selectedOption ? selectedOption.name : "");
  }, [selectedOption]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const commitSelection = (opt: DepartmentOption) => {
    onChange(opt.id);
    setQuery(opt.name);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) commitSelection(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-0">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-white/10 bg-surface-card text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange("");
              inputRef.current?.focus();
              setOpen(true);
            }}
            className="text-xs text-neutral-300 hover:text-white px-2 py-1 rounded border border-white/10 bg-white/5"
          >
            Clear
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 mt-1 w-full rounded-lg border border-white/10 bg-surface-card shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-neutral-400">No results found</div>
              )}
              {filtered.map((opt, idx) => {
                const active = idx === highlight;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onMouseEnter={() => setHighlight(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commitSelection(opt)}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      active ? "bg-primary/20 text-white" : "text-neutral-100"
                    } hover:bg-primary/10 focus:outline-none`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{opt.name}</span>
                      {opt.category ? <span className="text-[11px] text-primary uppercase tracking-wide">{opt.category}</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentSearchSelect;
