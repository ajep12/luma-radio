import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`} aria-label="Luma Radio, home">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-lime">
        <span className="absolute inset-0 rounded-full bg-lime blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
        <span className="relative h-2 w-2 rounded-full bg-base" />
      </span>
      <span className="font-display text-lg tracking-tight text-ink">Luma Radio</span>
    </Link>
  );
}
