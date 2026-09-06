const BAR_COUNT = 24;
// Fixed pseudo-random heights so the bars look organic without a real analyser.
const HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => 0.3 + ((i * 37) % 70) / 100);
const DELAYS = Array.from({ length: BAR_COUNT }, (_, i) => (i * 0.09) % 1.2);

export function Waveform({ active, size = "md" }: { active: boolean; size?: "sm" | "md" | "lg" }) {
  const heightPx = size === "lg" ? 56 : size === "md" ? 36 : 20;
  return (
    <div
      className="flex items-end gap-[3px]"
      style={{ height: heightPx }}
      role="img"
      aria-label={active ? "Live audio waveform, playing" : "Audio waveform, paused"}
    >
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${active ? "bg-lime" : "bg-base-line"}`}
          style={{
            height: "100%",
            transformOrigin: "bottom",
            transform: active ? undefined : `scaleY(${Math.max(h * 0.35, 0.08)})`,
            animation: active ? `bar 0.9s ease-in-out ${DELAYS[i]}s infinite` : "none",
            opacity: active ? 0.55 + h * 0.45 : 1,
          }}
        />
      ))}
    </div>
  );
}
