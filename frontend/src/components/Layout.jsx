import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Flag,
  Layers3,
  ToggleLeft,
  FileText,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/feature-flags', label: 'Feature Flags', icon: Flag },
  { to: '/environments', label: 'Environments', icon: Layers3 },
  { to: '/overrides', label: 'Overrides', icon: ToggleLeft },
  { to: '/audit-logs', label: 'Audit Logs', icon: FileText },
  { to: '/profile', label: 'Profile', icon: User },
];

const Layout = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userEmail = useMemo(
    () => localStorage.getItem('user_email') || 'Authenticated user',
    [location.pathname]
  );

  const profileDetails = useMemo(() => {
    try {
      const stored = localStorage.getItem('profile_details');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [location.pathname]);

  const displayName = useMemo(() => {
    if (profileDetails?.displayName) {
      return profileDetails.displayName;
    }
    if (userEmail && userEmail.includes('@')) {
      return userEmail.split('@')[0];
    }
    return userEmail;
  }, [profileDetails, userEmail]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('profile_details');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-800 bg-slate-900/95 p-6 backdrop-blur-xl transition-transform lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-400">
              <Flag className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-semibold">Feature Flag Studio</p>
              <p className="text-sm text-slate-400">Control Center</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-10 flex w-full items-center gap-3 rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </aside>

        <div className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <button
                className="rounded-xl border border-slate-800 p-2 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm text-slate-400">Operations Overview</p>
                <h1 className="text-lg font-semibold">Feature Flag Management</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-xl border border-slate-800 p-2"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:flex">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
                  <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-slate-400">{userEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
