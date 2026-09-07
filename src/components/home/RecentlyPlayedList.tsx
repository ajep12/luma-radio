import { useNowPlaying } from "../../hooks/useNowPlaying";

export function RecentlyPlayedList({ limit }: { limit?: number }) {
  const { recentlyPlayed, loading } = useNowPlaying();

  const tracks = limit
    ? recentlyPlayed.slice(0, limit)
    : recentlyPlayed;

  if (loading && tracks.length === 0) {
    return (
      <ul className="divide-y divide-base-line">
        {[...Array(limit ?? 5)].map((_, i) => (
          <li key={i} className="flex items-center gap-4 py-3.5">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-base-raised" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-base-raised" />
              <div className="h-3 w-24 animate-pulse rounded bg-base-raised" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (tracks.length === 0) {
    return (
      <p className="py-4 text-sm text-ink-faint">
        No recently played tracks yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-base-line">
      {tracks.map((track, index) => (
        <li
          key={`${track.id}-${index}`}
          className="flex items-center gap-4 py-3.5"
        >
          <img
            src={track.art}
            alt=""
            className="h-11 w-11 shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">
              {track.song}
            </p>

            <p className="truncate text-xs text-ink-faint">
              {track.artist}
            </p>
          </div>

          <span className="shrink-0 text-xs text-ink-faint">
            {track.playedAt}
          </span>
        </li>
      ))}
    </ul>
  );
}
