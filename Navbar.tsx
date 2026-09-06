import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { mainNav } from "../../config/site";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-base-line/80 bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? "text-lime" : "text-ink-soft hover:text-ink"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-base-panel hover:text-ink sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            to={user ? "/account/profile" : "/account/login"}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-base-panel hover:text-ink sm:flex"
            aria-label={user ? "Your account" : "Log in"}
          >
            {user ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[11px] font-semibold text-coal">
                {(user.user_metadata as { name?: string } | null)?.name?.[0]?.toUpperCase() ??
                  user.email?.[0]?.toUpperCase() ??
                  "U"}
              </span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8.2" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M4.8 19c1.2-3 3.9-4.6 7.2-4.6s6 1.6 7.2 4.6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </Link>
          <Link
            to="/listen"
            className="hidden items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal transition-transform hover:scale-[1.03] sm:flex"
          >
            Listen Live
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
