import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "../../components/layout/Logo";

const adminNav = [
  { label: "Overview", to: "/admin", end: true },
  { label: "Shows", to: "/admin/shows" },
  { label: "Presenters", to: "/admin/presenters" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Announcements", to: "/admin/announcements" },
  { label: "Advertisements", to: "/admin/advertisements" },
  { label: "Pages", to: "/admin/pages" },
  { label: "Users", to: "/admin/users" },
  { label: "Station settings", to: "/admin/settings" },
];

/**
 * The admin dashboard is intentionally a separate shell from the public
 * site — no public navbar/footer, no shared player chrome. It's a frontend
 * scaffold: every screen here is ready to be wired up to real data (station
 * settings, Supabase-backed content, etc.) later.
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-base text-ink">
      <aside className="hidden w-64 shrink-0 border-r border-base-line bg-base-raised sm:flex sm:flex-col">
        <div className="border-b border-base-line px-5 py-5">
          <Logo />
          <p className="mt-1 text-xs text-ink-faint">Station admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-lime/10 text-lime" : "text-ink-soft hover:bg-base-panel hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-base-line p-3">
          <NavLink to="/" className="block rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:text-ink">
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
