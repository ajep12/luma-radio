import { usePlayer } from "../../context/PlayerContext";

export function VolumeControl({ compact = false }: { compact?: boolean }) {
  const { volume, setVolume } = usePlayer();
  return (
    <div className={`flex items-center gap-2 ${compact ? "w-24" : "w-32"}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-ink-faint">
        <path
          d="M4 9v6h4l5 5V4L8 9H4z"
          fill="currentColor"
        />
        <path
          d="M16.5 8.5a5 5 0 0 1 0 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-base-line accent-lime"
      />
    </div>
  );
}
