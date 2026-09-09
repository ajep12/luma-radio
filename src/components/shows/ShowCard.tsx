```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";

type Show = {
  id: string;
  name: string;
  artwork: string | null;
  description: string | null;
  time: string | null;
  presenter_id: string | null;
};

type Presenter = {
  id: string;
  name: string;
};

export function ShowCard({ show }: { show: Show }) {
  const [presenter, setPresenter] = useState<Presenter | null>(null);

  useEffect(() => {
    async function loadPresenter() {
      // No presenter assigned
      if (!show.presenter_id || !isSupabaseConfigured) {
        setPresenter(null);
        return;
      }

      console.log(
        "[ShowCard] Looking for presenter:",
        show.presenter_id
      );

      const { data, error } = await supabase
        .from("presenters")
        .select("id, name")
        .eq("id", show.presenter_id)
        .maybeSingle();

      if (error) {
        console.error(
          "[ShowCard] Failed to load presenter:",
          error
        );
        setPresenter(null);
        return;
      }

      console.log(
        "[ShowCard] Presenter found:",
        data
      );

      setPresenter(data as Presenter | null);
    }

    loadPresenter();
  }, [show.presenter_id]);

  return (
    <Link
      to={`/shows/${show.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel transition-colors hover:border-lime/40"
    >
      {/* Artwork */}
      <div className="aspect-square overflow-hidden">
        {show.artwork ? (
          <img
            src={show.artwork}
            alt={show.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-raised">
            <span className="font-display text-2xl text-ink-faint">
              LUMA
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {show.time && (
          <p className="text-xs text-lime">
            {show.time}
          </p>
        )}

        <h3 className="font-display text-lg text-ink">
          {show.name}
        </h3>

        {show.description && (
          <p className="line-clamp-2 text-sm text-ink-faint">
            {show.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-ink-soft">
            {presenter
              ? `with ${presenter.name}`
              : "Luma Radio"}
          </span>

          <span className="rounded-full border border-base-line px-3 py-1.5 text-xs font-medium text-ink transition-colors group-hover:border-lime group-hover:text-lime">
            Listen
          </span>
        </div>
      </div>
    </Link>
  );
}
```
