import { LivePlayer } from "../components/player/LivePlayer";
import { RecentlyPlayedList } from "../components/home/RecentlyPlayedList";
import { SectionHeading } from "../components/common/SectionHeading";
import { ScheduleRail } from "../components/schedule/ScheduleRail";
import { weekDays } from "../data/schedule";

function today() {
  const idx = new Date().getDay();
  return weekDays[(idx + 6) % 7];
}

export function ListenLive() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">
        Listen live
      </p>

      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        Tune in now
      </h1>

      <p className="mt-3 max-w-lg text-ink-faint">
        Streaming live from Luma Radio. Press play and turn it up.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <LivePlayer />

          <div className="mt-10">
            <SectionHeading
              title="Up next"
              detail="What's on today."
            />

            <div className="mt-6">
              <ScheduleRail day={today()} />
            </div>
          </div>
        </div>

        <aside>
          <div className="border-b border-base-line pb-4">
            <h2 className="font-display text-xl text-ink">
              Recently played
            </h2>
          </div>

          <div className="mt-2">
            <RecentlyPlayedList />
          </div>
        </aside>
      </div>
    </div>
  );
}
