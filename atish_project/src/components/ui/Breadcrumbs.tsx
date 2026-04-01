import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; to?: string };

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-neutral-400" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
          {idx < items.length - 1 && <ChevronRight size={14} className="text-neutral-500" />}
        </div>
      ))}
    </nav>
  );
};
