import { ReactNode } from "react";

export function AccountCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-14 sm:px-6">
      <div className="w-full rounded-2xl border border-base-line bg-base-panel p-8">
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-faint">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function AccountField({
  label,
  type = "text",
  name,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ink-soft" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink focus:border-lime"
      />
    </div>
  );
}
