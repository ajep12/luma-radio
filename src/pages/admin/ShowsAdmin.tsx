import { useShows } from "../../hooks/useShows";
import { presenters } from "../../data/presenters";
import { AdminHeading } from "./AdminHeading";

export function ShowsAdmin() {
  const { shows, loading } = useShows();

  return (
    <div>
      <AdminHeading
        title="Shows"
        subtitle="Manage Luma Radio's show lineup."
        action={
          <button className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal">
            Add show
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-base-line">
        {loading ? (
          <div className="px-5 py-8 text-sm text-ink-faint">
            Loading shows...
          </div>
        ) : shows.length === 0 ? (
          <div className="px-5 py-8 text-sm text-ink-faint">
            No shows found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-base-panel text-ink-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Show</th>
                <th className="px-5 py-3 font-medium">Presenter</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Days</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-base-line">
              {shows.map((show) => {
                const presenter = presenters.find(
                  (p) => p.id === show.presenterId
                );

                return (
                  <tr key={show.id}>
                    <td className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={show.artwork}
                        alt=""
                        className="h-9 w-9 rounded-lg object-cover"
                      />

                      <span className="text-ink">
                        {show.name}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-ink-soft">
                      {presenter?.name ?? "Unknown presenter"}
                    </td>

                    <td className="px-5 py-3 text-ink-soft">
                      {show.time}
                    </td>

                    <td className="px-5 py-3 text-ink-soft">
                      {show.days.join(", ")}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <button className="text-xs font-medium text-lime hover:underline">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
