import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

type CardProps = {
  title?: ReactNode;
  eyebrow?: string;
  icon?: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const Card = ({ title, eyebrow, icon, subtitle, children, actions, className }: CardProps) => {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl border border-gray-200 p-4 md:p-5 lg:p-6 flex flex-col gap-3 min-w-0 bg-white",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs uppercase tracking-[0.18em] text-black font-semibold">{eyebrow}</span>
      ) : null}
      <div className="flex items-start gap-3 min-w-0">
        {icon ? <div className="mt-1 text-black">{icon}</div> : null}
        <div className="space-y-1 min-w-0">
          {title ? <h3 className="text-lg font-semibold text-gray-900 leading-snug break-words">{title}</h3> : null}
          {subtitle ? <p className="text-sm text-gray-600 break-words">{subtitle}</p> : null}
          {children ? <div className="text-sm text-gray-600 break-words">{children}</div> : null}
        </div>
      </div>
      {actions ? <div className="pt-1 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
};
