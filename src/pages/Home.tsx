import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Hero } from "../components/home/Hero";
import { Ticker } from "../components/home/Ticker";
import { ScheduleRail } from "../components/schedule/ScheduleRail";
import { ShowCard } from "../components/shows/ShowCard";
import { PresenterCard } from "../components/presenters/PresenterCard";
import { AdSlot } from "../components/ads/AdSlot";
import { SectionHeading } from "../components/common/SectionHeading";

import { useShows } from "../hooks/useShows";
import { usePresenters } from "../hooks/usePresenters";

import {
  supabase,
  isSupabaseConfigured,
} from "../config/supabase";

type ScheduleEntry = {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  show_name: string;
};

type Advertisement = {
  id: string;
  sponsor: string;
  headline: string;
  href: string;
  cta: string;
  kind: string;
  active: boolean;
};

function getLocalDate() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function Home() {
  const {
    shows = [],
    loading: showsLoading,
  } = useShows();

  const {
    presenters = [],
    loading: presentersLoading,
  } = usePresenters();

  const [todaySchedule, setTodaySchedule] =
    useState<ScheduleEntry[]>([]);

  const [scheduleLoading, setScheduleLoading] =
    useState(true);

  const [scheduleError, setScheduleError] =
    useState(false);

  const [banner, setBanner] =
    useState<Advertisement | null>(null);

  const [bannerLoading, setBannerLoading] =
    useState(true);

  /*
   * Load today's schedule directly from Supabase.
   */
  useEffect(() => {
    async function loadTodaySchedule() {
      if (!isSupabaseConfigured) {
        setTodaySchedule([]);
        setScheduleLoading(false);
        return;
      }

      setScheduleLoading(true);
      setScheduleError(false);

      const today = getLocalDate();

      const { data, error } = await supabase
        .from("schedule")
        .select(
          "id, date, start_time, end_time, show_name"
        )
        .eq("date", today)
        .order("start_time");

      if (error) {
        console.error(
          "[Supabase] Failed to load today's schedule:",
          error
        );

        setTodaySchedule([]);
        setScheduleError(true);
        setScheduleLoading(false);

        return;
      }

      setTodaySchedule(
        Array.isArray(data)
          ? (data as ScheduleEntry[])
          : []
      );

      setScheduleLoading(false);
    }

    loadTodaySchedule();
  }, []);

  /*
   * Load the active homepage advertisement from Supabase.
   */
  useEffect(() => {
    async function loadHomepageBanner() {
      if (!isSupabaseConfigured) {
        setBanner(null);
        setBannerLoading(false);
        return;
      }

      setBannerLoading(true);

      const { data, error } = await supabase
        .from("advertisements")
        .select(
          "id, sponsor, headline, href, cta, kind, active"
        )
        .eq("active", true)
        .eq("kind", "homepage-banner")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "[Supabase] Failed to load homepage advertisement:",
          error
        );

        setBanner(null);
      } else {
        setBanner(data as Advertisement | null);
      }

      setBannerLoading(false);
    }

    loadHomepageBanner();
  }, []);

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Now Playing ticker */}
      <Ticker />

      {/* Today's schedule */}
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
          {scheduleLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 w-64 shrink-0 animate-pulse rounded-2xl bg-base-raised"
                />
              ))}
            </div>
          ) : scheduleError ? (
            <p className="text-sm text-red-400">
              Failed to load today's schedule.
            </p>
          ) : (
            <ScheduleRail
              schedule={todaySchedule}
            />
          )}
        </div>
      </section>

      {/* Homepage advert */}
      {!bannerLoading && banner && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <AdSlot ad={banner} />
        </section>
      )}

      {/* Featured shows */}
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
          {showsLoading ? (
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-base-raised"
              />
            ))
          ) : shows.length > 0 ? (
            shows
              .slice(0, 4)
              .map((show) => (
                <ShowCard
                  key={show.id}
                  show={show}
                />
              ))
          ) : (
            <p className="text-sm text-ink-faint">
              No shows are currently available.
            </p>
          )}
        </div>
      </section>

      {/* Presenters */}
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
          {presentersLoading ? (
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl bg-base-raised"
              />
            ))
          ) : presenters.length > 0 ? (
            presenters
              .slice(0, 4)
              .map((presenter) => (
                <PresenterCard
                  key={presenter.id}
                  presenter={presenter}
                />
              ))
          ) : (
            <p className="text-sm text-ink-faint">
              No presenters are currently available.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
