import { useEffect, useState } from "react";
import {
  isNowPlayingConfigured,
  radioCastConfig,
} from "../config/radiocast";

export interface NowPlayingData {
  song?: string;
  artist?: string;
  artwork?: string;
  presenter?: string;
  showName?: string;
  listeners?: number;
}

export interface PlayedTrack {
  id: string;
  artist: string;
  song: string;
  artwork: string;
  playedAt: string;
}

interface NowPlayingState {
  data: NowPlayingData | null;
  recentlyPlayed: PlayedTrack[];
  loading: boolean;
  error: boolean;
}

interface RadioCastSong {
  id?: string | number;
  title?: string;
  artist?: string;
  art?: string;
  artwork?: string;
}

interface RadioCastHistoryEntry {
  sh_id?: number | string;
  played_at?: number | string;
  song?: RadioCastSong;
}

interface RadioCastResponse {
  now_playing?: {
    song?: RadioCastSong;
  };

  live?: {
    is_live?: boolean;
    streamer_name?: string;
    name?: string;
  };

  listeners?: {
    current?: number;
  };

  song_history?: RadioCastHistoryEntry[];
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
      setState({
        data: null,
        recentlyPlayed: [],
        loading: false,
        error: false,
      });

      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch(
          radioCastConfig.nowPlayingUrl,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `RadioCast request failed: ${response.status} ${response.statusText}`
          );
        }

        const json: RadioCastResponse = await response.json();

        if (cancelled) return;

        setState({
          data: mapResponse(json),
          recentlyPlayed: mapHistory(json),
          loading: false,
          error: false,
        });
      } catch (error) {
        if (cancelled) return;

        console.warn(
          "[RadioCast] Now Playing fetch failed:",
          error
        );

        setState((previous) => ({
          ...previous,
          loading: false,
          error: true,
        }));
      }
    }

    // Fetch immediately
    poll();

    // Then keep it updated
    const interval = window.setInterval(
      poll,
      radioCastConfig.nowPlayingPollIntervalMs
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}

function mapResponse(
  data: RadioCastResponse
): NowPlayingData {
  const song = data.now_playing?.song;

  const isLive =
    data.live?.is_live === true;

  return {
    song: song?.title || undefined,

    artist: song?.artist || undefined,

    artwork:
      song?.art ||
      song?.artwork ||
      undefined,

    presenter: isLive
      ? data.live?.streamer_name ||
        data.live?.name ||
        undefined
      : undefined,

    listeners:
      typeof data.listeners?.current === "number"
        ? data.listeners.current
        : undefined,
  };
}

function mapHistory(
  data: RadioCastResponse
): PlayedTrack[] {
  const history = data.song_history ?? [];

  return history
    .filter(
      (entry) =>
        entry.song?.title &&
        entry.sh_id !== undefined
    )
    .map((entry) => {
      const playedAt = Number(entry.played_at);

      return {
        id: String(entry.sh_id),

        artist:
          entry.song?.artist ||
          "Unknown artist",

        song:
          entry.song?.title ||
          "Unknown song",

        artwork:
          entry.song?.art ||
          entry.song?.artwork ||
          "",

        playedAt: Number.isFinite(playedAt)
          ? new Date(
              playedAt * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      };
    });
}
