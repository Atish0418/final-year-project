import { cn } from "../../utils/cn";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-medium text-white",
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
