import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../config/supabase";

export type Show = {
  id: string;
  name: string;
  artwork: string;
  description: string;
  time: string;
  days: string[];
  presenterId: string;
};

interface ShowRow {
  id: string;
  name: string | null;
  artwork: string | null;
  description: string | null;
  time: string | null;
  days: string[] | null;
  presenter_id: string | null;
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadShows() {
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setShows([]);
          setLoading(false);
          setIsLive(false);
        }

        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("shows")
        .select(
          "id, name, artwork, description, time, days, presenter_id"
        )
        .order("name");

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(
          "[Supabase] Failed to load shows:",
          error
        );

        setShows([]);
        setLoading(false);
        setIsLive(false);

        return;
      }

      const liveShows: Show[] = Array.isArray(data)
        ? (data as ShowRow[]).map((row) => ({
            id: row.id,
            name: row.name ?? "",
            artwork: row.artwork ?? "",
            description: row.description ?? "",
            time: row.time ?? "",
            days: Array.isArray(row.days)
              ? row.days
              : [],
            presenterId: row.presenter_id ?? "",
          }))
        : [];

      setShows(liveShows);
      setLoading(false);
      setIsLive(true);
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
