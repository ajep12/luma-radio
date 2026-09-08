import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../config/supabase";

export type Presenter = {
  id: string;
  name: string;
  photo: string | null;
  bio: string | null;
};

export function usePresenters() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPresenters() {
      if (!isSupabaseConfigured) {
        setPresenters([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

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
        setError(error.message);
        setLoading(false);
        return;
      }

      setPresenters(
        Array.isArray(data)
          ? (data as Presenter[])
          : []
      );

      setLoading(false);
    }

    loadPresenters();
  }, []);

  return {
    presenters,
    loading,
    error,
  };
}
