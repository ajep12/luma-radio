import { radioCastConfig, isRadioCastConfigured, isNowPlayingConfigured } from "../../config/radiocast";
import { AdminHeading } from "./AdminHeading";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="max-w-[60%] truncate text-sm text-ink" title={value}>
        {value || "Not set"}
      </span>
    </div>
  );
}

export function Settings() {
  return (
    <div>
      <AdminHeading title="Station settings" subtitle="Core configuration for Luma Radio." />

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-ink-soft">RadioCast connection</p>
        <div className="divide-y divide-base-line rounded-2xl border border-base-line">
          <Row label="Stream URL" value={radioCastConfig.streamUrl} />
          <Row label="Player embed URL" value={radioCastConfig.playerEmbedUrl} />
          <Row label="Now Playing endpoint" value={radioCastConfig.nowPlayingUrl} />
          <Row label="Fallback stream URL" value={radioCastConfig.fallbackStreamUrl} />
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          These values are read from your environment variables (<code className="text-lime/80">.env</code>{" "}
          locally, or your Cloudflare Pages project settings in production) — they can't be edited
          here directly. See README.md, "RadioCast setup".
        </p>
        <div className="mt-3 flex gap-2">
          <StatusPill ok={isRadioCastConfigured} label="Stream" />
          <StatusPill ok={isNowPlayingConfigured} label="Now Playing" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Branding</p>
        <div className="divide-y divide-base-line rounded-2xl border border-base-line">
          <Row label="Station name" value={radioCastConfig.stationName} />
          <Row label="Station logo" value={radioCastConfig.stationLogo} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        ok ? "bg-lime/10 text-lime" : "bg-base-panel text-ink-faint"
      }`}
    >
      {label}: {ok ? "Connected" : "Not configured"}
    </span>
  );
}
