
import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";

interface Announcement {
  id: string;
  text: string;
  active: boolean;
  created_at: string;
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let cancelled = false;

    async function loadAnnouncement() {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, text, active, created_at")
        .eq("active", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (cancelled) {
        return;
      }

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

    // Check for new announcements every 30 seconds.
    const interval = setInterval(
      loadAnnouncement,
      30000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
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
          {announcement.text}
        </p>
      </div>
    </div>
  );
}
