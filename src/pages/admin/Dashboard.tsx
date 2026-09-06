import { AdminHeading } from "./AdminHeading";
import { shows } from "../../data/shows";
import { presenters } from "../../data/presenters";
import { ads } from "../../data/ads";
import { isRadioCastConfigured } from "../../config/radiocast";

const stats = [
  { label: "Shows", value: shows.length },
  { label: "Presenters", value: presenters.length },
  { label: "Active ad slots", value: ads.length },
];

export function Dashboard() {
  return (
    <div>
      <AdminHeading title="Overview" subtitle="A snapshot of Luma Radio right now." />

      <div
        className={`mb-8 flex items-center justify-between rounded-2xl border p-5 ${
          isRadioCastConfigured ? "border-lime/40 bg-lime/5" : "border-base-line bg-base-panel"
        }`}
      >
        <div>
          <p className="text-sm text-ink-soft">RadioCast connection</p>
          <p className="mt-1 font-display text-lg text-ink">
            {isRadioCastConfigured ? "Stream URL configured" : "Not configured yet"}
          </p>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${isRadioCastConfigured ? "bg-lime" : "bg-ink-faint"}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-base-line bg-base-panel p-5">
            <p className="text-sm text-ink-faint">{s.label}</p>
            <p className="mt-1 font-display text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-base-line bg-base-panel p-5">
        <p className="text-sm text-ink-soft">
          This dashboard is a frontend scaffold. Shows, presenters, schedule, announcements, ads,
          pages and users are ready to be connected to a real data source (see README.md, "Future
          Supabase integration") so edits made here persist and reflect on the public site.
        </p>
      </div>
    </div>
  );
}
