import { shows } from "./shows";

/**
 * PLACEHOLDER DATA — the weekly schedule, derived from `shows.ts`.
 * Replace both files with your real lineup, or connect this to an
 * admin-managed data source later (see README "Admin dashboard").
 */
export interface ScheduleSlot {
  day: string;
  time: string;
  showId: string;
}

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const schedule: ScheduleSlot[] = weekDays.flatMap((day) =>
  shows
    .filter((show) => show.days.includes(day))
    .map((show) => ({ day, time: show.time, showId: show.id }))
);

export function scheduleForDay(day: string) {
  return schedule
    .filter((slot) => slot.day === day)
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((slot) => ({ ...slot, show: shows.find((s) => s.id === slot.showId)! }));
}
