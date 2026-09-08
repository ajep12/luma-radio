export function PresenterIndicator({
  presenter,
}: {
  presenter?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-base-panel px-3 py-1 text-xs font-semibold tracking-wide text-ink-faint">
      🎙️
      {presenter || "Auto DJ"}
    </span>
  );
}
