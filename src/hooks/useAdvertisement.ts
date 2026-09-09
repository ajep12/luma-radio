import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { AdSlotData } from "../data/ads";

export function useAdvertisement() {
  const [ad, setAd] = useState<AdSlotData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdvertisement() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("advertisements")
        .select("id, sponsor, headline, href, cta")
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Failed to load advertisement:", error);
        setAd(null);
      } else {
        setAd(data);
      }

      setLoading(false);
    }

    loadAdvertisement();
  }, []);

  return {
    ad,
    loading,
  };
}
