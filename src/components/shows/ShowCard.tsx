import { Link } from "react-router-dom";
import { Show } from "../../data/shows";
import { presenters } from "../../data/presenters";

export function ShowCard({ show }: { show: Show }) {
  const presenter = presenters.find((p) => p.id === show.presenterId);

  return (
    <Link
      to={`/shows/${show.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel transition-colors hover:border-lime/40"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={show.artwork}
          alt={show.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs text-lime">{show.time}</p>
        <h3 className="font-display text-lg text-ink">{show.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-faint">{show.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-ink-soft">with {presenter?.name}</span>
          <span className="rounded-full border border-base-line px-3 py-1.5 text-xs font-medium text-ink transition-colors group-hover:border-lime group-hover:text-lime">
            Listen
          </span>
        </div>
      </div>
    </Link>
  );
}
