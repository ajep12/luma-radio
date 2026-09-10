
import { NavLink, Outlet, Link } from "react-router-dom";
import { Logo } from "../../components/layout/Logo";
import { useAuth } from "../../context/AuthContext";
import { isAdminEmail } from "../../config/admin";

const adminNav = [
  { label: "Overview", to: "/admin", end: true },
  { label: "Shows", to: "/admin/shows" },
  { label: "Presenters", to: "/admin/presenters" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Announcements", to: "/admin/announcements" },
  { label: "Advertisements", to: "/admin/advertisements" },
  { label: "Talkbacks", to: "/admin/requests" },
  { label: "Users", to: "/admin/users" },
  { label: "Station settings", to: "/admin/settings" },
];

export function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-ink-faint">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base text-center text-ink">
        <p>You need to log in to view this page.</p>
        <Link
          to="/account/login"
          className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!isAdminEmail(user.email)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base text-center text-ink">
        <p>You don't have access to this page.</p>
        <Link
          to="/"
          className="text-lime hover:underline"
        >
          Back to Luma Radio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base text-ink">
      <aside className="hidden w-64 shrink-0 border-r border-base-line bg-base-raised sm:flex sm:flex-col">
        <div className="border-b border-base-line px-5 py-5">
          <Logo />
          <p className="mt-1 text-xs text-ink-faint">
            Station admin
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-lime/10 text-lime"
                    : "text-ink-soft hover:bg-base-panel hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-base-line p-3">
          <NavLink
            to="/"
            className="block rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:text-ink"
          >
            ← Back to site
          </NavLink>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-base-line px-5 py-4 sm:hidden">
          <Logo />
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
