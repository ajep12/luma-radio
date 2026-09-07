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
  id?: string;
  title?: string;
  artist?: string;
  art?: string;
}

interface RadioCastSongHistoryEntry {
  sh_id: number;
  played_at: number;
  song?: RadioCastSong;
}

interface RadioCastResponse {
  listeners?: {
    current?: number;
    total?: number;
    unique?: number;
  };

  live?: {
    is_live?: boolean;
    streamer_name?: string;
    art?: string | null;
  };

  now_playing?: {
    sh_id?: number;
    played_at?: number;
    duration?: number;
    streamer?: string;
    elapsed?: number;
    remaining?: number;
    song?: RadioCastSong;
  };

  song_history?: RadioCastSongHistoryEntry[];

  is_online?: boolean;
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
            `RadioCast request failed (${response.status})`
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

    // Update periodically
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
  const live = data.live;

  return {
    song: song?.title || undefined,

    artist: song?.artist || undefined,

    artwork: song?.art || undefined,

    presenter:
      live?.is_live === true
        ? live.streamer_name || undefined
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
  return (data.song_history ?? [])
    .filter(
      (entry) =>
        Boolean(entry.song?.title) &&
        Boolean(entry.sh_id)
    )
    .map((entry) => ({
      id: String(entry.sh_id),

      artist:
        entry.song?.artist ||
        "Unknown artist",

      song:
        entry.song?.title ||
        "Unknown song",

      artwork:
        entry.song?.art ||
        "",

      playedAt:
        entry.played_at
          ? new Date(
              entry.played_at * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
    }));
}
