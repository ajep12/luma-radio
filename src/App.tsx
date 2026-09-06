import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import { AuthProvider } from "./context/AuthContext";
import { SiteLayout } from "./SiteLayout";

import { Home } from "./pages/Home";
import { ListenLive } from "./pages/ListenLive";
import { Schedule } from "./pages/Schedule";
import { Shows } from "./pages/Shows";
import { ShowDetail } from "./pages/ShowDetail";
import { Presenters } from "./pages/Presenters";
import { RecentlyPlayed } from "./pages/RecentlyPlayed";
import { Requests } from "./pages/Requests";
import { Search } from "./pages/Search";
import { Contact } from "./pages/Contact";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { NotFound } from "./pages/NotFound";

import { Login } from "./pages/account/Login";
import { Signup } from "./pages/account/Signup";
import { Profile } from "./pages/account/Profile";
import { AccountSettings } from "./pages/account/AccountSettings";

import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { ShowsAdmin } from "./pages/admin/ShowsAdmin";
import { PresentersAdmin } from "./pages/admin/PresentersAdmin";
import { ScheduleAdmin } from "./pages/admin/ScheduleAdmin";
import { Announcements } from "./pages/admin/Announcements";
import { AdvertisementsAdmin } from "./pages/admin/AdvertisementsAdmin";
import { Pages } from "./pages/admin/Pages";
import { Users } from "./pages/admin/Users";
import { Settings } from "./pages/admin/Settings";

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/listen" element={<ListenLive />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/shows/:showId" element={<ShowDetail />} />
              <Route path="/presenters" element={<Presenters />} />
              <Route path="/recently-played" element={<RecentlyPlayed />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/search" element={<Search />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              <Route path="/account/login" element={<Login />} />
              <Route path="/account/signup" element={<Signup />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/settings" element={<AccountSettings />} />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="shows" element={<ShowsAdmin />} />
              <Route path="presenters" element={<PresentersAdmin />} />
              <Route path="schedule" element={<ScheduleAdmin />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="advertisements" element={<AdvertisementsAdmin />} />
              <Route path="pages" element={<Pages />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}
