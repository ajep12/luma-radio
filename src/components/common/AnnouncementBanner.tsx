import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";

interface Announcement {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    async function loadAnnouncement() {
      if (!isSupabaseConfigured) {
        return;
      }

      const { data, error } = await supabase
        .from("announcements")
        .select("id, message, active, created_at")
        .eq("active", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "[Supabase] Failed to load announcement:",
          error
        );
        return;
      }

      setAnnouncement(data);
    }

    loadAnnouncement();
  }, []);

  if (!announcement) {
    return null;
  }

  return (
    <div className="border-b border-base-line bg-base-panel">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-lime">
          Announcement
        </span>

        <p className="text-sm text-ink">
          {announcement.message}
        </p>
      </div>
    </div>
  );
}
