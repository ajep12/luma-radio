import { useEffect, useState } from "react";
import { AdminHeading } from "./AdminHeading";
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

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("announcements")
      .select("id, text, active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD ANNOUNCEMENTS ERROR:", error);
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setAnnouncements(data ?? []);
    setLoading(false);
  }

  async function add() {
    console.log("POST BUTTON CLICKED");
    console.log("Draft:", draft);

    const text = draft.trim();

    if (!text) {
      setErrorMessage("Please write an announcement first.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    setPosting(true);
    setErrorMessage("");

    console.log("Sending announcement to Supabase...");

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        text: text,
        active: true,
      })
      .select("id, text, active, created_at")
      .single();

    if (error) {
      console.error("CREATE ANNOUNCEMENT ERROR:", error);
      setErrorMessage(
        `Could not post announcement: ${error.message}`
      );
      setPosting(false);
      return;
    }

    console.log("ANNOUNCEMENT CREATED:", data);

    setAnnouncements((prev) => [
      data,
      ...prev,
    ]);

    setDraft("");
    setPosting(false);
  }

  async function remove(id: string) {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE ANNOUNCEMENT ERROR:", error);
      setErrorMessage(error.message);
      return;
    }

    setAnnouncements((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  async function toggleActive(
    announcement: Announcement
  ) {
    const { data, error } = await supabase
      .from("announcements")
      .update({
        active: !announcement.active,
      })
      .eq("id", announcement.id)
      .select("id, text, active, created_at")
      .single();

    if (error) {
      console.error("UPDATE ANNOUNCEMENT ERROR:", error);
      setErrorMessage(error.message);
      return;
    }

    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === announcement.id
          ? data
          : item
      )
    );
  }

  return (
    <div>
      <AdminHeading
        title="Announcements"
        subtitle="Short messages you can surface across the site."
      />

      <div className="mb-6 flex gap-2">
        <input
          value={draft}
          onChange={(e) =>
            setDraft(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              add();
            }
          }}
          placeholder="Write an announcement..."
          className="flex-1 rounded-xl border border-base-line bg-base-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-lime"
        />

        <button
          type="button"
          onClick={add}
          disabled={posting}
          className="rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-coal disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="divide-y divide-base-line rounded-2xl border border-base-line">
        {loading ? (
          <div className="px-5 py-4 text-sm text-ink-faint">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="px-5 py-4 text-sm text-ink-faint">
            No announcements yet.
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <div>
                <p
                  className={
                    announcement.active
                      ? "text-sm text-ink"
                      : "text-sm text-ink-faint line-through"
                  }
                >
                  {announcement.text}
                </p>

                <p className="mt-1 text-xs text-ink-faint">
                  {announcement.active
                    ? "Active"
                    : "Hidden"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toggleActive(announcement)
                  }
                  className="text-xs text-ink-faint hover:text-lime"
                >
                  {announcement.active
                    ? "Hide"
                    : "Show"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    remove(announcement.id)
                  }
                  className="text-xs text-ink-faint hover:text-lime"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
