import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { shows } from "../data/shows";
import { presenters } from "../data/presenters";

export function Search() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { shows: [], presenters: [] };
    return {
      shows: shows.filter((s) => s.name.toLowerCase().includes(q)),
      presenters: presenters.filter((p) => p.name.toLowerCase().includes(q)),
    };
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.shows.length > 0 || results.presenters.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl text-ink sm:text-5xl">Search</h1>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search shows and presenters..."
        className="mt-6 w-full rounded-xl border border-base-line bg-base-panel px-4 py-3.5 text-ink placeholder:text-ink-faint focus:border-lime"
      />

      {hasQuery && !hasResults && (
        <p className="mt-8 text-sm text-ink-faint">No matches for "{query}".</p>
      )}

      {results.shows.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-ink-soft">Shows</h2>
          <div className="mt-3 divide-y divide-base-line rounded-xl border border-base-line">
            {results.shows.map((s) => (
              <Link key={s.id} to={`/shows/${s.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-base-panel">
                <img src={s.artwork} alt="" className="h-9 w-9 rounded-lg object-cover" />
                <span className="text-ink">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.presenters.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-ink-soft">Presenters</h2>
          <div className="mt-3 divide-y divide-base-line rounded-xl border border-base-line">
            {results.presenters.map((p) => (
              <Link key={p.id} to={`/presenters#${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-base-panel">
                <img src={p.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-ink">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
