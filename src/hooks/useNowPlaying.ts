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

        const json: RadioCastNowPlayingResponse = await res.json();

        if (cancelled) {
          return;
        }

        const currentSong = json.now_playing?.song;
        const isLive = json.live?.is_live === true;

        const recentlyPlayed: RecentlyPlayedTrack[] = Array.isArray(
          json.song_history
        )
          ? json.song_history
              .filter((item) => item?.song)
              .map((item, index) => ({
                id: String(
                  item.sh_id ??
                    `${item.song?.artist ?? "unknown"}-${item.song?.title ?? "unknown"}-${index}`
                ),
                song: item.song?.title ?? "Unknown song",
                artist: item.song?.artist ?? "Unknown artist",
                art: item.song?.art,
                playedAt: formatPlayedAt(item.played_at),
              }))
          : [];

        setState({
          data: {
            song: currentSong?.title,
            artist: currentSong?.artist,
            artwork: currentSong?.art,
            presenter: isLive
              ? json.live?.streamer_name || undefined
              : undefined,
            listeners: json.listeners?.current,
          },
          recentlyPlayed,
          loading: false,
          error: false,
        });
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: true,
            recentlyPlayed: Array.isArray(prev.recentlyPlayed)
              ? prev.recentlyPlayed
              : [],
          }));
        }

        console.warn(
          "[RadioCast] Now Playing fetch failed:",
          err
        );
      }
    }

    poll();

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
    recentlyPlayed: Array.isArray(state.recentlyPlayed)
      ? state.recentlyPlayed
      : [],
    loading: state.loading,
    error: state.error,
  };
}

function formatPlayedAt(value?: number | string): string {
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

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
