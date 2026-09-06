import { NavLink } from "react-router-dom";
import { mainNav } from "../../config/site";
import { useAuth } from "../../context/AuthContext";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-base lg:hidden">
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="font-display text-lg text-ink">Menu</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `border-b border-base-line py-4 font-display text-2xl ${
                isActive ? "text-lime" : "text-ink"
              }`
            }
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="/search"
          onClick={onClose}
          className="border-b border-base-line py-4 text-base text-ink-soft"
        >
          Search
        </NavLink>
        <NavLink
          to={user ? "/account/profile" : "/account/login"}
          onClick={onClose}
          className="border-b border-base-line py-4 text-base text-ink-soft"
        >
          {user ? "Account" : "Log in"}
        </NavLink>
      </nav>

      <div className="p-4">
        <NavLink
          to="/listen"
          onClick={onClose}
          className="flex w-full items-center justify-center rounded-full bg-lime py-3.5 text-sm font-semibold text-coal"
        >
          Listen Live
        </NavLink>
      </div>
    </div>
  );
}
