import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Profile() {
  const { user, loading, signOut, isConfigured } = useAuth();
  const navigate = useNavigate();

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Your profile</h1>
        <p className="mt-3 text-ink-faint">
          Accounts aren't set up yet. Once Supabase is connected, you'll see your saved shows,
          requests, and details here.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <p className="text-ink-faint">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Your profile</h1>
        <p className="mt-3 text-ink-faint">Log in to see your account details.</p>
        <Link
          to="/account/login"
          className="mt-6 inline-block rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal"
        >
          Log in
        </Link>
      </div>
    );
  }

  const name = (user.user_metadata as { name?: string } | null)?.name;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl text-ink">{name ? `Hi, ${name}` : "Your profile"}</h1>
      <div className="mt-6 rounded-2xl border border-base-line bg-base-panel p-6">
        {name && (
          <div className="mb-3">
            <p className="text-xs text-ink-faint">Name</p>
            <p className="text-ink">{name}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-ink-faint">Email</p>
          <p className="text-ink">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to="/account/settings"
          className="rounded-full border border-base-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Account settings
        </Link>
        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="rounded-full border border-base-line px-5 py-2.5 text-sm text-ink-faint transition-colors hover:border-lime hover:text-lime"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
