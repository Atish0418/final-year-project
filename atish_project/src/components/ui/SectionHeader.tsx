type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) => {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-2 ${alignment}`}>
      {eyebrow ? (
        <span className="text-xs uppercase tracking-[0.2em] text-black font-semibold">{eyebrow}</span>
      ) : null}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">{title}</h2>
      {subtitle ? <p className="text-gray-600 max-w-3xl text-sm sm:text-base">{subtitle}</p> : null}
    </div>
  );
};
