import { Link } from "react-router-dom";
import { Hero } from "../components/home/Hero";
import { Ticker } from "../components/home/Ticker";
import { ScheduleRail } from "../components/schedule/ScheduleRail";
import { ShowCard } from "../components/shows/ShowCard";
import { PresenterCard } from "../components/presenters/PresenterCard";
import { AdSlot } from "../components/ads/AdSlot";
import { SectionHeading } from "../components/common/SectionHeading";
import { useShows } from "../hooks/useShows";
import { presenters } from "../data/presenters";
import { ads } from "../data/ads";
import { weekDays } from "../data/schedule";

function today() {
  const idx = new Date().getDay();
  return weekDays[(idx + 6) % 7];
}

export function Home() {
  const { shows = [], loading } = useShows();

  const banner = ads.find((a) => a.kind === "homepage-banner");

  return (
    <>
      <Hero />

      <Ticker />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          title="Today on Luma"
          detail="Live shows, back to back, all day."
          action={
            <Link
              to="/schedule"
              className="text-sm font-medium text-lime hover:underline"
            >
              Full schedule →
            </Link>
          }
        />

        <div className="mt-6">
          <ScheduleRail day={today()} />
        </div>
      </section>

      {banner && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <AdSlot ad={banner} />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          title="Featured shows"
          detail="A closer look at what's on Luma this week."
          action={
            <Link
              to="/shows"
              className="text-sm font-medium text-lime hover:underline"
            >
              All shows →
            </Link>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-base-raised"
              />
            ))
          ) : shows.length > 0 ? (
            shows.slice(0, 4).map((show) => (
              <ShowCard key={show.id} show={show} />
            ))
          ) : (
            <p className="text-sm text-ink-faint">
              No shows are currently available.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          title="Meet the presenters"
          detail="The voices of Luma Radio."
          action={
            <Link
              to="/presenters"
              className="text-sm font-medium text-lime hover:underline"
            >
              All presenters →
            </Link>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {presenters.map((presenter) => (
            <PresenterCard
              key={presenter.id}
              presenter={presenter}
            />
          ))}
        </div>
      </section>
    </>
  );
}
