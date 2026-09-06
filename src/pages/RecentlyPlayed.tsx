import { recentlyPlayed } from "../data/recentlyPlayed";
import { PlaceholderBadge } from "../components/common/PlaceholderBadge";

export function RecentlyPlayed() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium text-lime">Recently played</p>
        <PlaceholderBadge label="Sample data — connect RadioCast history" />
      </div>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">What just played</h1>
      <p className="mt-3 max-w-lg text-ink-faint">
        A running list of what's been on Luma. Once your RadioCast play-history API is connected,
        this list will update automatically.
      </p>

      <div className="mt-10 divide-y divide-base-line rounded-2xl border border-base-line">
        {recentlyPlayed.map((track) => (
          <div key={track.id} className="flex items-center gap-4 px-5 py-4">
            <img
              src={track.artwork}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-base-line"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base text-ink">{track.song}</p>
              <p className="truncate text-sm text-ink-faint">{track.artist}</p>
            </div>
            <span className="shrink-0 text-xs text-ink-faint">{track.playedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
