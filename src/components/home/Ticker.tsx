import { useNowPlaying } from "../../hooks/useNowPlaying";

export function Ticker() {
  const { recentlyPlayed, loading } = useNowPlaying();

  if (loading) {
    return (
      <div className="overflow-hidden border-y border-base-line bg-base-raised py-3.5">
        <div className="flex w-max gap-10">
          <span className="whitespace-nowrap text-sm text-ink-faint">
            Loading recently played...
          </span>
        </div>
      </div>
    );
  }

  const items = [...recentlyPlayed, ...recentlyPlayed];

  return (
    <div className="overflow-hidden border-y border-base-line bg-base-raised py-3.5">
      <div className="flex w-max animate-marquee gap-10">
        {items.map((track, i) => (
          <span
            key={`${track.id}-${i}`}
            className="flex items-center gap-2.5 whitespace-nowrap text-sm"
          >
            <span className="h-1 w-1 rounded-full bg-lime" />
            <span className="text-ink-faint">{track.artist}</span>
            <span className="text-ink">{track.song}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
