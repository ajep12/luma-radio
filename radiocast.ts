/**
 * ============================================================================
 * RADIOCAST CONFIGURATION
 * ============================================================================
 *
 * This is the ONLY file (together with your `.env` file) where Luma Radio's
 * connection to RadioCast — your radio streaming/hosting provider — is
 * configured. No other radio provider is referenced anywhere in this project.
 *
 * WHERE TO ENTER YOUR REAL RADIOCAST DETAILS
 * -------------------------------------------------------------------------
 * 1. Copy `.env.example` to `.env` in the project root.
 * 2. Fill in the values described below using the information from your
 *    RadioCast account/control panel.
 * 3. Restart `npm run dev` (or rebuild) after editing `.env`.
 *
 * Every value below is read from an environment variable so the same code
 * works for local development, staging, and your production Cloudflare
 * Pages deployment (set the same variables in the Cloudflare Pages project
 * settings under "Environment variables").
 *
 * IMPORTANT — NO INVENTED ENDPOINTS
 * -------------------------------------------------------------------------
 * RadioCast is your radio provider, and this project does not assume the
 * shape of RadioCast's API because that isn't something we can verify from
 * here. Nothing in this file (or anywhere else in the project) fabricates a
 * RadioCast endpoint, response format, or field name. Instead:
 *
 *   - `VITE_RADIOCAST_STREAM_URL` expects the direct audio stream URL
 *     RadioCast gives you (this is the one value that is required for
 *     Listen Live to work at all).
 *   - `VITE_RADIOCAST_NOW_PLAYING_URL` is OPTIONAL. If RadioCast provides a
 *     "Now Playing" / metadata API for your station, put its URL here and
 *     implement the response mapping in `src/hooks/useNowPlaying.ts` (that
 *     file has a clearly marked section for this — see the comment there).
 *     Until you do, the site simply shows the station identity instead of
 *     fabricated song data.
 *   - `VITE_RADIOCAST_PLAYER_EMBED_URL` is OPTIONAL. Some RadioCast plans
 *     provide a hosted embed player (an iframe URL) as an alternative to a
 *     raw stream URL. If you'd rather embed RadioCast's own player instead
 *     of this site's custom player, set this and see `LivePlayer.tsx`.
 *
 * If you don't yet have one of the optional values, leave it blank — the UI
 * is built to gracefully hide anything that isn't configured rather than
 * invent placeholder "live" data.
 * ============================================================================
 */

export interface RadioCastConfig {
  /** Direct audio stream URL from RadioCast. Required for Listen Live. */
  streamUrl: string;
  /** Optional RadioCast-hosted player embed URL (iframe), if you have one. */
  playerEmbedUrl: string;
  /** Optional RadioCast Now Playing / metadata API URL for your station. */
  nowPlayingUrl: string;
  /** Optional fallback audio URL to play if the live stream is unreachable. */
  fallbackStreamUrl: string;
  /** How often (ms) to poll the Now Playing endpoint, if configured. */
  nowPlayingPollIntervalMs: number;
  /** Station display name (kept here so branding and stream config travel together). */
  stationName: string;
  /** Path to the station logo used by the player and metadata tags. */
  stationLogo: string;
}

function readEnv(key: string, fallback = ""): string {
  const value = (import.meta as unknown as { env: Record<string, string | undefined> }).env[key];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const radioCastConfig: RadioCastConfig = {
  streamUrl: readEnv("VITE_RADIOCAST_STREAM_URL"),
  playerEmbedUrl: readEnv("VITE_RADIOCAST_PLAYER_EMBED_URL"),
  nowPlayingUrl: readEnv("VITE_RADIOCAST_NOW_PLAYING_URL"),
  fallbackStreamUrl: readEnv("VITE_RADIOCAST_FALLBACK_STREAM_URL"),
  nowPlayingPollIntervalMs: Number(readEnv("VITE_RADIOCAST_POLL_INTERVAL_MS", "15000")) || 15000,
  stationName: readEnv("VITE_STATION_NAME", "Luma Radio"),
  stationLogo: readEnv("VITE_STATION_LOGO_URL", "/logo.svg"),
};

/** True once a RadioCast stream URL has actually been configured. */
export const isRadioCastConfigured = radioCastConfig.streamUrl.length > 0;

/** True once a RadioCast Now Playing endpoint has been configured. */
export const isNowPlayingConfigured = radioCastConfig.nowPlayingUrl.length > 0;
