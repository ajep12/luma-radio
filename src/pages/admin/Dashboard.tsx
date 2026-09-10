import { useEffect, useState } from "react";
import { AdminHeading } from "./AdminHeading";
import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";
import { isRadioCastConfigured } from "../../config/radiocast";

type Stats = {
  shows: number;
  presenters: number;
  activeAds: number;
  announcements: number;
  talkbacks: number;
};

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    shows: 0,
    presenters: 0,
    activeAds: 0,
    announcements: 0,
    talkbacks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    setError("");

    const [
      showsResult,
      presentersResult,
      adsResult,
      announcementsResult,
      requestsResult,
    ] = await Promise.all([
      supabase
        .from("shows")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("presenters")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("advertisements")
        .select("id", { count: "exact", head: true })
        .eq("active", true),

      supabase
        .from("announcements")
        .select("id", { count: "exact", head: true })
        .eq("active", true),

      supabase
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    const failed =
      showsResult.error ||
      presentersResult.error ||
      adsResult.error ||
      announcementsResult.error ||
      requestsResult.error;

    if (failed) {
      console.error(
        "[Supabase] Failed to load dashboard:",
        failed
      );

      setError("Unable to load dashboard data.");
      setLoading(false);
      return;
    }

    setStats({
      shows: showsResult.count ?? 0,
      presenters: presentersResult.count ?? 0,
      activeAds: adsResult.count ?? 0,
      announcements: announcementsResult.count ?? 0,
      talkbacks: requestsResult.count ?? 0,
    });

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const statItems = [
    {
      label: "Shows",
      value: stats.shows,
    },
    {
      label: "Presenters",
      value: stats.presenters,
    },
    {
      label: "Active ad slots",
      value: stats.activeAds,
    },
    {
      label: "Active announcements",
      value: stats.announcements,
    },
    {
      label: "Pending Talkbacks",
      value: stats.talkbacks,
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <AdminHeading
          title="Overview"
          subtitle="A snapshot of Luma Radio right now."
        />

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="rounded-xl border border-base-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-lime hover:text-lime disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div
        className={`mb-8 flex items-center justify-between rounded-2xl border p-5 ${
          isRadioCastConfigured
            ? "border-lime/40 bg-lime/5"
            : "border-base-line bg-base-panel"
        }`}
      >
        <div>
          <p className="text-sm text-ink-soft">
            RadioCast connection
          </p>

          <p className="mt-1 font-display text-lg text-ink">
            {isRadioCastConfigured
              ? "Stream URL configured"
              : "Not configured yet"}
          </p>
        </div>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isRadioCastConfigured
              ? "bg-lime"
              : "bg-ink-faint"
          }`}
        />
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-base-line bg-base-panel p-5 text-sm text-ink-faint">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-base-line bg-base-panel p-5"
          >
            <p className="text-sm text-ink-faint">
              {stat.label}
            </p>

            <p className="mt-1 font-display text-3xl text-ink">
              {loading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-base-line bg-base-panel p-5">
        <p className="text-sm text-ink-soft">
          Dashboard data is connected directly to Supabase.
          Changes made to shows, presenters, advertisements,
          announcements and Talkbacks are reflected here
          automatically when the dashboard is refreshed.
        </p>
      </div>
    </div>
  );
}
