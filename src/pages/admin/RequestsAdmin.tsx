
import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";

type Request = {
  id: string;
  name: string | null;
  song: string | null;
  artist: string | null;
  message: string | null;
  status: string;
  ip_address: string | null;
  created_at: string;
};

type BannedIp = {
  id: string;
  ip_address: string;
  reason: string | null;
  created_at: string;
};

const statuses = [
  "pending",
  "approved",
  "played",
  "rejected",
];

export function RequestsAdmin() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [bannedIps, setBannedIps] = useState<BannedIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [
      { data: requestData, error: requestError },
      { data: bannedData, error: bannedError },
    ] = await Promise.all([
      supabase
        .from("requests")
        .select(
          "id, name, song, artist, message, status, ip_address, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("banned_ips")
        .select("id, ip_address, reason, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (requestError) {
      console.error(
        "[Supabase] Failed to load Talkbacks:",
        requestError
      );
      setError("Unable to load Talkbacks.");
      setLoading(false);
      return;
    }

    if (bannedError) {
      console.error(
        "[Supabase] Failed to load banned IPs:",
        bannedError
      );
      setError("Unable to load IP bans.");
      setLoading(false);
      return;
    }

    setRequests(requestData ?? []);
    setBannedIps(bannedData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(id: string, status: string) {
    setError("");

    if (status === "played" || status === "rejected") {
      const { error: deleteError } = await supabase
        .from("requests")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error(
          "[Supabase] Failed to delete Talkback:",
          deleteError
        );
        setError("Unable to remove Talkback.");
        return;
      }

      setRequests((current) =>
        current.filter((request) => request.id !== id)
      );

      return;
    }

    const { error: updateError } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      console.error(
        "[Supabase] Failed to update Talkback:",
        updateError
      );
      setError("Unable to update Talkback.");
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );
  }

  async function deleteRequest(id: string) {
    if (!window.confirm("Delete this Talkback?")) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("requests")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "[Supabase] Failed to delete Talkback:",
        deleteError
      );
      setError("Unable to delete Talkback.");
      return;
    }

    setRequests((current) =>
      current.filter((request) => request.id !== id)
    );
  }

  async function banIp(ip: string | null) {
    if (!ip || ip === "unknown") {
      setError("This Talkback does not have a usable IP address.");
      return;
    }

    if (
      bannedIps.some(
        (banned) => banned.ip_address === ip
      )
    ) {
      setError("This IP address is already banned.");
      return;
    }

    const reason = window.prompt(
      `Reason for banning ${ip}?`
    );

    if (reason === null) {
      return;
    }

    setError("");

    const { data, error: banError } = await supabase
      .from("banned_ips")
      .insert({
        ip_address: ip,
        reason: reason.trim() || null,
      })
      .select("id, ip_address, reason, created_at")
      .single();

    if (banError) {
      console.error(
        "[Supabase] Failed to ban IP:",
        banError
      );
      setError("Unable to ban this IP address.");
      return;
    }

    setBannedIps((current) => [data, ...current]);
  }

  async function unbanIp(id: string) {
    if (!window.confirm("Unban this IP address?")) {
      return;
    }

    setError("");

    const { error: deleteError } = await supabase
      .from("banned_ips")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "[Supabase] Failed to unban IP:",
        deleteError
      );
      setError("Unable to unban this IP address.");
      return;
    }

    setBannedIps((current) =>
      current.filter((banned) => banned.id !== id)
    );
  }

  function isIpBanned(ip: string | null) {
    if (!ip) {
      return false;
    }

    return bannedIps.some(
      (banned) => banned.ip_address === ip
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-lime">
            Admin
          </p>

          <h1 className="mt-1 font-display text-4xl text-ink">
            Talkbacks
          </h1>

          <p className="mt-2 text-sm text-ink-faint">
            Manage messages and song requests sent to Luma.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          disabled={loading}
          className="rounded-xl border border-base-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-lime hover:text-lime disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-base-line bg-base-panel px-4 py-3 text-sm text-ink-faint">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-base-line bg-base-panel p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-ink">
              IP bans
            </h2>

            <p className="mt-1 text-sm text-ink-faint">
              These IP addresses are blocked from sending Talkbacks.
            </p>
          </div>

          <span className="rounded-full border border-base-line bg-base px-3 py-1 text-xs font-medium text-lime">
            {bannedIps.length}
          </span>
        </div>

        {bannedIps.length === 0 ? (
          <p className="mt-5 text-sm text-ink-faint">
            No IP addresses are currently banned.
          </p>
        ) : (
          <div className="mt-5 space-y-2">
            {bannedIps.map((banned) => (
              <div
                key={banned.id}
                className="flex flex-col gap-3 rounded-xl border border-base-line bg-base px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-sm text-ink">
                    {banned.ip_address}
                  </p>

                  {banned.reason && (
                    <p className="mt-1 text-xs text-ink-faint">
                      {banned.reason}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => unbanIp(banned.id)}
                  className="rounded-lg border border-lime/30 px-3 py-2 text-xs font-medium text-lime transition-colors hover:border-lime"
                >
                  Unban
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-10 rounded-2xl border border-base-line bg-base-panel p-8 text-center text-sm text-ink-faint">
          Loading Talkbacks...
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-base-line bg-base-panel p-8 text-center">
          <p className="font-display text-xl text-ink">
            No Talkbacks yet
          </p>

          <p className="mt-2 text-sm text-ink-faint">
            New messages and requests will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-base-line bg-base-panel p-5 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div className="min-w-0">
                  {request.song || request.artist ? (
                    <div>
                      <h2 className="font-display text-xl text-ink">
                        {request.song || "Unknown song"}
                      </h2>

                      {request.artist && (
                        <p className="mt-1 text-sm text-ink-faint">
                          {request.artist}
                        </p>
                      )}
                    </div>
                  ) : (
                    <h2 className="font-display text-xl text-ink">
                      Talkback message
                    </h2>
                  )}

                  <p className="mt-2 text-xs text-ink-faint">
                    {request.name
                      ? `From ${request.name}`
                      : "Anonymous"}{" "}
                    · {formatDate(request.created_at)}
                  </p>

                  {request.ip_address && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-base-line bg-base px-2.5 py-1 font-mono text-xs text-ink-faint">
                        {request.ip_address}
                      </span>

                      {isIpBanned(request.ip_address) ? (
                        <span className="rounded-lg border border-red-500/30 bg-red-500/5 px-2.5 py-1 text-xs font-medium text-red-400">
                          IP banned
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            banIp(request.ip_address)
                          }
                          className="rounded-lg border border-red-500/30 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/5"
                        >
                          Ban IP
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <span
                  className={`h-fit rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                    request.status === "pending"
                      ? "border-yellow-500/30 text-yellow-400"
                      : request.status === "approved"
                        ? "border-lime/30 text-lime"
                        : request.status === "played"
                          ? "border-blue-500/30 text-blue-400"
                          : "border-red-500/30 text-red-400"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              {request.message && (
                <div className="mt-5 rounded-xl border border-base-line bg-base px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-ink-faint">
                    {request.message}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      updateStatus(request.id, status)
                    }
                    disabled={request.status === status}
                    className="rounded-lg border border-base-line px-3 py-2 text-xs font-medium capitalize text-ink transition-colors hover:border-lime hover:text-lime disabled:cursor-default disabled:opacity-40"
                  >
                    {status}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    deleteRequest(request.id)
                  }
                  className="ml-auto rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/5"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
