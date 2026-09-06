import { useState } from "react";
import { AdminHeading } from "./AdminHeading";

interface PageRow {
  id: string;
  label: string;
  path: string;
  enabled: boolean;
}

const initialPages: PageRow[] = [
  { id: "home", label: "Home", path: "/", enabled: true },
  { id: "listen", label: "Listen Live", path: "/listen", enabled: true },
  { id: "schedule", label: "Schedule", path: "/schedule", enabled: true },
  { id: "shows", label: "Shows", path: "/shows", enabled: true },
  { id: "presenters", label: "Presenters", path: "/presenters", enabled: true },
  { id: "recently-played", label: "Recently Played", path: "/recently-played", enabled: true },
  { id: "requests", label: "Requests", path: "/requests", enabled: true },
  { id: "contact", label: "Contact", path: "/contact", enabled: true },
];

/**
 * Toggle state lives in this component only (it resets on refresh). Wire it
 * to real persisted settings once station settings are backed by a database,
 * then have the public router respect each page's `enabled` flag.
 */
export function Pages() {
  const [pages, setPages] = useState(initialPages);

  function toggle(id: string) {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  return (
    <div>
      <AdminHeading title="Website pages" subtitle="Enable or disable pages on the public site." />
      <div className="divide-y divide-base-line rounded-2xl border border-base-line">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="text-ink">{page.label}</p>
              <p className="text-xs text-ink-faint">{page.path}</p>
            </div>
            <button
              onClick={() => toggle(page.id)}
              aria-pressed={page.enabled}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                page.enabled ? "bg-lime" : "bg-base-line"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-base transition-transform ${
                  page.enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
