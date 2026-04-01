import { type ChangeEvent } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
  type?: string;
};

export const AdminField = ({ label, value, onChange, textarea, required, placeholder, type }: Props) => (
  <label className="flex flex-col gap-1 text-sm text-neutral-200">
    {label}
    {textarea ? (
      <textarea
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-[96px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
    ) : (
      <input
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
    )}
  </label>
);
