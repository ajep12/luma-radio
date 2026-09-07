import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../config/supabase";
import {
  shows as placeholderShows,
  type Show,
} from "../data/shows";

interface ShowRow {
  id: string;
  name: string;
  artwork: string;
  description: string;
  time: string;
  days: string[];
  presenter_id: string;
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>(placeholderShows);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("shows")
        .select(
          "id, name, artwork, description, time, days, presenter_id"
        );

      if (cancelled) return;

      if (error || !data || data.length === 0) {
        if (error) {
          console.warn(
            "[Supabase] Failed to load shows:",
            error.message
          );
        }

        setLoading(false);
        return;
      }

      setShows(
        (data as ShowRow[]).map((row) => ({
          id: row.id,
          name: row.name,
          artwork: row.artwork,
          description: row.description,
          time: row.time,
          days: row.days,
          presenterId: row.presenter_id,
        }))
      );

      setIsLive(true);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    shows,
    loading,
    isLive,
  };
}
