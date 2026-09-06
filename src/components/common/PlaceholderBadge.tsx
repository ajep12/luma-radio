export function PlaceholderBadge({ label = "Placeholder data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-base-line bg-base-panel px-2.5 py-1 text-[11px] text-ink-faint">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
      {label}
    </span>
  );
}
