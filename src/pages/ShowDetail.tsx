import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { supabase, isSupabaseConfigured } from "../config/supabase";
import { usePlayer } from "../context/PlayerContext";

type Show = {
  id: string;
  name: string;
  artwork: string | null;
  description: string | null;
  time: string | null;
  days: string[] | null;
  presenterId: string | null;
};

type Presenter = {
  id: string;
  name: string;
};

export function ShowDetail() {
  const { showId } = useParams<{ showId: string }>();
  const { play } = usePlayer();

  const [show, setShow] = useState<Show | null>(null);
  const [presenter, setPresenter] = useState<Presenter | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShow() {
      if (!showId) {
        setShow(null);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        console.error("[Supabase] Supabase is not configured.");
        setShow(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      /*
       * Load the show using the UUID from the URL.
       */
      const { data: showData, error: showError } = await supabase
        .from("shows")
        .select("*")
        .eq("id", showId)
        .single();

      if (showError) {
        console.error(
          "[Supabase] Failed to load show:",
          showError
        );

        setShow(null);
        setLoading(false);
        return;
      }

      const loadedShow = showData as Show;

      setShow(loadedShow);

      /*
       * Load the presenter if this show has one.
       */
      if (loadedShow.presenterId) {
        const { data: presenterData, error: presenterError } =
          await supabase
            .from("presenters")
            .select("id, name")
            .eq("id", loadedShow.presenterId)
            .maybeSingle();

        if (presenterError) {
          console.error(
            "[Supabase] Failed to load presenter:",
            presenterError
          );

          setPresenter(null);
        } else {
          setPresenter(
            presenterData as Presenter | null
          );
        }
      } else {
        setPresenter(null);
      }

      setLoading(false);
    }

    loadShow();
  }, [showId]);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-base-raised" />

          <div className="mt-6 grid gap-8 sm:grid-cols-[220px_1fr]">
            <div className="aspect-square rounded-2xl bg-base-raised" />

            <div>
              <div className="h-4 w-20 rounded bg-base-raised" />

              <div className="mt-3 h-12 w-3/4 rounded bg-base-raised" />

              <div className="mt-4 h-4 w-40 rounded bg-base-raised" />

              <div className="mt-6 space-y-2">
                <div className="h-4 w-full rounded bg-base-raised" />
                <div className="h-4 w-5/6 rounded bg-base-raised" />
                <div className="h-4 w-2/3 rounded bg-base-raised" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Show not found
   */
  if (!show) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink">
          Show not found
        </h1>

        <p className="mt-3 text-sm text-ink-faint">
          The show you're looking for doesn't exist or is no
          longer available.
        </p>

        <Link
          to="/shows"
          className="mt-4 inline-block text-lime hover:underline"
        >
          Back to shows
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <Link
        to="/shows"
        className="text-sm text-ink-faint hover:text-ink"
      >
        ← All shows
      </Link>

      <div className="mt-6 grid gap-8 sm:grid-cols-[220px_1fr] sm:items-start">
        {/* Artwork */}
        {show.artwork ? (
          <img
            src={show.artwork}
            alt={show.name}
            className="aspect-square w-full rounded-2xl object-cover ring-1 ring-base-line"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-base-raised ring-1 ring-base-line">
            <span className="font-display text-2xl text-ink-faint">
              LUMA
            </span>
          </div>
        )}

        {/* Show information */}
        <div>
          {show.time && (
            <p className="text-sm text-lime">
              {show.time}
            </p>
          )}

          <h1 className="mt-2 font-display text-4xl text-ink">
            {show.name}
          </h1>

          {presenter && (
            <Link
              to={`/presenters#${presenter.id}`}
              className="mt-2 inline-block text-sm text-ink-soft hover:text-lime"
            >
              with {presenter.name}
            </Link>
          )}

          {show.description && (
            <p className="mt-4 max-w-lg leading-relaxed text-ink-faint">
              {show.description}
            </p>
          )}

          {show.days && show.days.length > 0 && (
            <p className="mt-4 text-sm text-ink-soft">
              On air: {show.days.join(", ")}
            </p>
          )}

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
