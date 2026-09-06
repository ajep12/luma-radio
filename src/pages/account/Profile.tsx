import { Link } from "react-router-dom";

export function Profile() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl text-ink">Your profile</h1>
      <p className="mt-3 text-ink-faint">
        Sign in to see your saved shows, requests, and listening preferences here.
      </p>
      <Link
        to="/account/login"
        className="mt-6 inline-block rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal"
      >
        Log in
      </Link>
    </div>
  );
}
