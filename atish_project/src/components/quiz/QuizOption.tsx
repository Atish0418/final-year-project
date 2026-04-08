import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface QuizOptionProps {
  id: string;
  text: string;
  hint?: string;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const QuizOption = ({ id, text, hint, index, isSelected, onSelect }: QuizOptionProps) => {
  return (
    <motion.button
      onClick={() => onSelect(id)}
      className={`relative w-full text-left border rounded-xl px-4 py-3 transition-all duration-300 backdrop-blur-sm overflow-hidden group ${
        isSelected
          ? "border-primary/80 bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-gray-200 bg-white/70 hover:border-primary/30 hover:bg-white text-gray-800"
      }`}
      whileHover={{ y: -1, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
             <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0 rounded-full border ${
               isSelected ? "border-primary/50 text-primary" : "border-gray-200 text-gray-400"
             }`}>
               Q{index + 1}
             </span>
             {isSelected && (
               <motion.span 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="text-[9px] text-primary font-bold uppercase tracking-wider flex items-center gap-0.5"
               >
                 <Check size={8} strokeWidth={4} /> Chosen
               </motion.span>
             )}
          </div>
          <div className={`text-base font-medium transition-colors truncate ${isSelected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
            {text}
          </div>
          {hint && (
            <p className={`text-xs mt-0.5 transition-opacity duration-300 line-clamp-1 ${isSelected ? "text-gray-600 opacity-90" : "text-gray-500 opacity-70"}`}>
              {hint}
            </p>
          )}
        </div>
        
        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
          isSelected 
            ? "border-primary bg-primary text-white" 
            : "border-gray-200 bg-white group-hover:border-primary/30"
        }`}>
          {isSelected && <Check size={12} strokeWidth={3} />}
        </div>
      </div>
    </motion.button>
  );
};
