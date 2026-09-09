
import { useEffect, useState } from "react";
import {
  isNowPlayingConfigured,
  radioCastConfig,
} from "../config/radiocast";

export interface RecentlyPlayedTrack {
  id: string;
  song: string;
  artist: string;
  art?: string;
  playedAt?: string;
}

export interface NowPlayingData {
  song?: string;
  artist?: string;
  artwork?: string;
  presenter?: string;
  showName?: string;
  listeners?: number;
}

interface NowPlayingState {
  data: NowPlayingData | null;
  recentlyPlayed: RecentlyPlayedTrack[];
  loading: boolean;
  error: boolean;
}

interface RadioCastSong {
  title?: string;
  artist?: string;
  art?: string;
}

interface RadioCastHistoryItem {
  sh_id?: number | string;
  played_at?: number | string;
  song?: RadioCastSong;
}

interface RadioCastNowPlayingResponse {
  is_online?: boolean;

  now_playing?: {
    sh_id?: number | string;
    played_at?: number | string;
    duration?: number;
    song?: RadioCastSong;
  };

  song_history?: RadioCastHistoryItem[];

  live?: {
    is_live?: boolean;
    streamer_name?: string;
  };

  listeners?: {
    current?: number;
  };
}

export function useNowPlaying(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({
    data: null,
    recentlyPlayed: [],
    loading: isNowPlayingConfigured,
    error: false,
  });

  useEffect(() => {
    if (!isNowPlayingConfigured) {
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(
          radioCastConfig.nowPlayingUrl,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            `RadioCast Now Playing request failed (${res.status})`
          );
        }

        const json: RadioCastNowPlayingResponse =
          await res.json();

        if (cancelled) {
          return;
        }

        /*
         * RadioCast can still return the previous song in
         * now_playing even when the station is offline.
         *
         * Therefore we MUST check is_online before using
         * now_playing.
         */
        const isOnline = json.is_online === true;

        /*
         * Build recently played history first.
         * This can still be displayed while the station
         * is offline if your UI supports it.
         */
        const recentlyPlayed: RecentlyPlayedTrack[] =
          Array.isArray(json.song_history)
            ? json.song_history
                .filter((item) => item?.song)
                .map((item, index) => ({
                  id: String(
                    item.sh_id ??
                      `${item.song?.artist ?? "unknown"}-${item.song?.title ?? "unknown"}-${index}`
                  ),
                  song:
                    item.song?.title ??
                    "Unknown song",
                  artist:
                    item.song?.artist ??
                    "Unknown artist",
                  art: item.song?.art,
                  playedAt: formatPlayedAt(
                    item.played_at
                  ),
                }))
            : [];

        /*
         * STATION OFFLINE
         *
         * RadioCast may still return something such as:
         *
         * "Fame Is a Gun"
         *
         * in now_playing.
         *
         * We deliberately ignore it when is_online is false.
         */
        if (!isOnline) {
          setState({
            data: null,
            recentlyPlayed,
            loading: false,
            error: false,
          });

          return;
        }

        /*
         * Station is online, so now_playing is safe to use.
         */
        const currentSong = json.now_playing?.song;
        const isLive = json.live?.is_live === true;

        setState({
          data: {
            song: currentSong?.title,
            artist: currentSong?.artist,
            artwork: currentSong?.art,

            /*
             * If a real presenter is live, use their name.
             * Otherwise leave presenter undefined so the UI
             * can identify it as Auto DJ if required.
             */
            presenter: isLive
              ? json.live?.streamer_name ||
                undefined
              : undefined,

            listeners:
              json.listeners?.current,
          },

          recentlyPlayed,
          loading: false,
          error: false,
        });
      } catch (err) {
        if (!cancelled) {
          /*
           * Clear the previous song if RadioCast cannot
           * be reached. This prevents stale Now Playing
           * information remaining on the website.
           */
          setState({
            data: null,
            recentlyPlayed: [],
            loading: false,
            error: true,
          });
        }

        console.warn(
          "[RadioCast] Now Playing fetch failed:",
          err
        );
      }
    }

    /*
     * Load immediately.
     */
    poll();

    /*
     * Continue polling using your existing interval.
     */
    const interval = setInterval(
      poll,
      radioCastConfig.nowPlayingPollIntervalMs
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return {
    data: state.data,

    recentlyPlayed: Array.isArray(
      state.recentlyPlayed
    )
      ? state.recentlyPlayed
      : [],

    loading: state.loading,
    error: state.error,
  };
}

function formatPlayedAt(
  value?: number | string
): string {
  if (value === undefined || value === null) {
    return "";
  }

  const timestamp =
    typeof value === "number"
      ? value < 10000000000
        ? value * 1000
        : value
      : Number(value);

  if (!Number.isFinite(timestamp)) {
    return "";
  }

  return new Date(timestamp).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}
