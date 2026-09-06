import { usePlayer } from "../../context/PlayerContext";

export function PlayButton({ size = 56 }: { size?: number }) {
  const { isPlaying, isLoading, toggle } = usePlayer();
  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? "Pause Luma Radio" : "Play Luma Radio live"}
      className="group relative flex shrink-0 items-center justify-center rounded-full bg-lime text-coal transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{ width: size, height: size }}
    >
      {isLoading ? (
        <span
          className="block animate-spin rounded-full border-2 border-base/30 border-t-base"
          style={{ width: size * 0.35, height: size * 0.35 }}
        />
      ) : isPlaying ? (
        <svg width={size * 0.34} height={size * 0.34} viewBox="0 0 24 24" fill="currentColor">
          <rect x="5" y="4" width="5" height="16" rx="1.2" />
          <rect x="14" y="4" width="5" height="16" rx="1.2" />
        </svg>
      ) : (
        <svg width={size * 0.34} height={size * 0.34} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4.5v15l14-7.5-14-7.5z" />
        </svg>
      )}
    </button>
  );
}
