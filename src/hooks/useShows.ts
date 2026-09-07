import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../config/supabase";

export interface Show {
  id: string;
  name: string;
  artwork: string;
  description: string;
  time: string;
  days: string[];
  presenterId: string;
}

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
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadShows() {
      const { data, error } = await supabase
        .from("shows")
        .select(
          "id, name, artwork, description, time, days, presenter_id"
        );

      if (cancelled) return;

      if (error) {
        console.warn(
          "[Supabase] Failed to load shows:",
          error.message
        );
        setLoading(false);
        return;
      }

      const mappedShows: Show[] = (
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

      setShows(mappedShows);
      setIsLive(mappedShows.length > 0);
      setLoading(false);
    }

    loadShows();

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
