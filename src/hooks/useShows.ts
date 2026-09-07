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
    // Supabase isn't configured — use fallback
    if (!isSupabaseConfigured) {
      setShows(placeholderShows);
      setLoading(false);
      setIsLive(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from("shows")
          .select(
            "id, name, artwork, description, time, days, presenter_id"
          );

        if (cancelled) return;

        // Supabase failed — use fallback
        if (error) {
          console.warn(
            "[Supabase] Failed to load shows:",
            error.message
          );

          setShows(placeholderShows);
          setLoading(false);
          setIsLive(false);
          return;
        }

        // Supabase returned no shows — use fallback
        if (!data || data.length === 0) {
          setShows(placeholderShows);
          setLoading(false);
          setIsLive(false);
          return;
        }

        // Supabase worked — use live data
        const liveShows: Show[] = (
          data as ShowRow[]
        ).map((row) => ({
          id: row.id,
          name: row.name,
          artwork: row.artwork,
          description: row.description,
          time: row.time,
          days: row.days,
          presenterId: row.presenter_id,
        }));

        setShows(liveShows);
        setIsLive(true);
        setLoading(false);
      } catch (error) {
        if (cancelled) return;

        console.warn(
          "[Shows] Unexpected error:",
          error
        );

        // Unexpected error — use fallback
        setShows(placeholderShows);
        setLoading(false);
        setIsLive(false);
      }
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
