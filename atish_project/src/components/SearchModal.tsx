import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronRight } from "lucide-react";
import { streams } from "../data/streams";
import { departments } from "../data/departments";
import { motion, AnimatePresence } from "framer-motion";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredStreams = normalizedQuery
    ? streams.filter(
        (s) =>
          s.title.toLowerCase().includes(normalizedQuery) ||
          s.summary.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const filteredDepartments = normalizedQuery
    ? departments.filter(
        (d) =>
          d.name.toLowerCase().includes(normalizedQuery) ||
          d.overview.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const hasResults = filteredStreams.length > 0 || filteredDepartments.length > 0;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center px-6 py-4 border-b border-gray-100">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search streams, courses, departments..."
              className="flex-1 bg-transparent text-gray-900 border-none focus:outline-none focus:ring-0 placeholder:text-gray-400 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto w-full">
            {!normalizedQuery && (
              <div className="p-10 text-center text-gray-500">
                Type something to explore careers and courses.
              </div>
            )}

            {normalizedQuery && !hasResults && (
              <div className="p-10 text-center text-gray-500">
                No results found for "{query}". Try another term like "computer" or "medical".
              </div>
            )}

            {hasResults && (
              <div className="py-2">
                {filteredStreams.length > 0 && (
                  <div className="mb-4">
                    <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Streams
                    </div>
                    {filteredStreams.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleNavigate(`/stream/${s.id}`)}
                        className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">{s.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{s.summary}</div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                      </button>
                    ))}
                  </div>
                )}

                {filteredDepartments.length > 0 && (
                  <div>
                    <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Departments & Courses
                    </div>
                    {filteredDepartments.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleNavigate(`/department/${d.slug}`)}
                        className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">{d.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{d.overview}</div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
