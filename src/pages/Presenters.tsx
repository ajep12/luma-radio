import { useEffect, useState } from "react";
import { PresenterCard } from "../components/presenters/PresenterCard";
import { supabase } from "../config/supabase";

type Presenter = {
  id: string;
  name: string;
  photo: string;
  bio: string;
};

export function Presenters() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPresenters() {
      const { data, error } = await supabase
        .from("presenters")
        .select("id, name, photo, bio")
        .order("name");

      if (error) {
        console.error(
          "[Supabase] Failed to load presenters:",
          error
        );

        setPresenters([]);
        setLoading(false);
        return;
      }

      setPresenters((data ?? []) as Presenter[]);
      setLoading(false);
    }

    loadPresenters();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">
        Presenters
      </p>

      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        The voices of Luma
      </h1>

      <p className="mt-3 max-w-lg text-ink-faint">
        Meet the people behind the mic, on air every week.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-ink-faint">
            Loading presenters...
          </p>
        ) : presenters.length === 0 ? (
          <p className="text-ink-faint">
            No presenters are currently available.
          </p>
        ) : (
          presenters.map((presenter) => (
            <div
              key={presenter.id}
              id={presenter.id}
            >
              <PresenterCard presenter={presenter} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
