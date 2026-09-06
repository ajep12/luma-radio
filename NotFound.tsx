import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-lime">404</p>
      <h1 className="mt-3 font-display text-2xl text-ink">Page not found</h1>
      <p className="mt-2 text-ink-faint">The page you're looking for isn't on air.</p>
      <Link to="/" className="mt-6 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal">
        Back to Luma Radio
      </Link>
    </div>
  );
}
