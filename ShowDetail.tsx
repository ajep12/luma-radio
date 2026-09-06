import { Link, useParams } from "react-router-dom";
import { shows } from "../data/shows";
import { presenters } from "../data/presenters";
import { usePlayer } from "../context/PlayerContext";

export function ShowDetail() {
  const { showId } = useParams();
  const show = shows.find((s) => s.id === showId);
  const { play } = usePlayer();

  if (!show) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink">Show not found</h1>
        <Link to="/shows" className="mt-4 inline-block text-lime hover:underline">
          Back to shows
        </Link>
      </div>
    );
  }

  const presenter = presenters.find((p) => p.id === show.presenterId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link to="/shows" className="text-sm text-ink-faint hover:text-ink">
        ← All shows
      </Link>

      <div className="mt-6 grid gap-8 sm:grid-cols-[220px_1fr] sm:items-start">
        <img
          src={show.artwork}
          alt={show.name}
          className="aspect-square w-full rounded-2xl object-cover ring-1 ring-base-line"
        />
        <div>
          <p className="text-sm text-lime">{show.time}</p>
          <h1 className="mt-2 font-display text-4xl text-ink">{show.name}</h1>
          {presenter && (
            <Link
              to={`/presenters#${presenter.id}`}
              className="mt-2 inline-block text-sm text-ink-soft hover:text-lime"
            >
              with {presenter.name}
            </Link>
          )}
          <p className="mt-4 max-w-lg leading-relaxed text-ink-faint">{show.description}</p>
          <p className="mt-4 text-sm text-ink-soft">On air: {show.days.join(", ")}</p>

          <button
            onClick={play}
            className="mt-6 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal transition-transform hover:scale-[1.03]"
          >
            Listen Live
          </button>
        </div>
      </div>
    </div>
  );
}
