import { presenters } from "../../data/presenters";
import { AdminHeading } from "./AdminHeading";

export function PresentersAdmin() {
  return (
    <div>
      <AdminHeading
        title="Presenters"
        subtitle="Manage the people behind the mic."
        action={
          <button className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal">
            Add presenter
          </button>
        }
      />
      <div className="grid gap-3">
        {presenters.map((presenter) => (
          <div
            key={presenter.id}
            className="flex items-center gap-4 rounded-2xl border border-base-line bg-base-panel p-4"
          >
            <img src={presenter.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="text-ink">{presenter.name}</p>
              <p className="truncate text-xs text-ink-faint">{presenter.bio}</p>
            </div>
            <button className="shrink-0 text-xs font-medium text-lime hover:underline">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
