
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("requests")
      .select(
        "id, name, song, artist, message, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error(
        "[Supabase] Failed to load Talkbacks:",
        fetchError
      );
      setError("Unable to load Talkbacks.");
      setLoading(false);
      return;
    }

    setRequests(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(
    id: string,
    status: string
  ) {
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
          className="rounded-xl border border-base-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-base-line bg-base-panel px-4 py-3 text-sm text-ink-faint">
          {error}
        </div>
      )}

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

