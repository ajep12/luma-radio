import { recentlyPlayed } from "../../data/recentlyPlayed";

export function RecentlyPlayedList({ limit }: { limit?: number }) {
  const tracks = limit ? recentlyPlayed.slice(0, limit) : recentlyPlayed;

  return (
    <ul className="divide-y divide-base-line">
      {tracks.map((track) => (
        <li key={track.id} className="flex items-center gap-4 py-3.5">
          <img src={track.artwork} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">{track.song}</p>
            <p className="truncate text-xs text-ink-faint">{track.artist}</p>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{track.playedAt}</span>
        </li>
      ))}
    </ul>
  );
}
