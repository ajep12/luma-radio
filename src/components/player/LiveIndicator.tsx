export function LiveIndicator({ live = true }: { live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        live ? "bg-lime/10 text-lime" : "bg-base-panel text-ink-faint"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${live ? "bg-lime animate-pulse-dot" : "bg-ink-faint"}`}
      />
      {live ? "Live" : "Offline"}
    </span>
  );
}
