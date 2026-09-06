import { useState } from "react";
import { AdminHeading } from "./AdminHeading";

interface Announcement {
  id: string;
  text: string;
}

/**
 * Announcements live in local component state for now — refresh the page
 * and they reset. Connect this to a real data source when ready so
 * announcements persist and can surface on the public site.
 */
export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "1", text: "Luma Radio is now streaming in higher quality." },
  ]);
  const [draft, setDraft] = useState("");

  function add() {
    if (!draft.trim()) return;
    setAnnouncements((prev) => [{ id: crypto.randomUUID(), text: draft.trim() }, ...prev]);
    setDraft("");
  }

  return (
    <div>
      <AdminHeading title="Announcements" subtitle="Short messages you can surface across the site." />

      <div className="mb-6 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write an announcement..."
          className="flex-1 rounded-xl border border-base-line bg-base-panel px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-lime"
        />
        <button onClick={add} className="rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-coal">
          Post
        </button>
      </div>

      <div className="divide-y divide-base-line rounded-2xl border border-base-line">
        {announcements.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-3">
            <p className="text-sm text-ink">{a.text}</p>
            <button
              onClick={() => setAnnouncements((prev) => prev.filter((x) => x.id !== a.id))}
              className="text-xs text-ink-faint hover:text-lime"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
