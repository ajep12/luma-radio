import { useShows } from "../hooks/useShows";
import { ShowCard } from "../components/shows/ShowCard";

export function Shows() {
  const { shows, loading } = useShows();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">Shows</p>

      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        On Luma this week
      </h1>

      <p className="mt-3 max-w-lg text-ink-faint">
        From breakfast to the small hours — every show has a home on Luma.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-ink-faint">
            Loading shows...
          </p>
        ) : shows.length === 0 ? (
          <p className="text-ink-faint">
            No shows are currently available.
          </p>
        ) : (
          shows.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
            />
          ))
        )}
      </div>
    </div>
  );
}
