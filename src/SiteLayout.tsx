import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MiniPlayer } from "./components/layout/MiniPlayer";
import { AnnouncementBanner } from "./components/common/AnnouncementBanner";

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <AnnouncementBanner />

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <Footer />
      <MiniPlayer />
    </div>
  );
}
