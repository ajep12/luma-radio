import { weekDays, scheduleForDay } from "../../data/schedule";
import { AdminHeading } from "./AdminHeading";

export function ScheduleAdmin() {
  return (
    <div>
      <AdminHeading title="Schedule" subtitle="The weekly on-air lineup." />
      <div className="space-y-6">
        {weekDays.map((day) => {
          const slots = scheduleForDay(day);
          return (
            <div key={day}>
              <p className="mb-2 text-sm font-medium text-ink-soft">{day}</p>
              <div className="divide-y divide-base-line rounded-2xl border border-base-line">
                {slots.length === 0 ? (
                  <p className="px-5 py-3 text-sm text-ink-faint">Nothing scheduled.</p>
                ) : (
                  slots.map((slot) => (
                    <div key={slot.time + slot.showId} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-lime">{slot.time}</span>
                      <span className="text-sm text-ink">{slot.show.name}</span>
                      <button className="text-xs font-medium text-ink-faint hover:text-lime">Edit</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
